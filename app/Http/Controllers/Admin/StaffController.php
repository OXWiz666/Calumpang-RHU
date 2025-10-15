<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\doctor_details;
use App\Models\securityquestions;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;
use App\Notifications\SystemNotification;
use App\Events\SendNotification;
use App\Models\doctor_status;

class StaffController extends Controller
{
    // Status constants
    const STATUS_ACTIVE = 1;
    const STATUS_ARCHIVED = 5; // Using the newly added Archived status
    public function index(){
        $staff = User::whereNot('roleID','7')->get();
        $admins = User::where('roleID','7')->get();
        $doctors = User::where('roleID','1')->get();
        $pharmacists = User::where('roleID','6')->get();
        return Inertia::render("Authenticated/Admin/Staff/Overview",[
            'staffcount' => $staff->count(),
            'admincount' => $admins->count(),
            'pharmacistcount' => $pharmacists->count(),
            'doctorscount' => $doctors->count(),
        ]);
    }
    public function admins(){
        $admins = User::where('roleID', 7)->get();
        return Inertia::render("Authenticated/Admin/Staff/Admins", [
            'admins' => $admins
        ]);
    }

    public function doctors(){
        $doctors = doctor_details::with(['user','specialty','department'])->paginate(10);
        $questions = securityquestions::get();
        return Inertia::render("Authenticated/Admin/Staff/Doctors",[
            'doctorsitems' => $doctors->items(),
            'doctors' => $doctors,
            'questions' => $questions
        ]);
    }

    public function pharmacists(){
        $pharmacists = User::where('roleID', 6)->get();
        return Inertia::render("Authenticated/Admin/Staff/Pharmacists", [
            'pharmacists' => $pharmacists
        ]);
    }

