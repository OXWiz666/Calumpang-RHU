import React from "react";
import { motion } from "framer-motion";
import { router } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    Users,
    Calendar,
    Activity,
    AlertTriangle,
    Shield,
    Stethoscope,
    UserCheck,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import StaffLayout from "./StaffLayout";
import SideBar from "./Sidebar";
// interface StatisticCardProps {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   change?: {
//     value: number;
//     isPositive: boolean;
//   };
//   bgColor?: string;
// }

const StatisticCard = ({
    title,
    value,
    icon,
    change,
    description,
    iconBgColor = "bg-blue-100",
    iconColor = "text-blue-600",
    trend,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                            {description && (
                                <p className="text-xs text-gray-500 mb-3">{description}</p>
                            )}
                            <div className="flex items-center">
                                {trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                ) : trend === 'down' ? (
                                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                ) : null}
                                <span className={`text-sm font-semibold ${
                                    trend === 'up' ? 'text-green-600' : 
                                    trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {change?.value || value} total
                                </span>
                            </div>
                        </div>
                        <div className={`p-4 rounded-2xl ${iconBgColor} shadow-lg`}>
                            <div className={iconColor}>
                                {icon}
                            </div>
                        </div>
                    </div>
                    {change && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">This month</span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    change.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {change.isPositive ? '+' : ''}{change.value}%
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

// interface StatisticsOverviewProps {
//   totalPatients?: number;
//   todayAppointments?: number;
//   activePrograms?: number;
//   inventoryAlerts?: number;
// }

const Overview = ({
    staffcount = 0,
    admincount = 0,
    pharmacistcount = 0,
    doctorscount = 0,
}) => {
    return (
        <StaffLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Staff Overview</h1>
                    <p className="text-lg text-gray-600">
                        Monitor and manage all staff members across different roles
                    </p>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-8">
                    <SideBar activeTab={"overview"} />
                    
                    <div className="flex-1 space-y-8">
                        {/* Statistics Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-gray-900">Staff Statistics</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Overview of all staff members by role
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                        <StatisticCard
                                            title="Total Staff"
                                            value={staffcount}
                                            description="All registered staff"
                                            icon={<Users className="h-6 w-6" />}
                                            iconBgColor="bg-blue-100"
                                            iconColor="text-blue-600"
                                            trend="up"
                                            change={{ value: staffcount, isPositive: true }}
                                        />

                                        <StatisticCard
                                            title="Administrators"
                                            value={admincount}
                                            description="System administrators"
                                            icon={<Shield className="h-6 w-6" />}
                                            iconBgColor="bg-purple-100"
                                            iconColor="text-purple-600"
                                            trend="up"
                                            change={{ value: admincount, isPositive: true }}
                                        />

                                        <StatisticCard
                                            title="Doctors"
                                            value={doctorscount}
                                            description="Medical professionals"
                                            icon={<Stethoscope className="h-6 w-6" />}
                                            iconBgColor="bg-green-100"
                                            iconColor="text-green-600"
                                            trend="up"
                                            change={{ value: doctorscount, isPositive: true }}
                                        />

                                        <StatisticCard
                                            title="Pharmacists"
                                            value={pharmacistcount}
                                            description="Pharmacy staff"
                                            icon={<UserCheck className="h-6 w-6" />}
                                            iconBgColor="bg-orange-100"
                                            iconColor="text-orange-600"
                                            trend="up"
                                            change={{ value: pharmacistcount, isPositive: true }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="shadow-lg border-0">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Card 
                                                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300"
                                                onClick={() => router.visit(route("admin.staff.admins"))}
                                            >
                                                <CardContent className="p-6 text-center">
                                                    <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                        <Shield className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-2">Manage Admins</h3>
                                                    <p className="text-sm text-gray-600">View and manage administrator accounts</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Card 
                                                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-green-300"
                                                onClick={() => router.visit(route("admin.staff.doctors"))}
                                            >
                                                <CardContent className="p-6 text-center">
                                                    <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                        <Stethoscope className="h-8 w-8 text-green-600" />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-2">Manage Doctors</h3>
                                                    <p className="text-sm text-gray-600">View and manage doctor profiles</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Card 
                                                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-300"
                                                onClick={() => router.visit(route("admin.staff.pharmacists"))}
                                            >
                                                <CardContent className="p-6 text-center">
                                                    <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                        <UserCheck className="h-8 w-8 text-orange-600" />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-2">Manage Pharmacists</h3>
                                                    <p className="text-sm text-gray-600">View and manage pharmacy staff</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default Overview;
