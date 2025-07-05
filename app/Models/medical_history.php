<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class medical_history extends Model
{
    //

    public $table = "medical_history";
    public $timestamps = false;


    public function patient(){
        return $this->belongsTo(User::class,"user_id");
    }

    public function doctor(){
        return $this->belongsTo(doctor_details::class,"doctor_id");
    }


    public function attachments(){
        return $this->hasMany(medical_history_attachments::class,"mh_id",'id');
    }
}