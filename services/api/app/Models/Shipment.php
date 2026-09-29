<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'order_item_id',
        'seller_id',
        'courier',
        'tracking_number',
        'status',
        'shipping_cost',
        'shipping_label_url',
        'origin_city',
        'destination_city',
        'shipped_at',
        'delivered_at',
        'tracking_history_json',
    ];

    protected $casts = [
        'shipping_cost' => 'float',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'tracking_history_json' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function seller()
    {
        return $this->belongsTo(SellerProfile::class, 'seller_id');
    }
}
