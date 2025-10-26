import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Package,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Clock,
    Users,
    Activity,
    BarChart3,
    Calendar,
    FileText,
    Bell,
    AlertCircle,
    CheckCircle,
    XCircle,
    Info,
    PieChart,
    LineChart,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    RefreshCw,
    Zap,
    Shield,
    Target,
    Sparkles,
    Volume2,
    VolumeX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Button } from "@/components/tempo/components/ui/button";
import StockAlertPanel from "@/Components/StockAlertPanel";
import useStockAlerts from "@/hooks/useStockAlerts";

export default function PharmacistDashboard({ 
    stats = {}, 
    trendChanges = {},
    categoryBreakdown = [], 
    systemAlerts = [], 
    recentActivities = [],
    inventoryItems = []
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showAlertPanel, setShowAlertPanel] = useState(false);
    
    // Stock alert system
    const {
        alerts,
        isAudioEnabled,
        checkMultipleItems,
        toggleAudio,
        getStockLevelStatus,
        getStockLevelColor,
        getStockLevelIcon
    } = useStockAlerts();
    
    // Real-time clock effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Stock monitoring effect
    useEffect(() => {
        if (inventoryItems && inventoryItems.length > 0) {
            // Check all inventory items for stock levels
            checkMultipleItems(inventoryItems);
        }
    }, [inventoryItems, checkMultipleItems]);

    // Auto-check stock levels every 5 minutes
    useEffect(() => {
        const stockCheckInterval = setInterval(() => {
            if (inventoryItems && inventoryItems.length > 0) {
                checkMultipleItems(inventoryItems);
            }
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(stockCheckInterval);
    }, [inventoryItems, checkMultipleItems]);
    
    // Add custom scrollbar styles
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .scrollbar-thin {
                scrollbar-width: thin;
            }
            .scrollbar-thin::-webkit-scrollbar {
                width: 6px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 3px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    
    // Use real data from props, with fallbacks
    const dashboardStats = [
        {
            title: "Total Items",
            value: stats.totalItems?.toLocaleString() || "0",
            change: `${trendChanges.totalItemsChange >= 0 ? '+' : ''}${trendChanges.totalItemsChange || 0}%`,
            changeType: trendChanges.totalItemsChange >= 0 ? "positive" : "negative",
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Low Stock Items",
            value: stats.lowStockItems?.toString() || "0",
            change: `${trendChanges.lowStockChange >= 0 ? '+' : ''}${trendChanges.lowStockChange || 0}%`,
            changeType: trendChanges.lowStockChange >= 0 ? "negative" : "positive",
            icon: AlertTriangle,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            title: "Expiring Soon Items",
            value: stats.expiringSoon?.toString() || "0",
            change: `${trendChanges.expiringSoonChange >= 0 ? '+' : ''}${trendChanges.expiringSoonChange || 0}%`,
            changeType: trendChanges.expiringSoonChange >= 0 ? "positive" : "negative",
            icon: Clock,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "Monthly Dispensed",
            value: stats.monthlyDispensed?.toLocaleString() || "0",
            change: `${trendChanges.monthlyDispensedChange >= 0 ? '+' : ''}${trendChanges.monthlyDispensedChange || 0}%`,
            changeType: trendChanges.monthlyDispensedChange >= 0 ? "positive" : "negative",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case "Incoming":
                return <Package className="h-4 w-4 text-green-600" />;
            case "Outgoing":
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            case "Dispense":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            default:
                return <Activity className="h-4 w-4 text-gray-600" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case "Incoming":
                return "bg-green-50 border-green-200";
            case "Outgoing":
                return "bg-red-50 border-red-200";
            case "Dispense":
                return "bg-green-50 border-green-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    return (
        <AdminLayout header="Pharmacist Dashboard">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Modern Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-2xl"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                    
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                                <Sparkles className="h-8 w-8 text-yellow-300" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Welcome back, {user?.firstname}! 👋
                                </h1>
                                <p className="text-blue-100 text-lg">
                                    Here's your pharmacy dashboard overview
                                </p>
                            </div>
                        </div>
                        
                        <div className="hidden md:block text-right">
                            <div className="flex items-center gap-4">
                                {/* Stock Alert Button */}
                                <div className="relative">
                                    <Button
                                        onClick={() => setShowAlertPanel(true)}
                                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                    >
                                        <Bell className="h-4 w-4 mr-2" />
                                        Stock Alerts
                                        {alerts.length > 0 && (
                                            <Badge className="ml-2 bg-red-500 text-white text-xs">
                                                {alerts.length}
                                            </Badge>
                                        )}
                                    </Button>
                                    {alerts.length > 0 && (
                                        <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                                
                                {/* Audio Toggle */}
                                <Button
                                    onClick={toggleAudio}
                                    variant="ghost"
                                    size="sm"
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                                >
                                    {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                </Button>
                                
                                {/* Time Display */}
                                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-blue-100" />
                                        <p className="text-blue-100 text-sm font-medium">Current Date & Time</p>
                                    </div>
                                    <p className="text-white text-lg font-bold">
                                        {currentTime.toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <p className="text-blue-100 text-sm font-semibold">
                                        {currentTime.toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Modern Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group"
                        >
                            <Card className="relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:shadow-blue-500/10">
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                
                                <CardHeader className="pb-3 relative">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                            <stat.icon className="h-4 w-4" />
                                            {stat.title}
                                        </CardTitle>
                                        <div className={`p-2 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                                            {stat.value}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {stat.changeType === "positive" ? (
                                                <ArrowUpRight className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={stat.changeType === "positive" ? "default" : "destructive"}
                                            className={`text-xs font-medium px-2 py-1 ${
                                                stat.changeType === "positive" 
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                            }`}
                                        >
                                            {stat.change}
                                        </Badge>
                                        <span className="text-xs text-gray-500 font-medium">
                                            vs last month
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Modern Recent Activities */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                        <div className="p-2 rounded-xl bg-blue-100">
                                            <Activity className="h-6 w-6 text-blue-600" />
                                        </div>
                                        Recent Activities
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">Live</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 space-y-3 pr-2">
                                    {recentActivities.map((activity, index) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.1,
                                            }}
                                            className={`group p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${getActivityColor(
                                                activity.type
                                            )} hover:scale-[1.02]`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl ${getActivityColor(activity.type)} group-hover:scale-110 transition-transform duration-300`}>
                                                        {getActivityIcon(activity.type)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-lg">
                                                            {activity.item}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-sm text-gray-600 font-medium">
                                                                Quantity: {activity.quantity}
                                                            </span>
                                                            <Badge className={`text-xs ${
                                                                activity.type === 'Dispense' 
                                                                    ? 'bg-green-100 text-green-700' 
                                                                    : activity.type === 'Incoming'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}>
                                                                {activity.type}
                                                            </Badge>
                                                        </div>
                                                        {activity.type === 'Dispense' && activity.patient_name && (
                                                            <div className="mt-1">
                                                                <span className="text-xs text-gray-500">
                                                                    Patient: {activity.patient_name}
                                                                </span>
                                                                {activity.prescription_number && (
                                                                    <span className="text-xs text-gray-500 ml-2">
                                                                        RX: {activity.prescription_number}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        {activity.timestamp}
                                                    </p>
                                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {activity.user}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Modern System Alerts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                        <div className="p-2 rounded-xl bg-amber-100">
                                            <Bell className="h-6 w-6 text-amber-600" />
                                        </div>
                                        System Alerts
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-500">{systemAlerts.length}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
                                <div className="space-y-3">
                                    {systemAlerts.map((alert, index) => {
                                        const getAlertIcon = () => {
                                            switch (alert.type) {
                                                case "warning":
                                                    return <AlertTriangle className="h-5 w-5 text-amber-600" />;
                                                case "error":
                                                    return <XCircle className="h-5 w-5 text-red-600" />;
                                                case "success":
                                                    return <CheckCircle className="h-5 w-5 text-green-600" />;
                                                case "info":
                                                default:
                                                    return <Info className="h-5 w-5 text-blue-600" />;
                                            }
                                        };

                                        const getPriorityBadge = () => {
                                            switch (alert.priority) {
                                                case "high":
                                                    return <Badge className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1">High</Badge>;
                                                case "medium":
                                                    return <Badge className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1">Medium</Badge>;
                                                case "low":
                                                default:
                                                    return <Badge className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1">Low</Badge>;
                                            }
                                        };

                                        const getAlertBgColor = () => {
                                            switch (alert.type) {
                                                case "warning":
                                                    return "bg-amber-50 border-amber-200 hover:bg-amber-100";
                                                case "error":
                                                    return "bg-red-50 border-red-200 hover:bg-red-100";
                                                case "success":
                                                    return "bg-green-50 border-green-200 hover:bg-green-100";
                                                case "info":
                                                default:
                                                    return "bg-blue-50 border-blue-200 hover:bg-blue-100";
                                            }
                                        };

                                        return (
                                            <motion.div
                                                key={alert.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className={`group p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${getAlertBgColor()}`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl ${getAlertBgColor()} group-hover:scale-110 transition-transform duration-300`}>
                                                        {getAlertIcon()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="font-semibold text-gray-900 text-lg">{alert.title}</p>
                                                            {getPriorityBadge()}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{alert.message}</p>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                            <p className="text-xs text-gray-500 font-medium">{alert.timestamp}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Compact Category Breakdown */}
                <div className="mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
                                    <div className="p-2 rounded-lg bg-purple-100">
                                        <PieChart className="h-5 w-5 text-purple-600" />
                                    </div>
                                    Category Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {categoryBreakdown.map((category, index) => (
                                        <motion.div
                                            key={category.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="group p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-4 h-4 rounded-lg shadow-sm"
                                                        style={{ backgroundColor: category.color }}
                                                    ></div>
                                                    <div>
                                                        <span className="font-semibold text-gray-900 text-sm">{category.name}</span>
                                                        <p className="text-xs text-gray-500">{category.count} items</p>
                                                    </div>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900">{category.value}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${category.value}%` }}
                                                    transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                ></motion.div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Compact Visual representation */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex h-4 bg-white rounded-full overflow-hidden shadow-inner">
                                        {categoryBreakdown.map((category, index) => (
                                            <motion.div
                                                key={category.name}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${category.value}%` }}
                                                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                                                className="h-full relative group"
                                                style={{ backgroundColor: category.color }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
            
            {/* Stock Alert Panel */}
            <StockAlertPanel 
                isOpen={showAlertPanel} 
                onClose={() => setShowAlertPanel(false)} 
            />
        </AdminLayout>
    );
}

