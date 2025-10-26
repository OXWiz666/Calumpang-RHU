<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Prescription;
use App\Models\PrescriptionMedicine;
use App\Models\Patient;
use App\Models\Medicine;
use App\Models\MedicalRecord;

class DoctorController extends Controller
{
    public function index(){
        // Get prescriptions with patient data from Patient Records
        $prescriptions = Prescription::where('doctor_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($prescription) {
                return [
                    'id' => $prescription->id,
                    'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                    'patient_name' => $prescription->patient_name ?: 'Unknown Patient',
                    'patient_id' => $prescription->patient_id,
                    'status' => $prescription->status,
                    'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
                    'created_at' => $prescription->created_at->format('Y-m-d H:i:s')
                ];
            });

        $recentPrescriptions = $prescriptions->take(5);

        // Get patient count from Patient Records (appointments table)
        $patientCount = \App\Models\appointments::whereNull('user_id')
            ->whereNotNull('firstname')
            ->whereNotNull('lastname')
            ->distinct('firstname', 'lastname')
            ->count();

        // Get total diagnosis count for the current doctor
        $totalDiagnoses = \App\Models\MedicalRecord::where('doctor_id', Auth::id())
            ->whereNotNull('diagnosis')
            ->where('diagnosis', '!=', '')
            ->count();

        $stats = [
            'pending' => $prescriptions->where('status', 'pending')->count(),
            'dispensed' => $prescriptions->where('status', 'dispensed')->count(),
            'dispensed_today' => $prescriptions->where('status', 'dispensed')
                ->where('dispensed_at', '>=', now()->startOfDay())
                ->count(),
            'total' => $prescriptions->count(),
            'patients' => $patientCount,
            'diagnoses' => $totalDiagnoses
        ];

