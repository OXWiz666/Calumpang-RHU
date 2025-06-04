import React, { useEffect, useState } from "react";
import axios from "axios";

import { motion } from "framer-motion";

import {
    Search,
    Filter,
    Plus,
    ChevronDown,
    ChevronUp,
    Download,
    Edit,
    Trash2,
    CrossIcon,
} from "lucide-react";

import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogOverlay,
} from "@/components/tempo/components/ui/dialog";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";

import SideBar from "./Sidebar";
import ServicesLayout from "./ServicesLayout";
import { useForm, router } from "@inertiajs/react";
import moment from "moment";

import Modal from "@/components/CustomModal";
import DangerButton from "@/components/DangerButton";

// Mock data for services
const mockServices = [
    {
        id: "SRV001",
        name: "General Consultation",
        description: "Basic health consultation with a doctor",
        status: "Active",
        subServices: [
            {
                id: "SUB001",
                name: "Initial Consultation",
                description: "First-time patient consultation",
                duration: 30,
                price: 500,
                recurrenceDates: ["Monday", "Wednesday", "Friday"],
            },
            {
                id: "SUB002",
                name: "Follow-up Consultation",
                description: "Follow-up visit for existing patients",
                duration: 15,
                price: 300,
                recurrenceDates: ["Tuesday", "Thursday"],
            },
        ],
    },
    {
        id: "SRV002",
        name: "Vaccination",
        description: "Various vaccination services",
        status: "Active",
        subServices: [
            {
                id: "SUB003",
                name: "Flu Vaccine",
                description: "Annual influenza vaccination",
                duration: 15,
                price: 350,
                recurrenceDates: ["Monday", "Friday"],
            },
            {
                id: "SUB004",
                name: "COVID-19 Vaccine",
                description: "COVID-19 vaccination",
                duration: 20,
                price: 0,
                recurrenceDates: ["Wednesday"],
            },
        ],
    },
    {
        id: "SRV003",
        name: "Prenatal Care",
        description: "Care for pregnant women",
        status: "Active",
        subServices: [
            {
                id: "SUB005",
                name: "Initial Prenatal Visit",
                description: "First prenatal checkup",
                duration: 45,
                price: 800,
                recurrenceDates: ["Monday", "Thursday"],
            },
            {
                id: "SUB006",
                name: "Follow-up Prenatal Visit",
                description: "Regular prenatal checkup",
                duration: 30,
                price: 500,
                recurrenceDates: ["Tuesday", "Friday"],
            },
        ],
    },
];

