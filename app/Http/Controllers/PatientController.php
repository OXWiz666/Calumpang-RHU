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
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

use App\Models\User;
use App\Services\ActivityLogger;
use App\Services\NotifSender;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Mail\AppointmentConfirmationMail;
use Illuminate\Support\Facades\Mail;

class PatientController extends Controller
{
    //
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

        return Inertia::render('Authenticated/Patient/Appointments/Appointment',[
            'services' => $serv,
            'ActiveTAB' => 'appointment'
        ]);
    }

    public function GetSubServices(Request $request,$id){
        $subservices = subservices::with(['times'])->where('service_id',$id)->get();
        return response()->json($subservices);
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
            'phone' => 'required|min:10',
            'date' => 'required|date',
            'time' => 'required',
            'service' => 'required|exists:servicetypes,id'
        ]);

        $user = Auth::user();
        $service = servicetypes::find($request->service);

        // Handle guest appointments (no authenticated user)
        $userId = $user ? $user->id : null;
        $userName = $user ? "{$user->firstname} {$user->lastname}" : "{$request->firstname} {$request->lastname}";
        $userRole = $user ? $user->role->roletype : "Guest";

        $appointment = appointments::create([
            'user_id' => $userId,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'middlename' => $request->middlename ?? null,
            'email' => $request->email,
            'phone' => $request->phone,
            'date' => \Carbon\Carbon::parse($request->date)->format("Y-m-d"),
            'time' => \Carbon\Carbon::parse($request->time)->format("H:i:s"),
            'servicetype_id' => $request->service,
            'subservice_id' => $request->subservice ?? null,
            'notes' => $request->notes,
            'status' => 6
        ]);

        // Only send notification if user is authenticated
        if ($user) {
            $user->notify(new SystemNotification(
                'Appointment Scheduled',
                'Your appointment for '.$service->name.' has been scheduled for '.$request->date.' at '.$request->time.'.',
                'appointment'
            ));

            // Trigger notification event
            //event(new SendNotification($user->id));

            NotifSender::SendNotif(true,[$user->id],'Appointment scheduled successfully','Appointment Schedule');

            ActivityLogger::log('User scheduled an appointment', $user, ['appointment_id' => $appointment->id]);
        }

        // Notify admins and doctors about new appointment
        NotifSender::SendNotif(false,[1,7],"$userName ($userRole) Scheduled an appointment",'New Appointment Scheduled');

        // Send confirmation email and SMS
        $this->sendAppointmentConfirmation($appointment);

        return redirect()->back()->with('success', 'Appointment scheduled successfully');
    }

    /**
     * Send appointment confirmation email and SMS
     */
    private function sendAppointmentConfirmation($appointment)
    {
        try {
            // Send confirmation email
            if ($appointment->email) {
                Mail::to($appointment->email)->send(new AppointmentConfirmationMail($appointment));
                \Log::info("Appointment confirmation email sent to {$appointment->email} for appointment #{$appointment->reference_number}");
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
        $message = "✅ APPOINTMENT CONFIRMED\n\n";
        $message .= "Ref: {$appointment->reference_number}\n";
        $message .= "Date: " . \Carbon\Carbon::parse($appointment->date)->format('M j, Y') . "\n";
        $message .= "Time: " . \Carbon\Carbon::parse($appointment->time)->format('g:i A') . "\n";
        $message .= "Service: " . ($appointment->service->servicename ?? 'General Consultation') . "\n\n";
        $message .= "Please arrive 15 minutes early. Contact us if you need to reschedule.\n\n";
        $message .= "Thank you for choosing SEHI!";

        // Use the same SMS sending logic as verification
        $verificationController = new \App\Http\Controllers\VerificationController();
        $reflection = new \ReflectionClass($verificationController);
        $method = $reflection->getMethod('sendSMSCode');
        $method->setAccessible(true);
        
        $success = $method->invoke($verificationController, $appointment->phone, $message);
        
        if ($success) {
            \Log::info("Appointment confirmation SMS sent to {$appointment->phone} for appointment #{$appointment->reference_number}");
        } else {
            \Log::warning("Failed to send appointment confirmation SMS to {$appointment->phone} for appointment #{$appointment->reference_number}");
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
            $isAvailable = $bookedCount < 5; // Assuming max 5 appointments per time slot
            
            $availability[] = [
                'time' => $time,
                'booked_count' => $bookedCount,
                'is_available' => $isAvailable,
                'available_slots' => max(0, 5 - $bookedCount) // Assuming max 5 slots per time
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
        
        // Get appointments for the date range
        $appointments = appointments::whereBetween('date', [$startDate, $endDate])
            ->where('servicetype_id', $serviceId)
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
            $appointmentCount = $appointments->get($dateStr, (object)['appointment_count' => 0])->appointment_count;
            $isAvailable = $appointmentCount < 20; // Assuming max 20 appointments per day
            
            $availability[] = [
                'date' => $dateStr,
                'appointment_count' => $appointmentCount,
                'is_available' => $isAvailable,
                'available_slots' => max(0, 20 - $appointmentCount)
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
}
