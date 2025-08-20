<?php

use App\Services\RemoveAppointments;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule::command('queue:work --max-time=110')->everyTwoMinutes()
//     ->withoutOverlapping();

// Schedule::command('queue:work --max-time=110 --once')
//              ->everyMinute()
//              ->runInBackground();

Schedule::call(function () {
    RemoveAppointments::RemoveAppointments();
    //logger('Scheduled task running every minute');
    //return redirect()->intended('/');
})->everyFiveSeconds();