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
    const [isDownloading, setIsDownloading] = useState(false);
    const [isExistingPatient, setIsExistingPatient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);

    // Function to dismiss verification success message
    const dismissVerificationSuccess = () => {
        setShowVerificationSuccess(false);
    };
    
    // Debug logging
    console.log('Appointment component received services:', services);
    console.log('Services type:', typeof services);
    console.log('Is array:', Array.isArray(services));
    console.log('Services length:', services?.length);
    
    
    // Check for existing patient data on component mount
    useEffect(() => {
        // Check for verification success parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('verified') === 'true') {
            setShowVerificationSuccess(true);
            // Clear the URL parameter after showing the message
            const newUrl = new URL(window.location);
            newUrl.searchParams.delete('verified');
            window.history.replaceState({}, '', newUrl);
        }

        // Check for confirmation parameter
        if (urlParams.get('confirmed') === 'true') {
            setIsSubmitted(true);
            
            // Load appointment data from localStorage
            const storedData = localStorage.getItem('confirmed_appointment_data');
            if (storedData) {
                try {
                    const appointmentData = JSON.parse(storedData);
                    console.log('Loading appointment data from localStorage:', appointmentData);
                    
                    // Store in React state for confirmation display
                    setConfirmationData(appointmentData);
                    
                    // Clear the stored data after loading
                    localStorage.removeItem('confirmed_appointment_data');
                } catch (error) {
                    console.error('Error parsing stored appointment data:', error);
                }
            }
        }

        // Ensure services is an array before proceeding
        if (!Array.isArray(services)) {
            console.error('Services is not an array:', services);
            setIsLoading(false);
            return;
        }

        const existingPatientData = localStorage.getItem('existingPatientData');
        const patientType = localStorage.getItem('selectedPatientType');
        
        if (existingPatientData && patientType === 'existing') {
            try {
                const patient = JSON.parse(existingPatientData);
                setIsExistingPatient(true);
                
                // Pre-populate form with existing patient data
                setData(prev => ({
                    ...(typeof prev === 'object' && prev !== null ? prev : {}),
                    firstname: patient.firstname || '',
                    middlename: patient.middlename || '',
                    lastname: patient.lastname || '',
                    email: patient.email || '',
                    phone: patient.phone || '',
                    gender: patient.gender || '',
                    birth: patient.date_of_birth || '',
                    civil_status: patient.civil_status || '',
                    nationality: patient.nationality || '',
                    religion: patient.religion || '',
                    country: patient.country || '',
                    region: patient.region || '',
                    province: patient.province || '',
                    city: patient.city || '',
                    barangay: patient.barangay || '',
                    street: patient.street || '',
                    zip_code: patient.zip_code || '',
                    profile_picture: patient.profile_picture || '',
                    region_id: patient.region_id || null,
                    province_id: patient.province_id || null,
                    city_id: patient.city_id || null,
                    barangay_id: patient.barangay_id || null,
                }));
            } catch (error) {
                console.error('Error parsing existing patient data:', error);
            }
        }
        
        setIsLoading(false);
    }, [services]);

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
            // Address ID fields for yajra/laravel-address
            region_id: null,
            province_id: null,
            city_id: null,
            barangay_id: null,
        });

    // Use confirmationData if available, otherwise use form data
    const displayData = confirmationData || data;
    
    // Debug logging for data from useForm
    console.log('Appointment component - data from useForm:', data);
    console.log('confirmationData:', confirmationData);
    console.log('displayData:', displayData);
    console.log('data type:', typeof data);
    console.log('data is object:', typeof data === 'object' && data !== null);
    console.log('Priority number in data:', data.priorityNumber);
    console.log('Priority number in displayData:', displayData.priorityNumber);
    console.log('All data keys:', data && typeof data === 'object' ? Object.keys(data) : 'not an object');

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

    // Helper function to download appointment details as PDF
    const downloadAppointmentDetails = async () => {
        if (!data) return;

        setIsDownloading(true);
        
        try {
            // Import the required libraries dynamically
            const html2canvas = (await import('html2canvas')).default;
            const jsPDF = (await import('jspdf')).jsPDF;

            // Get the appointment details element
            const element = document.getElementById('appointment-details-pdf');
            if (!element) {
                console.error('Appointment details element not found');
                setIsDownloading(false);
                return;
            }

            // Generate canvas from the element
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: element.scrollWidth,
                height: element.scrollHeight
            });

            // Create PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            // Add image to PDF
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Save the PDF
            const fileName = `appointment_details_${data.priorityNumber || 'confirmation'}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            
            // Fallback to text download if PDF generation fails
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
Service Type: ${data.servicename || 'Not specified'}
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

            // Create and download the text file as fallback
            const blob = new Blob([appointmentDetails], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `appointment-${data.priorityNumber || 'confirmation'}-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert('PDF generation failed. Downloaded as text file instead.');
        } finally {
            setIsDownloading(false);
        }
    };

    async function handleSubmit(data) {
        // Debug logging for handleSubmit data
        console.log('handleSubmit received data:', data);
        console.log('data type:', typeof data);
        console.log('data is object:', typeof data === 'object' && data !== null);
        
        // Safety check for data
        if (typeof data !== 'object' || data === null) {
            console.error('handleSubmit received invalid data:', data);
            alert('Invalid form data. Please try again.');
            return;
        }
        
        // Update the form data with the submitted data
        setData(data);

        try {
            // Use fetch instead of Inertia post to handle JSON response
            const response = await fetch(route("patient.appoint.create"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    ...data,
                    date: data.date // Date is already in YYYY-MM-DD format from the form
                })
            });

            const result = await response.json();

            if (result.success) {
                // Update the form data with the appointment data from the backend response
                setData(prev => ({
                    ...(typeof prev === 'object' && prev !== null ? prev : {}),
                    priorityNumber: result.priority_number,
                    servicename: result.appointment_data.service_name,
                    subservicename: result.appointment_data.subservice_name,
                    date: result.appointment_data.date,
                    time: result.appointment_data.time,
                    firstname: result.appointment_data.firstname,
                    lastname: result.appointment_data.lastname,
                    middlename: result.appointment_data.middlename,
                    email: result.appointment_data.email,
                    phone: result.appointment_data.phone,
                    notes: result.appointment_data.notes,
                    gender: result.appointment_data.gender,
                    birth: result.appointment_data.date_of_birth,
                    id: result.appointment_data.id, // Add appointment ID for verification
                }));
                
                setIsSubmitted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                // Handle error case
                console.error('Appointment creation failed:', result.message);
                alert('Failed to create appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('An error occurred while creating the appointment. Please try again.');
        }
    }

    // Show loading state if services is not ready
    if (isLoading || !Array.isArray(services) || services.length === 0) {
        return (
            <AppointmentLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading appointment form...</p>
                        {!Array.isArray(services) && (
                            <p className="text-red-600 mt-2">Error: Services data is invalid</p>
                        )}
                    </div>
                </div>
            </AppointmentLayout>
        );
    }

    return (
        <AppointmentLayout>
            {/* Existing Patient Information Banner */}
            {isExistingPatient && (
                <div className="mb-6">
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-green-900">Welcome Back!</h3>
                                    <p className="text-sm text-green-700">
                                        Your information has been automatically filled from your previous appointment.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Verification Success Message */}
            {showVerificationSuccess && (
                <div className="mb-6">
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-900">Appointment Verified Successfully!</h3>
                                        <p className="text-sm text-green-700">
                                            Your appointment has been confirmed and verified. You will receive a confirmation email shortly.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={dismissVerificationSuccess}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {isSubmitted ? (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                                <CheckCircle2 className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                Appointment Scheduled!
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Your appointment has been successfully scheduled. We'll send you a confirmation text message shortly.
                            </p>
                        </div>

                        {data && (
                            <div className="space-y-6">
                                {/* Main Appointment Card */}
                                <Card id="appointment-details-pdf" className="shadow-xl border-0 bg-white/80 backdrop-blur-sm print:bg-white print:shadow-none print:border print:border-gray-200">
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
                                                        {displayData.priorityNumber || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    
                                    <CardContent className="p-8 print:p-6">
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
                                                                {displayData.firstname} {displayData.middlename ? displayData.middlename + ' ' : ''}{displayData.lastname}
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
                                                                {displayData.email || "Not provided"}
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
                                                                {displayData.phone || "Not provided"}
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
                                                                {displayData.birth || "Not provided"}
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
                                                                {displayData.gender || "Not provided"}
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
                                                                {displayData.servicename || "Not specified"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {displayData.subservicename && (
                                                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                                            <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-emerald-700">Sub-Service</p>
                                                                <p className="text-lg font-semibold text-emerald-900">
                                                                    {displayData.subservicename}
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
                                                                {displayData.date ? (() => {
                                                                    try {
                                                                        const date = new Date(displayData.date);
                                                                        return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString('en-US', {
                                                                            weekday: 'long',
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        });
                                                                    } catch (error) {
                                                                        return "Invalid date";
                                                                    }
                                                                })() : "Not specified"}
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
                                                                {formatTime(displayData.time)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                                        <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-indigo-700">Reference Number</p>
                                                            <p className="text-lg font-semibold text-indigo-900">
                                                                {displayData.reference_number || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {displayData.notes && (
                                                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center mt-1">
                                                                    <FileText className="w-4 h-4 text-amber-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-amber-700 mb-2">Additional Notes</p>
                                                                    <p className="text-amber-900 leading-relaxed">
                                                                        {displayData.notes}
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
                                        disabled={isDownloading}
                                        className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDownloading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Generating PDF...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-5 h-5 mr-2" />
                                                Download Details
                                            </>
                                        )}
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
                                setIsSubmitted={setIsSubmitted}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AppointmentLayout>
    );
}
