<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VaccineRecord extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'date',
        'vaccine_type',
        'dose_number',
        'next_dose_date',
        'administered_by',
        'status'
    ];

    protected $casts = [
        'date' => 'datetime',
        'next_dose_date' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}