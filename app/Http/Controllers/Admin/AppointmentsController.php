<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
//use App\Models\Appointment;
use App\Models\appointments;
use App\Models\Appointment;
use Exception;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\servicetypes;
use App\Events\SendNotification;
use App\Notifications\SystemNotification;
use App\Services\ActivityLogger;
use App\Services\NotifSender;
use Illuminate\Support\Facades\Auth;
class AppointmentsController extends Controller
{
    // Controller methods for appointments
    public function index(){
        $appointments = appointments::whereNull('user_id')
            ->with([
                'service', 
                'subservice', 
                'user:id,firstname,lastname,email,contactno',
                'doctor:id,firstname,lastname,email,contactno',
                'patient:id,patient_id,firstname,lastname'
            ])
            ->select([
                'id', 'reference_number', 'user_id', 'firstname', 'lastname', 'middlename', 
                'email', 'phone', 'date', 'time', 'servicetype_id', 'subservice_id', 
                'notes', 'status', 'priority_number', 'created_at', 'doctor_id',
                // Patient profile fields
                'date_of_birth', 'gender', 'civil_status', 'nationality', 'religion',
                'country', 'region', 'province', 'city', 'barangay', 'street', 
                'zip_code', 'profile_picture'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        
        // Get active services for the Purpose filter
        $activeServices = servicetypes::where('status', 1)
            ->select('id', 'servicename')
            ->orderBy('servicename')
            ->get();

        return Inertia::render('Authenticated/Admin/Appointments',[
            'appointments_' => $appointments,
            'activeServices' => $activeServices
        ]);
    }
    public function history(){
        return Inertia::render('Authenticated/Admin/Appointments/AppointmentHistory',[
            // 'Appoints' => $appointments
        ]);
    }
    public function GetAppointment(appointments $appointment){
        $appointment->load(['user','service','subservice','doctor','patient']);
        // Make sure all patient profile fields are included
        $appointmentData = $appointment->toArray();
        return response()->json($appointmentData);
    }

    public function UpdateStatus(Request $request, appointments $appointment){
        $request->validate([
            'status' => 'required|in:1,4,5',
            'reason' => 'nullable|string|max:500'
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

            // Update slot availability when appointment status changes
            $this->updateSlotAvailability($appointment);

            $user = Auth::user();
            $mssg_forAdmins = "{$user->firstname} {$user->lastname} ({$user->role->roletype}) has {$stat} patient's appointment.";

            NotifSender::SendNotif(false,[1,7],$mssg_forAdmins,"Appointment Updated!",'admin_appointment_update');

            NotifSender::SendNotif(true,[$appointment->user_id],"{$user->firstname} {$user->lastname} ({$user->role->roletype}) has {$stat} your appointment.","Appointment Updated!",'admin_appointment_update');

            // Send email notification for confirmed or declined appointments
            if (($request->status == 4 || $request->status == 5) && $appointment->email && filter_var($appointment->email, FILTER_VALIDATE_EMAIL)) {
                $this->sendAppointmentStatusEmail($appointment, $request->status, $request->reason ?? null);
            }

            // Send SMS notification for confirmed or declined appointments
            if (($request->status == 4 || $request->status == 5) && $appointment->phone) {
                $this->sendAppointmentStatusSMS($appointment, $request->status, $request->reason ?? null);
            }

            DB::commit();
        }
        catch(\Exception $er){
            DB::rollBack();
        }
    }

    /**
     * Send appointment status email notification
     */
    private function sendAppointmentStatusEmail($appointment, $status, $reason = null)
    {
        try {
            $patientName = $appointment->firstname . ' ' . $appointment->lastname;
            $statusText = $status == 5 ? 'confirmed' : 'declined';
            
            $appointmentData = [
                'date' => $appointment->date,
                'time' => $appointment->time,
                'service' => $appointment->service ? $appointment->service->servicename : 'General Consultation',
                'referenceNumber' => $appointment->reference_number,
                'priorityNumber' => $appointment->priority_number
            ];

            \Mail::to($appointment->email)->send(new \App\Mail\AppointmentStatusMail(
                $patientName,
                $appointmentData,
                $statusText,
                $reason
            ));

            \Log::info("Appointment status email sent", [
                'email' => $appointment->email,
                'status' => $statusText,
                'appointment_id' => $appointment->id
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to send appointment status email', [
                'email' => $appointment->email,
                'status' => $status,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send appointment status SMS notification
     */
    private function sendAppointmentStatusSMS($appointment, $status, $reason = null)
    {
        try {
            $smsService = new \App\Services\SMSService();
            $serviceName = $appointment->service ? $appointment->service->servicename : 'General Consultation';
            $date = \Carbon\Carbon::parse($appointment->date)->format('M j, Y');
            $time = \Carbon\Carbon::parse($appointment->time)->format('g:i A');
            
            if ($status == 5) { // Confirmed
                $message = "RHU Calumpang: Your appointment is CONFIRMED. Ref: {$appointment->reference_number}. Date: {$date} at {$time}. Service: {$serviceName}. Priority: {$appointment->priority_number}. Please arrive 15 minutes early.";
            } elseif ($status == 4) { // Declined
                $reasonText = $reason ? " Reason: {$reason}." : "";
                $message = "RHU Calumpang: Your appointment has been DECLINED. Ref: {$appointment->reference_number}.{$reasonText} Please contact us to reschedule.";
            }
            
            $result = $smsService->sendSMS($appointment->phone, $message);
            
            if ($result['success']) {
                \Log::info("Appointment status SMS sent to {$appointment->phone} for appointment #{$appointment->reference_number}");
            } else {
                \Log::warning("Failed to send appointment status SMS to {$appointment->phone} for appointment #{$appointment->reference_number}: " . $result['message']);
            }
            
        } catch (\Exception $e) {
            \Log::error("Failed to send appointment status SMS: " . $e->getMessage());
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

    /**
     * Add diagnosis to an appointment
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addDiagnosis(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'diagnosis' => 'required|string|min:3',
            'symptoms' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'notes' => 'nullable|string',
            'pertinent_findings' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();
            
            $appointment = appointments::findOrFail($request->appointment_id);
            
            // Create medical record
            $medicalRecord = \App\Models\MedicalRecord::create([
                'patient_id' => null,
                'appointment_id' => $appointment->id,
                'doctor_id' => Auth::id(),
                'diagnosis' => $request->diagnosis,
                'symptoms' => $request->symptoms,
                'treatment' => $request->treatment_plan,
                'notes' => $request->notes,
                'pertinent_findings' => $request->pertinent_findings,
                'record_type' => 'consultation',
                'vital_signs' => null,
                'lab_results' => null,
                'follow_up_date' => null,
                'attachments' => null
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Diagnosis added successfully',
                'medical_record' => $medicalRecord
            ], 200);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to add diagnosis',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get diagnosis data for an appointment
     * 
     * @param int $appointmentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDiagnosis($appointmentId)
    {
        try {
            $appointment = appointments::with(['service', 'subservice', 'medicalRecord.doctor'])
                ->findOrFail($appointmentId);

            // Debug: Log the appointment and medical record
            \Log::info('Appointment found:', [
                'appointment_id' => $appointment->id,
                'has_medical_record' => $appointment->medicalRecord ? 'yes' : 'no',
                'medical_record_id' => $appointment->medicalRecord?->id
            ]);

            if (!$appointment->medicalRecord) {
                // Try to find medical record directly
                $medicalRecord = \App\Models\MedicalRecord::where('appointment_id', $appointmentId)->first();
                
                if ($medicalRecord) {
                    \Log::info('Found medical record directly:', ['medical_record_id' => $medicalRecord->id]);
                    return response()->json([
                        'message' => 'Diagnosis retrieved successfully',
                        'diagnosis' => $medicalRecord,
                        'appointment' => $appointment
                    ], 200);
                }

                return response()->json([
                    'message' => 'No diagnosis found for this appointment',
                    'diagnosis' => null,
                    'appointment_id' => $appointmentId
                ], 404);
            }

            return response()->json([
                'message' => 'Diagnosis retrieved successfully',
                'diagnosis' => $appointment->medicalRecord,
                'appointment' => $appointment
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Error in getDiagnosis:', [
                'appointment_id' => $appointmentId,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'message' => 'Failed to retrieve diagnosis',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test endpoint to check medical records
     */
    public function testMedicalRecords()
    {
        try {
            $medicalRecords = \App\Models\MedicalRecord::all();
            $appointments = appointments::all();
            
            return response()->json([
                'medical_records_count' => $medicalRecords->count(),
                'appointments_count' => $appointments->count(),
                'medical_records' => $medicalRecords,
                'appointments' => $appointments
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
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
        \Cache::forget('slot_availability_' . $appointment->subservice_id . '_' . $appointment->date);
    }
}