import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/tempo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/tempo/components/ui/card";
import { router } from "@inertiajs/react";
import RescheduleAppointmentModal from "./RescheduleAppointmentModal";
import Modal from "../../../CustomModal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FileText, Eye, Check, Printer } from "lucide-react";

interface PatientTypeSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: (patientType: string) => void;
}

const PatientTypeSelectionModal: React.FC<PatientTypeSelectionModalProps> = ({
    isOpen,
    onClose,
    onProceed,
}) => {
    const [selectedPatientType, setSelectedPatientType] = useState<string>("");
    const [referenceNumber, setReferenceNumber] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [patientData, setPatientData] = useState<any>(null);
    const [appointmentHistory, setAppointmentHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;
    const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
    
    // Diagnosis Summary Modal State
    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState<boolean>(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);
    const [loadingDiagnosis, setLoadingDiagnosis] = useState<boolean>(false);
    const [appointmentsWithDiagnosis, setAppointmentsWithDiagnosis] = useState<Set<number>>(new Set());

    // Check for diagnoses when appointment history is loaded
    useEffect(() => {
        if (appointmentHistory.length > 0) {
            checkAppointmentsForDiagnoses();
        }
    }, [appointmentHistory]);

    const handleProceed = async () => {
        if (selectedPatientType === 'existing' && referenceNumber.trim()) {
            // Look up patient by reference number
            await handleExistingPatientLookup();
        } else if (selectedPatientType === 'new') {
            onProceed(selectedPatientType);
        }
    };

    const handleExistingPatientLookup = async () => {
        if (!referenceNumber.trim()) {
            setErrorMessage('Please enter your reference number');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`/api/patient-lookup/${referenceNumber.trim()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            if (data.success) {
                // Store patient data and fetch appointment history
                setPatientData(data.patient);
                localStorage.setItem('existingPatientData', JSON.stringify(data.patient));
                localStorage.setItem('selectedPatientType', 'existing');
                
                // Fetch appointment history for this patient
                await fetchAppointmentHistory(data.patient.reference_number);
                setShowHistory(true);
            } else {
                setErrorMessage(data.message || 'Reference number not found. Please check your reference number and try again.');
            }
        } catch (error) {
            console.error('Error looking up patient:', error);
            setErrorMessage('An error occurred while looking up your information. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAppointmentHistory = async (referenceNumber: string) => {
        try {
            const response = await fetch(`/api/patient-appointments/${referenceNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            if (data.success) {
                setAppointmentHistory(data.appointments || []);
                setCurrentPage(1); // Reset to first page when new data is loaded
            } else {
                console.error('Error fetching appointment history:', data.message);
                setAppointmentHistory([]);
            }
        } catch (error) {
            console.error('Error fetching appointment history:', error);
            setAppointmentHistory([]);
        }
    };

    const handleReschedule = () => {
        setShowRescheduleModal(true);
    };

    const handleRescheduleClose = () => {
        setShowRescheduleModal(false);
    };

    const handleBackToSelection = () => {
        setShowHistory(false);
        setPatientData(null);
        setAppointmentHistory([]);
        setReferenceNumber("");
        setSelectedPatientType("");
        setErrorMessage("");
        setCurrentPage(1);
    };

    const handleBookNewAppointment = () => {
        onClose();
        router.visit('/appointments');
    };

    // Pagination logic
    const totalPages = Math.ceil(appointmentHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAppointments = appointmentHistory.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Function to fetch diagnosis data for an appointment
    const fetchDiagnosisData = async (appointmentId: number) => {
        setLoadingDiagnosis(true);
        console.log('Fetching diagnosis for appointment ID:', appointmentId);
        try {
            const response = await axios.get(`/appointments/diagnosis/${appointmentId}`);
            console.log('Diagnosis API response:', response.data);
            
            const diagnosis = response.data.diagnosis;
            
            // Check if diagnosis exists and has actual content
            if (diagnosis && diagnosis.diagnosis && diagnosis.diagnosis.trim() !== '') {
                setSelectedDiagnosis(response.data);
                setIsDiagnosisModalOpen(true);
                toast.success('Diagnosis loaded successfully');
            } else {
                console.log('No valid diagnosis found:', diagnosis);
                toast.error('No diagnosis found for this appointment');
            }
        } catch (error) {
            console.error('Error fetching diagnosis:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.status === 404) {
                toast.error('No diagnosis available for this appointment');
            } else if (error.response?.status === 500) {
                toast.error('Server error: ' + (error.response?.data?.error || 'Unknown error'));
            } else {
                toast.error('Failed to load diagnosis data: ' + (error.message || 'Unknown error'));
            }
        } finally {
            setLoadingDiagnosis(false);
        }
    };

    // Function to open diagnosis summary modal
    const openDiagnosisSummary = (appointmentId: number) => {
        fetchDiagnosisData(appointmentId);
    };

    // Function to close diagnosis summary modal
    const closeDiagnosisSummary = () => {
        setIsDiagnosisModalOpen(false);
        setSelectedDiagnosis(null);
    };

    // Function to check if an appointment has a diagnosis
    const hasDiagnosis = async (appointmentId: number): Promise<boolean> => {
        try {
            const response = await axios.get(`/appointments/diagnosis/${appointmentId}`);
            console.log(`Checking diagnosis for appointment ${appointmentId}:`, response.data);
            
            // Check if diagnosis exists and has actual content
            const diagnosis = response.data.diagnosis;
            if (!diagnosis) {
                console.log(`No diagnosis found for appointment ${appointmentId}`);
                return false;
            }
            
            // Check if diagnosis has actual content (not just empty object)
            const hasContent = diagnosis.diagnosis && diagnosis.diagnosis.trim() !== '';
            console.log(`Appointment ${appointmentId} has diagnosis content:`, hasContent);
            
            return hasContent;
        } catch (error) {
            console.log(`Error checking diagnosis for appointment ${appointmentId}:`, error);
            return false;
        }
    };

    // Function to check all appointments for diagnoses
    const checkAppointmentsForDiagnoses = async () => {
        console.log('Checking appointments for diagnoses...', appointmentHistory);
        const appointmentsWithDiagnosisSet = new Set<number>();
        
        for (const appointment of appointmentHistory) {
            try {
                const hasDiagnosisResult = await hasDiagnosis(appointment.id);
                console.log(`Appointment ${appointment.id} has diagnosis:`, hasDiagnosisResult);
                if (hasDiagnosisResult) {
                    appointmentsWithDiagnosisSet.add(appointment.id);
                }
            } catch (error) {
                console.error(`Error checking diagnosis for appointment ${appointment.id}:`, error);
            }
        }
        
        console.log('Appointments with diagnosis:', Array.from(appointmentsWithDiagnosisSet));
        setAppointmentsWithDiagnosis(appointmentsWithDiagnosisSet);
    };

    // Function to print diagnosis summary
    const printDiagnosisSummary = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const diagnosisData = selectedDiagnosis;
            const appointmentData = diagnosisData?.appointment;
            const diagnosis = diagnosisData?.diagnosis || diagnosisData;
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Diagnosis Summary - ${appointmentData?.firstname} ${appointmentData?.lastname}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            font-family: Arial, sans-serif; 
                            font-size: 12px; 
                            line-height: 1.3; 
                            margin: 10px; 
                            max-width: 100%;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 15px; 
                            border-bottom: 2px solid #2563eb; 
                            padding-bottom: 10px; 
                        }
                        .header h1 { 
                            color: #2563eb; 
                            margin: 0; 
                            font-size: 18px; 
                        }
                        .header p { 
                            color: #666; 
                            margin: 2px 0; 
                            font-size: 10px; 
                        }
                        .content { 
                            display: grid; 
                            grid-template-columns: 1fr 1fr; 
                            gap: 10px; 
                            margin-bottom: 10px; 
                        }
                        .section { 
                            padding: 8px; 
                            border: 1px solid #e5e7eb; 
                            border-radius: 4px; 
                            background: #f9fafb; 
                        }
                        .section h3 { 
                            color: #374151; 
                            margin-bottom: 8px; 
                            font-size: 11px; 
                            border-bottom: 1px solid #d1d5db; 
                            padding-bottom: 2px; 
                        }
                        .info-row { 
                            margin-bottom: 4px; 
                            font-size: 10px; 
                        }
                        .label { 
                            font-weight: bold; 
                            color: #374151; 
                            display: inline-block; 
                            width: 80px; 
                        }
                        .value { 
                            color: #6b7280; 
                        }
                        .diagnosis-content { 
                            background: white; 
                            padding: 6px; 
                            border-radius: 3px; 
                            margin-top: 4px; 
                            border: 1px solid #e5e7eb; 
                        }
                        .full-width { 
                            grid-column: 1 / -1; 
                        }
                        .footer { 
                            margin-top: 10px; 
                            text-align: center; 
                            color: #6b7280; 
                            font-size: 9px; 
                            border-top: 1px solid #e5e7eb; 
                            padding-top: 5px; 
                        }
                        @media print { 
                            body { margin: 5px; font-size: 11px; }
                            .content { gap: 8px; }
                            .section { padding: 6px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>DIAGNOSIS SUMMARY</h1>
                        <p>RHU Calumpang Health Center</p>
                        <p>Generated: ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div class="content">
                        <div class="section">
                            <h3>Patient Info</h3>
                            <div class="info-row">
                                <span class="label">Name:</span> 
                                <span class="value">${appointmentData?.firstname || 'N/A'} ${appointmentData?.lastname || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Date:</span> 
                                <span class="value">${appointmentData?.date || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Time:</span> 
                                <span class="value">${appointmentData?.time || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Service:</span> 
                                <span class="value">${appointmentData?.service?.servicename || 'General Consultation'}</span>
                            </div>
                            ${appointmentData?.subservice?.subservicename ? `
                            <div class="info-row">
                                <span class="label">Subservice:</span> 
                                <span class="value">${appointmentData.subservice.subservicename}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div class="section">
                            <h3>Doctor Info</h3>
                            <div class="info-row">
                                <span class="label">Doctor:</span> 
                                <span class="value">Dr. ${diagnosis?.doctor?.firstname || diagnosis?.doctor?.firstname || 'Unknown'} ${diagnosis?.doctor?.lastname || diagnosis?.doctor?.lastname || 'Doctor'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">License:</span> 
                                <span class="value">${diagnosis?.doctor?.license_number || diagnosis?.doctor?.license_number || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Date:</span> 
                                <span class="value">${diagnosis?.created_at ? new Date(diagnosis.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="section full-width">
                            <h3>Medical Diagnosis</h3>
                            <div class="diagnosis-content">
                                <div class="info-row">
                                    <span class="label">Diagnosis:</span>
                                    <div class="value" style="margin-top: 2px; font-size: 10px;">${diagnosis?.diagnosis || diagnosis?.diagnosis || 'No diagnosis available'}</div>
                                </div>
                                ${(diagnosis?.symptoms || diagnosis?.symptoms) ? `
                                <div class="info-row" style="margin-top: 4px;">
                                    <span class="label">Symptoms:</span>
                                    <div class="value" style="margin-top: 2px; font-size: 10px;">${diagnosis?.symptoms || diagnosis?.symptoms}</div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${((diagnosis?.treatment || diagnosis?.treatment) || (diagnosis?.notes || diagnosis?.notes) || (diagnosis?.assessment || diagnosis?.assessment) || (diagnosis?.pertinent_findings || diagnosis?.pertinent_findings)) ? `
                        <div class="section full-width">
                            <h3>Treatment Plan & Assessment</h3>
                            <div class="diagnosis-content">
                                ${(diagnosis?.treatment || diagnosis?.treatment) ? `
                                <div class="info-row">
                                    <span class="label">Treatment Plan:</span>
                                    <div class="value" style="margin-top: 2px; font-size: 10px;">${diagnosis?.treatment || diagnosis?.treatment}</div>
                                </div>
                                ` : ''}
                                ${(diagnosis?.assessment || diagnosis?.assessment) ? `
                                <div class="info-row" style="margin-top: 4px;">
                                    <span class="label">Assessment:</span>
                                    <div class="value" style="margin-top: 2px; font-size: 10px;">${diagnosis?.assessment || diagnosis?.assessment}</div>
                                </div>
                                ` : ''}
                                ${(diagnosis?.pertinent_findings || diagnosis?.pertinent_findings) ? `
                                <div class="info-row" style="margin-top: 4px;">
                                    <span class="label">Pertinent Findings:</span>
                                    <div class="value" style="margin-top: 2px; font-size: 10px;">${diagnosis?.pertinent_findings || diagnosis?.pertinent_findings}</div>
                                </div>
                                ` : ''}
                                ${(diagnosis?.notes || diagnosis?.notes) ? `
                                <div class="info-row" style="margin-top: 4px;">
                                    <span class="label">Additional Notes:</span>
                                    <div class="value" style="margin-top: 2px; font-size: 10px;">${diagnosis?.notes || diagnosis?.notes}</div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="footer">
                        <p>Generated electronically - RHU Calumpang Health Center ${new Date().getFullYear()}</p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto border border-gray-100">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Patient Type Selection</h2>
                                <p className="text-gray-600">Please select your patient type to continue</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-8">
                        {showHistory && patientData ? (
                            // Appointment History View
                            <div className="space-y-6">
                                {/* Patient Welcome */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-blue-900">
                                                Welcome back, {patientData.firstname} {patientData.lastname}!
                                            </h3>
                                            <p className="text-blue-700">
                                                Here's your appointment history. You can book a new appointment.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment History */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold text-gray-900">Your Appointment History</h4>
                                        {appointmentHistory.length > 0 && (
                                            <span className="text-sm text-gray-500">
                                                Showing {startIndex + 1}-{Math.min(endIndex, appointmentHistory.length)} of {appointmentHistory.length} appointments
                                            </span>
                                        )}
                                    </div>
                                    {appointmentHistory.length > 0 ? (
                                        <div className="space-y-4">
                                            {currentAppointments.map((appointment, index) => (
                                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <span className="font-semibold text-gray-900">
                                                                    {appointment.service?.servicename || 'Service'}
                                                                </span>
                                                                {appointment.subservice && (
                                                                    <span className="text-sm text-gray-600">
                                                                        - {appointment.subservice.subservicename}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-600 space-y-1">
                                                                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                                                                <p><strong>Time:</strong> {appointment.time}</p>
                                                                <p><strong>Reference:</strong> {appointment.reference_number}</p>
                                                                <p><strong>Status:</strong> 
                                                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                                                        appointment.status === 1 ? 'bg-blue-100 text-blue-800' :
                                                                        appointment.status === 2 ? 'bg-green-100 text-green-800' :
                                                                        appointment.status === 3 ? 'bg-red-100 text-red-800' :
                                                                        appointment.status === 4 ? 'bg-red-100 text-red-800' :
                                                                        appointment.status === 5 ? 'bg-green-100 text-green-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {appointment.status === 1 ? 'Scheduled' :
                                                                         appointment.status === 2 ? 'Completed' :
                                                                         appointment.status === 3 ? 'Cancelled' :
                                                                         appointment.status === 4 ? 'Declined' :
                                                                         appointment.status === 5 ? 'Confirmed' :
                                                                         'Unknown'}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            
                                                            {/* Diagnosis Summary Button - Only show if appointment has diagnosis */}
                                                            <div className="mt-3">
                                                                {appointmentsWithDiagnosis.has(appointment.id) ? (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => openDiagnosisSummary(appointment.id)}
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
                                                                ) : (
                                                                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                        No diagnosis available
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Debug info */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                            <p>No appointment history found.</p>
                                        </div>
                                    )}

                                    {/* Pagination Controls */}
                                    {appointmentHistory.length > itemsPerPage && (
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    onClick={handlePreviousPage}
                                                    disabled={currentPage === 1}
                                                    variant="outline"
                                                    size="sm"
                                                    className="px-3 py-1"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                                    </svg>
                                                    Previous
                                                </Button>
                                                
                                                <div className="flex items-center space-x-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                        <Button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            variant={currentPage === page ? "default" : "outline"}
                                                            size="sm"
                                                            className={`px-3 py-1 ${
                                                                currentPage === page 
                                                                    ? 'bg-blue-600 text-white' 
                                                                    : 'hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </Button>
                                                    ))}
                                                </div>
                                                
                                                <Button
                                                    onClick={handleNextPage}
                                                    disabled={currentPage === totalPages}
                                                    variant="outline"
                                                    size="sm"
                                                    className="px-3 py-1"
                                                >
                                                    Next
                                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                    </svg>
                                                </Button>
                                            </div>
                                            
                                            <div className="text-sm text-gray-500">
                                                Page {currentPage} of {totalPages}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <Button 
                                        onClick={handleBackToSelection}
                                        variant="outline"
                                        className="px-6 py-2"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                        </svg>
                                        Back to Selection
                                    </Button>
                                    <div className="flex justify-center">
                                        <Button 
                                            onClick={handleBookNewAppointment}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                            Book New Appointment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Original Patient Type Selection View
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side - Patient Type Selection */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        Select Patient Type
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Please choose whether you are a new patient or an existing patient.
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <div 
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                selectedPatientType === 'new' 
                                                    ? 'border-green-500 bg-green-50 shadow-md' 
                                                    : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                                            }`}
                                            onClick={() => setSelectedPatientType('new')}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                    selectedPatientType === 'new' 
                                                        ? 'border-green-500 bg-green-500' 
                                                        : 'border-gray-300'
                                                }`}>
                                                    {selectedPatientType === 'new' && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">New Patient</h4>
                                                    <p className="text-sm text-gray-600">First time visiting our clinic</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                selectedPatientType === 'existing' 
                                                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                            onClick={() => setSelectedPatientType('existing')}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                    selectedPatientType === 'existing' 
                                                        ? 'border-blue-500 bg-blue-500' 
                                                        : 'border-gray-300'
                                                }`}>
                                                    {selectedPatientType === 'existing' && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Existing Patient</h4>
                                                    <p className="text-sm text-gray-600">Previously visited our clinic</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reference Number Input for Existing Patients */}
                                        {selectedPatientType === 'existing' && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Reference Number from Last Appointment
                                                </label>
                                                <input
                                                    type="text"
                                                    value={referenceNumber}
                                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                                    placeholder="Enter your reference number (e.g., REF-2024-001234)"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <p className="text-xs text-gray-600 mt-1">
                                                    You can find this on your previous appointment confirmation email or SMS.
                                                </p>
                                                {errorMessage && (
                                                    <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Quick Actions */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        Quick Actions
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Need to change your existing appointment?
                                    </p>
                                    
                                    <div className="space-y-3">
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start text-left h-auto p-4 border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                                            onClick={handleReschedule}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">Reschedule Appointment</div>
                                                    <div className="text-xs text-gray-600">Change your existing appointment</div>
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer - Only show when not in history view */}
                    {!showHistory && (
                        <div className="flex justify-end space-x-4 p-8 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                            <Button 
                                onClick={onClose}
                                variant="outline"
                                className="px-6 py-3"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleProceed}
                                disabled={!selectedPatientType || (selectedPatientType === 'existing' && !referenceNumber.trim()) || isLoading}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Looking up...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        {selectedPatientType === 'existing' ? 'Lookup & Continue' : 'Continue to Verification'}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reschedule Appointment Modal */}
            <RescheduleAppointmentModal
                isOpen={showRescheduleModal}
                onClose={handleRescheduleClose}
                onReschedule={() => {}}
            />

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
                        
                        {/* Print Button */}
                        <div className="flex-shrink-0">
                            <Button
                                onClick={printDiagnosisSummary}
                                variant="outline"
                                size="sm"
                                className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                            </Button>
                        </div>
                    </div>
                </div>

                {selectedDiagnosis && selectedDiagnosis.diagnosis && (
                    <div className="space-y-6">
                        {/* Patient Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-blue-800 text-base mb-2">
                                        {selectedDiagnosis.appointment?.firstname || 'Unknown'} {selectedDiagnosis.appointment?.lastname || 'Patient'}
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">Appointment Date:</span> {selectedDiagnosis.appointment?.date || 'N/A'} at {selectedDiagnosis.appointment?.time || 'N/A'}
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
                                        {selectedDiagnosis.diagnosis?.diagnosis || selectedDiagnosis.diagnosis || 'No diagnosis available'}
                                    </p>
                                </div>
                                {(selectedDiagnosis.diagnosis?.symptoms || selectedDiagnosis.symptoms) && (
                                    <div>
                                        <label className="text-sm font-semibold text-green-700">Symptoms</label>
                                        <p className="text-sm text-green-800 bg-white p-3 rounded border">
                                            {selectedDiagnosis.diagnosis?.symptoms || selectedDiagnosis.symptoms}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Treatment Plan */}
                        {((selectedDiagnosis.diagnosis?.treatment || selectedDiagnosis.treatment) || (selectedDiagnosis.diagnosis?.notes || selectedDiagnosis.notes)) && (
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-500 rounded-lg">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-orange-800 text-base">Treatment Plan</h3>
                                        <p className="text-sm text-orange-600">Recommended treatment and follow-up</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {(selectedDiagnosis.diagnosis?.treatment || selectedDiagnosis.treatment) && (
                                        <div>
                                            <label className="text-sm font-semibold text-orange-700">Treatment</label>
                                            <p className="text-sm text-orange-800 bg-white p-3 rounded border">
                                                {selectedDiagnosis.diagnosis?.treatment || selectedDiagnosis.treatment}
                                            </p>
                                        </div>
                                    )}
                                    {(selectedDiagnosis.diagnosis?.notes || selectedDiagnosis.notes) && (
                                        <div>
                                            <label className="text-sm font-semibold text-orange-700">Assessment</label>
                                            <p className="text-sm text-orange-800 bg-white p-3 rounded border">
                                                {selectedDiagnosis.diagnosis?.notes || selectedDiagnosis.notes}
                                            </p>
                                        </div>
                                    )}
                                    {(selectedDiagnosis.diagnosis?.pertinent_findings || selectedDiagnosis.pertinent_findings) && (
                                        <div>
                                            <label className="text-sm font-semibold text-orange-700">Pertinent Findings</label>
                                            <p className="text-sm text-orange-800 bg-white p-3 rounded border">
                                                {selectedDiagnosis.diagnosis?.pertinent_findings || selectedDiagnosis.pertinent_findings}
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
                                        Dr. {selectedDiagnosis.diagnosis?.doctor?.firstname || selectedDiagnosis.doctor?.firstname || 'Unknown'} {selectedDiagnosis.diagnosis?.doctor?.lastname || selectedDiagnosis.doctor?.lastname || 'Doctor'}
                                    </p>
                                    <p className="text-sm text-purple-700">
                                        License: {selectedDiagnosis.diagnosis?.doctor?.license_number || selectedDiagnosis.doctor?.license_number || 'N/A'}
                                    </p>
                                    <p className="text-xs text-purple-600">
                                        Date: {selectedDiagnosis.diagnosis?.created_at ? new Date(selectedDiagnosis.diagnosis.created_at).toLocaleDateString() : selectedDiagnosis.created_at ? new Date(selectedDiagnosis.created_at).toLocaleDateString() : 'N/A'}
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
        </div>
    );
};

export default PatientTypeSelectionModal;
