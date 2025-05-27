<?php

namespace App\Http\Controllers;

use App\Events\SendNotification;
use App\Models\appointments;
use App\Models\servicetypes;
use App\Models\subservices;
use App\Notifications\SystemNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

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
            ]
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

        $appointment = appointments::create([
            'user_id' => $user->id,
            'phone' => $request->phone,
            'date' => $request->date,
            'time' => $request->time,
            'servicetype_id' => $request->service,
            'subservice_id' => $request->subservice ?? null,
            'notes' => $request->notes,
            'status' => 'Pending'
        ]);

        $user->notify(new SystemNotification(
            'Appointment Scheduled',
            'Your appointment for '.$service->name.' has been scheduled for '.$request->date.' at '.$request->time.'.',
            'appointment'
        ));

        // Trigger notification event
        event(new SendNotification($user->id, [
            'title' => 'New Appointment',
            'message' => 'A new appointment has been scheduled by '.$user->firstname.' '.$user->lastname,
            'type' => 'appointment'
        ]));

        ActivityLogger::log('User scheduled an appointment', $user, ['appointment_id' => $appointment->id]);

        return redirect()->back()->with('success', 'Appointment scheduled successfully');
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
}