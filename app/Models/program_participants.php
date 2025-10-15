<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class program_participants extends Model
{
    protected $fillable = [
        'program_schedule_id',
        'user_id',
        'registration_id',
        'status',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'sex',
        'birthdate',
        'age',
        'contact_number',
        'email',
        'created_at',
        'updated_at'
    ];

    /**
     * Get the program schedule that this participant is registered for.
     */
    public function program_schedule()
    {
        return $this->belongsTo(program_schedules::class, 'program_schedule_id');
    }

    /**
     * Get the user that is registered for this program.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}