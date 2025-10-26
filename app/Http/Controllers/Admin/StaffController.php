<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\doctor_details;
use App\Models\securityquestions;
use App\Models\User;
use App\Models\PasswordHistory;
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
        
        // Count doctors with doctor_details records (same as doctors() method)
        $doctorsWithDetails = User::where('roleID','1')
            ->whereHas('doctor_details')
            ->count();
        
        // Calculate total staff count correctly by adding all role counts
        $totalStaff = $admins->count() + $doctorsWithDetails + $pharmacists->count();
        
        return Inertia::render("Authenticated/Admin/Staff/Overview",[
            'staffcount' => $totalStaff,
            'admincount' => $admins->count(),
            'pharmacistcount' => $pharmacists->count(),
            'doctorscount' => $doctorsWithDetails, // Use count that matches doctors() method
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

    // Edit Admin (GET)
    public function editAdmin($id)
    {
        try {
            $admin = User::findOrFail($id);
            
            // Check if this is actually an admin
            if ($admin->roleID != 7) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not an admin'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'admin' => $admin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch admin: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update Admin
    public function updateAdmin(Request $request, $id)
    {
        $request->validate([
            'firstname' => 'nullable|string|max:255',
            'lastname' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'contactno' => 'nullable|string|max:20',
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

            // Convert status string to integer
            $statusMap = [
                'active' => 1,
                'inactive' => 2,
                'suspended' => 3
            ];

            $updateData = [
                'status' => $statusMap[$request->status] ?? 1, // Default to active if invalid status
            ];
            
            // Only update fields that are provided
            if ($request->filled('firstname')) {
                $updateData['firstname'] = $request->firstname;
            }
            if ($request->filled('lastname')) {
                $updateData['lastname'] = $request->lastname;
            }
            if ($request->filled('email')) {
                $updateData['email'] = $request->email;
            }
            if ($request->filled('contactno')) {
                $updateData['contactno'] = $request->contactno;
            }

            // Only update password if provided
            if ($request->filled('password')) {
                // Check if password has been used recently
                if (PasswordHistory::hasUsedPassword($admin->id, $request->password)) {
                    return redirect()->back()->with('error', 'You cannot use a password that you have used recently. Please choose a different password.');
                }
                
                $updateData['password'] = bcrypt($request->password);
                
                // Add password to history
                PasswordHistory::addPassword($admin->id, $request->password);
            }

            $admin->update($updateData);

            return redirect()->back()->with('success', 'Admin updated successfully');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update admin: ' . $e->getMessage());
        }
    }

    // Edit Doctor (GET)
    public function editDoctor($id)
    {
        try {
            $doctor = User::findOrFail($id);
            
            // Check if this is actually a doctor
            if ($doctor->roleID != 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not a doctor'
                ], 400);
            }

            // Get doctor details if available
            $doctorDetails = doctor_details::where('user_id', $doctor->id)->first();

            return response()->json([
                'success' => true,
                'doctor' => $doctor,
                'doctorDetails' => $doctorDetails
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch doctor: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update Doctor
    public function updateDoctor(Request $request, $id)
    {
        \Log::info('Update Doctor Request', [
            'id' => $id,
            'data' => $request->all()
        ]);

        try {
            $request->validate([
                'firstname' => 'nullable|string|max:255',
                'lastname' => 'nullable|string|max:255',
                'email' => 'nullable|email|unique:users,email,' . $id,
                'contactno' => 'nullable|string|max:20',
                'license_number' => 'nullable|string|max:255',
                'status' => 'required|in:active,inactive,suspended',
                'role_id' => 'nullable|integer',
                'password' => 'nullable|string|min:8',
                'password_confirmation' => 'nullable|string|same:password',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', [
                'errors' => $e->errors(),
                'data' => $request->all()
            ]);
            throw $e;
        }

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

            // Convert status string to integer
            $statusMap = [
                'active' => 1,
                'inactive' => 2,
                'suspended' => 3
            ];

            // Update user details - only update fields that are provided
            $updateData = [];
            
            if ($request->filled('firstname')) {
                $updateData['firstname'] = $request->firstname;
            }
            if ($request->filled('lastname')) {
                $updateData['lastname'] = $request->lastname;
            }
            if ($request->filled('email')) {
                $updateData['email'] = $request->email;
            }
            if ($request->filled('contactno')) {
                $updateData['contactno'] = $request->contactno;
            }
            if ($request->filled('license_number')) {
                $updateData['license_number'] = $request->license_number;
            }
            
            $updateData['status'] = $statusMap[$request->status] ?? 1; // Default to active if invalid status

            // Only update password if provided
            if ($request->filled('password')) {
                // Check if password has been used recently
                if (PasswordHistory::hasUsedPassword($doctor->id, $request->password)) {
                    DB::rollBack();
                    return redirect()->back()->with('error', 'You cannot use a password that you have used recently. Please choose a different password.');
                }
                
                $updateData['password'] = bcrypt($request->password);
                
                // Add password to history
                PasswordHistory::addPassword($doctor->id, $request->password);
            }

            $doctor->update($updateData);

            DB::commit();

            \Log::info('Doctor updated successfully', [
                'doctor_id' => $doctor->id,
                'updated_data' => $updateData,
                'doctor_after_update' => $doctor->fresh()->toArray()
            ]);

            return redirect()->back()->with('success', 'Doctor updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Update Doctor Error', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Failed to update doctor: ' . $e->getMessage());
        }
    }

    // Edit Pharmacist (GET)
    public function editPharmacist($id)
    {
        try {
            $pharmacist = User::findOrFail($id);
            
            // Check if this is actually a pharmacist
            if ($pharmacist->roleID != 6) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not a pharmacist'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'pharmacist' => $pharmacist
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pharmacist: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update Pharmacist
    public function updatePharmacist(Request $request, $id)
    {
        $request->validate([
            'firstname' => 'nullable|string|max:255',
            'lastname' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'contactno' => 'nullable|string|max:20',
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

            // Convert status string to integer
            $statusMap = [
                'active' => 1,
                'inactive' => 2,
                'suspended' => 3
            ];

            $updateData = [
                'status' => $statusMap[$request->status] ?? 1, // Default to active if invalid status
            ];
            
            // Only update fields that are provided
            if ($request->filled('firstname')) {
                $updateData['firstname'] = $request->firstname;
            }
            if ($request->filled('lastname')) {
                $updateData['lastname'] = $request->lastname;
            }
            if ($request->filled('email')) {
                $updateData['email'] = $request->email;
            }
            if ($request->filled('contactno')) {
                $updateData['contactno'] = $request->contactno;
            }

            // Only update password if provided
            if ($request->filled('password')) {
                // Check if password has been used recently
                if (PasswordHistory::hasUsedPassword($pharmacist->id, $request->password)) {
                    return redirect()->back()->with('error', 'You cannot use a password that you have used recently. Please choose a different password.');
                }
                
                $updateData['password'] = bcrypt($request->password);
                
                // Add password to history
                PasswordHistory::addPassword($pharmacist->id, $request->password);
            }

            $pharmacist->update($updateData);

            return redirect()->back()->with('success', 'Pharmacist updated successfully');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update pharmacist: ' . $e->getMessage());
        }
    }
}