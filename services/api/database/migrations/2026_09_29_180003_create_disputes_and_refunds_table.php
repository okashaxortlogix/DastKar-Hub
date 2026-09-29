<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('seller_profiles')->cascadeOnDelete();
            $table->string('reason'); // damaged_in_transit, wrong_item, quality_mismatch, not_delivered
            $table->text('description');
            $table->json('evidence_images_json')->nullable();
            $table->string('status')->default('opened'); // opened, under_review, awaiting_seller, resolved, rejected
            $table->string('resolution')->nullable(); // refund_full, refund_partial, replacement, rejected
            $table->decimal('resolution_amount', 10, 2)->default(0.00);
            $table->text('admin_notes')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'status']);
        });

        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
            $table->foreignId('dispute_id')->nullable()->constrained('disputes')->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('PKR');
            $table->string('reason');
            $table->string('status')->default('completed'); // pending, completed, failed
            $table->string('provider_reference')->nullable();
            $table->timestamp('processed_at')->useCurrent();
            $table->timestamps();

            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refunds');
        Schema::dropIfExists('disputes');
    }
};
