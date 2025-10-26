<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\appointments;
use App\Models\inventory;
use App\Models\istocks;
use App\Models\istock_movements;
use App\Models\program_schedules;
use App\Models\Prescription;
use App\Models\PrescriptionMedicine;
use App\Models\activity_logs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Inertia\Inertia;
class AdminDashboardController extends Controller
{
    // /**
    //  * Display the dashboard page.
    //  *
    //  * @return \Illuminate\View\View
    //  */
    public function index()
    {
        // Get the authenticated user
        $user = Auth::user();
        
        // Get real patient data - count only guest patients (matching Patient Records page)
        // Guest patients (from appointments table) - same logic as Patient Records
        $guestPatients = appointments::whereNull('user_id')
            ->whereNotNull('firstname')
            ->whereNotNull('lastname')
            ->distinct('firstname', 'lastname')
            ->count();
        
        $totalPatients = $guestPatients; // Only count guest patients
        
        // Current month patients (guest patients only)
        $currentMonthPatients = appointments::whereNull('user_id')
            ->whereNotNull('firstname')
            ->whereNotNull('lastname')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->distinct('firstname', 'lastname')
            ->count();
        
        // Previous month patients (guest patients only)
        $previousMonthPatients = appointments::whereNull('user_id')
            ->whereNotNull('firstname')
            ->whereNotNull('lastname')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->distinct('firstname', 'lastname')
            ->count();
        
        // Calculate patient growth percentage
        $max = max($previousMonthPatients, $currentMonthPatients);
        $patientGrowthPercentage = $max == 0 ? 0 : ($currentMonthPatients - $previousMonthPatients) / $max * 100;
        
        // Get real appointment data - count appointments created today (new appointments)
        $todayAppointments = appointments::whereDate('created_at', now()->toDateString())->count();
        $yesterdayAppointments = appointments::whereDate('created_at', now()->subDay()->toDateString())->count();
        $appointmentGrowth = $yesterdayAppointments > 0 ? (($todayAppointments - $yesterdayAppointments) / $yesterdayAppointments) * 100 : 0;
        
        // Get real inventory data
        $totalInventoryItems = inventory::count();
        $lowStockItems = inventory::whereHas('stock', function($query) {
            $query->where('stocks', '<=', 10);
        })->count();
        $expiringItems = inventory::whereNotNull('expiry_date')
            ->where('expiry_date', '!=', 'N/A')
            ->where('expiry_date', '<=', now()->addDays(30))
            ->where('expiry_date', '>=', now())
            ->count();
        
        // Get real staff data - use same logic as Staff Statistics
        $admins = User::where('roleID', '7')->count();
        $doctorsWithDetails = User::where('roleID', '1')
            ->whereHas('doctor_details')
            ->count();
        $pharmacists = User::where('roleID', '6')->count();
        
        $totalStaff = $admins + $doctorsWithDetails + $pharmacists;
        
        // Count active staff using same logic
        $activeAdmins = User::where('roleID', '7')
            ->where('status', 1)
            ->count();
        $activeDoctors = User::where('roleID', '1')
            ->whereHas('doctor_details')
            ->where('status', 1)
            ->count();
        $activePharmacists = User::where('roleID', '6')
            ->where('status', 1)
            ->count();
        
        $activeStaff = $activeAdmins + $activeDoctors + $activePharmacists;
        $staffOnLeave = $totalStaff - $activeStaff;
        
        // Get real program data
        $activePrograms = program_schedules::where('status', 'Available')->count();
        $totalPrograms = program_schedules::count();
        
        // Get real prescription data
        $totalPrescriptions = Prescription::count();
        $pendingPrescriptions = Prescription::where('status', 'pending')->count();
        $dispensedPrescriptions = Prescription::where('status', 'dispensed')->count();
        
        // Get system health metrics
        $systemHealth = $this->calculateSystemHealth();
        
        // Get recent activities
        $recentActivities = $this->getRecentActivities();
        
        // Prepare comprehensive dashboard data
        $dashboardData = [
            'patients' => [
                'total' => $totalPatients,
                'growth' => round($patientGrowthPercentage, 2),
                'trend' => $patientGrowthPercentage >= 0 ? 'up' : 'down'
            ],
            'appointments' => [
                'today' => $todayAppointments,
                'growth' => round($appointmentGrowth, 2),
                'trend' => $appointmentGrowth >= 0 ? 'up' : 'down',
                'pending' => appointments::where('status', 'pending')->count(),
                'completed' => appointments::where('status', 'completed')->count()
            ],
            'inventory' => [
                'total' => $totalInventoryItems,
                'lowStock' => $lowStockItems,
                'expiring' => $expiringItems,
                'trend' => $this->calculateInventoryTrend()
            ],
            'staff' => [
                'total' => $totalStaff,
                'active' => $activeStaff,
                'onLeave' => $staffOnLeave,
                'trend' => 0
            ],
            'programs' => [
                'active' => $activePrograms,
                'total' => $totalPrograms,
                'trend' => 0
            ],
            'prescriptions' => [
                'total' => $totalPrescriptions,
                'pending' => $pendingPrescriptions,
                'dispensed' => $dispensedPrescriptions,
                'trend' => $this->calculatePrescriptionTrend()
            ],
            'systemHealth' => $systemHealth
        ];

        return Inertia::render("Authenticated/Admin/Dashboard", [
            'totalPatients' => $totalPatients,
            'patientGrowthPercentage' => round($patientGrowthPercentage, 2),
            'dashboardData' => $dashboardData,
            'recentActivities' => $recentActivities
        ]);
    }
    /**
     * Get dashboard statistics as JSON for AJAX requests.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats()
    {
        // Sample data - in a real application, you would fetch this from your database
        $stats = [
            'patients' => [
                'total' => 1248,
                'trend' => 12,
                'is_positive' => true
            ],
            'appointments' => [
                'today' => 24,
                'trend' => 8,
                'is_positive' => true
            ],
            'inventory' => [
                'total' => 156,
                'trend' => 3,
                'is_positive' => false
            ],
            'staff' => [
                'total' => 18,
                'trend' => 0,
                'is_positive' => true
            ]
        ];

        return response()->json($stats);
    }

    /**
     * Get queue updates for the dashboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getQueueUpdates()
    {
        // Sample data - in a real application, you would fetch this from your database
        $queue = [
            'current' => 5,
            'waiting' => 8,
            'completed' => 12
        ];

        return response()->json($queue);
    }

    /**
     * Get appointment updates for the dashboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAppointmentUpdates()
    {
        // Sample data - in a real application, you would fetch this from your database
        $appointments = [
            'today' => [
                'total' => 24,
                'completed' => 10,
                'upcoming' => 14
            ],
            'tomorrow' => [
                'total' => 18
            ],
            'this_week' => [
                'total' => 86
            ]
        ];
        return response()->json($appointments);
    }

    /**
     * Calculate system health percentage
     */
    private function calculateSystemHealth()
    {
        $healthScore = 100;
        
        // Check database connectivity
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $healthScore -= 20;
        }
        
