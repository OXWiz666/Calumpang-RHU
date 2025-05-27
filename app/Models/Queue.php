<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'queue_number',
        'status',
        'service_type',
        'notes',
        'called_at',
        'completed_at'
    ];

    protected $casts = [
        'called_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Status constants
    const STATUS_WAITING = 'waiting';
    const STATUS_CALLED = 'called';
    const STATUS_SERVING = 'serving';
    const STATUS_COMPLETED = 'completed';
    const STATUS_SKIPPED = 'skipped';

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', [self::STATUS_WAITING, self::STATUS_CALLED, self::STATUS_SERVING]);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', now());
    }

    // Methods
    public function markAsCalled()
    {
        $this->update([
            'status' => self::STATUS_CALLED,
            'called_at' => now(),
        ]);
    }

    public function markAsServing()
    {
        $this->update([
            'status' => self::STATUS_SERVING,
        ]);
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);
    }

    public function markAsSkipped()
    {
        $this->update([
            'status' => self::STATUS_SKIPPED,
        ]);
    }

    // Accessors
    public function getWaitTimeAttribute()
    {
        $start = $this->created_at;
        $end = $this->completed_at ?? now();
        return $start->diffForHumans($end, true);
    }

    public function getIsActiveAttribute()
    {
        return in_array($this->status, [self::STATUS_WAITING, self::STATUS_CALLED, self::STATUS_SERVING]);
    }
} 