const Services = ({ services_ }) => {
    const [services, setServices] = useState(services_);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: "servicename",
        direction: "ascending",
    });

    const [isServiceDeleteModalOpen, setIsServiceDeleteModalOpen] =
        useState(false);

    const serviceDeleteModalHandler = (condition = false) => {
        setIsServiceDeleteModalOpen(condition);
    };
    // const openServiceDeleteModal = () => {
    //     setIsServiceDeleteModalOpen(true);
    // };
    // const closeServiceDeleteModal = () => {
    //     setIsServiceDeleteModalOpen(false);
    // };

    useEffect(() => {
        setServices(services_);

        console.log("services: ", services_);
    }, [services_]);

    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

    const [selectedService, setSelectedService] = useState(null);
    const [expandedService, setExpandedService] = useState(false);

    // New service form state
    const [newService, setNewService] = useState({
        servicename: "",
        status: "Active",
    });

    // New sub-service form state
    const [newSubService, setNewSubService] = useState({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        recurrenceDates: [],
    });

    // Filter services based on search term and status
    const filteredServices = services.filter((service) => {
        const matchesSearch = service.servicename
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || service.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort services
    const sortedServices = [...filteredServices].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
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

    const [selectedServiceID, setSelectedServiceID] = useState(null);

    // Toggle service expansion
    const toggleServiceExpansion = (serviceId) => {
        if (expandedService === serviceId) {
            setExpandedService(null);
            setSelectedServiceID(null);
        } else {
            setExpandedService(serviceId);
            setSelectedServiceID(serviceId);
        }
    };

    // Handle service form input changes
    const handleServiceInputChange = (e) => {
        const { name, value } = e.target;
        setNewService({ ...newService, [name]: value });
    };

    // Handle sub-service form input changes
    const handleSubServiceInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubService({ ...newSubService, [name]: value });
    };

    // Handle recurrence date selection
    const handleRecurrenceDateChange = (day) => {
        // const currentDates = [...newSubService.recurrenceDates];
        // if (currentDates.includes(day)) {
        //     // setNewSubService({
        //     //     ...newSubService,
        //     //     recurrenceDates: currentDates.filter((d) => d !== day),
        //     // });
        //     setDataDays({
        //         ...dataDays,
        //         days: currentDates.filter((d) => d !== day),
        //     });
        // } else {
        //     // setNewSubService({
        //     //     ...newSubService,
        //     //     recurrenceDates: [...currentDates, day],
        //     // });
        //     setDataDays({
        //         ...dataDays,
        //         days: [...currentDates, day],
        //     });
        // }

        setDataDays((prev) => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter((d) => d !== day)
                : [...prev.days, day],
        }));
    };

    // Add new service
    const addService = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post('/admin/services/create', newService);
            if (response.data.services) {
                // Update services with the new data
                setServices(response.data.services);
                setIsServiceDialogOpen(false);
                alert_toast("Success", "Service added successfully!");
            }
        } catch (error) {
            console.error('Error creating service:', error);
            alert_toast("Error", error.response?.data?.message || 'An error occurred while creating the service');
        } finally {
            setIsLoading(false);
        }
    };

    const addSubService = () => {
        post(route("admin.services.subservice.create"), {
            preserveScroll: true,
            preserveState: true,
            only: ["services_"], // Only reload these props
            onSuccess: () => {
                setIsServiceDialogOpen(false);
                alert_toast("Success", "Sub-Service added successfully!");
                // router.reload(route("admin.services.services"), {
                //     only: ["services_"],
                //     preserveScroll: true,
                // });
            },
        });
    };

    // Handle archive/unarchive service - similar to Health Programs implementation
    const handleArchiveService = async (serviceId, isArchived) => {
        setIsLoading(true);
        try {
            const endpoint = isArchived ? '/admin/services/unarchive' : '/admin/services/archive';
            const response = await axios.post(endpoint, {
                service_id: serviceId
            });
            
            if (response.data.services) {
                // Update the services with the new data
                setServices(response.data.services);
                alert_toast("Success", response.data.message);
            }
        } catch (error) {
            console.error('Error archiving/unarchiving service:', error);
            alert_toast("Error", error.response?.data?.message || 'An error occurred while updating the service');
        } finally {
            setIsLoading(false);
        }
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 1:
                return <Badge className="bg-green-500">Active</Badge>;
            case 0:
                return <Badge className="bg-gray-500">Inactive</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const {
        data,
        setData,
        processing,
        post,
        recentlySuccessful,
        clearErrors,
        errors,
    } = useForm({
        serviceid: "",
        subservicename: "",
    });

    const [IsEditDaysOpen, setIsEditDaysOpen] = useState(false);

    const {
        data: dataDays,
        setData: setDataDays,
        post: postDays,
        processing: processDays,
        errors: errorsDays,
    } = useForm({
        days: newSubService.recurrenceDates,
        serviceid: selectedServiceID,
    });

    const saveDays = () => {
        postDays(route("admin.services.days.update"), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ["services_"], // Only reload these props
            onSuccess: () => {
                setIsEditDaysOpen(false);
                alert_toast("Success!", "Successfully Updated!", "success");
            },
        });
    };

    const generateTimeArray = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
    ];

    const [timeArr, setTimeArr] = useState([]);
    const [selectedSubService, setSelectedSubService] = useState({});
    const [isSubServiceDialogOpen, setIsSubServiceDialogOpen] = useState(false);

    //const [IsSubServiceDialogOpen, setIsSubServiceDialogOpen] = useState(false);
    const {
        data: dataTime,
        setData: setDataTime,
        processing: procTime,
        post: postTime,
        recentlySuccessful: recentSuccessfulTime,
        clearErrors: clearerrorsTime,
        errors: errorsTime,
    } = useForm({
        times: timeArr,
        subservice_id: selectedSubService,
        subservicename: "",
    });

    // useEffect(() => {
    //     //console.log("sel sub serv:", selectedSubService);

    //     setDataTime("subservicename", selectedSubService?.subservicename);
    // }, [selectedSubService]);

    const handleTimeChange = (time) => {
        setDataTime((prev) => ({
            ...prev,
            times: prev.times.includes(time)
                ? prev.times.filter((t) => t !== time)
                : [...prev.times, time],
        }));
    };

    const saveTime = (e) => {
        postTime(route("admin.services.time.update"), {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubServiceDialogOpen(false);
                alert_toast("Success!", "Successfully Updated!", "success");
            },
        });
    };

    const days_ = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    useEffect(() => {
        console.log("datatime; ", dataTime);
    }, [dataTime]);

    return (
        <ServicesLayout>
            <div className=" mb-5">
                <h1 className="text-3xl font-bold mb-2">Services</h1>
                <p className="text-gray-600">
                    These are the services to be used in the Appointment
                    Schedules.
                </p>
                <p className="text-muted-foreground"></p>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <SideBar activeTab={"services"} />
                <div className="bg-accent/20 rounded-lg shadow-sm p-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-primary">
                            All Services
                        </h2>
                        <div className="flex items-center gap-4">
                            <Dialog
                                open={isServiceDialogOpen}
                                onOpenChange={(open) => {
                                    setIsServiceDialogOpen(open);
                                    if (!open) {
                                        setNewService({ servicename: "", status: "Active" });
                                    }
                                }}
                            >
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Service</DialogTitle>
                                        <DialogDescription>
                                            Create a new service for appointments.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="servicename" className="text-right">
                                                Service Name
                                            </Label>
                                            <Input
                                                id="servicename"
                                                name="servicename"
                                                className="col-span-3"
                                                value={newService.servicename}
                                                onChange={(e) => setNewService({ ...newService, servicename: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            onClick={async () => {
                                                try {
                                                    setIsLoading(true);
                                                    const response = await axios.post('/admin/services/create', newService);
                                                    if (response.data.services) {
                                                        // Update services with the new data
                                                        setServices(response.data.services);
                                                        setIsServiceDialogOpen(false);
                                                        alert_toast("Success", "Service added successfully!");
                                                    }
                                                } catch (error) {
                                                    console.error('Error creating service:', error);
                                                    alert_toast("Error", error.response?.data?.message || 'An error occurred while creating the service');
                                                } finally {
                                                    setIsLoading(false);
                                                }
                                            }}
                                            disabled={!newService.servicename || isLoading}
                                        >
                                            Save Service
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Filter by:
                                </span>
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="Active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="Inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <SortableTable
                            data={services}
                            defaultSort={{
                                key: "servicename",
                                direction: "asc",
                            }}
                        >
                            {({ sortedData }) => (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <SortableTableHead></SortableTableHead>
                                            <SortableTableHead
                                                sortKey="servicename"
                                                sortable
                                            >
                                                Service Name
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="status"
                                                sortable
                                            >
                                                Status
                                            </SortableTableHead>
                                            <SortableTableHead>
                                                Available Days
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="servicename"
                                                sortable
                                            >
                                                Sub Services
                                            </SortableTableHead>
                                            <SortableTableHead>
                                                Actions
                                            </SortableTableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {sortedData.map((service, i) => (
                                            <React.Fragment key={i}>
                                                <TableRow>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                toggleServiceExpansion(
                                                                    service.id
                                                                )
                                                            }
                                                        >
                                                            {expandedService ===
                                                            service.id ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {service.servicename}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            service.status
                                                        )}
                                                    </TableCell>
                                                    <TableCell className=" grid gap-1">
                                                        {service?.servicedays?.map(
                                                            (day, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    className={`bg-primary`}
                                                                >
                                                                    {day.day}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {service?.subservices
                                                            .length <= 0 ? (
                                                            <div>
                                                                No Sub Services
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {
                                                                    service
                                                                        ?.subservices
                                                                        .length
                                                                }{" "}
                                                                Service
                                                                {service
                                                                    ?.subservices
                                                                    .length > 1
                                                                    ? "s"
                                                                    : ""}
                                                            </div>
                                                        )}
                                                        {/* {service?.subservices.map(
                                                            (sub, i) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                            sub.subservicename
                                                                        }{" "}
                                                                    </>
                                                                );
                                                            }
                                                        )} */}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {service.status === 0 ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center gap-1"
                                                                    onClick={() => handleArchiveService(service.id, true)}
                                                                    disabled={isLoading}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M21 8v13H3V8"></path>
                                                                        <path d="M1 3h22v5H1z"></path>
                                                                        <path d="M12 12v7"></path>
                                                                        <path d="M8 12l4-4 4 4"></path>
                                                                    </svg>
                                                                    Unarchive
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                                                                    onClick={() => handleArchiveService(service.id, false)}
                                                                    disabled={isLoading}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M21 8v13H3V8"></path>
                                                                        <path d="M1 3h22v5H1z"></path>
                                                                        <path d="M12 19V12"></path>
                                                                        <path d="M8 15l4 4 4-4"></path>
                                                                    </svg>
                                                                    Archive
                                                                </Button>
                                                            )}
                                                            <Dialog
                                                                open={
                                                                    isServiceDialogOpen
                                                                }
                                                                onOpenChange={(
                                                                    open
                                                                ) => {
                                                                    setIsServiceDialogOpen(
                                                                        open
                                                                    );
                                                                    if (open) {
                                                                        setData(
                                                                            "serviceid",
                                                                            service.id
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {/* <DialogOverlay className="bg-white/30" />{" "} */}
                                                                {/* Semi-transparent black */}
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        Add
                                                                        Sub-service
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            Add
                                                                            Sub-service
                                                                            to{" "}
                                                                            {
                                                                                service.servicename
                                                                            }
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            Create
                                                                            a
                                                                            new
                                                                            sub-service
                                                                            for
                                                                            this
                                                                            service
                                                                            category.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="grid gap-4 py-4">
                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                            <Label
                                                                                htmlFor="subName"
                                                                                className="text-right"
                                                                            >
                                                                                Sub
                                                                                Service
                                                                            </Label>
                                                                            <Input
                                                                                id="subName"
                                                                                name="name"
                                                                                value={
                                                                                    data.subservicename
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setData(
                                                                                        "subservicename",
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }}
                                                                                className="col-span-3"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button
                                                                            type="submit"
                                                                            onClick={
                                                                                addSubService
                                                                            }
                                                                            disabled={
                                                                                !data.subservicename ||
                                                                                processing
                                                                            }
                                                                        >
                                                                            Save
                                                                            Sub-service
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>

                                                            <Dialog
                                                                open={
                                                                    IsEditDaysOpen
                                                                }
                                                                onOpenChange={(
                                                                    open
                                                                ) => {
                                                                    setIsEditDaysOpen(
                                                                        open
                                                                    );

                                                                    if (open) {
                                                                        setDataDays(
                                                                            "days",
                                                                            service?.servicedays?.map(
                                                                                (
                                                                                    sub
                                                                                ) =>
                                                                                    sub.day
                                                                            ) ||
                                                                                []
                                                                        );

                                                                        setDataDays(
                                                                            "serviceid",
                                                                            service.id
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            Edit
                                                                            Days
                                                                            to{" "}
                                                                            {
                                                                                service.servicename
                                                                            }
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            Edit
                                                                            days
                                                                            for
                                                                            this
                                                                            service
                                                                            category.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="grid gap-4 py-4">
                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                            <Label className="text-right">
                                                                                Available
                                                                                Days
                                                                            </Label>
                                                                            {days_.map(
                                                                                (
                                                                                    day
                                                                                ) => (
                                                                                    <Badge
                                                                                        key={
                                                                                            day
                                                                                        }
                                                                                        className={`cursor-pointer ${
                                                                                            dataDays.days.includes(
                                                                                                day
                                                                                            )
                                                                                                ? "bg-primary"
                                                                                                : "bg-muted text-red-500"
                                                                                        }`}
                                                                                        onClick={() =>
                                                                                            handleRecurrenceDateChange(
                                                                                                day
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            day
                                                                                        }
                                                                                    </Badge>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                        {/* Display validation errors */}
                                                                        {Object.keys(
                                                                            errorsDays
                                                                        )
                                                                            .length >
                                                                            0 && (
                                                                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                                                                <div className="flex items-center">
                                                                                    <div className="flex-shrink-0">
                                                                                        <Cross2Icon className="h-5 w-5 text-red-400" />
                                                                                    </div>
                                                                                    <div className="ml-3">
                                                                                        <ul className="text-sm text-red-600">
                                                                                            {Object.entries(
                                                                                                errorsDays
                                                                                            ).map(
                                                                                                ([
                                                                                                    key,
                                                                                                    error,
                                                                                                ]) => (
                                                                                                    <li
                                                                                                        key={
                                                                                                            key
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            error
                                                                                                        }
                                                                                                    </li>
                                                                                                )
                                                                                            )}
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button
                                                                            // type="submit"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                saveDays();
                                                                            }}
                                                                            disabled={
                                                                                processDays
                                                                            }
                                                                        >
                                                                            Save
                                                                            Days
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    {
                                                                        serviceDeleteModalHandler(
                                                                            true
                                                                        );
                                                                        setData(
                                                                            "subservicename",
                                                                            service.servicename
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {expandedService ===
                                                    service.id && (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={6}
                                                            className="p-0"
                                                        >
                                                            <div className="bg-muted/20 p-4">
                                                                <h3 className="font-medium mb-2">
                                                                    Sub-services
                                                                    for{" "}
                                                                    {
                                                                        service.servicename
                                                                    }
                                                                </h3>
                                                                {service
                                                                    .subservices
                                                                    .length >
                                                                0 ? (
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <SortableTableHead>
                                                                                    Sub
                                                                                    Service
                                                                                </SortableTableHead>
                                                                                <SortableTableHead>
                                                                                    Available
                                                                                    Time
                                                                                </SortableTableHead>

                                                                                <SortableTableHead className="text-right">
                                                                                    Actions
                                                                                </SortableTableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {service?.subservices.map(
                                                                                (
                                                                                    ttt,
                                                                                    i
                                                                                ) => (
                                                                                    <TableRow
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                    >
                                                                                        <TableCell>
                                                                                            {
                                                                                                ttt.subservicename
                                                                                            }
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            {ttt?.times?.map(
                                                                                                (
                                                                                                    t,
                                                                                                    i
                                                                                                ) => (
                                                                                                    <Badge
                                                                                                        key={
                                                                                                            i
                                                                                                        }
                                                                                                        className="cursor-pointer bg-primary"
                                                                                                    >
                                                                                                        {moment(
                                                                                                            t.time,
                                                                                                            "HH:mm:ss"
                                                                                                        ).format(
                                                                                                            "hh:mm A"
                                                                                                        )}
                                                                                                    </Badge>
                                                                                                )
                                                                                            )}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <div>
                                                                                                <Dialog
                                                                                                    open={
                                                                                                        isSubServiceDialogOpen
                                                                                                    }
                                                                                                    onOpenChange={(
                                                                                                        open
                                                                                                    ) => {
                                                                                                        setIsSubServiceDialogOpen(
                                                                                                            open
                                                                                                        );
                                                                                                        if (
                                                                                                            open
                                                                                                        ) {
                                                                                                            console.log(
                                                                                                                "selected: ",
                                                                                                                ttt.subservicename
                                                                                                            );
                                                                                                            setDataTime(
                                                                                                                "subservice_id",
                                                                                                                ttt.id
                                                                                                            );
                                                                                                            setSelectedSubService(
                                                                                                                ttt
                                                                                                            );

                                                                                                            setDataTime(
                                                                                                                "subservicename",
                                                                                                                ttt.subservicename
                                                                                                            );

                                                                                                            setDataTime(
                                                                                                                "times",
                                                                                                                ttt?.times.map(
                                                                                                                    (
                                                                                                                        t
                                                                                                                    ) =>
                                                                                                                        moment(
                                                                                                                            t.time,
                                                                                                                            "HH:mm:ss"
                                                                                                                        ).format(
                                                                                                                            "hh:mm A"
                                                                                                                        )
                                                                                                                )
                                                                                                            );
                                                                                                            // setTimeArr(
                                                                                                            //     ttt?.times
                                                                                                            // );
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    <DialogTrigger
                                                                                                        asChild
                                                                                                    >
                                                                                                        <Button
                                                                                                            variant="ghost"
                                                                                                            size="sm"
                                                                                                        >
                                                                                                            <Edit className="h-4 w-4" />
                                                                                                        </Button>
                                                                                                    </DialogTrigger>
                                                                                                    <DialogContent>
                                                                                                        <DialogHeader>
                                                                                                            <DialogTitle>
                                                                                                                Edit
                                                                                                                Time
                                                                                                                to{" "}
                                                                                                                {
                                                                                                                    selectedSubService.subservicename
                                                                                                                }
                                                                                                            </DialogTitle>
                                                                                                            <DialogDescription>
                                                                                                                Edit
                                                                                                                days
                                                                                                                for
                                                                                                                this
                                                                                                                sub
                                                                                                                service
                                                                                                                category.
                                                                                                            </DialogDescription>
                                                                                                        </DialogHeader>
                                                                                                        <div className="grid gap-4 py-4">
                                                                                                            <Label>
                                                                                                                Sub-Service:
                                                                                                            </Label>
                                                                                                            <Input
                                                                                                                className=" w-full"
                                                                                                                value={
                                                                                                                    dataTime.subservicename
                                                                                                                }
                                                                                                                onChange={(
                                                                                                                    e
                                                                                                                ) => {
                                                                                                                    setDataTime(
                                                                                                                        "subservicename",
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    );
                                                                                                                }}
                                                                                                            />
                                                                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                                                                <Label className=" text-right">
                                                                                                                    Available
                                                                                                                    Time:
                                                                                                                </Label>
                                                                                                                {generateTimeArray.map(
                                                                                                                    (
                                                                                                                        time,
                                                                                                                        i
                                                                                                                    ) => (
                                                                                                                        <Badge
                                                                                                                            key={
                                                                                                                                i
                                                                                                                            }
                                                                                                                            className={`cursor-pointer ${
                                                                                                                                dataTime.times.includes(
                                                                                                                                    time
                                                                                                                                )
                                                                                                                                    ? "bg-primary"
                                                                                                                                    : "bg-muted text-red-500"
                                                                                                                            }`}
                                                                                                                            onClick={() =>
                                                                                                                                // handleRecurrenceDateChange(
                                                                                                                                //     day
                                                                                                                                // )
                                                                                                                                handleTimeChange(
                                                                                                                                    time
                                                                                                                                )
                                                                                                                            }
                                                                                                                        >
                                                                                                                            {
                                                                                                                                time
                                                                                                                            }
                                                                                                                        </Badge>
                                                                                                                    )
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <DialogFooter>
                                                                                                            {/* Display validation errors */}
                                                                                                            {Object.keys(
                                                                                                                errorsTime
                                                                                                            )
                                                                                                                .length >
                                                                                                                0 && (
                                                                                                                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                                                                                                    <div className="flex items-center">
                                                                                                                        <div className="flex-shrink-0">
                                                                                                                            <Cross2Icon className="h-5 w-5 text-red-400" />
                                                                                                                        </div>
                                                                                                                        <div className="ml-3">
                                                                                                                            <ul className="text-sm text-red-600">
                                                                                                                                {Object.entries(
                                                                                                                                    errorsTime
                                                                                                                                ).map(
                                                                                                                                    ([
                                                                                                                                        key,
                                                                                                                                        error,
                                                                                                                                    ]) => (
                                                                                                                                        <li
                                                                                                                                            key={
                                                                                                                                                key
                                                                                                                                            }
                                                                                                                                        >
                                                                                                                                            {
                                                                                                                                                error
                                                                                                                                            }
                                                                                                                                        </li>
                                                                                                                                    )
                                                                                                                                )}
                                                                                                                            </ul>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )}
                                                                                                            <Button
                                                                                                                onClick={
                                                                                                                    saveTime
                                                                                                                }
                                                                                                                disabled={
                                                                                                                    procTime
                                                                                                                }
                                                                                                            >
                                                                                                                Save
                                                                                                                Time
                                                                                                            </Button>
                                                                                                        </DialogFooter>
                                                                                                    </DialogContent>
                                                                                                </Dialog>

                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                >
                                                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                )
                                                                            )}
                                                                        </TableBody>
                                                                    </Table>
                                                                ) : (
                                                                    <p className="text-muted-foreground">
                                                                        No
                                                                        sub-services
                                                                        found
                                                                        for this
                                                                        service.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </SortableTable>
                    </div>
                </div>
            </div>
        </ServicesLayout>
    );
};

export default Services;
