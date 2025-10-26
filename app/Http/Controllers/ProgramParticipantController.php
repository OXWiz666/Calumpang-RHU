<?php

namespace App\Http\Controllers;

use App\Models\program_schedules;
use App\Models\program_participants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Mail\ProgramRegistrationMail;
use App\Services\SMSService;

class ProgramParticipantController extends Controller
{
    /**
     * Register a user for a program
     */
    public function registerProgram(Request $request)
{
    $validated = $request->validate([
        'program_id' => [
            'required',
            'exists:program_schedules,id',
        ],
        'first_name' => 'required|string|max:255',
        'middle_name' => 'nullable|string|max:255',
        'last_name' => 'required|string|max:255',
        'suffix' => 'nullable|string|max:10',
        'sex' => 'required|string|in:Male,Female,Other',
        'birthdate' => 'required|date|before:today',
        'age' => 'required|integer|min:0|max:150',
        'contact_number' => [
            'required',
            'string',
            'regex:/^(09|\+639)[0-9]{9}$/',
            'max:13'
        ],
        'email' => 'required|email|max:255',
    ], [
        'contact_number.regex' => 'Please enter a valid Philippine mobile number (09xxxxxxxxx or +639xxxxxxxxx)',
        'birthdate.before' => 'Birthdate cannot be in the future',
        'age.max' => 'Age cannot exceed 150 years',
        'sex.in' => 'Please select a valid gender option',
    ]);

    try {
        $participant = null;
        DB::transaction(function() use ($validated, &$participant) {
            $schedule = program_schedules::findOrFail($validated['program_id']);

            if ($schedule->available_slots < 1) {
                throw new \Exception('No available slots for this program');
            }

            // Check for duplicate registration by email and program
            if (program_participants::where([
                'program_schedule_id' => $schedule->id,
                'email' => $validated['email']
            ])->exists()) {
                return response()->json([
                    'message' => 'This email address is already registered for this program.',
                    'errors' => [
                        'email' => ['This email address is already registered for this program.']
                    ]
                ], 422);
            }

            // Check for duplicate registration by contact number and program
            if (program_participants::where([
                'program_schedule_id' => $schedule->id,
                'contact_number' => $validated['contact_number']
            ])->exists()) {
                return response()->json([
                    'message' => 'This contact number is already registered for this program.',
                    'errors' => [
                        'contact_number' => ['This contact number is already registered for this program.']
                    ]
                ], 422);
            }

            $schedule->decrement('available_slots');

            // Generate a random 10-digit registration ID
            do {
                $registrationId = str_pad(random_int(1000000000, 9999999999), 10, '0', STR_PAD_LEFT);
            } while (program_participants::where('registration_id', $registrationId)->exists());

            $participant = program_participants::create([
                'program_schedule_id' => $schedule->id,
                'user_id' => null, // Guest registration
                'registration_id' => $registrationId,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'],
                'last_name' => $validated['last_name'],
                'suffix' => $validated['suffix'],
                'sex' => $validated['sex'],
                'birthdate' => $validated['birthdate'],
                'age' => $validated['age'],
                'contact_number' => $validated['contact_number'],
                'email' => $validated['email'],
                'status' => 'Registered'
            ]);
        });

        // Send email and SMS notifications
        try {
            // Get program details for notifications
            $program = program_schedules::with('program_type')->find($validated['program_id']);
            $programData = [
                'name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                'date' => $program->date,
                'startTime' => $program->start_time,
                'endTime' => $program->end_time,
                'location' => $program->location,
            ];

            // Send email notification
            Mail::to($participant->email)->send(new ProgramRegistrationMail(
                $participant->toArray(),
                $programData,
                $participant->registration_id
            ));

            // Send SMS notification
            $smsMessage = "RHU Calumpang: Registration successful for {$programData['name']} on {$programData['date']}. Registration ID: {$participant->registration_id}. Please bring this ID for verification.";
            
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

        \Log::info('Program registration completed', [
            'participant_id' => $participant->id,
            'registration_id' => $participant->registration_id,
            'email' => $participant->email
        ]);

        \Log::info('About to return redirect with registration_id', [
            'registration_id' => $participant->registration_id
        ]);

        // Store data in session for Inertia middleware to access
        session()->flash('registration_id', $participant->registration_id);
        session()->flash('participant_data', $participant->toArray());
        session()->flash('flash', [
            'icon' => 'success',
            'message' => 'Successfully registered to the program. Check your email and SMS for confirmation details.',
            'title' => 'Success!'
        ]);

        // Use Inertia redirect with explicit data
        return redirect()->back()->with([
            'flash' => [
                'icon' => 'success',
                'message' => 'Successfully registered to the program. Check your email and SMS for confirmation details.',
                'title' => 'Success!'
            ],
            'registration_id' => $participant->registration_id,
            'participant_data' => $participant->toArray()
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error occurred: ' . $e->getMessage(),
            'error' => true
        ], 500);
    }
}
    public function register(Request $request)
    {
        $request->validate([
            'program_id' => 'required|exists:program_schedules,id',
            'user_id' => 'required|exists:users,id',
        ]);

        // Check if the user is already registered for this program
        $existingRegistration = program_participants::where('program_schedule_id', $request->program_id)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existingRegistration) {
            return response()->json([
                'message' => 'You are already registered for this program.'
            ], 422);
        }

        // Check if there are available slots
        $program = program_schedules::findOrFail($request->program_id);

        if ($program->available_slots <= 0) {
            return response()->json([
                'message' => 'No available slots for this program.'
            ], 422);
        }

        // Create the registration
        $registration = new program_participants();
        $registration->program_schedule_id = $request->program_id;
        $registration->user_id = $request->user_id;
        $registration->status = 'Registered';
        $registration->save();

        // Update available slots
        $program->available_slots = $program->available_slots - 1;
        $program->save();

        return response()->json([
            'message' => 'Registration successful!',
            'registration' => $registration
        ], 200);
    }

