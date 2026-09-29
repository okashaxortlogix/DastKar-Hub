<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add discovery & seed flags to seller_profiles
        Schema::table('seller_profiles', function (Blueprint $table) {
            $table->boolean('is_seeded')->default(false)->index();
            $table->timestamp('new_seller_boost_started_at')->nullable();
            $table->timestamp('new_seller_boost_ends_at')->nullable();
            $table->timestamp('onboarding_completed_at')->nullable();
            $table->unsignedInteger('response_time_minutes')->default(60);
            $table->decimal('on_time_delivery_rate', 5, 2)->default(98.00);
            $table->decimal('cancellation_rate', 5, 2)->default(1.00);
        });

        // 2. Add ranking & discovery signals to products
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_seeded')->default(false)->index();
            $table->decimal('ranking_score', 8, 4)->default(0.0000)->index();
            $table->unsignedInteger('impressions_count')->default(0);
            $table->unsignedInteger('clicks_count')->default(0);
            $table->unsignedInteger('wishlist_count')->default(0);
            $table->unsignedInteger('sales_count')->default(0);
            $table->decimal('conversion_rate', 5, 4)->default(0.0000);
            $table->timestamp('last_ranked_at')->nullable();
        });

        // 3. Add is_seeded flag to orders, order_items, reviews
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_seeded')->default(false)->index();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->boolean('is_seeded')->default(false)->index();
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->boolean('is_seeded')->default(false)->index();
        });

        // 4. Discovery Events table for impression, click, search position & conversion tracking
        Schema::create('discovery_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_type'); // product_impression, product_click, search_impression, etc.
            $table->string('surface'); // search, category, homepage_trending, etc.
            $table->unsignedInteger('position')->nullable(); // 1-indexed listing position
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('seller_id')->nullable()->constrained('seller_profiles')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('session_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['event_type', 'created_at']);
            $table->index(['surface', 'position']);
            $table->index(['product_id', 'event_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discovery_events');

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('is_seeded');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('is_seeded');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('is_seeded');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'is_seeded',
                'ranking_score',
                'impressions_count',
                'clicks_count',
                'wishlist_count',
                'sales_count',
                'conversion_rate',
                'last_ranked_at',
            ]);
        });

        Schema::table('seller_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'is_seeded',
                'new_seller_boost_started_at',
                'new_seller_boost_ends_at',
                'onboarding_completed_at',
                'response_time_minutes',
                'on_time_delivery_rate',
                'cancellation_rate',
            ]);
        });
    }
};
