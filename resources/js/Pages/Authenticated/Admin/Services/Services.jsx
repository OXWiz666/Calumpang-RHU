import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "@/utils/toast.jsx";
import { useArchiveConfirmation } from "@/utils/confirmation.jsx";

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
  Eye,
  Settings,
  Calendar,
  Clock,
  Users,
  MoreHorizontal,
  Archive,
  ArchiveRestore,
  BookOpen,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
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
  Card,
  CardContent,
  CardDescription,
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
  const { confirmArchive, confirmUnarchive, ConfirmationDialog } = useArchiveConfirmation();
  const [sortConfig, setSortConfig] = useState({
    key: "servicename",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedSubService, setSelectedSubService] = useState(null);

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

  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [expandedService, setExpandedService] = useState(false);
  const [IsEditDaysOpen, setIsEditDaysOpen] = useState(false);

  useEffect(() => {
    setServices(services_);

    console.log("services: ", services_);
  }, [services_]);

  // Handle selectedService changes for Edit Days modal
  useEffect(() => {
    if (selectedService && IsEditDaysOpen) {
      console.log("Setting form data for service:", selectedService);
      setDataDays("days", selectedService?.servicedays?.map((sub) => sub.day) || []);
      setDataDays("serviceid", selectedService?.id);
    }
  }, [selectedService, IsEditDaysOpen]);

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

  // Pagination logic
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = sortedServices.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Bulk action functions
  const handleSelectAll = () => {
    if (selectedServices.length === paginatedServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(paginatedServices.map(service => service.id));
    }
  };

  const handleSelectService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      setIsLoading(true);
      const promises = selectedServices.map(serviceId => 
        axios.put(`/admin/services/${serviceId}/status`, { status: newStatus })
      );
      await Promise.all(promises);
      
      // Update local state
      setServices(prev => prev.map(service => 
        selectedServices.includes(service.id) 
          ? { ...service, status: newStatus }
          : service
      ));
      
      setSelectedServices([]);
      showToast("Success", `Bulk status update completed!`, "success", "update");
    } catch (error) {
      console.error("Error updating services:", error);
      showToast("Error", "Failed to update services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedServices.length} services?`)) {
      try {
        setIsLoading(true);
        const promises = selectedServices.map(serviceId => 
          axios.delete(`/admin/services/${serviceId}`)
        );
        await Promise.all(promises);
        
        // Update local state
        setServices(prev => prev.filter(service => !selectedServices.includes(service.id)));
        setSelectedServices([]);
        showToast("Success", "Services deleted successfully!", "success", "delete");
      } catch (error) {
        console.error("Error deleting services:", error);
        showToast("Error", "Failed to delete services");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Service Name', 'Status', 'Available Days', 'Sub Services Count', 'Created At'],
      ...sortedServices.map(service => [
        service.servicename,
        service.status === 1 ? 'Active' : 'Inactive',
        service.service_days?.map(day => day.dayname).join(', ') || 'None',
        service.subservices?.length || 0,
        service.created_at ? new Date(service.created_at).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `services_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Success", "Services exported successfully!", "success", "export");
  };

  // Sub-service archive/unarchive functions
  const handleSubServiceArchive = async (subserviceId) => {
    const subservice = services
      .flatMap(service => service.subservices)
      .find(sub => sub.id === subserviceId);
    const subserviceName = subservice ? subservice.subservicename : 'Sub-service';
    
    confirmArchive(subserviceName, async () => {
      try {
        setIsLoading(true);
        await axios.post('/admin/services/sub-services/archive', { subservice_id: subserviceId });
        
        // Update local state
        setServices(prev => prev.map(service => ({
          ...service,
          subservices: service.subservices.map(sub => 
            sub.id === subserviceId ? { ...sub, status: 0 } : sub
          )
        })));
        
        showToast("Success", "Sub-service archived successfully!", "success", "archive");
      } catch (error) {
        console.error("Error archiving sub-service:", error);
        showToast("Error", "Failed to archive sub-service");
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleSubServiceUnarchive = async (subserviceId) => {
    const subservice = services
      .flatMap(service => service.subservices)
      .find(sub => sub.id === subserviceId);
    const subserviceName = subservice ? subservice.subservicename : 'Sub-service';
    
    confirmUnarchive(subserviceName, async () => {
      try {
        setIsLoading(true);
        await axios.post('/admin/services/sub-services/unarchive', { subservice_id: subserviceId });
        
        // Update local state
        setServices(prev => prev.map(service => ({
          ...service,
          subservices: service.subservices.map(sub => 
            sub.id === subserviceId ? { ...sub, status: 1 } : sub
          )
        })));
        
        showToast("Success", "Sub-service unarchived successfully!", "success", "unarchive");
      } catch (error) {
        console.error("Error unarchiving sub-service:", error);
        showToast("Error", "Failed to unarchive sub-service");
      } finally {
        setIsLoading(false);
      }
    });
  };

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
      const response = await axios.post("/admin/services/create", newService);
      if (response.data.services) {
        // Update services with the new data
        setServices(response.data.services);
        setIsServiceDialogOpen(false);
        showToast("Success", "Service added successfully!");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      showToast(
        "Error",
        error.response?.data?.message ||
          "An error occurred while creating the service",
      );
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
        showToast("Success", "Sub-Service added successfully!");
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
      const endpoint = isArchived
        ? "/admin/services/unarchive"
        : "/admin/services/archive";
      const response = await axios.post(endpoint, {
        service_id: serviceId,
      });

      if (response.data.services) {
        // Update the services with the new data
        setServices(response.data.services);
        showToast("Success", response.data.message);
      }
    } catch (error) {
      console.error("Error archiving/unarchiving service:", error);
      showToast(
        "Error",
        error.response?.data?.message ||
          "An error occurred while updating the service",
      );
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

  const {
    data: dataDays,
    setData: setDataDays,
    post: postDays,
    processing: processDays,
    errors: errorsDays,
  } = useForm({
    days: [],
    serviceid: "",
  });

  const saveDays = () => {
    console.log("Saving days with data:", dataDays);
    if (!dataDays.serviceid) {
      showToast("Error", "Service ID is required", "error");
      return;
    }
    postDays(route("admin.services.days.update"), {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      only: ["services_"], // Only reload these props
      onSuccess: () => {
        setIsEditDaysOpen(false);
        showToast("Success!", "Successfully Updated!", "success");
      },
      onError: (errors) => {
        console.log("Save days errors:", errors);
      }
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
        showToast("Success!", "Successfully Updated!", "success");
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
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Services Management</h1>
          <p className="text-lg text-gray-600">
            Monitor and manage all healthcare services and their performance metrics
          </p>
        </motion.div>
      </div>
      
      <div className="space-y-8">
        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Services</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{services.length}</h3>
                    <p className="text-xs text-gray-500 mb-3">Main service categories</p>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-semibold text-green-600">
                        {services.length} total
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-100 shadow-lg">
                    <div className="text-blue-600">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">This month</span>
                    <Badge variant="default" className="text-xs">+12%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Sub-Services</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {services.reduce((total, service) => total + (service.subservices?.length || 0), 0)}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">Specific service types</p>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-semibold text-green-600">
                        {services.reduce((total, service) => total + (service.subservices?.length || 0), 0)} total
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-green-100 shadow-lg">
                    <div className="text-green-600">
                      <BookOpen className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">This month</span>
                    <Badge variant="default" className="text-xs">+8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Services</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {services.filter(service => service.status === 1).length}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">Currently available</p>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-semibold text-green-600">
                        {services.filter(service => service.status === 1).length} total
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-100 shadow-lg">
                    <div className="text-emerald-600">
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">This month</span>
                    <Badge variant="default" className="text-xs">+15%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Inactive Services</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {services.filter(service => service.status === 0).length}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">Requires attention</p>
                    <div className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm font-semibold text-red-600">
                        {services.filter(service => service.status === 0).length} total
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-red-100 shadow-lg">
                    <div className="text-red-600">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">This month</span>
                    <Badge variant="destructive" className="text-xs">+5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                      placeholder="Search services..."
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
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bulk Actions Bar */}
        {selectedServices.length > 0 && (
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
                      {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedServices([])}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear selection
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusChange(1)}
                      disabled={isLoading}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusChange(0)}
                      disabled={isLoading}
                      className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                    >
                      Deactivate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={isLoading}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Services Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold text-gray-900">Services List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
            <SortableTable
              data={paginatedServices}
              defaultSort={{
                key: "servicename",
                direction: "asc",
              }}
            >
              {({ sortedData }) => (
                <Table>
                  <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <SortableTableHead className="w-12 text-center">
                            <input
                              type="checkbox"
                              checked={selectedServices.length === paginatedServices.length && paginatedServices.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </SortableTableHead>
                          <SortableTableHead sortKey="servicename" sortable className="font-semibold text-gray-900 w-12 text-center">
                            <span className="sr-only">Expand</span>
                          </SortableTableHead>
                          <SortableTableHead sortKey="servicename" sortable className="font-semibold text-gray-900">
                        Service Name
                      </SortableTableHead>
                          <SortableTableHead sortKey="status" sortable className="font-semibold text-gray-900">
                        Status
                      </SortableTableHead>
                          <SortableTableHead className="font-semibold text-gray-900">Available Days</SortableTableHead>
                          <SortableTableHead className="font-semibold text-gray-900">Sub Services</SortableTableHead>
                          <SortableTableHead className="font-semibold text-gray-900">Actions</SortableTableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sortedData.map((service, i) => (
                      <React.Fragment key={i}>
                            <TableRow className="hover:bg-gray-50 transition-colors">
                          <TableCell className="text-center">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleSelectService(service.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleServiceExpansion(service.id)}
                                  className="hover:bg-blue-100 hover:text-blue-600"
                            >
                              {expandedService === service.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{service.servicename}</p>
                                    <p className="text-sm text-gray-500">Service Category</p>
                                  </div>
                                </div>
                              </TableCell>
                          <TableCell>
                            {getStatusBadge(service.status)}
                          </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                            {service?.servicedays?.map((day, i) => (
                                    <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                {day.day}
                              </Badge>
                            ))}
                                </div>
                          </TableCell>
                          <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="border-gray-300">
                                    {service?.subservices.length || 0} Sub-service{service?.subservices.length !== 1 ? 's' : ''}
                                  </Badge>
                              </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setData("serviceid", service.id);
                                          setIsServiceDialogOpen(true);
                                        }}
                                        className="flex items-center gap-2"
                                      >
                                        <Plus className="h-4 w-4" />
                                        Add Sub-service
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedService(service);
                                          setIsEditDaysOpen(true);
                                        }}
                                        className="flex items-center gap-2"
                                      >
                                        <Calendar className="h-4 w-4" />
                                        Edit Days
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                              {service.status === 0 ? (
                                        <DropdownMenuItem
                                          onClick={() => handleArchiveService(service.id, true)}
                                          className="flex items-center gap-2 text-green-600"
                                        >
                                          <ArchiveRestore className="h-4 w-4" />
                                          Unarchive
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem
                                          onClick={() => handleArchiveService(service.id, false)}
                                          className="flex items-center gap-2 text-red-600"
                                        >
                                          <Archive className="h-4 w-4" />
                                          Archive
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                            {expandedService === service.id && (
                              <TableRow>
                                <TableCell colSpan={6} className="p-0">
                                  <div className="bg-gray-50 p-6 border-t">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="p-2 bg-blue-100 rounded-lg">
                                        <Settings className="h-5 w-5 text-blue-600" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-gray-900">
                                          Sub-services for {service.servicename}
                                        </h3>
                                        <p className="text-sm text-gray-500">Manage sub-services and their schedules</p>
                                      </div>
                                    </div>
                                    {service.subservices.length > 0 ? (
                                      <div className="bg-white rounded-lg border overflow-hidden">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-gray-50">
                                              <SortableTableHead className="font-medium w-1/3">Sub Service</SortableTableHead>
                                              <SortableTableHead className="font-medium w-1/3">Available Time</SortableTableHead>
                                              <SortableTableHead className="font-medium w-1/3 text-right">Actions</SortableTableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {service?.subservices.map((subservice, i) => (
                                              <TableRow key={i} className="hover:bg-gray-50">
                                                <TableCell className="py-4 align-middle">
                                                  <div className="flex items-center gap-3 h-full">
                                                    <div className="p-1.5 bg-green-100 rounded-md flex-shrink-0">
                                                      <Clock className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                      <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-900 truncate">{subservice.subservicename}</p>
                                                        <Badge 
                                                          variant={subservice.status === 1 ? "default" : "secondary"}
                                                          className={`text-xs ${
                                                            subservice.status === 1 
                                                              ? "bg-green-100 text-green-700 border-green-200" 
                                                              : "bg-gray-100 text-gray-600 border-gray-200"
                                                          }`}
                                                        >
                                                          {subservice.status === 1 ? "Active" : "Archived"}
                                                        </Badge>
                                                      </div>
                                                      <p className="text-sm text-gray-500 mt-1">Sub-service</p>
                                                    </div>
                                                  </div>
                                                </TableCell>
                                                <TableCell className="py-4 align-middle">
                                                  <div className="flex flex-wrap gap-1 items-center h-full">
                                                    {subservice?.times && subservice.times.length > 0 ? (
                                                      subservice.times.map((time, i) => (
                                                        <Badge key={i} variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                                                          {moment(time.time, "HH:mm:ss").format("hh:mm A")}
                                                        </Badge>
                                                      ))
                                                    ) : (
                                                      <span className="text-sm text-gray-400 italic">Not assigned</span>
                                                    )}
                                                  </div>
                                                </TableCell>
                                                <TableCell className="py-4 align-middle text-right">
                                                  <div className="flex items-center justify-end gap-0.5 h-full">
                                <Button
                                                      variant="ghost"
                                  size="sm"
                                                      onClick={() => {
                                                        setDataTime("subservice_id", subservice.id);
                                                        setSelectedSubService(subservice);
                                                        setDataTime("subservicename", subservice.subservicename);
                                                        setDataTime("times", subservice?.times?.map((t) => moment(t.time, "HH:mm:ss").format("hh:mm A")) || []);
                                                        setIsSubServiceDialogOpen(true);
                                                      }}
                                                      className="hover:bg-blue-100 hover:text-blue-600 h-8 w-8 p-0"
                                                      title="Edit sub-service"
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                    
                                                    {subservice.status === 1 ? (
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSubServiceArchive(subservice.id)}
                                                        className="hover:bg-yellow-100 hover:text-yellow-600 h-8 w-8 p-0"
                                                        title="Archive sub-service"
                                  disabled={isLoading}
                                >
                                                        <Archive className="h-4 w-4" />
                                                      </Button>
                                                    ) : (
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSubServiceUnarchive(subservice.id)}
                                                        className="hover:bg-green-100 hover:text-green-600 h-8 w-8 p-0"
                                                        title="Unarchive sub-service"
                                                        disabled={isLoading}
                                                      >
                                                        <ArchiveRestore className="h-4 w-4" />
                                </Button>
                                                    )}
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    ) : (
                                      <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                                        <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                                          <Plus className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No sub-services found</p>
                                        <p className="text-sm text-gray-400 mt-1">Add sub-services to organize this service better</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                          className="mt-3"
                                          onClick={() => {
                                            setData("serviceid", service.id);
                                            setIsServiceDialogOpen(true);
                                          }}
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Add First Sub-service
                                </Button>
                                      </div>
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
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Results Info */}
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, sortedServices.length)} of {sortedServices.length} services
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                      {/* Previous Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronDown className="h-4 w-4 rotate-90" />
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 10) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 4) {
                            pageNumber = totalPages - 9 + i;
                          } else {
                            pageNumber = currentPage - 4 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNumber}
                              variant={currentPage === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`w-8 h-8 p-0 ${
                                currentPage === pageNumber 
                                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                      </div>
                      
                      {/* Next Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                                </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
                              )}
      </div>

      {/* Add Service Dialog */}
                              <Dialog
                                open={isServiceDialogOpen}
                                onOpenChange={(open) => {
                                  setIsServiceDialogOpen(open);
          if (!open) {
            setNewService({ servicename: "", status: "Active" });
          }
        }}
      >
        <DialogContent className="max-w-md">
                                  <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Service</DialogTitle>
                                    <DialogDescription>
              Create a new service category for appointments
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="servicename">Service Name</Label>
              <Input
                id="servicename"
                name="servicename"
                value={newService.servicename}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    servicename: e.target.value,
                  })
                }
                placeholder="Enter service name"
                className="border-2 focus:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const response = await axios.post(
                    "/admin/services/create",
                    newService,
                  );
                  if (response.data.services) {
                    setServices(response.data.services);
                    setIsServiceDialogOpen(false);
                    showToast("Success", "Service added successfully!");
                  }
                } catch (error) {
                  console.error("Error creating service:", error);
                  showToast(
                    "Error",
                    error.response?.data?.message ||
                      "An error occurred while creating the service",
                  );
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={!newService.servicename || isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isLoading ? "Adding..." : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Sub-service Dialog */}
      <Dialog
        open={isServiceDialogOpen}
        onOpenChange={(open) => {
          setIsServiceDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Sub-service</DialogTitle>
            <DialogDescription>
              Create a new sub-service for this service category
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subName">Sub Service Name</Label>
                                      <Input
                                        id="subName"
                                        name="name"
                                        value={data.subservicename}
                                        onChange={(e) => {
                  setData("subservicename", e.target.value);
                                        }}
                placeholder="Enter sub-service name"
                className="border-2 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      type="submit"
                                      onClick={addSubService}
              disabled={!data.subservicename || processing}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                    >
              {processing ? "Adding..." : "Add Sub-service"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

      {/* Edit Days Dialog */}
                              <Dialog
                                open={IsEditDaysOpen}
                                onOpenChange={(open) => {
                                  setIsEditDaysOpen(open);
                                  if (open && selectedService) {
            setDataDays("days", selectedService?.servicedays?.map((sub) => sub.day) || []);
            setDataDays("serviceid", selectedService?.id);
          } else if (!open) {
            // Reset form when closing
            setDataDays("days", []);
            setDataDays("serviceid", "");
          }
        }}
      >
        <DialogContent className="max-w-md">
                                  <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Edit Available Days
                                    </DialogTitle>
                                    <DialogDescription className="text-center">
              Select the days when this service is available
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <Label className="text-base font-medium">Available Days</Label>
              <div className="grid grid-cols-2 gap-3">
                                      {days_.map((day) => (
                                        <Badge
                                          key={day}
                    className={`cursor-pointer transition-colors text-center py-2 px-4 ${
                                            dataDays.days.includes(day)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                          }`}
                    onClick={() => handleRecurrenceDateChange(day)}
                                        >
                                          {day}
                                        </Badge>
                                      ))}
                                    </div>
            </div>
                                    {Object.keys(errorsDays).length > 0 && (
                                      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                        <div className="flex items-start">
                  <Cross2Icon className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <ul className="text-sm text-red-600">
                    {Object.entries(errorsDays).map(([key, error]) => (
                                                  <li key={key}>{error}</li>
                    ))}
                                            </ul>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter className="flex justify-center">
                                    <Button
              onClick={saveDays}
                                      disabled={processDays}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
                                    >
              {processDays ? "Saving..." : "Save Days"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

      {/* Edit Time Dialog */}
                                              <Dialog
                                                open={isSubServiceDialogOpen}
                                                onOpenChange={(open) => {
          setIsSubServiceDialogOpen(open);
                                                  if (open) {
            setDataTime("subservice_id", selectedSubService?.id);
            setDataTime("subservicename", selectedSubService?.subservicename);
            setDataTime("times", selectedSubService?.times?.map((t) => moment(t.time, "HH:mm:ss").format("hh:mm A")) || []);
          }
        }}
      >
        <DialogContent className="max-w-lg">
                                                  <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Sub-service Times</DialogTitle>
                                                    <DialogDescription>
              Select the available times for this sub-service
                                                    </DialogDescription>
                                                  </DialogHeader>
                                                  <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Sub-Service Name</Label>
                                                    <Input
                value={dataTime.subservicename}
                                                      onChange={(e) => {
                  setDataTime("subservicename", e.target.value);
                }}
                className="border-2 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label>Available Times</Label>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {generateTimeArray.map((time, i) => (
                                                          <Badge
                                                            key={i}
                    className={`cursor-pointer transition-colors ${
                      dataTime.times.includes(time)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => handleTimeChange(time)}
                                                          >
                                                            {time}
                                                          </Badge>
                ))}
                                                    </div>
                                                  </div>
            {Object.keys(errorsTime).length > 0 && (
                                                      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                                        <div className="flex items-center">
                  <Cross2Icon className="h-5 w-5 text-red-400 mr-3" />
                                                            <ul className="text-sm text-red-600">
                    {Object.entries(errorsTime).map(([key, error]) => (
                      <li key={key}>{error}</li>
                    ))}
                                                            </ul>
                                                        </div>
                                                      </div>
                                                    )}
          </div>
          <DialogFooter>
                                                    <Button
                                                      onClick={saveTime}
                                                      disabled={procTime}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                                    >
              {procTime ? "Saving..." : "Save Times"}
                                                    </Button>
                                                  </DialogFooter>
                                                </DialogContent>
                                              </Dialog>
            <ConfirmationDialog />
    </ServicesLayout>
  );
};

export default Services;
