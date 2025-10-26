<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pharmacist\PharmacistController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\OTPController;

// Verification routes (no auth required for guest appointments)
Route::post('/verification/send-code', [VerificationController::class, 'sendCode']);
Route::post('/verification/verify-code', [VerificationController::class, 'verifyCode']);
Route::get('/verification/test-sms/{phone}', [VerificationController::class, 'testSMS']);

// Patient lookup routes (no auth required for guest appointments)
Route::get('/patient-lookup/{referenceNumber}', [PatientController::class, 'lookupPatientByReference']);
Route::get('/patient-appointments/{referenceNumber}', [PatientController::class, 'getPatientAppointments']);

// Duplicate validation routes (no auth required for guest appointments)
Route::post('/check-email-exists', [PatientController::class, 'checkEmailExists']);
Route::post('/check-phone-exists', [PatientController::class, 'checkPhoneExists']);
Route::post('/verify-code', [PatientController::class, 'verifyCode']);
Route::post('/check-duplicates', [App\Http\Controllers\ProgramParticipantController::class, 'checkDuplicates']);
Route::get('/participant-history/{registrationId}', [App\Http\Controllers\ProgramParticipantController::class, 'getParticipantHistory']);

// Verification routes (no auth required for guest appointments)
Route::post('/send-verification', [PatientController::class, 'sendVerificationCode']);
Route::post('/verify-appointment', [PatientController::class, 'verifyAppointment']);

// SMS OTP routes
Route::post('/sms/send-otp', [OTPController::class, 'sendOTP']);
Route::post('/sms/verify-otp', [OTPController::class, 'verifyOTP']);
Route::post('/sms/verify-and-send-email', [OTPController::class, 'verifyOTPAndSendEmail']);
Route::post('/sms/send', [OTPController::class, 'sendSMS']);
Route::get('/sms/otp-list', [OTPController::class, 'getOTPList']);
Route::get('/sms/test', [OTPController::class, 'testSMS']);

// Email routes
Route::get('/email/test', [OTPController::class, 'testEmail']);
Route::get('/email/preview', [OTPController::class, 'previewEmail']);
Route::post('/sms/send-appointment-email', [OTPController::class, 'sendAppointmentEmail']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/pharmacist/get-doctors-patients', [PharmacistController::class, 'get_patients_and_doctors']);
    
    // SMS API Routes removed - using development mode
});
