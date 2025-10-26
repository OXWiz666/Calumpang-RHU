<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\appointments;
use Illuminate\Support\Facades\DB;

class PatientService
{
    /**
     * Find or create a patient based on appointment data
     */
    public function findOrCreatePatient($appointmentData)
    {
        // Check if patient already exists by email and name
        $existingPatient = Patient::where('email', $appointmentData['email'])
            ->where('firstname', $appointmentData['firstname'])
            ->where('lastname', $appointmentData['lastname'])
            ->first();

        if ($existingPatient) {
            // Update address information if new data is provided
            $updateData = [];
            
            // Use direct string fields instead of converting from IDs
            if (isset($appointmentData['region'])) {
                $updateData['region'] = $appointmentData['region'];
            }
            
            if (isset($appointmentData['province'])) {
                $updateData['province'] = $appointmentData['province'];
            }
            
            if (isset($appointmentData['city'])) {
                $updateData['city'] = $appointmentData['city'];
            }
            
            if (isset($appointmentData['barangay'])) {
                $updateData['barangay'] = $appointmentData['barangay'];
            }
            
            if (isset($appointmentData['street'])) {
                $updateData['street'] = $appointmentData['street'];
            }
            
            if (isset($appointmentData['zip_code'])) {
                $updateData['zip_code'] = $appointmentData['zip_code'];
            }
            
            if (!empty($updateData)) {
                $existingPatient->update($updateData);
            }
            
            return $existingPatient;
        }

        // Create new patient using direct string fields
        $patient = Patient::create([
            'user_id' => $appointmentData['user_id'] ?? null,
            'firstname' => $appointmentData['firstname'],
            'lastname' => $appointmentData['lastname'],
            'middlename' => $appointmentData['middlename'] ?? null,
            'suffix' => $appointmentData['suffix'] ?? null,
            'email' => $appointmentData['email'],
            'phone' => $appointmentData['phone'],
            'date_of_birth' => $appointmentData['date_of_birth'] ?? null,
            'gender' => $appointmentData['gender'] ?? null,
            'civil_status' => $appointmentData['civil_status'] ?? null,
            'nationality' => $appointmentData['nationality'] ?? null,
            'religion' => $appointmentData['religion'] ?? null,
            'country' => $appointmentData['country'] ?? null,
            'region' => $appointmentData['region'] ?? null,
            'province' => $appointmentData['province'] ?? null,
            'city' => $appointmentData['city'] ?? null,
            'barangay' => $appointmentData['barangay'] ?? null,
            'street' => $appointmentData['street'] ?? null,
            'zip_code' => $appointmentData['zip_code'] ?? null,
            'profile_picture' => $appointmentData['profile_picture'] ?? null,
            'status' => 'active'
        ]);

        return $patient;
    }

    /**
     * Update patient information from appointment data
     */
    public function updatePatientFromAppointment(Patient $patient, $appointmentData)
    {
        $patient->update([
            'firstname' => $appointmentData['firstname'],
            'lastname' => $appointmentData['lastname'],
            'middlename' => $appointmentData['middlename'] ?? $patient->middlename,
            'suffix' => $appointmentData['suffix'] ?? $patient->suffix,
            'email' => $appointmentData['email'],
            'phone' => $appointmentData['phone'],
            'date_of_birth' => $appointmentData['date_of_birth'] ?? $patient->date_of_birth,
            'gender' => $appointmentData['gender'] ?? $patient->gender,
            'civil_status' => $appointmentData['civil_status'] ?? $patient->civil_status,
            'nationality' => $appointmentData['nationality'] ?? $patient->nationality,
            'religion' => $appointmentData['religion'] ?? $patient->religion,
            'country' => $appointmentData['country'] ?? $patient->country,
            'region' => $appointmentData['region'] ?? $patient->region,
            'province' => $appointmentData['province'] ?? $patient->province,
            'city' => $appointmentData['city'] ?? $patient->city,
            'barangay' => $appointmentData['barangay'] ?? $patient->barangay,
            'street' => $appointmentData['street'] ?? $patient->street,
            'zip_code' => $appointmentData['zip_code'] ?? $patient->zip_code,
            'profile_picture' => $appointmentData['profile_picture'] ?? $patient->profile_picture,
        ]);

        return $patient;
    }

    /**
     * Migrate existing appointment data to patients table
     */
    public function migrateExistingAppointments()
    {
        $appointments = appointments::whereNull('patient_id')->get();
        $migratedCount = 0;

        // Group appointments by unique patient (email + name combination)
        $patientGroups = $appointments->groupBy(function($appointment) {
            return strtolower($appointment->email . '_' . $appointment->firstname . '_' . $appointment->lastname);
        });

        foreach ($patientGroups as $groupKey => $appointmentGroup) {
            try {
                DB::beginTransaction();

                // Use the first appointment as the base for patient data
                $firstAppointment = $appointmentGroup->first();
                
                // Find or create patient
                $patient = $this->findOrCreatePatient([
                    'user_id' => $firstAppointment->user_id,
                    'firstname' => $firstAppointment->firstname,
                    'lastname' => $firstAppointment->lastname,
                    'middlename' => $firstAppointment->middlename,
                    'suffix' => $firstAppointment->suffix,
                    'email' => $firstAppointment->email,
                    'phone' => $firstAppointment->phone,
                    'date_of_birth' => $firstAppointment->date_of_birth,
                    'gender' => $firstAppointment->gender,
                    'civil_status' => $firstAppointment->civil_status,
                    'nationality' => $firstAppointment->nationality,
                    'religion' => $firstAppointment->religion,
                    'country' => $firstAppointment->country,
                    'region' => $firstAppointment->region,
                    'province' => $firstAppointment->province,
                    'city' => $firstAppointment->city,
                    'barangay' => $firstAppointment->barangay,
                    'street' => $firstAppointment->street,
                    'zip_code' => $firstAppointment->zip_code,
                    'profile_picture' => $firstAppointment->profile_picture,
                ]);

                // Update all appointments in this group with patient_id
                appointments::whereIn('id', $appointmentGroup->pluck('id'))
                    ->update(['patient_id' => $patient->id]);

                DB::commit();
                $migratedCount += $appointmentGroup->count();

            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error('Failed to migrate patient group ' . $groupKey . ': ' . $e->getMessage());
            }
        }

        return $migratedCount;
    }
}
