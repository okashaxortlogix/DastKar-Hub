<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('seller_profiles')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('base_price', 10, 2);
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->string('status')->default('published'); // draft, pending_review, published, paused, archived
            $table->unsignedInteger('stock_quantity')->default(1);
            $table->unsignedSmallInteger('production_days')->default(2);
            $table->boolean('is_customizable')->default(false);
            $table->string('materials')->nullable();
            $table->string('dimensions')->nullable();
            $table->text('care_instructions')->nullable();
            $table->unsignedInteger('weight_grams')->nullable();
            $table->decimal('rating_average', 3, 2)->default(5.00);
            $table->unsignedInteger('rating_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'category_id']);
            $table->index(['seller_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
