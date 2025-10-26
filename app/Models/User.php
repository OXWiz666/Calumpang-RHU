<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;

use App\Models\roles;
// use Yajra\Address\HasAddress;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',

        'firstname' ,
        'middlename' ,
        'lastname' ,
        'email' ,
        'password' ,
        'contactno' ,
        'roleID' ,
        'questionID' ,
        'answer' ,
        'gender' ,
        'birth',
        'suffix',
        'bloodtype',
        'avatar',
        'address',
        'status',
        'license_number'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['avatar_url'];
    public function emercont()
    {
        return $this->hasMany(emergencycontacts::class,'user_id','id');
    }

    public function role(){
        return $this->belongsTo(roles::class,'roleID');
    }

    public function userPrograms(){
        return $this->hasMany(program_participants::class,'user_id','id')
        ->with('program_schedule')
        ->with('program_schedule.program_type')
        ->with('program_schedule.program_type.service');
    }

    public function medical_histories(){
        return $this->hasMany(medical_history::class,'user_id','id');
    }

    public function prescriptions(){
        return $this->hasMany(\App\Models\Prescription::class, 'patient_id');
    }

    public function doctor_details(){
        return $this->hasOne(doctor_details::class, 'user_id');
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute()
    {
        return trim($this->firstname . ' ' . $this->lastname);
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            return \Storage::disk('public')->url($this->avatar);
        }
        return null;
    }

}