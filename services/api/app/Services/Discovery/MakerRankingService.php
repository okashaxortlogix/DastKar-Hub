<?php

namespace App\Services\Discovery;

use App\Models\SellerProfile;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class MakerRankingService
{
    private NewSellerBoostService $boostService;

    public function __construct(NewSellerBoostService $boostService)
    {
        $this->boostService = $boostService;
    }

    /**
     * Compute a ranking score for a maker/artisan studio.
     */
    public function calculateMakerScore(SellerProfile $seller): float
    {
        // 1. Verification tier score
        $tierScore = match ($seller->verification_status) {
            'established' => 1.0,
            'verified' => 0.85,
            'basic' => 0.65,
            default => 0.40,
        };

        // 2. Rating Bayesian score
        $ratingCount = $seller->rating_count ?? 0;
        $ratingAvg = $seller->rating_average ?? 5.0;
        $priorMean = 4.5;
        $priorWeight = 3;
        $smoothedRating = (($ratingCount * $ratingAvg) + ($priorWeight * $priorMean)) / ($ratingCount + $priorWeight);
        $ratingScore = $smoothedRating / 5.0;

        // 3. Fulfillment & Reliability
        $onTimeScore = ($seller->on_time_delivery_rate ?? 98.0) / 100.0;
        $cancellationPenalty = ($seller->cancellation_rate ?? 1.0) / 50.0;
        $reliability = max(0.2, $onTimeScore - $cancellationPenalty);

        // 4. Activity volume (log-scaled completed orders)
        $orders = $seller->completed_orders ?? 0;
        $activityScore = min(1.0, log(1 + $orders) / log(1 + 50));

        // 5. New Maker Boost (if eligible)
        $boostScore = $this->boostService->calculateBoostScore($seller);

        $composite = ($tierScore * 0.35)
            + ($ratingScore * 0.25)
            + ($reliability * 0.20)
            + ($activityScore * 0.20)
            + ($boostScore * 0.5);

        return round(min(1.0, $composite), 4);
    }

    /**
     * Fetch top discoverable makers.
     */
    public function getDiscoverableMakers(int $limit = 12): Collection
    {
        return SellerProfile::with('user')
            ->where('seller_status', 'active')
            ->whereHas('products', function ($q) {
                $q->where('status', 'published');
            })
            ->withCount(['products' => function ($q) {
                $q->where('status', 'published');
            }])
            ->get()
            ->sortByDesc(fn (SellerProfile $s) => $this->calculateMakerScore($s))
            ->values()
            ->take($limit);
    }

    /**
     * Fetch newly onboarded qualifying makers ("Meet New Makers").
     */
    public function getNewMakers(int $limit = 6): Collection
    {
        $durationDays = (int) config('discovery.new_seller_boost.duration_days', 30);
        $thresholdDate = Carbon::now()->subDays($durationDays);

        return SellerProfile::with('user')
            ->where('seller_status', 'active')
            ->where(function ($q) use ($thresholdDate) {
                $q->where('new_seller_boost_ends_at', '>=', Carbon::now())
                  ->orWhere('onboarding_completed_at', '>=', $thresholdDate)
                  ->orWhere('created_at', '>=', $thresholdDate);
            })
            ->whereHas('products', function ($q) {
                $q->where('status', 'published');
            })
            ->withCount(['products' => function ($q) {
                $q->where('status', 'published');
            }])
            ->get()
            ->filter(fn (SellerProfile $s) => $this->boostService->isEligible($s))
            ->sortByDesc(fn (SellerProfile $s) => $this->boostService->calculateBoostScore($s))
            ->values()
            ->take($limit);
    }
}
