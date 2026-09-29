<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\User;
use App\Services\Discovery\NewSellerBoostService;
use App\Services\Discovery\ProductRankingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiscoveryRankingTest extends TestCase
{
    use RefreshDatabase;

    private NewSellerBoostService $boostService;
    private ProductRankingService $rankingService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->boostService = app(NewSellerBoostService::class);
        $this->rankingService = app(ProductRankingService::class);
    }

    private function createSeller(array $attrs = []): SellerProfile
    {
        $user = User::factory()->create(['role' => 'seller']);
        return SellerProfile::create(array_merge([
            'user_id' => $user->id,
            'business_name' => 'Artisan Test Studio',
            'slug' => 'artisan-test-' . uniqid(),
            'bio' => 'Preserving traditional crafts.',
            'craft_description' => 'Blue pottery ceramics',
            'location_city' => 'Multan',
            'location_region' => 'Punjab',
            'verification_status' => 'verified',
            'seller_status' => 'active',
            'rating_average' => 5.0,
            'rating_count' => 0,
            'completed_orders' => 0,
            'total_sales' => 0.0,
        ], $attrs));
    }

    private function createProduct(SellerProfile $seller, Category $category, array $attrs = []): Product
    {
        return Product::create(array_merge([
            'seller_id' => $seller->id,
            'category_id' => $category->id,
            'title' => 'Multani Blue Pottery Bowl',
            'slug' => 'multani-pottery-bowl-' . uniqid(),
            'description' => 'A detailed authentic description of this handcrafted ceramic piece made in Multan.',
            'base_price' => 2500.00,
            'status' => 'published',
            'stock_quantity' => 10,
            'production_days' => 2,
            'materials' => 'Natural clay, cobalt glaze',
            'dimensions' => '8 in diameter',
            'rating_average' => 5.0,
            'rating_count' => 0,
            'sales_count' => 0,
            'impressions_count' => 10,
            'clicks_count' => 2,
        ], $attrs));
    }

    /**
     * Scenario 1: A newly verified seller with published product is eligible for 20% boost.
     */
    public function test_scenario_1_new_verified_seller_is_eligible_for_boost(): void
    {
        $seller = $this->createSeller([
            'verification_status' => 'verified',
            'new_seller_boost_started_at' => Carbon::now()->subDays(2),
            'new_seller_boost_ends_at' => Carbon::now()->addDays(28),
        ]);

        $category = Category::firstOrCreate(['slug' => 'test-cat'], ['name' => 'Test Cat', 'status' => 'active']);
        $this->createProduct($seller, $category);

        $this->assertTrue($this->boostService->isEligible($seller));
        $this->assertTrue($this->boostService->isConsistent($seller));
        $score = $this->boostService->calculateBoostScore($seller);
        // Consistent seller maintains full 20% boost (0.20) for 1st complete month
        $this->assertEquals(0.20, $score);
    }

    /**
     * Consistency condition: Consistent seller maintains full boost; inconsistent seller decays.
     */
    public function test_consistency_maintains_boost_while_inconsistency_decays_score(): void
    {
        $category = Category::firstOrCreate(['slug' => 'test-cat-cons'], ['name' => 'Test Cat Cons', 'status' => 'active']);

        // Consistent seller: active, in-stock products, healthy fulfillment
        $consistentSeller = $this->createSeller([
            'verification_status' => 'verified',
            'new_seller_boost_started_at' => Carbon::now()->subDays(10),
            'new_seller_boost_ends_at' => Carbon::now()->addDays(20),
            'cancellation_rate' => 1.5,
            'on_time_delivery_rate' => 97.0,
        ]);
        $this->createProduct($consistentSeller, $category, ['stock_quantity' => 10]);

        // Inconsistent seller: out of stock and high cancellation rate
        $inconsistentSeller = $this->createSeller([
            'verification_status' => 'verified',
            'new_seller_boost_started_at' => Carbon::now()->subDays(10),
            'new_seller_boost_ends_at' => Carbon::now()->addDays(20),
            'cancellation_rate' => 12.0, // Exceeds 5.0% threshold
            'on_time_delivery_rate' => 80.0,
        ]);
        $this->createProduct($inconsistentSeller, $category, ['stock_quantity' => 0]); // Zero in-stock

        $this->assertTrue($this->boostService->isConsistent($consistentSeller));
        $this->assertFalse($this->boostService->isConsistent($inconsistentSeller));

        $consistentScore = $this->boostService->calculateBoostScore($consistentSeller);
        $inconsistentScore = $this->boostService->calculateBoostScore($inconsistentSeller);

        $this->assertEquals(0.20, $consistentScore);
        $this->assertLessThan(0.20, $inconsistentScore);
        $this->assertGreaterThanOrEqual(0.0, $inconsistentScore);

        // Verify status metadata structure
        $status = $this->boostService->getBoostStatus($consistentSeller);
        $this->assertTrue($status['is_boosted']);
        $this->assertTrue($status['is_consistent']);
        $this->assertEquals(20, $status['boost_percent']);
        $this->assertEquals(30, $status['duration_days']);
        $this->assertEquals(20, $status['remaining_days']);
    }

    /**
     * Scenario 2: Seller outside the new seller window receives 0 boost.
     */
    public function test_scenario_2_seller_outside_boost_window_receives_zero_boost(): void
    {
        $seller = $this->createSeller([
            'verification_status' => 'verified',
            'new_seller_boost_started_at' => Carbon::now()->subDays(40),
            'new_seller_boost_ends_at' => Carbon::now()->subDays(10),
        ]);

        $category = Category::firstOrCreate(['slug' => 'test-cat-2'], ['name' => 'Test Cat 2', 'status' => 'active']);
        $this->createProduct($seller, $category);

        $this->assertFalse($this->boostService->isEligible($seller));
        $this->assertEquals(0.0, $this->boostService->calculateBoostScore($seller));
    }

    /**
     * Scenario 3: Out-of-stock product receives severe down-ranking penalty.
     */
    public function test_scenario_3_out_of_stock_product_penalized_in_ranking(): void
    {
        $seller = $this->createSeller();
        $category = Category::firstOrCreate(['slug' => 'test-cat-3'], ['name' => 'Test Cat 3', 'status' => 'active']);

        $inStockProduct = $this->createProduct($seller, $category, ['stock_quantity' => 12]);
        $outOfStockProduct = $this->createProduct($seller, $category, ['stock_quantity' => 0]);

        $inStockResult = $this->rankingService->calculateScore($inStockProduct);
        $outOfStockResult = $this->rankingService->calculateScore($outOfStockProduct);

        $this->assertEquals(1.0, $inStockResult['signals']['availability']);
        $this->assertEquals(0.10, $outOfStockResult['signals']['availability']);
        $this->assertGreaterThan($outOfStockResult['score'] * 3, $inStockResult['score']);
    }

    /**
     * Scenario 4: Relevance protection - boost does not override major relevance mismatch.
     */
    public function test_scenario_4_relevance_protection_prevents_boost_override(): void
    {
        $newSeller = $this->createSeller([
            'craft_description' => 'Peshawar pure leather footwear',
            'new_seller_boost_started_at' => Carbon::now()->subDay(),
            'new_seller_boost_ends_at' => Carbon::now()->addDays(29),
        ]);
        $category = Category::firstOrCreate(['slug' => 'test-cat-4'], ['name' => 'Test Cat 4', 'status' => 'active']);

        // Irrelevant product (e.g. leather shoes when searching for "ceramic blue pottery vase")
        $irrelevantProduct = $this->createProduct($newSeller, $category, [
            'title' => 'Buffalo Leather Kaptaan Chappal',
            'description' => 'Heavy duty footwear with tyre sole',
            'materials' => 'Pure leather, rubber sole',
        ]);

        $result = $this->rankingService->calculateScore($irrelevantProduct, 'ceramic blue pottery vase');

        // Relevance should be low
        $this->assertLessThan(0.20, $result['signals']['relevance']);
        // New seller boost should be attenuated by low relevance
        $this->assertLessThan(0.06, $result['signals']['new_seller_boost']);
    }

    /**
     * Scenario 5: A new seller with a relevant product receives controlled exposure.
     */
    public function test_scenario_5_new_seller_with_relevant_product_gets_boost(): void
    {
        $newSeller = $this->createSeller([
            'new_seller_boost_started_at' => Carbon::now()->subDay(),
            'new_seller_boost_ends_at' => Carbon::now()->addDays(29),
        ]);
        $category = Category::firstOrCreate(['slug' => 'test-cat-5'], ['name' => 'Test Cat 5', 'status' => 'active']);

        $matchingProduct = $this->createProduct($newSeller, $category, [
            'title' => 'Multani Ceramic Blue Pottery Vase',
            'description' => 'Handmade cobalt floral vase crafted in Multan.',
            'materials' => 'Clay, ceramic cobalt glaze',
        ]);

        $result = $this->rankingService->calculateScore($matchingProduct, 'blue pottery vase');

        $this->assertGreaterThan(0.60, $result['signals']['relevance']);
        $this->assertGreaterThan(0.10, $result['signals']['new_seller_boost']);
    }

    /**
     * Scenario 6: Multiple eligible sellers rotate through diversity limits.
     */
    public function test_scenario_6_seller_diversity_prevents_single_seller_monopoly(): void
    {
        $sellerA = $this->createSeller(['business_name' => 'Seller A Guild']);
        $sellerB = $this->createSeller(['business_name' => 'Seller B Guild']);
        $category = Category::firstOrCreate(['slug' => 'test-cat-6'], ['name' => 'Test Cat 6', 'status' => 'active']);

        // Seller A has 5 high scoring products
        $products = collect();
        for ($i = 0; $i < 5; $i++) {
            $p = $this->createProduct($sellerA, $category, ['title' => "Seller A Product $i", 'stock_quantity' => 10]);
            $p->setAttribute('_ranking_score', 0.90 - ($i * 0.01));
            $products->push($p);
        }

        // Seller B has 2 products
        for ($j = 0; $j < 2; $j++) {
            $p = $this->createProduct($sellerB, $category, ['title' => "Seller B Product $j", 'stock_quantity' => 10]);
            $p->setAttribute('_ranking_score', 0.80 - ($j * 0.01));
            $products->push($p);
        }

        // Apply diversity limit of max 2 products per seller
        $diversified = $this->rankingService->applySellerDiversity($products, 2);

        // First 4 items should contain 2 from Seller A and 2 from Seller B
        $top4SellerIds = $diversified->take(4)->pluck('seller_id')->toArray();
        $this->assertEquals(2, count(array_keys($top4SellerIds, $sellerA->id)));
        $this->assertEquals(2, count(array_keys($top4SellerIds, $sellerB->id)));
    }

    /**
     * Scenario 7: An established product with proven history stays competitive.
     */
    public function test_scenario_7_established_high_performer_stays_competitive(): void
    {
        $establishedSeller = $this->createSeller([
            'verification_status' => 'established',
            'rating_average' => 4.95,
            'rating_count' => 60,
            'completed_orders' => 120,
        ]);
        $newSeller = $this->createSeller([
            'verification_status' => 'basic',
            'new_seller_boost_started_at' => Carbon::now()->subDay(),
            'new_seller_boost_ends_at' => Carbon::now()->addDays(29),
        ]);

        $category = Category::firstOrCreate(['slug' => 'test-cat-7'], ['name' => 'Test Cat 7', 'status' => 'active']);

        $establishedProduct = $this->createProduct($establishedSeller, $category, [
            'title' => 'Master Multani Blue Pottery Vase',
            'rating_average' => 4.95,
            'rating_count' => 45,
            'sales_count' => 80,
            'clicks_count' => 200,
            'impressions_count' => 800,
        ]);

        $newProduct = $this->createProduct($newSeller, $category, [
            'title' => 'Master Multani Blue Pottery Vase',
            'rating_average' => 5.0,
            'rating_count' => 0,
            'sales_count' => 0,
            'clicks_count' => 2,
            'impressions_count' => 5,
        ]);

        $establishedScore = $this->rankingService->calculateScore($establishedProduct, 'blue pottery vase')['score'];
        $newScore = $this->rankingService->calculateScore($newProduct, 'blue pottery vase')['score'];

        // Both have solid discovery scores, but established high-volume quality retains high score
        $this->assertGreaterThan(0.65, $establishedScore);
        $this->assertGreaterThan(0.50, $newScore);
    }

    /**
     * Discovery API endpoints test.
     */
    public function test_discovery_endpoints_return_successful_responses(): void
    {
        $trending = $this->getJson('/api/v1/discovery/trending');
        $trending->assertOk()->assertJsonStructure(['data', 'meta' => ['surface', 'total']]);

        $newArrivals = $this->getJson('/api/v1/discovery/new-arrivals');
        $newArrivals->assertOk();

        $bestSellers = $this->getJson('/api/v1/discovery/best-sellers');
        $bestSellers->assertOk();

        $recommended = $this->getJson('/api/v1/discovery/recommended');
        $recommended->assertOk();

        $newMakers = $this->getJson('/api/v1/discovery/new-makers');
        $newMakers->assertOk()->assertJsonStructure(['data', 'meta']);

        $config = $this->getJson('/api/v1/discovery/config');
        $config->assertOk()->assertJsonStructure([
            'data' => [
                'new_seller_boost_enabled',
                'new_seller_boost_days',
                'max_boost_score',
                'max_products_per_seller',
                'freshness_window_days',
            ],
        ]);
    }

    /**
     * Discovery event tracking records impression and click safely.
     */
    public function test_discovery_event_recording(): void
    {
        $seller = $this->createSeller();
        $category = Category::firstOrCreate(['slug' => 'test-cat-8'], ['name' => 'Test Cat 8', 'status' => 'active']);
        $product = $this->createProduct($seller, $category);

        $initialClicks = $product->clicks_count;

        $response = $this->postJson('/api/v1/discovery/events', [
            'event_type' => 'product_click',
            'surface' => 'search',
            'product_id' => $product->id,
            'seller_id' => $seller->id,
            'position' => 1,
            'session_id' => 'sess_' . uniqid(),
        ]);

        $response->assertOk()->assertJson(['data' => ['recorded' => true]]);

        $product->refresh();
        $this->assertEquals($initialClicks + 1, $product->clicks_count);
    }

    /**
     * Data integrity audit across all seeded entities (Part BC).
     */
    public function test_seeded_data_integrity_audit(): void
    {
        // 1. Every product belongs to a valid category
        $orphanCategoryProducts = Product::whereNotIn('category_id', Category::pluck('id'))->count();
        $this->assertEquals(0, $orphanCategoryProducts);

        // 2. Every product belongs to a valid seller
        $orphanSellerProducts = Product::whereNotIn('seller_id', SellerProfile::pluck('id'))->count();
        $this->assertEquals(0, $orphanSellerProducts);

        // 3. Every seller has a valid user
        $orphanSellerUsers = SellerProfile::whereNotIn('user_id', User::pluck('id'))->count();
        $this->assertEquals(0, $orphanSellerUsers);

        // 4. No duplicate slugs
        $duplicateProductSlugs = Product::select('slug')->groupBy('slug')->havingRaw('count(*) > 1')->count();
        $this->assertEquals(0, $duplicateProductSlugs);

        $duplicateSellerSlugs = SellerProfile::select('slug')->groupBy('slug')->havingRaw('count(*) > 1')->count();
        $this->assertEquals(0, $duplicateSellerSlugs);

        // 5. No invalid prices or negative inventory
        $invalidPrices = Product::where('base_price', '<=', 0)->count();
        $this->assertEquals(0, $invalidPrices);

        $negativeStock = Product::where('stock_quantity', '<', 0)->count();
        $this->assertEquals(0, $negativeStock);

        // 6. Every review belongs to a valid product
        $orphanReviews = \App\Models\Review::whereNotIn('product_id', Product::pluck('id'))->count();
        $this->assertEquals(0, $orphanReviews);
    }
}
