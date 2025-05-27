<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VaccineSchedule extends Model
{
    protected $fillable = [
        'name',
        'date',
        'time',
        'location',
        'age_group',
        'available_slots',
        'total_slots',
        'status'
    ];

    protected $casts = [
        'date' => 'datetime'
    ];
}