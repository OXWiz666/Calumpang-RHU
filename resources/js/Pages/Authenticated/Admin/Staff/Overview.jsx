import React from "react";
import { Card, CardContent } from "@/components/tempo/components/ui/card";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    Users,
    Calendar,
    Activity,
    AlertTriangle,
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
//   inventoryAlerts?: number;
// }

const Overview = ({
    // patients = {},
    todayAppointments = 32,
    activePrograms = 8,
    inventoryAlerts = 5,
    staffcount,
    admincount,
    pharmacistcount,
}) => {
    //console.log(staffcount);
    return (
        <StaffLayout>
            <div>
                <h1 className="text-3xl font-bold mb-2">Overview</h1>
                {/* <p className="text-gray-600">
                            Book your visit to Barangay Calumpang Health Center.
                            Please fill out the form below with your information
                            and preferred appointment details.
                        </p> */}
                <p className="text-muted-foreground"></p>
            </div>
            <div className="flex flex-col xl:flex-row gap-4">
                <SideBar activeTab={"overview"} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                    <StatisticCard
                        title="Total Staff Registered"
                        value={staffcount}
                        icon={<Users className="h-5 w-5 text-primary" />}
                        change={{
                            value: staffcount,
                            isPositive: staffcount >= 0 ? true : false,
                        }}
                    />

                    <StatisticCard
                        title="Total Admins"
                        value={admincount}
                        icon={<Users className="h-5 w-5 text-primary" />}
                        change={{ value: 8, isPositive: true }}
                    />

                    {/* <StatisticCard
                        title="Inventory Alerts"
                        value={inventoryAlerts}
                        icon={
                            <AlertTriangle className="h-5 w-5 text-primary" />
                        }
                        change={{ value: 2, isPositive: false }}
                        bgColor={inventoryAlerts > 0 ? "bg-red-50" : "bg-white"}
                    /> */}
                </div>
            </div>
        </StaffLayout>
    );
};

export default Overview;
