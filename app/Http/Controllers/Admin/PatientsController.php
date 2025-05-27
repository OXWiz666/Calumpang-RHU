<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

use Inertia\Inertia;
class PatientsController extends Controller
{
    //

    public function index(){
        $patients = User::where('roleID','5')->get();
        return Inertia::render('Authenticated/Admin/Patients',[
            'patients_' => $patients
        ]);
    }
}