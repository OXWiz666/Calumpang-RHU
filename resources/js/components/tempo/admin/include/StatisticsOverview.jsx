import React from "react";
import { Card, CardContent } from "@/components/tempo/components/ui/card";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    Users,
    Calendar,
    Activity,
    TrendingUp,
    TrendingDown,
    Heart,
    Stethoscope,
    UserCheck,
    Clock
} from "lucide-react";
import { motion } from "framer-motion";

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
    bgColor = "bg-white",
    gradientFrom,
    gradientTo,
    iconBg,
    iconColor = "text-primary"
}) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={`${bgColor} shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${
                    gradientFrom && gradientTo ? `bg-gradient-to-br ${gradientFrom} ${gradientTo}` : ''
                }`}
            >
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                                {title}
                            </p>
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">{value}</h3>
                            {change && (
                                <div className="flex items-center">
                                    {change.isPositive ? (
                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                    )}
                                    <span
                                        className={`text-sm font-medium ${
                                            change.isPositive
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {change.value}% from last month
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className={`p-4 rounded-2xl ${iconBg || 'bg-blue-100'} ${iconColor}`}>
                            {icon}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// interface StatisticsOverviewProps {
//   totalPatients?: number;
//   todayAppointments?: number;
//   activePrograms?: number;
// }

const StatisticsOverview = ({
    patients = {},
    todayAppointments = 32,
    activePrograms = 8,
    dashboardData = {}
}) => {
    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">System Overview</h2>
                <p className="text-gray-600">Key metrics and performance indicators</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <StatisticCard
                        title="Total Patients"
                        value={dashboardData.patients?.total || patients.total || 0}
                        icon={<Users className="h-6 w-6" />}
                        change={{
                            value: Math.abs(dashboardData.patients?.growth || patients.growth || 0),
                            isPositive: (dashboardData.patients?.growth || patients.growth || 0) >= 0,
                        }}
                        gradientFrom="from-blue-50"
                        gradientTo="to-blue-100"
                        iconBg="bg-blue-500"
                        iconColor="text-white"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <StatisticCard
                        title="Today's Appointments"
                        value={dashboardData.appointments?.today || todayAppointments}
                        icon={<Calendar className="h-6 w-6" />}
                        change={{ 
                            value: Math.abs(dashboardData.appointments?.growth || 0), 
                            isPositive: (dashboardData.appointments?.growth || 0) >= 0 
                        }}
                        gradientFrom="from-green-50"
                        gradientTo="to-green-100"
                        iconBg="bg-green-500"
                        iconColor="text-white"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <StatisticCard
                        title="Active Health Programs"
                        value={dashboardData.programs?.active || activePrograms}
                        icon={<Activity className="h-6 w-6" />}
                        change={{ 
                            value: Math.abs(dashboardData.programs?.trend || 0), 
                            isPositive: (dashboardData.programs?.trend || 0) >= 0 
                        }}
                        gradientFrom="from-purple-50"
                        gradientTo="to-purple-100"
                        iconBg="bg-purple-500"
                        iconColor="text-white"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <StatisticCard
                        title="System Health"
                        value={`${dashboardData.systemHealth || 98}%`}
                        icon={<Heart className="h-6 w-6" />}
                        change={{ 
                            value: 2, 
                            isPositive: true 
                        }}
                        gradientFrom="from-emerald-50"
                        gradientTo="to-emerald-100"
                        iconBg="bg-emerald-500"
                        iconColor="text-white"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default StatisticsOverview;
