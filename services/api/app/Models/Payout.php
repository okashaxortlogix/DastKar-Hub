<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'order_id',
        'gross_amount',
        'commission_rate',
        'commission_amount',
        'courier_fee_deduction',
        'refund_deduction',
        'net_payout',
        'currency',
        'status',
        'payout_method',
        'payout_reference',
        'scheduled_at',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'gross_amount' => 'float',
        'commission_rate' => 'float',
        'commission_amount' => 'float',
        'courier_fee_deduction' => 'float',
        'refund_deduction' => 'float',
        'net_payout' => 'float',
        'scheduled_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function seller()
    {
        return $this->belongsTo(SellerProfile::class, 'seller_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
