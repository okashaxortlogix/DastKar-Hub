<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'provider',
        'provider_reference',
        'status',
        'amount',
        'currency',
        'paid_at',
        'metadata_json',
    ];

    protected $casts = [
        'amount' => 'float',
        'paid_at' => 'datetime',
        'metadata_json' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
