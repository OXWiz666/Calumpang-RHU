import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Search,
    Filter,
    PlusCircle,
    ChevronDown,
    ChevronUp,
    Download,
    AlertTriangle,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import ReorderModal from "@/components/Modal2";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

import Modal2 from "@/components/CustomModal";

import AdminLayout from "@/Layouts/AdminLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { Dropdown } from "react-day-picker";

import Label from "@/components/InputLabel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";

import Sidebar from "./Sidebar";

import StaffLayout from "./StaffLayout";
// Helper function for toast notifications
const enhanced_toast = (title, message, type) => {
    toast[type](message, {
        position: "top-right",
        autoClose: 5000, // Longer display time
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: `custom-toast custom-toast-${type}`,
        bodyClassName: "custom-toast-body",
        progressClassName: "custom-toast-progress",
        icon: type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️",
        style: {
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
    });
};

export default function Doctors({ doctorsitems, doctors, questions }) {
    const { flash } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [isArchiveLoading, setIsArchiveLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Enhanced toast notification function
    const enhanced_toast = (title, message, icon) => {
        toast(
            <div className="flex">
                <div className="ml-4">
                    <p className="font-bold">{title}</p>
                    <p>{message}</p>
                </div>
            </div>,
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }
        );
    };
    
    // This section was removed to fix duplicate declarations
    
    // Handle flash messages from the server
    useEffect(() => {
        if (flash && flash.message) {
            enhanced_toast(flash.title, flash.message, flash.icon);
        }
    }, [flash]);

    const tools = () => {
        return (
            <>
                <Button
                    variant="outline"
                    onClick={OpenModal}
                    className="flex items-center gap-2"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add New</span>
                </Button>
            </>
        );
    };

    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            first_name: "",
            middlename: "",
            last_name: "",
            suffix: "",
            contactNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
            birth: "",
            isAdmin: "true",
        });

    const OpenModal = (e) => {
        setIsModalOpen(true);
    };
    const CloseModal = (e) => {
        setIsModalOpen(false);

        clearErrors();
        reset();
    };
    const [showPositionDropdown, setShowPositionDropdown] = useState(false);
    const [showSecurityDropdown, setShowSecurityDropdown] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert("wew");
        post(route("admin.register.doctor"), {
            onSuccess: (r) => {
                CloseModal();
                enhanced_toast(
                    "Success!",
                    "Doctor has been registered successfully!",
                    "success"
                );
                router.reload({
                    only: ["auth"],
                    preserveScroll: true,
                });
            },
        });
    };
    // State for the selected doctor and status
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(1);

    // Function to open the status change modal
    const openStatusModal = (doctor) => {
        setDataDoctor("status", doctor.status.toString());
        setSelectedDoctor(doctor);
        setSelectedStatus(doctor.status);
        setIsView(true);
    };

    const {
        data: dataDoctor,
        setData: setDataDoctor,
        post: postDoctor,
        processing: processingDoctor,
        errors: errorsDoctor,
        clearErrors: clearErrDoctor,
        reset: resetDoctor,
    } = useForm({
        status: "",
    });

    const CloseModalView = (e) => {
        setIsView(false);
        //if (e) e.stopPropagation();
        //setSelectedDoctor(null);
    };
    // Function to update doctor status
    const updateDoctorStatus = (e) => {
        e.preventDefault();
        //console.log(dataDoctor, selectedStatus);

        postDoctor(
            route("doctor.update.status", { doctor: selectedDoctor.id }),
            {
                onSuccess: (res) => {
                    CloseModalView();
                    enhanced_toast(
                        "Success!",
                        "Doctor status updated successfully",
                        "success"
                    );
                },
            }
        );
    };

    // State for custom confirmation dialog
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        type: "" // 'archive' or 'unarchive'
    });

    // Function to open the confirmation dialog
    const openConfirmDialog = (title, message, onConfirm, type) => {
        setConfirmDialog({
            isOpen: true,
            title,
            message,
            onConfirm,
            type
        });
    };

    // Function to close the confirmation dialog
    const closeConfirmDialog = () => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        });
    };

    // Custom Confirmation Dialog Component
    const ConfirmationDialog = () => {
        if (!confirmDialog.isOpen) return null;
        
        const isArchive = confirmDialog.type === 'archive';
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                    onClick={closeConfirmDialog}
                ></div>
                
                {/* Dialog */}
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
                    {/* Header */}
                    <div className={`px-6 py-4 border-b ${isArchive ? 'bg-red-50 dark:bg-red-900/20 border-red-100' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100'}`}>
                        <h3 className={`text-lg font-medium ${isArchive ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'} flex items-center`}>
                            {isArchive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            {confirmDialog.title}
                        </h3>
                    </div>
                    
                    {/* Body */}
                    <div className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{confirmDialog.message}</p>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={closeConfirmDialog}
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isArchive ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
                            onClick={() => {
                                if (confirmDialog.onConfirm) {
                                    confirmDialog.onConfirm();
                                }
                                closeConfirmDialog();
                            }}
                        >
                            {isArchive ? 'Archive' : 'Unarchive'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Function to archive a doctor account with enhanced feedback
    const archiveDoctor = (doctor) => {
        const doctorName = `${doctor.user?.firstname} ${doctor.user?.lastname}`;
        
        // Show loading toast
        const loadingToastId = toast.loading(`Archiving ${doctorName}'s account...`, {
            position: "top-right",
        });
        
        // Set loading state
        setIsArchiveLoading(true);
        
        axios.post(route("admin.staff.archive"), { staff_id: doctor.id })
            .then(response => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                
                // Show success toast
                enhanced_toast(
                    "Account Archived",
                    `${doctorName}'s account has been archived successfully.`,
                    "success"
                );
                
                // Reload the page to show updated data
                window.location.reload();
            })
            .catch(error => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);

                // Show error toast
                enhanced_toast(
                    "Archive Failed",
                    `There was a problem archiving ${doctorName}'s account: ${error.response?.data?.message || "Please try again."}`,
                    "error"
                );
                
                console.error('Error archiving staff:', error);
            })
            .finally(() => {
                // Reset loading state
                setIsArchiveLoading(false);
            });
    };

    // Function to unarchive a doctor account with enhanced feedback
    const unarchiveDoctor = (doctor) => {
        const doctorName = `${doctor.user?.firstname} ${doctor.user?.lastname}`;
        
        // Show loading toast
        const loadingToastId = toast.loading(`Unarchiving ${doctorName}'s account...`, {
            position: "top-right",
        });
        
        // Set loading state
        setIsArchiveLoading(true);
        
        axios.post(route("admin.staff.unarchive"), { staff_id: doctor.id })
            .then(response => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                
                // Show success toast
                enhanced_toast(
                    "Account Unarchived",
                    `${doctorName}'s account has been unarchived successfully.`,
                    "success"
                );
                
                // Reload the page to show updated data
                window.location.reload();
            })
            .catch(error => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);

                // Show error toast
                enhanced_toast(
                    "Unarchive Failed",
                    `There was a problem unarchiving ${doctorName}'s account: ${error.response?.data?.message || "Please try again."}`,
                    "error"
                );
                
                console.error('Error unarchiving staff:', error);
            })
            .finally(() => {
                // Reset loading state
                setIsArchiveLoading(false);
            });
    };
    
    const getStatusBadge = (doctor) => {
        if (!doctor || !doctor.status) return null;
        
        const status = doctor.status;

        switch (status) {
            case 1:
                return (
                    <Badge
                        variant="solid"
                        className="bg-green-500 text-white rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        Available
                    </Badge>
                );
            case 2:
                return (
                    <Badge
                        variant="outline"
                        className="text-gray-600 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        Inactive
                    </Badge>
                );
            case 3:
                return (
                    <Badge
                        variant="outline"
                        className="text-amber-700 bg-amber-200 border border-amber-300 rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        On Leave
                    </Badge>
                );
            case 4:
                return (
                    <Badge
                        variant="outline"
                        className="text-blue-700 bg-blue-200 border border-blue-300 rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        In Consultation
                    </Badge>
                );
            case 5:
                return (
                    <Badge
                        variant="outline"
                        className="text-red-700 bg-red-100 border border-red-300 rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        Archived
                    </Badge>
                );
            default:
                return null;
        }
    };

    const [view, setIsView] = useState(false);

    const { links } = usePage().props.doctors; // Get pagination links
    // useEffect(() => {
    //     console.log("doctors", links);
    // }, [links]);

    return (
        <StaffLayout>
            <div>
                <h1 className="text-3xl font-bold mb-2">Doctors</h1>
                {/* <p className="text-gray-600">
                            Book your visit to Barangay Calumpang Health Center.
                            Please fill out the form below with your information
                            and preferred appointment details.
                        </p> */}
                <p className="text-muted-foreground"></p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar activeTab={"doctors"} />
                <div className=" bg-accent  rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-primary">
                            {/* Doctors */}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Filter by:
                                </span>
                            </div>

                            <Select>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="In Stock">
                                        In Stock
                                    </SelectItem>
                                    <SelectItem value="Low Stock">
                                        Low Stock
                                    </SelectItem>
                                    <SelectItem value="Out of Stock">
                                        Out of Stock
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                            // value={categoryFilter}
                            // onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    <SelectItem value="Medication">
                                        Medication
                                    </SelectItem>
                                    <SelectItem value="Supplies">
                                        Supplies
                                    </SelectItem>
                                    <SelectItem value="Equipment">
                                        Equipment
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <SortableTable
                            data={doctorsitems}
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
                                                sortKey="id"
                                                sortable
                                            >
                                                ID
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="user.firstname"
                                                sortable
                                            >
                                                Fullname
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="specialty.specialty"
                                                sortable
                                            >
                                                Specialization
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="user.contactno"
                                                sortable
                                            >
                                                Contact Information
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="status"
                                                sortable
                                            >
                                                Availability Status
                                            </SortableTableHead>
                                            <SortableTableHead sortable>
                                                Action
                                            </SortableTableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedData.map((d) => (
                                            <TableRow key={d.id}>
                                                <TableCell>
                                                    DOC - {d.id}
                                                </TableCell>
                                                <TableCell>
                                                    {d.user?.firstname}{" "}
                                                    {d.user?.lastname}
                                                </TableCell>
                                                <TableCell>
                                                    {d.specialty?.specialty ??
                                                        "Not Set"}
                                                </TableCell>
                                                <TableCell>
                                                    {d.user?.contactno} |{" "}
                                                    {d.user?.email}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(d)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <PrimaryButton
                                                            className="btn-sm w-32 text-sm px-5 py-2 shadow-md flex items-center justify-center"
                                                            onClick={() =>
                                                                openStatusModal(d)
                                                            }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit Status
                                                        </PrimaryButton>
                                                        
                                                        {d.status === 5 ? (
                                                            <PrimaryButton
                                                                className="btn-sm w-32 bg-green-600 hover:bg-green-700 text-sm px-5 py-2 shadow-md flex items-center justify-center"
                                                                onClick={() =>
                                                                    openConfirmDialog(
                                                                        "Unarchive Doctor",
                                                                        `Are you sure you want to unarchive ${d.user.firstname} ${d.user.lastname}'s account?`,
                                                                        () => unarchiveDoctor(d),
                                                                        'unarchive'
                                                                    )
                                                                }
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                                </svg>
                                                                Unarchive
                                                            </PrimaryButton>
                                                        ) : (
                                                            <>
                                                                <PrimaryButton
                                                                    className="btn-sm w-32 bg-blue-600 hover:bg-blue-700 text-sm px-5 py-2 shadow-md flex items-center justify-center"
                                                                    onClick={() =>
                                                                        openConfirmDialog(
                                                                            "Unarchive Doctor",
                                                                            `Are you sure you want to unarchive ${d.user.firstname} ${d.user.lastname}'s account?`,
                                                                            () => unarchiveDoctor(d),
                                                                            'unarchive'
                                                                        )
                                                                    }
                                                                    disabled={d.status !== 5}
                                                                    title={d.status !== 5 ? "Only archived accounts can be unarchived" : ""}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                                    </svg>
                                                                    Unarchive
                                                                </PrimaryButton>
                                                                <PrimaryButton
                                                                    className="btn-sm w-32 bg-red-600 hover:bg-red-700 text-sm px-5 py-2 shadow-md flex items-center justify-center ml-2"
                                                                    onClick={() =>
                                                                        openConfirmDialog(
                                                                            "Archive Doctor",
                                                                            `Are you sure you want to archive ${d.user.firstname} ${d.user.lastname}'s account?`,
                                                                            () => archiveDoctor(d),
                                                                            'archive'
                                                                        )
                                                                    }
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                                    </svg>
                                                                    Archive
                                                                </PrimaryButton>
                                                            </>
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
                    <CardFooter className=" mt-2">
                        <div className="text-sm text-muted-foreground">
                            Showing {doctors.from} to {doctors.to} of{" "}
                            {doctors.total} Results
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
                </div>
            </div>
            <Modal2 isOpen={view} maxWidth="sm" onClose={CloseModalView}>
                <div className="py-4">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select
                                value={dataDoctor.status}
                                onValueChange={(value) => {
                                    setDataDoctor("status", value);
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Available</SelectItem>
                                    <SelectItem value="2">Inactive</SelectItem>
                                    <SelectItem value="4">
                                        In Consultation
                                    </SelectItem>
                                    <SelectItem value="3">On Leave</SelectItem>
                                    <SelectItem value="5">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={CloseModalView}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={processingDoctor}
                            onClick={updateDoctorStatus}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </div>
            </Modal2>
            <ConfirmationDialog />
        </StaffLayout>
    );
}
