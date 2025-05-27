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

export default function StaffLayout({ children }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                    <span>Add Staff</span>
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
            role: 7,
            specialization: "", // Added specialization field
        });

    // Track if Doctor role is selected
    const [isDoctorSelected, setIsDoctorSelected] = useState(false);

    // Update isDoctorSelected when role changes
    useEffect(() => {
        setIsDoctorSelected(data.role === 1);
    }, [data.role]);

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
        post(route("admin.staff.register"), {
            onSuccess: (r) => {
                CloseModal();
                alert_toast(
                    "Success!",
                    "Staff has been registered successfully!",
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
                    alert_toast(
                        "Success!",
                        "Doctor status updated successfully",
                        "success"
                    );
                },
            }
        );
    };

    // Function to archive a doctor account
    const archiveDoctor = (doctor) => {
        if (confirm("Are you sure you want to archive this doctor account?")) {
            axios.post(route("doctor.archive", { doctor: doctor.id }))
                .then(response => {
                    alert_toast(
                        "Success!",
                        "Doctor account has been archived",
                        "success"
                    );
                    router.reload({
                        only: ["auth"],
                        preserveScroll: true,
                    });
                })
                .catch(error => {
                    alert_toast(
                        "Error!",
                        "Failed to archive doctor account",
                        "error"
                    );
                });
        }
    };

    // Function to unarchive a doctor account
    const unarchiveDoctor = (doctor) => {
        if (confirm("Are you sure you want to unarchive this doctor account?")) {
            axios.post(route("doctor.unarchive", { doctor: doctor.id }))
                .then(response => {
                    alert_toast(
                        "Success!",
                        "Doctor account has been unarchived",
                        "success"
                    );
                    router.reload({
                        only: ["auth"],
                        preserveScroll: true,
                    });
                })
                .catch(error => {
                    alert_toast(
                        "Error!",
                        "Failed to unarchive doctor account",
                        "error"
                    );
                });
        }
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

    //const { links } = usePage().props.doctors; // Get pagination links
    // useEffect(() => {
    //     console.log("doctors", links);
    // }, [links]);

    return (
        <AdminLayout header="Staff" tools={tools()}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
            <Modal2 isOpen={isModalOpen} onClose={CloseModal}>
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <ul className="text-sm text-red-600">
                                    {Object.entries(errors).map(
                                        ([key, error]) => (
                                            <li key={key}>{error}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label
                                htmlFor="first_name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                First Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    placeholder="ex. Juan"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* First Name */}
                        <div>
                            <label
                                htmlFor="middle_name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Middle Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="middlename"
                                    name="middlename"
                                    placeholder="ex. Juan"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.middlename}
                                    onChange={(e) =>
                                        setData("middlename", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label
                                htmlFor="last_name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Last Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    placeholder="ex. Dela Cruz"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Suffix */}
                        <div>
                            <label
                                htmlFor="last_name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Suffix
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="suffix"
                                    name="suffix"
                                    placeholder="ex. Jr. (Optional)"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.suffix}
                                    onChange={(e) =>
                                        setData("suffix", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label
                                htmlFor="contactNumber"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Contact Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="contactNumber"
                                    name="contactNumber"
                                    placeholder="09123456789"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.contactNumber}
                                    onChange={(e) =>
                                        setData("contactNumber", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="juan.delacruz@example.com"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Birth Date
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="date" // Changed to 'date' for birthdate
                                    id="birthdate"
                                    name="birthdate"
                                    placeholder="YYYY-MM-DD"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.birth}
                                    onChange={(e) =>
                                        setData("birth", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                >
                                    <option value="" disabled hidden>
                                        Select Gender
                                    </option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                                {/* Dropdown arrow icon */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="********"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="********"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                    value={data.confirmPassword}
                                    onChange={(e) =>
                                        setData(
                                            "confirmPassword",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="roleselect"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Role
                            </label>
                            <Select
                                id="roleselect"
                                value={data.role}
                                onValueChange={(e) => {
                                    const roleValue = Number(e);
                                    setData("role", roleValue);
                                    // Reset specialization when changing roles to non-Doctor
                                    if (roleValue !== 1) {
                                        setData("specialization", "");
                                    }
                                }}
                            >
                                <SelectTrigger className=" w-full">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={7}>Admin</SelectItem>
                                    <SelectItem value={1}>Doctor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Specialization - Only shown for Doctor role */}
                        {isDoctorSelected && (
                            <div>
                                <label
                                    htmlFor="specialization"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Specialization
                                </label>
                                <Select
                                    id="specialization"
                                    value={data.specialization}
                                    onValueChange={(value) => setData("specialization", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Specialization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Security Question Dropdown */}

                        {/* Security Answer */}
                        {/* <div>
                                        <label
                                            htmlFor="securityAnswer"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Security Answer
                                        </label>
                                    </div> */}
                    </div>

                    {/* Submit Button */}
                    <PrimaryButton
                        className=" mt-2 float-right"
                        disabled={processing}
                    >
                        Register
                    </PrimaryButton>
                </form>
            </Modal2>
        </AdminLayout>
    );
}
