<?php

use App\Http\Middleware\AdminDoctorMiddleware;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\AdminOrGuest;
use App\Http\Middleware\DoctorMiddleware;
use App\Http\Middleware\GuestMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;


use App\Http\Middleware\GuestOrPatient;
use App\Http\Middleware\MidwifeMiddleware;
use App\Http\Middleware\PatientMiddlware;
use App\Http\Middleware\PharmacistMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // $middleware->alias([
        //     'Guest' => GuestMiddleware::class
        //     // 'admin' => AdminMiddleware::class,
        //     // 'customer' => CustomerMiddleware::class,
        //     // 'adminstaff' => AdminStaffMiddleware::class,
        //     // 'GuestOrCustomer' => GuestOrCustomerMiddleware::class,
        //     // 'Guest' => GuestMiddleware::class,
        //     // 'sanctum' => EnsureFrontendRequestsAreStateful::class, // Add Sanctum Middleware Alias
        // ]);
        $middleware->alias([
            'Guest' => GuestMiddleware::class,
            'GuestOrPatient' => GuestOrPatient::class,
            'Midwife' => MidwifeMiddleware::class,
            'Doctor' => DoctorMiddleware::class,
            'Pharmacist' => PharmacistMiddleware::class,
            'Patient' => PatientMiddlware::class,
            'Admin' => AdminMiddleware::class,
            'AdminDoctor' => AdminDoctorMiddleware::class,
            'AdminGuest' => AdminOrGuest::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
