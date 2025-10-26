<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class subservices extends Model
{
    protected $fillable = [
        'service_id',
        'subservicename',
        'status'
    ];

    public function service(){
        return $this->belongsTo(servicetypes::class,'service_id');
    }

    public function times(){
        return $this->hasMany(subservice_time::class,'subservice_id','id');
    }
}
