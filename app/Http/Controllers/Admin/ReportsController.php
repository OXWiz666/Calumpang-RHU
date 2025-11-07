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
        try {
            // Use Patient model instead of User model - get data from patients table
            $query = Patient::with('user');
            
            if (isset($filters['gender']) && $filters['gender']) {
                $query->where('gender', $filters['gender']);
            }
            if (isset($filters['age_min']) && $filters['age_min']) {
                $query->whereRaw('YEAR(CURDATE()) - YEAR(date_of_birth) >= ?', [$filters['age_min']]);
            }
            if (isset($filters['age_max']) && $filters['age_max']) {
                $query->whereRaw('YEAR(CURDATE()) - YEAR(date_of_birth) <= ?', [$filters['age_max']]);
            }

            // Don't filter by created_at date range - show all patients
            // If date filtering is needed, it should be optional
            $patients = $query->get();

            \Log::info('Patients Query Result', [
                'count' => $patients->count(),
                'first_patient' => $patients->first() ? [
                    'id' => $patients->first()->id,
                    'patient_id' => $patients->first()->patient_id,
                    'firstname' => $patients->first()->firstname,
                    'lastname' => $patients->first()->lastname,
                ] : 'no patients found'
            ]);

            // Format patient data properly
            $patientData = [];
            foreach ($patients as $patient) {
                $age = 'N/A';
                if ($patient->date_of_birth) {
                    try {
                        $birth = Carbon::parse($patient->date_of_birth);
                        $age = $birth->age;
                    } catch (\Exception $e) {
                        $age = 'N/A';
                    }
                }

                // Build address from components
                $addressParts = array_filter([
                    $patient->street,
                    $patient->barangay,
                    $patient->city,
                    $patient->province,
                    $patient->region,
                    $patient->country
                ]);
                $fullAddress = !empty($addressParts) ? implode(', ', $addressParts) : 'N/A';

                $patientData[] = [
                    'ID' => $patient->patient_id ?? $patient->id,
                    'First Name' => $patient->firstname ?? 'N/A',
                    'Last Name' => $patient->lastname ?? 'N/A',
                    'Middle Name' => $patient->middlename ?? 'N/A',
                    'Suffix' => $patient->suffix ?? 'N/A',
                    'Email' => $patient->email ?? 'N/A',
                    'Contact Number' => $patient->phone ?? 'N/A',
                    'Gender' => $patient->gender ?? 'N/A',
                    'Age' => $age,
                    'Birth Date' => $patient->date_of_birth ? Carbon::parse($patient->date_of_birth)->format('M d, Y') : 'N/A',
                    'Address' => $fullAddress,
                    'Civil Status' => $patient->civil_status ?? 'N/A',
                    'Nationality' => $patient->nationality ?? 'N/A',
                    'Religion' => $patient->religion ?? 'N/A',
                    'Status' => ucfirst($patient->status ?? 'active'),
                    'Patient Type' => $patient->user_id ? 'Registered' : 'Guest',
                    'Registered Date' => $patient->created_at ? Carbon::parse($patient->created_at)->format('M d, Y') : 'N/A',
                ];
            }

            \Log::info('Patient data generated', ['total_rows' => count($patientData)]);
            return $patientData;
        } catch (\Exception $e) {
            \Log::error('Error in getDetailedPatientData', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    private function getDetailedAppointmentData($startDate, $endDate, $filters, $customFields)
    {
        $query = Appointment::with(['user', 'service'])
            ->whereBetween('date', [$startDate, $endDate]);

        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['service_id']) && $filters['service_id']) {
            $query->where('servicetype_id', $filters['service_id']);
        }

        $appointments = $query->get();

        return $appointments->map(function ($appointment) {
            // Get patient name from user relationship or guest fields
            $patientName = 'N/A';
            if ($appointment->user) {
                $patientName = $appointment->user->firstname . ' ' . $appointment->user->lastname;
            } elseif ($appointment->firstname && $appointment->lastname) {
                $patientName = $appointment->firstname . ' ' . $appointment->lastname;
            }
            
            return [
                'ID' => $appointment->id,
                'Patient Name' => $patientName,
                'Service' => $appointment->service ? $appointment->service->servicename : 'N/A',
                'Date' => $appointment->date ? Carbon::parse($appointment->date)->format('M d, Y') : 'N/A',
                'Time' => $appointment->time ? Carbon::parse($appointment->time)->format('h:i A') : 'N/A',
                'Status' => $appointment->status ?? 'pending',
                'Created At' => Carbon::parse($appointment->created_at)->format('M d, Y'),
            ];
        })->toArray();
    }

    private function getDetailedProgramData($startDate, $endDate, $filters, $customFields)
    {
        try {
            // Get all programs - include all programs, not just those in date range
            // This ensures we show all programs with their participants
            $query = program_schedules::with([
                'program_type', 
                'coordinator', 
                'registered_participants.user'
            ]);

            // Only filter by date if specifically requested, otherwise get all programs
            // But still filter participants by registration date if needed
            if (isset($filters['date_range_only']) && $filters['date_range_only']) {
                $query->whereBetween('date', [$startDate, $endDate]);
            }

            if (isset($filters['program_id']) && $filters['program_id']) {
                $query->where('id', $filters['program_id']);
            }

            // Order by date descending to show most recent first
            $query->orderBy('date', 'desc');

            $programs = $query->get();
            
            \Log::info('Programs Query Result', [
                'count' => $programs->count(),
                'date_range' => [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]
            ]);

            // Format programs with all their participants
            $programData = [];
            
            if ($programs->count() === 0) {
                \Log::warning('No programs found in database');
                return [];
            }
            
            foreach ($programs as $program) {
                try {
                    $programName = $program->program_type ? $program->program_type->programname : 'N/A';
                    
                    // Get all participants for this program
                    $participants = $program->registered_participants;
                    
                    \Log::info("Processing program", [
                        'program_id' => $program->id,
                        'program_name' => $programName,
                        'participants_count' => $participants->count()
                    ]);
                    
                    if ($participants->count() > 0) {
                        // Create a row for each participant
                        foreach ($participants as $participant) {
                            // Get participant name (from user or guest fields)
                            $participantName = 'N/A';
                            if ($participant->user) {
                                $participantName = $participant->user->firstname . ' ' . $participant->user->lastname;
                            } elseif ($participant->first_name || $participant->last_name) {
                                $participantName = trim(($participant->first_name ?? '') . ' ' . 
                                                       ($participant->middle_name ?? '') . ' ' . 
                                                       ($participant->last_name ?? '') . ' ' . 
                                                       ($participant->suffix ?? ''));
                            }
                            
                            $programData[] = [
                                'Program ID' => $program->id,
                                'Program Name' => $programName,
                                'Program Date' => $program->date ? Carbon::parse($program->date)->format('M d, Y') : 'N/A',
                                'Program Time' => ($program->start_time ? Carbon::parse($program->start_time)->format('h:i A') : 'N/A') . 
                                                 ($program->end_time ? ' - ' . Carbon::parse($program->end_time)->format('h:i A') : ''),
                                'Location' => $program->location ?? 'N/A',
                                'Coordinator' => $program->coordinator ? $program->coordinator->firstname . ' ' . $program->coordinator->lastname : 'N/A',
                                'Participant Name' => $participantName,
                                'Registration ID' => $participant->registration_id ?? $participant->id,
                                'Contact Number' => $participant->contact_number ?? ($participant->user ? $participant->user->contactno : 'N/A'),
                                'Email' => $participant->email ?? ($participant->user ? $participant->user->email : 'N/A'),
                                'Age' => $participant->age ?? ($participant->user ? $this->calculateAge($participant->user->birth) : 'N/A'),
                                'Gender' => $participant->sex ?? ($participant->user ? $participant->user->gender : 'N/A'),
                                'Status' => $participant->status ?? 'Registered',
                                'Registration Date' => Carbon::parse($participant->created_at)->format('M d, Y'),
                            ];
                        }
                    } else {
                        // If no participants, still show the program
                        $programData[] = [
                            'Program ID' => $program->id,
                            'Program Name' => $programName,
                            'Program Date' => $program->date ? Carbon::parse($program->date)->format('M d, Y') : 'N/A',
                            'Program Time' => ($program->start_time ? Carbon::parse($program->start_time)->format('h:i A') : 'N/A') . 
                                             ($program->end_time ? ' - ' . Carbon::parse($program->end_time)->format('h:i A') : ''),
                            'Location' => $program->location ?? 'N/A',
                            'Coordinator' => $program->coordinator ? $program->coordinator->firstname . ' ' . $program->coordinator->lastname : 'N/A',
                            'Participant Name' => 'No participants',
                            'Registration ID' => 'N/A',
                            'Contact Number' => 'N/A',
                            'Email' => 'N/A',
                            'Age' => 'N/A',
                            'Gender' => 'N/A',
                            'Status' => 'N/A',
                            'Registration Date' => 'N/A',
                        ];
                    }
                } catch (\Exception $e) {
                    \Log::error('Error processing program', [
                        'program_id' => $program->id ?? 'unknown',
                        'error' => $e->getMessage()
                    ]);
                    // Continue with next program
                }
            }

            \Log::info('Program data generated', ['total_rows' => count($programData)]);
            return $programData;
        } catch (\Exception $e) {
            \Log::error('Error in getDetailedProgramData', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    // Helper function to calculate age
    private function calculateAge($birthDate)
    {
        if (!$birthDate) {
            return 'N/A';
        }
        try {
            $birth = Carbon::parse($birthDate);
            return $birth->age;
        } catch (\Exception $e) {
            return 'N/A';
        }
    }

    private function getDetailedServiceData($startDate, $endDate, $filters, $customFields)
    {
        $query = servicetypes::with(['subservices.times']);

        if (isset($filters['service_type']) && $filters['service_type']) {
            $query->where('id', $filters['service_type']);
        }

        $services = $query->get();

        $serviceData = [];
        foreach ($services as $service) {
            // Get sub-services with their available slots
            $subServicesList = [];
            if ($service->subservices && $service->subservices->count() > 0) {
                foreach ($service->subservices as $subservice) {
                    $subServiceName = $subservice->subservicename ?? 'N/A';
                    
                    // Calculate total available slots from all time slots
                    $totalAvailableSlots = 0;
                    $totalMaxSlots = 0;
                    
                    if ($subservice->times && $subservice->times->count() > 0) {
                        foreach ($subservice->times as $time) {
                            $totalAvailableSlots += $time->available_slots ?? 0;
                            $totalMaxSlots += $time->max_slots ?? 0;
                        }
                    }
                    
                    // Format: "Sub-service Name (Available/Max slots)"
                    if ($totalMaxSlots > 0) {
                        $subServicesList[] = $subServiceName . ' (' . $totalAvailableSlots . '/' . $totalMaxSlots . ' slots)';
                    } else {
                        $subServicesList[] = $subServiceName . ' (No slots configured)';
                    }
                }
            }
            
            // Join sub-services names with semicolon or show "No sub-services"
            $subServicesDisplay = !empty($subServicesList) 
                ? implode('; ', $subServicesList) 
                : 'No sub-services';
            
            $serviceData[] = [
                'ID' => $service->id,
                'Service Name' => $service->servicename ?? 'N/A',
                'Sub-services' => $subServicesDisplay,
                'Status' => $service->status == 1 ? 'Active' : ($service->status == 0 ? 'Inactive' : 'N/A'),
                'Created At' => $service->created_at ? Carbon::parse($service->created_at)->format('M d, Y') : 'N/A',
            ];
        }

        return $serviceData;
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

    /**
     * Generate custom report with multiple report types
     */
    public function custom(Request $request)
    {
        try {
            $format = $request->get('format', 'json');
            $startDate = $request->get('start_date', now()->startOfMonth());
            $endDate = $request->get('end_date', now()->endOfMonth());
            
            // Convert to Carbon instances if they're strings
            if (is_string($startDate)) {
                $startDate = Carbon::parse($startDate);
            }
            if (is_string($endDate)) {
                $endDate = Carbon::parse($endDate);
            }

            // Validate date range
            if ($startDate > $endDate) {
                return response()->json([
                    'success' => false,
                    'message' => 'Start date must be before or equal to end date'
                ], 400);
            }

            // Get selected report types
            $includeTypes = $request->get('include_types', []);
            
            // Validate that at least one report type is selected
            if (empty($includeTypes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please select at least one report type to include'
                ], 400);
            }
            
            $customTitle = $request->get('custom_title', 'Custom Official Report');
            $customDescription = $request->get('custom_description', 'Comprehensive custom report with selected data sections');

            // Generate combined report data
            $combinedData = [];
            $analytics = [];

            foreach ($includeTypes as $type) {
                try {
                    switch ($type) {
                        case 'overview':
                            $combinedData['overview'] = $this->getOverviewData($startDate, $endDate, []);
                            $analytics['overview'] = [
                                'patientData' => $this->getPatientAnalytics($startDate, $endDate),
                                'appointmentData' => $this->getAppointmentAnalytics($startDate, $endDate),
                                'programData' => $this->getProgramAnalytics($startDate, $endDate),
                                'serviceData' => $this->getServiceAnalytics($startDate, $endDate),
                                'staffData' => $this->getStaffAnalytics($startDate, $endDate),
                                'medicalData' => $this->getMedicalAnalytics($startDate, $endDate),
                            ];
                            break;
                        case 'patients':
                            $patientData = $this->getDetailedPatientData($startDate, $endDate, [], []);
                            $combinedData['patients'] = $patientData;
                            $analytics['patients'] = $this->getPatientAnalytics($startDate, $endDate);
                            \Log::info('Patients data added to report', [
                                'count' => count($patientData),
                                'sample' => $patientData[0] ?? 'no data',
                                'is_array' => is_array($patientData),
                                'has_data' => is_array($patientData) && count($patientData) > 0
                            ]);
                            break;
                        case 'appointments':
                            $combinedData['appointments'] = $this->getDetailedAppointmentData($startDate, $endDate, [], []);
                            $analytics['appointments'] = $this->getAppointmentAnalytics($startDate, $endDate);
                            break;
                        case 'programs':
                            $programData = $this->getDetailedProgramData($startDate, $endDate, [], []);
                            $combinedData['programs'] = $programData;
                            $analytics['programs'] = $this->getProgramAnalytics($startDate, $endDate);
                            \Log::info('Programs data added to report', [
                                'count' => count($programData),
                                'sample' => $programData[0] ?? 'no data'
                            ]);
                            break;
                        case 'services':
                            $combinedData['services'] = $this->getDetailedServiceData($startDate, $endDate, [], []);
                            $analytics['services'] = $this->getServiceAnalytics($startDate, $endDate);
                            break;
                    }
                } catch (\Exception $e) {
                    \Log::error("Error generating report type: {$type}", [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    // Continue with other report types even if one fails
                }
            }

            // Debug: Log the combined data structure
            \Log::info('Combined Report Data Structure', [
                'keys' => array_keys($combinedData),
                'patients_count' => isset($combinedData['patients']) ? count($combinedData['patients']) : 0,
                'patients_is_array' => isset($combinedData['patients']) ? is_array($combinedData['patients']) : false,
                'patients_first_item' => isset($combinedData['patients'][0]) ? $combinedData['patients'][0] : 'no first item'
            ]);

            $reportData = [
                'title' => $customTitle,
                'description' => $customDescription,
                'reportData' => $combinedData,
                'analytics' => $analytics,
                'generatedAt' => now()->toISOString(),
                'dateRange' => [
                    'start' => $startDate->format('Y-m-d'),
                    'end' => $endDate->format('Y-m-d'),
                ],
                'includedTypes' => $includeTypes
            ];

            if ($format === 'pdf') {
                return $this->generateCustomPDFReport($reportData, $startDate, $endDate);
            } elseif ($format === 'excel') {
                return $this->generateCustomExcelReport($reportData, $startDate, $endDate);
            } else {
                return response()->json($reportData);
            }
        } catch (\Exception $e) {
            \Log::error('Custom Report Generation Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            // Return JSON error response that can be parsed by frontend
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate custom report: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function generateCustomPDFReport($data, $startDate, $endDate)
    {
        $title = 'RURAL HEALTH UNIT CALUMPANG';
        $subtitle = $data['title'] ?? 'CUSTOM REPORT';
        
        // Generate filename based on report types
        $filename = $this->generateReportFilename($data['includedTypes'] ?? [], $startDate, $endDate, 'pdf');
        
        $html = $this->generateCustomReportHTML($title, $subtitle, $data, $startDate, $endDate);
        
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
            \Log::error('Custom PDF Generation Error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    private function generateCustomExcelReport($data, $startDate, $endDate)
    {
        // Generate filename based on report types
        $filename = $this->generateReportFilename($data['includedTypes'] ?? [], $startDate, $endDate, 'xlsx');
        
        // Flatten the combined data for Excel
        $excelData = [];
        foreach ($data['reportData'] as $type => $typeData) {
            // Handle overview data structure (nested arrays)
            if ($type === 'overview' && is_array($typeData)) {
                // Overview has nested structure, flatten it
                foreach ($typeData as $subType => $subData) {
                    if (is_array($subData) && isset($subData[0]) && is_array($subData[0])) {
                        // It's an array of records
                        foreach ($subData as $row) {
                            $excelData[] = array_merge(['Report Type' => ucfirst($type), 'Section' => ucfirst($subType)], $row);
                        }
                    } else {
                        // It's a single record or summary
                        $row = is_array($subData) ? $subData : [$subType => $subData];
                        $excelData[] = array_merge(['Report Type' => ucfirst($type), 'Section' => ucfirst($subType)], $row);
                    }
                }
            } elseif (is_array($typeData) && isset($typeData[0]) && is_array($typeData[0])) {
                // Regular array of records
                foreach ($typeData as $row) {
                    $excelData[] = array_merge(['Report Type' => ucfirst($type)], $row);
                }
            } elseif (is_array($typeData)) {
                // Single record or associative array
                $excelData[] = array_merge(['Report Type' => ucfirst($type)], $typeData);
            }
        }
        
        // If no data, add a header row
        if (empty($excelData)) {
            $excelData[] = ['Report Type' => 'No Data', 'Message' => 'No data available for the selected criteria'];
        }
        
        return Excel::download(new class($excelData) implements \Maatwebsite\Excel\Concerns\FromArray {
            protected $data;
            
            public function __construct($data) {
                $this->data = $data;
            }
            
            public function array(): array {
                return $this->data;
            }
        }, $filename);
    }

    private function generateCustomReportHTML($title, $subtitle, $data, $startDate, $endDate)
    {
        $html = '<!DOCTYPE html>
<html>
<head>
    <title>' . $title . '</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1e3a8a; }
        .subtitle { text-align: center; font-size: 18px; margin-bottom: 20px; color: #666; }
        .description { text-align: center; font-size: 14px; margin-bottom: 30px; color: #888; }
        .section { margin-bottom: 40px; page-break-inside: avoid; }
        .section-title { font-size: 18px; font-weight: bold; color: #1e3a8a; margin-bottom: 15px; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
        th { background: #1e3a8a; color: white; padding: 8px; text-align: left; font-size: 10px; }
        td { padding: 6px 8px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f8f9fa; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">' . $title . '</div>
    <div class="subtitle">' . $subtitle . '</div>';
        
        if (!empty($data['description'])) {
            $html .= '<div class="description">' . htmlspecialchars($data['description']) . '</div>';
        }
        
        $html .= '<div style="margin-bottom: 20px; padding: 10px; background: #f8f9fa; border-left: 4px solid #1e3a8a;">
        <strong>Report Period:</strong> ' . $startDate->format('F j, Y') . ' to ' . $endDate->format('F j, Y') . '<br>
        <strong>Generated:</strong> ' . now()->format('F j, Y \a\t g:i A') . '
    </div>';
        
        foreach ($data['reportData'] as $type => $typeData) {
            $html .= '<div class="section">
                <div class="section-title">' . ucfirst($type) . ' Report</div>';
            
            // Debug logging
            \Log::info("Generating HTML for report type: {$type}", [
                'is_array' => is_array($typeData),
                'count' => is_array($typeData) ? count($typeData) : 0,
                'has_data' => is_array($typeData) && count($typeData) > 0,
                'has_first_item' => is_array($typeData) && isset($typeData[0]),
                'first_item_is_array' => is_array($typeData) && isset($typeData[0]) && is_array($typeData[0]),
                'type_of_data' => gettype($typeData),
                'sample_data' => is_array($typeData) && isset($typeData[0]) ? $typeData[0] : 'no sample'
            ]);
            
            // Check if data exists and is in correct format
            if (is_array($typeData) && count($typeData) > 0) {
                // Check if first item is an array (for table rows)
                if (isset($typeData[0]) && is_array($typeData[0])) {
                $html .= '<table>
                    <thead>
                        <tr>';
                
                // Get column headers from first row
                foreach (array_keys($typeData[0]) as $column) {
                    $html .= '<th>' . ucfirst(str_replace('_', ' ', $column)) . '</th>';
                }
                
                $html .= '</tr>
                    </thead>
                    <tbody>';
                
                foreach ($typeData as $row) {
                    if (is_array($row)) {
                        $html .= '<tr>';
                        foreach ($row as $value) {
                            $html .= '<td>' . htmlspecialchars($value ?? 'N/A') . '</td>';
                        }
                        $html .= '</tr>';
                    }
                }
                
                    $html .= '</tbody>
                    </table>';
                } else {
                    // Data exists but not in expected format
                    $html .= '<p>Data format error for this section.</p>';
                    \Log::warning("Invalid data format for {$type}", [
                        'count' => count($typeData),
                        'first_item' => $typeData[0] ?? 'none',
                        'first_item_type' => isset($typeData[0]) ? gettype($typeData[0]) : 'none'
                    ]);
                }
            } else {
                // No data or empty array
                $html .= '<p>No data available for this section.</p>';
                \Log::warning("Empty or no data for {$type}", [
                    'is_array' => is_array($typeData),
                    'count' => is_array($typeData) ? count($typeData) : 0,
                    'type' => gettype($typeData)
                ]);
            }
            
            $html .= '</div>';
        }
        
        $html .= '<div class="footer">
            <p><strong>OFFICIAL DOCUMENT</strong> - Generated on ' . now()->format('F j, Y \a\t g:i A') . '</p>
            <p>RURAL HEALTH UNIT CALUMPANG</p>
        </div>
</body>
</html>';

        return $html;
    }

    /**
     * Generate filename based on report types
     * If single report type, use specific name (e.g., "patients_report")
     * If multiple report types, use "custom_report"
     */
    private function generateReportFilename($includedTypes, $startDate, $endDate, $extension = 'pdf')
    {
        $dateStr = $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d');
        
        // If only one report type, use specific name
        if (count($includedTypes) === 1) {
            $type = $includedTypes[0];
            $typeNames = [
                'overview' => 'overview_report',
                'patients' => 'patients_report',
                'appointments' => 'appointments_report',
                'programs' => 'health_programs_report',
                'services' => 'services_report',
            ];
            
            $reportName = $typeNames[$type] ?? 'custom_report';
            return $reportName . "_" . $dateStr . "." . $extension;
        }
        
        // Multiple report types - use "custom_report"
        return "custom_report_" . $dateStr . "." . $extension;
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
            $periodAppointments = Appointment::whereBetween('date', [$startDate, $endDate])->count();
            
            // Get status breakdown for the period
            $statusBreakdown = Appointment::whereBetween('date', [$startDate, $endDate])
                ->selectRaw('COALESCE(status, "pending") as status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status')
                ->toArray();

            // Calculate completion rate (status = 5 or 'completed')
            $completedAppointments = Appointment::whereBetween('date', [$startDate, $endDate])
                ->where(function($query) {
                    $query->where('status', 5)
                          ->orWhere('status', 'completed')
                          ->orWhere('status', 'Completed');
                })
                ->count();

            $completionRate = $periodAppointments > 0 
                ? round(($completedAppointments / $periodAppointments) * 100, 2)
                : 0;

            // Get service distribution
            $serviceDistribution = Appointment::whereBetween('date', [$startDate, $endDate])
                ->join('servicetypes', 'appointments.servicetype_id', '=', 'servicetypes.id')
                ->selectRaw('servicetypes.servicename, COUNT(*) as count')
                ->groupBy('servicetypes.servicename')
                ->get()
                ->pluck('count', 'servicename')
                ->toArray();

            return [
                'total' => $totalAppointments,
                'period' => $periodAppointments,
                'completion_rate' => $completionRate,
                'completed' => Appointment::where(function($query) {
                    $query->where('status', 5)
                          ->orWhere('status', 'completed')
                          ->orWhere('status', 'Completed');
                })->count(),
                'statusDistribution' => $statusBreakdown, // Changed from status_breakdown to statusDistribution
                'status_breakdown' => $statusBreakdown, // Keep for backward compatibility
                'serviceDistribution' => $serviceDistribution,
            ];
        } catch (\Exception $e) {
            \Log::error('Appointment Analytics Error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return [
                'total' => 0, 
                'period' => 0, 
                'completion_rate' => 0,
                'completed' => 0,
                'statusDistribution' => [],
                'status_breakdown' => [],
                'serviceDistribution' => []
            ];
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
