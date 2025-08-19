<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Date;
use Illuminate\Http\Request;


use Inertia\Inertia;
class ReportsController extends Controller
{
    //

    public function index(){

        // now / lastmonth * 100
        return Inertia::render("Authenticated/Admin/Reports",[
            'patientsThisMonth' => User::where('roleID', 5)->whereMonth('created_at', now()->month)->count(),
            'patientsLastMonth' => User::where('roleID', 5)->whereMonth('created_at', now()->subMonth()->month)->count(),
            'Current_Month' => now(),
            'Last_Month' => now()->subMonth(),
        ]);
    }
}
