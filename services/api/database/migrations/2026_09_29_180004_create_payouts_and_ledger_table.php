<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('seller_profiles')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->decimal('gross_amount', 12, 2);
            $table->decimal('commission_rate', 5, 2)->default(8.00); // 8% standard commission
            $table->decimal('commission_amount', 12, 2);
            $table->decimal('courier_fee_deduction', 10, 2)->default(0.00);
            $table->decimal('refund_deduction', 10, 2)->default(0.00);
            $table->decimal('net_payout', 12, 2);
            $table->string('currency', 3)->default('PKR');
            $table->string('status')->default('pending'); // pending, approved, processing, paid, held, reversed
            $table->string('payout_method')->default('bank_transfer'); // bank_transfer, jazzcash, easypaisa, raast
            $table->string('payout_reference')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['seller_id', 'status']);
        });

        Schema::create('seller_ledgers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('seller_profiles')->cascadeOnDelete();
            $table->string('type'); // credit, debit
            $table->decimal('amount', 12, 2);
            $table->decimal('balance_after', 12, 2);
            $table->string('reference_type'); // order, payout, refund, adjustment
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('description');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['seller_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_ledgers');
        Schema::dropIfExists('payouts');
    }
};
