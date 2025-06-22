<?php

use App\Http\Controllers\Admin\AppointmentsController;
use App\Http\Controllers\Admin\DoctorsController;
use App\Http\Controllers\Admin\HealthProgramsController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\MessagesController;
use App\Http\Controllers\Admin\PatientsController;
use App\Http\Controllers\Admin\ReportsController;
use App\Http\Controllers\Admin\ServicesController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Doctor\DoctorController;
use App\Http\Controllers\MidwifeController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\TestDashboard\TestDbControllerrr;
use App\Http\Controllers\VaccinationController;
use App\Http\Controllers\VaccineController;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\PatientMessagesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgramParticipantController;
use App\Livewire\Doctor\DoctorDashboard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Broadcast;

// Auth Routes

Route::middleware(['Guest'])->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');

    Route::get('/forgot-password', [AuthController::class, 'showForgotPasswordForm'])->name('forgot.password');
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');

    Route::post('/forgotpw-post',[AuthController::class,'forgotPwFormPost'])->name('forgotpw.post');

    Route::get('/forgotpw-post/reset/{token}',[AuthController::class,'showResetPassword'])->name('forgotpw.reset.get');

    Route::post('/forgotpw/reset/{token}',[AuthController::class,'ResetPassword'])->name('forgotpw.reset.post');
});

Route::middleware(['AdminGuest'])->group(function (){
    Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
});

Route::middleware(['GuestOrPatient'])->group(function () {
    // Home Routes
    // Route::get('/',function(){ return view('reset-pw'); });
    Route::get('/', [LandingPageController::class, 'index'])->name('home');
    Route::get('/services', [LandingPageController::class, 'services'])->name('services');
    Route::get('/about', [LandingPageController::class, 'about'])->name('about');
    Route::get('/contact', [LandingPageController::class, 'contact'])->name('contact');
    //Route::get('/appointments', [LandingPageController::class, 'appointments'])->name('appointments');
    Route::get('/services/records', [LandingPageController::class, 'records'])->name('services.records');
    Route::get('/services/seasonal-programs', [VaccineController::class, 'index'])->name('services.vaccinations');
    Route::get('/services/vaccinations/registration', [VaccineController::class, 'showRegistrationForm'])->name('services.vaccinations.registration');
    Route::post('/services/vaccinations/register', [VaccineController::class, 'register'])->name('services.vaccinations.register');
    Route::get('/faq', [LandingPageController::class, 'faq'])->name('faq');

    Route::get('/appointments',[PatientController::class,'appointments'])->name('patient.appoint');
    //Route::get('/dashboard/test', [TestDbControllerrr::class, 'index'])->name('dashboard.test');



    Route::get('services/get-sub-services/{id}',[PatientController::class,'GetSubServices'])->name('patient.subservices.get');

    Route::post('programs/join-program/{schedule}',[ProgramParticipantController::class,'registerProgram'])->name('patient.seasonal.join');

    // Contact Routes
    //Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');
});

Route::middleware(['auth','Patient'])->group(function(){
    Route::prefix('patient')->group(function(){
        Route::get('/profile',[PatientController::class,'profile'])->name('patient.profile');
        Route::post('/profile/update',[PatientController::class,'update'])->name('patient.profile.update');
        Route::post('/profile/avatar',[PatientController::class,'uploadAvatar'])->name('patient.avatar.upload');
        Route::get('/medical-records',[PatientController::class,'medicalrecords'])->name('patient.medrecords');

        Route::get('/appointments/history',[PatientController::class,'appointmentshistory'])->name('patient.appoint.history');
        ## Appointment
        Route::post('/appointment/create',[PatientController::class,'storeAppointment'])->name('patient.appoint.create');

        Route::get('/get-sub-services/{id}',[PatientController::class,'GetSubServices'])->name('patient.subservices.get');

        // Get latest appointment priority number
        Route::get('/get-latest-appointment',[PatientController::class,'getLatestAppointment'])->name('patient.latest.appointment');

        Route::post('/message/send',[PatientMessagesController::class,'sendmssg'])->name('patient.landing.sendmessage');
    });
});

Route::middleware(['auth','Doctor'])->group(function(){
    Route::prefix('doctor')->group(function(){
        Route::get('/',[DoctorController::class,'index'])->name('doctor.home');



        //Route::get('/appointments',[AppointmentsController::class,'index'])->name('doctor.appointments');
    });
});

Route::middleware(['auth', 'AdminPhar'])->group(function () {
    Route::prefix('inventory')->group(function(){
        Route::get('/',[InventoryController::class,'index'])->name('admin.inventory.index');
        Route::post('/category/add',[InventoryController::class,'add_category'])->name('admin.inventory.category');
        Route::post('/item/add',[InventoryController::class,'add_item'])->name('admin.inventory.item.add');
        Route::delete('/category/delete/{category}',[InventoryController::class,'delete_category'])->name('admin.inventory.category.delete');
        Route::put('/category/update/{category}',[InventoryController::class,'update_category'])->name('admin.inventory.category.update');


        Route::put('/item/update/{inventory}',[InventoryController::class,'update_item'])->name('admin.inventory.item.update');
        Route::delete('/item/delete/{inventory}',[InventoryController::class,'delete_item'])->name('admin.inventory.item.delete');

         Route::put('/item/stock_movement/update/{movement}',[InventoryController::class,'update_stock_movement'])->name('admin.inventory.item.stockmovement.update');
        //Route::get('/',[DoctorController::class,''])->name('');
    });

    Route::prefix('settings')->group(function(){
            Route::get('/',[SettingsController::class,'index'])->name('admin.settings.index');
            Route::get('/password',[SettingsController::class,'pwsettings'])->name('admin.settings.pw');
        });
});



