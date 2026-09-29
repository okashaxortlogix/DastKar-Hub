<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'name',
        'price',
        'stock_quantity',
        'attributes_json',
    ];

    protected $casts = [
        'price' => 'float',
        'stock_quantity' => 'integer',
        'attributes_json' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
