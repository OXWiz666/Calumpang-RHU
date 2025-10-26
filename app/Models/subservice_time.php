<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class subservice_time extends Model
{
    protected $table = 'subservice_time';
    
    protected $fillable = [
        'subservice_id',
        'time',
        'max_slots',
        'available_slots'
    ];

    public function subservice(){
        return $this->belongsTo(subservices::class,'subservice_id');
    }
}
