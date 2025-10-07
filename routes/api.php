<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pharmacist\PharmacistController;
use App\Http\Controllers\VerificationController;

// Verification routes (no auth required for guest appointments)
Route::post('/verification/send-code', [VerificationController::class, 'sendCode']);
Route::post('/verification/verify-code', [VerificationController::class, 'verifyCode']);
Route::get('/verification/test-sms/{phone}', [VerificationController::class, 'testSMS']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/pharmacist/get-doctors-patients', [PharmacistController::class, 'get_patients_and_doctors']);
});
