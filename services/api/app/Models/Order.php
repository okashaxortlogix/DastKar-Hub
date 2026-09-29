<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'buyer_id',
        'status',
        'subtotal',
        'shipping_fee',
        'discount_amount',
        'total_amount',
        'currency',
        'shipping_address_snapshot',
        'shipping_method',
        'payment_method',
        'payment_status',
        'notes',
        'placed_at',
        'delivered_at',
        'is_seeded',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'shipping_fee' => 'float',
        'discount_amount' => 'float',
        'total_amount' => 'float',
        'shipping_address_snapshot' => 'array',
        'placed_at' => 'datetime',
        'delivered_at' => 'datetime',
        'is_seeded' => 'boolean',
    ];

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
