<?php

namespace App\Http\Controllers;

use App\Models\program_participants;
use App\Models\program_types;
use App\Models\servicetypes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Mail\ProgramRegistrationMail;
use App\Services\SMSService;

class VaccineController extends Controller
{
    public function index()
    {
        // Get all program schedules with their related program types and coordinators
        $programs = \App\Models\program_schedules::with(['program_type', 'coordinator','registered_participants'])
            ->where('status', '!=', 'Archived') // Filter out archived programs
            ->orderBy('date', 'asc')
            ->get()
            ->load('program_type.service')
            ->map(function ($program) {
                // Calculate real-time available slots from actual registrations
                $registeredCount = $program->registered_participants->count();
                $availableSlots = max(0, $program->total_slots - $registeredCount);
                
                // Debug logging for Libreng Tuli program
                if ($program->program_type->programname === 'Libreng Tuli') {
                    \Log::info('Libreng Tuli Debug:', [
                        'program_id' => $program->id,
                        'total_slots' => $program->total_slots,
                        'registered_count' => $registeredCount,
                        'calculated_available' => $availableSlots,
                        'stored_available' => $program->available_slots,
                        'participants' => $program->registered_participants->toArray()
                    ]);
                }
                
                // Update the database to keep it in sync
                if ($program->available_slots !== $availableSlots) {
                    $program->update(['available_slots' => $availableSlots]);
                }
                
                // Format the program data for the frontend
                return [
                    'id' => $program->id,
                    'name' => $program->program_type->programname,
                    'description' => $program->program_type->description,
                    'date' => $program->date,
                    'startTime' => $program->start_time,
                    'endTime' => $program->end_time,
                    'location' => $program->location,
                    'totalSlots' => $program->total_slots,
                    'availableSlots' => $availableSlots,
                    'coordinator' => $program->coordinator ? $program->coordinator->lastname : null,
                    'status' => $program->status ?: 'Active', // Default to 'Active' if status is null
                    'programType' => $program->program_type && $program->program_type->service ? $program->program_type->service->servicename : null,
                ];
            });

        // For now, we'll just provide an empty array for user programs
        // since we're not using the program_participants table
        $userPrograms = [];

        return Inertia::render('Authenticated/Patient/SeasonalProgram', [
            'isLoggedin' => Auth::check(),
            'allprograms' => $programs,
            'userPrograms' => $userPrograms,
            'programtypes' => servicetypes::get(),
            'myprograms' => program_participants::where('user_id',Auth::id())->get()
        ]);
    }

    /**
     * Show the registration form for a specific program
     */
    public function showRegistrationForm(Request $request)
    {
        // Get the program ID from the query string
        $programId = $request->query('program_id');

        if (!$programId) {
            return redirect()->route('services.vaccinations');
        }

        // Get the program details with registered participants
        $program = \App\Models\program_schedules::with(['program_type', 'coordinator', 'registered_participants'])
            ->find($programId);

        if (!$program) {
            return redirect()->route('services.vaccinations');
        }

        // Calculate real-time available slots from actual registrations
        $registeredCount = $program->registered_participants->count();
        $availableSlots = max(0, $program->total_slots - $registeredCount);

        // Format the program data for the frontend
        $programData = [
            'id' => $program->id,
            'name' => $program->program_type->programname,
            'description' => $program->program_type->description,
            'date' => $program->date,
            'startTime' => $program->start_time,
            'endTime' => $program->end_time,
            'location' => $program->location,
            'totalSlots' => $program->total_slots,
            'availableSlots' => $availableSlots,
            'coordinator' => $program->coordinator ? $program->coordinator->lastname : null,
            'status' => $program->status ?: 'Active',
            'programType' => $program->program_type->programname,
        ];

        return Inertia::render('Authenticated/Patient/ProgramRegistration', [
            'isLoggedin' => Auth::check(),
            'program' => $programData,
        ]);
    }

