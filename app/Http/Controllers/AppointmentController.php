<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function appointments()
    {
        $appointments = Appointment::with(['patient', 'doctor'])
            ->whereDate('appointment_date', '>=', Carbon::today())
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'patientName' => $appointment->patient->full_name,
                    'time' => Carbon::parse($appointment->appointment_time)->format('h:i A'),
                    'status' => $appointment->status,
                    'type' => $appointment->service_type,
                    'date' => Carbon::parse($appointment->appointment_date)->format('M d, Y'),
                    'doctor' => $appointment->doctor ? $appointment->doctor->name : 'Unassigned'
                ];
            });

        return view('admin.appointments', compact('appointments'));
    }

    public function showAppointment($id)
    {
        $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($id);
        return view('admin.appointments.show', compact('appointment'));
    }

    public function editAppointment($id)
    {
        $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($id);
        $patients = Patient::all();
        return view('admin.appointments.edit', compact('appointment', 'patients'));
    }

    public function updateAppointment(Request $request, $id)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'service_type' => 'required|string',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string'
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->update($validated);

        return redirect()->route('admin.appointments')
            ->with('success', 'Appointment updated successfully');
    }

    public function cancelAppointment($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['status' => 'cancelled']);

        return redirect()->back()
            ->with('success', 'Appointment cancelled successfully');
    }

    public function getTodayAppointments()
    {
        $appointments = Appointment::with(['patient', 'doctor'])
            ->whereDate('appointment_date', Carbon::today())
            ->orderBy('appointment_time')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'patientName' => $appointment->patient->full_name,
                    'time' => Carbon::parse($appointment->appointment_time)->format('h:i A'),
                    'status' => $appointment->status,
                    'type' => $appointment->service_type
                ];
            });

        return response()->json($appointments);
    }

    public function getUpcomingAppointments()
    {
        $appointments = Appointment::with(['patient', 'doctor'])
            ->whereDate('appointment_date', '>', Carbon::today())
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->limit(5)
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'patientName' => $appointment->patient->full_name,
                    'time' => Carbon::parse($appointment->appointment_time)->format('h:i A'),
                    'date' => Carbon::parse($appointment->appointment_date)->format('M d, Y'),
                    'status' => $appointment->status,
                    'type' => $appointment->service_type
                ];
            });

        return response()->json($appointments);
    }
} 