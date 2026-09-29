<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'category_id',
        'title',
        'slug',
        'description',
        'base_price',
        'compare_at_price',
        'status',
        'stock_quantity',
        'production_days',
        'is_customizable',
        'materials',
        'dimensions',
        'care_instructions',
        'weight_grams',
        'rating_average',
        'rating_count',
        'is_featured',
        'published_at',
    ];

    protected $casts = [
        'base_price' => 'float',
        'compare_at_price' => 'float',
        'stock_quantity' => 'integer',
        'production_days' => 'integer',
        'is_customizable' => 'boolean',
        'is_featured' => 'boolean',
        'rating_average' => 'float',
        'rating_count' => 'integer',
        'published_at' => 'datetime',
    ];

    public function seller()
    {
        return $this->belongsTo(SellerProfile::class, 'seller_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function customizationOptions()
    {
        return $this->hasMany(CustomizationOption::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->where('status', 'published');
    }
}
