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
import { tokenSessionManager } from "../../../../utils/tokenSession";
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
            // Patient profile fields
            date_of_birth: "",
            civil_status: "",
            nationality: "",
            religion: "",
            country: "",
            region: "",
            province: "",
            city: "",
            barangay: "",
            street: "",
            zip_code: "",
            profile_picture: "",
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

    // Helper function to download appointment details
    const downloadAppointmentDetails = () => {
        if (!data) return;

        const appointmentDetails = `
CALUMPANG RURAL HEALTH UNIT
APPOINTMENT CONFIRMATION

═══════════════════════════════════════════════════════════════

APPOINTMENT DETAILS
───────────────────────────────────────────────────────────────
Priority Number: ${data.priorityNumber || 'N/A'}
Appointment Date: ${data.date ? data.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Not specified'}
Appointment Time: ${formatTime(data.time)}

PATIENT INFORMATION
───────────────────────────────────────────────────────────────
Full Name: ${data.firstname} ${data.middlename ? data.middlename + ' ' : ''}${data.lastname}
Email: ${data.email || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Birth Date: ${data.birth || 'Not provided'}
Gender: ${data.gender || 'Not provided'}

SERVICE INFORMATION
───────────────────────────────────────────────────────────────
Service Type: ${data.servicename}
${data.subservicename ? `Sub-Service: ${data.subservicename}` : ''}

${data.notes ? `ADDITIONAL NOTES
───────────────────────────────────────────────────────────────
${data.notes}

` : ''}IMPORTANT REMINDERS
───────────────────────────────────────────────────────────────
• Please arrive 15 minutes before your scheduled appointment time
• Bring a valid ID and any relevant medical documents
• You will receive a confirmation email within 24 hours
• Our staff will contact you if any changes are needed

═══════════════════════════════════════════════════════════════

Generated on: ${new Date().toLocaleString()}
Calumpang Rural Health Unit
        `.trim();

        // Create and download the file
        const blob = new Blob([appointmentDetails], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `appointment-${data.priorityNumber || 'confirmation'}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    async function handleSubmit(data) {
        // In a real application, you would send this data to your backend
        setData(data);

        post(route("patient.appoint.create"), {
            onSuccess: (page) => {
                // Update the form data with the priority number from the backend response
                // Check for priority number in flash data or session data
                const priorityNumber = page.props.flash?.priority_number || 
                                     page.props.appointment_priority_number;
                
                if (priorityNumber) {
                    setData(prev => ({
                        ...prev,
                        priorityNumber: priorityNumber
                    }));
                    
                    // Clear the session data after using it
                    if (page.props.appointment_priority_number) {
                        // Clear session data by making a request to clear it
                        fetch('/clear-appointment-session', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            }
                        }).catch(err => console.log('Failed to clear session:', err));
                    }
                } else {
                    // Fallback: generate a temporary priority number if backend doesn't provide one
                    setData(prev => ({
                        ...prev,
                        priorityNumber: "TBD" // To Be Determined
                    }));
                }
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
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                                <CheckCircle2 className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                Appointment Confirmed!
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Your appointment has been successfully scheduled. We'll send you a confirmation text message shortly.
                            </p>
                        </div>

                        {data && (
                            <div className="space-y-6">
                                {/* Main Appointment Card */}
                                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                                    <Calendar className="h-7 w-7" />
                                                    Appointment Details
                                                </CardTitle>
                                                <CardDescription className="text-blue-100 mt-2">
                                                    Please save this information for your reference
                                                </CardDescription>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                                <div className="text-center">
                                                    <p className="text-xs text-blue-100 font-medium">Priority Number</p>
                                                    <p className="text-2xl font-bold text-white">
                                                        {data.priorityNumber || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Patient Information */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Patient Information</h3>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {data.firstname} {data.middlename ? data.middlename + ' ' : ''}{data.lastname}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {data.email || "Not provided"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {data.phone || "Not provided"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Birth Date</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {data.birth || "Not provided"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Gender</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {data.gender || "Not provided"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Appointment Information */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <Activity className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                                        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                                                            <Pill className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-green-700">Service Type</p>
                                                            <p className="text-lg font-semibold text-green-900">
                                                                {data.servicename}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {data.subservicename && (
                                                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                                            <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-emerald-700">Sub-Service</p>
                                                                <p className="text-lg font-semibold text-emerald-900">
                                                                    {data.subservicename}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                                                            <Calendar className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-blue-700">Appointment Date</p>
                                                            <p className="text-lg font-semibold text-blue-900">
                                                                {data.date ? data.date.toLocaleDateString('en-US', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                }) : "Not specified"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-purple-700">Appointment Time</p>
                                                            <p className="text-lg font-semibold text-purple-900">
                                                                {formatTime(data.time)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {data.notes && (
                                                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center mt-1">
                                                                    <FileText className="w-4 h-4 text-amber-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-amber-700 mb-2">Additional Notes</p>
                                                                    <p className="text-amber-900 leading-relaxed">
                                                                        {data.notes}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Next Steps Card */}
                                <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-50 to-blue-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <Info className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens next?</h3>
                                                <div className="space-y-2 text-gray-600">
                                                    <p>• You will receive a confirmation email within 24 hours</p>
                                                    <p>• Our staff will review your appointment and contact you if needed</p>
                                                    <p>• Please arrive 15 minutes before your scheduled time</p>
                                                    <p>• Bring a valid ID and any relevant medical documents</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                                    <Button 
                                        onClick={() => {
                                            // Clear token session to reset form
                                            tokenSessionManager.clearTokenSession();
                                            // Redirect to landing page
                                            router.visit('/');
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                        </svg>
                                        Book Another Appointment
                                    </Button>
                                    
                                    <Button 
                                        variant="outline"
                                        onClick={downloadAppointmentDetails}
                                        className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Details
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
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
