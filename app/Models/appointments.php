<?php

namespace App\Models;
use App\Models\servicetypes;
use App\Models\User;
use App\Models\subservices;
use App\Models\MedicalRecord;

use Illuminate\Database\Eloquent\Model;

class appointments extends Model
{
    //
    protected $table = 'appointments'; // Explicit table name if needed

    protected $fillable = [
        'reference_number',
        'user_id',
        'firstname',
        'lastname',
        'middlename',
        'email',
        'phone',
        'date',
        'time',
        'servicetype_id',
        'notes',
        'status',
        'priority_number',
        'subservice_id',
        'doctor_id',
        // Patient profile fields
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
        'profile_picture'
    ];

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function service(){
        return $this->belongsTo(servicetypes::class,'servicetype_id');
    }
    
    public function subservice(){
        return $this->belongsTo(subservices::class,'subservice_id');
    }
    
    public function doctor(){
        return $this->belongsTo(User::class,'doctor_id');
    }

    public function medicalRecord(){
        return $this->hasOne(MedicalRecord::class, 'appointment_id');
    }

    public function patient(){
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    // Get patient name (either from user or guest info)
    public function getPatientNameAttribute()
    {
        if ($this->user) {
            return $this->user->firstname . ' ' . $this->user->lastname;
        }
        
        return $this->firstname . ' ' . $this->lastname;
    }

    // Get patient email (either from user or guest info)
    public function getPatientEmailAttribute()
    {
        if ($this->user) {
            return $this->user->email;
        }
        
        return $this->email;
    }

    // Get patient phone (either from user or guest info)
    public function getPatientPhoneAttribute()
    {
        if ($this->user) {
            return $this->user->contactno;
        }
        
        return $this->phone;
    }

    // Generate unique reference number
    public static function generateReferenceNumber()
    {
        do {
            $referenceNumber = 'APT-' . date('Ymd') . '-' . str_pad(random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
        } while (self::where('reference_number', $referenceNumber)->exists());
        
        return $referenceNumber;
    }

    // Boot method to auto-generate reference number
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($appointment) {
            if (empty($appointment->reference_number)) {
                $appointment->reference_number = self::generateReferenceNumber();
            }
        });
    }
}