        // Get all appointments for diagnosis modal (not just unique patients)
        $allAppointments = \App\Models\appointments::with(['service'])
            ->whereIn('status', [1, 5]) // Both scheduled (1) and confirmed (5) appointments
            ->select('id', 'firstname', 'lastname', 'date', 'servicetype_id', 'status')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function($appointment) {
                return [
                    'id' => $appointment->id,
                    'firstname' => $appointment->firstname,
                    'lastname' => $appointment->lastname,
                    'appointment_date' => $appointment->date,
                    'service_name' => $appointment->service ? $appointment->service->servicename : 'General Consultation',
                    'status' => $appointment->status
                ];
            });

        // Get unique patients for the dropdown
        $appointments = $allAppointments->unique(function($appointment) {
            return $appointment['firstname'] . ' ' . $appointment['lastname'];
        })->values();

        return Inertia::render('Authenticated/Doctor/Dashboard', [
            'prescriptions' => $prescriptions,
            'recentPrescriptions' => $recentPrescriptions,
            'stats' => $stats,
            'appointments' => $appointments,
            'allAppointments' => $allAppointments
        ]);
    }

    /**
     * Get dashboard data for real-time updates
     */
    public function getDashboardData()
    {
        $prescriptions = Prescription::where('doctor_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($prescription) {
                return [
                    'id' => $prescription->id,
                    'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                    'patient_name' => $prescription->patient_name ?: 'Unknown Patient',
                    'status' => $prescription->status,
                    'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
                    'created_at' => $prescription->created_at->format('Y-m-d H:i:s')
                ];
            });

        $recentPrescriptions = $prescriptions->take(5);

        // Get patient count from Patient Records (appointments table)
        $patientCount = \App\Models\appointments::whereNull('user_id')
            ->whereNotNull('firstname')
            ->whereNotNull('lastname')
            ->distinct('firstname', 'lastname')
            ->count();

        // Get total diagnosis count for the current doctor
        $totalDiagnoses = \App\Models\MedicalRecord::where('doctor_id', Auth::id())
            ->whereNotNull('diagnosis')
            ->where('diagnosis', '!=', '')
            ->count();

        $stats = [
            'pending' => $prescriptions->where('status', 'pending')->count(),
            'dispensed' => $prescriptions->where('status', 'dispensed')->count(),
            'dispensed_today' => $prescriptions->where('status', 'dispensed')
                ->where('dispensed_at', '>=', now()->startOfDay())
                ->count(),
            'total' => $prescriptions->count(),
            'patients' => $patientCount,
            'diagnoses' => $totalDiagnoses
        ];

        return response()->json([
            'prescriptions' => $prescriptions,
            'recentPrescriptions' => $recentPrescriptions,
            'stats' => $stats
        ]);
    }

    /**
     * Show prescriptions page
     */
    public function prescriptions()
    {
        $prescriptions = Prescription::with(['medicines'])
            ->where('doctor_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($prescription) {
                return [
                    'id' => $prescription->id,
                    'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                    'patient_name' => $prescription->patient_name, // Use the stored patient_name field
                    'patient_id' => $prescription->patient_id,
                    'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
                    'status' => $prescription->status,
                    'medicines_count' => $prescription->medicines->count(),
                    'notes' => $prescription->notes,
                    'created_at' => $prescription->created_at->format('Y-m-d H:i:s')
                ];
            });

        return Inertia::render('Authenticated/Doctor/Prescriptions', [
            'prescriptions' => $prescriptions
        ]);
    }

    /**
     * Show create prescription form
     */
    public function createPrescription()
    {
        // Get medical record IDs that already have prescriptions (dispensed or pending)
        $dispensedMedicalRecordIds = \App\Models\Prescription::whereIn('status', ['dispensed', 'pending'])
            ->pluck('medical_record_id')
            ->toArray();

        // Get patients who have medical records (diagnoses) from the current doctor
        // Exclude those that already have prescriptions and admin medical records
        $medicalRecords = \App\Models\MedicalRecord::with(['appointment'])
            ->where('doctor_id', Auth::id())
            ->whereNotNull('diagnosis')
            ->where('diagnosis', '!=', '')
            ->whereNotNull('appointment_id') // Only include appointment-based medical records
            ->whereNull('admin_data') // Exclude admin medical records
            ->whereNotIn('id', $dispensedMedicalRecordIds) // Exclude already dispensed diagnoses
            ->get()
            ->map(function($record) {
                return [
                    'id' => $record->id,
                    'patient_name' => $record->appointment ? 
                        $record->appointment->firstname . ' ' . $record->appointment->lastname : 
                        'Unknown Patient',
                    'diagnosis' => $record->diagnosis,
                    'record_date' => $record->created_at->format('Y-m-d'),
                    'appointment_id' => $record->appointment_id,
                    'patient_id' => $record->appointment ? 
                        'PAT_' . strtoupper(substr($record->appointment->firstname, 0, 3)) . '_' . strtoupper(substr($record->appointment->lastname, 0, 3)) . '_' . date('Ymd', strtotime($record->appointment->created_at)) : 
                        null
                ];
            })
            ->values();

        // Get medicines from inventory table - only show non-expired items with stock
        $medicines = \App\Models\inventory::with(['istocks', 'icategory'])
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
                    'batch_number' => $item->batch_number ?? 'N/A',
                    'expiry_date' => $item->expiry_date
                ];
            })
            ->filter(function($medicine) {
                // Only include medicines with stock AND not expired
                if ($medicine['available_quantity'] <= 0) return false;
                
                // Check if medicine is expired
                if ($medicine['expiry_date'] && $medicine['expiry_date'] !== 'N/A') {
                    $expiryDate = \Carbon\Carbon::parse($medicine['expiry_date']);
                    if ($expiryDate->isPast()) {
                        return false; // Exclude expired medicines
                    }
                }
                
                return true;
            })
            ->values();

        return Inertia::render('Authenticated/Doctor/CreatePrescription', [
            'medicalRecords' => $medicalRecords,
            'medicines' => $medicines
        ]);
    }

    /**
     * Show diagnosis history
     */
    public function diagnosisHistory()
    {
        // Get all diagnoses for the current doctor (exclude admin medical records)
        $diagnoses = MedicalRecord::with(['appointment', 'doctor'])
            ->where('doctor_id', Auth::id())
            ->whereNotNull('diagnosis')
            ->where('diagnosis', '!=', '')
            ->whereNull('admin_data') // Exclude admin medical records
            ->whereNotNull('appointment_id') // Only include appointment-based diagnoses
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($record) {
                return [
                    'id' => $record->id,
                    'patient_name' => $record->appointment ? 
                        $record->appointment->firstname . ' ' . $record->appointment->lastname : 
                        'Unknown Patient',
                    'patient_id' => $record->appointment ? $record->appointment->id : null,
                    'diagnosis' => $record->diagnosis,
                    'symptoms' => $record->symptoms,
                    'treatment_plan' => $record->treatment_plan,
                    'assessment' => $record->assessment,
                    'pertinent_findings' => $record->pertinent_findings,
                    'notes' => $record->notes,
                    'status' => $record->status ?? 'active',
                    'doctor_name' => $record->doctor ? 
                        $record->doctor->firstname . ' ' . $record->doctor->lastname : 
                        'Unknown Doctor',
                    'doctor_license_number' => $record->doctor ? $record->doctor->license_number : null,
                    'created_at' => $record->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $record->updated_at->format('Y-m-d H:i:s')
                ];
            });

        // Get unique patients for filter dropdown
        $patients = $diagnoses->unique('patient_name')->map(function($diagnosis) {
            return [
                'id' => $diagnosis['patient_id'] ?? 'unknown',
                'name' => $diagnosis['patient_name']
            ];
        })->values();

        return Inertia::render('Authenticated/Doctor/DiagnosisHistory', [
            'diagnoses' => $diagnoses,
            'patients' => $patients
        ]);
    }

    /**
     * Store diagnosis
     */
    public function storeDiagnosis(Request $request)
    {
        // Debug: Log the incoming request data
        \Log::info('Diagnosis request received', [
            'all_data' => $request->all(),
            'appointment_id' => $request->appointment_id,
            'appointment_id_type' => gettype($request->appointment_id),
            'has_appointment_id' => $request->has('appointment_id')
        ]);

        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'diagnosis' => 'required|string|max:255',
            'symptoms' => 'required|string',
            'treatment_plan' => 'nullable|string',
            'notes' => 'nullable|string',
            'pertinent_findings' => 'nullable|string'
        ]);

        try {
            // Create medical record with diagnosis
            $medicalRecord = MedicalRecord::create([
                'appointment_id' => $request->appointment_id,
                'doctor_id' => Auth::id(),
                'diagnosis' => $request->diagnosis,
                'symptoms' => $request->symptoms,
                'treatment_plan' => $request->treatment_plan,
                'notes' => $request->notes,
                'pertinent_findings' => $request->pertinent_findings,
                'created_at' => now(),
                'updated_at' => now()
            ]);

        return redirect()->back()->with('success', 'Diagnosis created successfully!');

    } catch (\Exception $e) {
        return redirect()->back()->withErrors(['error' => 'Error creating diagnosis: ' . $e->getMessage()]);
    }
}

