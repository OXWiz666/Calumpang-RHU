<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\doctor_details;
use App\Models\medical_history;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class PatientsController extends Controller
{
    //

    public function index(){
        // Get all patients from appointments (guest patients only)
        $appointmentPatients = \App\Models\appointments::whereNull('user_id')
            ->whereNotNull('firstname')
            ->whereNotNull('lastname')
            ->select('firstname', 'lastname', 'middlename', 'email', 'phone', 'date_of_birth', 'gender', 'civil_status', 'nationality', 'religion', 'country', 'region', 'province', 'city', 'barangay', 'street', 'zip_code', 'profile_picture', 'created_at')
            ->get()
            ->groupBy(function($appointment) {
                return strtolower($appointment->firstname . '_' . $appointment->lastname);
            })
            ->map(function($appointments, $nameKey) {
                // Prioritize appointments with profile pictures
                $appointmentWithPicture = $appointments->whereNotNull('profile_picture')->first();
                $firstAppointment = $appointmentWithPicture ?: $appointments->first();
                $appointmentCount = $appointments->count();
                
                return [
                    'id' => 'PAT_' . strtoupper(substr($firstAppointment->firstname, 0, 3)) . '_' . 
                           strtoupper(substr($firstAppointment->lastname, 0, 3)) . '_' . 
                           $firstAppointment->created_at->format('Ymd'),
                    'firstname' => $firstAppointment->firstname,
                    'lastname' => $firstAppointment->lastname,
                    'middlename' => $firstAppointment->middlename,
                    'email' => $firstAppointment->email,
                    'contactno' => $firstAppointment->phone,
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
                    'registration_date' => $firstAppointment->created_at,
                    'appointment_count' => $appointmentCount,
                    'last_appointment' => $appointments->max('created_at'),
                    'patient_type' => 'Patient',
                    'status' => 'active'
                ];
            })
            ->values();

        return Inertia::render('Authenticated/Admin/Patients/page', [
            'patients_' => $appointmentPatients,
            'doctors' => doctor_details::with(['user'])->get(),
        ]);
    }


    public function PatientDetails($id){
        // Check if this is an appointment patient (ID starts with PAT_)
        if (str_starts_with($id, 'PAT_')) {
            // Parse the appointment patient ID to get the name and date
            $parts = explode('_', $id);
            if (count($parts) >= 4) {
                $firstName = $parts[1];
                $lastName = $parts[2];
                $date = $parts[3];
                
                // Find the appointment record (prioritize one with profile picture)
                $appointment = \App\Models\appointments::whereNull('user_id')
                    ->where('firstname', 'like', $firstName . '%')
                    ->where('lastname', 'like', $lastName . '%')
                    ->whereDate('created_at', \Carbon\Carbon::createFromFormat('Ymd', $date))
                    ->select('firstname', 'lastname', 'middlename', 'email', 'phone', 'date_of_birth', 'gender', 'civil_status', 'nationality', 'religion', 'country', 'region', 'province', 'city', 'barangay', 'street', 'zip_code', 'profile_picture', 'created_at')
                    ->orderByRaw('CASE WHEN profile_picture IS NOT NULL THEN 0 ELSE 1 END')
                    ->orderBy('created_at', 'asc')
                    ->first();
                    
                if ($appointment) {
                    // Get all appointments for this patient
                    $allAppointments = \App\Models\appointments::whereNull('user_id')
                        ->where('firstname', 'like', $firstName . '%')
                        ->where('lastname', 'like', $lastName . '%')
                        ->get();
                    
                    // Create a patient object similar to User model
                    $patient = (object) [
                        'id' => $id,
                        'firstname' => $appointment->firstname,
                        'lastname' => $appointment->lastname,
                        'middlename' => $appointment->middlename,
                        'email' => $appointment->email,
                        'phone' => $appointment->phone,
                        'contactno' => $appointment->phone,
                        'date_of_birth' => $appointment->date_of_birth,
                        'gender' => $appointment->gender,
                        'civil_status' => $appointment->civil_status,
                        'nationality' => $appointment->nationality,
                        'religion' => $appointment->religion,
                        'country' => $appointment->country,
                        'region' => $appointment->region,
                        'province' => $appointment->province,
                        'city' => $appointment->city,
                        'barangay' => $appointment->barangay,
                        'street' => $appointment->street,
                        'zip_code' => $appointment->zip_code,
                        'profile_picture' => $appointment->profile_picture,
                        'registration_date' => $appointment->created_at,
                        'appointment_count' => $allAppointments->count(),
                        'status' => 'active',
                        'prescriptions' => collect([]), // No prescriptions for appointment patients
                        'medical_histories' => collect([]), // No medical histories for appointment patients
                        'emercont' => null // No emergency contact for appointment patients
                    ];
                } else {
                    abort(404, 'Appointment patient not found');
                }
            } else {
                abort(404, 'Invalid appointment patient ID');
            }
        } else {
            // Regular registered user
            $patient = User::with([
                'emercont',
                'medical_histories',
                'medical_histories.doctor.user',
                'prescriptions',
                'prescriptions.doctor',
                'prescriptions.medicines.medicine'
            ])->findOrFail($id);
        }

        // Format prescriptions data for frontend (only for registered users)
        $formattedPrescriptions = collect([]);
        if (method_exists($patient, 'prescriptions') && $patient->prescriptions) {
            $formattedPrescriptions = $patient->prescriptions->map(function($prescription) {
                return [
                    'id' => $prescription->id,
                    'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                    'patient_name' => $prescription->patient ? $prescription->patient->firstname . ' ' . $prescription->patient->lastname : 'Unknown Patient',
                    'patient_id' => $prescription->patient_id,
                    'doctor_name' => $prescription->doctor ? $prescription->doctor->firstname . ' ' . $prescription->doctor->lastname : 'Unknown Doctor',
                    'doctor_id' => $prescription->doctor_id,
                    'case_id' => $prescription->case_id,
                    'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
                    'status' => $prescription->status,
                    'notes' => $prescription->notes,
                    'medicines' => $prescription->medicines->map(function($medicine) {
                    // Get inventory item data
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
                    'category' => $item->icategory ? $item->icategory->name : 'General'
                ];
            })
            ->filter(function($medicine) {
                return $medicine['available_quantity'] > 0;
            })
            ->values();

        // Debug logging
        \Log::info('Medicines data for patient details:', [
            'count' => $medicinesData->count(),
            'medicines' => $medicinesData->toArray()
        ]);

        // Set prescriptions relation for registered users, or update the object for appointment patients
        if (method_exists($patient, 'setRelation')) {
            $patient->setRelation('prescriptions', $formattedPrescriptions);
        } else {
            // For appointment patients, update the prescriptions property
            $patient->prescriptions = $formattedPrescriptions;
        }

            $data = [
                'patient' => $patient,
                'doctors' => doctor_details::with(['user'])->get(),
                'medicines' => $medicinesData->toArray(), // Convert collection to array
                'isAdminView' => true, // Flag to indicate this is Admin view
            ];


        \Log::info('Inertia data being sent:', [
            'medicines_count' => count($data['medicines']),
            'medicines_data' => $data['medicines']
        ]);

        return Inertia::render('Authenticated/Admin/Patients/details', $data);
    }

    public function update(Request $request, $id)
    {
        // Check if this is an appointment patient (ID starts with PAT_)
        if (str_starts_with($id, 'PAT_')) {
            // Parse the appointment patient ID to get the name and date
            $parts = explode('_', $id);
            if (count($parts) >= 4) {
                $firstName = $parts[1];
                $lastName = $parts[2];
                $date = $parts[3];
                
                // Find the appointment record
                $appointment = \App\Models\appointments::whereNull('user_id')
                    ->where('firstname', 'like', $firstName . '%')
                    ->where('lastname', 'like', $lastName . '%')
                    ->whereDate('created_at', \Carbon\Carbon::createFromFormat('Ymd', $date))
                    ->orderBy('created_at', 'asc')
                    ->first();
                    
                if ($appointment) {
                    // Update the appointment record with new data
                    $appointment->update([
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
                    return redirect()->back()->with('error', 'Appointment patient not found.');
                }
            } else {
                return redirect()->back()->with('error', 'Invalid appointment patient ID.');
            }
        } else {
            // Handle regular user updates
            $user = User::findOrFail($id);
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

    /*
        HTTP Method	URI	Action	Route Name
        GET	        /posts	            index	posts.index
        GET	        /posts/create	    create	posts.create
        POST	    /posts	            store   posts.store
        GET	        /posts/{post}	    show	posts.show
        GET	        /posts/{post}/edit	edit	posts.edit
        PUT/PATCH	/posts/{post}	    update	posts.update
        DELETE	    /posts/{post}	    destroy	posts.destroy

    */

    public function add_medical_rec(Request $request, User $patientid){
        //dd($request);

        $request->validate([
            'date' => 'required|date',
            'diagnosis' => 'required|min:3',
            // 'treatment' => 'required|min:3',
            'doctor' => 'required',
            // 'notes' => 'required|min:3',
            // 'followUp' => 'required|min:3',
        ]);

        medical_history::insert([
            'user_id' => $patientid->id,
            'doctor_id' => $request->doctor,
            'diagnosis' => $request->diagnosis,
            'treatment' => $request->treatment,
            'clinic_notes' => $request->notes,
            'followup_inst' => $request->followUp,
            //'created_at' => $request->date,
        ]);
        //$patient = new User();

        return back()->with([
            'flash' => [
                'icon' => 'success',
                'message' => 'Added Successfully!',
                'title' => "Success!"
            ]
        ]);
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
                    'medicine_id' => $medicineData['medicine_id'], // This will be inventory item ID
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
}