        // Check for low stock items (reduce health if more than 20% are low stock)
        $totalItems = inventory::count();
        $lowStockItems = inventory::whereHas('stock', function($query) {
            $query->where('stocks', '<=', 10);
        })->count();
        
        if ($totalItems > 0) {
            $lowStockPercentage = ($lowStockItems / $totalItems) * 100;
            if ($lowStockPercentage > 20) {
                $healthScore -= 15;
            }
        }
        
        // Check for expired items
        $expiredItems = inventory::whereNotNull('expiry_date')
            ->where('expiry_date', '!=', 'N/A')
            ->where('expiry_date', '<', now())
            ->count();
            
        if ($expiredItems > 0) {
            $healthScore -= 10;
        }
        
        // Check for pending appointments (if too many, reduce health)
        $pendingAppointments = appointments::where('status', 'pending')->count();
        if ($pendingAppointments > 50) {
            $healthScore -= 5;
        }
        
        return max(0, min(100, $healthScore));
    }

    /**
     * Calculate inventory trend
     */
    private function calculateInventoryTrend()
    {
        $currentMonth = inventory::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $previousMonth = inventory::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
            
        if ($previousMonth == 0) return 0;
        
        return round((($currentMonth - $previousMonth) / $previousMonth) * 100, 2);
    }

    /**
     * Calculate prescription trend
     */
    private function calculatePrescriptionTrend()
    {
        $currentWeek = Prescription::whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ])->count();
        
        $previousWeek = Prescription::whereBetween('created_at', [
            now()->subWeek()->startOfWeek(),
            now()->subWeek()->endOfWeek()
        ])->count();
        
        if ($previousWeek == 0) return 0;
        
        return round((($currentWeek - $previousWeek) / $previousWeek) * 100, 2);
    }

    /**
     * Get recent activities for the dashboard
     */
    private function getRecentActivities()
    {
        try {
            $activities = collect();
            
            // Get recent appointments
        $recentAppointments = appointments::with(['servicetypes'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($appointment) {
                $patientName = $appointment->user_id 
                    ? 'Registered Patient'
                    : ($appointment->firstname . ' ' . $appointment->lastname);
                
                $serviceName = $appointment->servicetypes ? $appointment->servicetypes->servicename : 'General Checkup';
                
                return [
                    'id' => 'appointment_' . $appointment->id,
                    'type' => 'appointment',
                    'title' => 'New Appointment',
                    'description' => "{$patientName} scheduled {$serviceName}",
                    'timestamp' => $appointment->created_at,
                    'icon' => 'Calendar',
                    'status' => $appointment->status,
                    'color' => $this->getActivityColor('appointment', $appointment->status),
                    'priority' => $this->getPriority($appointment->status),
                    'action_url' => route('admin.appointments'),
                    'action_text' => 'View Details',
                    'badge_text' => $this->getStatusText($appointment->status),
                    'time_ago' => $appointment->created_at->diffForHumans()
                ];
            });
        
        $activities = $activities->merge($recentAppointments);
        
        // Get recent stock movements
        $recentStockMovements = istock_movements::with(['inventory'])
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function($movement) {
                $staffName = 'Staff Member';
                
                return [
                    'id' => 'stock_' . $movement->id,
                    'type' => 'inventory',
                    'title' => 'Stock Movement',
                    'description' => "{$staffName} {$movement->movement_type} {$movement->quantity} units of {$movement->inventory_name}",
                    'timestamp' => $movement->created_at,
                    'icon' => $movement->movement_type === 'add' ? 'Package' : 'TrendingDown',
                    'status' => 'completed',
                    'color' => $this->getActivityColor('inventory', $movement->movement_type),
                    'priority' => 'medium',
                    'action_url' => route('pharmacist.inventory'),
                    'action_text' => 'View Inventory',
                    'badge_text' => ucfirst($movement->movement_type),
                    'time_ago' => $movement->created_at->diffForHumans()
                ];
            });
        
        $activities = $activities->merge($recentStockMovements);
        
        // Get recent prescriptions
        $recentPrescriptions = Prescription::orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function($prescription) {
                $patientName = 'Patient';
                $doctorName = 'Doctor';
                
                return [
                    'id' => 'prescription_' . $prescription->id,
                    'type' => 'prescription',
                    'title' => 'New Prescription',
                    'description' => "Dr. {$doctorName} prescribed medication for {$patientName}",
                    'timestamp' => $prescription->created_at,
                    'icon' => 'Pill',
                    'status' => $prescription->status,
                    'color' => $this->getActivityColor('prescription', $prescription->status),
                    'priority' => $this->getPriority($prescription->status),
                    'action_url' => route('admin.prescriptions'),
                    'action_text' => 'View Prescription',
                    'badge_text' => $this->getStatusText($prescription->status),
                    'time_ago' => $prescription->created_at->diffForHumans()
                ];
            });
        
        $activities = $activities->merge($recentPrescriptions);
        
        // Get recent user registrations
        $recentUsers = User::whereIn('roleID', [2, 3, 6, 7]) // Patients, Doctors, Pharmacists, Admins
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function($user) {
                $roleNames = [
                    2 => 'Patient',
                    3 => 'Doctor', 
                    6 => 'Pharmacist',
                    7 => 'Admin'
                ];
                
                $roleName = $roleNames[$user->roleID] ?? 'User';
                
                return [
                    'id' => 'user_' . $user->id,
                    'type' => 'user',
                    'title' => 'New User Registration',
                    'description' => "{$user->firstname} {$user->lastname} registered as {$roleName}",
                    'timestamp' => $user->created_at,
                    'icon' => 'User',
                    'status' => 'completed',
                    'color' => $this->getActivityColor('user', 'registration'),
                    'priority' => 'low',
                    'action_url' => route('admin.staff'),
                    'action_text' => 'View Staff',
                    'badge_text' => 'New',
                    'time_ago' => $user->created_at->diffForHumans()
                ];
            });
        
        $activities = $activities->merge($recentUsers);
        
            // Sort by timestamp and limit to 10 most recent
            return $activities->sortByDesc('timestamp')->take(10)->values();
        } catch (\Exception $e) {
            // Log the error and return empty collection
            \Log::error('Error fetching recent activities: ' . $e->getMessage());
            return collect();
        }
    }
    
    /**
     * Get activity color based on type and status
     */
    private function getActivityColor($type, $status)
    {
        $colors = [
            'appointment' => [
                'pending' => 'blue',
                'confirmed' => 'green',
                'completed' => 'emerald',
                'cancelled' => 'red',
                'default' => 'blue'
            ],
            'inventory' => [
                'add' => 'green',
                'reduce' => 'orange',
                'default' => 'blue'
            ],
            'prescription' => [
                'pending' => 'yellow',
                'dispensed' => 'green',
                'cancelled' => 'red',
                'default' => 'blue'
            ],
            'user' => [
                'registration' => 'purple',
                'default' => 'blue'
            ]
        ];
        
        return $colors[$type][$status] ?? $colors[$type]['default'] ?? 'blue';
    }
    
    /**
     * Get priority level for activity
     */
    private function getPriority($status)
    {
        $priorities = [
            'pending' => 'high',
            'confirmed' => 'medium',
            'completed' => 'low',
            'cancelled' => 'medium',
            'dispensed' => 'low',
            'default' => 'low'
        ];
        
        return $priorities[$status] ?? 'low';
    }
    
    /**
     * Get human-readable status text
     */
    private function getStatusText($status)
    {
        $statusTexts = [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'dispensed' => 'Dispensed',
            'default' => 'Active'
        ];
        
        return $statusTexts[$status] ?? 'Active';
    }
}