    /**
     * Update the doctor's status
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request, doctor_details $doctor)
    {
    try {
        DB::beginTransaction();

        $request->validate([
            'status' => 'required|integer|between:1,4',
        ]);

        // Get old status value (integer)
        $oldStatus = $doctor->status;
        //dd($doctor);
        // Update doctor status
        $doctor->update(['status' => $request->status]);

        //Get status names (assuming you have a Status model)
        $oldStatusName = doctor_status::find($oldStatus)->statusname;
        $newStatusName = doctor_status::find($request->status)->statusname;

        // Get current user's role
        $userRole = Auth::user()->role->roletype;

        // Prepare notification message
        $message = "{$userRole} has updated Dr. {$doctor->user->lastname}'s status from {$oldStatusName} to {$newStatusName}";

        // Log activity
        ActivityLogger::log($message, $doctor, ['ip' => request()->ip()]);

        // Notify relevant users (roles 1 and 7)
        $recipients = User::whereIn('roleID', [1, 7])->get();

        foreach ($recipients as $recipient) {
            $notification = new SystemNotification(
                $message,
                "A doctor status updated to {$newStatusName}!",
                "doctorstatus_update",
                "#" // Consider using a proper URL here
            );

            $recipient->notify($notification);
            event(new SendNotification($recipient->id));
        }

        DB::commit();

        return redirect()->back()->with('success', 'Status updated successfully');

    } catch (\Exception $e) {
        DB::rollBack();

        //Log::error("Failed to update doctor status: " . $e->getMessage());

        // return response()->json([
        //     'success' => false,
        //     'message' => 'Failed to update status',
        //     'error' => config('app.debug') ? $e->getMessage() : null,
        // ], 500);
    }
}

    /**
     * Archive a staff member
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function archiveStaff(Request $request)
    {
        $request->validate([
            'staff_id' => 'required|exists:users,id',
        ]);

        try {
            // Begin a database transaction
            DB::beginTransaction();
            
            $user = User::findOrFail($request->staff_id);
            
            // Update user status to archived
            $user->status = self::STATUS_ARCHIVED;
            $user->save();
            
            // If it's a doctor, also update doctor_details
            if ($user->roleID == 1) {
                $doctor = doctor_details::where('user_id', $user->id)->first();
                if ($doctor) {
                    $doctor->status = self::STATUS_ARCHIVED;
                    $doctor->save();
                }
            }
            
            // Get current user's role
            $userRole = Auth::user()->role->roletype;
            
            // Prepare notification message based on staff type
            $roleNames = [
                1 => 'Doctor',
                6 => 'Pharmacist', 
                7 => 'Admin'
            ];
            $roleName = $roleNames[$user->roleID] ?? 'Staff';
            $message = "{$userRole} has archived {$roleName} {$user->firstname} {$user->lastname}";
            
            // Log activity
            ActivityLogger::log($message, $user, ['ip' => request()->ip()]);
            
            // Notify relevant users (roles 1, 6, and 7)
            $recipients = User::whereIn('roleID', [1, 6, 7])->get();
            
            foreach ($recipients as $recipient) {
                $notification = new SystemNotification(
                    $message,
                    "A {$roleName} has been archived!",
                    "staff_archive",
                    "#" // Consider using a proper URL here
                );
                
                $recipient->notify($notification);
                event(new SendNotification($recipient->id));
            }
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Staff archived successfully'
            ], 200);
            
        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to archive staff: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Unarchive a staff member
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function unarchiveStaff(Request $request)
    {
        $request->validate([
            'staff_id' => 'required|exists:users,id',
        ]);

        try {
            // Begin a database transaction
            DB::beginTransaction();
            
            $user = User::findOrFail($request->staff_id);
            
            // Update user status to active
            $user->status = self::STATUS_ACTIVE;
            $user->save();
            
            // If it's a doctor, also update doctor_details
            if ($user->roleID == 1) {
                $doctor = doctor_details::where('user_id', $user->id)->first();
                if ($doctor) {
                    $doctor->status = self::STATUS_ACTIVE;
                    $doctor->save();
                }
            }
            
            // Get current user's role
            $userRole = Auth::user()->role->roletype;
            
            // Prepare notification message based on staff type
            $roleNames = [
                1 => 'Doctor',
                6 => 'Pharmacist', 
                7 => 'Admin'
            ];
            $roleName = $roleNames[$user->roleID] ?? 'Staff';
            $message = "{$userRole} has unarchived {$roleName} {$user->firstname} {$user->lastname}";
            
            // Log activity
            ActivityLogger::log($message, $user, ['ip' => request()->ip()]);
            
            // Notify relevant users (roles 1, 6, and 7)
            $recipients = User::whereIn('roleID', [1, 6, 7])->get();
            
            foreach ($recipients as $recipient) {
                $notification = new SystemNotification(
                    $message,
                    "A {$roleName} has been unarchived!",
                    "staff_unarchive",
                    "#" // Consider using a proper URL here
                );
                
                $recipient->notify($notification);
                event(new SendNotification($recipient->id));
            }
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Staff unarchived successfully'
            ], 200);
            
        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to unarchive staff: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    // Update Admin
    public function updateAdmin(Request $request, $id)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'contactno' => 'required|string|max:20',
            'status' => 'required|in:active,inactive,suspended',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        try {
            $admin = User::findOrFail($id);
            
            // Check if this is actually an admin
            if ($admin->roleID != 7) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not an admin'
                ], 400);
            }

            $updateData = [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'contactno' => $request->contactno,
                'status' => $request->status,
            ];

            // Only update password if provided
            if ($request->filled('password')) {
                $updateData['password'] = bcrypt($request->password);
            }

            $admin->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Admin updated successfully',
                'admin' => $admin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update admin: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update Doctor
    public function updateDoctor(Request $request, $id)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'contactno' => 'required|string|max:20',
            'status' => 'required|in:active,inactive,suspended',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        try {
            DB::beginTransaction();

            $doctor = User::findOrFail($id);
            
            // Check if this is actually a doctor
            if ($doctor->roleID != 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not a doctor'
                ], 400);
            }

            // Update user details
            $updateData = [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'contactno' => $request->contactno,
                'status' => $request->status,
            ];

            // Only update password if provided
            if ($request->filled('password')) {
                $updateData['password'] = bcrypt($request->password);
            }

            $doctor->update($updateData);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Doctor updated successfully',
                'doctor' => $doctor
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update doctor: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update Pharmacist
    public function updatePharmacist(Request $request, $id)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'contactno' => 'required|string|max:20',
            'status' => 'required|in:active,inactive,suspended',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        try {
            $pharmacist = User::findOrFail($id);
            
            // Check if this is actually a pharmacist
            if ($pharmacist->roleID != 6) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not a pharmacist'
                ], 400);
            }

            $updateData = [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'contactno' => $request->contactno,
                'status' => $request->status,
            ];

            // Only update password if provided
            if ($request->filled('password')) {
                $updateData['password'] = bcrypt($request->password);
            }

            $pharmacist->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Pharmacist updated successfully',
                'pharmacist' => $pharmacist
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update pharmacist: ' . $e->getMessage()
            ], 500);
        }
    }
}