<?php

namespace App\Services\Discovery;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ProductRankingService
{
    private NewSellerBoostService $boostService;
    private array $weights;
    private int $freshnessDays;
    private int $maxProductsPerSeller;
    private float $outOfStockMultiplier;

    public function __construct(NewSellerBoostService $boostService)
    {
        $this->boostService = $boostService;
        $this->weights = config('discovery.weights', [
            'relevance' => 0.30,
            'reviews' => 0.15,
            'quality' => 0.10,
            'engagement' => 0.10,
            'conversion' => 0.10,
            'seller_trust' => 0.10,
            'freshness' => 0.05,
            'availability' => 0.10,
        ]);
        $this->freshnessDays = (int) config('discovery.freshness_window_days', 30);
        $this->maxProductsPerSeller = (int) config('discovery.max_products_per_seller', 3);
        $this->outOfStockMultiplier = (float) config('discovery.out_of_stock_multiplier', 0.10);
    }

    /**
     * Compute ranking score and detailed signal vector for a single product.
     *
     * @param Product $product Eager-loaded product
     * @param string|null $query Search term if applicable
     * @return array{score: float, signals: array<string, float>}
     */
    public function calculateScore(Product $product, ?string $query = null): array
    {
        $seller = $product->seller;

        // 1. Relevance signal (0.0 to 1.0)
        $relevance = $this->calculateRelevance($product, $query);

        // 2. Product Quality signal (0.0 to 1.0)
        $quality = $this->calculateQuality($product);

        // 3. Reviews signal with Bayesian smoothing (0.0 to 1.0)
        $reviews = $this->calculateReviewsSignal($product);

        // 4. Engagement signal (clicks, wishlists) (0.0 to 1.0)
        $engagement = $this->calculateEngagementSignal($product);

        // 5. Conversion signal (0.0 to 1.0)
        $conversion = $this->calculateConversionSignal($product);

        // 6. Seller Trust signal (0.0 to 1.0)
        $sellerTrust = $this->calculateSellerTrustSignal($seller);

        // 7. Freshness signal (0.0 to 1.0)
        $freshness = $this->calculateFreshnessSignal($product);

        // 8. Availability multiplier (1.0 or penalized)
        $availability = $product->stock_quantity > 0 ? 1.0 : $this->outOfStockMultiplier;

        // 9. New Seller Boost (0.0 to max_boost_score)
        $rawBoost = $seller ? $this->boostService->calculateBoostScore($seller) : 0.0;

        // CRITICAL RULE 17: Relevance protection.
        // A new seller boost must NOT override major relevance mismatch.
        // If query is provided, scale boost by relevance so irrelevant items don't rise to top.
        $effectiveBoost = $query !== null && $query !== ''
            ? round($rawBoost * $relevance, 4)
            : $rawBoost;

        // Composite base score (weighted sum)
        $baseScore = ($this->weights['relevance'] * $relevance)
            + ($this->weights['reviews'] * $reviews)
            + ($this->weights['quality'] * $quality)
            + ($this->weights['engagement'] * $engagement)
            + ($this->weights['conversion'] * $conversion)
            + ($this->weights['seller_trust'] * $sellerTrust)
            + ($this->weights['freshness'] * $freshness)
            + ($this->weights['availability'] * $availability);

        // Add boost & apply availability gate
        $finalScore = round(($baseScore + $effectiveBoost) * $availability, 4);

        return [
            'score' => $finalScore,
            'signals' => [
                'relevance' => round($relevance, 4),
                'quality' => round($quality, 4),
                'reviews' => round($reviews, 4),
                'engagement' => round($engagement, 4),
                'conversion' => round($conversion, 4),
                'seller_trust' => round($sellerTrust, 4),
                'freshness' => round($freshness, 4),
                'availability' => round($availability, 4),
                'new_seller_boost' => round($effectiveBoost, 4),
            ],
        ];
    }

    /**
     * Rank a collection of products, apply seller diversity limits, and assign ranking scores.
     *
     * @param Collection<int, Product> $products
     * @param string|null $query
     * @param int|null $maxPerSeller
     * @return Collection<int, Product>
     */
    public function rankProducts(Collection $products, ?string $query = null, ?int $maxPerSeller = null): Collection
    {
        $limitPerSeller = $maxPerSeller ?? $this->maxProductsPerSeller;

        // Score each product
        $scored = $products->map(function (Product $product) use ($query) {
            $analysis = $this->calculateScore($product, $query);
            $product->setAttribute('_ranking_score', $analysis['score']);
            $product->setAttribute('_ranking_signals', $analysis['signals']);
            return $product;
        });

        // Sort descending by score
        $sorted = $scored->sortByDesc('_ranking_score')->values();

        // Apply seller diversity rotation
        return $this->applySellerDiversity($sorted, $limitPerSeller);
    }

    /**
     * Seller Diversity filter: Rotates products so that no single seller dominates top positions.
     */
    public function applySellerDiversity(Collection $sortedProducts, int $maxPerSeller): Collection
    {
        if ($sortedProducts->isEmpty() || $maxPerSeller <= 0) {
            return $sortedProducts;
        }

        $result = collect();
        $deferred = collect();
        $sellerCounts = [];

        foreach ($sortedProducts as $product) {
            $sellerId = $product->seller_id;
            $count = $sellerCounts[$sellerId] ?? 0;

            if ($count < $maxPerSeller) {
                $result->push($product);
                $sellerCounts[$sellerId] = $count + 1;
            } else {
                $deferred->push($product);
            }
        }

        // Append deferred products after diverse front page representation
        return $result->concat($deferred);
    }

