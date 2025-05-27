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
import { Textarea } from "@/components/tempo/components/ui/textarea";
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
// Helper function for toast notifications
const alert_toast = (title, message, type) => {
    toast[type](message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export default function ServicesLayout({ children }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state for creating a new service
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        servicename: "",
        status: 1, // Active by default
    });

    // Handle flash messages from the server
    useEffect(() => {
        if (flash && flash.message) {
            alert_toast(flash.title, flash.message, flash.icon);
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
                    <span>Add Service</span>
                </Button>
            </>
        );
    };

    // const { data, setData, post, processing, errors, clearErrors, reset } =
    //     useForm({
    //         first_name: "",
    //         middlename: "",
    //         last_name: "",
    //         suffix: "",
    //         contactNumber: "",
    //         email: "",
    //         password: "",
    //         confirmPassword: "",
    //         gender: "",
    //         birth: "",

    //         isAdmin: "true",
    //         role: 7,
    //     });

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
        
        // Add an empty description field to the data to satisfy the backend
        const formData = {
            ...data,
            description: '' // Add empty description
        };
        
        axios.post('/admin/services/create', formData)
            .then(response => {
                setIsModalOpen(false);
                clearErrors();
                reset();
                alert_toast(
                    "Success",
                    "Service created successfully!",
                    "success"
                );
                // Force reload to show the updated services
                window.location.reload();
            })
            .catch(error => {
                console.error('Error creating service:', error);
                alert_toast(
                    "Error",
                    error.response?.data?.message || 'An error occurred while creating the service',
                    "error"
                );
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

    // const {
    //     data: dataDoctor,
    //     setData: setDataDoctor,
    //     post: postDoctor,
    //     processing: processingDoctor,
    //     errors: errorsDoctor,
    //     clearErrors: clearErrDoctor,
    //     reset: resetDoctor,
    // } = useForm({
    //     status: "",
    // });

    const CloseModalView = (e) => {
        setIsView(false);
        //if (e) e.stopPropagation();
        //setSelectedDoctor(null);
    };

    // Function to update doctor status
    // const updateDoctorStatus = (e) => {
    //     e.preventDefault();
    //     //console.log(dataDoctor, selectedStatus);

    //     postDoctor(
    //         route("doctor.update.status", { doctor: selectedDoctor.id }),
    //         {
    //             onSuccess: (res) => {
    //                 CloseModalView();
    //                 alert_toast(
    //                     "Success!",
    //                     "Doctor status updated successfully",
    //                     "success"
    //                 );
    //             },
    //         }
    //     );
    // };

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
            default:
                return null;
        }
    };

    const [view, setIsView] = useState(false);

    //const { links } = usePage().props.doctors; // Get pagination links
    // useEffect(() => {
    //     console.log("doctors", links);
    // }, [links]);

    return (
        <AdminLayout header="Services" tools={tools()}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
            <Modal2 isOpen={isModalOpen} onClose={CloseModal}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Add New Service</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label htmlFor="servicename" className="block mb-1">Service Name</Label>
                            <Input 
                                id="servicename" 
                                type="text" 
                                value={data.servicename}
                                onChange={(e) => setData('servicename', e.target.value)}
                                className="w-full"
                                required
                            />
                            {errors.servicename && (
                                <p className="text-red-500 text-sm mt-1">{errors.servicename}</p>
                            )}
                        </div>
                        

                        
                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" variant="outline" onClick={CloseModal}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Add Service</Button>
                        </div>
                    </form>
                </div>
            </Modal2>
        </AdminLayout>
    );
}
