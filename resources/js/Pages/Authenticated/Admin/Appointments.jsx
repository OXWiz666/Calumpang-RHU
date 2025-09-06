import AdminLayout from "@/Layouts/AdminLayout";
import React, { useEffect, useState } from "react";
import { inertia, motion } from "framer-motion";
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
    const [appointments, setAppointments] = useState(appointments_.data);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "ascending",
    });

    // Filter appointments based on search term and status
    const filteredAppointments = appointments.filter((appointment) => {
        const matchesSearch =
            appointment.user?.firstname
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.user_id
                .toLowerCase()
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

    // Update the status badge styles
    const getStatusBadge = (status) => {
        const baseStyle =
            "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center transition-all duration-200";
        switch (status) {
            case 2:
                return (
                    <Badge className={`${baseStyle} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600 mr-2"></div>
                        Completed
                    </Badge>
                );
            case 1:
                return (
                    <Badge className={`${baseStyle} bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></div>
                        Scheduled
                    </Badge>
                );
            case 3:
                return (
                    <Badge className={`${baseStyle} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-red-600 mr-2"></div>
                        Cancelled
                    </Badge>
                );
            case 4:
                return (
                    <Badge className={`${baseStyle} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-red-600 mr-2"></div>
                        Declined
                    </Badge>
                );
            case 5:
                return (
                    <Badge className={`${baseStyle} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600 mr-2"></div>
                        Confirmed
                    </Badge>
                );
            case 6:
                return (
                    <Badge className={`${baseStyle} bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"></div>
                        Archived
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const tools = () => {
        return <></>;
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
                                                                    .split(" ")
                                                                    .map(
                                                                        (n) =>
                                                                            n[0]
                                                                    )
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">
                                                                {
                                                                    aa.user
                                                                        ?.firstname
                                                                }{" "}
                                                                {
                                                                    aa.user
                                                                        ?.lastname
                                                                }
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {aa.user_id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {/* moment(
                                                                                                            activity.created_at
                                                                                                        ).format("h:mm A") */}
                                                    <div className="font-medium">
                                                        {new Date(
                                                            aa.date
                                                        ).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {aa.time}
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
                maxWidth="2xl"
                canceltext="Okay"
                savetext=""
            >
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>
                    {/* Please save this information for your reference */}
                </CardDescription>
                <Card>
                    <CardHeader></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Name
                                </p>
                                <p className="text-gray-900">
                                    {appointment_.user?.firstname}{" "}
                                    {appointment_.user?.lastname}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Service
                                </p>
                                <p className="text-gray-900">
                                    {appointment_.service?.servicename}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Date
                                </p>
                                <p className="text-gray-900">
                                    {appointment_.date}
                                    {/* {data.date
                                ? data.date.toLocaleDateString()
                                : "Not specified"} */}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Time
                                </p>
                                <p className="text-gray-900">
                                    {appointment_.time}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Email
                                </p>
                                <p className="text-gray-900">
                                    {appointment_.user?.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Phone
                                </p>
                                <p className="text-gray-900">
                                    {appointment_.phone}
                                </p>
                            </div>
                        </div>
                        {/* {data.notes && (

                    )} */}
                    </CardContent>
                </Card>
                <CardFooter>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {/* < className="h-4 w-4 text-muted-foreground" /> */}
                                <span className="text-sm font-medium">
                                    Status:
                                </span>
                            </div>
                            <Select
                                value={data.status}
                                onValueChange={(e) => {
                                    setData("status", e);
                                }}
                                id="axz"
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={1}>Scheduled</SelectItem>
                                    <SelectItem value={5}>Confirm</SelectItem>
                                    <SelectItem value={4}>Decline</SelectItem>
                                    {/* <SelectItem value={2}>Completed</SelectItem>
                                    <SelectItem value={3}>Cancelled</SelectItem> */}
                                </SelectContent>
                            </Select>
                            {/* <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal}
                            >
                                Cancel
                            </Button> */}
                            <PrimaryButton
                                disabled={processing}
                                onClick={SaveStatus}
                            >
                                Save
                            </PrimaryButton>
                        </div>
                    </div>
                    <InputError message={errors.status} />
                </CardFooter>
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