    private function calculateRelevance(Product $product, ?string $query): float
    {
        if ($query === null || trim($query) === '') {
            return 1.0; // Neutral baseline when browsing
        }

        $query = mb_strtolower(trim($query));
        $terms = array_filter(explode(' ', $query));
        if (empty($terms)) {
            return 1.0;
        }

        $title = mb_strtolower($product->title ?? '');
        $desc = mb_strtolower($product->description ?? '');
        $materials = mb_strtolower($product->materials ?? '');
        $categoryName = mb_strtolower($product->category->name ?? '');
        $sellerName = mb_strtolower($product->seller->business_name ?? '');
        $sellerCity = mb_strtolower($product->seller->location_city ?? '');
        $craftDesc = mb_strtolower($product->seller->craft_description ?? '');

        $matchedTerms = 0;
        $titleBoost = 0;

        foreach ($terms as $term) {
            $found = false;
            if (str_contains($title, $term)) {
                $found = true;
                $titleBoost += 0.4;
            }
            if (str_contains($categoryName, $term)) {
                $found = true;
                $titleBoost += 0.25;
            }
            if (str_contains($materials, $term) || str_contains($desc, $term)) {
                $found = true;
            }
            if (str_contains($sellerName, $term) || str_contains($sellerCity, $term) || str_contains($craftDesc, $term)) {
                $found = true;
            }

            if ($found) {
                $matchedTerms++;
            }
        }

        $termCoverage = $matchedTerms / count($terms);
        $relevance = min(1.0, ($termCoverage * 0.6) + min(0.4, $titleBoost));

        return max(0.05, $relevance);
    }

    private function calculateQuality(Product $product): float
    {
        $quality = 0.0;

        // Image count (up to 4 images = +0.30)
        $imgCount = $product->images ? $product->images->count() : ($product->primaryImage ? 1 : 0);
        $quality += min(0.30, $imgCount * 0.075);

        // Description depth (+0.25)
        $descLen = strlen($product->description ?? '');
        if ($descLen > 300) {
            $quality += 0.25;
        } elseif ($descLen > 100) {
            $quality += 0.15;
        }

        // Materials & dimensions (+0.25)
        if (!empty($product->materials)) {
            $quality += 0.15;
        }
        if (!empty($product->dimensions)) {
            $quality += 0.10;
        }

        // Care instructions & variants/customization (+0.20)
        if (!empty($product->care_instructions)) {
            $quality += 0.10;
        }
        if ($product->is_customizable || ($product->variants && $product->variants->count() > 0)) {
            $quality += 0.10;
        }

        return min(1.0, max(0.1, $quality));
    }

    private function calculateReviewsSignal(Product $product): float
    {
        $count = $product->rating_count ?? 0;
        $rating = $product->rating_average ?? 5.0;

        // Cold start Bayesian adjustment
        // C = 4.5 prior mean, m = 3 prior weight
        $priorMean = 4.5;
        $priorWeight = 3;

        $smoothedRating = (($count * $rating) + ($priorWeight * $priorMean)) / ($count + $priorWeight);

        return min(1.0, max(0.0, $smoothedRating / 5.0));
    }

    private function calculateEngagementSignal(Product $product): float
    {
        $clicks = $product->clicks_count ?? 0;
        $wishlists = $product->wishlist_count ?? 0;
        $impressions = $product->impressions_count ?? 0;

        // Cold-start default if zero activity
        if ($clicks === 0 && $wishlists === 0 && $impressions === 0) {
            return 0.40;
        }

        $effectiveEngagement = $clicks + ($wishlists * 2.5);
        // Logarithmic normalization against a benchmark of 500 interactions
        $score = log(1 + $effectiveEngagement) / log(1 + 500);

        return min(1.0, max(0.1, $score));
    }

    private function calculateConversionSignal(Product $product): float
    {
        $sales = $product->sales_count ?? 0;
        $impressions = $product->impressions_count ?? 0;

        if ($impressions < 5 && $sales === 0) {
            return 0.40; // Cold-start neutral default
        }

        // Sample-damped conversion rate (Laplace smoothing)
        $rate = ($sales + 1) / max(10, ($impressions / 8) + 15);

        return min(1.0, max(0.1, $rate));
    }

    private function calculateSellerTrustSignal(?\App\Models\SellerProfile $seller): float
    {
        if (!$seller) {
            return 0.50;
        }

        $statusTrust = match ($seller->verification_status) {
            'established' => 1.00,
            'verified' => 0.85,
            'basic' => 0.65,
            default => 0.40,
        };

        // Adjust slightly with fulfillment & cancellation reliability
        $onTimeFactor = ($seller->on_time_delivery_rate ?? 98.0) / 100.0;
        $cancellationPenalty = ($seller->cancellation_rate ?? 1.0) / 50.0;

        $compositeTrust = ($statusTrust * 0.85) + ($onTimeFactor * 0.15) - $cancellationPenalty;

        return min(1.0, max(0.2, $compositeTrust));
    }

    private function calculateFreshnessSignal(Product $product): float
    {
        $created = $product->published_at ?? $product->created_at;
        if (!$created) {
            return 0.20;
        }

        $daysOld = Carbon::now()->diffInDays(Carbon::parse($created));
        if ($daysOld >= $this->freshnessDays) {
            return 0.0;
        }

        return max(0.0, 1.0 - ($daysOld / $this->freshnessDays));
    }
}
