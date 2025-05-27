<?php

namespace App\Http\Controllers;

use App\Events\SendNotification;
use App\Models\doctor_details;
use App\Models\password_reset_tokens;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Auth;

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
            case "4":
                return redirect()->route('midwife.dashboard');
            case "5":
                return redirect()->route('home');
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

    public function showForgotPasswordForm()
    {
        //return view('auth.forgot');
        $Q = securityquestions::get();
        return view('Auth.forgot',compact('Q'));
        //return view('auth.reset-password',compact('Q'));
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

    public function login(Request $request){
        // $credentials = $request->validate([
        //     'email' => 'required',
        //     'password' => 'required',
        // ]);
        if(!Auth::attempt($request->only('email','password'))){
            //return redirect()->back()->with('error','Invalid credentials');
            return back()->withErrors([
                        'error' => 'Invalid credentials',
                    ]);
        }
        return redirect()->intended(route('home'));
        //return Inertia::render("Authenticated/Patient/Dashboard",[]);
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
                'roleID' => $request->isAdmin == 'true' ? 1 : 5,
                'questionID' => $request->securityQuestion ?? null,
                'answer' => $request->securityAnswer ?? null,
                'gender' => $request->gender,
                'birth' => $request->birth,
            ]);

            $admins = User::where('roleID', '7')->get();
            foreach ($admins as $admin) {
                $admin->notify(new SystemNotification(
                    "{$newUser->firstname} {$newUser->lastname} registered as Patient!",
                    'New Patient has been registered!',
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
        $request->validate([
            'first_name'=> "required|min:2",
            'middlename'=> "required|min:2",
            'last_name'=> "required|min:2",
            //'suffix'=> "required|min:2",
            'contactNumber'=> "required|min:11|numeric",
            'email'=> "required|email|unique:users,email",
            'password'=> "required|min:3",
            'confirmPassword'=> "required|same:password",
            'gender'=> "required|in:M,F",
            'birth'=> "required|date",

            //'isAdmin'=> "true",
            'role'=> 'required|in:1,7,6',
        ]);


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
                'roleID' => $request->role,
                // 'questionID' => $request->securityQuestion ?? null,
                // 'answer' => $request->securityAnswer ?? null,
                'gender' => $request->gender,
                'birth' => $request->birth,
            ]);

            if($newUser->roleID == 1){ //check if doctor
                doctor_details::create([
                    'user_id' => $newUser->id
                ]);

                $mssg = "";
            }

            NotifSender::SendNotif(false,[1,7,6],$mssg,'New staff registered!','new_staff');

            DB::commit();
        }
        catch(\Exception $er){
            DB::rollBack();
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