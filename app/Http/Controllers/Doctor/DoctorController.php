<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
class DoctorController extends Controller
{
    //
    public function index(){
        return Inertia::render('Authenticated/Doctor/Dashboard',[]);
        //return view('layouts.doctorlayout');
    }
}
