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
        'patient_name',
        'doctor_id',
        'medical_record_id',
        'prescription_date',
        'case_id',
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
        // Since patient_id is now a string (Patient Records ID), we don't have a direct relationship
        // The patient information is stored in the appointments table
        return null;
    }
    
    // Get patient information from appointments table
    public function getPatientInfo()
    {
        // Extract patient name from patient_id format: PAT_KEV_JUM_20251006
        if (preg_match('/^PAT_([A-Z]{3})_([A-Z]{3})_(\d{8})$/', $this->patient_id, $matches)) {
            $firstName = $matches[1];
            $lastName = $matches[2];
            $date = $matches[3];
            
            // Find the appointment record for this patient
            $appointment = \App\Models\appointments::whereNull('user_id')
                ->where('firstname', 'like', $firstName . '%')
                ->where('lastname', 'like', $lastName . '%')
                ->whereDate('created_at', \Carbon\Carbon::createFromFormat('Ymd', $date))
                ->first();
                
            if ($appointment) {
                // Calculate age from date of birth
                $age = 'N/A';
                if ($appointment->date_of_birth) {
                    $birthDate = \Carbon\Carbon::parse($appointment->date_of_birth);
                    $age = $birthDate->age;
                }

                return [
                    'first_name' => $appointment->firstname,
                    'last_name' => $appointment->lastname,
                    'middle_name' => $appointment->middlename,
                    'date_of_birth' => $appointment->date_of_birth ?: 'N/A',
                    'age' => $age,
                    'gender' => $appointment->gender ?: 'N/A',
                    'contact_number' => $appointment->phone ?: 'N/A'
                ];
            }
        }
        
        return [
            'first_name' => 'N/A',
            'last_name' => 'N/A',
            'middle_name' => 'N/A',
            'date_of_birth' => 'N/A',
            'age' => 'N/A',
            'gender' => 'N/A',
            'contact_number' => 'N/A'
        ];
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