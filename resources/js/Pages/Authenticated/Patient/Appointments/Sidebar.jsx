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
    CheckCircle2,
    Info,
    FileText,
    Download,
    Calendar,
    Pill,
    Activity,
    Clipboard,
    Search,
    Filter,
    ChevronRight,
    AlertCircle,
    Shield,
    Hash,
} from "lucide-react";
import LandingLayout from "@/Layouts/LandingLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/tempo/components/ui/button";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";

export default function Sidebar({ activeTab }) {
    const { user } = usePage().props.auth;
    const [priorityNumber, setPriorityNumber] = useState("");
    const [showPriorityNumber, setShowPriorityNumber] = useState(false);

    useEffect(() => {
        // Get the latest appointment's priority number if available
        const fetchPriorityNumber = async () => {
            try {
                const response = await fetch('/patient/get-latest-appointment');
                const data = await response.json();
                if (data && data.priorityNumber) {
                    setPriorityNumber(data.priorityNumber);
                } else {
                    // If no priority number exists, use a placeholder
                    setPriorityNumber("1");
                }
            } catch (error) {
                console.error("Error fetching priority number:", error);
                setPriorityNumber("1");
            }
        };

        if (user && activeTab === "History") {
            fetchPriorityNumber();
            setShowPriorityNumber(true);
        } else {
            setShowPriorityNumber(false);
        }
    }, [user, activeTab]);

    const handleAppointmentClick = () => {
        setShowPriorityNumber(true);
        if (user) {
            const fetchPriorityNumber = async () => {
                try {
                    const response = await fetch('/patient/get-latest-appointment');
                    const data = await response.json();
                    if (data && data.priorityNumber) {
                        setPriorityNumber(data.priorityNumber);
                    } else {
                        setPriorityNumber("1");
                    }
                } catch (error) {
                    console.error("Error fetching priority number:", error);
                    setPriorityNumber("1");
                }
            };
            fetchPriorityNumber();
        }
    };

    return (
        <>
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
                <Card className="bg-white sticky top-4">
                    <CardHeader className="pb-4"></CardHeader>
                    <CardContent>
                        <div className="">
                            <Button
                                variant={
                                    activeTab === "appointment"
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                                size="lg"
                                onClick={(e) => router.visit("/appointments")}
                            >
                                <FileText className="mr-2 h-5 w-5" />
                                Schedule Appointment
                            </Button>

                            {user && (
                                <>
                                    <Button
                                        variant={
                                            activeTab === "History"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                        size="lg"
                                        onClick={(e) => {
                                            handleAppointmentClick();
                                            router.visit(
                                                "/patient/appointments/history"
                                            );
                                        }}
                                    >
                                        <Clipboard className="mr-2 h-5 w-5" />
                                        My Appointments
                                    </Button>
                                    
                                    {/* Priority Number Display */}
                                    {showPriorityNumber && (
                                        <div className="mt-4 mx-2">
                                            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-lg overflow-hidden shadow-lg border border-blue-400">
                                                <div className="px-4 py-3 bg-blue-900/30 backdrop-blur-sm">
                                                    <div className="flex items-center justify-center">
                                                        <Hash className="h-4 w-4 text-white mr-2" />
                                                        <h3 className="text-sm font-medium text-white tracking-wide uppercase">Priority Number</h3>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-5 flex flex-col items-center justify-center bg-blue-800/10 backdrop-blur-sm">
                                                    <div className="text-3xl font-bold text-white text-center tracking-wider">
                                                        {priorityNumber}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
