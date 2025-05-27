<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class SettingsController extends Controller
{
    //

    public function index(){
        return Inertia::render("Authenticated/Admin/Settings/Settings");
    }

    public function saveaccount(Request $request){
        $request->validate([
            'firstname' => "required:min2",
            'middlename' => "nullable|min:2",
            'lastname' => "required:min2",
            'email' => [
                'required',
                'min:3',
                Rule::unique('users')->ignore(Auth::user()->id)
            ] ,
        ]);



        Auth::user()->update([
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
        ]);

        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Account settings successfully updated!",
                'icon' => 'success'
            ]
        ]);
    }
}
