<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketplaceApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_categories_api_returns_active_categories(): void
    {
        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'children'],
                ],
            ]);
    }

    public function test_products_api_returns_craft_products(): void
    {
        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'slug', 'base_price', 'seller', 'primary_image'],
                ],
                'meta' => ['total', 'current_page'],
            ]);
    }

    public function test_checkout_quote_calculates_correct_totals(): void
    {
        $product = Product::where('status', 'published')->first();

        $response = $this->postJson('/api/v1/checkout/quote', [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ],
            ],
            'shipping_method' => 'standard',
        ]);

        $response->assertStatus(200);
        $this->assertEquals($product->base_price * 2, $response->json('data.subtotal'));
        $this->assertEquals('PKR', $response->json('data.currency'));
    }

    public function test_buyer_registration_and_login(): void
    {
        $registerResponse = $this->postJson('/api/v1/auth/register', [
            'name' => 'Fatima Ali',
            'email' => 'fatima@test.pk',
            'password' => 'secretPassword123!',
            'role' => 'buyer',
            'phone' => '+923001112233',
        ]);

        $registerResponse->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'name', 'email', 'role'],
                    'token',
                ],
            ]);

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'fatima@test.pk',
            'password' => 'secretPassword123!',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonStructure(['data' => ['token']]);
    }

    public function test_end_to_end_order_placement_preserves_historical_snapshots(): void
    {
        $buyer = User::where('role', 'buyer')->first();
        $product = Product::where('status', 'published')->first();
        $originalStock = $product->stock_quantity;

        $response = $this->actingAs($buyer)->postJson('/api/v1/checkout/process', [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'customization' => ['Engraving' => 'Custom text'],
                ],
            ],
            'shipping_method' => 'standard',
            'payment_method' => 'cod',
            'shipping_address' => [
                'full_name' => 'Ayesha Siddiqui',
                'phone' => '+923014443322',
                'address_line1' => 'Street 4, Phase 6, DHA',
                'city' => 'Lahore',
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.status', 'confirmed')
            ->assertJsonPath('data.currency', 'PKR');

        // Check stock was decremented
        $product->refresh();
        $this->assertEquals($originalStock - 1, $product->stock_quantity);

        // Check snapshot was saved
        $orderData = $response->json('data');
        $this->assertNotEmpty($orderData['items']);
        $this->assertEquals($product->title, $orderData['items'][0]['product_title']);
        $this->assertEquals('Custom text', $orderData['items'][0]['customization_json']['Engraving']);
    }
}
