<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Verification extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'type',
        'status',
        'document_number',
        'document_file_path',
        'workshop_address',
        'experience_years',
        'rejection_reason',
        'reviewed_by',
        'submitted_at',
        'reviewed_at',
        'metadata_json',
    ];

    protected $casts = [
        'metadata_json' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function seller()
    {
        return $this->belongsTo(SellerProfile::class, 'seller_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
