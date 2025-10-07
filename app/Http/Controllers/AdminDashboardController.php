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
        
        // Get real admin data
        $totalPatients = User::where('roleID', '7')->count();
        $currentMonthPatients = User::where('roleID', '7')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $previousMonthPatients = User::where('roleID', '7')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        
        // Calculate patient growth percentage
        $max = max($previousMonthPatients, $currentMonthPatients);
        $patientGrowthPercentage = $max == 0 ? 0 : ($currentMonthPatients - $previousMonthPatients) / $max * 100;
        
        // Get real appointment data
        $todayAppointments = appointments::whereDate('date', now()->toDateString())->count();
        $yesterdayAppointments = appointments::whereDate('date', now()->subDay()->toDateString())->count();
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
        
        // Get real staff data
        $totalStaff = User::whereIn('roleID', ['1', '2', '3', '4'])->count(); // Doctor, Nurse, Admin, etc.
        $activeStaff = User::whereIn('roleID', ['1', '2', '3', '4'])
            ->where('status', 'active')
            ->count();
        $staffOnLeave = $totalStaff - $activeStaff;
        
        // Get real program data
        $activePrograms = program_schedules::where('status', 'Active')->count();
        $totalPrograms = program_schedules::count();
        
        // Get real prescription data
        $totalPrescriptions = Prescription::count();
        $pendingPrescriptions = Prescription::where('status', 'pending')->count();
        $dispensedPrescriptions = Prescription::where('status', 'dispensed')->count();
        
        // Get system health metrics
        $systemHealth = $this->calculateSystemHealth();
        
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
            'dashboardData' => $dashboardData
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
}
