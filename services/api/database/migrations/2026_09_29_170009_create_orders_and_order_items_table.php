<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('pending_payment');
            // pending_payment, paid, confirmed, processing, ready_to_ship, shipped, delivered, completed, cancelled
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_fee', 10, 2)->default(0.00);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->decimal('total_amount', 10, 2);
            $table->string('currency', 3)->default('PKR');
            $table->json('shipping_address_snapshot');
            $table->string('shipping_method')->default('standard'); // standard, express
            $table->string('payment_method')->default('cod'); // cod, jazzcash_easypaisa, card, bank_transfer
            $table->string('payment_status')->default('pending'); // pending, paid, failed, refunded
            $table->text('notes')->nullable();
            $table->timestamp('placed_at')->useCurrent();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index(['buyer_id', 'status']);
            $table->index('order_number');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('seller_profiles')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('product_title'); // historical snapshot
            $table->string('product_image')->nullable(); // historical snapshot
            $table->json('product_snapshot_json'); // full immutable historical snapshot
            $table->json('customization_json')->nullable(); // structured buyer customization snapshot
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->string('status')->default('pending'); // pending, accepted, processing, shipped, delivered, cancelled
            $table->timestamps();

            $table->index(['seller_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
