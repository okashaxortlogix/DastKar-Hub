<?php

namespace App\Services\Discovery;

use App\Models\Product;
use App\Models\SellerProfile;
use Carbon\Carbon;

class NewSellerBoostService
{
    private bool $enabled;
    private int $durationDays;
    private float $maxBoostScore;
    private string $decayType;
    private array $allowedVerificationStatuses;
    private array $consistencyConfig;

    public function __construct()
    {
        $this->enabled = (bool) config('discovery.new_seller_boost.enabled', true);
        $this->durationDays = (int) config('discovery.new_seller_boost.duration_days', 30);
        $this->maxBoostScore = (float) config('discovery.new_seller_boost.max_boost_score', 0.20);
        $this->decayType = config('discovery.new_seller_boost.decay_type', 'linear');
        $this->allowedVerificationStatuses = config(
            'discovery.new_seller_boost.allowed_verification_statuses',
            ['basic', 'verified', 'established']
        );
        $this->consistencyConfig = config('discovery.new_seller_boost.consistency', [
            'enabled' => true,
            'min_on_time_delivery_rate' => 90.0,
            'max_cancellation_rate' => 5.0,
            'require_in_stock_products' => true,
        ]);
    }

    /**
     * Determine if a seller qualifies for the New Seller Boost.
     */
    public function isEligible(SellerProfile $seller): bool
    {
        if (!$this->enabled) {
            return false;
        }

        // Account must be active
        if ($seller->seller_status !== 'active') {
            return false;
        }

        // Verification status must meet criteria
        if (!in_array($seller->verification_status, $this->allowedVerificationStatuses, true)) {
            return false;
        }

        // Must have at least one published product
        $hasPublished = Product::where('seller_id', $seller->id)
            ->where('status', 'published')
            ->exists();

        if (!$hasPublished) {
            return false;
        }

        // Check if within the boost window (1st complete month / 30 days)
        $startDate = $this->getBoostStartDate($seller);
        if (!$startDate) {
            return false;
        }

        $endDate = $seller->new_seller_boost_ends_at
            ?? $startDate->copy()->addDays($this->durationDays);

        return Carbon::now()->lessThanOrEqualTo($endDate);
    }

    /**
     * Check if a seller is consistent (active in-stock items, healthy fulfillment & cancellation rates).
     */
    public function isConsistent(SellerProfile $seller): bool
    {
        if (!($this->consistencyConfig['enabled'] ?? true)) {
            return true;
        }

        // Account status must be active
        if ($seller->seller_status !== 'active') {
            return false;
        }

        // Cancellation rate check (must not exceed max allowed, default 5.0%)
        $maxCancellation = (float) ($this->consistencyConfig['max_cancellation_rate'] ?? 5.0);
        if ($seller->cancellation_rate !== null && $seller->cancellation_rate > $maxCancellation) {
            return false;
        }

        // On-time delivery rate check (must meet minimum required, default 90.0%)
        $minDeliveryRate = (float) ($this->consistencyConfig['min_on_time_delivery_rate'] ?? 90.0);
        if ($seller->on_time_delivery_rate !== null && $seller->on_time_delivery_rate < $minDeliveryRate) {
            return false;
        }

        // Must maintain published products with stock available
        if ($this->consistencyConfig['require_in_stock_products'] ?? true) {
            $hasInStock = Product::where('seller_id', $seller->id)
                ->where('status', 'published')
                ->where('stock_quantity', '>', 0)
                ->exists();

            if (!$hasInStock) {
                return false;
            }
        }

        return true;
    }

