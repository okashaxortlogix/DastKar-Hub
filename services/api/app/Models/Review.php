<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'buyer_id',
        'seller_id',
        'product_id',
        'rating',
        'comment',
        'images_json',
        'status',
        'seller_response',
    ];

    protected $casts = [
        'rating' => 'integer',
        'images_json' => 'array',
    ];

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(SellerProfile::class, 'seller_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
