<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class service_days extends Model
{
    protected $fillable = [
        'service_id',
        'day',
        'slot_capacity'
    ];

    public function service(){
        return $this->belongsTo(servicetypes::class,'service_id');
    }
}