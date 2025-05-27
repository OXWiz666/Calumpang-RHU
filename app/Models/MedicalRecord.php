<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MedicalRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id',
        'appointment_id',
        'doctor_id',
        'diagnosis',
        'symptoms',
        'treatment',
        'notes',
        'vital_signs',
        'lab_results',
        'follow_up_date',
        'record_type', // e.g., 'consultation', 'checkup', 'emergency'
        'attachments'
    ];

    protected $casts = [
        'vital_signs' => 'array',
        'lab_results' => 'array',
        'follow_up_date' => 'date',
        'attachments' => 'array'
    ];

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('record_type', $type);
    }

    public function scopeWithinDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    public function scopeRequiringFollowUp($query)
    {
        return $query->whereNotNull('follow_up_date')
                    ->where('follow_up_date', '>=', now());
    }

    // Accessors
    public function getHasAttachmentsAttribute()
    {
        return !empty($this->attachments);
    }

    public function getIsFollowUpDueAttribute()
    {
        return $this->follow_up_date && $this->follow_up_date->isPast();
    }
} 