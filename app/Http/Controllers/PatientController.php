<?php

namespace App\Http\Controllers;

use App\Events\SendNotification;
use App\Models\appointments;
use App\Models\medical_history;
use App\Models\servicetypes;
use App\Models\subservices;
use App\Notifications\SystemNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

use App\Models\User;
use App\Models\Patient;
use App\Services\ActivityLogger;
use App\Services\NotifSender;
use App\Services\PatientService;
use Illuminate\Validation\Rule;
use App\Mail\AppointmentConfirmationMail;
use Illuminate\Support\Facades\Mail;

class PatientController extends Controller
{
    protected $patientService;

    public function __construct(PatientService $patientService)
    {
        $this->patientService = $patientService;
    }
    public function profile(){
        // Get recent appointments for the current user
        $recentAppointments = appointments::with(['service','user', 'doctor', 'subservice'])
            ->where('user_id', Auth::user()->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function($appointment) {
                // Get service name from the relationship
                $serviceName = $appointment->service ? $appointment->service->servicename : 'General Checkup';

                // Get doctor name if available
                $doctorName = $appointment->doctor
                    ? $appointment->doctor->firstname . ' ' . $appointment->doctor->lastname
                    : 'Not Assigned';

                return [
                    'id' => $appointment->id,
                    'date' => $appointment->date,
                    'time' => $appointment->time,
                    'doctor' => $doctorName,
                    'purpose' => $serviceName,
                    'status' => $appointment->status,
                    'status_code' => is_numeric($appointment->status) ? (int)$appointment->status : 1,
                    'created_at' => $appointment->created_at->format('Y-m-d H:i:s'),
                    'service' => $appointment->service
                ];
            });

        return Inertia::render("Authenticated/Patient/ProfilePage",[
            'recentAppointments' => $recentAppointments
        ]);
    }


    public function update(Request $request){
        $cred = $request->validate([
            'firstname' => 'required|min:2',
            'middlename' => 'required|min:2',
            'lastname' => 'required|min:2',
            'email' => [
                'required',
                'min:3',
                Rule::unique('users')->ignore(Auth::user()->id)
            ] ,
            'phone' => [
                'required',
                'min:11',
                'numeric',
                Rule::unique('users', 'contactno')->ignore(Auth::user()->id,'id')
            ],
            // 'address' => 'required|min:3',
            'birthdate' => 'required',
            'gender' => "required|in:M,F"
        ]);

        $user = User::find(Auth::user()->id);
        if($user){
            $user->update([
                'firstname' => $request->firstname,
                'middlename' => $request->middlename,
                'lastname' => $request->lastname,
                'suffix' => $request->suffix,
                'email' => $request->email,
                'contactno' => $request->phone,
                'address' => $request->address,
                'birth' => $request->birthdate,
                'bloodtype' => $request->bloodtype,
                'gender' => $request->gender
            ]);
        }

        if($request->hasFile('avatar')){
            $this->uploadAvatar($request);
        }

        ActivityLogger::log("User updated profile information.",$user,['ip',request()->ip()]);
    }

