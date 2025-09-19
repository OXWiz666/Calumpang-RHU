import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    FileText,
    Download,
    Calendar,
    Filter,
    Search,
    Package,
    TrendingUp,
    AlertTriangle,
    Clock,
    BarChart3,
    Printer,
    Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

export default function PharmacistReports() {
    const [selectedReport, setSelectedReport] = useState("");
    const [dateRange, setDateRange] = useState("30d");
    const [searchTerm, setSearchTerm] = useState("");

    // Mock report data
    const reportTypes = [
        {
            id: "inventory_summary",
            title: "Inventory Summary",
            description: "Complete overview of current inventory status",
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            id: "dispensing_report",
            title: "Dispensing Report",
            description: "Detailed report of all dispensed medications",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            id: "low_stock_alert",
            title: "Low Stock Alert",
            description: "Items that need immediate restocking",
            icon: AlertTriangle,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            id: "expiry_report",
            title: "Expiry Report",
            description: "Medications approaching expiration date",
            icon: Clock,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            id: "financial_summary",
            title: "Financial Summary",
            description: "Revenue and cost analysis for inventory",
            icon: BarChart3,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            id: "custom_report",
            title: "Custom Report",
            description: "Create a custom report with specific criteria",
            icon: FileText,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
        },
    ];

    const recentReports = [
        {
            id: 1,
            name: "Monthly Inventory Summary",
            type: "inventory_summary",
            generated: "2024-01-15",
            size: "2.4 MB",
            status: "completed",
        },
        {
            id: 2,
            name: "Weekly Dispensing Report",
            type: "dispensing_report",
            generated: "2024-01-14",
            size: "1.8 MB",
            status: "completed",
        },
        {
            id: 3,
            name: "Low Stock Alert - January",
            type: "low_stock_alert",
            generated: "2024-01-13",
            size: "0.9 MB",
            status: "completed",
        },
        {
            id: 4,
            name: "Q4 Financial Summary",
            type: "financial_summary",
            generated: "2024-01-10",
            size: "3.2 MB",
            status: "completed",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const generateReport = () => {
        if (!selectedReport) return;
        
        // Mock report generation
        console.log(`Generating ${selectedReport} report...`);
        // In a real app, this would trigger the report generation API
    };

    return (
        <AdminLayout header="Reports">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Reports & Analytics
                        </h1>
                        <p className="text-gray-600">
                            Generate and manage inventory reports
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                            Print All
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Reports
                        </Button>
                    </div>
                </div>

                {/* Report Generation Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Generate New Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reportTypes.map((report) => (
                                <motion.div
                                    key={report.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <button
                                        onClick={() => setSelectedReport(report.id)}
                                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                                            selectedReport === report.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${report.bgColor}`}>
                                                <report.icon className={`h-5 w-5 ${report.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 mb-1">
                                                    {report.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {report.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {selectedReport && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex flex-col sm:flex-row gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date Range
                                        </label>
                                        <Select value={dateRange} onValueChange={setDateRange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select date range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="7d">Last 7 days</SelectItem>
                                                <SelectItem value="30d">Last 30 days</SelectItem>
                                                <SelectItem value="90d">Last 90 days</SelectItem>
                                                <SelectItem value="1y">Last year</SelectItem>
                                                <SelectItem value="custom">Custom range</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Search Items
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search items..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={generateReport} className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Generate Report
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Reports */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Reports
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-500">Filter</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentReports.map((report) => (
                                <motion.div
                                    key={report.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: report.id * 0.1 }}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {report.name}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>Generated: {report.generated}</span>
                                                <span>Size: {report.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={getStatusColor(report.status)}>
                                            {report.status}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                <Download className="h-3 w-3" />
                                                Download
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                <Printer className="h-3 w-3" />
                                                Print
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Reports</p>
                                        <p className="text-2xl font-bold text-gray-900">24</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Download className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Downloads This Month</p>
                                        <p className="text-2xl font-bold text-gray-900">156</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <BarChart3 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Avg. Report Size</p>
                                        <p className="text-2xl font-bold text-gray-900">2.1 MB</p>
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
