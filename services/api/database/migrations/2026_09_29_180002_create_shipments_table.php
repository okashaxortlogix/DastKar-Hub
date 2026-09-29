<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained('order_items')->nullOnDelete();
            $table->foreignId('seller_id')->constrained('seller_profiles')->cascadeOnDelete();
            $table->string('courier'); // trax, tcs, leopard, mnp, self
            $table->string('tracking_number')->unique();
            $table->string('status')->default('booked'); // booked, picked_up, in_transit, out_for_delivery, delivered, failed, returned
            $table->decimal('shipping_cost', 10, 2)->default(0.00);
            $table->string('shipping_label_url')->nullable();
            $table->string('origin_city')->default('Karachi');
            $table->string('destination_city')->default('Lahore');
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->json('tracking_history_json')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'status']);
            $table->index('tracking_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