    /**
     * Register a user for a program
     */
    public function register(Request $request)
    {
        $request->validate([
            'program_id' => 'required|exists:program_schedules,id',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'sex' => 'required|string|in:Male,Female,Other',
            'age' => 'required|integer|min:0',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
        ]);

        // Check if the program exists and has available slots
        $program = \App\Models\program_schedules::with('registered_participants')->findOrFail($request->program_id);

        // Calculate real-time available slots
        $registeredCount = $program->registered_participants->count();
        $availableSlots = max(0, $program->total_slots - $registeredCount);

        if ($availableSlots <= 0) {
            return response()->json([
                'message' => 'No available slots for this program.'
            ], 422);
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Generate a random 10-digit registration ID
            do {
                $registrationId = str_pad(random_int(1000000000, 9999999999), 10, '0', STR_PAD_LEFT);
            } while (program_participants::where('registration_id', $registrationId)->exists());

            // Create or find the user
            $user = null;
            if (Auth::check()) {
                $user = Auth::user();
            } else {
                // Check if user with this email exists
                $user = \App\Models\User::where('email', $request->email)->first();

                if (!$user) {
                    // Create a new user
                    $user = new \App\Models\User();
                    $user->firstname = $request->first_name;
                    $user->middlename = $request->middle_name;
                    $user->lastname = $request->last_name;
                    $user->suffix = $request->suffix;
                    $user->gender = $request->sex;
                    $user->contact = $request->contact_number;
                    $user->email = $request->email;
                    $user->roleID = 7; // Admin role
                    $user->password = bcrypt('password'); // Default password
                    $user->save();
                }
            }

            // Create a program participant record
            $participant = program_participants::create([
                'program_schedule_id' => $program->id,
                'user_id' => $user->id,
                'registration_id' => $registrationId,
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name,
                'last_name' => $request->last_name,
                'suffix' => $request->suffix,
                'sex' => $request->sex,
                'age' => $request->age,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'status' => 'Registered',
            ]);

            // Update the program's available slots to reflect the new registration
            $program->available_slots = $availableSlots - 1;
            $program->save();

            // Commit the transaction
            DB::commit();

            // Send email and SMS notifications
            try {
                $programData = [
                    'name' => $program->program_type->programname,
                    'date' => $program->date,
                    'startTime' => $program->start_time,
                    'endTime' => $program->end_time,
                    'location' => $program->location,
                ];

                Mail::to($participant->email)->send(new ProgramRegistrationMail(
                    $participant->toArray(),
                    $programData,
                    $participant->registration_id
                ));

                $smsMessage = "RHU Calumpang: You have successfully registered for {$programData['name']} on {$programData['date']} at {$programData['startTime']}. Your Registration ID: {$participant->registration_id}. Please bring this ID for verification. Thank you!";
                
                $smsService = new SMSService();
                $smsService->sendSMS($participant->contact_number, $smsMessage);

                \Log::info('Program registration notifications sent', [
                    'participant_id' => $participant->id,
                    'registration_id' => $participant->registration_id,
                    'email' => $participant->email,
                    'contact_number' => $participant->contact_number
                ]);

            } catch (\Exception $notificationError) {
                \Log::error('Failed to send program registration notifications', [
                    'participant_id' => $participant->id,
                    'registration_id' => $participant->registration_id,
                    'error' => $notificationError->getMessage()
                ]);
                // Don't fail the registration if notifications fail
            }

            return response()->json([
                'message' => 'Registration successful!',
                'registration_id' => $participant->registration_id,
                'registration' => [
                    'program' => [
                        'name' => $program->program_type->programname,
                        'date' => $program->date,
                        'time' => $program->start_time . ' - ' . $program->end_time,
                        'location' => $program->location,
                    ],
                    'user' => [
                        'name' => $user->firstname . ' ' . $user->lastname,
                        'email' => $user->email,
                    ],
                    'status' => 'Registered',
                    'created_at' => now(),
                ]
            ], 200);
        } catch (\Exception $e) {
            // Roll back the transaction in case of an error
            DB::rollBack();
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }
}