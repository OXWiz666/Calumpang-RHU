<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        $stats = [
            'pending' => $prescriptions->where('status', 'pending')->count(),
            'dispensed' => $prescriptions->where('status', 'dispensed')->count(),
            'dispensed_today' => $prescriptions->where('status', 'dispensed')
                ->where('dispensed_at', '>=', now()->startOfDay())
                ->count(),
            'total' => $prescriptions->count(),
            'patients' => $patientCount
        ];

        return Inertia::render('Authenticated/Doctor/Dashboard', [
            'prescriptions' => $prescriptions,
            'recentPrescriptions' => $recentPrescriptions,
            'stats' => $stats
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

        $stats = [
            'pending' => $prescriptions->where('status', 'pending')->count(),
            'dispensed' => $prescriptions->where('status', 'dispensed')->count(),
            'dispensed_today' => $prescriptions->where('status', 'dispensed')
                ->where('dispensed_at', '>=', now()->startOfDay())
                ->count(),
            'total' => $prescriptions->count(),
            'patients' => $patientCount
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
        // Get patients from appointments table (same as Patient Records system)
        $patients = \App\Models\appointments::whereNull('user_id')
            ->whereNotNull('firstname')
            ->whereNotNull('lastname')
            ->select('firstname', 'lastname', 'middlename', 'email', 'phone', 'created_at')
            ->get()
            ->groupBy(function($appointment) {
                return strtolower($appointment->firstname . '_' . $appointment->lastname);
            })
            ->map(function($appointments, $nameKey) {
                $firstAppointment = $appointments->first();
                
                return [
                    'id' => 'PAT_' . strtoupper(substr($firstAppointment->firstname, 0, 3)) . '_' . 
                           strtoupper(substr($firstAppointment->lastname, 0, 3)) . '_' . 
                           $firstAppointment->created_at->format('Ymd'),
                    'name' => $firstAppointment->firstname . ' ' . $firstAppointment->lastname,
                    'first_name' => $firstAppointment->firstname,
                    'last_name' => $firstAppointment->lastname,
                    'middle_name' => $firstAppointment->middlename,
                    'email' => $firstAppointment->email,
                    'phone' => $firstAppointment->phone
                ];
            })
            ->values();

        // Get medicines from inventory table (same as Patient Record modal)
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
                    'category' => $item->icategory ? $item->icategory->name : 'General'
                ];
            })
            ->filter(function($medicine) {
                return $medicine['available_quantity'] > 0;
            })
            ->values();

        // Debug logging
        \Log::info('Medicines data for Create Prescription:', [
            'count' => $medicines->count(),
            'medicines' => $medicines->toArray()
        ]);

        return Inertia::render('Authenticated/Doctor/CreatePrescription', [
            'patients' => $patients,
            'medicines' => $medicines
        ]);
    }

    /**
     * Store new prescription
     */
    public function storePrescription(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|string',
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
            DB::beginTransaction();

            // Get patient name from the patient_id
            $patientName = '';
            if (preg_match('/^PAT_([A-Z]{3})_([A-Z]{3})_(\d{8})$/', $request->patient_id, $matches)) {
                $firstName = $matches[1];
                $lastName = $matches[2];
                
                // Find the full patient name from appointments
                $appointment = \App\Models\appointments::whereNull('user_id')
                    ->where('firstname', 'like', $firstName . '%')
                    ->where('lastname', 'like', $lastName . '%')
                    ->first();
                    
                if ($appointment) {
                    $patientName = $appointment->firstname . ' ' . $appointment->lastname;
                }
            }

            // Create prescription
            $prescription = Prescription::create([
                'patient_id' => $request->patient_id,
                'patient_name' => $patientName,
                'doctor_id' => Auth::id(),
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
                    'dosage' => $medicineData['dosage'],
                    'frequency' => $medicineData['frequency'],
                    'duration' => $medicineData['duration'],
                    'quantity' => $medicineData['quantity'],
                    'instructions' => $medicineData['instructions'] ?? '',
                    'is_dispensed' => false
                ]);
            }

            DB::commit();

            return redirect()->route('doctor.prescriptions')
                ->with('success', 'Prescription created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create prescription: ' . $e->getMessage()]);
        }
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
                'contact_number' => $patientInfo['contact_number'] ?? 'N/A'
            ],
            'doctor' => [
                'id' => $prescription->doctor->id,
                'name' => $prescription->doctor->firstname . ' ' . $prescription->doctor->lastname
            ],
            'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
            'status' => $prescription->status,
            'notes' => $prescription->notes,
            'medicines' => $prescription->medicines->map(function($medicine) {
                // Get medicine data from inventory table since medicine_id references inventory
                $inventoryItem = \App\Models\inventory::find($medicine->medicine_id);
                
                return [
                    'id' => $medicine->id,
                    'medicine' => [
                        'id' => $inventoryItem ? $inventoryItem->id : $medicine->medicine_id,
                        'name' => $inventoryItem ? $inventoryItem->name : 'Unknown Medicine',
                        'generic_name' => $inventoryItem ? $inventoryItem->generic_name : 'Unknown',
                        'unit' => $inventoryItem ? $inventoryItem->unit : 'pcs'
                    ],
                    'dosage' => $medicine->dosage,
                    'frequency' => $medicine->frequency,
                    'duration' => $medicine->duration,
                    'quantity' => $medicine->quantity,
                    'instructions' => $medicine->instructions,
                    'is_dispensed' => $medicine->is_dispensed
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
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        $user->update([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'phone' => $request->phone,
            'specialization' => $request->specialization,
            'bio' => $request->bio,
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
}
