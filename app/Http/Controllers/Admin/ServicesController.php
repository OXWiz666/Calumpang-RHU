<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\service_days;
use App\Models\servicetypes;
use App\Models\subservice_time;
use App\Models\subservices;
use App\Services\ActivityLogger;
use App\Services\NotifSender;
use Illuminate\Http\Request;
use Illuminate\Notifications\NotificationSender;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ServicesController extends Controller
{
    // Constants for service status
    const STATUS_ACTIVE = 1;
    const STATUS_ARCHIVED = 0;
    //

    public function index(){ // Overview - Redirect to Services Management
        return redirect()->route('admin.services.services');
    }

    public function services(){
        $services = servicetypes::with(['subservices','servicedays'])->get();
        $services->load('subservices.times');
        
        // Calculate real-time slot availability for each service
        $services->each(function($service) {
            // Calculate day-level availability 
            $service->servicedays->each(function($serviceDay) use ($service) {
                $dayName = $serviceDay->day;
                $slotCapacity = $serviceDay->slot_capacity ?? 5; // Default capacity for the day
                
                // Get the next few dates that match this day name 
                $datesToCheck = [];
                $currentDate = \Carbon\Carbon::now();
                
                // Find the next occurrence of this day
                while ($currentDate->format('l') !== $dayName) {
                    $currentDate->addDay();
                }
                
                // Get the next 4 occurrences of this day
                for ($i = 0; $i < 4; $i++) {
                    $datesToCheck[] = $currentDate->format('Y-m-d');
                    $currentDate->addWeek();
                }
                
                // Get total active appointments for this service and day across these specific dates
                $totalBookedForDay = \App\Models\appointments::where('servicetype_id', $service->id)
                    ->whereIn('date', $datesToCheck)
                    ->whereIn('status', [1, 5, 6]) // Only count active appointments (scheduled, confirmed, pending)
                    ->count();
                
                $serviceDay->booked_appointments_for_day = $totalBookedForDay;
                $serviceDay->available_slots_for_day = max(0, $slotCapacity - $totalBookedForDay);
                $serviceDay->total_slots_for_day = $slotCapacity;
            });
            
            // Calculate sub-service level availability with day-based schedules
            $service->subservices->each(function($subservice) {
                // Load day-based slot schedules
                $daySchedules = DB::table('day_slot_schedules')
                    ->where('subservice_id', $subservice->id)
                    ->get();
                
                // Convert day schedules to time slots format for display
                $timeSlots = [];
                $totalAvailableSlots = 0;
                $totalMaxSlots = 0;
                
                foreach ($daySchedules as $daySchedule) {
                    $timeSlotsData = json_decode($daySchedule->time_slots, true);
                    
                    foreach ($timeSlotsData as $timeSlot) {
                        // Calculate real-time availability for this specific time slot on specific dates
                        // Get the next few dates that match this day name
                        $datesToCheck = [];
                        $currentDate = \Carbon\Carbon::now();
                        
                        // Find the next occurrence of this day
                        while ($currentDate->format('l') !== $daySchedule->day) {
                            $currentDate->addDay();
                        }
                        
                        // Get the next 4 occurrences of this day
                        for ($i = 0; $i < 4; $i++) {
                            $datesToCheck[] = $currentDate->format('Y-m-d');
                            $currentDate->addWeek();
                        }
                        
                        // Calculate availability for each specific date
                        $totalBookedForThisTimeSlot = \App\Models\appointments::where('subservice_id', $subservice->id)
                            ->where('time', $timeSlot['time'])
                            ->whereIn('date', $datesToCheck)
                            ->whereIn('status', [1, 5, 6]) // Only count active appointments
                            ->count();
                        
                        // Calculate average availability across the dates (or use the first date's availability)
                        $firstDate = $datesToCheck[0];
                        $bookedOnFirstDate = \App\Models\appointments::where('subservice_id', $subservice->id)
                            ->where('time', $timeSlot['time'])
                            ->where('date', $firstDate)
                            ->whereIn('status', [1, 5, 6])
                            ->count();
                        
                        $availableSlots = max(0, $timeSlot['capacity'] - $bookedOnFirstDate);
                        
                        // Debug logging
                        \Log::info('Admin Services Slot Calculation:', [
                            'subservice_id' => $subservice->id,
                            'day' => $daySchedule->day,
                            'time' => $timeSlot['time'],
                            'capacity' => $timeSlot['capacity'],
                            'first_date' => $firstDate,
                            'booked_on_first_date' => $bookedOnFirstDate,
                            'available_slots' => $availableSlots,
                            'dates_checked' => $datesToCheck
                        ]);
                        
                        $timeSlots[] = [
                            'time' => $timeSlot['time'],
                            'capacity' => $timeSlot['capacity'],
                            'available_slots' => $availableSlots,
                            'booked_slots' => $bookedOnFirstDate,
                            'max_slots' => $timeSlot['capacity'],
                            'day' => $daySchedule->day,
                            'is_day_schedule' => true,
                            'sample_date' => $firstDate // For debugging
                        ];
                        
                        $totalAvailableSlots += $availableSlots;
                        $totalMaxSlots += $timeSlot['capacity'];
                    }
                }
                
                // If no day schedules, fall back to old times system
                if (empty($timeSlots) && $subservice->times) {
                    foreach ($subservice->times as $time) {
                        $timeSlots[] = [
                            'time' => $time->time,
                            'capacity' => $time->max_slots ?? 5,
                            'available_slots' => $time->available_slots ?? 0,
                            'booked_slots' => $time->booked_slots ?? 0,
                            'max_slots' => $time->max_slots ?? 5,
                            'is_day_schedule' => false
                        ];
                        $totalAvailableSlots += $time->available_slots ?? 0;
                        $totalMaxSlots += $time->max_slots ?? 5;
                    }
                }
                
                // Add calculated fields to subservice
                $subservice->time_slots = $timeSlots;
                $subservice->total_available_slots = $totalAvailableSlots;
                $subservice->total_max_slots = $totalMaxSlots;
                $subservice->has_day_schedules = !empty($daySchedules);
            });
        });
        
        return Inertia::render('Authenticated/Admin/Services/Services',[
            'services_' => $services
        ]);
    }

    public function create(Request $request){
        // Validate the request
        $validated = $request->validate([
            'service_name' => 'required|string|max:255|unique:servicetypes,servicename',
        ]);

        try {
            // Begin a database transaction
            DB::beginTransaction();

            // Check if the description column exists in the servicetypes table
            if (!Schema::hasColumn('servicetypes', 'description')) {
                // If the description column doesn't exist, add it
                Schema::table('servicetypes', function ($table) {
                    $table->text('description')->nullable();
                });
            }

            // Create the new service
            $service = new servicetypes();
            $service->servicename = $validated['service_name'];
            $service->description = $request->description ?? ''; // Make description optional
            $service->status = 1; // Set as active by default
            $service->save();


            NotifSender::SendNotif(false,[1,7],'An Admin added a new service','New Service added!');
            ActivityLogger::log('An Admin added a new service',$service,['ip' => $request->ip()],'New Service Added',Auth::user());
            // Commit the transaction
            DB::commit();

            // Get updated services list
            $services = servicetypes::with(['subservices','servicedays'])->get();
            $services->load('subservices.times');



            // Return JSON response with updated services
            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => "Service successully added!",
                    'icon' => 'success'
                ]
            ]);

        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();

            // Return error response
            return response()->json([
                'message' => 'Failed to create service: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createSubService(Request $request){
        try {
            // Check if sub-service name already exists for this service
            $existingSubService = subservices::where('service_id', $request->serviceid)
                ->where('subservicename', $request->subservicename)
                ->first();

            if ($existingSubService) {
                return back()->withErrors([
                    'subservicename' => 'A sub-service with this name already exists for this service.'
                ])->withInput();
            }

            // Validate the request
            $validated = $request->validate([
                'serviceid' => 'required|exists:servicetypes,id',
                'subservicename' => 'required|string|min:3|max:255',
            ]);

            // Create the new sub-service
            subservices::insert([
                'service_id' => $validated['serviceid'],
                'subservicename' => $validated['subservicename']
            ]);

            // Get updated services list
            $services = servicetypes::with(['subservices','servicedays'])->get();
            $services->load('subservices.times');

            // Log activity
            ActivityLogger::log('An Admin added a new sub-service', 
                subservices::latest()->first(), 
                ['ip' => $request->ip()], 
                'New Sub-Service Added', 
                Auth::user()
            );

            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => "Sub-service successfully added!",
                    'icon' => 'success'
                ]
            ]);

        } catch (\Exception $e) {
            // Return error response
            return back()->withErrors([
                'subservicename' => 'Failed to create sub-service: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function saveDays(Request $request){
        $request->validate([
            'days' => 'array',
            'days.*' => 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'serviceid' => 'required|exists:servicetypes,id',
            'daySlots' => 'array',
            'daySlots.*' => 'integer|min:1|max:100'
        ]);

        try{
            DB::beginTransaction();

            service_days::where('service_id',$request->serviceid)->delete();

            foreach($request->days as $day){
                $slotCapacity = $request->daySlots[$day] ?? 20; // Default 20 slots per day
                
                service_days::insert([
                    'service_id' => $request->serviceid,
                    'day' => $day,
                    'slot_capacity' => $slotCapacity
                ]);
            }

            DB::commit();
        }
        catch(\Exception $er){
            DB::rollback();
        }
    }

    public function saveTime(Request $request){
        $request->validate([
            'times' => 'array',
            'times.*' => 'date_format:h:i A',
            'subservice_id' => 'required|exists:subservices,id',
            'subservicename' => 'required|min:3',
            'slot_capacities' => 'array',
            'slot_capacities.*' => 'integer|min:1|max:50'
        ]);

        try{
            DB::beginTransaction();

            subservice_time::where('subservice_id',$request->subservice_id)->delete();

            subservices::where('id',$request->subservice_id)->update([
                'subservicename' => $request->subservicename
            ]);

            foreach ($request->times as $index => $timeStr) {
                // Convert "11:30 AM" to "11:30:00"
                $time24hr = date('H:i:s', strtotime($timeStr));
                
                // Get slot capacity for this time slot (default to 5 if not provided)
                $maxSlots = $request->slot_capacities[$index] ?? 5;

                subservice_time::insert([
                    'subservice_id' => $request->subservice_id,
                    'time' => $time24hr,
                    'max_slots' => $maxSlots,
                    'available_slots' => $maxSlots
                ]);
            }
            DB::commit();
        }
        catch(\Exception $er){
            DB::rollBack();
        }
    }

    /**
     * Update slot capacity for a specific time slot
     */
    public function updateSlotCapacity(Request $request){
        $request->validate([
            'time_id' => 'required|exists:subservice_time,id',
            'max_slots' => 'required|integer|min:1|max:50'
        ]);

        try{
            $timeSlot = subservice_time::findOrFail($request->time_id);
            
            // Calculate new available slots based on current bookings
            $currentBookings = $timeSlot->max_slots - $timeSlot->available_slots;
            $newAvailableSlots = max(0, $request->max_slots - $currentBookings);
            
            $timeSlot->update([
                'max_slots' => $request->max_slots,
                'available_slots' => $newAvailableSlots
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Slot capacity updated successfully',
                'time_slot' => $timeSlot
            ]);
        }
        catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to update slot capacity: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Archive a service
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function archiveService(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:servicetypes,id',
        ]);

        try {
            // Begin a database transaction
            DB::beginTransaction();

            $service = servicetypes::findOrFail($request->service_id);

            // Check if status column exists
            if (!Schema::hasColumn('servicetypes', 'status')) {
                // If status column doesn't exist, add it
                Schema::table('servicetypes', function ($table) {
                    $table->integer('status')->default(self::STATUS_ACTIVE);
                });
            }

            $service->status = self::STATUS_ARCHIVED;
            $service->save();

            // Commit the transaction
            DB::commit();

            // Get updated services list
            $services = servicetypes::with(['subservices','servicedays'])->get();
            $services->load('subservices.times');

            return response()->json([
                'message' => 'Service archived successfully',
                'services' => $services
            ], 200);

        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to archive service: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Unarchive a service
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function unarchiveService(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:servicetypes,id',
        ]);

        try {
            // Begin a database transaction
            DB::beginTransaction();

            $service = servicetypes::findOrFail($request->service_id);

            // Check if status column exists
            if (!Schema::hasColumn('servicetypes', 'status')) {
                // If status column doesn't exist, add it
                Schema::table('servicetypes', function ($table) {
                    $table->integer('status')->default(self::STATUS_ACTIVE);
                });
            }

            $service->status = self::STATUS_ACTIVE;
            $service->save();

            // Commit the transaction
            DB::commit();

            // Get updated services list
            $services = servicetypes::with(['subservices','servicedays'])->get();
            $services->load('subservices.times');

            return response()->json([
                'message' => 'Service unarchived successfully',
                'services' => $services
            ], 200);

        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to unarchive service: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Archive a sub-service
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function archiveSubService(Request $request)
    {
        $request->validate([
            'subservice_id' => 'required|exists:subservices,id',
        ]);

        try {
            // Begin a database transaction
            DB::beginTransaction();

            $subservice = subservices::findOrFail($request->subservice_id);

            // Check if status column exists, if not add it
            if (!Schema::hasColumn('subservices', 'status')) {
                Schema::table('subservices', function ($table) {
                    $table->integer('status')->default(self::STATUS_ACTIVE);
                });
            }

            $subservice->status = self::STATUS_ARCHIVED;
            $subservice->save();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Sub-service archived successfully'
            ], 200);

        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to archive sub-service: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Unarchive a sub-service
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function unarchiveSubService(Request $request)
    {
        $request->validate([
            'subservice_id' => 'required|exists:subservices,id',
        ]);

        try {
            // Begin a database transaction
            DB::beginTransaction();

            $subservice = subservices::findOrFail($request->subservice_id);

            // Check if status column exists, if not add it
            if (!Schema::hasColumn('subservices', 'status')) {
                Schema::table('subservices', function ($table) {
                    $table->integer('status')->default(self::STATUS_ACTIVE);
                });
            }

            $subservice->status = self::STATUS_ACTIVE;
            $subservice->save();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Sub-service unarchived successfully'
            ], 200);

        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to unarchive sub-service: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Update date-specific slot overrides for a subservice
     */
    public function updateDateSlots(Request $request)
    {
        try {
            $request->validate([
                'subservice_id' => 'required|exists:subservices,id',
                'overrides' => 'required|array',
                'overrides.*.date' => 'required|date|after_or_equal:today',
                'overrides.*.time' => 'required|string',
                'overrides.*.capacity' => 'required|integer|min:0|max:50'
            ]);

            $subserviceId = $request->subservice_id;
            $overrides = $request->overrides;

            // Start database transaction
            DB::beginTransaction();

            // Clear existing date-specific overrides for this subservice
            DB::table('date_slot_overrides')
                ->where('subservice_id', $subserviceId)
                ->delete();

            // Insert new overrides
            foreach ($overrides as $override) {
                DB::table('date_slot_overrides')->insert([
                    'subservice_id' => $subserviceId,
                    'date' => $override['date'],
                    'time' => $override['time'],
                    'capacity' => $override['capacity'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // Commit transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Date-specific slot overrides updated successfully',
                'overrides_count' => count($overrides)
            ], 200);

        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update date-specific slots: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update day-based slot schedules for a subservice
     */
    public function updateDaySlots(Request $request)
    {
        try {
            $request->validate([
                'subservice_id' => 'required|exists:subservices,id',
                'schedules' => 'required|array'
            ]);
            
            // Additional validation only if schedules is not empty
            if (count($request->schedules) > 0) {
                $request->validate([
                    'schedules.*.day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                    'schedules.*.timeSlots' => 'required|array|min:1',
                    'schedules.*.timeSlots.*.time' => 'required|string',
                    'schedules.*.timeSlots.*.capacity' => 'required|integer|min:1|max:50'
                ]);
            }

            $subserviceId = $request->subservice_id;
            $schedules = $request->schedules;

            // Start database transaction
            DB::beginTransaction();

            // Clear existing day-based schedules for this subservice
            DB::table('day_slot_schedules')
                ->where('subservice_id', $subserviceId)
                ->delete();

            // Insert new schedules if any (empty array means clearing all schedules)
            if (count($schedules) > 0) {
                foreach ($schedules as $schedule) {
                    // Additional validation for non-empty schedules
                    if (empty($schedule['day']) || empty($schedule['timeSlots'])) {
                        throw new \Exception('Invalid schedule data');
                    }
                    
                    DB::table('day_slot_schedules')->insert([
                        'subservice_id' => $subserviceId,
                        'day' => $schedule['day'],
                        'time_slots' => json_encode($schedule['timeSlots']),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }

            // Commit transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($schedules) > 0 
                    ? 'Day-based slot schedules updated successfully' 
                    : 'All day-based slot schedules cleared successfully',
                'schedules_count' => count($schedules)
            ], 200);

        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update day-based schedules: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
}