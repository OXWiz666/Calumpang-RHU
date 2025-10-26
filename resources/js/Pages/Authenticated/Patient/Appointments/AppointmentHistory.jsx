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
    FileText,
    Eye,
} from "lucide-react";
import LandingLayout from "@/Layouts/LandingLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/tempo/components/ui/button";
import { Badge } from "@/components/tempo/components/ui/badge";
import Modal from "@/components/CustomModal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import Sidebar from "./Sidebar";
import AppointmentLayout from "../Appointments/AppointmentLayout";
export default function AppointmentHistory({ appointments }) {
    const { links } = usePage().props.appointments; // Get pagination links
    const [existingPatientData, setExistingPatientData] = useState(null);
    const [isExistingPatient, setIsExistingPatient] = useState(false);
    
    // Diagnosis Summary Modal State
    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);

    // Check for existing patient data on component mount
    useEffect(() => {
        const existingPatientData = localStorage.getItem('existingPatientData');
        const patientType = localStorage.getItem('selectedPatientType');
        
        if (existingPatientData && patientType === 'existing') {
            try {
                const patient = JSON.parse(existingPatientData);
                setExistingPatientData(patient);
                setIsExistingPatient(true);
            } catch (error) {
                console.error('Error parsing existing patient data:', error);
            }
        }
    }, []);

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

    // Function to fetch diagnosis data for an appointment
    const fetchDiagnosisData = async (appointmentId) => {
        setLoadingDiagnosis(true);
        try {
            const response = await axios.get(`/auth/appointments/diagnosis/${appointmentId}`);
            if (response.data.diagnosis) {
                setSelectedDiagnosis(response.data);
                setIsDiagnosisModalOpen(true);
            } else {
                toast.error('No diagnosis found for this appointment');
            }
        } catch (error) {
            console.error('Error fetching diagnosis:', error);
            if (error.response?.status === 404) {
                toast.error('No diagnosis available for this appointment');
            } else {
                toast.error('Failed to load diagnosis data');
            }
        } finally {
            setLoadingDiagnosis(false);
        }
    };

    // Function to open diagnosis summary modal
    const openDiagnosisSummary = (appointmentId) => {
        fetchDiagnosisData(appointmentId);
    };

    // Function to close diagnosis summary modal
    const closeDiagnosisSummary = () => {
        setIsDiagnosisModalOpen(false);
        setSelectedDiagnosis(null);
    };

    // Function to check if an appointment might have a diagnosis
    const hasDiagnosis = (appointment) => {
        // Show button for completed appointments (status 2) or archived appointments (status 6)
        // Also show for any appointment that might have been diagnosed
        return appointment.status == 2 || appointment.status == 6 || 
               (appointment.medical_record && appointment.medical_record.diagnosis);
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
                                                
                                                {/* Diagnosis Summary Button - Show for all appointments for testing */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openDiagnosisSummary(a.id)}
                                                    disabled={loadingDiagnosis}
                                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                >
                                                    {loadingDiagnosis ? (
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                                                    ) : (
                                                        <FileText className="h-3 w-3 mr-1" />
                                                    )}
                                                    Diagnosis Summary
                                                </Button>
                                                
                                                {/* Debug info */}
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Status: {a.status} | ID: {a.id}
                                                </div>
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

            {/* Diagnosis Summary Modal */}
            <Modal
                isOpen={isDiagnosisModalOpen}
                hasCancel={true}
                onClose={closeDiagnosisSummary}
                maxWidth="4xl"
                canceltext="Close"
                savetext=""
                className="max-h-[95vh] overflow-y-auto w-full"
            >
                {/* Beautiful Header with Gradient Background */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-t-lg -m-6 mb-4 p-5 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl lg:text-2xl font-bold text-white">Diagnosis Summary</h1>
                                <p className="text-blue-100 mt-0.5 text-xs lg:text-sm">
                                    Medical diagnosis and treatment details
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedDiagnosis && (
                    <div className="space-y-6">
                        {/* Patient Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-blue-800 text-base mb-2">
                                        {selectedDiagnosis.appointment?.firstname} {selectedDiagnosis.appointment?.lastname}
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">Appointment Date:</span> {selectedDiagnosis.appointment?.date} at {selectedDiagnosis.appointment?.time}
                                        </p>
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">Service:</span> {selectedDiagnosis.appointment?.service?.servicename || 'General Consultation'}
                                        </p>
                                        {selectedDiagnosis.appointment?.subservice?.subservicename && (
                                            <p className="text-sm text-blue-700">
                                                <span className="font-medium">Subservice:</span> {selectedDiagnosis.appointment.subservice.subservicename}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis Information */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-green-800 text-base">Primary Diagnosis</h3>
                                    <p className="text-sm text-green-600">Medical diagnosis and symptoms</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold text-green-700">Diagnosis</label>
                                    <p className="text-sm text-green-800 bg-white p-3 rounded border">
                                        {selectedDiagnosis.diagnosis}
                                    </p>
                                </div>
                                {selectedDiagnosis.symptoms && (
                                    <div>
                                        <label className="text-sm font-semibold text-green-700">Symptoms</label>
                                        <p className="text-sm text-green-800 bg-white p-3 rounded border">
                                            {selectedDiagnosis.symptoms}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Treatment Plan */}
                        {(selectedDiagnosis.treatment || selectedDiagnosis.treatment_plan || selectedDiagnosis.notes || selectedDiagnosis.assessment || selectedDiagnosis.pertinent_findings) && (
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-500 rounded-lg">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-orange-800 text-base">Treatment Plan & Assessment</h3>
                                        <p className="text-sm text-orange-600">Recommended treatment and medical assessment</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {(selectedDiagnosis.treatment || selectedDiagnosis.treatment_plan) && (
                                        <div>
                                            <label className="text-sm font-semibold text-orange-700">Treatment Plan</label>
                                            <p className="text-sm text-orange-800 bg-white p-3 rounded border">
                                                {selectedDiagnosis.treatment || selectedDiagnosis.treatment_plan}
                                            </p>
                                        </div>
                                    )}
                                    {selectedDiagnosis.assessment && (
                                        <div>
                                            <label className="text-sm font-semibold text-orange-700">Assessment</label>
                                            <p className="text-sm text-orange-800 bg-white p-3 rounded border">
                                                {selectedDiagnosis.assessment}
                                            </p>
                                        </div>
                                    )}
                                    {selectedDiagnosis.pertinent_findings && (
                                        <div>
                                            <label className="text-sm font-semibold text-orange-700">Pertinent Findings</label>
                                            <p className="text-sm text-orange-800 bg-white p-3 rounded border">
                                                {selectedDiagnosis.pertinent_findings}
                                            </p>
                                        </div>
                                    )}
                                    {selectedDiagnosis.notes && (
                                        <div>
                                            <label className="text-sm font-semibold text-orange-700">Additional Notes</label>
                                            <p className="text-sm text-orange-800 bg-white p-3 rounded border">
                                                {selectedDiagnosis.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Doctor Information */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-purple-800 text-base mb-2">Diagnosed by</h3>
                                    <p className="text-sm text-purple-700">
                                        Dr. {selectedDiagnosis.doctor?.firstname} {selectedDiagnosis.doctor?.lastname}
                                    </p>
                                    {selectedDiagnosis.doctor?.license_number && (
                                        <p className="text-xs text-purple-600">
                                            License: {selectedDiagnosis.doctor.license_number}
                                        </p>
                                    )}
                                    <p className="text-xs text-purple-600">
                                        Date: {new Date(selectedDiagnosis.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Toast Notifications */}
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#363636',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    },
                }}
            />
        </AppointmentLayout>
    );
}