    /**
     * Calculate boost score (0.0 to maxBoostScore).
     * If the artisan is consistent during their 1st month, their profile retains full 20% boost.
     * If inconsistent (out of stock, poor fulfillment), the boost gradually decays towards 0.00.
     */
    public function calculateBoostScore(SellerProfile $seller): float
    {
        if (!$this->isEligible($seller)) {
            return 0.0;
        }

        $startDate = $this->getBoostStartDate($seller);
        if (!$startDate) {
            return 0.0;
        }

        $now = Carbon::now();
        $totalSeconds = $this->durationDays * 86400;
        $elapsedSeconds = max(0, $now->diffInSeconds($startDate, false) * -1);

        if ($elapsedSeconds >= $totalSeconds) {
            return 0.0;
        }

        $fractionRemaining = max(0.0, 1.0 - ($elapsedSeconds / $totalSeconds));

        // Consistent seller maintains full 20% (0.20) boost throughout the 1st complete month
        if ($this->isConsistent($seller)) {
            return round($this->maxBoostScore, 4);
        }

        // Inconsistent seller suffers decay ("slowly slowly disappears")
        $inconsistentPenalty = 0.50;
        $decayFactor = ($this->decayType === 'exponential')
            ? pow($fractionRemaining, 2)
            : $fractionRemaining;

        return round($this->maxBoostScore * $decayFactor * $inconsistentPenalty, 4);
    }

    /**
     * Get remaining days in the boost window.
     */
    public function getRemainingBoostDays(SellerProfile $seller): int
    {
        if (!$this->isEligible($seller)) {
            return 0;
        }

        $startDate = $this->getBoostStartDate($seller);
        if (!$startDate) {
            return 0;
        }

        $endDate = $seller->new_seller_boost_ends_at
            ?? $startDate->copy()->addDays($this->durationDays);

        $remaining = Carbon::now()->diffInDays($endDate, false);

        return max(0, (int) ceil($remaining));
    }

    /**
     * Detailed boost & consistency status payload for dashboard and API surfaces.
     */
    public function getBoostStatus(SellerProfile $seller): array
    {
        $isEligible = $this->isEligible($seller);
        $isConsistent = $this->isConsistent($seller);
        $boostScore = $this->calculateBoostScore($seller);
        $remainingDays = $this->getRemainingBoostDays($seller);
        $startDate = $this->getBoostStartDate($seller);
        $endDate = $seller->new_seller_boost_ends_at
            ?? ($startDate ? $startDate->copy()->addDays($this->durationDays) : null);

        $hasInStock = Product::where('seller_id', $seller->id)
            ->where('status', 'published')
            ->where('stock_quantity', '>', 0)
            ->exists();

        $maxCancellation = (float) ($this->consistencyConfig['max_cancellation_rate'] ?? 5.0);
        $minDeliveryRate = (float) ($this->consistencyConfig['min_on_time_delivery_rate'] ?? 90.0);

        $cancellationRate = $seller->cancellation_rate ?? 0.0;
        $onTimeRate = $seller->on_time_delivery_rate ?? 100.0;

        return [
            'is_boosted' => $isEligible && $boostScore > 0,
            'boost_score' => $boostScore,
            'boost_percent' => (int) round($this->maxBoostScore * 100),
            'current_boost_percent' => (int) round(($boostScore / max(0.01, $this->maxBoostScore)) * 20),
            'is_consistent' => $isConsistent,
            'remaining_days' => $remainingDays,
            'duration_days' => $this->durationDays,
            'started_at' => $startDate?->toIso8601String(),
            'ends_at' => $endDate?->toIso8601String(),
            'metrics' => [
                'has_in_stock' => $hasInStock,
                'cancellation_rate' => $cancellationRate,
                'cancellation_ok' => $cancellationRate <= $maxCancellation,
                'on_time_delivery_rate' => $onTimeRate,
                'delivery_ok' => $onTimeRate >= $minDeliveryRate,
            ],
        ];
    }

    /**
     * Get the boost start reference date.
     */
    private function getBoostStartDate(SellerProfile $seller): ?Carbon
    {
        if ($seller->new_seller_boost_started_at) {
            return Carbon::parse($seller->new_seller_boost_started_at);
        }

        if ($seller->onboarding_completed_at) {
            return Carbon::parse($seller->onboarding_completed_at);
        }

        return $seller->created_at ? Carbon::parse($seller->created_at) : null;
    }
}
