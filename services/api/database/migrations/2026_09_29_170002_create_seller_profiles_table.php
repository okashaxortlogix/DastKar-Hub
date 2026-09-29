<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('business_name');
            $table->string('slug')->unique();
            $table->text('bio')->nullable();
            $table->text('craft_description')->nullable();
            $table->string('location_city')->default('Karachi');
            $table->string('location_region')->default('Sindh');
            $table->string('verification_status')->default('basic'); // basic, verified, established, pending
            $table->string('seller_status')->default('active'); // active, paused, suspended
            $table->decimal('rating_average', 3, 2)->default(5.00);
            $table->unsignedInteger('rating_count')->default(0);
            $table->unsignedInteger('completed_orders')->default(0);
            $table->decimal('total_sales', 12, 2)->default(0.00);
            $table->string('avatar_url')->nullable();
            $table->string('cover_url')->nullable();
            $table->json('social_links')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_profiles');
    }
};
