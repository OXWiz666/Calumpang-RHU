<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'patient_id',
        'user_id',
        'firstname',
        'lastname',
        'middlename',
        'suffix',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'civil_status',
        'nationality',
        'religion',
        'country',
        'region',
        'province',
        'city',
        'barangay',
        'street',
        'zip_code',
        'profile_picture',
        'status'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    // Generate unique patient ID
    public static function generatePatientId($firstname, $lastname)
    {
        do {
            $patientId = 'PAT_' . strtoupper(substr($firstname, 0, 3)) . '_' . 
                        strtoupper(substr($lastname, 0, 3)) . '_' . 
                        date('Ymd');
        } while (self::where('patient_id', $patientId)->exists());
        
        return $patientId;
    }

    // Boot method to auto-generate patient ID
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($patient) {
            if (empty($patient->patient_id)) {
                $patient->patient_id = self::generatePatientId($patient->firstname, $patient->lastname);
            }
        });
    }

    // Accessor for full name
    public function getFullNameAttribute()
    {
        return trim($this->firstname . ' ' . $this->lastname);
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function appointments()
    {
        return $this->hasMany(appointments::class, 'patient_id');
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeSearchByName($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('firstname', 'like', "%{$search}%")
              ->orWhere('lastname', 'like', "%{$search}%")
              ->orWhere('middlename', 'like', "%{$search}%");
        });
    }
} 