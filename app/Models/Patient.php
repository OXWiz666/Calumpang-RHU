<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'date_of_birth',
        'gender',
        'address',
        'contact_number',
        'email',
        'emergency_contact_name',
        'emergency_contact_number',
        'blood_type',
        'allergies',
        'medical_conditions'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'allergies' => 'array',
        'medical_conditions' => 'array'
    ];

    // Accessor for full name
    public function getFullNameAttribute()
    {
        return "{$this->first_name} " . ($this->middle_name ? substr($this->middle_name, 0, 1) . ". " : "") . "{$this->last_name}";
    }

    // Relationships
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function queues()
    {
        return $this->hasMany(Queue::class);
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
        return $query->whereNull('deleted_at');
    }

    public function scopeSearchByName($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('middle_name', 'like', "%{$search}%");
        });
    }
} 