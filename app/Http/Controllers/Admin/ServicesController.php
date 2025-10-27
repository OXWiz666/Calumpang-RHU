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
            // Get all month-specific configurations for this service
            $monthConfigs = DB::table('month_day_configurations')
                ->where('service_id', $service->id)
                ->get()
                ->keyBy(function($config) {
                    return $config->year . '_' . $config->month;
                });
            
            // Get all days that have month-specific configurations
            $monthSpecificDays = collect($monthConfigs)->flatMap(function($config) {
                $dayConfigs = json_decode($config->day_configurations, true);
                return $dayConfigs ? array_keys($dayConfigs) : [];
            })->unique()->values();
            
            // Combine month-specific days with servicedays to show all configured days
            $servicedaysList = $service->servicedays ? $service->servicedays->pluck('day') : collect([]);
            $allConfiguredDays = $servicedaysList
                ->concat($monthSpecificDays)
                ->unique()
                ->values();
            
            // Create a structure for all days
            $daysToProcess = $allConfiguredDays->map(function($dayName) use ($service) {
                return (object)[
                    'day' => $dayName,
                    'slot_capacity' => $service->servicedays->where('day', $dayName)->first()?->slot_capacity ?? 20,
                    'is_from_servicedays' => $service->servicedays->contains('day', $dayName),
                    'has_month_config' => false,
                    'date_specific_availability' => []
                ];
            });
            
            // Calculate day-level availability per specific date (like patient side)
            $daysToProcess->each(function($serviceDay) use ($service, $monthConfigs) {
                $dayName = $serviceDay->day;
                $configuredCapacity = $serviceDay->slot_capacity ?? 20; // Use configured capacity
                
                // Get ALL configured dates across all configured months for this day
                $dateSpecificAvailability = [];
                $now = \Carbon\Carbon::now();
                
                // Loop through all month configurations to find which months have this day configured
                foreach ($monthConfigs as $monthKey => $monthConfig) {
                    $dayConfigs = json_decode($monthConfig->day_configurations, true);
                    if (isset($dayConfigs[$dayName])) {
                        // This month has configurations for this day - get all dates
                        $year = $monthConfig->year;
                        $month = $monthConfig->month;
                        $totalDayCapacity = $dayConfigs[$dayName]['slot_capacity'] ?? 0;
                        
                        // Get all dates of this day in this month-year
                        $firstOfMonth = \Carbon\Carbon::createFromDate($year, $month, 1);
                        
                        // Find the first occurrence of this day in the month
                        $currentDate = $firstOfMonth->copy();
                        $dayIndex = ['Sunday' => 0, 'Monday' => 1, 'Tuesday' => 2, 'Wednesday' => 3, 'Thursday' => 4, 'Friday' => 5, 'Saturday' => 6][$dayName];
                        
                        while ($currentDate->dayOfWeek !== $dayIndex) {
                            $currentDate->addDay();
                        }
                        
                        // Collect all occurrences of this day in the month
                        while ($currentDate->format('n') == $month && $currentDate->format('Y') == $year) {
                            $dateStr = $currentDate->format('Y-m-d');
                            
                            // Count bookings for this specific date
                            $totalBookedForDate = \App\Models\appointments::where('servicetype_id', $service->id)
                                ->where('date', $dateStr)
                                ->whereIn('status', [1, 5, 6])
                                ->count();
                            
                            $availableSlots = max(0, $totalDayCapacity - $totalBookedForDate);
                            
                            $dateSpecificAvailability[] = [
                                'date' => $dateStr,
                                'date_formatted' => $currentDate->format('M d, Y'),
                                'day_of_week' => $currentDate->format('l'),
                                'available_slots' => $availableSlots,
                                'total_slots' => $totalDayCapacity,
                                'booked_slots' => $totalBookedForDate,
                                'is_month_specific' => true,
                                'month' => $month,
                                'year' => $year
                            ];
                            
                            $currentDate->addWeek();
                        }
                    }
                }
                
                // Store the date-specific availability
                if (count($dateSpecificAvailability) > 0) {
                    $serviceDay->date_specific_availability = $dateSpecificAvailability;
                    
                    // Group by month to calculate separate stats per month
                    $monthGroups = [];
                    foreach ($dateSpecificAvailability as $dateData) {
                        $monthYear = ($dateData['month'] ?? date('n')) . '_' . ($dateData['year'] ?? date('Y'));
                        if (!isset($monthGroups[$monthYear])) {
                            $monthGroups[$monthYear] = [];
                        }
                        $monthGroups[$monthYear][] = $dateData;
                    }
                    
                    // Calculate total available slots (aggregated across all dates for display)
                    $totalAvailableAcrossAllDates = array_sum(array_column($dateSpecificAvailability, 'available_slots'));
                    
                    // For total_slots_for_day, use the weighted average based on number of dates in each month config
                    // This gives us a representative capacity value
                    $totalDateCount = count($dateSpecificAvailability);
                    $totalCapacitySum = array_sum(array_column($dateSpecificAvailability, 'total_slots'));
                    $avgTotalSlots = $totalDateCount > 0 ? ($totalCapacitySum / $totalDateCount) : $configuredCapacity;
                    
                    $serviceDay->total_slots_for_day = $avgTotalSlots;
                    $serviceDay->available_slots_for_day = $totalAvailableAcrossAllDates;
                    $serviceDay->booked_appointments_for_day = array_sum(array_column($dateSpecificAvailability, 'booked_slots'));
                    $serviceDay->month_groups = $monthGroups; // Store grouped data for frontend
                } else {
                    // If no month-specific configs but day is in servicedays (global config), 
                    // set defaults so it shows up in the table
                    if ($serviceDay->is_from_servicedays) {
                        $serviceDay->total_slots_for_day = $configuredCapacity;
                        $serviceDay->available_slots_for_day = 0; // Will be calculated from bookings if needed
                        $serviceDay->booked_appointments_for_day = 0;
                    }
                }
                
                // Mark if this day exists in any month configurations
                $serviceDay->has_month_config = count($dateSpecificAvailability) > 0;
            });
            
            // Build the final servicedays - ensure we always include servicedays data
            $finalServiceDays = [];
            
            foreach ($daysToProcess as $serviceDay) {
                // Properly convert to array, preserving nested structures
                $dayArray = [
                    'day' => $serviceDay->day ?? null,
                    'slot_capacity' => $serviceDay->slot_capacity ?? 20,
                    'available_slots_for_day' => $serviceDay->available_slots_for_day ?? 0,
                    'total_slots_for_day' => $serviceDay->total_slots_for_day ?? ($serviceDay->slot_capacity ?? 20),
                    'booked_appointments_for_day' => $serviceDay->booked_appointments_for_day ?? 0,
                    'is_from_servicedays' => $serviceDay->is_from_servicedays ?? false,
                    'has_month_config' => $serviceDay->has_month_config ?? false,
                ];
                
                // Add date-specific availability if it exists
                if (isset($serviceDay->date_specific_availability)) {
                    $dayArray['date_specific_availability'] = array_map(function($item) {
                        return (array)$item;
                    }, $serviceDay->date_specific_availability);
                }
                
                // Add month_groups if it exists
                if (isset($serviceDay->month_groups)) {
                    $dayArray['month_groups'] = array_map(function($group) {
                        return array_map(function($item) {
                            return (array)$item;
                        }, $group);
                    }, $serviceDay->month_groups);
                }
                
                $finalServiceDays[] = $dayArray;
            }
            
            // Replace servicedays with processed days using setAttribute to ensure it's serialized
            $service->setAttribute('servicedays', $finalServiceDays);
            
            // Calculate sub-service level availability with day-based schedules
            $service->subservices->each(function($subservice) use ($service) {
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
                        // Convert time format for database query
                        // Database stores as "13:00:00" but day_slot_schedules stores as "13:00"
                        $timeFormattedForQuery = $timeSlot['time'];
                        if (strlen($timeFormattedForQuery) <= 5) {
                            // Convert "13:00" to "13:00:00" format
                            $timeFormattedForQuery = $timeFormattedForQuery . ':00';
                        }
                        
                        // Get ALL specific dates from month configurations for this day
                        $specificDates = [];
                        
                        // Get service-level month configurations
                        $serviceMonthConfigs = DB::table('month_day_configurations')
                            ->where('service_id', $service->id)
                            ->get();
                        
                        foreach ($serviceMonthConfigs as $monthConfig) {
                            $dayConfigs = json_decode($monthConfig->day_configurations, true);
                            if (isset($dayConfigs[$daySchedule->day])) {
                                // Generate all dates for this day in this month-year
                                $firstOfMonth = \Carbon\Carbon::createFromDate($monthConfig->year, $monthConfig->month, 1);
                                $currentDate = $firstOfMonth->copy();
                                $dayIndex = ['Sunday' => 0, 'Monday' => 1, 'Tuesday' => 2, 'Wednesday' => 3, 'Thursday' => 4, 'Friday' => 5, 'Saturday' => 6][$daySchedule->day];
                                
                                while ($currentDate->dayOfWeek !== $dayIndex) {
                                    $currentDate->addDay();
                                }
                                
                                while ($currentDate->format('n') == $monthConfig->month && $currentDate->format('Y') == $monthConfig->year) {
                                    $specificDates[] = $currentDate->format('Y-m-d');
                                    $currentDate->addWeek();
                                }
                            }
                        }
                        
                        // If no month configs found, get next 4 occurrences
                        if (empty($specificDates)) {
                            $currentDate = \Carbon\Carbon::now();
                            while ($currentDate->format('l') !== $daySchedule->day) {
                                $currentDate->addDay();
                            }
                            for ($i = 0; $i < 4; $i++) {
                                $specificDates[] = $currentDate->format('Y-m-d');
                                $currentDate->addWeek();
                            }
                        }
                        
                        // Create a time slot entry for EACH specific date
                        foreach ($specificDates as $dateStr) {
                            $bookedForDate = \App\Models\appointments::where('subservice_id', $subservice->id)
                                ->where('time', $timeFormattedForQuery)
                                ->where('date', $dateStr)
                                ->whereIn('status', [1, 5, 6])
                                ->count();
                            
                            $availableSlots = max(0, $timeSlot['capacity'] - $bookedForDate);
                            
                            $timeSlots[] = [
                                'time' => $timeSlot['time'],
                                'capacity' => $timeSlot['capacity'],
                                'available_slots' => $availableSlots,
                                'booked_slots' => $bookedForDate,
                                'max_slots' => $timeSlot['capacity'],
                                'day' => $daySchedule->day,
                                'is_day_schedule' => true,
                                'specific_date' => $dateStr,
                                'date_formatted' => \Carbon\Carbon::parse($dateStr)->format('M d, Y'),
                                'sample_date' => $dateStr
                            ];
                            
                            $totalAvailableSlots += $availableSlots;
                            $totalMaxSlots += $timeSlot['capacity'];
                        }
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
                
                // Add calculated fields to subservice using setAttribute
                $subservice->setAttribute('time_slots', $timeSlots);
                $subservice->setAttribute('total_available_slots', $totalAvailableSlots);
                $subservice->setAttribute('total_max_slots', $totalMaxSlots);
                $subservice->setAttribute('has_day_schedules', !empty($daySchedules));
            });
            
            // Load month-specific configurations for this service
            $monthConfigs = DB::table('month_day_configurations')
                ->where('service_id', $service->id)
                ->get();
            
            $service->setAttribute('month_configurations', $monthConfigs->map(function($config) {
                return [
                    'id' => (string)$config->id,
                    'service_id' => $config->service_id,
                    'year' => $config->year,
                    'month' => $config->month,
                    'day_configurations' => json_decode($config->day_configurations, true),
                    'created_at' => $config->created_at,
                    'updated_at' => $config->updated_at
                ];
            }));
        });
        
        // Transform the collection to ensure servicedays data is properly serialized
        $transformedServices = $services->map(function($service) {
            $serviceArray = $service->toArray();
            // Ensure servicedays is in the array
            if (isset($service->servicedays)) {
                $serviceArray['servicedays'] = $service->servicedays;
            }
            return $serviceArray;
        });
        
        return Inertia::render('Authenticated/Admin/Services/Services',[
            'services_' => $transformedServices
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

    /**
     * Update month-specific day configurations
     */
    public function updateMonthDays(Request $request)
    {
        try {
            $request->validate([
                'service_id' => 'required|exists:servicetypes,id',
                'year' => 'required|integer',
                'month' => 'required|integer|min:1|max:12',
                'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'dates' => 'required|array',
                'slot_capacity' => 'required|integer|min:1|max:100'
            ]);

            $serviceId = $request->service_id;
            $year = $request->year;
            $month = $request->month;
            $day = $request->day;
            $dates = $request->dates;
            $slotCapacity = $request->slot_capacity;

            // Start database transaction
            DB::beginTransaction();

            // Store month-specific configuration
            // Use a JSON structure to store which days are configured for which months
            $monthConfig = DB::table('month_day_configurations')
                ->where('service_id', $serviceId)
                ->where('year', $year)
                ->where('month', $month)
                ->first();

            if ($monthConfig) {
                // Update existing configuration
                $dayConfigs = json_decode($monthConfig->day_configurations, true) ?? [];
                $dayConfigs[$day] = [
                    'slot_capacity' => $slotCapacity,
                    'dates' => $dates,
                    'updated_at' => now()
                ];
                
                DB::table('month_day_configurations')
                    ->where('service_id', $serviceId)
                    ->where('year', $year)
                    ->where('month', $month)
                    ->update([
                        'day_configurations' => json_encode($dayConfigs),
                        'updated_at' => now()
                    ]);
            } else {
                // Create new configuration
                $dayConfigs = [
                    $day => [
                        'slot_capacity' => $slotCapacity,
                        'dates' => $dates,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]
                ];
                
                DB::table('month_day_configurations')->insert([
                    'service_id' => $serviceId,
                    'year' => $year,
                    'month' => $month,
                    'day_configurations' => json_encode($dayConfigs),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // Commit transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Month-specific day configuration saved successfully',
                'dates_count' => count($dates)
            ], 200);

        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update month-specific configuration: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a month-specific day configuration
     */
    public function deleteMonthConfiguration($id)
    {
        try {
            $deleted = DB::table('month_day_configurations')
                ->where('id', $id)
                ->delete();

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Configuration not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Month-specific configuration deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete configuration: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update month configuration by modifying day_configurations
     */
    public function updateMonthDayConfiguration(Request $request, $id)
    {
        try {
            $request->validate([
                'day_configurations' => 'required|array'
            ]);

            $config = DB::table('month_day_configurations')
                ->where('id', $id)
                ->first();

            if (!$config) {
                return response()->json([
                    'success' => false,
                    'message' => 'Configuration not found'
                ], 404);
            }

            // If day_configurations is empty, delete the entire configuration
            if (empty($request->day_configurations)) {
                DB::table('month_day_configurations')
                    ->where('id', $id)
                    ->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Month configuration deleted (no days remaining)'
                ], 200);
            }

            // Update the day_configurations
            DB::table('month_day_configurations')
                ->where('id', $id)
                ->update([
                    'day_configurations' => json_encode($request->day_configurations),
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Month configuration updated successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update configuration: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
}