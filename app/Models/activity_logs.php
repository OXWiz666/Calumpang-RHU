<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class activity_logs extends Model
{
    //
    protected $fillable = [
        'log_name',
        'description',
        'subject_id',
        'subject_type',
        'causer_id',
        'causer_type',
        'properties'
    ];

    protected $casts = [
        'properties' => 'collection',
    ];

    public function subject()
    {
        return $this->morphTo();
    }

    public function causer()
    {
        return $this->morphTo();
    }
}