    /**
     * Get all programs for the patient side
     */
    public function getPatientPrograms()
    {
        // Get all program schedules with their related program types and coordinators
        // Don't filter by status to ensure we get all programs
        $programs = program_schedules::with(['program_type', 'coordinator', 'registered_participants'])
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($program) {
                // Calculate real-time available slots from actual registrations
                $registeredCount = $program->registered_participants->count();
                $availableSlots = max(0, $program->total_slots - $registeredCount);
                
                // Update the database to keep it in sync
                if ($program->available_slots !== $availableSlots) {
                    $program->update(['available_slots' => $availableSlots]);
                }
                
                // Format the program data for the frontend
                return [
                    'id' => $program->id,
                    'name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                    'description' => $program->program_type ? $program->program_type->description : '',
                    'date' => $program->date,
                    'startTime' => $program->start_time,
                    'endTime' => $program->end_time,
                    'location' => $program->location,
                    'totalSlots' => $program->total_slots,
                    'availableSlots' => $availableSlots,
                    'coordinator' => $program->coordinator ? $program->coordinator->name : null,
                    'status' => $program->status ?: 'Active', // Default to 'Active' if status is null
                    'programType' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                ];
            });

        // Get the user's registered programs if authenticated
        $userPrograms = [];
        if (Auth::check()) {
            $userPrograms = program_participants::where('user_id', Auth::id())
                ->with('program_schedule.program_type')
                ->get()
                ->map(function ($registration) {
                    $program = $registration->program_schedule;
                    return [
                        'id' => $program->id,
                        'name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                        'date' => $program->date,
                        'time' => $program->start_time . ' - ' . $program->end_time,
                        'location' => $program->location,
                        'status' => $registration->status,
                        'registrationDate' => $registration->created_at,
                    ];
                });
        }

        return Inertia::render('Authenticated/Patient/SeasonalProgram', [
            'programs' => $programs,
            'userPrograms' => $userPrograms,
        ]);
    }

    public function checkDuplicates(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'contact_number' => 'required|string',
            'program_id' => 'required|exists:program_schedules,id'
        ]);

        $emailExists = program_participants::where([
            'program_schedule_id' => $request->program_id,
            'email' => $request->email
        ])->exists();

        $contactNumberExists = program_participants::where([
            'program_schedule_id' => $request->program_id,
            'contact_number' => $request->contact_number
        ])->exists();

        return response()->json([
            'hasDuplicates' => $emailExists || $contactNumberExists,
            'emailExists' => $emailExists,
            'contactNumberExists' => $contactNumberExists
        ]);
    }

    /**
     * Get participant history by registration ID
     */
    public function getParticipantHistory($registrationId)
    {
        try {
            // Find the participant by registration ID
            $participant = program_participants::where('registration_id', $registrationId)->first();
            
            if (!$participant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration ID not found'
                ], 404);
            }

            // Get all programs this participant has registered for
            $programs = program_participants::where('email', $participant->email)
                ->orWhere('contact_number', $participant->contact_number)
                ->with(['program_schedule.program_type'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($registration) {
                    $program = $registration->program_schedule;
                    return [
                        'program_name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                        'date' => $program->date,
                        'time' => $program->start_time . ' - ' . $program->end_time,
                        'location' => $program->location,
                        'status' => $registration->status,
                        'registration_id' => $registration->registration_id,
                        'registered_at' => $registration->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'participant' => [
                    'first_name' => $participant->first_name,
                    'last_name' => $participant->last_name,
                    'email' => $participant->email,
                    'contact_number' => $participant->contact_number,
                ],
                'programs' => $programs
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching participant history: ' . $e->getMessage()
            ], 500);
        }
    }
}