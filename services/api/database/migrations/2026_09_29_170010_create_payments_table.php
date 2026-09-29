<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('provider'); // cod, jazzcash, easypaisa, card, bank_transfer
            $table->string('provider_reference')->nullable()->index();
            $table->string('status')->default('pending'); // pending, authorized, paid, failed, refunded
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('PKR');
            $table->timestamp('paid_at')->nullable();
            $table->json('metadata_json')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
