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
}