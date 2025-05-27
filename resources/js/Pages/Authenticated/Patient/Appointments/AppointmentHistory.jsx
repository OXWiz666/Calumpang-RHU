import React, { useEffect, useState } from "react";
// import Header from "../landing/Header";
// import Footer from "../landing/Footer";
import AppointmentForm from "../partial/AppointmentForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/tempo/components/ui/alert";
import {
    Pen,
    ChevronRight,
    AlertCircle,
    Shield,
    Check,
    X,
    Clock9,
    ChevronLeft,
} from "lucide-react";
import LandingLayout from "@/Layouts/LandingLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/tempo/components/ui/button";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import Sidebar from "./Sidebar";
import AppointmentLayout from "../Appointments/AppointmentLayout";
export default function AppointmentHistory({ appointments }) {
    const { links } = usePage().props.appointments; // Get pagination links

    // useEffect(() => {
    //     console.log(links);
    // }, [links]);

    const getStatusBadge = (status) => {
        //	1=scheduled=2=completed,3=cancelled,4=declined,5=confirmed
        switch (status) {
            case 1:
                return (
                    <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full flex items-center">
                        <Clock9 className="h-3 w-3 mr-1" />
                        Scheduled
                    </div>
                );
            case 2:
                return (
                    <div className="text-xs bg-green-600 text-white px-2 py-1 rounded-full flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Completed
                    </div>
                );
                break;
            case 3:
                return (
                    <div className="text-xs bg-red-500 text-white px-2 py-1 rounded-full flex items-center">
                        <X className="h-3 w-3 mr-1" />
                        Cancelled
                    </div>
                );
                break;
            case 4:
                return (
                    <div className="text-xs bg-red-600 text-white px-2 py-1 rounded-full flex items-center">
                        <X className="h-3 w-3 mr-1" />
                        Declined
                    </div>
                );
                break;
            case 5:
                return (
                    <div className="text-xs bg-green-600 text-white px-2 py-1 rounded-full flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Confirmed
                    </div>
                );
                break;
        }
    };
    return (
        <AppointmentLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
                <p className="text-gray-600">
                    Book your visit to Barangay Calumpang Health Center. Please
                    fill out the form below with your information and preferred
                    appointment details.
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar activeTab="History" />
                <div className="w-full md:w-3/4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">
                                    My Appointments
                                </CardTitle>
                            </div>
                            <CardDescription>
                                These are your recent appointments:
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {appointments.data.length <= 0 && (
                                        <div className=" m-5">
                                            No Appointments.
                                        </div>
                                    )}
                                    {appointments.data.map((a, i) => (
                                        <div
                                            key={i}
                                            className="p-4 hover:bg-muted/20 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-medium flex items-center">
                                                        {a.service?.servicename}
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            #{a.id}
                                                        </span>
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        doctor
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-sm text-muted-foreground mr-2">
                                                        {a.date} {a.time}
                                                    </span>
                                                    {a.status == 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Pen className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm mb-2">
                                                {a.notes}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {/* {a.status == 1 ? (
                                                    <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full flex items-center">
                                                        <Clock9 className="h-3 w-3 mr-1" />
                                                        Scheduled
                                                    </div>
                                                ) : a.status == 2 ? (
                                                    <div className="text-xs bg-green-500 text-white px-2 py-1 rounded-full flex items-center">
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Completed
                                                    </div>
                                                ) : (
                                                    <div className="text-xs bg-red-500 text-white px-2 py-1 rounded-full flex items-center">
                                                        <X className="h-3 w-3 mr-1" />
                                                        Cancelled
                                                    </div>
                                                )} */}
                                                {getStatusBadge(a.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="text-sm text-muted-foreground">
                                Showing {appointments.from} to {appointments.to}{" "}
                                of {appointments.total} Results
                            </div>
                            <div className="flex ml-2 space-x-2">
                                {links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? "default" : "outline"
                                        }
                                        size="sm"
                                        disabled={!link.url || link.active}
                                        onClick={() => {
                                            if (link.url) {
                                                router.get(link.url);
                                            }
                                        }}
                                    >
                                        {link.label.includes("Previous") ? (
                                            <ChevronLeft className="h-4 w-4" />
                                        ) : link.label.includes("Next") ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            link.label
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppointmentLayout>
    );
}
