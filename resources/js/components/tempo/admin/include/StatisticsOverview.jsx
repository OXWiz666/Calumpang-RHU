import React from "react";
import { Card, CardContent } from "@/components/tempo/components/ui/card";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    Users,
    Calendar,
    Activity,
} from "lucide-react";

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
}) => {
    return (
        <Card
            className={`${bgColor} shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary`}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <h3 className="text-2xl font-bold mt-1">{value}</h3>
                        {change && (
                            <div className="flex items-center mt-2">
                                {change.isPositive ? (
                                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                ) : (
                                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                                )}
                                <span
                                    className={`text-xs font-medium ${
                                        change.isPositive
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {change.value}% from last month
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="p-3 rounded-full bg-accent">{icon}</div>
                </div>
            </CardContent>
        </Card>
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
}) => {
    return (
        <div className="w-full bg-background">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatisticCard
                    title="Total Patients"
                    value={patients.total}
                    icon={<Users className="h-5 w-5 text-primary" />}
                    change={{
                        value: patients.growth,
                        isPositive: patients.growth >= 0 ? true : false,
                    }}
                />

                <StatisticCard
                    title="Today's Appointments"
                    value={todayAppointments}
                    icon={<Calendar className="h-5 w-5 text-primary" />}
                    change={{ value: 8, isPositive: true }}
                />

                <StatisticCard
                    title="Active Health Programs"
                    value={activePrograms}
                    icon={<Activity className="h-5 w-5 text-primary" />}
                    change={{ value: 0, isPositive: true }}
                />
            </div>
        </div>
    );
};

export default StatisticsOverview;
