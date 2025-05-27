<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class service_days extends Model
{
    //

    public function service(){
        return $this->belongsTo(service_days::class,'service_id');
    }
}