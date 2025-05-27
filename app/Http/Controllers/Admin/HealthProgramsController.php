<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\program_types;
use App\Models\program_schedules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class HealthProgramsController extends Controller
{
    // Archive and unarchive methods
    public function index(){
        // Get programs from database
        $programs = program_schedules::with(['program_type', 'coordinator'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($program) {
                return [
                    'id' => $program->id,
                    'name' => $program->program_type->programname,
                    'description' => $program->program_type->description,
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

        // Get all active doctors for the coordinator dropdown (exclude archived doctors)
        $doctors = DB::table('users')
            ->join('doctor_details', 'users.id', '=', 'doctor_details.user_id')
            ->where('users.roleID', 1) // Role ID for doctors
            ->where('doctor_details.status', '!=', 5) // Exclude archived doctors (status 5)
            ->select('users.id', 'users.firstname', 'users.lastname')
            ->get();
            
        // Get statistics for admin overview
        $activePrograms = program_schedules::where('status', 'Active')->count();
        $archivedPrograms = program_schedules::where('status', 'Archived')->count();
        
        // Get today's appointments count
        $today = date('Y-m-d');
        $todayAppointments = DB::table('appointments')
            ->whereDate('date', $today)
            ->count();
            
        // Get total participants across all programs
        $totalParticipants = program_schedules::sum(DB::raw('total_slots - available_slots'));

        return Inertia::render("Authenticated/Admin/HealthPrograms",[
            'programs' => $programs,
            'doctors' => $doctors,
            'activePrograms' => $activePrograms,
            'archivedPrograms' => $archivedPrograms,
            'todayAppointments' => $todayAppointments,
            'totalParticipants' => $totalParticipants
        ]);
    }

    /**
     * Fetch programs data for AJAX requests
     */
    public function fetch(){
        // Get programs from database
        $programs = program_schedules::with(['program_type', 'coordinator'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($program) {
                return [
                    'id' => $program->id,
                    'name' => $program->program_type->programname,
                    'description' => $program->program_type->description,
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
            'success' => true,
            'programs' => $programs
        ]);
    }

    public function CreateProgram(Request $request){
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

        try{
            // Begin a database transaction
            DB::beginTransaction();
            
            // First, create or find the program type
            $programType = program_types::firstOrCreate(
                ['programname' => $request->programname],
                ['description' => $request->description]
            );
            
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
            
            // Commit the transaction
            DB::commit();
            
            // Get updated programs list
            $programs = program_schedules::with(['program_type', 'coordinator'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($program) {
                    return [
                        'id' => $program->id,
                        'name' => $program->program_type->programname,
                        'description' => $program->program_type->description,
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
            
            return redirect()->back()->with([
                'success' => 'Health program created successfully',
                'programs' => $programs
            ]);
        }
        catch(\Exception $er){
            return redirect()->back()->with('error', 'Failed to create health program: ' . $er->getMessage());
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
                        'name' => $program->program_type->programname,
                        'description' => $program->program_type->description,
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
                        'name' => $program->program_type->programname,
                        'description' => $program->program_type->description,
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
}
