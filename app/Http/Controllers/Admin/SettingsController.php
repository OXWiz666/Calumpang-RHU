<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SettingsController extends Controller
{
    //

    public function index(){
        return Inertia::render("Authenticated/Admin/Settings/Settings");
    }

    public function pwsettings(){
        return Inertia::render("Authenticated/Admin/Settings/PasswordSettings",[]);
    }

    public function changePw(Request $request){
        $request->validate([
            'oldpw' => [
                function ($attribute, $value, $fail) {
                    if (!Hash::check($value, Auth::user()->password)) {
                        $fail('The old password is incorrect.');
                    }
                }
            ],
            'newpw' => "required|min:3",
            'confirmpw' => "required|same:newpw",
        ]);


        Auth::user()->update([
            'password' => Hash::make($request->newpw)
        ]);

        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Password successfully updated!",
                'icon' => 'success'
            ]
        ]);
    }

    public function saveaccount(Request $request){
        $request->validate([
            'firstname' => "required|min:2",
            'middlename' => "nullable|min:2",
            'lastname' => "required|min:2",
            'email' => [
                'required',
                'min:3',
                Rule::unique('users')->ignore(Auth::user()->id)
            ] ,
            'contactno' => "required|min:11|numeric",
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();
        $updateData = [
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'contactno' => $request->contactno,
        ];

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && \Storage::disk('public')->exists($user->avatar)) {
                \Storage::disk('public')->delete($user->avatar);
            }
            
            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar'] = $avatarPath;
        }

        $user->update($updateData);
        
        // Refresh user to get updated avatar_url
        $user->refresh();

        \Log::info('Admin profile updated', [
            'user_id' => $user->id,
            'avatar_path' => $user->avatar,
            'avatar_url' => $user->avatar_url,
            'update_data' => $updateData
        ]);

        return redirect()->route('admin.settings.index')->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Account settings successfully updated!",
                'icon' => 'success'
            ]
        ]);
    }
}
