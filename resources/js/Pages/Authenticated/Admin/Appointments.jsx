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
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
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

export default function appointments({ appointments_ }) {
    // Debug: Log the appointments data to see what we're receiving
    console.log('Appointments data received:', appointments_);
    
    const [appointments, setAppointments] = useState(appointments_.data || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "ascending",
    });

    // Helper function to safely format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString();
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
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        // Handle undefined/null values
        if (valA == null) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valB == null) return sortConfig.direction === "ascending" ? 1 : -1;

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
        return <></>;
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

    const [appointment_, setAppointment_] = useState({});

    const { data, setData, processing, recentlySuccessful, errors, post } =
        useForm({
            status: null,
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
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
                                placeholder="Search appointments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full md:w-[250px] bg-gray-50 border-gray-200 focus:border-primary"
                            />
                        </div>
                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value={1}>Scheduled</SelectItem>
                                <SelectItem value={2}>Completed</SelectItem>
                                <SelectItem value={3}>Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <SortableTable
                            data={appointments}
                            defaultSort={{
                                key: "user.firstname",
                                direction: "asc",
                            }}
                        >
                            {({ sortedData }) => (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <SortableTableHead
                                                sortKey="user.firstname"
                                                sortable
                                            >
                                                Patient
                                            </SortableTableHead>
                                            <SortableTableHead sortKey="date">
                                                Date & Time
                                            </SortableTableHead>
                                            <SortableTableHead>
                                                Doctor
                                            </SortableTableHead>
                                            <SortableTableHead sortKey="service.servicename">
                                                Purpose
                                            </SortableTableHead>
                                            <SortableTableHead sortKey="status">
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
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage
                                                                //   src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.avatar}`}
                                                                alt={
                                                                    aa.user
                                                                        ?.firstname
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {aa.user?.firstname
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
                                                                Patient ID: PAT_{aa.firstname?.substring(0, 3).toUpperCase()}_{aa.lastname?.substring(0, 3).toUpperCase()}_{formatDateForId(aa.created_at)}
                                                            </div>
                                                            <div className="text-xs text-blue-600">
                                                                Patient
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {/* moment(
                                                                                                            activity.created_at
                                                                                                        ).format("h:mm A") */}
                                                    <div className="font-medium">
                                                        {formatDate(aa.date)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatTime(aa.time)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>Not Set</TableCell>
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
                                                            disabled={aa.status === 5}
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
                                            {appointment_ ? `PAT_${appointment_.firstname?.substring(0, 3).toUpperCase() || 'UNK'}_${appointment_.lastname?.substring(0, 3).toUpperCase() || 'UNK'}_${formatDateForId(appointment_.created_at)}` : 'No patient data'}
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
        </AdminLayout>
    );
}
