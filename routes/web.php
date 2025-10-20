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
use App\Http\Controllers\Pharmacist\InventoryReportsController;
use App\Http\Controllers\Pharmacist\PharmacistController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SecureAuthController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Doctor\DoctorController;
use App\Http\Controllers\MidwifeController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\VaccinationController;
use App\Http\Controllers\VaccineController;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\PatientMessagesController;
use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\ProgramParticipantController;
use App\Http\Controllers\ProgramParticipantController;
use App\Livewire\Doctor\DoctorDashboard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\NotificationController;

// Auth Routes

Route::middleware(['Guest'])->group(function () {
    Route::post('/login/{role}', [AuthController::class, 'login'])->name('login.submit');
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');

    Route::get('/forgot-password', [AuthController::class, 'showForgotPasswordForm'])->name('forgot.password');
    Route::get('/login', function() {
        return redirect('/adminlogin');
    })->name('login');
    Route::get('/adminlogin', [AuthController::class, 'showLogin'])->name('adminlogin');

    //Route::get('/login/staff',[AuthController::class,'stafflogin'])->name('login.staff');

    Route::post('/forgotpw-post',[AuthController::class,'forgotPwFormPost'])->name('forgotpw.post');

    Route::get('/forgotpw-post/reset/{token}',[AuthController::class,'showResetPassword'])->name('forgotpw.reset.get');

    Route::post('/forgotpw/reset/{token}',[AuthController::class,'ResetPassword'])->name('forgotpw.reset.post');

    Route::post('/search-email/', [AuthController::class,'SearchEmail'])->name('search.email');

    Route::get('/forgotpw/new-password/{token}',[AuthController::class,'NewPassword'])->name('password.reset');

    Route::post('/forgotpw/new-password/save',[AuthController::class,'StoreNewPassword'])->name('passowrd.reset.save');

    // Route

    //Route::post('/login/{role}',[AuthController::class,'login'])->name('login.staff.submit');

    //Route::post('',[AuthController::class,''])->name(
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

    // Appointment creation route for guests (exempt from CSRF for API calls)
    Route::post('/appointment/create',[PatientController::class,'storeAppointment'])->name('patient.appoint.create')->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    
    // Clear appointment session data
    Route::post('/clear-appointment-session', function() {
        session()->forget(['appointment_priority_number', 'appointment_reference_number', 'appointment_id']);
        return response()->json(['success' => true]);
    });

    // Set patient verification session
    Route::post('/set-verification-session', function() {
        session(['patient_verification_completed' => true]);
        return response()->json(['success' => true]);
    });

    // Clear patient verification session
    Route::post('/clear-verification-session', function() {
        session()->forget('patient_verification_completed');
        return response()->json(['success' => true]);
    });

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

        Route::get('/appointments/history',[PatientController::class,'appointmentshistory'])->name('patient.appoint.history');
        ## Appointment

        Route::get('/get-sub-services/{id}',[PatientController::class,'GetSubServices'])->name('patient.subservices.get');

        // Get latest appointment priority number
        Route::get('/get-latest-appointment',[PatientController::class,'getLatestAppointment'])->name('patient.latest.appointment');

        // Check slot availability
        Route::get('/check-slot-availability',[PatientController::class,'checkSlotAvailability'])->name('patient.check.slot.availability');
        Route::get('/get-date-availability',[PatientController::class,'getDateAvailability'])->name('patient.get.date.availability');

        Route::post('/message/send',[PatientMessagesController::class,'sendmssg'])->name('patient.landing.sendmessage');
    });
});

