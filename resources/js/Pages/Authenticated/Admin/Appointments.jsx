import AdminLayout from "@/Layouts/AdminLayout";
import React, { useEffect, useState } from "react";
import { inertia, motion } from "framer-motion";
import moment from "moment";
import Sidebar from "@/components/tempo/admin/include/Sidebar";
import {
    Search,
    Filter,
    UserPlus,
    ChevronDown,
    ChevronUp,
    Download,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Eye,
    ArrowUpCircle,
    Stethoscope,
    FileText,
    CheckCircle,
    User,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/tempo/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

import Modal from "@/components/CustomModal";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableCaption,
    SortableTable,
    SortableTableHead,
} from "@/components/tempo/components/ui/table2";
import { usePage, router, useForm } from "@inertiajs/react";
import PrimaryButton from "@/components/PrimaryButton";
import DangerButton from "@/components/DangerButton";
import Label from "@/components/InputLabel";
import InputError from "@/components/InputError";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { toastError, toastSuccess, toastWarning } from "@/utils/toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/tempo/components/ui/alert-dialog";
// Mock data for appointments
const mockAppointments = [
    {
        id: "AP001",
        // user?.firstname: "Maria Santos",
        user_id: "P12345",
        date: "2023-06-15",
        time: "09:00 AM",
        doctor: "Dr. Reyes",
        // user?.service.servicename: "General Checkup",
        status: "Completed",
        avatar: "maria",
    },
    {
        id: "AP002",
        // user?.firstname: "Juan Cruz",
        user_id: "P12346",
        date: "2023-06-15",
        time: "10:30 AM",
        doctor: "Dr. Santos",
        // user?.service.servicename: "Vaccination",
        status: "Completed",
        avatar: "juan",
    },
    {
        id: "AP003",
        // user?.firstname: "Elena Magtanggol",
        user_id: "P12347",
        date: "2023-06-15",
        time: "01:00 PM",
        doctor: "Dr. Reyes",
        // user?.service.servicename: "Prenatal Checkup",
        status: "Cancelled",
        avatar: "elena",
    },
    {
        id: "AP004",
        // user?.firstname: "Pedro Penduko",
        user_id: "P12348",
        date: "2023-06-16",
        time: "11:00 AM",
        doctor: "Dr. Santos",
        // user?.service.servicename: "Blood Test",
        status: "Scheduled",
        avatar: "pedro",
    },
    {
        id: "AP005",
        // user?.firstname: "Lorna Diaz",
        user_id: "P12349",
        date: "2023-06-16",
        time: "02:30 PM",
        doctor: "Dr. Reyes",
        // user?.service.servicename: "Follow-up",
        status: "Scheduled",
        avatar: "lorna",
    },
];

