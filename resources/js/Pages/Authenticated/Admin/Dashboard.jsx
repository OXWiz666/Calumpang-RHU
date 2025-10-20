import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatisticsOverview from "@/components/tempo/admin/include/StatisticsOverview";
import ModuleCards from "@/components/tempo/admin/include/ModuleCards";
import ActivityFeed from "@/components/tempo/admin/include/ActivityFeed";
import AdminLayout from "@/Layouts/AdminLayout";
import { usePage, router } from "@inertiajs/react";
import { 
    Bell, 
    User, 
    Search, 
    TrendingUp, 
    TrendingDown, 
    Users, 
    Calendar, 
    Activity, 
    Package, 
    Shield, 
    BarChart3, 
    Clock, 
    CheckCircle, 
    AlertTriangle,
    RefreshCw,
    Eye,
    Settings,
    Database,
    FileText,
    Heart,
    Stethoscope,
    Pill,
    UserCheck,
    ArrowRight,
    Sparkles,
    Zap
} from "lucide-react";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Progress } from "@/components/tempo/components/ui/progress";

export default function Dashboard({ totalPatients, patientGrowthPercentage, dashboardData, recentActivities }) {
    const notifs = usePage().props.auth.notifications;

    // Sample data for testing if backend data is not available
    const sampleActivities = [
        {
            id: 'sample_1',
            type: 'appointment',
            title: 'New Appointment',
            description: 'John Doe scheduled General Checkup',
            timestamp: new Date(),
            icon: 'Calendar',
            status: 'pending',
            color: 'blue',
            priority: 'high',
            action_url: '/admin/appointments',
            action_text: 'View Details',
            badge_text: 'Pending',
            time_ago: '2 minutes ago'
        },
        {
            id: 'sample_2',
            type: 'inventory',
            title: 'Stock Movement',
            description: 'Staff Member added 50 units of Paracetamol',
            timestamp: new Date(Date.now() - 300000),
            icon: 'Package',
            status: 'completed',
            color: 'green',
            priority: 'medium',
            action_url: '/pharmacist/inventory',
            action_text: 'View Inventory',
            badge_text: 'Add',
            time_ago: '5 minutes ago'
        },
        {
            id: 'sample_3',
            type: 'user',
            title: 'New User Registration',
            description: 'Jane Smith registered as Doctor',
            timestamp: new Date(Date.now() - 600000),
            icon: 'User',
            status: 'completed',
            color: 'purple',
            priority: 'low',
            action_url: '/admin/staff',
            action_text: 'View Staff',
            badge_text: 'New',
            time_ago: '10 minutes ago'
        }
    ];

    const [activities, setActivities] = useState(recentActivities && recentActivities.length > 0 ? recentActivities : sampleActivities);
    
    // Debug: Log activities data
    useEffect(() => {
        console.log('Recent Activities Data:', recentActivities);
        console.log('Activities State:', activities);
        if (!recentActivities || recentActivities.length === 0) {
            console.log('Using sample data for testing');
        }
    }, [recentActivities, activities]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    const [patients, setPatients] = useState({
        total: totalPatients,
        growth: patientGrowthPercentage,
    });

    // Use real data from backend
    const [dashboardStats, setDashboardStats] = useState(dashboardData || {
        patients: {
            total: totalPatients || 0,
            growth: patientGrowthPercentage || 0,
            trend: (patientGrowthPercentage || 0) >= 0 ? 'up' : 'down'
        },
        appointments: {
            today: 0,
            pending: 0,
            completed: 0,
            trend: 0
        },
        inventory: {
            total: 0,
            lowStock: 0,
            expiring: 0,
            trend: 0
        },
        staff: {
            total: 0,
            active: 0,
            onLeave: 0,
            trend: 0
        },
        programs: {
            active: 0,
            total: 0,
            trend: 0
        },
        prescriptions: {
            total: 0,
            pending: 0,
            dispensed: 0,
            trend: 0
        },
        systemHealth: 98
    });

    const { auth } = usePage().props;
    const [datas_, setDatas] = useState(auth);
    
    useEffect(() => {
        setActivities(notifs);
    }, [auth]);

    // Real-time clock effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const refreshDashboard = async () => {
        setIsRefreshing(true);
        try {
            // Simulate API call - replace with actual endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Here you would typically fetch fresh data
            setIsRefreshing(false);
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
            setIsRefreshing(false);
        }
    };

    return (
        <AdminLayout
            header="Dashboard"
            //datas={datas_}
        >
            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {/* Modern Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-2xl"
                >
                    {/* Background Pattern */}
                    <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}
                    ></div>
                    
                    <div className="relative flex justify-between items-center">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                        Admin Dashboard
                                    </h1>
                                    <p className="text-blue-100 text-lg">Calumpang Rural Health Unit Management System</p>
                                    <p className="text-blue-200 text-sm">Barangay Calumpang, General Santos City</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-blue-100">
                                    <Activity className="h-5 w-5" />
                                    <span className="text-sm font-medium">Real-time Monitoring</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-100">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">System Health: Good</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-100">
                                    <Database className="h-5 w-5" />
                                    <span className="text-sm font-medium">Data Synced</span>
                                </div>
                            </div>
                            
                            {/* Real-time Clock */}
                            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-100 font-medium">Current Date & Time</p>
                                        <p className="text-xl font-bold text-white">
                                            {currentTime.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-lg font-semibold text-blue-100">
                                            {currentTime.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={refreshDashboard}
                                    disabled={isRefreshing}
                                    variant="outline"
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Statistics Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <StatisticsOverview 
                        patients={patients} 
                        dashboardData={dashboardStats}
                    />
                </motion.div>

                {/* Quick Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* Total Patients */}
                    <Card className="group border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700">Total Patients</p>
                                    <p className="text-3xl font-bold text-green-800">{dashboardStats.patients?.total || 0}</p>
                                    <div className="flex items-center mt-2">
                                        {dashboardStats.patients?.growth >= 0 ? (
                                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                                        )}
                                        <span className={`text-xs ${dashboardStats.patients?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {dashboardStats.patients?.growth >= 0 ? '+' : ''}{Math.abs(dashboardStats.patients?.growth || 0)}% this month
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-green-500 text-white group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inventory Status */}
                    <Card className="group border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-700">Inventory Items</p>
                                    <p className="text-3xl font-bold text-orange-800">{dashboardStats.inventory?.total || 0}</p>
                                    <div className="flex items-center mt-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-600 mr-1" />
                                        <span className="text-xs text-orange-600">{dashboardStats.inventory?.lowStock || 0} low stock</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-orange-500 text-white group-hover:scale-110 transition-transform">
                                    <Package className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Staff Status */}
                    <Card className="group border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-700">Active Staff</p>
                                    <p className="text-3xl font-bold text-purple-800">{dashboardStats.staff?.active || 0}</p>
                                    <div className="flex items-center mt-2">
                                        <UserCheck className="h-4 w-4 text-purple-600 mr-1" />
                                        <span className="text-xs text-purple-600">{dashboardStats.staff?.onLeave || 0} on leave</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-purple-500 text-white group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prescriptions */}
                    <Card className="group border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700">Prescriptions</p>
                                    <p className="text-3xl font-bold text-blue-800">{dashboardStats.prescriptions?.total || 0}</p>
                                    <div className="flex items-center mt-2">
                                        <Clock className="h-4 w-4 text-blue-600 mr-1" />
                                        <span className="text-xs text-blue-600">{dashboardStats.prescriptions?.pending || 0} pending</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-500 text-white group-hover:scale-110 transition-transform">
                                    <Pill className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Module Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <ModuleCards dashboardData={dashboardStats} />
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <ActivityFeed 
                        activities={activities} 
                        title="Recent Activities"
                        maxItems={6}
                    />
                </motion.div>
            </motion.div>
        </AdminLayout>
    );
}