Route::middleware(['auth','Doctor'])->group(function(){
    Route::prefix('doctor')->group(function(){
        Route::get('/',[DoctorController::class,'index'])->name('doctor.home');
        
        // Prescription management
        Route::get('/prescriptions',[DoctorController::class,'prescriptions'])->name('doctor.prescriptions');
        Route::get('/prescriptions/create',[DoctorController::class,'createPrescription'])->name('doctor.prescriptions.create');
        Route::post('/prescriptions',[DoctorController::class,'storePrescription'])->name('doctor.prescriptions.store');
        Route::get('/prescriptions/{prescription}',[DoctorController::class,'showPrescription'])->name('doctor.prescriptions.show');
        
        // API endpoints for dropdowns
        Route::get('/api/patients',[DoctorController::class,'getPatients'])->name('doctor.api.patients');
        Route::get('/api/medicines',[DoctorController::class,'getMedicines'])->name('doctor.api.medicines');
        Route::get('/api/dashboard-data',[DoctorController::class,'getDashboardData'])->name('doctor.dashboard.data');

        // Settings
        Route::get('/settings',[DoctorController::class,'settings'])->name('doctor.settings');
        Route::post('/settings/profile',[DoctorController::class,'updateProfile'])->name('doctor.settings.profile');
        Route::post('/settings/password',[DoctorController::class,'updatePassword'])->name('doctor.settings.password');

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
        Route::post('/reports/generate',[ReportsController::class,'generateReport'])->name('admin.reports.generate');
        Route::get('/reports/test-data',[ReportsController::class,'testData'])->name('admin.reports.test-data');
        Route::get('/reports/test-pdf',[ReportsController::class,'testPDF'])->name('admin.reports.test-pdf');
        Route::get('/reports/templates',[ReportsController::class,'getReportTemplates'])->name('admin.reports.templates');
        Route::post('/reports/schedule',[ReportsController::class,'scheduleReport'])->name('admin.reports.schedule');
        Route::get('/reports/scheduled',[ReportsController::class,'getScheduledReports'])->name('admin.reports.scheduled');
        Route::post('/reports/toggle-schedule',[ReportsController::class,'toggleSchedule'])->name('admin.reports.toggle-schedule');
        Route::delete('/reports/schedule/{id}',[ReportsController::class,'deleteSchedule'])->name('admin.reports.delete-schedule');


        Route::prefix('programs')->group(function(){
            Route::get('/',[HealthProgramsController::class,'index'])->name('admin.programs');
            Route::post('create',[HealthProgramsController::class,'CreateProgram'])->name('admin.programs.create');
            Route::post('archive',[HealthProgramsController::class,'archiveProgram'])->name('admin.programs.archive');
            Route::post('unarchive',[HealthProgramsController::class,'unarchiveProgram'])->name('admin.programs.unarchive');
            Route::get('{programId}/patients',[HealthProgramsController::class,'getProgramPatients'])->name('admin.programs.patients');
        });


        Route::prefix('staff')->group(function(){
            Route::get('/overview',[StaffController::class,'index'])->name('admin.staff.overview');
            Route::get('/admins',[StaffController::class,'admins'])->name('admin.staff.admins');
            Route::get('/doctors',[StaffController::class,'doctors'])->name('admin.staff.doctors');
            Route::get('/pharmacists',[StaffController::class,'pharmacists'])->name('admin.staff.pharmacists');
        Route::post('/archive',[StaffController::class,'archiveStaff'])->name('admin.staff.archive');
            Route::post('/unarchive',[StaffController::class,'unarchiveStaff'])->name('admin.staff.unarchive');
            
            // Staff Edit Routes (GET)
            Route::get('/admins/{id}/edit',[StaffController::class,'editAdmin'])->name('admin.staff.edit');
            Route::get('/doctors/{id}/edit',[StaffController::class,'editDoctor'])->name('doctor.staff.edit');
            Route::get('/pharmacists/{id}/edit',[StaffController::class,'editPharmacist'])->name('pharmacist.staff.edit');
            
            // Staff Update Routes (PUT)
            Route::put('/admins/{id}',[StaffController::class,'updateAdmin'])->name('admin.update');
            Route::put('/doctors/{id}',[StaffController::class,'updateDoctor'])->name('doctor.update');
            Route::put('/pharmacists/{id}',[StaffController::class,'updatePharmacist'])->name('pharmacist.update');
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
            
            // Sub-service archive/unarchive routes
            Route::post('/sub-services/archive',[ServicesController::class,'archiveSubService'])->name('admin.services.subservice.archive');
            Route::post('/sub-services/unarchive',[ServicesController::class,'unarchiveSubService'])->name('admin.services.subservice.unarchive');
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

        Route::get('/patients',[PatientsController::class,'index'])->name('patients.index');
        Route::post('/patients/add-prescription/{patientid}',[PatientsController::class,'storePrescription'])->name('patients.prescription.store');
        //add_medical_rec(Request $request, User $patientid)

        Route::get('/patients/details/{id}',[PatientsController::class,'PatientDetails'])->name('patients.details.view');
        Route::put('/patients/{id}',[PatientsController::class,'update'])->name('patients.update');

        //Route::resource('patients',PatientsController::class);
        //Route::get('auth/patients',[PatientsController::class,'index'])->name('admin.patients.index');


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

        // Clear patient verification session on logout
        $request->session()->forget('patient_verification_completed');

        //return redirect('/');
        // $cookie = Cookie::forget('jwt');

        // Auth::logout();

        //return response()->json(['message' => 'Logged out successfully'])->withCookie($cookie);
        return app(AuthController::class)->getRedirectRoute();
    })->name('logout');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead'])->name('notifications.markAllRead');
});

// Pharmacist Routes
Route::middleware(['auth', 'Pharmacist'])->group(function () {
    Route::prefix('pharmacist')->group(function () {
        Route::get('/dashboard', [PharmacistController::class, 'dashboard'])->name('pharmacist.dashboard');
        Route::get('/inventory', [PharmacistController::class, 'inventory'])->name('pharmacist.inventory.index');
        Route::get('/reports', [InventoryReportsController::class, 'index'])->name('pharmacist.reports');
        Route::post('/reports/generate', [InventoryReportsController::class, 'generateReport'])->name('pharmacist.reports.generate');
        Route::get('/inventory-reports/dashboard-analytics', [InventoryReportsController::class, 'dashboardAnalytics'])->name('pharmacist.reports.analytics');
        
        // Individual report endpoints for easy frontend integration
        Route::get('/inventory-reports/summary', [InventoryReportsController::class, 'summary'])->name('pharmacist.reports.summary');
        Route::get('/inventory-reports/expiry', [InventoryReportsController::class, 'expiry'])->name('pharmacist.reports.expiry');
        Route::get('/inventory-reports/dispensing', [InventoryReportsController::class, 'dispensing'])->name('pharmacist.reports.dispensing');
        Route::get('/inventory-reports/low-stock-alert', [InventoryReportsController::class, 'lowStockAlert'])->name('pharmacist.reports.low-stock-alert');
        Route::get('/inventory-reports/expired-batches', [InventoryReportsController::class, 'expiredBatches'])->name('pharmacist.reports.expired-batches');
        Route::get('/inventory-reports/custom', [InventoryReportsController::class, 'custom'])->name('pharmacist.reports.custom');
        Route::get('/settings', [PharmacistController::class, 'settings'])->name('pharmacist.settings');
        
        // Inventory management routes
        Route::prefix('inventory')->group(function () {
            Route::post('/category/add', [PharmacistController::class, 'add_category'])->name('pharmacist.inventory.category.add');
            Route::post('/item/add', [PharmacistController::class, 'add_item'])->name('pharmacist.inventory.item.add');
            Route::put('/item/update/{inventory}', [PharmacistController::class, 'update_item'])->name('pharmacist.inventory.item.update');
            Route::post('/item/add-batch', [PharmacistController::class, 'add_batch'])->name('pharmacist.inventory.item.add-batch');
                Route::put('/item/archive/{inventory}', [PharmacistController::class, 'archive_item'])->name('pharmacist.inventory.item.archive');
                Route::put('/item/unarchive/{inventory}', [PharmacistController::class, 'unarchive_item'])->name('pharmacist.inventory.item.unarchive');
                Route::post('/item/dispense', [PharmacistController::class, 'dispense_item'])->name('pharmacist.inventory.dispense');
                Route::post('/item/dispose', [PharmacistController::class, 'dispose_item'])->name('pharmacist.inventory.dispose');
                Route::post('/item/dispose/bulk', [PharmacistController::class, 'bulk_dispose'])->name('pharmacist.inventory.dispose.bulk');
                
                // Automatic dispensing routes
                Route::get('/prescriptions/pending', [PharmacistController::class, 'get_pending_prescriptions'])->name('pharmacist.prescriptions.pending');
                Route::post('/prescriptions/auto-dispense', [PharmacistController::class, 'auto_dispense_prescription'])->name('pharmacist.prescriptions.auto-dispense');
                Route::get('/patients-doctors', [PharmacistController::class, 'get_patients_and_doctors'])->name('pharmacist.patients-doctors');
                Route::get('/case-ids', [PharmacistController::class, 'get_available_case_ids'])->name('pharmacist.case-ids');
                Route::get('/item/{inventory}/batches', [PharmacistController::class, 'get_item_batches'])->name('pharmacist.inventory.item.batches');
                Route::post('/items/batches', [PharmacistController::class, 'get_items_batches'])->name('pharmacist.inventory.items.batches');
                Route::get('/items/batches', [PharmacistController::class, 'get_items_batches']);
                Route::post('/item/dispose/bulk-aggregate', [PharmacistController::class, 'bulk_dispose_aggregate'])->name('pharmacist.inventory.dispose.bulk.aggregate');
            Route::delete('/category/delete/{category}', [PharmacistController::class, 'delete_category'])->name('pharmacist.inventory.category.delete');
            Route::put('/category/update/{category}', [PharmacistController::class, 'update_category'])->name('pharmacist.inventory.category.update');
            Route::put('/category/archive/{category}', [PharmacistController::class, 'archive_category'])->name('pharmacist.inventory.category.archive');
            Route::put('/category/unarchive/{category}', [PharmacistController::class, 'unarchive_category'])->name('pharmacist.inventory.category.unarchive');
            Route::put('/item/stock_movement/update/{movement}', [PharmacistController::class, 'update_stock_movement'])->name('pharmacist.inventory.item.stockmovement.update');
            Route::post('/item/update-stocks', [PharmacistController::class, 'update_stocks'])->name('pharmacist.inventory.update-stocks');
        });
    });
});

Route::middleware(['auth:sanctum','Midwife'])->group(function(){
    Route::prefix('Midwife')->group(function(){
        Route::get('/',[MidwifeController::class, 'index'])->name('midwife.dashboard');
    });
});
