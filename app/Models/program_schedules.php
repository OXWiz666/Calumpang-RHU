<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class program_schedules extends Model
{
    //
    protected $fillable = [
        'program_type_id',
        'date',
        'start_time',
        'end_time',
        'location',
        'total_slots',
        'available_slots',
        'coordinator_id',
        'status',
        'created_at',
        'updated_at'
    ];

    /**
     * Get the program type that this schedule belongs to.
     */
    public function program_type()
    {
        return $this->belongsTo(program_types::class, 'program_type_id');
    }

    /**
     * Get the coordinator (doctor) for this schedule.
     */
    public function coordinator()
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    /**
     * Get the participants registered for this schedule.
     */
    public function registered_participants()
    {
        return $this->belongsToMany(User::class, 'program_participants', 'program_schedule_id', 'user_id');
    }
}