export default function appointments({ appointments_, activeServices }) {
    
    const [appointments, setAppointments] = useState(appointments_.data || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [purposeFilter, setPurposeFilter] = useState("all");
    const [dateTimeFilter, setDateTimeFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "ascending",
    });
    const [showFilters, setShowFilters] = useState(false);

    // Filtering and sorting logic
    const getFilteredAndSortedAppointments = () => {
        // Debug: Log appointment data structure
        if (appointments.length > 0) {
            console.log('Sample appointment data:', appointments[0]);
            console.log('Appointment status type:', typeof appointments[0]?.status);
            console.log('Appointment status value:', appointments[0]?.status);
            
            // Debug: Log all unique status values
            const uniqueStatuses = [...new Set(appointments.map(a => a.status).filter(Boolean))];
            console.log('All unique status values in appointments:', uniqueStatuses);
        }
        
        // Debug: Log active services
        if (activeServices && activeServices.length > 0) {
            console.log('Active services available:', activeServices);
        }
        
        // Debug: Test status filtering
        console.log('Simple test - appointments with status 1:', appointments.filter(a => a.status === 1).length);
        console.log('Simple test - appointments with status "1":', appointments.filter(a => a.status === '1').length);
        console.log('Simple test - appointments with status "scheduled":', appointments.filter(a => a.status === 'scheduled').length);
        
        let filtered = appointments.filter(appointment => {
            const matchesSearch = !searchTerm || 
                appointment.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.phone?.includes(searchTerm);

            const matchesStatus = statusFilter === "all" || (() => {
                if (!appointment.status) return false;
                
                // Handle numeric status values
                const statusMapping = {
                    'scheduled': 1,
                    'confirmed': 5,
                    'completed': 2,
                    'cancelled': 3,
                    'declined': 4,
                    'archived': 6
                };
                
                const appointmentStatus = appointment.status;
                const filterStatus = statusFilter.toLowerCase().trim();
                
                // Check if it's a numeric status
                if (typeof appointmentStatus === 'number' || !isNaN(appointmentStatus)) {
                    const statusNum = parseInt(appointmentStatus);
                    const expectedStatus = statusMapping[filterStatus];
                    const matches = expectedStatus === statusNum;
                    
                    if (statusFilter !== "all") {
                        console.log(`Status filter: ${filterStatus} (${expectedStatus}), Appointment status: ${statusNum}, Matches: ${matches}`);
                    }
                    
                    return matches;
                }
                
                // Fallback to string comparison
                const appointmentStatusStr = String(appointment.status).toLowerCase().trim();
                const filterStatusStr = statusFilter.toLowerCase().trim();
                return appointmentStatusStr === filterStatusStr;
            })();
            
            const matchesPurpose = purposeFilter === "all" || (() => {
                if (!appointment.service?.servicename) return false;
                const appointmentPurpose = String(appointment.service.servicename).toLowerCase().trim();
                const filterPurpose = purposeFilter.toLowerCase().trim();
                
                // Debug logging for purpose filtering
                if (purposeFilter !== "all") {
                    console.log(`Purpose filter: ${filterPurpose}, Appointment purpose: ${appointmentPurpose}, Matches: ${appointmentPurpose === filterPurpose}`);
                }
                
                return appointmentPurpose === filterPurpose;
            })();

            const matchesDateTime = dateTimeFilter === "all" || (() => {
                if (!appointment.date) return false;
                const appointmentDate = new Date(appointment.date);
                const now = new Date();
                
                // Handle time-based filters
                if (dateTimeFilter === "morning" || dateTimeFilter === "afternoon" || dateTimeFilter === "evening") {
                    const appointmentTime = new Date(appointment.date + ' ' + (appointment.time || '00:00:00'));
                    const hour = appointmentTime.getHours();
                    
                    switch (dateTimeFilter) {
                        case "morning": return hour >= 6 && hour < 12;
                        case "afternoon": return hour >= 12 && hour < 18;
                        case "evening": return hour >= 18 && hour < 24;
                        default: return true;
                    }
                }
                
                // Handle date-based filters
                switch (dateTimeFilter) {
                    case "today": return appointmentDate.toDateString() === now.toDateString();
                    case "week": return (now - appointmentDate) <= 7 * 24 * 60 * 60 * 1000;
                    case "month": return (now - appointmentDate) <= 30 * 24 * 60 * 60 * 1000;
                    case "year": return appointmentDate.getFullYear() === now.getFullYear();
                    case "upcoming": return appointmentDate > now;
                    case "past": return appointmentDate < now;
                    default: return true;
                }
            })();

            return matchesSearch && matchesStatus && matchesPurpose && matchesDateTime;
        });

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle nested properties
            if (sortConfig.key.includes('.')) {
                const keys = sortConfig.key.split('.');
                aValue = keys.reduce((obj, key) => obj?.[key], a);
                bValue = keys.reduce((obj, key) => obj?.[key], b);
            }

            // Handle numerical sorting for ID field
            if (sortConfig.key === 'id') {
                aValue = parseInt(aValue) || 0;
                bValue = parseInt(bValue) || 0;
            }
            // Handle date sorting
            else if (sortConfig.key === 'date' || sortConfig.key === 'created_at') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    };

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending"
        }));
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setPurposeFilter("all");
        setDateTimeFilter("all");
    };

    // Helper function to safely format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            // Format with more detail: "Wednesday, Oct 8, 2025"
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

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

    // Helper function to format datetime to 12-hour format with AM/PM
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'Not specified';
        try {
            const date = new Date(dateTimeString);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return 'Invalid time';
        }
    };

    // Helper function to safely format date for ID generation
    const formatDateForId = (dateString) => {
        if (!dateString) return 'UNKNOWN';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'UNKNOWN';
            return date.toISOString().slice(0, 10).replace(/-/g, '');
        } catch (error) {
            return 'UNKNOWN';
        }
    };

    // Filter appointments based on search term and status
    const filteredAppointments = (appointments || []).filter((appointment) => {
        const matchesSearch =
            appointment.firstname
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.lastname
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.middlename
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.phone
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.reference_number
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
        //|| appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || appointment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort appointments
    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key.includes('.')) {
            const keys = sortConfig.key.split('.');
            valA = keys.reduce((obj, key) => obj?.[key], a);
            valB = keys.reduce((obj, key) => obj?.[key], b);
        }

        // Handle undefined/null values
        if (valA == null) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valB == null) return sortConfig.direction === "ascending" ? 1 : -1;

        // Handle numerical sorting for ID field
        if (sortConfig.key === 'id') {
            valA = parseInt(valA) || 0;
            valB = parseInt(valB) || 0;
        }

        // String comparison (case insensitive)
        if (typeof valA === "string" && typeof valB === "string") {
            const compareResult = valA
                .toLowerCase()
                .localeCompare(valB.toLowerCase());
            return sortConfig.direction === "ascending"
                ? compareResult
                : -compareResult;
        }

        // Number comparison
        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;

        return 0;
    });

    // Request sort
    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };


    const tools = () => {
        return (
            <>
                {/* Create Diagnosis moved to Patient Records page */}
            </>
        );
    };

    // Helper function to get status badge with consistent styling
    const getStatusBadge = (status) => {
        if (!status) return null;
        
        switch (status) {
            case 1:
                return (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Scheduled
                    </Badge>
                );
            case 2:
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Completed
                    </Badge>
                );
            case 3:
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        Cancelled
                    </Badge>
                );
            case 4:
                return (
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                        Declined
                    </Badge>
                );
            case 5:
                return (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                        Confirmed
                    </Badge>
                );
            case 6:
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        Archived
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        Unknown
                    </Badge>
                );
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientAppointments, setPatientAppointments] = useState([]);

    const [appointment_, setAppointment_] = useState({});

    const { data, setData, processing, recentlySuccessful, errors, post } =
        useForm({
            status: null,
        });

    // Diagnosis form
    const { 
        data: diagnosisData, 
        setData: setDiagnosisData, 
        processing: diagnosisProcessing, 
        errors: diagnosisErrors, 
        post: postDiagnosis 
    } = useForm({
        diagnosis: '',
        symptoms: '',
        treatment_plan: '',
        notes: '',
        pertinent_findings: ''
    });

    const openModal = (e, appointment) => {
        //alert('wew')
        fetch(`/auth/appointment/get/${appointment}`)
            .then((resp) => resp.json())
            .then((data) => {
                //console.log(data);
                setAppointment_(data);

                setData("status", data.status);
            });
        setIsModalOpen(true);
        //console.log(id);
    };

    const closeModal = (e) => {
        setIsModalOpen(false);
    };

    // Open diagnosis modal with patient selection
    const openDiagnosisModal = () => {
        setSelectedAppointment(null);
        setSelectedPatientId("");
        setSelectedPatient(null);
        setPatientAppointments([]);
        setDiagnosisData({
            diagnosis: '',
            symptoms: '',
            treatment_plan: '',
            notes: ''
        });
        setIsDiagnosisModalOpen(true);
    };

    // Close diagnosis modal
    const closeDiagnosisModal = () => {
        setIsDiagnosisModalOpen(false);
        setSelectedAppointment(null);
        setSelectedPatientId("");
        setSelectedPatient(null);
        setPatientAppointments([]);
        setDiagnosisData({
            diagnosis: '',
            symptoms: '',
            treatment_plan: '',
            notes: ''
        });
    };

    // Handle patient selection (first dropdown)
    const handlePatientSelection = (patientId) => {
        setSelectedPatientId(patientId);
        const patient = appointments.find(apt => apt.id === parseInt(patientId));
        setSelectedPatient(patient);
        
        // Get all appointments for this patient
        const patientApps = appointments.filter(apt => 
            apt.firstname === patient.firstname && 
            apt.lastname === patient.lastname &&
            apt.status === 5 // Only confirmed appointments
        );
        setPatientAppointments(patientApps);
        
        // Reset appointment selection
        setSelectedAppointment(null);
    };

    // Handle appointment selection (second dropdown)
    const handleAppointmentSelection = (appointmentId) => {
        const appointment = patientAppointments.find(apt => apt.id === parseInt(appointmentId));
        setSelectedAppointment(appointment);
    };

    // Get unique patients (one per patient name) - only confirmed appointments, no archived
    const getUniquePatients = () => {
        const uniquePatients = [];
        const seenPatients = new Set();
        
        appointments.forEach(appointment => {
            // Only include confirmed appointments (status = 5) and exclude archived (status = 6)
            if (appointment.status === 5) {
                const patientKey = `${appointment.firstname}_${appointment.lastname}`;
                if (!seenPatients.has(patientKey)) {
                    seenPatients.add(patientKey);
                    uniquePatients.push(appointment);
                }
            }
        });
        
        return uniquePatients;
    };

    // Handle diagnosis submission
    const handleDiagnosisSubmit = (e) => {
        e.preventDefault();
        
        console.log('=== DIAGNOSIS FORM SUBMISSION STARTED ===');
        console.log('Form submission started');
        console.log('Selected Appointment:', selectedAppointment);
        console.log('Diagnosis Data:', diagnosisData);
        
        // Validation
        if (!selectedAppointment) {
            toastError("Appointment Selection Required", "Please select a patient and their appointment.");
            return;
        }

        if (!selectedAppointment.id) {
            toastError("Invalid Appointment", "The selected appointment does not have a valid ID.");
            return;
        }

        if (!diagnosisData.diagnosis.trim()) {
            toastError("Diagnosis Required", "Please enter a diagnosis.");
            return;
        }

        if (!diagnosisData.symptoms.trim()) {
            toastError("Symptoms Required", "Please describe the symptoms.");
            return;
        }

        console.log('Submitting diagnosis for appointment:', selectedAppointment.id);
        
        // Use the admin appointments diagnose route
        const diagnosisRoute = route('admin.appointments.diagnose');
        console.log('Route found:', diagnosisRoute);
        
        console.log('Form data being sent:', {
            appointment_id: selectedAppointment.id,
            diagnosis: diagnosisData.diagnosis,
            symptoms: diagnosisData.symptoms,
            treatment_plan: diagnosisData.treatment_plan,
            notes: diagnosisData.notes,
            pertinent_findings: diagnosisData.pertinent_findings
        });
        
        // Debug: Check if selectedAppointment has an id
        console.log('Selected appointment object:', selectedAppointment);
        console.log('Selected appointment ID:', selectedAppointment?.id);
        
        // Use axios directly to ensure proper data sending
        axios.post(diagnosisRoute, {
            appointment_id: selectedAppointment.id,
            diagnosis: diagnosisData.diagnosis,
            symptoms: diagnosisData.symptoms,
            treatment_plan: diagnosisData.treatment_plan,
            notes: diagnosisData.notes,
            pertinent_findings: diagnosisData.pertinent_findings
        }).then(response => {
            console.log('Diagnosis submission successful:', response.data);
            toastSuccess(
                "Diagnosis Added Successfully",
                "The diagnosis has been recorded for this appointment."
            );
            closeDiagnosisModal();
            router.reload({ only: ["appointments_"] });
        }).catch(error => {
            console.error('Diagnosis submission failed:', error.response?.data || error.message);
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = [];
                if (errors.appointment_id) {
                    errorMessages.push(`Appointment: ${Array.isArray(errors.appointment_id) ? errors.appointment_id[0] : errors.appointment_id}`);
                }
                if (errors.diagnosis) {
                    errorMessages.push(`Diagnosis: ${Array.isArray(errors.diagnosis) ? errors.diagnosis[0] : errors.diagnosis}`);
                }
                if (errors.symptoms) {
                    errorMessages.push(`Symptoms: ${Array.isArray(errors.symptoms) ? errors.symptoms[0] : errors.symptoms}`);
                }
                if (errors.treatment_plan) {
                    errorMessages.push(`Treatment Plan: ${Array.isArray(errors.treatment_plan) ? errors.treatment_plan[0] : errors.treatment_plan}`);
                }
                if (errors.notes) {
                    errorMessages.push(`Notes: ${Array.isArray(errors.notes) ? errors.notes[0] : errors.notes}`);
                }
                if (errorMessages.length > 0) {
                    toastError("Diagnosis Submission Failed", errorMessages.join('\n'));
                } else {
                    toastError("Diagnosis Submission Failed", "An error occurred while submitting the diagnosis. Please check your inputs and try again.");
                }
            } else {
                toastError("Diagnosis Submission Failed", "An unexpected error occurred. Please try again.");
            }
        });
    };

    const { inertia } = usePage();

    // Add new state for confirmation dialog
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        type: null, // 'archive' or 'unarchive'
        appointmentId: null
    });

    // Update archive function (mirror Services' axios pattern)
    const handleArchiveAppointment = async (id) => {
        try {
            const response = await axios.post('/auth/appointments/archive', {
                appointment_id: id,
            });

            toast.success(response.data?.message || 'Appointment archived successfully');
            router.reload({ only: ["appointments_"] });
        } catch (error) {
            console.error('Error archiving appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to archive appointment');
        } finally {
            setConfirmDialog({ isOpen: false, type: null, appointmentId: null });
        }
    };

    // Update unarchive function (mirror Services' axios pattern)
    const handleUnarchiveAppointment = async (id) => {
        try {
            const response = await axios.post('/auth/appointments/unarchive', {
                appointment_id: id,
            });

            toast.success(response.data?.message || 'Appointment restored successfully');
            router.reload({ only: ["appointments_"] });
        } catch (error) {
            console.error('Error restoring appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to restore appointment');
        } finally {
            setConfirmDialog({ isOpen: false, type: null, appointmentId: null });
        }
    };

    useEffect(() => {
        setAppointments(appointments_.data);
    }, [appointments_]);

    const SaveStatus = (e) => {
        e.preventDefault();
        post(
            route("admin.appointment.status.update", {
                appointment: appointment_.id,
            }),
            {
                onSuccess: () => {
                    closeModal();
                    // inertia.get(route("admin.appointments"), {
                    //     only: ["appointments"],
                    // });
                    alert_toast(
                        "Success!",
                        "Status updated successfully!",
                        "success"
                    );
                    router.reload({ only: ["appointments_"] });
                },
            }
        );
    };

    const { links } = usePage().props.appointments_;

    // Early return if no appointments data
    if (!appointments || appointments.length === 0) {
        return (
            <AdminLayout header="Appointments" tools={tools()}>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No appointments found.</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout header="Appointments" tools={tools()}>
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Header Section */}
                <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                All Appointments
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage and track all appointment records
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                <Input
                                    type="text"
                                    placeholder="Search by name, reference, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full md:w-[300px] bg-gray-50 border-gray-200 focus:border-primary"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                            {(searchTerm || statusFilter !== "all" || purposeFilter !== "all" || dateTimeFilter !== "all") && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="declined">Declined</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Purpose</label>
                                <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Purposes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Purposes</SelectItem>
                                        {activeServices && activeServices.map((service) => (
                                            <SelectItem key={service.id} value={service.servicename.toLowerCase()}>
                                                {service.servicename}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Date & Time</label>
                                <Select value={dateTimeFilter} onValueChange={setDateTimeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Dates" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Dates</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="week">This Week</SelectItem>
                                        <SelectItem value="month">This Month</SelectItem>
                                        <SelectItem value="year">This Year</SelectItem>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="past">Past</SelectItem>
                                        <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                                        <SelectItem value="afternoon">Afternoon (12PM-6PM)</SelectItem>
                                        <SelectItem value="evening">Evening (6PM-12AM)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                        Showing {getFilteredAndSortedAppointments().length} of {appointments.length} appointments
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <SortableTable
                            data={getFilteredAndSortedAppointments()}
                            defaultSort={{
                                key: "firstname",
                                direction: "asc",
                            }}
                        >
                            {({ sortedData }) => (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <SortableTableHead sortKey="id" sortable>
                                                Appointment ID
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="user.firstname"
                                                sortable
                                            >
                                                Patient
                                            </SortableTableHead>
                                            <SortableTableHead sortKey="date" sortable>
                                                Date & Time
                                            </SortableTableHead>
                                            <SortableTableHead sortKey="created_at" sortable>
                                                Created Date & Time
                                            </SortableTableHead>
                                            <SortableTableHead sortKey="service.servicename" sortable>
                                                Purpose
                                            </SortableTableHead>
                                            <SortableTableHead sortKey="status" sortable>
                                                Status
                                            </SortableTableHead>
                                            <SortableTableHead>
                                                Actions
                                            </SortableTableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedData.length <= 0 && (
                                            <div className=" m-5">
                                                No Records Available.
                                            </div>
                                        )}
                                        {sortedData.map((aa, i) => (
                                            <TableRow
                                                key={i}
                                                className="hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 bg-purple-100 rounded">
                                                            <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="font-semibold text-gray-800">
                                                            #{aa.id}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={aa.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${aa.firstname}`}
                                                                alt={aa.firstname || 'Patient'}
                                                            />
                                                            <AvatarFallback>
                                                                {aa.firstname
                                                                    ?.split(" ")
                                                                    ?.map(
                                                                        (n) =>
                                                                            n[0]
                                                                    )
                                                                    ?.join("") || "N/A"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">
                                                                {`${aa.firstname || ''} ${aa.middlename || ''} ${aa.lastname || ''}`.trim()}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Patient ID: {aa.patient?.patient_id || `PAT_${aa.firstname?.substring(0, 3).toUpperCase()}_${aa.lastname?.substring(0, 3).toUpperCase()}_${formatDateForId(aa.created_at)}`}
                                                            </div>
                                                            <div className="text-xs text-blue-600">
                                                                Patient
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1 bg-blue-100 rounded">
                                                                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="font-semibold text-gray-800">
                                                                {formatDate(aa.date)}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-6">
                                                            <div className="p-1 bg-green-100 rounded">
                                                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-600">
                                                                {formatTime(aa.time)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1 bg-purple-100 rounded">
                                                                <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="font-semibold text-gray-800">
                                                                {formatDate(aa.created_at)}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-6">
                                                            <div className="p-1 bg-orange-100 rounded">
                                                                <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-600">
                                                                {formatDateTime(aa.created_at)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {aa.service?.servicename}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(aa.status)}
                                                </TableCell>
                                                <TableCell className="flex items-center gap-3">
                                                    <div className="flex items-center space-x-2">
                                                        <PrimaryButton
                                                            onClick={(e) => {
                                                                openModal(e, aa.id);
                                                            }}
                                                            className="inline-flex items-center p-2 rounded-full hover:bg-gray-100"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </PrimaryButton>


                                                        {aa.status !== 6 ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setConfirmDialog({
                                                                    isOpen: true,
                                                                    type: 'archive',
                                                                    appointmentId: aa.id
                                                                })}
                                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Archive
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setConfirmDialog({
                                                                    isOpen: true,
                                                                    type: 'unarchive',
                                                                    appointmentId: aa.id
                                                                })}
                                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors duration-200"
                                                            >
                                                                <ArrowUpCircle className="h-4 w-4 mr-2" />
                                                                Restore
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </SortableTable>
                    </div>
                </div>

                {/* Pagination Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{appointments_.from}</span> to{" "}
                        <span className="font-medium">{appointments_.to}</span> of{" "}
                        <span className="font-medium">{appointments_.total}</span> Results
                    </div>
                    <div className="flex gap-2">
                        {links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url || link.active}
                                onClick={() => link.url && router.get(link.url)}
                                className="min-w-[40px] h-[36px]"
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
                </div>
            </motion.div>
            <Modal
                isOpen={isModalOpen}
                hasCancel={true}
                onClose={closeModal}
                maxWidth="7xl"
                canceltext="Close"
                savetext=""
                className="max-h-[95vh] overflow-y-auto w-full"
            >
                {/* Beautiful Header with Gradient Background */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-t-lg -m-6 mb-4 p-5 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl lg:text-2xl font-bold text-white">Appointment Details</h1>
                                <p className="text-blue-100 mt-0.5 text-xs lg:text-sm">
                                    Comprehensive appointment information and management
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-right">
                                <p className="text-blue-100 text-xs font-medium mb-0.5">Status</p>
                                <Badge 
                                    className={`${
                                        data.status == 1 ? 'bg-blue-500 text-white border-blue-400' :
                                        data.status == 5 ? 'bg-green-500 text-white border-green-400' :
                                        data.status == 4 ? 'bg-red-500 text-white border-red-400' :
                                        'bg-gray-500 text-white border-gray-400'
                                    } text-xs font-semibold px-3 py-1 whitespace-nowrap`}
                                >
                                    {data.status == 1 ? 'Scheduled' : 
                                     data.status == 5 ? 'Confirmed' : 
                                     data.status == 4 ? 'Declined' : 'Unknown'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                    {/* Patient Information Card */}
                    <div className="xl:col-span-3">
                        <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
                            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Patient Information</h3>
                                        <p className="text-xs text-gray-600 mt-0.5">Personal details and contact information</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 space-y-3">
                                {/* Profile Picture */}
                                {appointment_?.profile_picture && (
                                    <div className="flex justify-center mb-4">
                                        <div className="relative">
                                            <Avatar className="w-20 h-20 border-4 border-blue-200 shadow-lg">
                                                <AvatarImage
                                                    src={appointment_.profile_picture}
                                                    alt={appointment_.firstname || 'Patient'}
                                                />
                                                <AvatarFallback>
                                                    {appointment_.firstname
                                                        ?.split(" ")
                                                        ?.map((n) => n[0])
                                                        ?.join("") || "N/A"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Patient Type Indicator */}
                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
                                    <div className="p-1.5 bg-blue-500 rounded-md">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-blue-800">Appointment Patient</span>
                                        <p className="text-[10px] text-blue-600">Verified record</p>
                                    </div>
                                </div>

                                {/* Patient Information Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {/* Full Name - Featured */}
                                    <div className="sm:col-span-2 lg:col-span-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-blue-500 rounded-md">
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-blue-700">Full Name</p>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">
                                            {appointment_ ? `${appointment_.firstname || ''} ${appointment_.middlename || ''} ${appointment_.lastname || ''}`.trim() : 'No patient data'}
                                        </p>
                                    </div>

                                    {/* Patient ID */}
                                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-purple-500 rounded-md">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-700">Patient ID</p>
                                        </div>
                                        <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                                            {appointment_ ? (appointment_.patient?.patient_id || `PAT_${appointment_.firstname?.substring(0, 3).toUpperCase() || 'UNK'}_${appointment_.lastname?.substring(0, 3).toUpperCase() || 'UNK'}_${formatDateForId(appointment_.created_at)}`) : 'No patient data'}
                                        </p>
                                    </div>

                                    {/* Email Address */}
                                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-green-500 rounded-md">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-700">Email Address</p>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            {appointment_?.email || <span className="text-gray-400 italic">Not provided</span>}
                                        </p>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-orange-500 rounded-md">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-700">Phone Number</p>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            {appointment_?.phone || <span className="text-gray-400 italic">Not provided</span>}
                                        </p>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-pink-500 rounded-md">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-700">Date of Birth</p>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            {appointment_?.date_of_birth ? new Date(appointment_.date_of_birth).toLocaleDateString() : <span className="text-gray-400 italic">Not provided</span>}
                                        </p>
                                    </div>

                                    {/* Age */}
                                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-indigo-500 rounded-md">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-700">Age</p>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            {appointment_?.date_of_birth ? (() => {
                                                const birthDate = new Date(appointment_.date_of_birth);
                                                const today = new Date();
                                                let age = today.getFullYear() - birthDate.getFullYear();
                                                const monthDiff = today.getMonth() - birthDate.getMonth();
                                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                                    age--;
                                                }
                                                return age;
                                            })() : <span className="text-gray-400 italic">Not available</span>}
                                        </p>
                                    </div>

                                    {/* Gender */}
                                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-cyan-500 rounded-md">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-700">Gender</p>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            {appointment_?.gender || <span className="text-gray-400 italic">Not provided</span>}
                                        </p>
                                    </div>

                                    {/* Registration Date */}
                                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-teal-500 rounded-md">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-700">Registration Date</p>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            {appointment_?.created_at ? formatDate(appointment_.created_at) : 'Not available'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Appointment Details Card */}
                    <div className="xl:col-span-2">
                        <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-green-50/30">
                            <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Appointment Details</h3>
                                        <p className="text-xs text-gray-600 mt-0.5">Service and scheduling information</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 space-y-2">
                                {/* Service - Featured */}
                                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-green-500 rounded-md">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-green-700">Service</p>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {appointment_?.service?.servicename || <span className="text-gray-400 italic">Not specified</span>}
                                    </p>
                                </div>

                                {/* Date & Time - Featured */}
                                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-blue-500 rounded-md">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-blue-700">Appointment Date & Time</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div>
                                            <p className="text-[10px] text-blue-600 font-medium">Date</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {appointment_?.date ? formatDate(appointment_.date) : 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-blue-600 font-medium">Time</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {appointment_?.time ? formatTime(appointment_.time) : <span className="text-gray-400 italic">Not specified</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sub-service */}
                                <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-purple-500 rounded-md">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-600">Sub-service</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {appointment_?.subservice?.subservicename || <span className="text-gray-400 italic">Not assigned</span>}
                                    </p>
                                </div>

                                {/* Reference Number */}
                                <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-orange-500 rounded-md">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-600">Reference Number</p>
                                    </div>
                                    <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                                        {appointment_?.reference_number || <span className="text-gray-400 italic">Not generated</span>}
                                    </p>
                                </div>

                                {/* Priority Number */}
                                <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-red-500 rounded-md">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-600">Priority Number</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {appointment_?.priority_number || <span className="text-gray-400 italic">Not assigned</span>}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Notes Section */}
                {appointment_?.notes && (
                    <Card className="mt-4 shadow-lg border-0 bg-gradient-to-br from-white to-yellow-50/30">
                        <CardHeader className="pb-3 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Additional Notes</h3>
                                    <p className="text-xs text-gray-600 mt-0.5">Important information and comments</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-3 shadow-sm">
                                <div className="flex items-start gap-2">
                                    <div className="p-1.5 bg-yellow-500 rounded-md mt-0.5">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                            {appointment_?.notes}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Beautiful Footer with Status Management */}
                <div className="mt-4 pt-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-500 rounded-md">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-gray-700">Update Status:</span>
                            </div>
                            <Select
                                value={data.status}
                                onValueChange={(e) => {
                                    setData("status", e);
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-[180px] bg-white border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={1}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="font-medium">Scheduled</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value={5}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="font-medium">Confirmed</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value={4}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="font-medium">Declined</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <PrimaryButton
                                disabled={processing}
                                onClick={SaveStatus}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold shadow-lg text-sm"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Save Changes
                                    </>
                                )}
                            </PrimaryButton>
                        </div>
                    </div>
                    <InputError message={errors.status} className="mt-3 text-red-600 font-medium" />
                </div>
            </Modal>

            {/* Add the confirmation dialog */}
            <AlertDialog 
                open={confirmDialog.isOpen} 
                onOpenChange={(isOpen) => 
                    setConfirmDialog({ isOpen, type: null, appointmentId: null })
                }
            >
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold">
                            {confirmDialog.type === 'archive' 
                                ? 'Archive Appointment' 
                                : 'Restore Appointment'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            {confirmDialog.type === 'archive'
                                ? 'Are you sure you want to archive this appointment? This will remove it from the active list.'
                                : 'Are you sure you want to restore this appointment? This will return it to the active list.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (confirmDialog.type === 'archive') {
                                    handleArchiveAppointment(confirmDialog.appointmentId);
                                } else {
                                    handleUnarchiveAppointment(confirmDialog.appointmentId);
                                }
                            }}
                            className={`${
                                confirmDialog.type === 'archive' 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                        >
                            {confirmDialog.type === 'archive' ? 'Archive' : 'Restore'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Diagnosis Modal */}
            <Modal
                isOpen={isDiagnosisModalOpen}
                hasCancel={true}
                onClose={closeDiagnosisModal}
                maxWidth="4xl"
                canceltext="Cancel"
                savetext=""
                className="max-h-[95vh] overflow-y-auto w-full"
            >
                {/* Beautiful Header with Gradient Background */}
                <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-t-lg -m-6 mb-4 p-5 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Title Section */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl lg:text-2xl font-bold text-white">Create Diagnosis</h1>
                                <p className="text-green-100 mt-0.5 text-xs lg:text-sm">
                                    Record diagnosis and treatment plan for patient
                                </p>
                            </div>
                        </div>
                        
                        {/* Patient Info Section - Show selected patient details prominently */}
                        {selectedAppointment ? (
                            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm min-w-0 flex-shrink-0">
                                <Avatar className="w-10 h-10 flex-shrink-0">
                                    <AvatarImage
                                        src={selectedAppointment.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAppointment.firstname}`}
                                        alt={selectedAppointment.firstname || 'Patient'}
                                    />
                                    <AvatarFallback className="text-sm font-semibold">
                                        {selectedAppointment.firstname?.charAt(0) || 'N'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="text-green-100 text-xs font-medium mb-1">Selected Patient</p>
                                    <p className="text-sm font-semibold text-white truncate" title={`${selectedAppointment.firstname || ''} ${selectedAppointment.lastname || ''}`.trim()}>
                                        {`${selectedAppointment.firstname || ''} ${selectedAppointment.lastname || ''}`.trim()}
                                    </p>
                                    <p className="text-xs text-green-200 truncate">
                                        ID: PAT_{selectedAppointment.firstname?.substring(0, 3).toUpperCase()}_{selectedAppointment.lastname?.substring(0, 3).toUpperCase()}_{selectedAppointment.created_at?.slice(0, 10).replace(/-/g, '')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm min-w-0 flex-shrink-0">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-green-100 text-xs font-medium mb-1">No Patient Selected</p>
                                    <p className="text-sm font-semibold text-white">Please select a patient below</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleDiagnosisSubmit} className="space-y-6">
                    {/* Patient Selection Section */}
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Patient Selection</h3>
                                    <p className="text-xs text-gray-600 mt-0.5">Choose the patient and their appointment for diagnosis</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {/* Step 1: Select Patient */}
                            <div className="space-y-2">
                                <Label htmlFor="patient_selection" className="text-sm font-semibold text-gray-700 block">
                                    Select Patient *
                                </Label>
                                <Select value={selectedPatientId} onValueChange={handlePatientSelection}>
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue placeholder="Choose a patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getUniquePatients().length > 0 ? (
                                            getUniquePatients().map((patient) => (
                                                <SelectItem key={patient.id} value={patient.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarImage
                                                                src={patient.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.firstname}`}
                                                                alt={patient.firstname || 'Patient'}
                                                            />
                                                            <AvatarFallback className="text-xs">
                                                                {patient.firstname?.charAt(0) || 'N'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-medium text-sm">
                                                            {`${patient.firstname || ''} ${patient.lastname || ''}`.trim()}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                <div className="text-sm font-medium mb-1">No Confirmed Patients Available</div>
                                                <div className="text-xs">Only patients with confirmed appointments can receive diagnoses</div>
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Step 2: Select Appointment (only show if patient is selected) */}
                            {selectedPatient && patientAppointments.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="appointment_selection" className="text-sm font-semibold text-gray-700 block">
                                        Select Appointment *
                                    </Label>
                                    <Select value={selectedAppointment?.id?.toString() || ""} onValueChange={handleAppointmentSelection}>
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Choose an appointment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patientAppointments.map((appointment) => (
                                                <SelectItem key={appointment.id} value={appointment.id.toString()}>
                                                    <div className="font-medium text-sm">
                                                        {appointment.service?.servicename || 'General Consultation'}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Message when patient has no confirmed appointments */}
                            {selectedPatient && patientAppointments.length === 0 && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <span className="text-yellow-600 text-xs">!</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-yellow-800">
                                                No Confirmed Appointments
                                            </div>
                                            <div className="text-xs text-yellow-600">
                                                This patient has no confirmed appointments. Only confirmed appointments can receive diagnoses.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Selected Patient Information Display */}
                    {selectedAppointment && (
                        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-green-800 text-base mb-2">
                                            {`${selectedAppointment.firstname || ''} ${selectedAppointment.lastname || ''}`.trim()}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-sm text-green-700">
                                                <span className="font-medium">ID:</span> PAT_{selectedAppointment.firstname?.substring(0, 3).toUpperCase()}_{selectedAppointment.lastname?.substring(0, 3).toUpperCase()}_{selectedAppointment.created_at?.slice(0, 10).replace(/-/g, '')}
                                            </p>
                                            <p className="text-sm text-green-700">
                                                <span className="font-medium">Service:</span> {selectedAppointment.service?.servicename || 'General Consultation'}
                                            </p>
                                            {selectedAppointment.subservice?.subservicename && (
                                                <p className="text-sm text-green-700">
                                                    <span className="font-medium">Subservice:</span> {selectedAppointment.subservice.subservicename}
                                                </p>
                                            )}
                                            <p className="text-sm text-green-700">
                                                <span className="font-medium">Date:</span> {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Diagnosis Section */}
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50/30">
                        <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Diagnosis Information</h3>
                                    <p className="text-xs text-gray-600 mt-0.5">Primary diagnosis and symptoms</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <Label htmlFor="diagnosis" className="text-sm font-semibold text-gray-700">
                                    Primary Diagnosis *
                                </Label>
                                <Input
                                    id="diagnosis"
                                    type="text"
                                    value={diagnosisData.diagnosis}
                                    onChange={(e) => setDiagnosisData('diagnosis', e.target.value)}
                                    placeholder="Enter the primary diagnosis"
                                    className="mt-1"
                                    required
                                />
                                <InputError message={diagnosisErrors.diagnosis} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="symptoms" className="text-sm font-semibold text-gray-700">
                                    Symptoms *
                                </Label>
                                <Textarea
                                    id="symptoms"
                                    value={diagnosisData.symptoms}
                                    onChange={(e) => setDiagnosisData('symptoms', e.target.value)}
                                    placeholder="Describe the patient's symptoms"
                                    className="mt-1"
                                    rows={3}
                                    required
                                />
                                <InputError message={diagnosisErrors.symptoms} className="mt-1" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Treatment Plan Section */}
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Treatment Plan</h3>
                                    <p className="text-xs text-gray-600 mt-0.5">Recommended treatment and follow-up</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <Label htmlFor="treatment_plan" className="text-sm font-semibold text-gray-700">
                                    Treatment Plan
                                </Label>
                                <Textarea
                                    id="treatment_plan"
                                    value={diagnosisData.treatment_plan}
                                    onChange={(e) => setDiagnosisData('treatment_plan', e.target.value)}
                                    placeholder="Describe the recommended treatment plan"
                                    className="mt-1"
                                    rows={3}
                                />
                                <InputError message={diagnosisErrors.treatment_plan} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                                    Assessment
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={diagnosisData.notes}
                                    onChange={(e) => setDiagnosisData('notes', e.target.value)}
                                    placeholder="Any additional notes or recommendations"
                                    className="mt-1"
                                    rows={2}
                                />
                                <InputError message={diagnosisErrors.notes} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="pertinent_findings" className="text-sm font-semibold text-gray-700">
                                    Pertinent Findings
                                </Label>
                                <Textarea
                                    id="pertinent_findings"
                                    value={diagnosisData.pertinent_findings}
                                    onChange={(e) => setDiagnosisData('pertinent_findings', e.target.value)}
                                    placeholder="Enter pertinent findings from examination"
                                    className="mt-1"
                                    rows={3}
                                />
                                <InputError message={diagnosisErrors.pertinent_findings} className="mt-1" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDiagnosisModal}
                            className="px-6 py-2"
                        >
                            Cancel
                        </Button>
                        <PrimaryButton
                            type="submit"
                            disabled={diagnosisProcessing}
                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                            {diagnosisProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating Diagnosis...
                                </>
                            ) : (
                                <>
                                    <Stethoscope className="h-4 w-4 mr-2" />
                                    Create Diagnosis
                                </>
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
