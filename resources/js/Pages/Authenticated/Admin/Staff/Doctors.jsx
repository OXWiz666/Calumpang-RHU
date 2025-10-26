import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { showToast } from "@/utils/toast.jsx";
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
    Stethoscope,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    UserPlus,
    Archive,
    ArchiveRestore,
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
    TableHead,
} from "@/components/tempo/components/ui/table2";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

import Modal2 from "@/components/CustomModal";
import EditDoctorModal from "./EditDoctorModal";

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/tempo/components/ui/dropdown-menu";
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

import Sidebar from "./Sidebar";

import StaffLayout from "./StaffLayout";

export default function Doctors({ doctorsitems, doctors, questions }) {
    const { flash } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [isArchiveLoading, setIsArchiveLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    
    // This section was removed to fix duplicate declarations
    
    // Handle flash messages from the server
    useEffect(() => {
        if (flash) {
            if (flash.success) {
                showToast("Success!", flash.success, "success");
            } else if (flash.error) {
                showToast("Error", flash.error, "error");
            } else if (flash.message) {
                showToast(flash.title || "Notification", flash.message, flash.icon || "info");
            }
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

    const openEditModal = (doctor) => {
        setSelectedDoctor(doctor);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedDoctor(null);
    };

    const handleEditSuccess = (updatedDoctor) => {
        console.log('Edit success callback triggered:', updatedDoctor);
        // Show success toast
        showToast(
            "Success!",
            "Doctor information updated successfully!",
            "success",
            "update"
        );
        // Use Inertia reload to refresh the data
        router.reload({ only: ['auth'] });
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
                showToast(
                    "Success!",
                    "Doctor has been registered successfully!",
                    "success",
                    "create"
                );
                router.reload({
                    only: ["auth"],
                    preserveScroll: true,
                });
            },
        });
    };
    // State for the selected status
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
                    showToast(
                        "Success!",
                        "Doctor status updated successfully",
                        "success",
                        "update"
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


    // Function to archive a doctor account with enhanced feedback
    const archiveDoctor = (doctor) => {
        const doctorName = `${doctor.user?.firstname} ${doctor.user?.lastname}`;
        
        // Set loading state
        setIsArchiveLoading(true);
        
        // Use doctor.user.id instead of doctor.id for the staff_id
        axios.post(route("admin.staff.archive"), { staff_id: doctor.user?.id })
            .then(response => {
                // Show success toast
                showToast(
                    "Account Archived",
                    `${doctorName}'s account has been archived successfully.`,
                    "success",
                    "archive"
                );
                
                // Reload the page to show updated data
                window.location.reload();
            })
            .catch(error => {
                // Show error toast
                showToast(
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
        
        // Set loading state
        setIsArchiveLoading(true);
        
        // Use doctor.user.id instead of doctor.id for the staff_id
        axios.post(route("admin.staff.unarchive"), { staff_id: doctor.user?.id })
            .then(response => {
                // Show success toast
                showToast(
                    "Account Unarchived",
                    `${doctorName}'s account has been unarchived successfully.`,
                    "success",
                    "unarchive"
                );
                
                // Reload the page to show updated data
                window.location.reload();
            })
            .catch(error => {
                // Show error toast
                showToast(
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

    const handleExport = () => {
        const csvContent = [
            ['Doctor ID', 'Name', 'Medical License Number', 'Email', 'Contact', 'Status', 'Created At'],
            ...doctorsitems.map(doctor => [
                `DOC-${doctor.id}`,
                `${doctor.user?.firstname} ${doctor.user?.lastname}`,
                doctor.license_number || 'Not Set',
                doctor.user?.email,
                doctor.user?.contactno || 'Not provided',
                doctor.status === 1 ? 'Available' : 
                doctor.status === 2 ? 'Inactive' : 
                doctor.status === 3 ? 'On Leave' : 
                doctor.status === 4 ? 'In Consultation' : 
                doctor.status === 5 ? 'Archived' : 'Unknown',
                new Date(doctor.user?.created_at).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `doctors_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("Success!", "Doctors exported successfully!", "success", "export");
    };
    
    const getStatusBadge = (doctor) => {
        if (!doctor || !doctor.status) return null;
        
        const status = doctor.status;

        switch (status) {
            case 1:
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Available
                    </Badge>
                );
            case 2:
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        Inactive
                    </Badge>
                );
            case 3:
                return (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        On Leave
                    </Badge>
                );
            case 4:
                return (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        In Consultation
                    </Badge>
                );
            case 5:
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
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

    const [view, setIsView] = useState(false);

    const { links } = usePage().props.doctors; // Get pagination links
    // useEffect(() => {
    //     console.log("doctors", links);
    // }, [links]);

    return (
        <StaffLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Doctors</h1>
                    <p className="text-lg text-gray-600">
                        Manage medical professionals and their availability
                    </p>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-8">
                    <Sidebar activeTab={"doctors"} />
                    
                    <div className="flex-1 space-y-8">
                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Card className="shadow-lg border-0">
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                                            <CardTitle className="text-2xl font-bold text-gray-900">All Doctors</CardTitle>
                                            <CardDescription className="text-gray-600 mt-1">
                                                Manage and configure doctor profiles
                                            </CardDescription>
                                        </div>
                            </div>
                                </CardHeader>
                            </Card>
                        </motion.div>

                        {/* Filters and Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="shadow-lg border-0">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Search doctors..."
                                                    className="pl-10 border-2 focus:border-green-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Filter className="h-4 w-4 text-gray-500" />
                            <Select>
                                                <SelectTrigger className="w-[180px] border-2">
                                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="1">Available</SelectItem>
                                                    <SelectItem value="2">Inactive</SelectItem>
                                                    <SelectItem value="3">On Leave</SelectItem>
                                                    <SelectItem value="4">In Consultation</SelectItem>
                                                    <SelectItem value="5">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Doctors Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="shadow-lg border-0 overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                <Table>
                                            <TableHeader className="bg-gray-50">
                                        <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead>Doctor</TableHead>
                                                    <TableHead>Medical License Number</TableHead>
                                                    <TableHead>Contact Information</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                                {doctorsitems.map((d) => (
                                                    <TableRow key={d.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell>
                                                            <div className="font-medium text-gray-900">
                                                                DOC-{d.id}
                                                            </div>
                                                </TableCell>
                                                <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                                                                        {d.user?.firstname?.charAt(0)}{d.user?.lastname?.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-semibold text-gray-900">
                                                                        {d.user?.firstname} {d.user?.lastname}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        Doctor
                                                                    </div>
                                                                </div>
                                                            </div>
                                                </TableCell>
                                                <TableCell>
                                                            <div className="text-sm text-gray-700">
                                                                {d.user?.license_number || "Not Set"}
                                                            </div>
                                                </TableCell>
                                                <TableCell>
                                                            <div className="text-sm text-gray-700">
                                                                <div>{d.user?.contactno || 'Not provided'}</div>
                                                                <div className="text-gray-500">{d.user?.email}</div>
                                                            </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(d)}
                                                </TableCell>
                                                <TableCell>
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                                                                    onClick={() => openStatusModal(d)}
                                                                    title="Edit status"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => openEditModal(d)}
                                                                        >
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            Edit Doctor
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => openStatusModal(d)}
                                                                        >
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            Edit Status
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                        {d.status === 5 ? (
                                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openConfirmDialog(
                                                                        "Unarchive Doctor",
                                                                        `Are you sure you want to unarchive ${d.user.firstname} ${d.user.lastname}'s account?`,
                                                                        () => unarchiveDoctor(d),
                                                                        'unarchive'
                                                                    )
                                                                }
                                                                                className="text-green-600"
                                                            >
                                                                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                                                Unarchive
                                                                            </DropdownMenuItem>
                                                        ) : (
                                                                            <DropdownMenuItem
                                                                    onClick={() =>
                                                                        openConfirmDialog(
                                                                            "Archive Doctor",
                                                                            `Are you sure you want to archive ${d.user.firstname} ${d.user.lastname}'s account?`,
                                                                            () => archiveDoctor(d),
                                                                            'archive'
                                                                        )
                                                                    }
                                                                                className="text-red-600"
                                                                >
                                                                                <Archive className="h-4 w-4 mr-2" />
                                                                    Archive
                                                                            </DropdownMenuItem>
                                                        )}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pagination */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card className="shadow-lg border-0">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="text-sm text-gray-600">
                                            Showing {doctors.from} to {doctors.to} of {doctors.total} Results
                        </div>
                                        
                                        <div className="flex items-center gap-2">
                            {links.map((link, index) => (
                                <Button
                                    key={index}
                                                    variant={link.active ? "default" : "outline"}
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
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
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

            {/* Custom Archive Confirmation Dialog */}
            <AlertDialog open={confirmDialog.isOpen} onOpenChange={(open) => {
                if (!open) {
                    closeConfirmDialog();
                }
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeConfirmDialog}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                closeConfirmDialog();
                                // Execute the confirm callback after closing the dialog
                                if (confirmDialog.onConfirm) {
                                    setTimeout(() => {
                                        confirmDialog.onConfirm();
                                    }, 100);
                                }
                            }}
                            className={confirmDialog.type === 'archive' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                        >
                            {confirmDialog.type === 'archive' ? 'Archive' : 'Unarchive'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Doctor Modal */}
            <EditDoctorModal
                doctor={selectedDoctor}
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSuccess={handleEditSuccess}
            />
        </StaffLayout>
    );
}