    /**
     * Upload and update user avatar
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        if ($request->hasFile('avatar')) {
            // Delete old avatar if it exists
            if ($user->avatar && $user->avatar !== 'default-avatar.png' && Storage::disk('public')->exists('avatars/' . $user->avatar)) {
                Storage::disk('public')->delete('avatars/' . $user->avatar);
            }

            // Store new avatar
            $avatarName = 'avatar_' . $user->id . '_' . time() . '.' . $request->avatar->extension();
            $request->avatar->storeAs('avatars', $avatarName, 'public');

            // Update user record
            $user->update(['avatar' => $avatarName]);

            ActivityLogger::log("User updated profile avatar", $user, ['ip' => $request->ip()]);

            return redirect()->back()->with('success', 'Avatar updated successfully');
        }

        return redirect()->back()->with('error', 'Failed to upload avatar');
    }

    public function medicalrecords(){
        $user = Auth::user();
        return Inertia::render("Authenticated/Patient/MedicalRecordsPage",[
            'userData' => [
                'avatar' => $user->avatar
            ],
            'records' => medical_history::with(['attachments','doctor','doctor.user'])->where('user_id', $user->id)->orderBy('created_at','desc')->get(),
        ]);
    }

    public function appointments(){
        // Only get active services (status = 1, not archived)
        $serv = servicetypes::with(['servicedays'])
            ->where('status', 1) // Only show active services, not archived ones
            ->get();

        // Debug logging
        \Log::info('Services data:', [
            'count' => $serv->count(),
            'first_service' => $serv->first(),
            'is_collection' => $serv instanceof \Illuminate\Database\Eloquent\Collection
        ]);

        return Inertia::render('Authenticated/Patient/Appointments/Appointment',[
            'services' => $serv->toArray(),
            'ActiveTAB' => 'appointment'
        ]);
    }

    public function GetSubServices(Request $request,$id){
        // Only get active subservices (status = 1, not archived)
        $subservices = subservices::with(['times'])->where('service_id',$id)->where('status', 1)->get();
        
        // Get the selected date from request, default to today if not provided
        $selectedDate = $request->input('date', now()->format('Y-m-d'));
        $dayName = \Carbon\Carbon::parse($selectedDate)->format('l'); // Get day name (Monday, Tuesday, etc.)
        
        // Debug logging
        \Log::info('GetSubServices Debug:', [
            'service_id' => $id,
            'selected_date' => $selectedDate,
            'day_name' => $dayName,
            'subservices_count' => $subservices->count(),
            'request_date_param' => $request->input('date')
        ]);
        
        // Calculate real-time slot availability for each subservice
        $subservices->each(function($subservice) use ($selectedDate, $dayName) {
            \Log::info('Processing subservice:', [
                'subservice_id' => $subservice->id,
                'subservice_name' => $subservice->subservicename,
                'selected_date' => $selectedDate,
                'day_name' => $dayName
            ]);
            
            // Load day-based slot schedules for the selected day
            $daySchedule = DB::table('day_slot_schedules')
                ->where('subservice_id', $subservice->id)
                ->where('day', $dayName)
                ->first();
            
            \Log::info('Day Schedule Query Result:', [
                'subservice_id' => $subservice->id,
                'subservice_name' => $subservice->subservicename,
                'selected_date' => $selectedDate,
                'day_name' => $dayName,
                'day_schedule_found' => $daySchedule ? true : false,
                'day_schedule_data' => $daySchedule,
                'all_schedules_for_subservice' => DB::table('day_slot_schedules')->where('subservice_id', $subservice->id)->get(['day', 'time_slots'])
            ]);
            
            if ($daySchedule) {
                // Use day-based schedules
                $timeSlotsData = json_decode($daySchedule->time_slots, true);
                $times = [];
                
                \Log::info('Processing day schedule:', [
                    'subservice_id' => $subservice->id,
                    'time_slots_data' => $timeSlotsData,
                    'time_slots_count' => is_array($timeSlotsData) ? count($timeSlotsData) : 'not array'
                ]);
                
                if (is_array($timeSlotsData)) {
                    foreach ($timeSlotsData as $timeSlot) {
                        // Calculate available slots for this time slot on the specific date
                        $bookedAppointments = appointments::where('subservice_id', $subservice->id)
                            ->where('time', $timeSlot['time'])
                            ->where('date', $selectedDate)
                            ->whereIn('status', [1, 5, 6]) // Only count active appointments
                            ->count();
                        
                        $availableSlots = max(0, $timeSlot['capacity'] - $bookedAppointments);
                        
                        // Create time object similar to the old structure
                        $times[] = [
                            'id' => $subservice->id . '_' . $timeSlot['time'], // Generate unique ID
                            'time' => $timeSlot['time'],
                            'available_slots' => $availableSlots,
                            'booked_slots' => $bookedAppointments,
                            'max_slots' => $timeSlot['capacity'],
                            'is_day_schedule' => true,
                            'day' => $dayName
                        ];
                    }
                }
                
                $subservice->time_slots = collect($times);
                
                \Log::info('Generated Times for Day Schedule:', [
                    'subservice_id' => $subservice->id,
                    'times_count' => count($times),
                    'times' => $times,
                    'subservice_times_collection' => $subservice->times->toArray()
                ]);
            } else {
                // Fall back to old times system if no day schedule exists
                \Log::info('No day schedule found, using old times system', [
                    'subservice_id' => $subservice->id,
                    'old_times_count' => $subservice->times ? $subservice->times->count() : 0,
                    'old_times_data' => $subservice->times ? $subservice->times->toArray() : 'no times'
                ]);
                
                if ($subservice->times) {
                    $subservice->times->each(function($time) use ($subservice, $selectedDate) {
                        // Calculate available slots for this time slot on the specific date
                        $bookedAppointments = appointments::where('subservice_id', $subservice->id)
                            ->where('time', $time->time)
                            ->where('date', $selectedDate)
                            ->whereIn('status', [1, 5, 6])
                            ->count();
                        
                        $maxSlots = $time->max_slots ?? 5;
                        $availableSlots = max(0, $maxSlots - $bookedAppointments);
                        
                        // Add calculated fields to the time object
                        $time->available_slots = $availableSlots;
                        $time->booked_slots = $bookedAppointments;
                        $time->max_slots = $maxSlots;
                        $time->is_day_schedule = false;
                    });
                }
            }
        });
        
        \Log::info('Final Subservices Response:', [
            'subservices' => $subservices->toArray()
        ]);
        
        return response()->json($subservices);
    }

    public function lookupPatientByReference($referenceNumber){
        try {
            // Find the appointment by reference number
            $appointment = appointments::with(['user', 'service', 'subservice'])
                ->where('reference_number', $referenceNumber)
                ->first();

            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reference number not found. Please check your reference number and try again.'
                ], 404);
            }

            // Get patient data
            $patientData = [
                'firstname' => $appointment->firstname,
                'middlename' => $appointment->middlename,
                'lastname' => $appointment->lastname,
                'email' => $appointment->email,
                'phone' => $appointment->phone,
                'gender' => $appointment->gender,
                'date_of_birth' => $appointment->date_of_birth,
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
                'region_id' => $appointment->region_id,
                'province_id' => $appointment->province_id,
                'city_id' => $appointment->city_id,
                'barangay_id' => $appointment->barangay_id,
                'reference_number' => $appointment->reference_number,
                'last_appointment_date' => $appointment->date,
                'last_service' => $appointment->service ? $appointment->service->servicename : null,
                'last_subservice' => $appointment->subservice ? $appointment->subservice->subservicename : null,
                'last_time' => $appointment->time,
            ];

            return response()->json([
                'success' => true,
                'patient' => $patientData,
                'message' => 'Patient information found successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while looking up your information. Please try again.'
            ], 500);
        }
    }

    public function getPatientAppointments($referenceNumber){
        try {
            // Find all appointments for this patient by reference number
            $appointments = appointments::with(['service', 'subservice', 'user', 'doctor'])
                ->where('reference_number', $referenceNumber)
                ->orWhere(function($query) use ($referenceNumber) {
                    // Also find appointments by the same patient (using first appointment's patient data)
                    $firstAppointment = appointments::where('reference_number', $referenceNumber)->first();
                    if ($firstAppointment) {
                        $query->where('firstname', $firstAppointment->firstname)
                              ->where('lastname', $firstAppointment->lastname)
                              ->where('email', $firstAppointment->email);
                    }
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'appointments' => $appointments,
                'message' => 'Appointment history retrieved successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving appointment history. Please try again.'
            ], 500);
        }
    }

    public function appointmentshistory(){
        $appointments =
        appointments::with(['service','user', 'doctor', 'subservice'])
        ->where('user_id',Auth::user()->id)->orderByDesc('created_at')->paginate(5);

        return Inertia::render('Authenticated/Patient/Appointments/AppointmentHistory',[
            'appointments' => $appointments,
            'ActiveTAB' => 'History'

        ]);
    }

    public function storeAppointment(Request $request){
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'date' => 'required|date',
            'time' => 'required|string',
            'service' => 'required|integer|exists:servicetypes,id',
            'subservice' => 'nullable|integer',
            'notes' => 'nullable|string|max:1000',
            'gender' => 'required|string|in:Male,Female,Other',
            'date_of_birth' => 'required|date',
        ]);


        $user = Auth::user();
        $service = servicetypes::find($request->service);

        // Handle guest appointments (no authenticated user)
        $userId = $user ? $user->id : null;
        $userName = $user ? "{$user->firstname} {$user->lastname}" : "{$request->firstname} {$request->lastname}";
        $userRole = $user ? $user->role->roletype : "Guest";

        // Generate priority number for the same date and service
        $formattedDate = \Carbon\Carbon::parse($request->date)->format('Y-m-d');
        $latestAppointment = appointments::where('date', $formattedDate)
            ->where('servicetype_id', $request->service)
            ->orderBy('priority_number', 'desc')
            ->first();
        
        $priorityNumber = $latestAppointment ? $latestAppointment->priority_number + 1 : 1;

        // Handle subservice - only set if it exists and is valid
        $subserviceId = null;
        if ($request->subservice) {
            try {
                // Check if subservices table exists and has the record
                $subserviceExists = DB::table('subservices')->where('id', $request->subservice)->exists();
                if ($subserviceExists) {
                    $subserviceId = $request->subservice;
                }
            } catch (Exception $e) {
                // Table doesn't exist or other error, set to null
                $subserviceId = null;
            }
        }

        $appointmentData = [
            'user_id' => $userId,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'middlename' => $request->middlename ?? null,
            'email' => $request->email,
            'phone' => $request->phone,
            'date' => $formattedDate, // Use the formatted date
            'time' => \Carbon\Carbon::parse($request->time)->format("H:i:s"),
            'servicetype_id' => $request->service,
            'subservice_id' => $subserviceId,
            'notes' => $request->notes,
            'priority_number' => $priorityNumber,
            'status' => 1, // Scheduled
            'is_verified' => false, // Initially unverified
            'verified_at' => null,
            // Patient profile fields for Patient Records
            'date_of_birth' => $request->date_of_birth ?? null,
            'gender' => $request->gender ?? null,
            'civil_status' => $request->civil_status ?? null,
            'nationality' => $request->nationality ?? null,
            'religion' => $request->religion ?? null,
            'country' => $request->country ?? null,
            // Address fields using yajra/laravel-address
            'region_id' => $request->region_id ?? null,
            'province_id' => $request->province_id ?? null,
            'city_id' => $request->city_id ?? null,
            'barangay_id' => $request->barangay_id ?? null,
            'region' => $request->region ?? null,
            'province' => $request->province ?? null,
            'city' => $request->city ?? null,
            'barangay' => $request->barangay ?? null,
            'street' => $request->street ?? null,
            'zip_code' => $request->zip_code ?? null,
            'profile_picture' => $request->profile_picture ?? null,
        ];


        // Create or find patient
        $patient = $this->patientService->findOrCreatePatient($appointmentData);
        
        // Add patient_id to appointment data
        $appointmentData['patient_id'] = $patient->id;

        $appointment = appointments::create($appointmentData);

        // Update slot availability cache (if using caching)
        $this->updateSlotAvailability($appointment);

        // Don't send notifications yet - wait for verification
        // Notifications will be sent after verification is complete

        // Send confirmation email and SMS
        $this->sendAppointmentConfirmation($appointment);

        // Store the appointment data in session for the frontend to access
        session([
            'appointment_priority_number' => $priorityNumber,
            'appointment_reference_number' => $appointment->reference_number ?? null,
            'appointment_id' => $appointment->id
        ]);

        // Clear patient verification session after successful appointment creation
        // This ensures users need to verify again for the next appointment
        session()->forget('patient_verification_completed');

        // Check if this is an AJAX request (from the frontend form)
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Appointment scheduled successfully! Your patient record has been automatically created.',
                'priority_number' => $priorityNumber,
                'reference_number' => $appointment->reference_number ?? null,
                'appointment_id' => $appointment->id,
                'appointment_data' => [
                    'id' => $appointment->id,
                    'priority_number' => $priorityNumber,
                    'reference_number' => $appointment->reference_number ?? null,
                    'date' => $appointment->date,
                    'time' => $appointment->time,
                    'service_name' => $service->servicename,
                    'subservice_name' => $appointment->subservice ? $appointment->subservice->subservicename : null,
                    'firstname' => $appointment->firstname,
                    'lastname' => $appointment->lastname,
                    'middlename' => $appointment->middlename,
                    'email' => $appointment->email,
                    'phone' => $appointment->phone,
                    'notes' => $appointment->notes,
                    'gender' => $appointment->gender,
                    'date_of_birth' => $appointment->date_of_birth,
                ]
            ]);
        }

        return redirect()->back()->with([
            'success' => 'Appointment scheduled successfully! Your patient record has been automatically created.',
            'priority_number' => $priorityNumber,
            'reference_number' => $appointment->reference_number ?? null,
            'appointment_id' => $appointment->id
        ]);
    }

    /**
     * Send appointment confirmation email and SMS
     */
    private function sendAppointmentConfirmation($appointment)
    {
        try {
            // Send confirmation email using AppointmentEmailService
            // Only send email if we have a valid email address (not a phone number)
            if ($appointment->email && filter_var($appointment->email, FILTER_VALIDATE_EMAIL)) {
                $emailService = new \App\Services\AppointmentEmailService();
                
                // Prepare appointment data for email service
                $appointmentData = [
                    'email' => $appointment->email,
                    'firstname' => $appointment->firstname,
                    'lastname' => $appointment->lastname,
                    'middlename' => $appointment->middlename,
                    'phone' => $appointment->phone,
                    'date' => $appointment->date,
                    'time' => $appointment->time,
                    'service_name' => $appointment->service ? $appointment->service->servicename : 'General Consultation',
                    'subservice_name' => $appointment->subservice ? $appointment->subservice->subservicename : 'N/A',
                    'priority_number' => $appointment->priority_number,
                    'appointment_id' => $appointment->reference_number,
                    'date_of_birth' => $appointment->date_of_birth
                ];
                
                $emailService->sendAppointmentConfirmation($appointmentData);
                \Log::info("Appointment confirmation email sent to {$appointment->email} for appointment #{$appointment->reference_number}");
            } else {
                \Log::warning("Skipping email confirmation for appointment #{$appointment->reference_number} - no valid email address found. Email: " . ($appointment->email ?: 'NULL'));
            }

            // Send confirmation SMS
            if ($appointment->phone) {
                $this->sendAppointmentConfirmationSMS($appointment);
            }

        } catch (\Exception $e) {
            \Log::error("Failed to send appointment confirmation: " . $e->getMessage());
        }
    }

