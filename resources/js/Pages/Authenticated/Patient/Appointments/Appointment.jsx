import React, { useEffect, useState } from "react";
// import Header from "../landing/Header";
// import Footer from "../landing/Footer";
import AppointmentForm from "../partial/AppointmentForm";
import moment from "moment";
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
} from "lucide-react";
import LandingLayout from "@/Layouts/LandingLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { Button } from "@/components/tempo/components/ui/button";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";

import AppointmentLayout from "../Appointments/AppointmentLayout";

import Sidebar from "./Sidebar";
import PrimaryButton from "@/components/PrimaryButton";
export default function Appointment({ services }) {
    //const [activeTab, setActiveTab] = useState(ActiveTAB);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { data, setData, errors, post, recentlySuccessful, processing } =
        useForm({
            firstname: "",
            middlename: "",
            lastname: "",
            email: "",
            phone: "",
            date: null,
            timeid: null,
            time: null,
            service: "",
            servicename: "",
            subservice: "",
            subservicename: "",
            notes: "",
            gender: "",
            birth: "",
            priorityNumber: "",
        });

    // Helper function to format time to 12-hour format with AM/PM
    const formatTime = (timeString) => {
        if (!timeString) return 'Not specified';
        try {
            // Handle different time formats
            let time = timeString;
            
            // If it's in HH:mm:ss format, extract just the time part
            if (timeString.includes(' ')) {
                time = timeString.split(' ')[1] || timeString.split(' ')[0];
            }
            
            // Parse the time and format to 12-hour format
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours, 10);
            const minute = parseInt(minutes, 10);
            
            if (isNaN(hour) || isNaN(minute)) {
                return timeString; // Return original if parsing fails
            }
            
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const displayMinute = minute.toString().padStart(2, '0');
            
            return `${displayHour}:${displayMinute} ${period}`;
        } catch (error) {
            console.error('Error formatting time:', error);
            return timeString; // Return original if formatting fails
        }
    };

    async function handleSubmit(data) {
        // In a real application, you would send this data to your backend
        setData(data);

        post(route("patient.appoint.create"), {
            onSuccess: () => {
                setIsSubmitted(true);
            },
            onFinish: () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
        });
    }

    return (
        <AppointmentLayout>
            {isSubmitted ? (
                <div className="space-y-6">
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <AlertTitle className="text-green-800 text-lg font-medium">
                            Appointment Request Received
                        </AlertTitle>
                        <AlertDescription className="text-green-700">
                            Thank you for scheduling an appointment with
                            Barangay Calumpang Health Center. We will review
                            your request and contact you shortly to confirm your
                            appointment.
                        </AlertDescription>
                    </Alert>

                    {data && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment Details</CardTitle>
                                <CardDescription>
                                    Please save this information for your
                                    reference
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Name
                                        </p>
                                        <p className="text-gray-900">
                                            {data.firstname} {data.lastname}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Service
                                        </p>
                                        <p className="text-gray-900">
                                            {data.servicename}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Date
                                        </p>
                                        <p className="text-gray-900">
                                            {data.date
                                                ? data.date.toLocaleDateString()
                                                : "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Time
                                        </p>
                                        <p className="text-gray-900">
                                            {formatTime(data.time)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Email
                                        </p>
                                        <p className="text-gray-900">
                                            {data.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Phone
                                        </p>
                                        <p className="text-gray-900">
                                            {data.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Birth Date
                                        </p>
                                        <p className="text-gray-900">
                                            {data.birth}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Gender
                                        </p>
                                        <p className="text-gray-900">
                                            {data.gender}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Priority Number
                                        </p>
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-md text-center w-24 shadow-sm border border-blue-200">
                                                {data.priorityNumber || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {data.notes && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Additional Notes
                                        </p>
                                        <p className="text-gray-900">
                                            {data.notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <PrimaryButton className=" float-right">
                        <Link href="/appointments">Back</Link>
                    </PrimaryButton>
                </div>
            ) : (
                <div>
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                        Schedule an Appointment
                                    </h1>
                                    <p className="text-lg text-gray-600">
                                        Book your visit to Barangay Calumpang Health Center
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-white/50">
                                <p className="text-gray-700 leading-relaxed">
                                    Please fill out the form below with your information and preferred appointment details. 
                                    Our healthcare team is ready to provide you with quality medical services.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* SideBar */}
                        <Sidebar activeTab="appointment" />
                        {/* Main Content */}

                        <div className="w-full md:w-3/4">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                                <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                                            <Info className="h-6 w-6 text-amber-700" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-amber-900 font-bold">
                                                Important Information
                                            </CardTitle>
                                            <CardDescription className="text-amber-700 font-medium">
                                                Please review these guidelines before scheduling
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Operating Hours</p>
                                                    <p className="text-sm text-gray-600">Monday to Saturday, 9:00 AM to 4:00 PM</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Arrival Time</p>
                                                    <p className="text-sm text-gray-600">Please arrive 15 minutes early</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Required Documents</p>
                                                    <p className="text-sm text-gray-600">Valid ID and health records</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Safety Protocol</p>
                                                    <p className="text-sm text-gray-600">Face mask required at all times</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Confirmation</p>
                                                    <p className="text-sm text-gray-600">Email or SMS confirmation sent</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <AppointmentForm
                                services={services}
                                formData={data}
                                setFormData={setData}
                                errors={errors}
                                processing={processing}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AppointmentLayout>
    );
}