Route::middleware(['auth','Admin'])->group(function(){
    Route::prefix('admin')->group(function(){
        Route::get('/',[AdminDashboardController::class,'index'])->name('admin');




        Route::get('/reports',[ReportsController::class,'index'])->name('admin.reports');

        Route::prefix('programs')->group(function(){
            Route::get('/',[HealthProgramsController::class,'index'])->name('admin.programs');
            Route::post('create',[HealthProgramsController::class,'CreateProgram'])->name('admin.programs.create');
            Route::post('archive',[HealthProgramsController::class,'archiveProgram'])->name('admin.programs.archive');
            Route::post('unarchive',[HealthProgramsController::class,'unarchiveProgram'])->name('admin.programs.unarchive');
        });


        Route::prefix('staff')->group(function(){
            Route::get('/overview',[StaffController::class,'index'])->name('admin.staff.overview');
            Route::get('/doctors',[StaffController::class,'doctors'])->name('admin.staff.doctors');
            Route::post('/archive',[StaffController::class,'archiveStaff'])->name('admin.staff.archive');
            Route::post('/unarchive',[StaffController::class,'unarchiveStaff'])->name('admin.staff.unarchive');
        });
        Route::post('/doctors/update-status/{doctor}',[StaffController::class,'updateStatus'])->name('doctor.update.status');

        Route::prefix('services')->group(function(){
            Route::get('/overview',[ServicesController::class,'index'])->name('admin.services.overview');
            Route::get('/',[ServicesController::class,'services'])->name('admin.services.services');
            Route::post('/create',[ServicesController::class,'create'])->name('admin.services.create');
            Route::post('/sub-services/create',[ServicesController::class,'createSubService'])->name('admin.services.subservice.create');

            Route::post('/sub-services/save-time',[ServicesController::class,'saveTime'])->name('admin.services.time.update');
            Route::post('/sub-services/save-days',[ServicesController::class,'saveDays'])->name('admin.services.days.update');
            Route::post('/archive',[ServicesController::class,'archiveService'])->name('admin.services.archive');
            Route::post('/unarchive',[ServicesController::class,'unarchiveService'])->name('admin.services.unarchive');
        });



        Route::prefix('landing-page')->group(function(){
            Route::get('/messages',[MessagesController::class,'index'])->name('admin.landing.messages');


        });

        Route::post('/registerstaff/create',[AuthController::class,'registerStaff'])->name('admin.staff.register');
        //Route::post('/registerdoctor/create',[AuthController::class,'registerDoctor'])->name('admin.register.doctor');
        //Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
    });
});

Route::middleware(['auth','AdminDoctor'])->group(function() {
    Route::prefix('auth')->group(function(){
        Route::post('/appointments/resched/{appointment}',[AppointmentsController::class,'reschedule'])->name('admin.resched');
        Route::get('/appointments',[AppointmentsController::class,'index'])->name('admin.appointments');
        Route::post('/appointments/archive',[AppointmentsController::class,'archiveAppointment'])->name('admin.appointments.archive');
        Route::post('/appointments/unarchive',[AppointmentsController::class,'unarchiveAppointment'])->name('admin.appointments.unarchive');
        Route::get('/appointment/get/{appointment}', [AppointmentsController::class,'GetAppointment'])->name('admin.appointment.get');
        //Route::get('/appointments',[AppointmentsController::class,'index'])->name('admin.appointments');
        //Route::get('/patients',[PatientsController::class,'index'])->name('admin.patients');

        Route::resource('patients',PatientsController::class);

        Route::post('/patients/add_medical_record/{patientid}',[PatientsController::class,'add_medical_rec'])->name('patients.medicalrec.store');

        Route::post('/settings/pw/update',[SettingsController::class,'changePw'])->name('admin.settings.pw.update');


        Route::post('/settings/account/update',[SettingsController::class,'saveaccount'])->name('admin.settings.update');

        Route::post('/appointment/status/update/{appointment}',[AppointmentsController::class,'UpdateStatus'])->name('admin.appointment.status.update');
    });
});

Broadcast::routes(['middleware' => ['web', 'auth']]); // For traditional web auth

Route::middleware(['auth'])->group(function () {
    Route::match(['POST','GET'],'/logout', function (Request $request) {
        Auth::guard('web')->logout();
        $request->session()->invalidate();

        $request->session()->regenerateToken();

        //return redirect('/');
        // $cookie = Cookie::forget('jwt');

        // Auth::logout();

        //return response()->json(['message' => 'Logged out successfully'])->withCookie($cookie);
        return app(AuthController::class)->getRedirectRoute();
    })->name('logout');
});

Route::middleware(['auth:sanctum','Midwife'])->group(function(){
    Route::prefix('Midwife')->group(function(){
        Route::get('/',[MidwifeController::class, 'index'])->name('midwife.dashboard');
    });
});