    /**
     * Send appointment confirmation SMS
     */
    private function sendAppointmentConfirmationSMS($appointment)
    {
        $serviceName = $appointment->service ? $appointment->service->servicename : 'General Consultation';
        $date = \Carbon\Carbon::parse($appointment->date)->format('M j, Y');
        $time = \Carbon\Carbon::parse($appointment->time)->format('g:i A');
        
        $message = "Calumpang Rural Health Unit: Your appointment details. Ref: {$appointment->reference_number}. Date: {$date} at {$time}. Service: {$serviceName}. Priority: {$appointment->priority_number}. Awaiting admin confirmation. Contact us for changes. Thank you!";

        $smsService = new \App\Services\SMSService();
        $result = $smsService->sendSMS($appointment->phone, $message);
        
        if ($result['success']) {
            \Log::info("Appointment details SMS sent to {$appointment->phone} for appointment #{$appointment->reference_number}");
        } else {
            \Log::warning("Failed to send appointment details SMS to {$appointment->phone} for appointment #{$appointment->reference_number}: " . $result['message']);
        }
    }

    public function getLatestAppointment(Request $request) {
        $latestAppointment = appointments::where('date', $request->date)
            ->where('servicetype_id', $request->service)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'priority_number' => $latestAppointment ? $latestAppointment->priority_number + 1 : 1
        ]);
    }

    public function checkSlotAvailability(Request $request) {
        $date = $request->input('date');
        $serviceId = $request->input('service_id');
        $subserviceId = $request->input('subservice_id');
        
        // Get all appointments for the specific date and service
        $appointments = appointments::where('date', $date)
            ->where('servicetype_id', $serviceId)
            ->when($subserviceId, function($query) use ($subserviceId) {
                return $query->where('subservice_id', $subserviceId);
            })
            ->get();

        // Get available time slots for the service/subservice
        $timeSlots = [];
        if ($subserviceId) {
            $subservice = \App\Models\subservices::with('times')->find($subserviceId);
            if ($subservice && $subservice->times) {
                $timeSlots = $subservice->times->pluck('time')->toArray();
            }
        } else {
            // Get all time slots for the service
            $service = \App\Models\servicetypes::with(['subservices.times'])->find($serviceId);
            if ($service && $service->subservices) {
                $timeSlots = $service->subservices->flatMap(function($sub) {
                    return $sub->times ? $sub->times->pluck('time')->toArray() : [];
                })->unique()->values()->toArray();
            }
        }

        // Check availability for each time slot
        $availability = [];
        foreach ($timeSlots as $time) {
            $bookedCount = $appointments->where('time', $time)->count();
            
            // Get the actual max slots for this time slot from the database
            $timeSlot = null;
            if ($subserviceId) {
                $subservice = \App\Models\subservices::with('times')->find($subserviceId);
                if ($subservice && $subservice->times) {
                    $timeSlot = $subservice->times->where('time', $time)->first();
                }
            }
            
            $maxSlots = $timeSlot ? ($timeSlot->max_slots ?? 5) : 5;
            $isAvailable = $bookedCount < $maxSlots;
            
            $availability[] = [
                'time' => $time,
                'booked_count' => $bookedCount,
                'is_available' => $isAvailable,
                'available_slots' => max(0, $maxSlots - $bookedCount),
                'max_slots' => $maxSlots
            ];
        }

        return response()->json([
            'date' => $date,
            'service_id' => $serviceId,
            'subservice_id' => $subserviceId,
            'availability' => $availability,
            'total_appointments' => $appointments->count()
        ]);
    }

    public function getDateAvailability(Request $request) {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $serviceId = $request->input('service_id');
        
        // Get service days with slot capacity
        $serviceDays = \App\Models\service_days::where('service_id', $serviceId)
            ->pluck('slot_capacity', 'day')
            ->toArray();
        
        // Debug logging
        \Log::info("getDateAvailability Debug:", [
            'service_id' => $serviceId,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'service_days' => $serviceDays,
            'service_days_count' => count($serviceDays)
        ]);
            
        
        // Get appointments for the date range
        $appointments = appointments::whereBetween('date', [$startDate, $endDate])
            ->where('servicetype_id', $serviceId)
            ->whereIn('status', [1, 5, 6]) // Only count active appointments (scheduled, confirmed, pending)
            ->selectRaw('date, COUNT(*) as appointment_count')
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        // Generate date availability
        $availability = [];
        $currentDate = \Carbon\Carbon::parse($startDate);
        $endDate = \Carbon\Carbon::parse($endDate);
        
        while ($currentDate->lte($endDate)) {
            $dateStr = $currentDate->format('Y-m-d');
            $dayName = $currentDate->format('l'); // Get day name (Monday, Tuesday, etc.)
            $appointmentCount = $appointments->get($dateStr, (object)['appointment_count' => 0])->appointment_count;
            
            // Get day-specific slot capacity
            // If the service has no configured days, don't make any dates available
            if (empty($serviceDays)) {
                // Service has no configured days - mark as unavailable
                $maxSlots = 0;
                $availableSlots = 0;
                $isAvailable = false;
            } else if (isset($serviceDays[$dayName])) {
                // This day is configured for the service
                $maxSlots = $serviceDays[$dayName];
                $availableSlots = max(0, $maxSlots - $appointmentCount);
                $isAvailable = $availableSlots > 0;
            } else {
                // This day is not configured for the service - mark as unavailable
                $maxSlots = 0;
                $availableSlots = 0;
                $isAvailable = false;
            }
        
        // Add debugging here
        \Log::info("Date Availability Debug: {$dateStr} - Day: {$dayName}, Max Slots: {$maxSlots}, Booked: {$appointmentCount}, Available: {$availableSlots}");
            
            $availability[] = [
                'date' => $dateStr,
                'appointment_count' => $appointmentCount,
                'max_slots' => $maxSlots,
                'is_available' => $isAvailable,
                'available_slots' => $availableSlots
            ];
            
            $currentDate->addDay();
        }

        
        return response()->json([
            'start_date' => $startDate,
            'end_date' => $endDate->format('Y-m-d'),
            'service_id' => $serviceId,
            'availability' => $availability
        ]);
    }

    public function sendVerificationCode(Request $request){
        try {
            // Log the incoming request for debugging
            \Log::info('Verification code request received', [
                'appointment_id' => $request->appointment_id,
                'method' => $request->method,
                'contact' => $request->contact,
                'patient_name' => $request->patient_name,
                'appointment_date' => $request->appointment_date,
                'appointment_time' => $request->appointment_time,
                'service_name' => $request->service_name
            ]);

            $request->validate([
                'appointment_id' => 'nullable|integer',
                'method' => 'required|in:email,sms',
                'contact' => 'required|string'
            ]);

            // Generate 6-digit verification code
            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Store verification code in cache with 5-minute expiry
            // Use contact info as part of the key to make it more unique
            $contact = $request->contact;
            
            // Format phone number consistently if it's SMS
            if ($request->method === 'sms') {
                $contact = $this->formatPhoneNumber($contact);
            }
            
            $appointmentId = $request->appointment_id ?? 'temp';
            $cacheKey = "verification_code_{$contact}_{$appointmentId}";
            \Cache::put($cacheKey, $verificationCode, 300); // 5 minutes

            \Log::info('PatientController - Send Code: Cache Key Generated', [
                'cacheKey' => $cacheKey,
                'contact' => $contact,
                'appointmentId' => $appointmentId,
                'method' => $request->method,
                'verificationCode' => $verificationCode,
                'original_contact' => $request->contact,
                'formatted_contact' => $contact
            ]);

            if ($request->method === 'email') {
                \Log::info('Sending email verification', [
                    'contact' => $request->contact,
                    'verification_code' => $verificationCode,
                    'patient_name' => $request->patient_name ?? 'Patient'
                ]);

                // Send professional email verification using React template
                \Mail::to($request->contact)->send(new \App\Mail\VerificationCodeMail(
                    $verificationCode,
                    $request->patient_name ?? 'Patient',
                    [
                        'date' => $request->appointment_date ?? '',
                        'time' => $request->appointment_time ?? '',
                        'service' => $request->service_name ?? ''
                    ]
                ));

                \Log::info('Email verification sent successfully');
            } else {
                // Send SMS verification via IPROG SMS API
                $smsService = new \App\Services\SMSService();
                $message = "Calumpang Rural Health Unit Appointment: Your verification code is {$verificationCode}. Valid for 5 minutes.";
                
                $result = $smsService->sendSMS($request->contact, $message);
                
                if ($result['success']) {
                    \Log::info("SMS verification sent successfully via IPROG to {$request->contact}");
                } else {
                    \Log::error("Failed to send SMS verification via IPROG to {$request->contact}: " . $result['message']);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Verification code sent successfully',
                'data' => [
                    'verification_code' => $verificationCode,
                    'method' => $request->method,
                    'contact' => $request->contact
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Verification code sending failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification code: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkEmailExists(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->email;
        
        // Check in users table
        $userExists = User::where('email', $email)->exists();
        
        // Check in patients table
        $patientExists = Patient::where('email', $email)->exists();
        
        // Check in appointments table
        $appointmentExists = appointments::where('email', $email)->exists();

        return response()->json([
            'exists' => $userExists || $patientExists || $appointmentExists
        ]);
    }

    public function checkPhoneExists(Request $request)
    {
        $request->validate([
            'phone' => 'required|string'
        ]);

        $phone = $request->phone;
        
        // Check in users table (contactno field)
        $userExists = User::where('contactno', $phone)->exists();
        
        // Check in patients table (phone field)
        $patientExists = Patient::where('phone', $phone)->exists();
        
        // Check in appointments table (phone field)
        $appointmentExists = appointments::where('phone', $phone)->exists();

        return response()->json([
            'exists' => $userExists || $patientExists || $appointmentExists
        ]);
    }

    public function verifyCode(Request $request)
    {
        try {
            $request->validate([
                'verification_code' => 'required|string|size:6',
                'appointment_id' => 'nullable|integer',
                'method' => 'required|in:email,sms',
                'contact' => 'required|string'
            ]);

            $verificationCode = $request->verification_code;
            $appointmentId = $request->appointment_id ?? 'temp';
            $method = $request->method;
            $contact = $request->contact ?? '';

            // Format phone number consistently if it's SMS
            if ($method === 'sms') {
                $contact = $this->formatPhoneNumber($contact);
            }

            // Log the verification attempt
            \Log::info('Verification code attempt', [
                'code' => $verificationCode,
                'appointment_id' => $appointmentId,
                'method' => $method,
                'original_contact' => $request->contact,
                'formatted_contact' => $contact
            ]);

            // Check the verification code in cache
            $cacheKey = "verification_code_{$contact}_{$appointmentId}";
            $cachedCode = \Cache::get($cacheKey);

            \Log::info('PatientController - Verify Code: Cache Key Used', [
                'cacheKey' => $cacheKey,
                'contact' => $contact,
                'appointmentId' => $appointmentId,
                'method' => $method,
                'submittedCode' => $verificationCode,
                'original_contact' => $request->contact,
                'formatted_contact' => $contact
            ]);

            \Log::info('PatientController - Verify Code: Cached Code', [
                'cachedCode' => $cachedCode,
                'match' => $cachedCode === $verificationCode,
            ]);

            if (!$cachedCode) {
                \Log::warning('Verification code not found in cache', [
                    'cache_key' => $cacheKey,
                    'code' => $verificationCode,
                    'contact' => $contact,
                    'appointment_id' => $appointmentId,
                    'method' => $method
                ]);

                // Try to find any verification codes for this contact
                $allKeys = \Cache::get('verification_codes', []);
                \Log::info('All verification codes in cache', ['keys' => $allKeys]);

                return response()->json([
                    'success' => false,
                    'message' => 'Verification code has expired or not found. Please request a new one.'
                ], 400);
            }

            if ($cachedCode === $verificationCode) {
                // Remove the code from cache after successful verification
                \Cache::forget($cacheKey);

                \Log::info('Verification code verified successfully', [
                    'method' => $method,
                    'appointment_id' => $appointmentId
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Verification code verified successfully'
                ]);
            } else {
                \Log::warning('Invalid verification code provided', [
                    'provided_code' => $verificationCode,
                    'cached_code' => $cachedCode,
                    'method' => $method
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid verification code'
                ], 400);
            }

        } catch (\Exception $e) {
            \Log::error('Verification code verification failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Verification failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verifyAppointment(Request $request){
        try {
            $request->validate([
                'appointment_id' => 'required|integer',
                'verification_code' => 'required|string|size:6'
            ]);

            $cacheKey = "verification_code_{$request->appointment_id}";
            $storedCode = \Cache::get($cacheKey);

            if (!$storedCode || $storedCode !== $request->verification_code) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired verification code'
                ], 400);
            }

            // Clear the verification code from cache
            \Cache::forget($cacheKey);

            // Mark appointment as verified in database
            $appointment = \App\Models\appointments::find($request->appointment_id);
            if ($appointment) {
                $appointment->update([
                    'is_verified' => true,
                    'verified_at' => now(),
                    'status' => 1 // Change status to confirmed after verification
                ]);

                // Now send notifications after successful verification
                $user = \App\Models\User::find($appointment->user_id);
                if ($user) {
                    $user->notify(new \App\Notifications\SystemNotification(
                        'Appointment Confirmed',
                        'Your appointment has been verified and confirmed for ' . $appointment->date . ' at ' . $appointment->time . '.',
                        'appointment'
                    ));

                    \App\Services\NotifSender::SendNotif(true, [$user->id], 'Appointment verified and confirmed successfully', 'Appointment Confirmed');

                    \App\Services\ActivityLogger::log('User verified appointment', $user, ['appointment_id' => $appointment->id]);
                }

                // Send appointment confirmation email after verification
                $this->sendAppointmentConfirmation($appointment);

                // Notify admins and doctors about verified appointment
                $userName = $appointment->firstname . ' ' . $appointment->lastname;
                $userRole = $appointment->user_id ? 'Registered User' : 'Guest';
                \App\Services\NotifSender::SendNotif(false, [1, 7], "$userName ($userRole) verified their appointment", 'Appointment Verified');
            }

            return response()->json([
                'success' => true,
                'message' => 'Appointment verified successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify appointment. Please try again.'
            ], 500);
        }
    }

    /**
     * Update slot availability when appointments are created/updated
     */
    private function updateSlotAvailability($appointment)
    {
        // Clear any cached slot availability data
        // This ensures the next time the services page loads, it will recalculate
        // You can implement caching here if needed
        \Cache::forget('slot_availability_' . $appointment->subservice_id . '_' . $appointment->date);
    }

    /**
     * Format phone number to include country code if not present
     */
    private function formatPhoneNumber($phoneNumber)
    {
        // Remove any non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phoneNumber);
        
        // If phone number starts with 0, replace with 63 (Philippines country code)
        if (strpos($phone, '0') === 0) {
            $phone = '63' . substr($phone, 1);
        }
        
        // If phone number doesn't start with country code, add 63
        if (!str_starts_with($phone, '63') && !str_starts_with($phone, '+63')) {
            $phone = '63' . $phone;
        }
        
        // Ensure the phone number is exactly 12 digits (63 + 10 digits)
        if (strlen($phone) === 12) {
            return $phone;
        }
        
        // If it's 11 digits, it might be missing the leading 6
        if (strlen($phone) === 11 && str_starts_with($phone, '3')) {
            return '6' . $phone;
        }
        
        // fallback
        return $phone;
    }

}
