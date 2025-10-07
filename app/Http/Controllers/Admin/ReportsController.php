<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\appointments as Appointment;
use App\Models\program_registrations;
use App\Models\program_schedules;
use App\Models\servicetypes;
use App\Models\subservices;
use App\Models\doctor_details;
use App\Models\medical_history;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        // Get date range from request or default to current month
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        
        // Convert to Carbon instances if they're strings
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        // Patient Analytics
        $patientData = $this->getPatientAnalytics($startDate, $endDate);
        
        // Appointment Analytics
        $appointmentData = $this->getAppointmentAnalytics($startDate, $endDate);
        
        // Service Analytics
        $serviceData = $this->getServiceAnalytics($startDate, $endDate);
        
        // Health Program Analytics
        $programData = $this->getProgramAnalytics($startDate, $endDate);
        
        // Staff Analytics
        $staffData = $this->getStaffAnalytics($startDate, $endDate);
        
        // Medical Records Analytics
        $medicalData = $this->getMedicalAnalytics($startDate, $endDate);

        return Inertia::render("Authenticated/Admin/Reports", [
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'patientData' => $patientData,
            'appointmentData' => $appointmentData,
            'serviceData' => $serviceData,
            'programData' => $programData,
            'staffData' => $staffData,
            'medicalData' => $medicalData,
        ]);
    }

    private function getPatientAnalytics($startDate, $endDate)
    {
        // Total patients (roleID 2 = Patient)
        $totalPatients = User::where('roleID', 2)->count();
        
        // New patients in date range
        $newPatients = User::where('roleID', 2)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
            
        // New patients last period for comparison
        $lastPeriodStart = $startDate->copy()->subDays($endDate->diffInDays($startDate) + 1);
        $lastPeriodEnd = $startDate->copy()->subDay();
        $newPatientsLastPeriod = User::where('roleID', 2)
            ->whereBetween('created_at', [$lastPeriodStart, $lastPeriodEnd])
            ->count();

        // Patient demographics
        $demographics = User::where('roleID', 2)
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN gender = "Male" THEN 1 ELSE 0 END) as male,
                SUM(CASE WHEN gender = "Female" THEN 1 ELSE 0 END) as female,
                SUM(CASE WHEN gender = "Other" THEN 1 ELSE 0 END) as other
            ')
            ->first();

        // Age groups
        $ageGroups = User::where('roleID', 2)
            ->whereNotNull('birth')
            ->get()
            ->groupBy(function ($user) {
                $age = Carbon::parse($user->birth)->age;
                if ($age < 18) return 'Under 18';
                if ($age < 30) return '18-29';
                if ($age < 45) return '30-44';
                if ($age < 60) return '45-59';
                return '60+';
            })
            ->map->count();

        // Monthly registration trend (last 12 months)
        $monthlyTrend = User::where('roleID', 2)
            ->where('created_at', '>=', now()->subMonths(12))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month');

        return [
            'total' => $totalPatients,
            'newInPeriod' => $newPatients,
            'newLastPeriod' => $newPatientsLastPeriod,
            'growthRate' => $newPatientsLastPeriod > 0 ? 
                round((($newPatients - $newPatientsLastPeriod) / $newPatientsLastPeriod) * 100, 2) : 0,
            'demographics' => $demographics,
            'ageGroups' => $ageGroups,
            'monthlyTrend' => $monthlyTrend,
        ];
    }

    private function getAppointmentAnalytics($startDate, $endDate)
    {
        try {
            // Total appointments in period
            $totalAppointments = Appointment::whereBetween('date', [$startDate, $endDate])->count();
            
            // Appointments by status
            $statusDistribution = Appointment::whereBetween('date', [$startDate, $endDate])
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status');

            // Appointments by service type
            $serviceDistribution = collect();
            if (Schema::hasTable('servicetypes')) {
                $serviceDistribution = Appointment::whereBetween('date', [$startDate, $endDate])
                    ->join('servicetypes', 'appointments.servicetype_id', '=', 'servicetypes.id')
                    ->selectRaw('servicetypes.servicename, COUNT(*) as count')
                    ->groupBy('servicetypes.servicename')
                    ->get()
                    ->pluck('count', 'servicename');
            }

            // Daily appointment trends
            $dailyTrend = Appointment::whereBetween('date', [$startDate, $endDate])
                ->selectRaw('DATE(date) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->pluck('count', 'date');

            // Completion rate
            $completedAppointments = Appointment::whereBetween('date', [$startDate, $endDate])
                ->where('status', 'completed')
                ->count();
            $completionRate = $totalAppointments > 0 ? 
                round(($completedAppointments / $totalAppointments) * 100, 2) : 0;

            return [
                'total' => $totalAppointments,
                'statusDistribution' => $statusDistribution,
                'serviceDistribution' => $serviceDistribution,
                'dailyTrend' => $dailyTrend,
                'completionRate' => $completionRate,
                'completed' => $completedAppointments,
            ];
        } catch (\Exception $e) {
            // Return default values if there's an error
            return [
                'total' => 0,
                'statusDistribution' => collect(),
                'serviceDistribution' => collect(),
                'dailyTrend' => collect(),
                'completionRate' => 0,
                'completed' => 0,
            ];
        }
    }

    private function getServiceAnalytics($startDate, $endDate)
    {
        try {
            // Total services
            $totalServices = 0;
            $activeServices = 0;
            
            if (Schema::hasTable('servicetypes')) {
                $totalServices = servicetypes::count();
                $activeServices = servicetypes::where('status', 1)->count();
            }
            
            // Total sub-services
            $totalSubServices = 0;
            $activeSubServices = 0;
            
            if (Schema::hasTable('subservices')) {
                $totalSubServices = subservices::count();
                $activeSubServices = subservices::where('status', 1)->count();
            }

            // Most popular services
            $popularServices = collect();
            if (Schema::hasTable('servicetypes') && Schema::hasTable('appointments')) {
                $popularServices = Appointment::whereBetween('date', [$startDate, $endDate])
                    ->join('servicetypes', 'appointments.servicetype_id', '=', 'servicetypes.id')
                    ->selectRaw('servicetypes.servicename, COUNT(*) as count')
                    ->groupBy('servicetypes.servicename')
                    ->orderByDesc('count')
                    ->limit(5)
                    ->get();
            }

            return [
                'totalServices' => $totalServices,
                'activeServices' => $activeServices,
                'totalSubServices' => $totalSubServices,
                'activeSubServices' => $activeSubServices,
                'popularServices' => $popularServices,
            ];
        } catch (\Exception $e) {
            // Return default values if there's an error
            return [
                'totalServices' => 0,
                'activeServices' => 0,
                'totalSubServices' => 0,
                'activeSubServices' => 0,
                'popularServices' => collect(),
            ];
        }
    }

    private function getProgramAnalytics($startDate, $endDate)
    {
        try {
            // Total programs
            $totalPrograms = program_schedules::count();
            $activePrograms = program_schedules::where('status', 'active')->count();
            
            // Check if program_registrations table exists
            $totalRegistrations = 0;
            $enrollmentTrend = collect();
            $monthlyEnrollment = collect();
            
            if (Schema::hasTable('program_registrations')) {
                // Total registrations in period
                $totalRegistrations = program_registrations::whereBetween('created_at', [$startDate, $endDate])->count();
                
                // Program enrollment trends
                $enrollmentTrend = program_registrations::whereBetween('created_at', [$startDate, $endDate])
                    ->join('program_schedules', 'program_registrations.program_schedule_id', '=', 'program_schedules.id')
                    ->join('program_types', 'program_schedules.program_type_id', '=', 'program_types.id')
                    ->selectRaw('program_types.program_name, COUNT(*) as count')
                    ->groupBy('program_types.program_name')
                    ->get()
                    ->pluck('count', 'program_name');

                // Monthly enrollment trend
                $monthlyEnrollment = program_registrations::whereBetween('created_at', [$startDate, $endDate])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
                    ->groupBy('month')
                    ->orderBy('month')
                    ->get()
                    ->pluck('count', 'month');
            } else {
                // Fallback: use program_schedules data
                $totalRegistrations = program_schedules::whereBetween('created_at', [$startDate, $endDate])->count();
                
                $enrollmentTrend = program_schedules::whereBetween('created_at', [$startDate, $endDate])
                    ->join('program_types', 'program_schedules.program_type_id', '=', 'program_types.id')
                    ->selectRaw('program_types.program_name, COUNT(*) as count')
                    ->groupBy('program_types.program_name')
                    ->get()
                    ->pluck('count', 'program_name');

                $monthlyEnrollment = program_schedules::whereBetween('created_at', [$startDate, $endDate])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
                    ->groupBy('month')
                    ->orderBy('month')
                    ->get()
                    ->pluck('count', 'month');
            }

            return [
                'totalPrograms' => $totalPrograms,
                'activePrograms' => $activePrograms,
                'totalRegistrations' => $totalRegistrations,
                'enrollmentTrend' => $enrollmentTrend,
                'monthlyEnrollment' => $monthlyEnrollment,
            ];
        } catch (\Exception $e) {
            // Return default values if there's an error
            return [
                'totalPrograms' => 0,
                'activePrograms' => 0,
                'totalRegistrations' => 0,
                'enrollmentTrend' => collect(),
                'monthlyEnrollment' => collect(),
            ];
        }
    }

    private function getStaffAnalytics($startDate, $endDate)
    {
        // Staff counts by role
        $staffCounts = User::whereIn('roleID', [1, 6, 7]) // Doctor, Pharmacist, Admin
            ->selectRaw('
                SUM(CASE WHEN roleID = 1 THEN 1 ELSE 0 END) as doctors,
                SUM(CASE WHEN roleID = 6 THEN 1 ELSE 0 END) as pharmacists,
                SUM(CASE WHEN roleID = 7 THEN 1 ELSE 0 END) as admins
            ')
            ->first();

        // Active vs Inactive staff
        $activeStaff = User::whereIn('roleID', [1, 6, 7])
            ->where('status', 1)
            ->count();
        $inactiveStaff = User::whereIn('roleID', [1, 6, 7])
            ->where('status', 5)
            ->count();

        // Doctor status distribution
        $doctorStatus = doctor_details::join('users', 'doctor_details.user_id', '=', 'users.id')
            ->selectRaw('doctor_details.status, COUNT(*) as count')
            ->groupBy('doctor_details.status')
            ->get()
            ->pluck('count', 'status');

        return [
            'staffCounts' => $staffCounts,
            'activeStaff' => $activeStaff,
            'inactiveStaff' => $inactiveStaff,
            'doctorStatus' => $doctorStatus,
        ];
    }

    private function getMedicalAnalytics($startDate, $endDate)
    {
        try {
            // Total medical records
            $totalRecords = 0;
            $recordsInPeriod = 0;
            $commonDiagnoses = collect();
            
            if (Schema::hasTable('medical_history')) {
                $totalRecords = medical_history::count();
                $recordsInPeriod = medical_history::whereBetween('created_at', [$startDate, $endDate])->count();
                
                $commonDiagnoses = medical_history::whereBetween('created_at', [$startDate, $endDate])
                    ->selectRaw('diagnosis, COUNT(*) as count')
                    ->groupBy('diagnosis')
                    ->orderByDesc('count')
                    ->limit(10)
                    ->get()
                    ->pluck('count', 'diagnosis');
            }
            
            // Total prescriptions
            $totalPrescriptions = 0;
            $prescriptionsInPeriod = 0;
            
            if (Schema::hasTable('prescriptions')) {
                $totalPrescriptions = Prescription::count();
                $prescriptionsInPeriod = Prescription::whereBetween('created_at', [$startDate, $endDate])->count();
            }

            return [
                'totalRecords' => $totalRecords,
                'recordsInPeriod' => $recordsInPeriod,
                'totalPrescriptions' => $totalPrescriptions,
                'prescriptionsInPeriod' => $prescriptionsInPeriod,
                'commonDiagnoses' => $commonDiagnoses,
            ];
        } catch (\Exception $e) {
            // Return default values if there's an error
            return [
                'totalRecords' => 0,
                'recordsInPeriod' => 0,
                'totalPrescriptions' => 0,
                'prescriptionsInPeriod' => 0,
                'commonDiagnoses' => collect(),
            ];
        }
    }

    public function generateReport(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:pdf,excel',
            'report_category' => 'required|in:overview,patients,appointments,programs,services,staff,medical,custom',
            'date_range' => 'required|array',
            'date_range.start' => 'required|date',
            'date_range.end' => 'required|date|after_or_equal:date_range.start',
            'custom_fields' => 'nullable|array',
            'filters' => 'nullable|array'
        ]);

        $startDate = Carbon::parse($request->date_range['start']);
        $endDate = Carbon::parse($request->date_range['end']);
        $reportType = $request->report_type;
        $reportCategory = $request->report_category;
        $customFields = $request->custom_fields ?? [];
        $filters = $request->filters ?? [];

        try {
            // Get data based on report category
            $reportData = $this->getReportData($reportCategory, $startDate, $endDate, $customFields, $filters);
            
            if ($reportType === 'pdf') {
                return $this->generatePDFReport($reportData, $reportCategory, $startDate, $endDate);
            } else {
                return $this->generateExcelReport($reportData, $reportCategory, $startDate, $endDate);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getReportData($category, $startDate, $endDate, $customFields = [], $filters = [])
    {
        switch ($category) {
            case 'overview':
                return [
                    'patientData' => $this->getPatientAnalytics($startDate, $endDate),
                    'appointmentData' => $this->getAppointmentAnalytics($startDate, $endDate),
                    'serviceData' => $this->getServiceAnalytics($startDate, $endDate),
                    'programData' => $this->getProgramAnalytics($startDate, $endDate),
                    'staffData' => $this->getStaffAnalytics($startDate, $endDate),
                    'medicalData' => $this->getMedicalAnalytics($startDate, $endDate),
                ];
            case 'patients':
                return $this->getDetailedPatientData($startDate, $endDate, $customFields, $filters);
            case 'appointments':
                return $this->getDetailedAppointmentData($startDate, $endDate, $customFields, $filters);
            case 'programs':
                return $this->getDetailedProgramData($startDate, $endDate, $customFields, $filters);
            case 'services':
                return $this->getDetailedServiceData($startDate, $endDate, $customFields, $filters);
            case 'staff':
                return $this->getDetailedStaffData($startDate, $endDate, $customFields, $filters);
            case 'medical':
                return $this->getDetailedMedicalData($startDate, $endDate, $customFields, $filters);
            case 'custom':
                return $this->getCustomReportData($startDate, $endDate, $customFields, $filters);
            default:
                throw new \Exception('Invalid report category');
        }
    }

    private function getDetailedPatientData($startDate, $endDate, $customFields, $filters)
    {
        $query = User::where('roleID', 2); // Patients only

        // Apply filters
        if (isset($filters['gender']) && $filters['gender']) {
            $query->where('gender', $filters['gender']);
        }
        if (isset($filters['age_min']) && $filters['age_min']) {
            $query->whereRaw('YEAR(CURDATE()) - YEAR(birth) >= ?', [$filters['age_min']]);
        }
        if (isset($filters['age_max']) && $filters['age_max']) {
            $query->whereRaw('YEAR(CURDATE()) - YEAR(birth) <= ?', [$filters['age_max']]);
        }

        $patients = $query->whereBetween('created_at', [$startDate, $endDate])->get();

        // Select only requested fields
        if (!empty($customFields)) {
            $patients = $patients->map(function ($patient) use ($customFields) {
                $data = [];
                foreach ($customFields as $field) {
                    $data[$field] = $patient->$field ?? null;
                }
                return $data;
            });
        }

        return [
            'data' => $patients,
            'summary' => $this->getPatientAnalytics($startDate, $endDate),
            'total_count' => $patients->count()
        ];
    }

    private function getDetailedAppointmentData($startDate, $endDate, $customFields, $filters)
    {
        $query = Appointment::whereBetween('date', [$startDate, $endDate]);

        // Apply filters
        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['service_id']) && $filters['service_id']) {
            $query->where('servicetype_id', $filters['service_id']);
        }

        $appointments = $query->with(['user', 'service', 'subservice', 'doctor'])->get();

        // Select only requested fields
        if (!empty($customFields)) {
            $appointments = $appointments->map(function ($appointment) use ($customFields) {
                $data = [];
                foreach ($customFields as $field) {
                    if (str_contains($field, '.')) {
                        // Handle relationship fields
                        $parts = explode('.', $field);
                        $value = $appointment;
                        foreach ($parts as $part) {
                            $value = $value->$part ?? null;
                        }
                        $data[$field] = $value;
                    } else {
                        $data[$field] = $appointment->$field ?? null;
                    }
                }
                return $data;
            });
        }

        return [
            'data' => $appointments,
            'summary' => $this->getAppointmentAnalytics($startDate, $endDate),
            'total_count' => $appointments->count()
        ];
    }

    private function getDetailedProgramData($startDate, $endDate, $customFields, $filters)
    {
        $query = program_schedules::whereBetween('created_at', [$startDate, $endDate]);

        // Apply filters
        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['program_type_id']) && $filters['program_type_id']) {
            $query->where('program_type_id', $filters['program_type_id']);
        }

        $programs = $query->with(['program_type'])->get();

        return [
            'data' => $programs,
            'summary' => $this->getProgramAnalytics($startDate, $endDate),
            'total_count' => $programs->count()
        ];
    }

    private function getDetailedServiceData($startDate, $endDate, $customFields, $filters)
    {
        $services = servicetypes::with(['subservices'])->get();
        $subservices = subservices::get();

        return [
            'services' => $services,
            'subservices' => $subservices,
            'summary' => $this->getServiceAnalytics($startDate, $endDate),
            'total_services' => $services->count(),
            'total_subservices' => $subservices->count()
        ];
    }

    private function getDetailedStaffData($startDate, $endDate, $customFields, $filters)
    {
        $query = User::whereIn('roleID', [1, 6, 7]); // Doctors, Pharmacists, Admins

        // Apply filters
        if (isset($filters['role']) && $filters['role']) {
            $query->where('roleID', $filters['role']);
        }
        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }

        $staff = $query->with(['role'])->get();

        return [
            'data' => $staff,
            'summary' => $this->getStaffAnalytics($startDate, $endDate),
            'total_count' => $staff->count()
        ];
    }

    private function getDetailedMedicalData($startDate, $endDate, $customFields, $filters)
    {
        $medicalRecords = collect();
        $prescriptions = collect();

        if (Schema::hasTable('medical_history')) {
            $medicalRecords = medical_history::whereBetween('created_at', [$startDate, $endDate])
                ->with(['patient', 'doctor'])
                ->get();
        }

        if (Schema::hasTable('prescriptions')) {
            $prescriptions = Prescription::whereBetween('created_at', [$startDate, $endDate])
                ->with(['patient', 'doctor'])
                ->get();
        }

        return [
            'medical_records' => $medicalRecords,
            'prescriptions' => $prescriptions,
            'summary' => $this->getMedicalAnalytics($startDate, $endDate),
            'total_records' => $medicalRecords->count(),
            'total_prescriptions' => $prescriptions->count()
        ];
    }

    private function getCustomReportData($startDate, $endDate, $customFields, $filters)
    {
        // Custom report logic based on selected fields
        $data = [];
        
        foreach ($customFields as $field) {
            switch ($field) {
                case 'patient_registrations':
                    $data['patient_registrations'] = User::where('roleID', 2)
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->count();
                    break;
                case 'appointment_completions':
                    $data['appointment_completions'] = Appointment::whereBetween('date', [$startDate, $endDate])
                        ->where('status', 'completed')
                        ->count();
                    break;
                case 'service_usage':
                    $data['service_usage'] = Appointment::whereBetween('date', [$startDate, $endDate])
                        ->join('servicetypes', 'appointments.servicetype_id', '=', 'servicetypes.id')
                        ->selectRaw('servicetypes.servicename, COUNT(*) as count')
                        ->groupBy('servicetypes.servicename')
                        ->get();
                    break;
                // Add more custom fields as needed
            }
        }

        return $data;
    }

    private function generatePDFReport($data, $category, $startDate, $endDate)
    {
        // For now, return a simple response. In a real implementation, you would use a PDF library like DomPDF or TCPDF
        $filename = "report_{$category}_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".pdf";
        
        return response()->json([
            'success' => true,
            'message' => 'PDF report generated successfully',
            'filename' => $filename,
            'data' => $data
        ]);
    }

    private function generateExcelReport($data, $category, $startDate, $endDate)
    {
        // For now, return a simple response. In a real implementation, you would use a library like Laravel Excel
        $filename = "report_{$category}_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".xlsx";
        
        return response()->json([
            'success' => true,
            'message' => 'Excel report generated successfully',
            'filename' => $filename,
            'data' => $data
        ]);
    }

    public function getReportTemplates()
    {
        return response()->json([
            'templates' => [
                [
                    'id' => 'monthly_summary',
                    'name' => 'Monthly Summary Report',
                    'description' => 'Comprehensive monthly overview of all activities',
                    'category' => 'overview',
                    'fields' => ['patients', 'appointments', 'programs', 'services', 'staff']
                ],
                [
                    'id' => 'patient_demographics',
                    'name' => 'Patient Demographics Report',
                    'description' => 'Detailed patient demographic analysis',
                    'category' => 'patients',
                    'fields' => ['firstname', 'lastname', 'gender', 'birth', 'address', 'contactno']
                ],
                [
                    'id' => 'appointment_analysis',
                    'name' => 'Appointment Analysis Report',
                    'description' => 'Detailed appointment statistics and trends',
                    'category' => 'appointments',
                    'fields' => ['date', 'time', 'status', 'service.servicename', 'user.firstname', 'user.lastname']
                ],
                [
                    'id' => 'service_utilization',
                    'name' => 'Service Utilization Report',
                    'description' => 'Analysis of service usage and popularity',
                    'category' => 'services',
                    'fields' => ['servicename', 'subservices', 'appointment_count']
                ],
                [
                    'id' => 'staff_performance',
                    'name' => 'Staff Performance Report',
                    'description' => 'Staff activity and performance metrics',
                    'category' => 'staff',
                    'fields' => ['firstname', 'lastname', 'role.rolename', 'status', 'appointment_count']
                ]
            ]
        ]);
    }
}
