import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import InputError from "@/components/InputError";

// UI Components
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/tempo/components/ui/dialog";

// Statistics Card Component
const StatisticCard = ({ title, value, icon, change, bgColor = "bg-white" }) => {
    return (
        <div className={`${bgColor} rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary p-4`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {change && (
                        <div className="flex items-center mt-2">
                            {change.isPositive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500 mr-1">
                                    <path d="m5 12 7-7 7 7"></path>
                                    <path d="M12 19V5"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-red-500 mr-1">
                                    <path d="m5 12 7 7 7-7"></path>
                                    <path d="M12 5v14"></path>
                                </svg>
                            )}
                            <span className={`text-xs font-medium ${change.isPositive ? "text-green-500" : "text-red-500"}`}>
                                {change.value} total
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-3 rounded-full bg-accent">{icon}</div>
            </div>
        </div>
    );
};

const HealthPrograms = ({ 
    programs = [], 
    doctors = [], 
    flash,
    activePrograms = 0,
    archivedPrograms = 0,
    todayAppointments = 0,
    totalParticipants = 0
}) => {
    const [localPrograms, setLocalPrograms] = useState(programs);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "ascending",
    });
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState(flash?.success || "");
    const [errorMessage, setErrorMessage] = useState(flash?.error || "");
    const [isLoading, setIsLoading] = useState(false);

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

    // Handle sorting
    const requestSort = (key) => {
        let direction = "ascending";
        if (
            sortConfig.key === key &&
            sortConfig.direction === "ascending"
        ) {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };
    
    // Handle archive/unarchive program
    const handleArchiveProgram = async (programId, isArchived) => {
        setIsLoading(true);
        try {
            const endpoint = isArchived ? '/admin/programs/unarchive' : '/admin/programs/archive';
            const response = await axios.post(endpoint, {
                program_id: programId
            });
            
            if (response.data.programs) {
                setLocalPrograms(response.data.programs);
                setSuccessMessage(response.data.message);
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error archiving/unarchiving program:', error);
            setErrorMessage(error.response?.data?.message || 'An error occurred while updating the program');
            // Clear error message after 3 seconds
            setTimeout(() => setErrorMessage(''), 3000);
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
                    axios.get(route('admin.programs.fetch'))
                        .then(res => {
                            if (res.data.programs) {
                                setLocalPrograms(res.data.programs);
                            }
                        })
                        .catch(err => console.error('Error fetching programs:', err));
                }
            },
            onError: () => {
                setIsLoading(false);
            }
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
            <div className="px-4 md:px-6 py-6 space-y-6">
                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatisticCard
                        title="Today's Appointments"
                        value={todayAppointments}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                <line x1="16" x2="16" y1="2" y2="6"></line>
                                <line x1="8" x2="8" y1="2" y2="6"></line>
                                <line x1="3" x2="21" y1="10" y2="10"></line>
                            </svg>
                        }
                        change={{ value: todayAppointments, isPositive: true }}
                    />
                    
                    <StatisticCard
                        title="Active Health Programs"
                        value={activePrograms}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                        }
                        change={{ value: activePrograms, isPositive: true }}
                    />
                    
                    <StatisticCard
                        title="Archived Programs"
                        value={archivedPrograms}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <path d="M21 8v13H3V8"></path>
                                <path d="M1 3h22v5H1z"></path>
                                <path d="M10 12h4"></path>
                            </svg>
                        }
                        change={{ value: archivedPrograms, isPositive: false }}
                        bgColor={archivedPrograms > 0 ? "bg-amber-50" : "bg-white"}
                    />
                    
                    <StatisticCard
                        title="Total Participants"
                        value={totalParticipants}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        }
                        change={{ value: totalParticipants, isPositive: true }}
                    />
                </div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Health Programs</h1>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="px-4 py-2 text-sm shadow-md flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                                <span>Create Program</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create New Health Program</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to create a new health program.
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
                                                setData("programname", e.target.value)
                                            }
                                        />
                                        {errors.programname && (
                                            <InputError message={errors.programname} />
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
                                                setData("description", e.target.value)
                                            }
                                        />
                                        {errors.description && (
                                            <InputError message={errors.description} />
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
                                                    setData("starttime", e.target.value)
                                                }
                                            />
                                            {errors.starttime && (
                                                <InputError message={errors.starttime} />
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
                                                    setData("endtime", e.target.value)
                                                }
                                            />
                                            {errors.endtime && (
                                                <InputError message={errors.endtime} />
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
                                                setData("location", e.target.value)
                                            }
                                        />
                                        {errors.location && (
                                            <InputError message={errors.location} />
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
                                            <InputError message={errors.slots} />
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
                                            <InputError message={errors.coordinatorid} />
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
                                            <InputError message={errors.status} />
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button 
                                        type="submit" 
                                        disabled={processing || isLoading}
                                        className="px-4 py-2 text-sm shadow-md flex items-center justify-center"
                                    >
                                        {processing || isLoading ? "Creating..." : "Create Program"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Success message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{successMessage}</span>
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <Input
                            type="text"
                            placeholder="Search programs..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger>
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

                {/* Programs Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer w-1/6"
                                    onClick={() => requestSort("name")}
                                >
                                    <div className="flex items-center">
                                        Program Name
                                        {sortConfig.key === "name" && (
                                            <span className="ml-1">
                                                {sortConfig.direction === "ascending" ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="18 15 12 9 6 15"></polyline>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="6 9 12 15 18 9"></polyline>
                                                    </svg>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead className="w-1/6">Description</TableHead>
                                <TableHead className="w-1/12">Date</TableHead>
                                <TableHead className="w-1/12">Time</TableHead>
                                <TableHead className="w-1/12">Location</TableHead>
                                <TableHead className="w-1/12">Slots</TableHead>
                                <TableHead className="w-1/12">Coordinator</TableHead>
                                <TableHead className="w-1/12">Status</TableHead>
                                <TableHead className="w-1/12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8">
                                        <div className="flex justify-center items-center">
                                            <svg className="animate-spin h-5 w-5 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading programs...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : sortedPrograms.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="text-center py-8"
                                    >
                                        No health programs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedPrograms.map((program) => (
                                    <TableRow key={program.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-500">
                                                    <span>{program.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {program.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                {program.description}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {program.date}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {program.startTime} - {program.endTime}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {program.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {program.availableSlots}/{program.totalSlots}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {program.coordinator}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                {program.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-sm px-3 py-1 shadow-sm flex items-center justify-center"
                                                >
                                                    <span>View</span>
                                                </Button>
                                                {program.status === 'Archived' ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-sm px-3 py-1 shadow-sm flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleArchiveProgram(program.id, true)}
                                                    >
                                                        <span>Unarchive</span>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-sm px-3 py-1 shadow-sm flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleArchiveProgram(program.id, false)}
                                                    >
                                                        <span>Archive</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default HealthPrograms;
