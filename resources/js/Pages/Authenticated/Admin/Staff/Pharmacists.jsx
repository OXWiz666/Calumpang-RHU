import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { showToast } from "@/utils/toast.jsx";
import { useArchiveConfirmation } from "@/utils/confirmation.jsx";
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
    Pill,
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/tempo/components/ui/dropdown-menu";

import Modal2 from "@/components/CustomModal";
import StaffLayout from "./StaffLayout";
import Sidebar from "./Sidebar";
import Label from "@/components/InputLabel";
import InputError from "@/components/InputError";


export default function Pharmacists({ pharmacists = [] }) {
    const { flash } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const { confirmArchive, confirmUnarchive, ConfirmationDialog } = useArchiveConfirmation();
    const [selectedPharmacist, setSelectedPharmacist] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedPharmacists, setSelectedPharmacists] = useState([]);

    // Handle flash messages from the server
    useEffect(() => {
        if (flash && flash.message) {
            showToast(flash.title, flash.message, flash.icon);
        }
    }, [flash]);

    // Form for creating a new pharmacist
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
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
        isAdmin: "false",
        role: 6, // Pharmacist role
    });

    // Filter and pagination logic
    const filteredPharmacists = pharmacists.filter((pharmacist) => {
        const matchesSearch =
            pharmacist.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacist.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacist.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || pharmacist.status?.toString() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredPharmacists.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPharmacists = filteredPharmacists.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const OpenModal = (e) => {
        setIsModalOpen(true);
    };

    const CloseModal = (e) => {
        setIsModalOpen(false);
        clearErrors();
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.register"), {
            onSuccess: (r) => {
                CloseModal();
                showToast("Success!", "Pharmacist has been registered successfully!", "success", "create");
                router.reload({
                    only: ["auth"],
                    preserveScroll: true,
                });
            },
        });
    };

    const getStatusBadge = (pharmacist) => {
        const status = pharmacist?.status;
        switch (status) {
            case 1:
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Active
                    </Badge>
                );
            case 2:
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        Inactive
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
                        Active
                    </Badge>
                );
        }
    };

    const handleArchivePharmacist = async (pharmacistId) => {
        const pharmacist = pharmacists.find(p => p.id === pharmacistId);
        const pharmacistName = pharmacist ? `${pharmacist.firstname} ${pharmacist.lastname}` : 'Pharmacist';
        
        confirmArchive(pharmacistName, async () => {
            try {
                setIsLoading(true);
                const response = await axios.post('/admin/staff/archive', { staff_id: pharmacistId });
                
                if (response.data.success) {
                    showToast("Success!", "Pharmacist archived successfully", "success", "archive");
                    router.reload();
                } else {
                    showToast("Error", response.data.message || "Failed to archive pharmacist", "error");
                }
            } catch (error) {
                console.error("Error archiving pharmacist:", error);
                const errorMessage = error.response?.data?.message || "Failed to archive pharmacist";
                showToast("Error", errorMessage, "error");
            } finally {
                setIsLoading(false);
            }
        });
    };

    const handleUnarchivePharmacist = async (pharmacistId) => {
        const pharmacist = pharmacists.find(p => p.id === pharmacistId);
        const pharmacistName = pharmacist ? `${pharmacist.firstname} ${pharmacist.lastname}` : 'Pharmacist';
        
        confirmUnarchive(pharmacistName, async () => {
            try {
                setIsLoading(true);
                const response = await axios.post('/admin/staff/unarchive', { staff_id: pharmacistId });
                
                if (response.data.success) {
                    showToast("Success!", "Pharmacist unarchived successfully", "success", "unarchive");
                    router.reload();
                } else {
                    showToast("Error", response.data.message || "Failed to unarchive pharmacist", "error");
                }
            } catch (error) {
                console.error("Error unarchiving pharmacist:", error);
                const errorMessage = error.response?.data?.message || "Failed to unarchive pharmacist";
                showToast("Error", errorMessage, "error");
            } finally {
                setIsLoading(false);
            }
        });
    };

    const handleExport = () => {
        const csvContent = [
            ['Pharmacist ID', 'Name', 'Email', 'Contact', 'Status', 'Created At'],
            ...filteredPharmacists.map(pharmacist => [
                pharmacist.id,
                `${pharmacist.firstname} ${pharmacist.lastname}`,
                pharmacist.email,
                pharmacist.contactno,
                pharmacist.status === 1 ? 'Active' : pharmacist.status === 5 ? 'Archived' : 'Inactive',
                new Date(pharmacist.created_at).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `pharmacists_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("Success!", "Pharmacists exported successfully!", "success", "export");
    };

    return (
        <StaffLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Pharmacists</h1>
                    <p className="text-lg text-gray-600">
                        Manage pharmacy staff and their responsibilities
                    </p>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-8">
                    <Sidebar activeTab={"pharmacists"} />
                    
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
                                            <CardTitle className="text-2xl font-bold text-gray-900">All Pharmacists</CardTitle>
                                            <CardDescription className="text-gray-600 mt-1">
                                                Manage and configure pharmacist accounts
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-2 hover:bg-gray-50"
                                                onClick={handleExport}
                                            >
                                                <Download className="h-4 w-4" />
                                                Export
                                            </Button>
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
                                                    placeholder="Search pharmacists..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 border-2 focus:border-orange-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Filter className="h-4 w-4 text-gray-500" />
                                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                <SelectTrigger className="w-[180px] border-2">
                                                    <SelectValue placeholder="Filter by status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="1">Active</SelectItem>
                                                    <SelectItem value="2">Inactive</SelectItem>
                                                    <SelectItem value="5">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pharmacists Table */}
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
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Contact</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isLoading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center py-12">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                                                                <p className="text-gray-500">Loading pharmacists...</p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : paginatedPharmacists.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center py-12">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="p-4 bg-gray-100 rounded-full">
                                                                    <Pill className="h-8 w-8 text-gray-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-medium text-gray-900">No pharmacists found</p>
                                                                    <p className="text-gray-500">Try adjusting your search or filters</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    paginatedPharmacists.map((pharmacist) => (
                                                        <TableRow key={pharmacist.id} className="hover:bg-gray-50 transition-colors">
                                                            <TableCell>
                                                                <div className="font-medium text-gray-900">
                                                                    PHM-{pharmacist.id}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-10 w-10">
                                                                        <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                                                                            {pharmacist.firstname?.charAt(0)}{pharmacist.lastname?.charAt(0)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <div className="font-semibold text-gray-900">
                                                                            {pharmacist.firstname} {pharmacist.lastname}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            Pharmacist
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm text-gray-700">
                                                                    {pharmacist.email}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm text-gray-700">
                                                                    {pharmacist.contactno || 'Not provided'}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(pharmacist)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-600"
                                                                        onClick={() => {
                                                                            setSelectedPharmacist(pharmacist);
                                                                            setIsViewModalOpen(true);
                                                                        }}
                                                                        title="View pharmacist"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
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
                                                                                onClick={() => {
                                                                                    setSelectedPharmacist(pharmacist);
                                                                                    setIsViewModalOpen(true);
                                                                                }}
                                                                            >
                                                                                <Eye className="h-4 w-4 mr-2" />
                                                                                View Details
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem>
                                                                                <Edit className="h-4 w-4 mr-2" />
                                                                                Edit Pharmacist
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            {pharmacist.status === 5 ? (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleUnarchivePharmacist(pharmacist.id)}
                                                                                    className="text-green-600"
                                                                                >
                                                                                    <ArchiveRestore className="h-4 w-4 mr-2" />
                                                                                    Unarchive
                                                                                </DropdownMenuItem>
                                                                            ) : (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleArchivePharmacist(pharmacist.id)}
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
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pagination */}
                        {filteredPharmacists.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Card className="shadow-lg border-0">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div className="text-sm text-gray-600">
                                                Showing {startIndex + 1} to {Math.min(endIndex, filteredPharmacists.length)} of {filteredPharmacists.length} Results
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1 || totalPages <= 1}
                                                    className="w-8 h-8 p-0 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="w-8 h-8 p-0 bg-gray-800 text-white hover:bg-gray-700"
                                                >
                                                    {currentPage}
                                                </Button>
                                                
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages || totalPages <= 1}
                                                    className="w-8 h-8 p-0 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Pharmacist Modal */}
            <Modal2 isOpen={isModalOpen} maxWidth="lg" onClose={CloseModal}>
                <div className="py-4">
                    <h2 className="text-xl font-semibold mb-4">Add New Pharmacist</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData("first_name", e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.first_name && <InputError message={errors.first_name} />}
                                </div>
                                <div>
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData("last_name", e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.last_name && <InputError message={errors.last_name} />}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    className="mt-1"
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>
                            
                            <div>
                                <Label htmlFor="contactNumber">Contact Number</Label>
                                <Input
                                    id="contactNumber"
                                    value={data.contactNumber}
                                    onChange={(e) => setData("contactNumber", e.target.value)}
                                    className="mt-1"
                                />
                                {errors.contactNumber && <InputError message={errors.contactNumber} />}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.password && <InputError message={errors.password} />}
                                </div>
                                <div>
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={data.confirmPassword}
                                        onChange={(e) => setData("confirmPassword", e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.confirmPassword && <InputError message={errors.confirmPassword} />}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={CloseModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Creating..." : "Create Pharmacist"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal2>

            {/* View Pharmacist Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Pharmacist Details</DialogTitle>
                        <DialogDescription>
                            View pharmacist information and account details
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedPharmacist && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-orange-100 text-orange-700 text-xl font-bold">
                                        {selectedPharmacist.firstname?.charAt(0)}{selectedPharmacist.lastname?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {selectedPharmacist.firstname} {selectedPharmacist.lastname}
                                    </h3>
                                    <p className="text-gray-600">Pharmacist</p>
                                    {getStatusBadge(selectedPharmacist)}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-gray-900">{selectedPharmacist.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Contact Number</label>
                                    <p className="text-gray-900">{selectedPharmacist.contactno || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Pharmacist ID</label>
                                    <p className="text-gray-900">PHM-{selectedPharmacist.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Created At</label>
                                    <p className="text-gray-900">{new Date(selectedPharmacist.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog />
        </StaffLayout>
    );
}
