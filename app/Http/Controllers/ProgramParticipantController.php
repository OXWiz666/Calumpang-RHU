<?php

namespace App\Http\Controllers;

use App\Models\program_schedules;
use App\Models\program_participants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProgramParticipantController extends Controller
{
    /**
     * Register a user for a program
     */
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
}
