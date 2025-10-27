<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\appointments as Appointment;
use App\Models\program_participants as program_registrations;
use App\Models\program_schedules;
use App\Models\servicetypes;
use App\Models\subservices;
use App\Models\doctor_details;
use App\Models\medical_history;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

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

    public function generateReport(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:pdf,excel,csv',
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
            \Log::error('Admin Report Generation Error', [
                'error' => $e->getMessage(), 
                'trace' => $e->getTraceAsString(),
                'category' => $reportCategory,
                'type' => $reportType
            ]);
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
                return $this->getOverviewData($startDate, $endDate, $filters);
            case 'patients':
                return $this->getDetailedPatientData($startDate, $endDate, $filters, $customFields);
            case 'appointments':
                return $this->getDetailedAppointmentData($startDate, $endDate, $filters, $customFields);
            case 'programs':
                return $this->getDetailedProgramData($startDate, $endDate, $filters, $customFields);
            case 'services':
                return $this->getDetailedServiceData($startDate, $endDate, $filters, $customFields);
            case 'staff':
                return $this->getDetailedStaffData($startDate, $endDate, $filters, $customFields);
            case 'medical':
                return $this->getDetailedMedicalData($startDate, $endDate, $filters, $customFields);
            case 'custom':
                return $this->getCustomReportData($startDate, $endDate, $filters, $customFields);
            default:
                throw new \Exception("Unknown report category: {$category}");
        }
    }

    private function generatePDFReport($data, $category, $startDate, $endDate)
    {
        $title = 'RURAL HEALTH UNIT CALUMPANG';
        $subtitle = strtoupper(str_replace('_', ' ', $category)) . ' REPORT';
        $filename = "report_{$category}_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".pdf";
        
        // Generate HTML using React-like approach
        $html = $this->generateReactHTML($title, $subtitle, $data, $category, $startDate, $endDate);
        
        try {
            $pdf = Pdf::loadHTML($html);
            $pdf->setPaper('a4', 'landscape');
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'Arial'
            ]);
            
            return $pdf->stream($filename);
        } catch (\Exception $e) {
            \Log::error('PDF Generation Error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    private function generateExcelReport($data, $category, $startDate, $endDate)
    {
        $filename = "report_{$category}_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".xlsx";
        
        // Prepare data for Excel
        $excelData = $this->prepareReportDataForExcel($data, $category);
        $columns = $this->getReportColumns($category);
        
        return Excel::download(new class($excelData, $columns) implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\WithHeadings {
            protected $data;
            protected $columns;
            
            public function __construct($data, $columns) {
                $this->data = $data;
                $this->columns = $columns;
            }
            
            public function array(): array {
                return $this->data;
            }
            
            public function headings(): array {
                return array_values($this->columns);
            }
        }, $filename);
    }

    private function generateReactHTML($title, $subtitle, $data, $category, $startDate, $endDate)
    {
        $meta = [
            'Generated on' => now()->format('F j, Y \a\t g:i A'),
            'Report Period' => $startDate->format('F j, Y') . ' to ' . $endDate->format('F j, Y'),
            'Total Records' => is_array($data) ? count($data) : 0,
            'Category' => ucfirst(str_replace('_', ' ', $category))
        ];

        $html = '<!DOCTYPE html>
<html>
<head>
    <title>' . $title . '</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1e3a8a; }
        .subtitle { text-align: center; font-size: 16px; margin-bottom: 20px; color: #666; }
        .meta-info { background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-left: 4px solid #1e3a8a; }
        .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .meta-item { display: flex; justify-content: space-between; padding: 5px 0; }
        .meta-label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #1e3a8a; color: white; padding: 8px; text-align: left; font-size: 10px; }
        td { padding: 6px 8px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f8f9fa; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">' . $title . '</div>
    <div class="subtitle">' . $subtitle . '</div>
    
    <div class="meta-info">
        <div class="meta-grid">';
        
        foreach ($meta as $key => $value) {
            $html .= '<div class="meta-item">
                <span class="meta-label">' . $key . ':</span>
                <span>' . $value . '</span>
            </div>';
        }
        
        $html .= '</div>
    </div>';
        
        if (is_array($data) && count($data) > 0) {
            $html .= '<div class="data-section">
                <h3>Report Data</h3>
                <table>
                    <thead>
                        <tr>';
            
            if (isset($data[0])) {
                foreach (array_keys($data[0]) as $column) {
                    $html .= '<th>' . ucfirst(str_replace('_', ' ', $column)) . '</th>';
                }
            }
            
            $html .= '</tr>
                    </thead>
                    <tbody>';
            
            foreach ($data as $row) {
                $html .= '<tr>';
                foreach ($row as $value) {
                    $html .= '<td>' . htmlspecialchars($value) . '</td>';
                }
                $html .= '</tr>';
            }
            
            $html .= '</tbody>
                </table>
            </div>';
        } else {
            $html .= '<div class="no-data">
                <p>No data available for the selected criteria.</p>
            </div>';
        }
        
        $html .= '<div class="footer">
            <p><strong>OFFICIAL DOCUMENT</strong> - Generated on ' . now()->format('F j, Y \a\t g:i A') . '</p>
            <p>RURAL HEALTH UNIT CALUMPANG</p>
        </div>
</body>
</html>';

        return $html;
    }

    // Data retrieval methods
    private function getOverviewData($startDate, $endDate, $filters)
    {
        return [
            'patientData' => $this->getPatientAnalytics($startDate, $endDate),
            'appointmentData' => $this->getAppointmentAnalytics($startDate, $endDate),
            'programData' => $this->getProgramAnalytics($startDate, $endDate),
            'serviceData' => $this->getServiceAnalytics($startDate, $endDate),
            'staffData' => $this->getStaffAnalytics($startDate, $endDate),
            'medicalData' => $this->getMedicalAnalytics($startDate, $endDate),
        ];
    }

    private function getDetailedPatientData($startDate, $endDate, $filters, $customFields)
    {
        $query = User::where('roleID', 2);
        
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

        if (!empty($customFields)) {
            $patients = $patients->map(function ($patient) use ($customFields) {
                $data = [];
                foreach ($customFields as $field) {
                    $data[$field] = $patient->$field ?? null;
                }
                return $data;
            });
        }

        return $patients->toArray();
    }

    private function getDetailedAppointmentData($startDate, $endDate, $filters, $customFields)
    {
        $query = Appointment::with(['patient', 'doctor', 'service'])
            ->whereBetween('appointment_date', [$startDate, $endDate]);

        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['service_id']) && $filters['service_id']) {
            $query->where('service_id', $filters['service_id']);
        }

        $appointments = $query->get();

        return $appointments->map(function ($appointment) {
            return [
                'ID' => $appointment->id,
                'Patient Name' => $appointment->patient ? $appointment->patient->firstname . ' ' . $appointment->patient->lastname : 'N/A',
                'Doctor' => $appointment->doctor ? $appointment->doctor->firstname . ' ' . $appointment->doctor->lastname : 'N/A',
                'Service' => $appointment->service ? $appointment->service->name : 'N/A',
                'Date' => Carbon::parse($appointment->appointment_date)->format('M d, Y'),
                'Time' => $appointment->appointment_time,
                'Status' => $appointment->status,
                'Notes' => $appointment->notes ?? 'N/A',
                'Created At' => Carbon::parse($appointment->created_at)->format('M d, Y'),
            ];
        })->toArray();
    }

    private function getDetailedProgramData($startDate, $endDate, $filters, $customFields)
    {
        $query = program_registrations::with(['program', 'patient'])
            ->whereBetween('created_at', [$startDate, $endDate]);

        if (isset($filters['program_id']) && $filters['program_id']) {
            $query->where('program_id', $filters['program_id']);
        }

        $registrations = $query->get();

        return $registrations->map(function ($registration) {
            return [
                'ID' => $registration->id,
                'Patient Name' => $registration->patient ? $registration->patient->firstname . ' ' . $registration->patient->lastname : 'N/A',
                'Program' => $registration->program ? $registration->program->name : 'N/A',
                'Registration Date' => Carbon::parse($registration->created_at)->format('M d, Y'),
                'Status' => $registration->status ?? 'Active',
            ];
        })->toArray();
    }

    private function getDetailedServiceData($startDate, $endDate, $filters, $customFields)
    {
        $query = servicetypes::with(['subservices']);

        if (isset($filters['service_type']) && $filters['service_type']) {
            $query->where('id', $filters['service_type']);
        }

        $services = $query->get();

        return $services->map(function ($service) {
        return [
                'ID' => $service->id,
                'Service Name' => $service->name,
                'Description' => $service->description ?? 'N/A',
                'Subservices Count' => $service->subservices ? $service->subservices->count() : 0,
                'Status' => $service->status ?? 'Active',
                'Created At' => Carbon::parse($service->created_at)->format('M d, Y'),
            ];
        })->toArray();
    }

    private function getDetailedStaffData($startDate, $endDate, $filters, $customFields)
    {
        $query = User::whereIn('roleID', [1, 4]);

        if (isset($filters['role_id']) && $filters['role_id']) {
            $query->where('roleID', $filters['role_id']);
        }

        $staff = $query->whereBetween('created_at', [$startDate, $endDate])->get();

        return $staff->map(function ($member) {
            return [
                'ID' => $member->id,
                'Name' => $member->firstname . ' ' . $member->lastname,
                'Email' => $member->email,
                'Role' => $member->roleID == 1 ? 'Admin' : 'Staff',
                'Status' => $member->status ?? 'Active',
                'Created At' => Carbon::parse($member->created_at)->format('M d, Y'),
            ];
        })->toArray();
    }

    private function getDetailedMedicalData($startDate, $endDate, $filters, $customFields)
    {
        $query = medical_history::with(['patient', 'doctor'])
            ->whereBetween('created_at', [$startDate, $endDate]);

        if (isset($filters['patient_id']) && $filters['patient_id']) {
            $query->where('patient_id', $filters['patient_id']);
        }

        $records = $query->get();

        return $records->map(function ($record) {
        return [
                'ID' => $record->id,
                'Patient Name' => $record->patient ? $record->patient->firstname . ' ' . $record->patient->lastname : 'N/A',
                'Doctor' => $record->doctor ? $record->doctor->firstname . ' ' . $record->doctor->lastname : 'N/A',
                'Diagnosis' => $record->diagnosis ?? 'N/A',
                'Treatment' => $record->treatment ?? 'N/A',
                'Date' => Carbon::parse($record->created_at)->format('M d, Y'),
                'Status' => $record->status ?? 'Active',
            ];
        })->toArray();
    }

    private function getCustomReportData($startDate, $endDate, $filters, $customFields)
    {
        // Custom report logic based on selected fields
        return [];
    }

    // Analytics methods
    private function getPatientAnalytics($startDate, $endDate)
    {
        try {
            $totalPatients = Patient::count();
            $newPatients = Patient::whereBetween('created_at', [$startDate, $endDate])
                ->count();
            
            $lastPeriodStart = $startDate->copy()->subDays($endDate->diffInDays($startDate) + 1);
            $lastPeriodEnd = $startDate->copy()->subDay();
            $newPatientsLastPeriod = Patient::whereBetween('created_at', [$lastPeriodStart, $lastPeriodEnd])
                ->count();

            // $demographics = Patient::selectRaw('
            //         COUNT(*) as total,
            //         SUM(CASE WHEN gender = "Male" THEN 1 ELSE 0 END) as male,
            //         SUM(CASE WHEN gender = "Female" THEN 1 ELSE 0 END) as female,
            //         SUM(CASE WHEN gender = "Other" THEN 1 ELSE 0 END) as other
            //     ')

              $demographics = [
                    'total' => Patient::count(),
                    'male' => Patient::where('gender', 'Male')->count(),
                    'female' => Patient::where('gender', 'Female')->count(),
                    'other' => Patient::where('gender', 'Other')->count(),
                ];

                      // ✅ Monthly trend: counts grouped by month name
        $monthlyTrendRaw = Patient::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
    ->whereYear('created_at', now()->year)
    ->groupBy('month')
    ->orderBy('month')
    ->get()
    ->mapWithKeys(function ($item) {
        return [intval($item->month) => $item->count];
    });

// ✅ Create an array with all months (Jan–Dec) and fill missing ones with 0
$monthlyTrend = collect(range(1, 12))->mapWithKeys(function ($month) use ($monthlyTrendRaw) {
    $monthName = date('M', mktime(0, 0, 0, $month, 1));
    return [$monthName => $monthlyTrendRaw->get($month, 0)];
});

            //$demographics = Patient::

        return [
                'total' => $totalPatients,
                'new' => $newPatients,
                'monthlyTrend' => $monthlyTrend,
                'growth' => $newPatientsLastPeriod > 0 ? round((($newPatients - $newPatientsLastPeriod) / $newPatientsLastPeriod) * 100, 2) : 0,
                'demographics' => $demographics,
            ];
        } catch (\Exception $e) {
            \Log::error('Patient Analytics Error', ['error' => $e->getMessage()]);
            return ['total' => 0, 'new' => 0, 'growth' => 0, 'demographics' => null];
        }
    }

    private function getAppointmentAnalytics($startDate, $endDate)
    {
        try {
            $totalAppointments = Appointment::count();
            $periodAppointments = Appointment::whereBetween('created_at', [$startDate, $endDate])->count();
            
            $statusBreakdown = Appointment::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status');

             // ✅ Add this
        $completedAppointments = Appointment::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 5)
            ->count();

        $completionRate = $periodAppointments > 0 
            ? round(($completedAppointments / $periodAppointments) * 100, 2)
            : 0;

            return [
                'total' => $totalAppointments,
                'period' => $periodAppointments,
                'completion_rate' => $completionRate, // ✅ new field
                'completed' => Appointment::where('status',5)->count(),
                'status_breakdown' => $statusBreakdown,
            ];
        } catch (\Exception $e) {
            \Log::error('Appointment Analytics Error', ['error' => $e->getMessage()]);
            return ['total' => 0, 'period' => 0, 'status_breakdown' => []];
        }
    }

    private function getProgramAnalytics($startDate, $endDate)
    {
        try {
            $totalPrograms = program_schedules::count();
            $periodPrograms = program_schedules::whereBetween('created_at', [$startDate, $endDate])->count();

        return [
                'total' => $totalPrograms,
                'activePrograms' => program_schedules::where('status', 'Available')->count(),
                'period' => $periodPrograms,
            ];
        } catch (\Exception $e) {
            \Log::error('Program Analytics Error', ['error' => $e->getMessage()]);
            return ['total' => 0, 'period' => 0];
        }
    }

    private function getServiceAnalytics($startDate, $endDate)
    {
        try {
            $totalServices = servicetypes::count();
            $totalSubservices = subservices::count();

            return [
                'total' => $totalServices,
                'activeServices' => servicetypes::where('status', '1')->count(),
                'subservices' => $totalSubservices,
            ];
        } catch (\Exception $e) {
            \Log::error('Service Analytics Error', ['error' => $e->getMessage()]);
            return ['total' => 0, 'subservices' => 0];
        }
    }

    private function getStaffAnalytics($startDate, $endDate)
    {
        try {
            $totalStaff = User::whereIn('roleID', [1, 4])->count();
            $newStaff = User::whereIn('roleID', [1, 4])
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();


            $staffCounts = [
                'doctors' => User::where('roleID', 1)->count(),
                'admins' => User::where('roleID', 7)->count(),
                'pharmacists' =>  User::where('roleID', 6)->count(),
                'activeStaff' => User::whereIn('roleID', [1, 6,7])->where('status', '5')->count(),
                'inactiveStaff' => User::whereIn('roleID', [1, 6,7])->where('status', '1')->count(),
            ];

            return [
                'total' => $totalStaff,
                'staffCounts' => $staffCounts,
                'new' => $newStaff,
            ];
        } catch (\Exception $e) {
            \Log::error('Staff Analytics Error', ['error' => $e->getMessage()]);
            return ['total' => 0, 'new' => 0];
        }
    }

    private function getMedicalAnalytics($startDate, $endDate)
    {
        try {
            $totalRecords = MedicalRecord::count();
            $periodRecords = MedicalRecord::whereBetween('created_at', [$startDate, $endDate])->count();



        return [
                'total' => $totalRecords,
                'period' => $periodRecords,
            ];
        } catch (\Exception $e) {
            \Log::error('Medical Analytics Error', ['error' => $e->getMessage()]);
            return ['total' => 0, 'period' => 0];
        }
    }

    private function prepareReportDataForExcel($data, $category)
    {
        if (!is_array($data)) {
            return [];
        }

        return array_map(function($item) {
            return is_array($item) ? $item : (array) $item;
        }, $data);
    }

    private function getReportColumns($category)
    {
        $columns = [
            'overview' => [
                'Total Patients' => 'Total Patients',
                'Total Appointments' => 'Total Appointments',
                'Total Programs' => 'Total Programs',
                'Total Services' => 'Total Services',
                'Total Staff' => 'Total Staff',
            ],
            'patients' => [
                'ID' => 'ID',
                'Name' => 'Name',
                'Email' => 'Email',
                'Gender' => 'Gender',
                'Birth Date' => 'Birth Date',
                'Created At' => 'Created At',
            ],
            'appointments' => [
                'ID' => 'ID',
                'Patient Name' => 'Patient Name',
                'Doctor' => 'Doctor',
                'Service' => 'Service',
                'Date' => 'Date',
                'Time' => 'Time',
                'Status' => 'Status',
            ],
        ];

        return $columns[$category] ?? [];
    }

    public function testData()
    {
        $patientCount = User::where('roleID', 2)->count();
        $appointmentCount = Appointment::count();
        
        return response()->json([
            'patients' => $patientCount,
            'appointments' => $appointmentCount,
        ]);
    }

}
