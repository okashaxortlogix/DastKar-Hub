<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerLedger extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'seller_id',
        'type',
        'amount',
        'balance_after',
        'reference_type',
        'reference_id',
        'description',
        'created_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'balance_after' => 'float',
        'created_at' => 'datetime',
    ];

    public function seller()
    {
        return $this->belongsTo(SellerProfile::class, 'seller_id');
    }
}
