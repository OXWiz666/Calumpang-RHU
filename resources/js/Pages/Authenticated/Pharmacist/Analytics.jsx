import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    TrendingUp,
    TrendingDown,
    Package,
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    Filter,
    Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import { Badge } from "@/components/tempo/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

export default function PharmacistAnalytics() {
    const [timeRange, setTimeRange] = useState("30d");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Mock analytics data
    const analyticsData = {
        overview: {
            totalItems: 1247,
            totalValue: 45680,
            monthlyDispensed: 2340,
            lowStockItems: 23,
        },
        trends: [
            { month: "Jan", dispensed: 1200, restocked: 800 },
            { month: "Feb", dispensed: 1350, restocked: 900 },
            { month: "Mar", dispensed: 1500, restocked: 1000 },
            { month: "Apr", dispensed: 1650, restocked: 1100 },
            { month: "May", dispensed: 1800, restocked: 1200 },
            { month: "Jun", dispensed: 1950, restocked: 1300 },
        ],
        topItems: [
            { name: "Paracetamol 500mg", dispensed: 450, value: 2250 },
            { name: "Amoxicillin 250mg", dispensed: 380, value: 1900 },
            { name: "Ibuprofen 400mg", dispensed: 320, value: 1600 },
            { name: "Aspirin 100mg", dispensed: 280, value: 1400 },
            { name: "Metformin 500mg", dispensed: 250, value: 1250 },
        ],
        categoryBreakdown: [
            { category: "Pain Relief", count: 45, percentage: 35 },
            { category: "Antibiotics", count: 32, percentage: 25 },
            { category: "Vitamins", count: 28, percentage: 22 },
            { category: "Chronic Care", count: 23, percentage: 18 },
        ],
    };

    const getTrendIcon = (value, previousValue) => {
        if (value > previousValue) {
            return <TrendingUp className="h-4 w-4 text-green-600" />;
        } else if (value < previousValue) {
            return <TrendingDown className="h-4 w-4 text-red-600" />;
        }
        return <Activity className="h-4 w-4 text-gray-600" />;
    };

    const getTrendColor = (value, previousValue) => {
        if (value > previousValue) {
            return "text-green-600";
        } else if (value < previousValue) {
            return "text-red-600";
        }
        return "text-gray-600";
    };

    return (
        <AdminLayout header="Analytics">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Header with Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Inventory Analytics
                        </h1>
                        <p className="text-gray-600">
                            Track performance and trends in your pharmacy inventory
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Time Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                                <SelectItem value="90d">Last 90 days</SelectItem>
                                <SelectItem value="1y">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="pain">Pain Relief</SelectItem>
                                <SelectItem value="antibiotics">Antibiotics</SelectItem>
                                <SelectItem value="vitamins">Vitamins</SelectItem>
                                <SelectItem value="chronic">Chronic Care</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="hover:shadow-md transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                                    <Package className="h-4 w-4" />
                                    Total Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {analyticsData.overview.totalItems.toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {getTrendIcon(1247, 1200)}
                                        <span className="text-sm text-green-600">+3.9%</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Across all categories
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="hover:shadow-md transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                                    <BarChart3 className="h-4 w-4" />
                                    Total Value
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-gray-900">
                                        ₱{analyticsData.overview.totalValue.toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {getTrendIcon(45680, 42000)}
                                        <span className="text-sm text-green-600">+8.7%</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Current inventory value
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="hover:shadow-md transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                                    <TrendingUp className="h-4 w-4" />
                                    Monthly Dispensed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {analyticsData.overview.monthlyDispensed.toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {getTrendIcon(2340, 2100)}
                                        <span className="text-sm text-green-600">+11.4%</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Items dispensed this month
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card className="hover:shadow-md transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                                    <Activity className="h-4 w-4" />
                                    Low Stock Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {analyticsData.overview.lowStockItems}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {getTrendIcon(23, 28)}
                                        <span className="text-sm text-green-600">-17.9%</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Need restocking
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dispensing Trends */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Dispensing Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData.trends.map((trend, index) => (
                                        <div key={trend.month} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 text-sm font-medium text-gray-600">
                                                    {trend.month}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <span className="text-sm text-gray-600">Dispensed</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${(trend.dispensed / 2000) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {trend.dispensed}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

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
                                    {analyticsData.categoryBreakdown.map((category, index) => (
                                        <div key={category.category} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{
                                                        backgroundColor: [
                                                            "#3B82F6",
                                                            "#10B981",
                                                            "#F59E0B",
                                                            "#EF4444",
                                                        ][index],
                                                    }}
                                                ></div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {category.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">
                                                    {category.count} items
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {category.percentage}%
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Top Items Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Top Dispensed Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                Item Name
                                            </th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                Quantity Dispensed
                                            </th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                Total Value
                                            </th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                Trend
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData.topItems.map((item, index) => (
                                            <tr key={item.name} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium text-gray-900">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    {item.dispensed}
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    ₱{item.value.toLocaleString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm text-green-600">+12%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AdminLayout>
    );
}
