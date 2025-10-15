import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import InputError from "@/components/InputError";
import { motion } from "framer-motion";

import {
    Trash2,
    ArrowUpCircle,
    Eye,
    Calendar,
    Clock3,
    MapPin,
    User as UserIcon,
    Hash,
    Search,
    Filter,
    Plus,
    Download,
    Users,
    Activity,
    Archive,
    TrendingUp,
    TrendingDown,
    MoreHorizontal,
    Edit,
    ArchiveRestore,
    ChevronDown,
    ChevronUp,
    Phone,
    Mail,
    User,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
// UI Components
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/tempo/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/tempo/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/tempo/components/ui/dialog";
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

// Enhanced Statistics Card Component
const StatisticCard = ({
    title,
    value,
    icon,
    change,
    description,
    iconBgColor = "bg-blue-100",
    iconColor = "text-blue-600",
    trend,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                            {description && (
                                <p className="text-xs text-gray-500 mb-3">{description}</p>
                            )}
                            <div className="flex items-center">
                                {trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                ) : trend === 'down' ? (
                                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                ) : null}
                                <span className={`text-sm font-semibold ${
                                    trend === 'up' ? 'text-green-600' : 
                                    trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {change?.value || value} total
                            </span>
                        </div>
                </div>
                        <div className={`p-4 rounded-2xl ${iconBgColor} shadow-lg`}>
                            <div className={iconColor}>
                                {icon}
            </div>
        </div>
                    </div>
                    {change && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">This month</span>
                                <Badge variant="default" className="text-xs">
                                    {change.isPositive ? '+' : ''}{change.value}%
                                </Badge>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

const HealthPrograms = ({
    programs = [],
    doctors = [],
    flash,
    activePrograms = 0,
    archivedPrograms = 0,
    todayAppointments = 0,
    totalParticipants = 0,
}) => {
    const [localPrograms, setLocalPrograms] = useState(programs);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "ascending",
    });
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [successMessage, setSuccessMessage] = useState(flash?.success || "");
    const [errorMessage, setErrorMessage] = useState(flash?.error || "");
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        type: null, // 'archive' | 'unarchive'
        programId: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    
    // Patient modal state
    const [isViewPatientsModalOpen, setIsViewPatientsModalOpen] = useState(false);
    const [programPatients, setProgramPatients] = useState([]);
    const [patientsLoading, setPatientsLoading] = useState(false);
    const [patientsPagination, setPatientsPagination] = useState({});

    // Update localPrograms when programs prop changes
    useEffect(() => {
        if (programs && Array.isArray(programs)) {
            console.log("Programs updated from props:", programs);
            setLocalPrograms(programs);
        }
    }, [programs]);

    // Set flash messages and handle programs data from flash
    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            // Clear after 5 seconds
            const timer = setTimeout(() => setSuccessMessage(""), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setErrorMessage(flash.error);
            // Clear after 5 seconds
            const timer = setTimeout(() => setErrorMessage(""), 5000);
            return () => clearTimeout(timer);
        }

        // If flash contains programs data, update the local state
        if (flash?.programs && Array.isArray(flash.programs)) {
            console.log("Programs updated from flash:", flash.programs);
            setLocalPrograms(flash.programs);
        }
    }, [flash]);

    // Filter programs based on search term and status
    const filteredPrograms = localPrograms.filter((program) => {
        const matchesSearch =
            program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (program.coordinator &&
                program.coordinator
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" || program.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort programs
    const sortedPrograms = [...filteredPrograms].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedPrograms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPrograms = sortedPrograms.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Handle sorting
    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Bulk action functions
    const handleSelectAll = () => {
        if (selectedPrograms.length === paginatedPrograms.length) {
            setSelectedPrograms([]);
        } else {
            setSelectedPrograms(paginatedPrograms.map(program => program.id));
        }
    };

    const handleSelectProgram = (programId) => {
        setSelectedPrograms(prev => 
            prev.includes(programId) 
                ? prev.filter(id => id !== programId)
                : [...prev, programId]
        );
    };

    // Fetch patients for a specific program
    const fetchProgramPatients = async (programId, page = 1) => {
        setPatientsLoading(true);
        
        try {
            const response = await axios.get(`/admin/programs/${programId}/patients`, {
                params: { page, per_page: 10 }
            });
            
            setProgramPatients(response.data.participants);
            setPatientsPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching program patients:', error);
        } finally {
            setPatientsLoading(false);
        }
    };

    // Handle patient pagination
    const handlePatientPageChange = (page) => {
        if (selectedProgram) {
            fetchProgramPatients(selectedProgram.id, page);
        }
    };

    const handleBulkArchive = async () => {
        try {
            setIsLoading(true);
            const promises = selectedPrograms.map(programId => 
                axios.post('/admin/programs/archive', { program_id: programId })
            );
            await Promise.all(promises);
            
            // Update local state
            setLocalPrograms(prev => prev.map(program => 
                selectedPrograms.includes(program.id) 
                    ? { ...program, status: 'Archived' }
                    : program
            ));
            
            setSelectedPrograms([]);
            setSuccessMessage(`Successfully archived ${selectedPrograms.length} programs`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error archiving programs:", error);
            setErrorMessage("Failed to archive programs");
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        const csvContent = [
            ['Program Name', 'Description', 'Date', 'Time', 'Location', 'Slots', 'Coordinator', 'Status'],
            ...sortedPrograms.map(program => [
                program.name,
                program.description,
                program.date,
                `${program.startTime} - ${program.endTime}`,
                program.location,
                `${program.availableSlots}/${program.totalSlots}`,
                program.coordinator,
                program.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `health_programs_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setSuccessMessage("Programs exported successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    // Handle archive/unarchive program
    const handleArchiveProgram = async (programId, isArchived) => {
        setIsLoading(true);
        try {
            const endpoint = isArchived
                ? "/admin/programs/unarchive"
                : "/admin/programs/archive";
            const response = await axios.post(endpoint, {
                program_id: programId,
            });

            if (response.data.programs) {
                setLocalPrograms(response.data.programs);
                setSuccessMessage(response.data.message);
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error archiving/unarchiving program:", error);
            setErrorMessage(
                error.response?.data?.message ||
                    "An error occurred while updating the program"
            );
            // Clear error message after 3 seconds
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // Form for creating a new health program
    const { data, setData, post, processing, errors, reset } = useForm({
        programname: "",
        description: "",
        date: "",
        starttime: "",
        endtime: "",
        location: "",
        slots: "",
        coordinatorid: "",
        status: "Available",
    });

    // Form for editing a health program
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        programname: "",
        description: "",
        date: "",
        starttime: "",
        endtime: "",
        location: "",
        slots: "",
        coordinatorid: "",
        status: "Available",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(route("admin.programs.create"), {
            preserveScroll: true,
            onSuccess: (response) => {
                reset();
                setIsCreateDialogOpen(false);
                setIsLoading(false);

                // Manually update the local programs list with the new data
                if (response?.props?.flash?.programs) {
                    setLocalPrograms(response.props.flash.programs);
                } else {
                    // If no programs in response, fetch the latest programs
                    axios
                        .get(route("admin.programs.fetch"))
                        .then((res) => {
                            if (res.data.programs) {
                                setLocalPrograms(res.data.programs);
                            }
                        })
                        .catch((err) =>
                            console.error("Error fetching programs:", err)
                        );
                }
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    // Handle edit program
    const handleEditProgram = (program) => {
        setSelectedProgram(program);
        setEditData({
            programname: program.name,
            description: program.description,
            date: program.date,
            starttime: program.startTime,
            endtime: program.endTime,
            location: program.location,
            slots: program.totalSlots,
            coordinatorid: program.coordinatorId?.toString() || "",
            status: program.status,
        });
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        put(route("admin.programs.update", selectedProgram.id), {
            preserveScroll: true,
            onSuccess: (response) => {
                resetEdit();
                setIsEditDialogOpen(false);
                setIsLoading(false);
                setSelectedProgram(null);

                // Update local programs list
                if (response?.props?.flash?.programs) {
                    setLocalPrograms(response.props.flash.programs);
                } else {
                    // Fetch latest programs
                    axios
                        .get(route("admin.programs.fetch"))
                        .then((res) => {
                            if (res.data.programs) {
                                setLocalPrograms(res.data.programs);
                            }
                        })
                        .catch((err) =>
                            console.error("Error fetching programs:", err)
                        );
                }
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Active":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Active
                    </Badge>
                );
            case "Completed":
                return (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Completed
                    </Badge>
                );
            case "Upcoming":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        Upcoming
                    </Badge>
                );
            case "Cancelled":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        Cancelled
                    </Badge>
                );
            case "Available":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Available
                    </Badge>
                );
            case "Full":
                return (
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                        Full
                    </Badge>
                );
            case "Archived":
                return (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        Archived
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <AdminLayout>
            <div className="px-4 md:px-6 py-6 space-y-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Health Programs</h1>
                    <p className="text-lg text-gray-600">
                        Monitor and manage all health programs and their participants
                    </p>
                </motion.div>

                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatisticCard
                        title="Today's Appointments"
                        value={todayAppointments}
                        description="Scheduled for today"
                        icon={<Calendar className="h-6 w-6" />}
                        iconBgColor="bg-blue-100"
                        iconColor="text-blue-600"
                        trend="up"
                        change={{ value: todayAppointments, isPositive: true }}
                    />

                    <StatisticCard
                        title="Active Health Programs"
                        value={activePrograms}
                        description="Currently running"
                        icon={<Activity className="h-6 w-6" />}
                        iconBgColor="bg-green-100"
                        iconColor="text-green-600"
                        trend="up"
                        change={{ value: activePrograms, isPositive: true }}
                    />

                    <StatisticCard
                        title="Archived Programs"
                        value={archivedPrograms}
                        description="Completed or archived"
                        icon={<Archive className="h-6 w-6" />}
                        iconBgColor="bg-amber-100"
                        iconColor="text-amber-600"
                        trend="down"
                        change={{ value: archivedPrograms, isPositive: false }}
                    />

                    <StatisticCard
                        title="Total Participants"
                        value={totalParticipants}
                        description="Across all programs"
                        icon={<Users className="h-6 w-6" />}
                        iconBgColor="bg-purple-100"
                        iconColor="text-purple-600"
                        trend="up"
                        change={{ value: totalParticipants, isPositive: true }}
                    />
                </div>


                {/* Programs Management Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900">All Programs</CardTitle>
                                    <CardDescription className="text-gray-600 mt-1">
                                        Manage and configure all health programs
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
                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                    >
                        <DialogTrigger asChild>
                                            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                                <Plus className="h-4 w-4" />
                                                Create Program
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader className="">
                                <DialogTitle>
                                    Create New Health Program
                                </DialogTitle>
                                <DialogDescription>
                                    Fill in the details to create a new health
                                    program.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="text-sm font-medium">
                                            Program Name
                                        </label>
                                        <Input
                                            placeholder="Enter program name"
                                            value={data.programname}
                                            onChange={(e) =>
                                                setData(
                                                    "programname",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.programname && (
                                            <InputError
                                                message={errors.programname}
                                            />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="text-sm font-medium">
                                            Description
                                        </label>
                                        <Input
                                            placeholder="Enter program description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.description && (
                                            <InputError
                                                message={errors.description}
                                            />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="text-sm font-medium">
                                            Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={data.date}
                                            onChange={(e) =>
                                                setData("date", e.target.value)
                                            }
                                        />
                                        {errors.date && (
                                            <InputError message={errors.date} />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Start Time
                                            </label>
                                            <Input
                                                type="time"
                                                value={data.starttime}
                                                onChange={(e) =>
                                                    setData(
                                                        "starttime",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errors.starttime && (
                                                <InputError
                                                    message={errors.starttime}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                End Time
                                            </label>
                                            <Input
                                                type="time"
                                                value={data.endtime}
                                                onChange={(e) =>
                                                    setData(
                                                        "endtime",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errors.endtime && (
                                                <InputError
                                                    message={errors.endtime}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="text-sm font-medium">
                                            Location
                                        </label>
                                        <Input
                                            placeholder="Enter program location"
                                            value={data.location}
                                            onChange={(e) =>
                                                setData(
                                                    "location",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.location && (
                                            <InputError
                                                message={errors.location}
                                            />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="text-sm font-medium">
                                            Available Slots
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="Enter number of slots"
                                            value={data.slots}
                                            onChange={(e) =>
                                                setData("slots", e.target.value)
                                            }
                                        />
                                        {errors.slots && (
                                            <InputError
                                                message={errors.slots}
                                            />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="text-sm font-medium">
                                            Coordinator
                                        </label>
                                        <Select
                                            value={data.coordinatorid}
                                            onValueChange={(value) =>
                                                setData("coordinatorid", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select coordinator" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.map((doctor) => (
                                                    <SelectItem
                                                        key={doctor.id}
                                                        value={doctor.id.toString()}
                                                    >
                                                        Dr. {doctor.lastname}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.coordinatorid && (
                                            <InputError
                                                message={errors.coordinatorid}
                                            />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="text-sm font-medium">
                                            Status
                                        </label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData("status", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Available">
                                                    Available
                                                </SelectItem>
                                                <SelectItem value="Full">
                                                    Full
                                                </SelectItem>
                                                <SelectItem value="Cancelled">
                                                    Cancelled
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <InputError
                                                message={errors.status}
                                            />
                                        )}
                                    </div>
                                </div>
                                <DialogFooter className="sticky bottom-0 bg-transparent pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing || isLoading}
                                        className="px-4 py-2 text-sm shadow-md flex items-center justify-center"
                                    >
                                        {processing || isLoading
                                            ? "Creating..."
                                            : "Create Program"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Success message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">
                            {successMessage}
                        </span>
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}

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
                            placeholder="Search programs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 border-2 focus:border-blue-500"
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
                                <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Bulk Actions Bar */}
                {selectedPrograms.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="shadow-lg border-0 bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-medium text-blue-900">
                                            {selectedPrograms.length} program{selectedPrograms.length > 1 ? 's' : ''} selected
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedPrograms([])}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            Clear selection
                                        </Button>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleBulkArchive}
                                            disabled={isLoading}
                                            className="border-red-200 text-red-700 hover:bg-red-50"
                                        >
                                            Archive
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Programs Table */}
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
                                            <TableHead className="w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPrograms.length === paginatedPrograms.length && paginatedPrograms.length > 0}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </TableHead>
                                <TableHead
                                                className="cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => requestSort("name")}
                                >
                                                <div className="flex items-center gap-2">
                                        Program Name
                                        {sortConfig.key === "name" && (
                                                        <span className="text-gray-400">
                                                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Slots</TableHead>
                                            <TableHead>Coordinator</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Patients</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                                <TableCell colSpan={11} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                        <p className="text-gray-500">Loading programs...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                        ) : paginatedPrograms.length === 0 ? (
                                <TableRow>
                                                <TableCell colSpan={11} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="p-4 bg-gray-100 rounded-full">
                                                            <Activity className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-medium text-gray-900">No programs found</p>
                                                            <p className="text-gray-500">Try adjusting your search or filters</p>
                                                        </div>
                                                    </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                            paginatedPrograms.map((program) => (
                                                <TableRow key={program.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPrograms.includes(program.id)}
                                                            onChange={() => handleSelectProgram(program.id)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl text-blue-700 font-semibold">
                                                                {program.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                                <div className="font-semibold text-gray-900">
                                                        {program.name}
                                                    </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {program.id}
                                                                </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                                        <div className="max-w-xs">
                                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                {program.description}
                                                            </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm font-medium">
                                                                {new Date(program.date).toLocaleDateString()}
                                                            </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Clock3 className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm">
                                                                {program.startTime} - {program.endTime}
                                                            </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm">
                                                {program.location}
                                                            </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Hash className="h-4 w-4 text-gray-400" />
                                            <div className="text-sm">
                                                                <div className="font-medium">
                                                                    {program.availableSlots}/{program.totalSlots}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {Math.round((program.availableSlots / program.totalSlots) * 100)}% available
                                                                </div>
                                                            </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <UserIcon className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm font-medium">
                                                {program.coordinator}
                                                            </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(program.status)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedProgram(program);
                                                    fetchProgramPatients(program.id, 1);
                                                    setIsViewPatientsModalOpen(true);
                                                }}
                                                className="flex items-center gap-2 text-xs"
                                            >
                                                <Users className="h-3 w-3" />
                                                View Participants
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                                        <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                                                    onClick={() => {
                                                        setSelectedProgram(program);
                                                        setIsViewDialogOpen(true);
                                                    }}
                                                                title="View program"
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
                                                                            setSelectedProgram(program);
                                                                            setIsViewDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-2" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleEditProgram(program)}
                                                                    >
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Edit Program
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    {program.status === "Archived" ? (
                                                                        <DropdownMenuItem
                                                        onClick={() =>
                                                            setConfirmDialog({
                                                                isOpen: true,
                                                                type: 'unarchive',
                                                                programId: program.id,
                                                            })
                                                        }
                                                                            className="text-green-600"
                                                                        >
                                                                            <ArchiveRestore className="h-4 w-4 mr-2" />
                                                                            Unarchive
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <DropdownMenuItem
                                                        onClick={() =>
                                                            setConfirmDialog({
                                                                isOpen: true,
                                                                type: 'archive',
                                                                programId: program.id,
                                                            })
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card className="shadow-lg border-0">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing {startIndex + 1} to {Math.min(endIndex, sortedPrograms.length)} of {sortedPrograms.length} programs
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1"
                                        >
                                            Previous
                                        </Button>
                                        
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={currentPage === pageNum ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
                {/* Enhanced View Program Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="pb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl text-blue-700 text-2xl font-bold">
                                    {selectedProgram?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <DialogTitle className="text-2xl font-bold text-gray-900">
                                        {selectedProgram?.name}
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-600 mt-1">
                                        Health Program Details
                            </DialogDescription>
                                </div>
                                <div className="flex-shrink-0">
                                    {selectedProgram && getStatusBadge(selectedProgram.status)}
                                </div>
                            </div>
                        </DialogHeader>
                        
                        {selectedProgram && (
                            <div className="space-y-6">
                                {/* Program Description */}
                                <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Description</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                        {selectedProgram.description}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Program Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-blue-100 rounded-xl">
                                                    <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Date & Time</h4>
                                                    <p className="text-sm text-gray-500">Program schedule</p>
                                </div>
                                            </div>
                                            <div className="space-y-3">
                                        <div>
                                                    <span className="text-sm font-medium text-gray-600">Date:</span>
                                                    <p className="text-gray-900 font-semibold">
                                                        {new Date(selectedProgram.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                        </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600">Time:</span>
                                                    <p className="text-gray-900 font-semibold">
                                                        {selectedProgram.startTime} - {selectedProgram.endTime}
                                                    </p>
                                    </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-green-100 rounded-xl">
                                                    <MapPin className="h-6 w-6 text-green-600" />
                                                </div>
                                        <div>
                                                    <h4 className="font-semibold text-gray-900">Location</h4>
                                                    <p className="text-sm text-gray-500">Program venue</p>
                                        </div>
                                    </div>
                                            <p className="text-gray-900 font-semibold">
                                                {selectedProgram.location}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-purple-100 rounded-xl">
                                                    <Hash className="h-6 w-6 text-purple-600" />
                                                </div>
                                        <div>
                                                    <h4 className="font-semibold text-gray-900">Capacity</h4>
                                                    <p className="text-sm text-gray-500">Available slots</p>
                                        </div>
                                    </div>
                                            <div className="space-y-3">
                                        <div>
                                                    <span className="text-sm font-medium text-gray-600">Total Slots:</span>
                                                    <p className="text-gray-900 font-semibold">{selectedProgram.totalSlots}</p>
                                        </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600">Available:</span>
                                                    <p className="text-gray-900 font-semibold">{selectedProgram.availableSlots}</p>
                                    </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${(selectedProgram.availableSlots / selectedProgram.totalSlots) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {Math.round((selectedProgram.availableSlots / selectedProgram.totalSlots) * 100)}% available
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-orange-100 rounded-xl">
                                                    <UserIcon className="h-6 w-6 text-orange-600" />
                                                </div>
                                        <div>
                                                    <h4 className="font-semibold text-gray-900">Coordinator</h4>
                                                    <p className="text-sm text-gray-500">Program manager</p>
                                        </div>
                                    </div>
                                            <p className="text-gray-900 font-semibold">
                                                {selectedProgram.coordinator}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                        
                        <DialogFooter className="pt-6 border-t">
                            <div className="flex justify-between items-center w-full">
                                <div className="text-sm text-gray-500">
                                    Program ID: {selectedProgram?.id}
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                        Close
                                    </Button>
                                    <Button 
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                        onClick={() => {
                                            setIsViewDialogOpen(false);
                                            handleEditProgram(selectedProgram);
                                        }}
                                    >
                                        Edit Program
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Program Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Edit Health Program</DialogTitle>
                            <DialogDescription>
                                Update the details of the selected health program.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <label className="text-sm font-medium">Program Name</label>
                                    <Input
                                        placeholder="Enter program name"
                                        value={editData.programname}
                                        onChange={(e) => setEditData("programname", e.target.value)}
                                    />
                                    {editErrors.programname && (
                                        <InputError message={editErrors.programname} />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <label className="text-sm font-medium">Description</label>
                                    <Input
                                        placeholder="Enter program description"
                                        value={editData.description}
                                        onChange={(e) => setEditData("description", e.target.value)}
                                    />
                                    {editErrors.description && (
                                        <InputError message={editErrors.description} />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <label className="text-sm font-medium">Date</label>
                                    <Input
                                        type="date"
                                        value={editData.date}
                                        onChange={(e) => setEditData("date", e.target.value)}
                                    />
                                    {editErrors.date && (
                                        <InputError message={editErrors.date} />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="text-sm font-medium">Start Time</label>
                                        <Input
                                            type="time"
                                            value={editData.starttime}
                                            onChange={(e) => setEditData("starttime", e.target.value)}
                                        />
                                        {editErrors.starttime && (
                                            <InputError message={editErrors.starttime} />
                                        )}
                                        </div>
                                    <div>
                                        <label className="text-sm font-medium">End Time</label>
                                        <Input
                                            type="time"
                                            value={editData.endtime}
                                            onChange={(e) => setEditData("endtime", e.target.value)}
                                        />
                                        {editErrors.endtime && (
                                            <InputError message={editErrors.endtime} />
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <label className="text-sm font-medium">Location</label>
                                    <Input
                                        placeholder="Enter program location"
                                        value={editData.location}
                                        onChange={(e) => setEditData("location", e.target.value)}
                                    />
                                    {editErrors.location && (
                                        <InputError message={editErrors.location} />
                                    )}
                            </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <label className="text-sm font-medium">Total Slots</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter number of slots"
                                        value={editData.slots}
                                        onChange={(e) => setEditData("slots", e.target.value)}
                                    />
                                    {editErrors.slots && (
                                        <InputError message={editErrors.slots} />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <label className="text-sm font-medium">Coordinator</label>
                                    <Select
                                        value={editData.coordinatorid}
                                        onValueChange={(value) => setEditData("coordinatorid", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select coordinator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.map((doctor) => (
                                                <SelectItem
                                                    key={doctor.id}
                                                    value={doctor.id.toString()}
                                                >
                                                    Dr. {doctor.lastname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editErrors.coordinatorid && (
                                        <InputError message={editErrors.coordinatorid} />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select
                                        value={editData.status}
                                        onValueChange={(value) => setEditData("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="Full">Full</SelectItem>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            <SelectItem value="Archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {editErrors.status && (
                                        <InputError message={editErrors.status} />
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="sticky bottom-0 bg-transparent pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        resetEdit();
                                        setSelectedProgram(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editProcessing || isLoading}
                                    className="px-4 py-2 text-sm shadow-md flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    {editProcessing || isLoading ? "Updating..." : "Update Program"}
                                </Button>
                        </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Confirmation Dialog */}
                <AlertDialog
                    open={confirmDialog.isOpen}
                    onOpenChange={(isOpen) =>
                        setConfirmDialog({ isOpen, type: null, programId: null })
                    }
                >
                    <AlertDialogContent className="max-w-[400px]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">
                                {confirmDialog.type === 'archive' ? 'Archive Program' : 'Unarchive Program'}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                                {confirmDialog.type === 'archive'
                                    ? 'Are you sure you want to archive this program? This will remove it from the active list.'
                                    : 'Are you sure you want to unarchive this program? This will return it to the active list.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (confirmDialog.programId) {
                                        handleArchiveProgram(
                                            confirmDialog.programId,
                                            confirmDialog.type === 'unarchive'
                                        );
                                    }
                                    setConfirmDialog({ isOpen: false, type: null, programId: null });
                                }}
                                className={`${
                                    confirmDialog.type === 'archive'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                } text-white`}
                            >
                                {confirmDialog.type === 'archive' ? 'Archive' : 'Unarchive'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* View Patients Modal */}
                <Dialog open={isViewPatientsModalOpen} onOpenChange={setIsViewPatientsModalOpen}>
                    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Registered Participants - {selectedProgram?.name}
                            </DialogTitle>
                            <DialogDescription>
                                View all participants registered for this health program
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                            {patientsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-500">Loading participants...</span>
                                </div>
                            ) : programPatients.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            Total: {patientsPagination.total} participants
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Showing {patientsPagination.from} to {patientsPagination.to} of {patientsPagination.total}
                                        </p>
                                    </div>
                                    
                                    {/* List Format for Patients */}
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Table Header */}
                                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="col-span-3">Name</div>
                                                <div className="col-span-2">Registration ID</div>
                                                <div className="col-span-2">Contact</div>
                                                <div className="col-span-2">Email</div>
                                                <div className="col-span-1">Age</div>
                                                <div className="col-span-1">Gender</div>
                                                <div className="col-span-1">Status</div>
                                            </div>
                                        </div>
                                        
                                        {/* Table Body */}
                                        <div className="divide-y divide-gray-200">
                                            {programPatients.map((patient) => (
                                                <div key={patient.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                                    <div className="grid grid-cols-12 gap-4 items-center">
                                                        {/* Name */}
                                                        <div className="col-span-3 flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <User className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {patient.full_name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Registration ID */}
                                                        <div className="col-span-2">
                                                            <p className="text-sm text-gray-900 font-mono">
                                                                {patient.id}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Contact */}
                                                        <div className="col-span-2">
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                                <span className="text-sm text-gray-900">{patient.contact_number}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Email */}
                                                        <div className="col-span-2">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="h-4 w-4 text-gray-400" />
                                                                <span className="text-sm text-gray-900 truncate">{patient.email}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Age */}
                                                        <div className="col-span-1">
                                                            <span className="text-sm text-gray-900">{patient.age} years</span>
                                                        </div>
                                                        
                                                        {/* Gender */}
                                                        <div className="col-span-1">
                                                            <span className="text-sm text-gray-900">{patient.sex}</span>
                                                        </div>
                                                        
                                                        {/* Status */}
                                                        <div className="col-span-1">
                                                            <Badge 
                                                                variant="outline" 
                                                                className={`text-xs ${
                                                                    patient.status === 'Registered' 
                                                                        ? 'bg-green-100 text-green-800 border-green-200' 
                                                                        : 'bg-gray-100 text-gray-800 border-gray-200'
                                                                }`}
                                                            >
                                                                {patient.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Registration Date - Full width row */}
                                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span className="text-xs text-gray-500">
                                                                Registered: {new Date(patient.registered_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Pagination for patients */}
                                    {patientsPagination.last_page > 1 && (
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="text-sm text-gray-500">
                                                Page {patientsPagination.current_page} of {patientsPagination.last_page}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePatientPageChange(patientsPagination.current_page - 1)}
                                                    disabled={patientsPagination.current_page === 1}
                                                    className="flex items-center gap-1"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePatientPageChange(patientsPagination.current_page + 1)}
                                                    disabled={patientsPagination.current_page === patientsPagination.last_page}
                                                    className="flex items-center gap-1"
                                                >
                                                    Next
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No participants registered</h3>
                                    <p className="text-gray-500">This program doesn't have any registered participants yet.</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default HealthPrograms;