/**
 * Get all appointments for a specific patient
 */
public function getPatientAppointments($firstname, $lastname)
{
    $appointments = \App\Models\appointments::with(['service'])
        ->where('firstname', $firstname)
        ->where('lastname', $lastname)
        ->whereIn('status', [1, 5]) // Both scheduled (1) and confirmed (5) appointments
        ->orderBy('date', 'desc')
        ->get()
        ->map(function($appointment) {
            return [
                'id' => $appointment->id,
                'firstname' => $appointment->firstname,
                'lastname' => $appointment->lastname,
                'appointment_date' => $appointment->date,
                'service_name' => $appointment->service ? $appointment->service->servicename : 'General Consultation',
                'status' => $appointment->status
            ];
        });

    return response()->json([
        'appointments' => $appointments
    ]);
}

    /**
     * Store new prescription
     */
    public function storePrescription(Request $request)
    {
        \Log::info('Prescription creation request received', [
            'request_data' => $request->all(),
            'user_id' => Auth::id(),
            'user_role' => Auth::user() ? Auth::user()->roleID : 'not_authenticated',
            'url' => $request->url(),
            'method' => $request->method(),
            'headers' => $request->headers->all()
        ]);

        $request->validate([
            'medical_record_id' => 'required|exists:medical_records,id',
            'prescription_date' => 'required|date|after_or_equal:today',
            'case_id' => 'required|string|max:255',
            'medicines' => 'required|array|min:1',
            'medicines.*.medicine_id' => 'required|exists:inventory,id',
            'medicines.*.frequency' => 'required|string',
            'medicines.*.duration' => 'required|string',
            'medicines.*.quantity' => 'required|integer|min:1',
            'medicines.*.instructions' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            // Get medical record and patient information
            $medicalRecord = \App\Models\MedicalRecord::with('appointment')->findOrFail($request->medical_record_id);
            
            // Verify the medical record belongs to the current doctor
            if ($medicalRecord->doctor_id !== Auth::id()) {
                return back()->withErrors(['error' => 'You can only create prescriptions for your own patients.']);
            }

            $patientName = $medicalRecord->appointment ? 
                $medicalRecord->appointment->firstname . ' ' . $medicalRecord->appointment->lastname : 
                'Unknown Patient';

            $patientId = $medicalRecord->appointment ? 
                'PAT_' . strtoupper(substr($medicalRecord->appointment->firstname, 0, 3)) . '_' . 
                strtoupper(substr($medicalRecord->appointment->lastname, 0, 3)) . '_' . 
                date('Ymd', strtotime($medicalRecord->appointment->created_at)) : 
                null;

            // Create prescription
            $prescription = Prescription::create([
                'patient_id' => $patientId,
                'patient_name' => $patientName,
                'doctor_id' => Auth::id(),
                'medical_record_id' => $medicalRecord->id,
                'prescription_date' => $request->prescription_date,
                'case_id' => $request->case_id,
                'status' => 'pending',
                'notes' => $request->notes
            ]);

            // Create prescription medicines
            foreach ($request->medicines as $medicineData) {
                PrescriptionMedicine::create([
                    'prescription_id' => $prescription->id,
                    'medicine_id' => $medicineData['medicine_id'],
                    'frequency' => $medicineData['frequency'],
                    'duration' => $medicineData['duration'],
                    'quantity' => $medicineData['quantity'],
                    'instructions' => $medicineData['instructions'] ?? '',
                    'is_dispensed' => false
                ]);
            }

            DB::commit();

            \Log::info('Prescription created successfully', [
                'prescription_id' => $prescription->id,
                'case_id' => $prescription->case_id,
                'medicines_count' => count($request->medicines)
            ]);

            return redirect()->route('doctor.prescriptions')->with('success', 'Prescription created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create prescription: ' . $e->getMessage()]);
        }
    }

    /**
     * Show create medical record form
     */
    public function createMedicalRecord()
    {
        // Get patients from appointments (non-registered patients) for the current doctor
        $patients = \App\Models\appointments::whereNull('user_id')
            ->whereNotNull('firstname')
            ->whereNotNull('lastname')
            ->select('id', 'firstname', 'lastname', 'middlename', 'email', 'phone', 'created_at')
            ->get()
            ->groupBy(function($appointment) {
                return strtolower($appointment->firstname . '_' . $appointment->lastname);
            })
            ->map(function($appointments, $nameKey) {
                $firstAppointment = $appointments->first();
                
                return [
                    'id' => $firstAppointment->id,
                    'name' => $firstAppointment->firstname . ' ' . $firstAppointment->lastname,
                    'first_name' => $firstAppointment->firstname,
                    'last_name' => $firstAppointment->lastname,
                    'middle_name' => $firstAppointment->middlename,
                    'email' => $firstAppointment->email,
                    'phone' => $firstAppointment->phone
                ];
            })
            ->values();

        return Inertia::render('Authenticated/Doctor/CreateMedicalRecord', [
            'patients' => $patients
        ]);
    }

    /**
     * Store new medical record
     */
    public function storeMedicalRecord(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'diagnosis' => 'required|string|min:3',
            'symptoms' => 'nullable|string',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'vital_signs' => 'nullable|array',
            'lab_results' => 'nullable|array',
            'follow_up_date' => 'nullable|date|after:today',
            'record_type' => 'required|in:consultation,checkup,emergency',
            'attachments' => 'nullable|array'
        ]);

        try {
            DB::beginTransaction();

            // Get appointment details
            $appointment = \App\Models\appointments::findOrFail($request->appointment_id);

            // Create medical record
            $medicalRecord = \App\Models\MedicalRecord::create([
                'patient_id' => null, // We'll use appointment_id instead
                'appointment_id' => $appointment->id,
                'doctor_id' => Auth::id(),
                'diagnosis' => $request->diagnosis,
                'symptoms' => $request->symptoms,
                'treatment' => $request->treatment,
                'notes' => $request->notes,
                'vital_signs' => $request->vital_signs,
                'lab_results' => $request->lab_results,
                'follow_up_date' => $request->follow_up_date,
                'record_type' => $request->record_type,
                'attachments' => $request->attachments
            ]);

            DB::commit();

            return redirect()->route('doctor.medical-records')
                ->with('success', 'Medical record created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create medical record: ' . $e->getMessage()]);
        }
    }

    /**
     * Store admin medical record (different from doctor medical records)
     */
    public function storeAdminMedicalRecord(Request $request, $patientId)
    {
        \Log::info('Admin Medical Record Request:', [
            'patient_id' => $patientId,
            'request_data' => $request->all(),
            'user_id' => Auth::id(),
            'user_role' => Auth::user() ? Auth::user()->roleID : 'not_authenticated',
            'method' => $request->method(),
            'url' => $request->url()
        ]);

        // No validation - allow all data to be changeable
        \Log::info('Processing medical record without validation');
        
        // Test response to see if controller is being called
        if ($request->has('test')) {
            \Log::info('TEST ROUTE CALLED - Controller is working!');
            return response()->json(['message' => 'Controller is working!', 'data' => $request->all()]);
        }
        
        // Always log that we reached the controller
        \Log::info('REACHED CONTROLLER - storeAdminMedicalRecord method called', [
            'patient_id_param' => $patientId,
            'request_all' => $request->all(),
            'user_id' => Auth::id(),
            'user_role' => Auth::user() ? Auth::user()->roleID : 'not_authenticated',
            'request_url' => $request->fullUrl(),
            'request_method' => $request->method(),
        ]);

        // Check if patient exists - handle both numeric ID and string patient_id
        \Log::info('Looking for patient with ID: ' . $patientId);
        $patient = null;
        
        // First try to find by numeric ID
        if (is_numeric($patientId)) {
            $patient = \App\Models\Patient::find($patientId);
        } else {
            // If it's a string, try to find by patient_id field
            $patient = \App\Models\Patient::where('patient_id', $patientId)->first();
        }
        
        // If not found in patients table, check if it's an appointment-based patient
        if (!$patient) {
            \Log::info('Patient not found in patients table, checking appointments table for ID: ' . $patientId);
            $appointment = \App\Models\appointments::where('id', $patientId)->first();
            if ($appointment) {
                \Log::info('Found appointment-based patient, creating patient record');
                // Create a patient record from the appointment data
                $patient = \App\Models\Patient::create([
                    'patient_id' => $patientId,
                    'firstname' => $appointment->firstname,
                    'lastname' => $appointment->lastname,
                    'middlename' => $appointment->middlename,
                    'email' => $appointment->email,
                    'phone' => $appointment->phone,
                    'date_of_birth' => $appointment->date_of_birth,
                    'gender' => $appointment->gender,
                    'address' => $appointment->address,
                    'street' => $appointment->street,
                    'barangay' => $appointment->barangay,
                    'city' => $appointment->city,
                    'province' => $appointment->province,
                    'region' => $appointment->region,
                    'zip_code' => $appointment->zip_code,
                    'country' => $appointment->country,
                    'civil_status' => $appointment->civil_status,
                    'nationality' => $appointment->nationality,
                    'religion' => $appointment->religion,
                    'bloodtype' => $appointment->bloodtype,
                    'status' => 'active'
                ]);
            }
        }
        
        // If still not found, create a new patient record with the provided data
        if (!$patient) {
            \Log::info('Creating new patient record with provided data');
            $nameParts = explode(' ', $request->name);
            $patient = \App\Models\Patient::create([
                'patient_id' => $patientId,
                'firstname' => $nameParts[0] ?? '',
                'lastname' => end($nameParts) ?? '',
                'middlename' => count($nameParts) > 2 ? implode(' ', array_slice($nameParts, 1, -1)) : null,
                'email' => null,
                'phone' => $request->contact_no,
                'date_of_birth' => $request->birthdate,
                'gender' => $request->sex,
                'address' => $request->address,
                'status' => 'active'
            ]);
        }
        
        if (!$patient) {
            \Log::error('Patient not found with ID: ' . $patientId);
            // Let's check what patients exist
            $allPatients = \App\Models\Patient::all(['id', 'patient_id', 'firstname', 'lastname']);
            \Log::info('Available patients: ', $allPatients->toArray());
            return back()->withErrors(['patient_id' => 'Patient not found.']);
        }

        try {
            DB::beginTransaction();

            // Debug: Log the request data
            \Log::info('Medical record request data:', [
                'weight' => $request->weight,
                'height' => $request->height,
                'temperature' => $request->temperature,
                'rr' => $request->rr,
                'pr' => $request->pr,
                'bp' => $request->bp,
                'bmi' => $request->bmi,
            ]);

            // Check if patient already has a medical record
            $existingRecord = \App\Models\MedicalRecord::where('patient_id', $patient->id)->first();
            if ($existingRecord) {
                \Log::warning('Attempt to add multiple medical records for patient', ['patient_id' => $patient->patient_id]);
                return back()->withErrors(['medical_record_exists' => 'This patient already has a medical record. Only one medical record entry is allowed per patient.']);
            }
            
            // Create new medical record for admin
            \Log::info('Creating new medical record for patient ID: ' . $patient->id . ' (patient_id: ' . $patient->patient_id . ')');
            $medicalRecord = \App\Models\MedicalRecord::create([
                'patient_id' => $patient->id, // Use the numeric ID from the patient model
                'appointment_id' => null, // Admin medical records don't require appointments
                'doctor_id' => Auth::id(),
                'diagnosis' => null, // No diagnosis for admin records
                'symptoms' => null, // No symptoms for admin records
                'treatment' => null, // No treatment for admin records
                'notes' => null, // No notes for admin records
                'vital_signs' => null,
                'lab_results' => null,
                'follow_up_date' => null,
                'record_type' => 'admin_entry',
                'attachments' => null,
                    // Store additional admin-specific data
                    'admin_data' => [
                        'name' => $request->name,
                        'birthdate' => $request->birthdate,
                        'sex' => $request->sex,
                        'address' => $request->address,
                        'age' => $request->age,
                        'name_of_mother' => $request->name_of_mother,
                        'name_of_father' => $request->name_of_father,
                        'contact_no' => $request->contact_no,
                        'date' => $request->date,
                        'time' => $request->time,
                        'nhts_status' => $request->nhts_status,
                        'past_medical_history' => $request->past_medical_history,
                        'past_surgical_history' => $request->past_surgical_history,
                        // Vital signs and measurements
                        'weight' => $request->weight,
                        'height' => $request->height,
                        'temperature' => $request->temperature,
                        'rr' => $request->rr,
                        'pr' => $request->pr,
                        'bp' => $request->bp,
                        'bmi' => $request->bmi,
                    ],
                    // Store vital signs in the main vital_signs field as well
                    'vital_signs' => [
                        'weight' => $request->weight,
                        'height' => $request->height,
                        'temperature' => $request->temperature,
                        'respiratory_rate' => $request->rr,
                        'pulse_rate' => $request->pr,
                        'blood_pressure' => $request->bp,
                        'bmi' => $request->bmi,
                    ]
                ]);

            DB::commit();

            \Log::info('Medical record created successfully', [
                'patient_id' => $patient->id,
                'medical_record_id' => $medicalRecord->id,
                'admin_data' => $medicalRecord->admin_data,
                'vital_signs' => $medicalRecord->vital_signs
            ]);

            return redirect('/auth/patients')
                ->with('success', 'Medical record created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create medical record: ' . $e->getMessage()]);
        }
    }

    /**
     * Show medical records list
     */
    public function medicalRecords()
    {
        $medicalRecords = \App\Models\MedicalRecord::with(['appointment', 'patient'])
            ->where('doctor_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function($record) {
                // Get patient name from either appointment or patient relationship
                $patientName = 'Unknown Patient';
                if ($record->appointment) {
                    $patientName = $record->appointment->firstname . ' ' . $record->appointment->lastname;
                } elseif ($record->patient) {
                    $patientName = $record->patient->firstname . ' ' . $record->patient->lastname;
                } elseif ($record->admin_data && isset($record->admin_data['name'])) {
                    $patientName = $record->admin_data['name'];
                }

                return [
                    'id' => $record->id,
                    'patient_name' => $patientName,
                    'diagnosis' => $record->diagnosis,
                    'record_type' => $record->record_type,
                    'created_at' => $record->created_at->format('Y-m-d H:i'),
                    'follow_up_date' => $record->follow_up_date ? $record->follow_up_date->format('Y-m-d') : null,
                    'is_admin_record' => !is_null($record->admin_data),
                    'admin_data' => $record->admin_data
                ];
            });

        return Inertia::render('Authenticated/Doctor/MedicalRecords', [
            'medicalRecords' => $medicalRecords
        ]);
    }

    /**
     * Show prescription details
     */
    public function showPrescription(Prescription $prescription)
    {
        // Ensure doctor can only view their own prescriptions
        if ($prescription->doctor_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $prescription->load(['medicines', 'doctor']);

        // Get patient info from appointments table using the patient_id
        $patientInfo = $prescription->getPatientInfo();

        $prescriptionData = [
            'id' => $prescription->id,
            'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
            'patient' => [
                'id' => $prescription->patient_id,
                'name' => $prescription->patient_name ?: 'Unknown Patient',
                'first_name' => $patientInfo['first_name'] ?? 'N/A',
                'last_name' => $patientInfo['last_name'] ?? 'N/A',
                'middle_name' => $patientInfo['middle_name'] ?? 'N/A',
                'date_of_birth' => $patientInfo['date_of_birth'] ?? 'N/A',
                'age' => $patientInfo['age'] ?? 'N/A',
                'gender' => $patientInfo['gender'] ?? 'N/A',
                'contact_number' => $patientInfo['contact_number'] ?? 'N/A',
                'address' => $patientInfo['address'] ?? 'N/A'
            ],
            'doctor' => [
                'id' => $prescription->doctor->id,
                'name' => $prescription->doctor->firstname . ' ' . $prescription->doctor->lastname,
                'license_number' => $prescription->doctor->license_number ?? 'N/A'
            ],
            'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
            'status' => $prescription->status,
            'notes' => $prescription->notes,
            'medicines' => $prescription->medicines->map(function($medicine) {
                // Get medicine data from inventory table (medicine_id points to inventory)
                $inventoryItem = \App\Models\inventory::find($medicine->medicine_id);
                
                // Get prescription status from the medicine's relationship
                $prescriptionStatus = $medicine->prescription->status;
                
                // If prescription is dispensed, all medicines should be marked as dispensed
                $isDispensed = $medicine->is_dispensed || $prescriptionStatus === 'dispensed';
                
                // Fix data inconsistency: if prescription is dispensed but medicine is not marked as dispensed
                if ($prescriptionStatus === 'dispensed' && !$medicine->is_dispensed) {
                    $medicine->update(['is_dispensed' => true]);
                }
                
                return [
                    'id' => $medicine->id,
                    'medicine' => [
                        'id' => $inventoryItem ? $inventoryItem->id : $medicine->medicine_id,
                        'name' => $inventoryItem ? $inventoryItem->name : 'Unknown Medicine',
                        'generic_name' => $inventoryItem ? $inventoryItem->generic_name : 'Unknown',
                        'unit' => $inventoryItem ? $inventoryItem->unit : 'pcs'
                    ],
                    'frequency' => $medicine->frequency,
                    'duration' => $medicine->duration,
                    'quantity' => $medicine->quantity,
                    'instructions' => $medicine->instructions,
                    'is_dispensed' => $isDispensed
                ];
            }),
            'created_at' => $prescription->created_at->format('Y-m-d H:i:s'),
            'dispensed_at' => $prescription->dispensed_at ? $prescription->dispensed_at->format('Y-m-d H:i:s') : null
        ];

        return Inertia::render('Authenticated/Doctor/ViewPrescription', [
            'prescription' => $prescriptionData
        ]);
    }

    /**
     * Get patients for dropdown
     */
    public function getPatients()
    {
        $patients = \App\Models\User::whereHas('role', function($query) {
                $query->where('roletype', 'Patient');
            })
            ->select('id', 'firstname', 'lastname', 'middlename', 'contact_number')
            ->get()
            ->map(function($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->firstname . ' ' . $patient->lastname,
                    'first_name' => $patient->firstname,
                    'last_name' => $patient->lastname,
                    'middle_name' => $patient->middlename,
                    'contact_number' => $patient->contact_number ?? 'N/A'
                ];
            });

        return response()->json($patients);
    }

    /**
     * Get medicines for dropdown
     */
    public function getMedicines()
    {
        $medicines = Medicine::available()
            ->select('id', 'name', 'generic_name', 'unit', 'quantity')
            ->get()
            ->map(function($medicine) {
                return [
                    'id' => $medicine->id,
                    'name' => $medicine->name,
                    'generic_name' => $medicine->generic_name,
                    'unit' => $medicine->unit,
                    'available_quantity' => $medicine->quantity
                ];
            });

        return response()->json($medicines);
    }

    /**
     * Show the doctor settings page
     */
    public function settings()
    {
        $user = Auth::user();
        
        return Inertia::render('Authenticated/Doctor/Settings', [
            'user' => $user
        ]);
    }

    /**
     * Update doctor profile information
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'contactno' => 'required|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();
        $updateData = [
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'contactno' => $request->contactno,
        ];

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && \Storage::disk('public')->exists($user->avatar)) {
                \Storage::disk('public')->delete($user->avatar);
            }
            
            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar'] = $avatarPath;
        }

        $user->update($updateData);
        
        // Refresh user to get updated avatar_url
        $user->refresh();

        \Log::info('Doctor profile updated', [
            'user_id' => $user->id,
            'avatar_path' => $user->avatar,
            'avatar_url' => $user->avatar_url,
            'update_data' => $updateData,
            'request_files' => $request->allFiles()
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Update doctor password
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();
        $user->update([
            'password' => bcrypt($request->password),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully!');
    }

    /**
     * Update diagnosis
     */
    public function updateDiagnosis(Request $request, $id)
    {
        try {
            $request->validate([
                'diagnosis' => 'nullable|string|max:1000',
                'symptoms' => 'nullable|string|max:1000',
                'treatment_plan' => 'nullable|string|max:1000',
                'assessment' => 'nullable|string|max:1000',
                'pertinent_findings' => 'nullable|string|max:1000',
                'status' => 'nullable|string|in:active,completed,follow_up,archived'
            ]);

            $medicalRecord = MedicalRecord::where('id', $id)
                ->where('doctor_id', Auth::id())
                ->firstOrFail();

            $updateData = [];
            if ($request->has('diagnosis')) $updateData['diagnosis'] = $request->diagnosis;
            if ($request->has('symptoms')) $updateData['symptoms'] = $request->symptoms;
            if ($request->has('treatment_plan')) $updateData['treatment_plan'] = $request->treatment_plan;
            if ($request->has('assessment')) $updateData['assessment'] = $request->assessment;
            if ($request->has('pertinent_findings')) $updateData['pertinent_findings'] = $request->pertinent_findings;
            if ($request->has('status')) $updateData['status'] = $request->status;

            $medicalRecord->update($updateData);

            return redirect()->back()->with('success', 'Diagnosis updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error updating diagnosis: ' . $e->getMessage()]);
        }
    }
    public function updateAdminMedicalRecord(Request $request, $patientId, $medicalRecordId)
    {
        \Log::info('=== UPDATE ADMIN MEDICAL RECORD CALLED ===');
        \Log::info('Update admin medical record called', [
            'patient_id' => $patientId,
            'medical_record_id' => $medicalRecordId,
            'request_data' => $request->all(),
            'user_id' => Auth::id(),
            'user_role' => Auth::user() ? Auth::user()->roleID : 'not_authenticated',
            'user_name' => Auth::user() ? Auth::user()->firstname . ' ' . Auth::user()->lastname : 'not_authenticated'
        ]);

        // Find the patient using the provided patient_id (e.g., PAT_JUD_LES_20251025)
        $patient = \App\Models\Patient::where('patient_id', $patientId)->first();

        if (!$patient) {
            \Log::error('Patient not found for medical record update', ['patient_id' => $patientId]);
            return back()->withErrors(['patient_id' => 'Patient not found.']);
        }

        // Find the medical record
        $medicalRecord = \App\Models\MedicalRecord::where('id', $medicalRecordId)
            ->where('patient_id', $patient->id)
            ->first();

        if (!$medicalRecord) {
            \Log::error('Medical record not found for update', [
                'patient_id' => $patient->id,
                'medical_record_id' => $medicalRecordId
            ]);
            return back()->withErrors(['medical_record' => 'Medical record not found.']);
        }

        try {
            DB::beginTransaction();

            // Debug: Log the request data
            \Log::info('Medical record update request data:', [
                'weight' => $request->weight,
                'height' => $request->height,
                'temperature' => $request->temperature,
                'rr' => $request->rr,
                'pr' => $request->pr,
                'bp' => $request->bp,
                'bmi' => $request->bmi,
            ]);

            // Update the medical record
            $medicalRecord->update([
                'doctor_id' => Auth::id(),
                'admin_data' => [
                    'name' => $request->name,
                    'birthdate' => $request->birthdate,
                    'sex' => $request->sex,
                    'address' => $request->address,
                    'age' => $request->age,
                    'name_of_mother' => $request->name_of_mother,
                    'name_of_father' => $request->name_of_father,
                    'contact_no' => $request->contact_no,
                    'date' => $request->date,
                    'time' => $request->time,
                    'nhts_status' => $request->nhts_status,
                    'past_medical_history' => $request->past_medical_history,
                    'past_surgical_history' => $request->past_surgical_history,
                    // Vital signs and measurements
                    'weight' => $request->weight,
                    'height' => $request->height,
                    'temperature' => $request->temperature,
                    'rr' => $request->rr,
                    'pr' => $request->pr,
                    'bp' => $request->bp,
                    'bmi' => $request->bmi,
                ],
                // Store vital signs in the main vital_signs field as well
                'vital_signs' => [
                    'weight' => $request->weight,
                    'height' => $request->height,
                    'temperature' => $request->temperature,
                    'respiratory_rate' => $request->rr,
                    'pulse_rate' => $request->pr,
                    'blood_pressure' => $request->bp,
                    'bmi' => $request->bmi,
                ]
            ]);

            DB::commit();

            \Log::info('Medical record updated successfully', [
                'patient_id' => $patient->id,
                'medical_record_id' => $medicalRecord->id,
                'admin_data' => $medicalRecord->admin_data,
                'vital_signs' => $medicalRecord->vital_signs
            ]);

            return redirect('/auth/patients')
                ->with('success', 'Medical record updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to update medical record: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update medical record: ' . $e->getMessage()]);
        }
    }
}
