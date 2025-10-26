<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\program_schedules;

class program_types extends Model
{
    //
    protected $fillable = [
        'programname',
        'description',
        'service_id',
        'created_at',
        'updated_at'
    ];

    /**
     * Get the schedules for this program type.
     */
    public function schedules()
    {
        return $this->hasMany(program_schedules::class, 'program_type_id')->orderBy('created_at', 'desc');
    }

    public function service(){
        return $this->belongsTo(servicetypes::class,'service_id');
    }
}
