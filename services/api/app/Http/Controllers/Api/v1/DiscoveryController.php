<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Discovery\DiscoveryEventService;
use App\Services\Discovery\MakerRankingService;
use App\Services\Discovery\ProductRankingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiscoveryController extends Controller
{
    private ProductRankingService $rankingService;
    private MakerRankingService $makerRankingService;
    private DiscoveryEventService $eventService;

    public function __construct(
        ProductRankingService $rankingService,
        MakerRankingService $makerRankingService,
        DiscoveryEventService $eventService
    ) {
        $this->rankingService = $rankingService;
        $this->makerRankingService = $makerRankingService;
        $this->eventService = $eventService;
    }

    /**
     * Trending Products: high engagement + conversion with seller diversity.
     */
    public function trending(Request $request): JsonResponse
    {
        $limit = min(24, max(4, (int) $request->input('limit', 8)));

        $products = Product::with(['seller', 'primaryImage', 'images', 'category'])
            ->where('status', 'published')
            ->where('stock_quantity', '>', 0)
            ->get();

        $ranked = $this->rankingService->rankProducts($products, null, 2)->take($limit);

        return response()->json([
            'data' => $ranked->values(),
            'meta' => [
                'total' => $ranked->count(),
                'surface' => 'trending',
            ],
        ]);
    }

    /**
     * New Arrivals: freshness-based with new-seller boost representation.
     */
    public function newArrivals(Request $request): JsonResponse
    {
        $limit = min(24, max(4, (int) $request->input('limit', 8)));

        $products = Product::with(['seller', 'primaryImage', 'images', 'category'])
            ->where('status', 'published')
            ->where('stock_quantity', '>', 0)
            ->orderBy('created_at', 'desc')
            ->take(40)
            ->get();

        $ranked = $this->rankingService->rankProducts($products, null, 2)->take($limit);

        return response()->json([
            'data' => $ranked->values(),
            'meta' => [
                'total' => $ranked->count(),
                'surface' => 'new_arrivals',
            ],
        ]);
    }

    /**
     * Best Sellers: order volume and high satisfaction.
     */
    public function bestSellers(Request $request): JsonResponse
    {
        $limit = min(24, max(4, (int) $request->input('limit', 8)));

        $products = Product::with(['seller', 'primaryImage', 'images', 'category'])
            ->where('status', 'published')
            ->where('stock_quantity', '>', 0)
            ->orderBy('sales_count', 'desc')
            ->orderBy('rating_average', 'desc')
            ->take(30)
            ->get();

        $ranked = $this->rankingService->rankProducts($products, null, 2)->take($limit);

        return response()->json([
            'data' => $ranked->values(),
            'meta' => [
                'total' => $ranked->count(),
                'surface' => 'best_sellers',
            ],
        ]);
    }

    /**
     * Recommended: personalized / discovery balanced ranking.
     */
    public function recommended(Request $request): JsonResponse
    {
        $limit = min(24, max(4, (int) $request->input('limit', 12)));
        $categorySlug = $request->input('category');

        $query = Product::with(['seller', 'primaryImage', 'images', 'category'])
            ->where('status', 'published');

        if ($categorySlug) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        $products = $query->take(60)->get();
        $ranked = $this->rankingService->rankProducts($products, null, 3)->take($limit);

        return response()->json([
            'data' => $ranked->values(),
            'meta' => [
                'total' => $ranked->count(),
                'surface' => 'recommended',
            ],
        ]);
    }

    /**
     * Meet New Makers: showcasing newly verified Pakistani craft studios.
     */
    public function newMakers(Request $request): JsonResponse
    {
        $limit = min(12, max(2, (int) $request->input('limit', 6)));
        $newMakers = $this->makerRankingService->getNewMakers($limit);

        // Fallback to top discoverable if new makers pool is empty
        if ($newMakers->isEmpty()) {
            $newMakers = $this->makerRankingService->getDiscoverableMakers($limit);
        }

        return response()->json([
            'data' => $newMakers->values(),
            'meta' => [
                'total' => $newMakers->count(),
                'surface' => 'new_makers',
            ],
        ]);
    }

    /**
     * Public / Admin discovery configuration summary.
     */
    public function config(): JsonResponse
    {
        return response()->json([
            'data' => [
                'new_seller_boost_enabled' => (bool) config('discovery.new_seller_boost.enabled', true),
                'new_seller_boost_days' => (int) config('discovery.new_seller_boost.duration_days', 30),
                'max_boost_score' => (float) config('discovery.new_seller_boost.max_boost_score', 0.20),
                'max_products_per_seller' => (int) config('discovery.max_products_per_seller', 3),
                'freshness_window_days' => (int) config('discovery.freshness_window_days', 30),
                'weights' => config('discovery.weights'),
            ],
        ]);
    }

    /**
     * Track a discovery interaction (impression, click, wishlist).
     */
    public function recordEvent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_type' => 'required|string|max:50',
            'surface' => 'required|string|max:50',
            'product_id' => 'nullable|integer|exists:products,id',
            'seller_id' => 'nullable|integer|exists:seller_profiles,id',
            'category_id' => 'nullable|integer|exists:categories,id',
            'position' => 'nullable|integer|min:1|max:500',
            'session_id' => 'nullable|string|max:100',
            'metadata' => 'nullable|array',
        ]);

        $userId = $request->user()?->id;

        $event = $this->eventService->recordEvent(
            $validated['event_type'],
            $validated['surface'],
            $validated['product_id'] ?? null,
            $validated['seller_id'] ?? null,
            $validated['category_id'] ?? null,
            $validated['position'] ?? null,
            $userId,
            $validated['session_id'] ?? null,
            $validated['metadata'] ?? null
        );

        return response()->json([
            'data' => [
                'recorded' => $event !== null,
                'event_id' => $event?->id,
            ],
        ]);
    }
}
