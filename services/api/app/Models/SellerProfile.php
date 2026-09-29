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
    ];

    protected $casts = [
        'rating_average' => 'float',
        'rating_count' => 'integer',
        'completed_orders' => 'integer',
        'total_sales' => 'float',
        'social_links' => 'array',
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
