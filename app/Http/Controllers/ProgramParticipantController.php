<?php

namespace App\Http\Controllers;

use App\Models\program_schedules;
use App\Models\program_participants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

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

        return back()->with([
            'flash' => [
                'icon' => 'success',
                'message' => 'Successfully registered to the program',
                'title' => 'Success!'
            ],
            'registration_id' => $participant->registration_id
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
        $programs = program_schedules::with(['program_type', 'coordinator'])
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($program) {
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
                    'availableSlots' => $program->available_slots,
                    'coordinator' => $program->coordinator ? $program->coordinator->name : null,
                    'status' => $program->status ?: 'Active', // Default to 'Active' if status is null
                    'programType' => $program->program_type->programname,
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
                        'name' => $program->program_type->programname,
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
}