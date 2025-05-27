<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\service_days;
use App\Models\servicetypes;
use App\Models\subservice_time;
use App\Models\subservices;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ServicesController extends Controller
{
    // Constants for service status
    const STATUS_ACTIVE = 1;
    const STATUS_ARCHIVED = 0;
    //

    public function index(){ // Overview
        // Get total services count
        $totalServices = servicetypes::count();
        
        // Get total sub-services count
        $totalSubServices = subservices::count();
        
        // Get active services count
        $activeServices = servicetypes::where('status', self::STATUS_ACTIVE)->count();
        
        // Get inactive/archived services count
        $inactiveServices = servicetypes::where('status', self::STATUS_ARCHIVED)->count();
        
        return Inertia::render('Authenticated/Admin/Services/Overview',[
            'staffcount' => $totalServices,
            'admincount' => $totalSubServices,
            'pharmacistcount' => $activeServices,
            'inventoryAlerts' => $inactiveServices
        ]);
    }

    public function services(){


        $services = servicetypes::with(['subservices','servicedays'])->get();
        $services->load('subservices.times');
        return Inertia::render('Authenticated/Admin/Services/Services',[
            'services_' => $services
        ]);
    }
    
    public function create(Request $request){
        // Validate the request
        $validated = $request->validate([
            'servicename' => 'required|string|max:255',
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
            $service->servicename = $validated['servicename'];
            $service->description = $request->description ?? ''; // Make description optional
            $service->status = self::STATUS_ACTIVE; // Set as active by default
            $service->save();
            
            // Commit the transaction
            DB::commit();
            
            // Get updated services list
            $services = servicetypes::with(['subservices','servicedays'])->get();
            $services->load('subservices.times');
            
            // Return JSON response with updated services
            return response()->json([
                'message' => 'Service created successfully!',
                'services' => $services
            ], 200);
            
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

        $request->validate([
            'serviceid' => 'required|exists:servicetypes,id',
            'subservicename'
        ]);

        subservices::insert([
            'service_id' => $request->serviceid,
            'subservicename' => $request->subservicename
        ]);

    }

    public function saveDays(Request $request){
        $request->validate([
            'days' => 'array',
            'days.*' => 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'serviceid' => 'required|exists:servicetypes,id'
        ]);


        try{
            DB::beginTransaction();

            service_days::where('service_id',$request->serviceid)->delete();

            foreach($request->days as $day){
                service_days::insert([
                    'service_id' => $request->serviceid,
                    'day' => $day
                ]);
            }


            DB::commit();
        }
        catch(\Exception $er){
            DB::roleback();
        }

    }

    public function saveTime(Request $request){
        $request->validate([
            'times' => 'array',
            'times.*' => 'date_format:h:i A',
            'subservice_id' => 'required|exists:subservices,id',

            'subservicename' => 'required|min:3'
        ]);

        try{
            DB::beginTransaction();

            subservice_time::where('subservice_id',$request->subservice_id)->delete();

            subservices::where('id',$request->subservice_id)->update([
                'subservicename' => $request->subservicename
            ]);

            foreach ($request->times as $timeStr) {
            // Convert "11:30 AM" to "11:30:00"
            $time24hr = date('H:i:s', strtotime($timeStr));

            subservice_time::insert([
                'subservice_id' => $request->subservice_id,
                'time' => $time24hr // Now in 24-hour format
            ]);
        }
            DB::commit();
        }
        catch(\Exception $er){
            DB::rollBack();
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
}