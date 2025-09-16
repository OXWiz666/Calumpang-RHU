import React from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Badge } from "@/components/tempo/components/ui/badge";

export default function PharmacistDashboard({ 
    stats = {}, 
    categoryBreakdown = [], 
    inventoryTrends = [], 
    systemAlerts = [], 
    recentActivities = [] 
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    
    // Use real data from props, with fallbacks
    const dashboardStats = [
        {
            title: "Total Items",
            value: stats.totalItems?.toLocaleString() || "0",
            change: "+12%",
            changeType: "positive",
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Low Stock Items",
            value: stats.lowStockItems?.toString() || "0",
            change: "-5%",
            changeType: "negative",
            icon: AlertTriangle,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            title: "Expiring Soon",
            value: stats.expiringSoon?.toString() || "0",
            change: "+2%",
            changeType: "positive",
            icon: Clock,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "Monthly Dispensed",
            value: stats.monthlyDispensed?.toLocaleString() || "0",
            change: "+18%",
            changeType: "positive",
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
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Welcome back, {user?.firstname} {user?.lastname}!
                                </h1>
                            <p className="text-gray-600">
                                Here's what's happening with your inventory today.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Today's Date</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date().toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-md transition-all duration-300 border-gray-100 hover:shadow-gray-200/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                                        <stat.icon className="h-4 w-4" />
                                        {stat.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {stat.value}
                                        </div>
                                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge
                                            variant={
                                                stat.changeType === "positive"
                                                    ? "default"
                                                    : "destructive"
                                            }
                                            className="text-xs"
                                        >
                                            {stat.change}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            from last month
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activities */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recent Activities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: activity.id * 0.1,
                                            }}
                                            className={`p-4 rounded-lg border ${getActivityColor(
                                                activity.type
                                            )}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getActivityIcon(activity.type)}
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {activity.item}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity: {activity.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">
                                                        {activity.timestamp}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
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

                    {/* System Alerts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    System Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {systemAlerts.map((alert) => {
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
                                                return <Badge className="bg-red-100 text-red-800 text-xs">High</Badge>;
                                            case "medium":
                                                return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>;
                                            case "low":
                                            default:
                                                return <Badge className="bg-green-100 text-green-800 text-xs">Low</Badge>;
                                        }
                                    };

                                    return (
                                        <motion.div
                                            key={alert.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: alert.id * 0.1 }}
                                            className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                {getAlertIcon()}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-gray-900">{alert.title}</p>
                                                        {getPriorityBadge()}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                                                    <p className="text-xs text-gray-400">{alert.timestamp}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Category Breakdown and Inventory Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Category Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5" />
                                    Category Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {categoryBreakdown.map((category, index) => (
                                        <motion.div
                                            key={category.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                                                <span className="font-medium text-gray-900">{category.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600">{category.count} items</span>
                                                <span className="text-sm font-medium text-gray-900">{category.value}%</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Visual representation */}
                                <div className="mt-6">
                                    <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                                        {categoryBreakdown.map((category, index) => (
                                            <motion.div
                                                key={category.name}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${category.value}%` }}
                                                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                                                className={`${category.color} h-full`}
                                            ></motion.div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Inventory Trends */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LineChart className="h-5 w-5" />
                                    Inventory Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Legend */}
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-600">Dispensed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-gray-600">Received</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                            <span className="text-gray-600">Stock</span>
                                        </div>
                                    </div>

                                    {/* Graph representation */}
                                    <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                                        {/* Y-axis labels */}
                                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                                            {(() => {
                                                const maxValue = Math.max(...inventoryTrends.map(t => Math.max(t.dispensed, t.received, t.stock)));
                                                const steps = 5;
                                                const stepValue = maxValue / steps;
                                                return Array.from({ length: steps + 1 }, (_, i) => (
                                                    <div key={i} className="text-right">
                                                        {Math.round(maxValue - (i * stepValue)).toLocaleString()}
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                        
                                        {/* Graph area */}
                                        <div className="ml-12 h-full relative">
                                            {/* Grid lines */}
                                            <div className="absolute inset-0 flex flex-col justify-between">
                                                {Array.from({ length: 6 }, (_, i) => (
                                                    <div key={i} className="border-t border-gray-200"></div>
                                                ))}
                                            </div>
                                            
                                            {/* Data points and lines */}
                                            <div className="relative h-full flex items-end justify-between px-2">
                                                {inventoryTrends.map((trend, index) => {
                                                    const maxValue = Math.max(...inventoryTrends.map(t => Math.max(t.dispensed, t.received, t.stock)));
                                                    const dispensedHeight = (trend.dispensed / maxValue) * 100;
                                                    const receivedHeight = (trend.received / maxValue) * 100;
                                                    const stockHeight = (trend.stock / maxValue) * 100;
                                                    
                                                    return (
                                                        <motion.div
                                                            key={trend.month}
                                                            initial={{ opacity: 0, scaleY: 0 }}
                                                            animate={{ opacity: 1, scaleY: 1 }}
                                                            transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                                                            className="flex flex-col items-center gap-1 relative"
                                                        >
                                                            {/* Stock line (purple) */}
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: `${stockHeight}%` }}
                                                                transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                                                                className="w-1 bg-purple-500 rounded-t"
                                                                style={{ minHeight: '2px' }}
                                                            ></motion.div>
                                                            
                                                            {/* Received bar (green) */}
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: `${receivedHeight}%` }}
                                                                transition={{ duration: 0.8, delay: 1.1 + index * 0.1 }}
                                                                className="w-3 bg-green-500 rounded-t"
                                                                style={{ minHeight: '2px' }}
                                                            ></motion.div>
                                                            
                                                            {/* Dispensed bar (blue) */}
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: `${dispensedHeight}%` }}
                                                                transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                                                                className="w-3 bg-blue-500 rounded-t"
                                                                style={{ minHeight: '2px' }}
                                                            ></motion.div>
                                                            
                                                            {/* Month label */}
                                                            <div className="text-xs text-gray-600 mt-2 font-medium">
                                                                {trend.month}
                                                            </div>
                                                            
                                                            {/* Tooltip on hover */}
                                                            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                                <div>Disp: {trend.dispensed.toLocaleString()}</div>
                                                                <div>Recv: {trend.received.toLocaleString()}</div>
                                                                <div>Stock: {trend.stock.toLocaleString()}</div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        
                                        {/* X-axis */}
                                        <div className="absolute bottom-0 left-12 right-0 h-6 border-t border-gray-300"></div>
                                    </div>

                                    {/* Summary stats */}
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {inventoryTrends.reduce((sum, trend) => sum + trend.dispensed, 0).toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-600">Total Dispensed</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {inventoryTrends.reduce((sum, trend) => sum + trend.received, 0).toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-600">Total Received</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-purple-600">
                                                    {inventoryTrends[inventoryTrends.length - 1].stock.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-600">Current Stock</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
