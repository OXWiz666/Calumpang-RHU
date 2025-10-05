<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pharmacist\PharmacistController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/pharmacist/get-doctors-patients', [PharmacistController::class, 'get_patients_and_doctors']);
});
