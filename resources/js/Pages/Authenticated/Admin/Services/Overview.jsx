import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/tempo/components/ui/card";
import ServicesLayout from "./ServicesLayout";
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mr-1">
                                        <path d="m5 12 7-7 7 7"></path>
                                        <path d="M12 19V5"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-red-500 mr-1">
                                        <path d="m5 12 7 7 7-7"></path>
                                        <path d="M12 5v14"></path>
                                    </svg>
                                )}
                                <span
                                    className={`text-xs font-medium ${
                                        change.isPositive
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {change.value} total
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
    staffcount = 0,
    admincount = 0,
    pharmacistcount = 0,
}) => {
    //console.log(staffcount);
    return (
        <ServicesLayout>
            <div className=" mb-5">
                <h1 className="text-3xl font-bold mb-2">Overview</h1>
                {/* <p className="text-gray-600">
                            Book your visit to Barangay Calumpang Health Center.
                            Please fill out the form below with your information
                            and preferred appointment details.
                        </p> */}
                <p className="text-muted-foreground"></p>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <SideBar activeTab={"overview"} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
                    <StatisticCard
                        title="Total Services"
                        value={staffcount}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        }
                        change={{
                            value: staffcount,
                            isPositive: true,
                        }}
                    />

                    <StatisticCard
                        title="Total Sub-Services"
                        value={admincount}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        }
                        change={{ value: admincount, isPositive: true }}
                    />

                    <StatisticCard
                        title="Active Services"
                        value={pharmacistcount}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                        }
                        change={{ value: pharmacistcount, isPositive: true }}
                    />

                    <StatisticCard
                        title="Inactive Services"
                        value={inventoryAlerts}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                <path d="M12 9v4"></path>
                                <path d="M12 17h.01"></path>
                            </svg>
                        }
                        change={{ value: inventoryAlerts, isPositive: false }}
                        bgColor={inventoryAlerts > 0 ? "bg-red-50" : "bg-white"}
                    />
                </div>
            </div>
        </ServicesLayout>
    );
};

export default Overview;
