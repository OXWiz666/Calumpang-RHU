<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\appointments;
use App\Models\Patient;
use App\Models\doctor_details;
use App\Models\medical_history;
use App\Models\User;
use App\Services\PatientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PatientsController extends Controller
{
    protected $patientService;

    public function __construct(PatientService $patientService)
    {
        $this->patientService = $patientService;
    }

    public function index()
    {
        // Get all patients from the patients table
        $patients = Patient::with(['user', 'appointments.service', 'appointments.subservice', 'medicalRecords.doctor'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($patient) {
                // Format medical records for the list view
                $formattedMedicalRecords = $patient->medicalRecords->map(function($record) {
                    if ($record->admin_data && is_array($record->admin_data)) {
                        $adminData = $record->admin_data;
                        
                        // Debug: Log admin data
                        \Log::info('Admin medical record data:', [
                            'record_id' => $record->id,
                            'admin_data' => $adminData,
                            'weight' => $adminData['weight'] ?? 'not set',
                            'height' => $adminData['height'] ?? 'not set',
                            'temperature' => $adminData['temperature'] ?? 'not set',
                        ]);
                        
                        return [
                            'id' => $record->id,
                            'diagnosis' => null, // No diagnosis for admin records
                            'symptoms' => null, // No symptoms for admin records
                            'treatment' => null, // No treatment for admin records
                            'notes' => null, // No notes for admin records
                            'vital_signs' => null,
                            'lab_results' => null,
                            'record_type' => 'admin_entry',
                            'follow_up_date' => null,
                            'created_at' => $record->created_at->format('Y-m-d H:i:s'),
                            'appointment_date' => $adminData['date'] ?? null,
                            'appointment_service' => 'Medical Record',
                            'doctor_name' => $record->doctor ? $record->doctor->firstname . ' ' . $record->doctor->lastname : 'Admin User',
                            'admin_data' => $adminData
                        ];
                    } else {
                        return [
                            'id' => $record->id,
                            'diagnosis' => $record->diagnosis,
                            'symptoms' => $record->symptoms,
                            'treatment' => $record->treatment,
                            'notes' => $record->notes,
                            'vital_signs' => $record->vital_signs,
                            'lab_results' => $record->lab_results,
                            'record_type' => $record->record_type,
                            'follow_up_date' => $record->follow_up_date,
                            'created_at' => $record->created_at->format('Y-m-d H:i:s'),
                            'appointment_date' => $record->appointment ? $record->appointment->created_at->format('Y-m-d') : null,
                            'appointment_service' => $record->appointment && $record->appointment->service ? $record->appointment->service->servicename : null,
                            'doctor_name' => $record->doctor ? $record->doctor->firstname . ' ' . $record->doctor->lastname : 'Unknown Doctor'
                        ];
                    }
                });

                return [
                    'id' => $patient->patient_id,
                    'firstname' => $patient->firstname,
                    'lastname' => $patient->lastname,
                    'middlename' => $patient->middlename,
                    'email' => $patient->email,
                    'contactno' => $patient->phone,
                    'phone' => $patient->phone,
                    'date_of_birth' => $patient->date_of_birth,
                    'gender' => $patient->gender,
                    'civil_status' => $patient->civil_status,
                    'nationality' => $patient->nationality,
                    'religion' => $patient->religion,
                    'country' => $patient->country,
                    'region' => $patient->region,
                    'province' => $patient->province,
                    'city' => $patient->city,
                    'barangay' => $patient->barangay,
                    'street' => $patient->street,
                    'zip_code' => $patient->zip_code,
                    'profile_picture' => $patient->profile_picture,
                    'registration_date' => $patient->created_at,
                    'appointment_count' => $patient->appointments->count(),
                    'last_appointment' => $patient->appointments->sortByDesc('created_at')->first()?->created_at ?? null,
                    'last_visit_date' => $patient->appointments->sortByDesc('created_at')->first()?->created_at ?? null,
                    'patient_type' => $patient->user_id ? 'Registered' : 'Guest',
                    'status' => $patient->status,
                    'medical_records' => $formattedMedicalRecords->toArray(),
                    'medical_histories' => collect([]), // For backward compatibility
                ];
            });

        return Inertia::render('Authenticated/Admin/Patients/page', [
            'patients_' => $patients,
            'doctors' => doctor_details::with(['user'])->get(),
        ]);
    }

    public function PatientDetails($id)
    {
        \Log::info('Admin PatientDetails called with ID: ' . $id);
        
        // Check if this is a patient ID (starts with PAT_)
        if (str_starts_with($id, 'PAT_')) {
            $patient = Patient::with([
                'user',
                'appointments.service',
                'appointments.subservice',
                'appointments.doctor',
                'prescriptions.doctor',
                'prescriptions.medicines.medicine'
            ])->where('patient_id', $id)->first();

            if (!$patient) {
                \Log::error('Patient not found with patient_id: ' . $id);
                // Let's check what patients exist
                $allPatients = Patient::all(['id', 'patient_id', 'firstname', 'lastname']);
                \Log::info('Available patients: ', $allPatients->toArray());
                abort(404, 'Patient not found');
            }
            
            \Log::info('Found patient: ' . $patient->firstname . ' ' . $patient->lastname);
            // Medical records are not loaded for individual patient details page

            // Format prescriptions data
            $formattedPrescriptions = $patient->prescriptions->map(function($prescription) {
                return [
                    'id' => $prescription->id,
                    'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                    'patient_name' => $patient->firstname . ' ' . $patient->lastname,
                    'patient_id' => $patient->id,
                    'doctor_name' => $prescription->doctor ? $prescription->doctor->firstname . ' ' . $prescription->doctor->lastname : 'Unknown Doctor',
                    'doctor_id' => $prescription->doctor_id,
                    'case_id' => $prescription->case_id,
                    'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
                    'status' => $prescription->status,
                    'notes' => $prescription->notes,
                    'medicines' => $prescription->medicines->map(function($medicine) {
                        $inventoryItem = \App\Models\inventory::find($medicine->medicine_id);
                        return [
                            'id' => $medicine->id,
                            'medicine_name' => $inventoryItem ? $inventoryItem->name : 'Unknown Medicine',
                            'medicine_id' => $medicine->medicine_id,
                            'dosage' => $medicine->dosage,
                            'frequency' => $medicine->frequency,
                            'duration' => $medicine->duration,
                            'quantity' => $medicine->quantity,
                            'instructions' => $medicine->instructions,
                            'is_dispensed' => $medicine->is_dispensed
                        ];
                    }),
                    'created_at' => $prescription->created_at->format('Y-m-d H:i:s')
                ];
            });

            // Medical records are not displayed on individual patient details page

            // Create patient object for frontend
            $patientData = (object) [
                'id' => $patient->patient_id,
                'firstname' => $patient->firstname,
                'lastname' => $patient->lastname,
                'middlename' => $patient->middlename,
                'email' => $patient->email,
                'phone' => $patient->phone,
                'contactno' => $patient->phone,
                'date_of_birth' => $patient->date_of_birth,
                'gender' => $patient->gender,
                'civil_status' => $patient->civil_status,
                'nationality' => $patient->nationality,
                'religion' => $patient->religion,
                'country' => $patient->country,
                'region' => $patient->region,
                'province' => $patient->province,
                'city' => $patient->city,
                'barangay' => $patient->barangay,
                'street' => $patient->street,
                'zip_code' => $patient->zip_code,
                'profile_picture' => $patient->profile_picture,
                'registration_date' => $patient->created_at,
                'appointment_count' => $patient->appointments->count(),
                'last_visit_date' => $patient->appointments->orderBy('created_at', 'desc')->first()?->created_at ?? null,
                'status' => $patient->status,
                'prescriptions' => $formattedPrescriptions,
                'medical_histories' => collect([]), // For backward compatibility
                'medical_records' => [], // Medical records not displayed on individual patient details page
                'emercont' => null // No emergency contact for now
            ];

            // Debug: Log what's being sent to frontend
            \Log::info('Patient data being sent to frontend (medical records not included):', [
                'appointment_count' => $patientData['appointment_count'],
                'last_visit_date' => $patientData['last_visit_date']
            ]);

        } else {
            // Regular registered user (backward compatibility)
            $patient = User::with([
                'emercont',
                'medical_histories',
                'medical_histories.doctor.user',
                'prescriptions',
                'prescriptions.doctor',
                'prescriptions.medicines.medicine'
            ])->findOrFail($id);
            
            // Get appointment data for regular users
            $userAppointments = appointments::where('user_id', $patient->id)->get();
            
            if ($userAppointments->isNotEmpty()) {
                $patient->last_visit_date = $userAppointments->max('created_at');
                $patient->registration_date = $userAppointments->min('created_at');
            } else {
                $patient->last_visit_date = null;
                $patient->registration_date = $patient->created_at;
            }

            $patientData = $patient;
        }

        // Get medicines data
        $medicinesData = \App\Models\inventory::with(['istocks', 'icategory'])
            ->where('status', 1)
            ->get()
            ->map(function($item) {
                $totalQuantity = $item->istocks->sum('stocks');
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'generic_name' => $item->generic_name ?? $item->name,
                    'unit' => $item->unit ?? 'pcs',
                    'available_quantity' => $totalQuantity,
                    'category' => $item->icategory ? $item->icategory->name : 'General',
                    'batch_number' => $item->batch_number ?? 'N/A'
                ];
            })
            ->filter(function($medicine) {
                return $medicine['available_quantity'] > 0;
            })
            ->values();

        $data = [
            'patient' => $patientData,
            'doctors' => doctor_details::with(['user'])->get(),
            'medicines' => $medicinesData->toArray(),
            'isAdminView' => true,
        ];

        return Inertia::render('Authenticated/Admin/Patients/patient-details', $data);
    }

    public function update(Request $request, $id)
    {
        if (str_starts_with($id, 'PAT_')) {
            // Update patient in patients table
            $patient = Patient::where('patient_id', $id)->firstOrFail();
            
            // No validation - allow all data to be changeable
            
            $patient->update([
                'firstname' => $request->firstname,
                'middlename' => $request->middlename,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'phone' => $request->phone,
                'date_of_birth' => $request->date_of_birth,
                'gender' => $request->gender,
                'civil_status' => $request->civil_status,
                'nationality' => $request->nationality,
                'religion' => $request->religion,
                'country' => $request->country,
                'region' => $request->region,
                'province' => $request->province,
                'city' => $request->city,
                'barangay' => $request->barangay,
                'street' => $request->street,
                'zip_code' => $request->zip_code,
            ]);

            return redirect()->back()->with('success', 'Patient information updated successfully.');
        } else {
            // Handle regular user updates
            $user = User::findOrFail($id);
            
            // No validation - allow all data to be changeable
            
            $user->update([
                'firstname' => $request->firstname,
                'middlename' => $request->middlename,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'contactno' => $request->contactno,
                'birth' => $request->birth,
                'sex' => $request->sex,
                'address' => $request->address,
                'bloodtype' => $request->bloodtype,
            ]);

            return redirect()->back()->with('success', 'Patient information updated successfully.');
        }
    }

    public function add_medical_rec(Request $request, User $patientid)
    {
        $request->validate([
            'date' => 'required|date',
            'diagnosis' => 'required|min:3',
            'treatment' => 'nullable|string',
            'doctor' => 'required',
            'notes' => 'nullable|string',
            'followUp' => 'nullable|string',
            'symptoms' => 'nullable|string',
            'vital_signs' => 'nullable|array',
            'lab_results' => 'nullable|array',
            'record_type' => 'nullable|in:consultation,checkup,emergency',
        ]);

        try {
            // Find the most recent appointment for this patient
            $appointment = appointments::where('user_id', $patientid->id)
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$appointment) {
                return back()->with([
                    'flash' => [
                        'icon' => 'error',
                        'message' => 'No appointment found for this patient. Please create an appointment first.',
                        'title' => "Error!"
                    ]
                ]);
            }

            // Create medical record in the new medical_records table
            \App\Models\MedicalRecord::create([
                'patient_id' => $patientid->id,
                'appointment_id' => $appointment->id,
                'doctor_id' => $request->doctor,
                'diagnosis' => $request->diagnosis,
                'symptoms' => $request->symptoms ?? $request->notes,
                'treatment' => $request->treatment,
                'notes' => $request->followUp,
                'vital_signs' => $request->vital_signs ?? null,
                'lab_results' => $request->lab_results ?? null,
                'record_type' => $request->record_type ?? 'consultation',
                'follow_up_date' => $request->followUp ? \Carbon\Carbon::parse($request->followUp)->format('Y-m-d') : null
            ]);

            // Also keep the old medical_history for backward compatibility
            medical_history::insert([
                'user_id' => $patientid->id,
                'doctor_id' => $request->doctor,
                'diagnosis' => $request->diagnosis,
                'treatment' => $request->treatment,
                'clinic_notes' => $request->notes,
                'followup_inst' => $request->followUp,
            ]);

            return back()->with([
                'flash' => [
                    'icon' => 'success',
                    'message' => 'Medical record added successfully! You can now create prescriptions for this patient.',
                    'title' => "Success!"
                ]
            ]);

        } catch (\Exception $e) {
            return back()->with([
                'flash' => [
                    'icon' => 'error',
                    'message' => 'Failed to add medical record: ' . $e->getMessage(),
                    'title' => "Error!"
                ]
            ]);
        }
    }

    public function storePrescription(Request $request, User $patientid)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'prescription_date' => 'required|date|before_or_equal:today',
            'case_id' => 'required|string|max:255',
            'medicines' => 'required|array|min:1',
            'medicines.*.medicine_id' => 'required|exists:inventory,id',
            'medicines.*.dosage' => 'required|string',
            'medicines.*.frequency' => 'required|string',
            'medicines.*.duration' => 'required|string',
            'medicines.*.quantity' => 'required|integer|min:1',
            'medicines.*.instructions' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        try {
            \DB::beginTransaction();

            // Create prescription
            $prescription = \App\Models\Prescription::create([
                'patient_id' => $patientid->id,
                'doctor_id' => $request->doctor_id,
                'prescription_date' => $request->prescription_date,
                'case_id' => $request->case_id,
                'status' => 'pending',
                'notes' => $request->notes
            ]);

            // Create prescription medicines
            foreach ($request->medicines as $medicineData) {
                \App\Models\PrescriptionMedicine::create([
                    'prescription_id' => $prescription->id,
                    'medicine_id' => $medicineData['medicine_id'],
                    'dosage' => $medicineData['dosage'],
                    'frequency' => $medicineData['frequency'],
                    'duration' => $medicineData['duration'],
                    'quantity' => $medicineData['quantity'],
                    'instructions' => $medicineData['instructions'] ?? null,
                    'is_dispensed' => false
                ]);
            }

            \DB::commit();

            return back()->with([
                'flash' => [
                    'icon' => 'success',
                    'message' => 'Prescription created successfully!',
                    'title' => "Success!"
                ]
            ]);

        } catch (\Exception $e) {
            \DB::rollback();
            
            return back()->with([
                'flash' => [
                    'icon' => 'error',
                    'message' => 'Failed to create prescription: ' . $e->getMessage(),
                    'title' => "Error!"
                ]
            ]);
        }
    }

    /**
     * Get appointments for a specific patient
     */
    public function getPatientAppointments($patientId)
    {
        try {
            // Check if this is a patient ID (starts with PAT_)
            if (str_starts_with($patientId, 'PAT_')) {
                $patient = Patient::where('patient_id', $patientId)->first();
                if (!$patient) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Patient not found'
                    ], 404);
                }
                
                $appointments = appointments::with(['service', 'subservice', 'doctor.user'])
                    ->where('patient_id', $patient->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                // Regular user ID
                $appointments = appointments::with(['service', 'subservice', 'doctor.user'])
                    ->where('user_id', $patientId)
                    ->orderBy('created_at', 'desc')
                    ->get();
            }
            
            return response()->json([
                'success' => true,
                'appointments' => $appointments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch appointments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Migrate existing appointment data to patients table
     */
    public function migrate()
    {
        try {
            $migratedCount = $this->patientService->migrateExistingAppointments();
            
            return response()->json([
                'success' => true,
                'message' => "Successfully migrated {$migratedCount} appointments to patients table.",
                'migrated_count' => $migratedCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Migration failed: ' . $e->getMessage()
            ], 500);
        }
    }
}