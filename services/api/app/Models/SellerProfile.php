<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'slug',
        'bio',
        'craft_description',
        'location_city',
        'location_region',
        'verification_status',
        'seller_status',
        'rating_average',
        'rating_count',
        'completed_orders',
        'total_sales',
        'avatar_url',
        'cover_url',
        'social_links',
        'is_seeded',
        'new_seller_boost_started_at',
        'new_seller_boost_ends_at',
        'onboarding_completed_at',
        'response_time_minutes',
        'on_time_delivery_rate',
        'cancellation_rate',
    ];

    protected $casts = [
        'rating_average' => 'float',
        'rating_count' => 'integer',
        'completed_orders' => 'integer',
        'total_sales' => 'float',
        'social_links' => 'array',
        'is_seeded' => 'boolean',
        'new_seller_boost_started_at' => 'datetime',
        'new_seller_boost_ends_at' => 'datetime',
        'onboarding_completed_at' => 'datetime',
        'response_time_minutes' => 'integer',
        'on_time_delivery_rate' => 'float',
        'cancellation_rate' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'seller_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'seller_id');
    }
}
