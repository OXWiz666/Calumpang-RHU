<?php

namespace App\Models;
use App\Models\servicetypes;
use App\Models\User;
use App\Models\subservices;

use Illuminate\Database\Eloquent\Model;

class appointments extends Model
{
    //
    protected $table = 'appointments'; // Explicit table name if needed

    protected $fillable = [
        'user_id',
        'phone',
        'date',
        'time',
        'servicetype_id',
        'notes',
        'status',
        'priority_number',
        'subservice_id',
        'doctor_id'
    ];

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function service(){
        return $this->belongsTo(servicetypes::class,'servicetype_id');
    }
    
    public function subservice(){
        return $this->belongsTo(subservices::class,'subservice_id');
    }
    
    public function doctor(){
        return $this->belongsTo(User::class,'doctor_id');
    }
}