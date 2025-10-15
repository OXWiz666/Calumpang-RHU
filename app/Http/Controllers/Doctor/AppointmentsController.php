<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\appointments;
use Inertia\Inertia;
class AppointmentsController extends Controller
{
    //


    public function index(){
        $appointments = appointments::with(['user', 'service', 'subservice'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Authenticated/Doctor/Appointments',[
            'Appoints' => $appointments
        ]);
    }
    public function history(){
        return Inertia::render('Authenticated/Admin/Appointments/AppointmentHistory',[
            // 'Appoints' => $appointments
        ]);
    }
    public function GetAppointment(appointments $appointment){
        $appointment->load(['user','service']);
        return response()->json($appointment);
    }


}