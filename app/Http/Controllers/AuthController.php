<?php

namespace App\Http\Controllers;

use App\Events\SendNotification;
use App\Models\doctor_details;
use App\Models\password_reset_tokens;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

use App\Models\roles;
use App\Models\securityquestions;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;


use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use function Laravel\Prompts\password;

use App\Services\ActivityLogger;
use App\Notifications\SystemNotification;
use App\Services\NotifSender;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{


    public function getRedirectRoute() : Response
    {
        if(!Auth::check())
            return redirect()->route('login');

        //return redirect()->route('register');

        switch(Auth::user()->roleID){ // For Route . ->name()
             case "1":
                return redirect()->route('doctor.home');
            // case "4":
            //     return redirect()->route('midwife.dashboard');
            case "6":
                return redirect()->route('pharmacist.dashboard');
            case "7":
                return redirect()->route('admin');
            default:
                return redirect()->intended('/');
        }
    }

    public function showAuthContainer()
    {
        return view('Login.auth-container', [
            'logoUrl' => 'https://i.ibb.co/hSNmV3S/344753576-269776018821308-8152932488548493632-n.jpg',
            'healthCenterName' => 'Barangay Calumpang Health Center',
        ]);
    }

    public function showLogin()
    {
        //return view('Auth.login');
        return Inertia::render("Auth/Login2");
    }

    public function showRegisterForm()
    {
        $roles = roles::get();
        $questions = securityquestions::get();
        return Inertia::render("Auth/Register2",[
            "roles" => $roles,
            "questions" => $questions
        ]);
        //return view('Auth.register',compact('roles','questions'));
    }



    public function SearchEmail(Request $request){
        $request->validate([
            'email' => 'required'
        ]);

        //$email = User::where('email', $request->email)->first();

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            //return back()->with('status', __($status));

            return back()->with([
                'flash' => [
                    'title' => 'Email sent!',
                    'message' => 'Please check your email',
                    'icon' => 'success'
                ]
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);

        // return back()->with([
        //     'flash' => [
        //         'title' => 'Email sent!',
        //         'message' => 'Please check your email',
        //         'icon' => 'success'
        //     ]
        // ]);
    }

    public function NewPassword(Request $request){

        $request->validate([
            'email' => 'exists:password_reset_tokens,email',
            // 'token' => 'required'
        ]);
        return Inertia::render('Auth/ResetPassword2',[
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    public function StoreNewPassword(Request $request): RedirectResponse{
        $request->validate([
            'token' => "required",
            'email' => "required|email",//'exists:password_reset_tokens,email',
            'password' => ['required', 'min:3'],
            'password_confirmation' => 'same:password'
        ]);

        //$access = password_reset_tokens::where('token', Hash::make($request->route('token')))->first();




         $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );
        if ($status == Password::PASSWORD_RESET) {
            return redirect()->route('login')->with([
                'flash' => [
                    'title' => "Success!",
                    'message' => "Password has been reset!",
                    'icon' => 'success'
                ]
            ]);
            //return redirect()->route('login')->with('status', __($status));
        }
        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    public function showForgotPasswordForm()
    {
        //return view('auth.forgot');
        $Q = securityquestions::get();
        //return view('Auth.forgot',compact('Q'));
        //return view('auth.reset-password',compact('Q'));

        return Inertia::render("Auth/ForgotPassword2",[
            "" => ""
        ]);
    }

    public function showResetPassword($token){

        if(!password_reset_tokens::where('token',$token)){
            return redirect()->route('login')->with('Error','Invalid Token');
        };
        $Q = securityquestions::get();
        return view ('Auth.reset-password',compact('token','Q'));
    }

    public function ResetPassword(Request $request,$token){
        $request->validate([
            'question' => 'required|numeric',
            'answer' => 'required',
            'password' => 'required|min:8',
            'newpassword' => 'same:password|required|min:8'
        ]);

        $check = password_reset_tokens::where('token',$token)
        ->first();



        if(!User::where('email',$check->email)
        ->where('questionID',$request->question)
        ->where('answer',$request->answer)
        ->update([
            'password' => Hash::make($request->password)
        ])){
            return redirect()->back()->with('error','Question or Answer is incorrect!');
        }

        password_reset_tokens::where('token',$token)
        ->orWhere('email',$check->email)->delete();

        //dd($request->email);
        if($check){
            return redirect()->route('login')->with('success','Password has been successfully reset!');
        }else{
            return redirect()->back()->with('error','Please check all details.');
        }
    }

    public function forgotPwFormPost(Request $request){
        // Check if email is valid & exists in DB

        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $token = Str::random(65);

        password_reset_tokens::insert([
            'email' => $request->email,
            'token' => $token
        ]);

        Mail::send('Auth.resetpw-email',['token' => $token], function($message) use($request){
            $message->to($request->email);
            $message->subject('Forgot Password');
        });

        return redirect()->back()->with('success','Link has been sent to your email. Please check it out!');
        //dd($token);

    }

    // public function login(Request $request)
    // {
    //     // Validate the login request
    //     $credentials = $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required',
    //     ]);


    //      // Attempt to log the user in
    //     if (Auth::attempt($credentials)) {
    //         // Authentication was successful, redirect the user
    //         $user = Auth::user();
    //         $token = $user->createToken($user->email)->plainTextToken;

    //         $cookie = cookie('jwt', $token, 60*24,null,null,true,true,false,'None'); // 1 day
    //         $request->session()->regenerate();
    //         if ($request->wantsJson()) {

    //             return response()->json([
    //                 'token' => $token,
    //                 'message' => 'Login successful'
    //             ]);
    //         }


    //          // If the request is from Vue.js (or API), return the token as a JSON response


    //         return redirect()->intended('/')->withCookie($cookie);  // Redirect to the intended route, like the dashboard
    //     }

    //      // Attempt to log the user in
    //     // if (Auth::attempt($credentials)) {
    //     //     // Authentication was successful, redirect the user
    //     //     return redirect()->intended('/');  // Redirect to the intended route, like the dashboard
    //     // }
    //     // Attempt to log the user in
    //     // if (auth()->attempt($credentials)) {
    //     //     // Authentication passed, redirect to intended page or dashboard
    //     //     return redirect()->intended('dashboard')->with('success', 'You are logged in!');
    //     // }
    //     // if (auth()->attempt($credentials)) {
    //     //     // Authentication passed, redirect to intended page or dashboard
    //     //     return redirect()->intended('dashboard')->with('success', 'You are logged in!');
    //     // }

    //     // // Authentication failed, redirect back with error message
    //     // return redirect()->back()->with('error','Invalid Credentials');
    //     // // Authentication failed, redirect back with error message
    //     return redirect()->back()->with('error','Invalid Credentials');
    // }

    public function stafflogin(){
        return Inertia::render('Auth/StaffLogin',[
            'roles' => roles::get()
        ]);
    }

    public function login(Request $request, $role){
        if(!Auth::attempt($request->only('email','password'))){
            return back()->withErrors([
                        'error' => 'Invalid credentials',
                    ]);
        }

        // Get the authenticated user
        $user = Auth::user();

        // Check if the user's account is archived
        if ($user->status == 5) { // 5 = Archived status
            Auth::logout(); // Log the user out
            return back()->withErrors([
                'error' => 'Your account has been archived. Please contact an administrator for assistance.',
            ]);
        }

        // // Check if the user's role doesn't match the expected role
        // if ($user->roleID != $role) { // Assuming the role is stored in a 'role' column
        //     Auth::logout(); // Log the user out since the role doesn't match
        //     return back()->with([
        //         //'error' => 'You are not authorized to access this area',
        //         'flash' => [
        //             'message' => 'You are not authorized to access this area',
        //             'title' => 'Error!',
        //             'icon' => 'error'
        //         ]
        //     ]);
        // }

        return redirect()->intended(route('home'));
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|min:2',
            'middlename' => 'required|min:2',
            'last_name' => 'required|min:2',
            //'suffix' => 'required|min:2',
            'contactNumber' => 'required|min:11|numeric',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'securityQuestion' => "required|exists:securityquestions,id",
            'securityAnswer' => 'required',
            'confirmPassword' => 'required|same:password',
            'gender' => 'required|in:M,F',
            'birth' => 'required|date'
        ]);
        //dd($request);
        //$isAdmin = $request->input('isAdmin', 'false'); // Get isAdmin from request data
        try{
            DB::beginTransaction();

            $newUser = User::create([
                'firstname' => $request->first_name,
                'middlename' => $request->middlename,
                'lastname' => $request->last_name,
                'suffix' => $request->suffix ?? null,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'contactno' => $request->contactNumber,
                'roleID' => $request->isAdmin == 'true' ? 7 : 2,
                'questionID' => $request->securityQuestion ?? null,
                'answer' => $request->securityAnswer ?? null,
                'gender' => $request->gender,
                'birth' => $request->birth,
            ]);

            $admins = User::where('roleID', '7')->get();
            foreach ($admins as $admin) {
                $admin->notify(new SystemNotification(
                    "{$newUser->firstname} {$newUser->lastname} registered as Admin!",
                    'New Admin has been registered!',
                    'new_patient'
                ));

                event(new SendNotification($admin->id));
            }

            DB::commit();
            return Inertia::render("Auth/Login2",[
                "flash" => [
                    "message" => "Registered Successfully!",
                    "icon" => "success",
                    "title" => "Success!"
                ]
            ]);
        }
        catch(\Exception $er){
            dd($er);
            DB::rollBack();
        }
        // return redirect()->back()->with('success', 'Registration successful');
        //return redirect()->route('login')->with('success','Registered Successfully!');
    }

    public function registerStaff(Request $request){
        // Basic validation
        $request->validate([
            'first_name'=> "required|min:2",
            'middlename'=> "nullable|min:2",
            'last_name'=> "required|min:2",
            //'suffix'=> "required|min:2",
            'contactNumber'=> "required|min:11|numeric",
            'email'=> "required|email|unique:users,email",
            'password'=> "required|min:3",
            'confirmPassword'=> "required|same:password",
            'gender'=> "required|in:M,F,O",
            'gender_other'=> "nullable|string|max:255",
            'birth'=> "required|date",
            'license_number'=> "nullable|string|max:255",

            //'isAdmin'=> "true",
            'role'=> 'required|in:1,7,6',
        ]);

        // Custom validation for data redundancy
        $errors = [];

        // Check for duplicate name (first name + last name combination)
        $existingByName = User::where('firstname', $request->first_name)
            ->where('lastname', $request->last_name)
            ->when($request->middlename, function($query) use ($request) {
                $query->where('middlename', $request->middlename);
            })
            ->first();

        if ($existingByName) {
            $errors['duplicate_name'] = 'A staff member with this name already exists.';
        }

        // Check for duplicate contact number
        $existingByContact = User::where('contactno', $request->contactNumber)->first();
        if ($existingByContact) {
            $errors['duplicate_contact'] = 'This contact number is already registered.';
        }

        // Check for duplicate license number (if provided)
        if ($request->license_number) {
            $existingByLicense = User::where('license_number', $request->license_number)->first();
            if ($existingByLicense) {
                $errors['duplicate_license'] = 'This license number is already registered.';
            }
        }

        // If there are custom validation errors, return them
        if (!empty($errors)) {
            return redirect()->back()
                ->withErrors($errors)
                ->withInput($request->except('password', 'confirmPassword'));
        }


        try{
            DB::beginTransaction();

            $newUser = User::create([
                'firstname' => $request->first_name,
                'middlename' => $request->middlename ?? null,
                'lastname' => $request->last_name,
                'suffix' => $request->suffix ?? null,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'contactno' => $request->contactNumber,
                'roleID' => $request->role,
                'status' => 1, // Auto-set status to "Available" (1 = active/available)
                // 'questionID' => $request->securityQuestion ?? null,
                // 'answer' => $request->securityAnswer ?? null,
                'gender' => $request->gender === 'O' ? $request->gender_other : $request->gender,
                'birth' => $request->birth,
                'license_number' => $request->license_number ?? null,
            ]);

            if($newUser->roleID == 1){ //check if doctor
                doctor_details::create([
                    'user_id' => $newUser->id,
                    'status' => 1 // Auto-set doctor status to "Available" (1 = active/available)
                ]);
            }

            // Create notification message based on role
            $roleNames = [
                1 => 'Doctor',
                6 => 'Pharmacist', 
                7 => 'Admin'
            ];
            $roleName = $roleNames[$newUser->roleID] ?? 'Staff';
            $mssg = "New {$roleName} registered: {$newUser->firstname} {$newUser->lastname}";

            NotifSender::SendNotif(false,[1,7,6],$mssg,'New staff registered!','new_staff');

            DB::commit();
            
            return redirect()->back()->with('success', 'Staff registered successfully!');
        }
        catch(\Exception $er){
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to register staff: ' . $er->getMessage());
        }
    }

    public function registerDoctor(Request $request)
    {
        $request->validate([
            'first_name' => 'required|min:2',
            'middlename' => 'required|min:2',
            'last_name' => 'required|min:2',
            'suffix' => 'required|min:2',
            'contactNumber' => 'required|min:11|numeric',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            // 'securityQuestion' => "required|exists:securityquestions,id",
            // 'securityAnswer' => 'required',
            'confirmPassword' => 'required|same:password',
            'gender' => 'required|in:M,F',
            'birth' => 'required|date',
        ]);
        //dd($request);
        //$isAdmin = $request->input('isAdmin', 'false'); // Get isAdmin from request data
        try{
            DB::beginTransaction();

            $newUser = User::create([
                'firstname' => $request->first_name,
                'middlename' => $request->middlename,
                'lastname' => $request->last_name,
                'suffix' => $request->suffix,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'contactno' => $request->contactNumber,
                'roleID' => 1,
                // 'questionID' => $request->securityQuestion ?? null,
                // 'answer' => $request->securityAnswer ?? null,
                'gender' => $request->gender,
                'birth' => $request->birth,
            ]);

            doctor_details::create([
                'user_id' => $newUser->id
            ]);

            $admins = User::where('roleID', '7')->get();
            foreach ($admins as $admin) {
                $admin->notify(new SystemNotification(
                    "{$newUser->firstname} {$newUser->lastname} registered as a Doctor!",
                    'New Doctor has been registered!',
                    'new_doctor'
                ));

                event(new SendNotification($admin->id));
            }

            DB::commit();
            // return Inertia::render("Auth/Login2",[
            //     "flash" => [
            //         "message" => "Registered Successfully!",
            //         "icon" => "success",
            //         "title" => "Success!"
            //     ]
            // ]);
        }
        catch(\Exception $er){
            //dd($er);
            DB::rollBack();
        }
        // return redirect()->back()->with('success', 'Registration successful');
        //return redirect()->route('login')->with('success','Registered Successfully!');
    }

    // Handle the forgot password form submission
    public function handleForgotPassword(Request $request)
    {
        // Define validation rules
        $rules = [];
        if ($request->has('email')) {
            $rules = [
                'email' => 'required|email',
            ];
        } elseif ($request->has('securityQuestion')) {
            $rules = [
                'securityQuestion' => 'required',
                'securityAnswer' => 'required',
            ];
        } elseif ($request->has('newPassword')) {
            $rules = [
                'newPassword' => 'required|min:8',
                'confirmPassword' => 'required|same:newPassword',
            ];
        }
        // Validate the request
        $validator = Validator::make($request->all(), $rules);

        // If validation fails, redirect back with errors
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $step = $request->query('step', 'email');

        if ($step === 'email') {
            // Validate email and move to the next step
            return redirect()->route('forgot.password', ['step' => 'security']);
        } elseif ($step === 'security') {
            // Validate security question and move to the next step
            return redirect()->route('forgot.password', ['step' => 'reset']);
        } else {
            // Handle password reset logic
        }

        if ($request->has('email')) {
            // Step 1: Validate email
            return redirect()->route('forgot.password')->with('step', 'security');
        } elseif ($request->has('securityQuestion')) {
            // Step 2: Validate security question
            return redirect()->route('forgot.password')->with('step', 'reset');
        } else {
            // Step 3: Reset password
            // Handle password reset logic (e.g., update the user's password in the database)
        }

        // Handle the logic for resetting the password
        // For example, update the user's password in the database
        // You can use the Auth facade or your User model to update the password

        // Redirect to a success page or login page
        return redirect()->route('login')->with('success', 'Registration successful! Please log in.');
    }

}