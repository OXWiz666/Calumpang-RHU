<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prescription extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'medical_record_id',
        'prescription_date',
        'status', // pending, dispensed, cancelled
        'notes',
        'dispensed_at',
        'dispensed_by'
    ];

    protected $casts = [
        'prescription_date' => 'date',
        'dispensed_at' => 'datetime'
    ];

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function medicines()
    {
        return $this->hasMany(PrescriptionMedicine::class);
    }

    public function dispenser()
    {
        return $this->belongsTo(User::class, 'dispensed_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDispensed($query)
    {
        return $query->where('status', 'dispensed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('prescription_date', $date);
    }

    // Methods
    public function markAsDispensed($userId)
    {
        $this->update([
            'status' => 'dispensed',
            'dispensed_at' => now(),
            'dispensed_by' => $userId
        ]);
    }

    public function markAsCancelled()
    {
        $this->update(['status' => 'cancelled']);
    }

    // Accessors
    public function getIsDispensedAttribute()
    {
        return $this->status === 'dispensed';
    }

    public function getIsCancelledAttribute()
    {
        return $this->status === 'cancelled';
    }

    public function getIsPendingAttribute()
    {
        return $this->status === 'pending';
    }
} 