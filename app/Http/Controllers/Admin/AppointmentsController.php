<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
//use App\Models\Appointment;
use App\Models\appointments;
use Exception;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Events\SendNotification;
use App\Notifications\SystemNotification;
use App\Services\ActivityLogger;
use App\Services\NotifSender;
use Illuminate\Support\Facades\Auth;
class AppointmentsController extends Controller
{
    // Controller methods for appointments
    public function index(){
        $appointments = appointments::paginate(10);
        $appointments->load('user');
        $appointments->load('service');
        return Inertia::render('Authenticated/Admin/Appointments',[
            //'Appoints' => $appointments->items(),
            'appointments_' => $appointments
        ]);
    }
    public function history(){
        return Inertia::render('Authenticated/Admin/Appointments/AppointmentHistory',[
            // 'Appoints' => $appointments
        ]);
    }
    public function GetAppointment(appointments $appointment){
        $appointment->load(['user','service']);
        return response()->json($appointment);
    }

    public function UpdateStatus(Request $request, appointments $appointment){
        $request->validate([
            'status' => 'required|in:1,4,5'
        ]);

        //dd($appointment);
        $stat = '';
        //1=scheduled=2=completed,3=cancelled,4=declined,5=confirmed
        switch($request->status){
            case 1:
                $stat = 'Scheduled';
            break;
            case 2:
                $stat = 'Completed';
            break;
            case 3:
                $stat = 'Cancelled';
            break;
            case 4:
                $stat = 'Declined';
            break;
            case 5:
                $stat = 'Confirmed';
            break;
        }

        try{
            DB::beginTransaction();

            $appointment->update([
                'status' => $request->status
            ]);

            $user = Auth::user();
            $mssg_forAdmins = "{$user->firstname} {$user->lastname} ({$user->role->roletype}) has {$stat} patient's appointment.";

            NotifSender::SendNotif(false,[1,7],$mssg_forAdmins,"Appointment Updated!",'admin_appointment_update');

            NotifSender::SendNotif(true,[$appointment->user_id],"{$user->firstname} {$user->lastname} ({$user->role->roletype}) has {$stat} your appointment.","Appointment Updated!",'admin_appointment_update');

            DB::commit();
        }
        catch(\Exception $er){
            DB::rollBack();
        }
    }

    public function reschedule(Request $request, appointments $appointment){
        $request->validate([
            'date' => 'required|date',
            'time' => 'required|date_format:h:i A',
        ]);
        try{
            DB::beginTransaction();

                $date = \Carbon\Carbon::parse( $request->date)->format('Y-m-d');
                $time = \Carbon\Carbon::parse($request->time)->format('H:i:s');
                $appointment->update([
                    'date' => $date,
                    'time' => $time,
                ]);

                ActivityLogger::log("User {Auth::user()->id} rescheduled an appointment",$appointment,['ip' => $request->ip()]);
                // $recipients = User::whereIn('roleID', [1,7])->get();
                // foreach ($recipients as $recipient) {
                //     $recipient->notify(new SystemNotification(
                //         "{Auth::user()->firstname} {Auth::user()->lastname} ({Auth::user()->role->roletype}) Rescheduled patient's appointment. ",
                //         'Appointment Rescheduled!',
                //         'appointment_resched'
                //     ));
                //     event(new SendNotification($recipient->id));
                // }
                $user = Auth::user();
                $mssg_forAdmins = "{$user->firstname} {$user->lastname} ({$user->role->roletype}) Rescheduled patient's appointment. ";
                NotifSender::SendNotif(false,[1,7],$mssg_forAdmins,
                'Appointment Rescheduled!','appointment_resched');

                NotifSender::SendNotif(true,[$appointment->user_id],"{$user->firstname} {$user->lastname} ({$user->role->roletype}) Rescheduled your appointment to {$date} {$time}",
                'Appointment Rescheduled!','appointment_resched');
            DB::commit();
        }
        catch(\Exception $er){
            DB::rollBack();
        }
    }

    /**
     * Archive an appointment
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function archiveAppointment(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
        ]);

        try {
            DB::beginTransaction();
            
            $appointment = appointments::findOrFail($request->appointment_id);
            $appointment->status = 6; // Archived status
            $appointment->save();
            
            $user = Auth::user();
            $mssg_forAdmins = "{$user->firstname} {$user->lastname} ({$user->role->roletype}) has archived an appointment.";
            
            NotifSender::SendNotif(false,[1,7],$mssg_forAdmins,"Appointment Archived!","admin_appointment_archive");
            
            // Notify the patient
            NotifSender::SendNotif(true,[$appointment->user_id],"{$user->firstname} {$user->lastname} ({$user->role->roletype}) has archived your appointment.","Appointment Archived!","admin_appointment_archive");
            
            DB::commit();
            
            // Get updated appointments list
            $appointments = appointments::paginate(10);
            $appointments->load('user');
            $appointments->load('service');
            
            return response()->json([
                'message' => 'Appointment archived successfully',
                'appointments' => $appointments
            ], 200);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to archive appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Unarchive an appointment
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function unarchiveAppointment(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
        ]);

        try {
            DB::beginTransaction();
            
            $appointment = appointments::findOrFail($request->appointment_id);
            $appointment->status = 1; // Set back to Scheduled status
            $appointment->save();
            
            $user = Auth::user();
            $mssg_forAdmins = "{$user->firstname} {$user->lastname} ({$user->role->roletype}) has unarchived an appointment.";
            
            NotifSender::SendNotif(false,[1,7],$mssg_forAdmins,"Appointment Unarchived!","admin_appointment_unarchive");
            
            // Notify the patient
            NotifSender::SendNotif(true,[$appointment->user_id],"{$user->firstname} {$user->lastname} ({$user->role->roletype}) has unarchived your appointment.","Appointment Unarchived!","admin_appointment_unarchive");
            
            DB::commit();
            
            // Get updated appointments list
            $appointments = appointments::paginate(10);
            $appointments->load('user');
            $appointments->load('service');
            
            return response()->json([
                'message' => 'Appointment unarchived successfully',
                'appointments' => $appointments
            ], 200);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to unarchive appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}