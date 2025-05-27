<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VaccineController extends Controller
{
    public function index()
    {
        // Get all program schedules with their related program types and coordinators
        $programs = \App\Models\program_schedules::with(['program_type', 'coordinator'])
            ->where('status', '!=', 'Archived') // Filter out archived programs
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
                    'coordinator' => $program->coordinator ? $program->coordinator->lastname : null,
                    'status' => $program->status ?: 'Active', // Default to 'Active' if status is null
                    'programType' => $program->program_type->programname,
                ];
            });

        // For now, we'll just provide an empty array for user programs
        // since we're not using the program_participants table
        $userPrograms = [];

        return Inertia::render('Authenticated/Patient/SeasonalProgram', [
            'isLoggedin' => Auth::check(),
            'programs' => $programs,
            'userPrograms' => $userPrograms,
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
        
        // Get the program details
        $program = \App\Models\program_schedules::with(['program_type', 'coordinator'])
            ->find($programId);
            
        if (!$program) {
            return redirect()->route('services.vaccinations');
        }
        
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
            'availableSlots' => $program->available_slots,
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
        $program = \App\Models\program_schedules::findOrFail($request->program_id);
        
        if ($program->available_slots <= 0) {
            return response()->json([
                'message' => 'No available slots for this program.'
            ], 422);
        }

        // Start a database transaction
        DB::beginTransaction();
        
        try {
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
                    $user->roleID = 3; // Patient role
                    $user->password = bcrypt('password'); // Default password
                    $user->save();
                }
            }

            // Instead of using program_participants table, we'll just update the program slots
            // Update available slots
            $program->available_slots = $program->available_slots - 1;
            $program->save();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Registration successful!',
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