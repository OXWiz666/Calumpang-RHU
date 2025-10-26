<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\program_types;
use App\Models\program_schedules;
use App\Models\program_participants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class HealthProgramsController extends Controller
{
    // Archive and unarchive methods
    public function index(){
        // Get programs from database
        $programs = program_schedules::with(['program_type', 'coordinator', 'registered_participants'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($program) {
                // Calculate real-time available slots from actual registrations
                $registeredCount = $program->registered_participants ? $program->registered_participants->count() : 0;
                $availableSlots = max(0, $program->total_slots - $registeredCount);
                $participants = $program->total_slots - $availableSlots;
                
                // Update the database to keep it in sync
                if ($program->available_slots !== $availableSlots) {
                    $program->update(['available_slots' => $availableSlots]);
                }
                
                return [
                    'id' => $program->id,
                    'name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                    'description' => $program->program_type ? $program->program_type->description : '',
                    'date' => $program->date,
                    'startTime' => $program->start_time,
                    'endTime' => $program->end_time,
                    'location' => $program->location,
                    'status' => $program->status,
                    'participants' => $participants,
                    'coordinator' => $program->coordinator ? 'Dr. ' . $program->coordinator->lastname : 'Unassigned',
                    'coordinatorId' => $program->coordinator_id,
                    'availableSlots' => $availableSlots,
                    'totalSlots' => $program->total_slots,
                    'created_at' => $program->created_at->format('Y-m-d H:i:s'),
                ];
            })
            ->toArray();

        // Get all active doctors for the coordinator dropdown (exclude archived doctors)
        $doctors = DB::table('users')
            ->join('doctor_details', 'users.id', '=', 'doctor_details.user_id')
            ->where('users.roleID', 1) // Role ID for doctors
            ->where('doctor_details.status', '!=', 5) // Exclude archived doctors (status 5)
            ->select('users.id', 'users.firstname', 'users.lastname')
            ->get();
            
        // Get statistics for admin overview
        $activePrograms = program_schedules::where('status', 'Available')->count();
        $archivedPrograms = program_schedules::where('status', 'Archived')->count();
        
        // Get today's participants count (participants registered for programs happening today)
        $today = date('Y-m-d');
        $todayParticipants = DB::table('program_participants')
            ->join('program_schedules', 'program_participants.program_schedule_id', '=', 'program_schedules.id')
            ->whereDate('program_schedules.date', $today)
            ->count();
            
        // Get total participants across all programs
        $totalParticipants = program_schedules::sum(DB::raw('total_slots - available_slots'));

        return Inertia::render("Authenticated/Admin/HealthPrograms",[
            'programs' => $programs,
            'doctors' => $doctors,
            'activePrograms' => $activePrograms,
            'archivedPrograms' => $archivedPrograms,
            'todayParticipants' => $todayParticipants,
            'totalParticipants' => $totalParticipants
        ]);
    }

    /**
     * Fetch programs data for AJAX requests
     */
    public function fetch(){
        // Get programs from database
        $programs = program_schedules::with(['program_type', 'coordinator', 'registered_participants'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($program) {
                // Calculate real-time available slots from actual registrations
                $registeredCount = $program->registered_participants ? $program->registered_participants->count() : 0;
                $availableSlots = max(0, $program->total_slots - $registeredCount);
                $participants = $program->total_slots - $availableSlots;
                
                // Update the database to keep it in sync
                if ($program->available_slots !== $availableSlots) {
                    $program->update(['available_slots' => $availableSlots]);
                }
                
                return [
                    'id' => $program->id,
                    'name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                    'description' => $program->program_type ? $program->program_type->description : '',
                    'date' => $program->date,
                    'startTime' => $program->start_time,
                    'endTime' => $program->end_time,
                    'location' => $program->location,
                    'status' => $program->status,
                    'participants' => $participants,
                    'coordinator' => $program->coordinator ? 'Dr. ' . $program->coordinator->lastname : 'Unassigned',
                    'coordinatorId' => $program->coordinator_id,
                    'availableSlots' => $availableSlots,
                    'totalSlots' => $program->total_slots,
                    'created_at' => $program->created_at->format('Y-m-d H:i:s'),
                ];
            })
            ->toArray();

        return response()->json([
            'success' => true,
            'programs' => $programs
        ]);
    }

    public function CreateProgram(Request $request){
        // Log the request data for debugging
        \Log::info('CreateProgram request data:', $request->all());
        
        try {
            $request->validate([
                'programname' => "required|min:3",
                'description' => "required|min:3",
                'date' => "required|date",
                'starttime' => "required",
                'endtime' => "required",
                'location' => "required",
                'slots' => "required|integer",
                'coordinatorid' => "required|exists:users,id",
                'status' => "required|in:Available,Full,Cancelled",
            ]);
            
            \Log::info('Validation passed');
            
            // Begin a database transaction
            DB::beginTransaction();
            
            // First, create or find the program type
            $programType = program_types::firstOrCreate(
                ['programname' => $request->programname],
                [
                    'description' => $request->description,
                    'service_id' => null // Health programs don't need to be linked to a specific service
                ]
            );
            
            \Log::info('Program type created/found:', ['id' => $programType->id, 'name' => $programType->programname]);
            
            // Then create the program schedule
            $programSchedule = new program_schedules();
            $programSchedule->program_type_id = $programType->id;
            $programSchedule->date = $request->date;
            $programSchedule->start_time = $request->starttime;
            $programSchedule->end_time = $request->endtime;
            $programSchedule->location = $request->location;
            $programSchedule->total_slots = $request->slots;
            $programSchedule->available_slots = $request->slots;
            $programSchedule->coordinator_id = $request->coordinatorid;
            $programSchedule->status = $request->status;
            $programSchedule->save();
            
            \Log::info('Program schedule saved:', ['id' => $programSchedule->id]);
            
            // Commit the transaction
            DB::commit();
            
            \Log::info('Transaction committed successfully');
            
            return redirect()->route('admin.programs')->with([
                'success' => 'Health program created successfully'
            ]);
        }
        catch(\Illuminate\Validation\ValidationException $e){
            DB::rollBack();
            \Log::error('Validation error:', $e->errors());
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
        catch(\Exception $er){
            DB::rollBack();
            \Log::error('Error creating program:', ['message' => $er->getMessage(), 'trace' => $er->getTraceAsString()]);
            return redirect()->back()->with('error', 'Failed to create health program: ' . $er->getMessage());
        }
    }

    public function updateProgram(Request $request, $programId){
        $request->validate([
            'programname' => "required|min:3",
            'description' => "required|min:3",
            'date' => "required|date|after_or_equal:today",
            'starttime' => "required",
            'endtime' => "required",
            'location' => "required",
            'slots' => "required|integer",
            'coordinatorid' => "required|exists:users,id",
            'status' => "required|in:Available,Full,Cancelled,Active,Completed,Upcoming,Archived",
        ]);

        try{
            // Begin a database transaction
            DB::beginTransaction();
            
            // Find the program schedule
            $programSchedule = program_schedules::findOrFail($programId);
            
            // Update or create the program type
            $programType = program_types::firstOrCreate(
                ['programname' => $request->programname],
                ['description' => $request->description]
            );
            
            // Update the program type description if it exists
            if ($programType->description !== $request->description) {
                $programType->description = $request->description;
                $programType->save();
            }
            
            // Calculate new available slots based on current registrations
            $currentRegistrations = $programSchedule->registered_participants()->count();
            $newTotalSlots = $request->slots;
            $newAvailableSlots = max(0, $newTotalSlots - $currentRegistrations);
            
            // Update the program schedule
            $programSchedule->program_type_id = $programType->id;
            $programSchedule->date = $request->date;
            $programSchedule->start_time = $request->starttime;
            $programSchedule->end_time = $request->endtime;
            $programSchedule->location = $request->location;
            $programSchedule->total_slots = $newTotalSlots;
            $programSchedule->available_slots = $newAvailableSlots;
            $programSchedule->coordinator_id = $request->coordinatorid;
            $programSchedule->status = $request->status;
            $programSchedule->save();
            
            // Commit the transaction
            DB::commit();
            
            return redirect()->route('admin.programs')->with([
                'success' => 'Health program updated successfully'
            ]);
        }
        catch(\Exception $er){
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update health program: ' . $er->getMessage());
        }
    }
    
    /**
     * Archive a health program
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function archiveProgram(Request $request)
    {
        $request->validate([
            'program_id' => 'required|exists:program_schedules,id',
        ]);

        try {
            $program = program_schedules::findOrFail($request->program_id);
            $program->status = 'Archived';
            $program->save();
            
            // Get updated programs list
            $programs = program_schedules::with(['program_type', 'coordinator'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($program) {
                    return [
                        'id' => $program->id,
                        'name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                        'description' => $program->program_type ? $program->program_type->description : '',
                        'date' => $program->date,
                        'startTime' => $program->start_time,
                        'endTime' => $program->end_time,
                        'location' => $program->location,
                        'status' => $program->status,
                        'participants' => $program->total_slots - $program->available_slots,
                        'coordinator' => $program->coordinator ? 'Dr. ' . $program->coordinator->lastname : 'Unassigned',
                        'coordinatorId' => $program->coordinator_id,
                        'availableSlots' => $program->available_slots,
                        'totalSlots' => $program->total_slots,
                        'created_at' => $program->created_at->format('Y-m-d H:i:s'),
                    ];
                })
                ->toArray();
            
            return response()->json([
                'message' => 'Program archived successfully',
                'programs' => $programs
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to archive program',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Unarchive a health program
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function unarchiveProgram(Request $request)
    {
        $request->validate([
            'program_id' => 'required|exists:program_schedules,id',
        ]);

        try {
            $program = program_schedules::findOrFail($request->program_id);
            $program->status = 'Active';
            $program->save();
            
            // Get updated programs list
            $programs = program_schedules::with(['program_type', 'coordinator'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($program) {
                    return [
                        'id' => $program->id,
                        'name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                        'description' => $program->program_type ? $program->program_type->description : '',
                        'date' => $program->date,
                        'startTime' => $program->start_time,
                        'endTime' => $program->end_time,
                        'location' => $program->location,
                        'status' => $program->status,
                        'participants' => $program->total_slots - $program->available_slots,
                        'coordinator' => $program->coordinator ? 'Dr. ' . $program->coordinator->lastname : 'Unassigned',
                        'coordinatorId' => $program->coordinator_id,
                        'availableSlots' => $program->available_slots,
                        'totalSlots' => $program->total_slots,
                        'created_at' => $program->created_at->format('Y-m-d H:i:s'),
                    ];
                })
                ->toArray();
            
            return response()->json([
                'message' => 'Program unarchived successfully',
                'programs' => $programs
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to unarchive program',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get registered patients for a specific program with pagination
     */
    public function getProgramPatients(Request $request, $programId)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);
            
            // Get program details
            $program = program_schedules::with('program_type')->findOrFail($programId);
            
            // Get registered participants with pagination
            $participants = program_participants::where('program_schedule_id', $programId)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);
            
            // Format the participants data
            $formattedParticipants = $participants->map(function ($participant) {
                return [
                    'id' => $participant->registration_id ?? $participant->id, // Use registration_id if available, fallback to id
                    'first_name' => $participant->first_name,
                    'middle_name' => $participant->middle_name,
                    'last_name' => $participant->last_name,
                    'suffix' => $participant->suffix,
                    'sex' => $participant->sex,
                    'birthdate' => $participant->birthdate,
                    'age' => $participant->age,
                    'contact_number' => $participant->contact_number,
                    'email' => $participant->email,
                    'status' => $participant->status,
                    'registered_at' => $participant->created_at->format('Y-m-d H:i:s'),
                    'full_name' => trim(($participant->first_name ?? '') . ' ' . ($participant->middle_name ?? '') . ' ' . ($participant->last_name ?? '') . ' ' . ($participant->suffix ?? '')),
                ];
            });
            
            return response()->json([
                'program' => [
                    'id' => $program->id,
                    'name' => $program->program_type ? $program->program_type->programname : 'Unnamed Program',
                    'date' => $program->date,
                    'location' => $program->location,
                ],
                'participants' => $formattedParticipants,
                'pagination' => [
                    'current_page' => $participants->currentPage(),
                    'last_page' => $participants->lastPage(),
                    'per_page' => $participants->perPage(),
                    'total' => $participants->total(),
                    'from' => $participants->firstItem(),
                    'to' => $participants->lastItem(),
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch program participants',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
