<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class servicetypes extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = ['servicename', 'description', 'status'];
    public $timestamps = true;
    public function subservices(){
        return $this->hasMany(subservices::class,'service_id','id');
    }

    public function servicedays(){
        return $this->hasMany(service_days::class,'service_id','id');
    }
}
