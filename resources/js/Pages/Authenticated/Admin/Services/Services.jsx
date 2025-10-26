import React, { useEffect, useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { showToast } from "@/utils/toast.jsx";
import { useArchiveConfirmation } from "@/utils/confirmation.jsx";

import { motion } from "framer-motion";

import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Trash2,
  CrossIcon,
  Eye,
  Settings,
  Calendar,
  Clock,
  Users,
  FileText,
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
import { useForm } from "@inertiajs/react";
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

    setDataDays((prev) => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      
      // Initialize slot capacity for new day
      const newDaySlots = { ...prev.daySlots };
      if (!prev.days.includes(day) && newDays.includes(day)) {
        newDaySlots[day] = 20; // Default 20 slots per day
      } else if (prev.days.includes(day) && !newDays.includes(day)) {
        delete newDaySlots[day];
      }
      
      return {
        ...prev,
        days: newDays,
        daySlots: newDaySlots,
      };
    });
  };

  const updateDaySlots = (day, slots) => {
    setDataDays((prev) => ({
      ...prev,
      daySlots: {
        ...prev.daySlots,
        [day]: parseInt(slots) || 20,
      },
    }));
  };

  // Add new service
  const addService = async () => {
    // First check for duplicate on frontend
    const existingService = services.find(
      s => s.servicename?.toLowerCase() === newService.servicename?.toLowerCase()
    );

    if (existingService) {
      showToast("Error", "A service with this name already exists", "error");
      return;
    }

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
      // Check if it's a validation error for duplicate
      if (error.response?.data?.message?.includes('unique')) {
        showToast("Error", "A service with this name already exists", "error");
      } else {
        showToast(
          "Error",
          error.response?.data?.message ||
            "An error occurred while creating the service",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addSubService = () => {
    // First check for duplicate on frontend
    const service = services.find(s => s.id === data.serviceid);
    const existingSubService = service?.subservices?.find(
      sub => sub.subservicename?.toLowerCase() === data.subservicename?.toLowerCase()
    );

    if (existingSubService) {
      showToast("Error", "A sub-service with this name already exists for this service", "error");
      return;
    }

    post(route("admin.services.subservice.create"), {
      preserveScroll: true,
      preserveState: false,
      onSuccess: () => {
        setIsServiceDialogOpen(false);
        showToast("Success", "Sub-Service added successfully!");
        // Refresh the page to get updated slot calculations
        router.reload({ only: ['services_'] });
      },
      onError: (errors) => {
        // Errors are handled automatically by Inertia
        console.error("Validation errors:", errors);
        // Show error toast if duplicate is detected on backend
        if (errors?.subservicename) {
          showToast("Error", errors.subservicename, "error");
        } else {
          showToast("Error", "Failed to add sub-service. Please try again.", "error");
        }
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
    daySlots: {}, // Object to store slot capacity for each day
  });

  const saveDays = () => {
    console.log("Saving days with data:", dataDays);
    if (!dataDays.serviceid) {
      showToast("Error", "Service ID is required", "error");
      return;
    }
    postDays(route("admin.services.days.update"), {
      preserveScroll: true,
      preserveState: false, // Allow state to be updated
      replace: true,
      onSuccess: () => {
        setIsEditDaysOpen(false);
        showToast("Success!", "Successfully Updated!", "success");
        // Refresh the page to get updated slot calculations
        router.reload({ only: ['services_'] });
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
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  const [timeArr, setTimeArr] = useState([]);
  const [isSubServiceDialogOpen, setIsSubServiceDialogOpen] = useState(false);
  const [isEditingExistingSlots, setIsEditingExistingSlots] = useState(false);
  const [showCustomTimeInput, setShowCustomTimeInput] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [customSlots, setCustomSlots] = useState(5);
  const [expandedDay, setExpandedDay] = useState(null);
  
  // Date-specific slot management states
  const [showDateSlotModal, setShowDateSlotModal] = useState(false);
  const [dateSlotOverrides, setDateSlotOverrides] = useState([]);
  const [newDateOverride, setNewDateOverride] = useState({
    date: '',
    time: '',
    capacity: 5
  });
  
  // Day-based slot management states
  const [showDaySlotModal, setShowDaySlotModal] = useState(false);
  const [daySlotSchedules, setDaySlotSchedules] = useState([]);
  const [newDaySchedule, setNewDaySchedule] = useState({
    day: '',
    timeSlots: []
  });
  const [selectedDayScheduleIndex, setSelectedDayScheduleIndex] = useState(null);
  
  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Day filter for sub-service time slots display
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  
  // Pagination for time slots
  const [timeSlotsPage, setTimeSlotsPage] = useState(1);
  const [timeSlotsPerPage] = useState(8); // Show 8 time slots per page

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
    slot_capacities: [],
  });

  // useEffect(() => {
  //     //console.log("sel sub serv:", selectedSubService);

  //     setDataTime("subservicename", selectedSubService?.subservicename);
  // }, [selectedSubService]);

  const handleTimeChange = (time) => {
    setDataTime((prev) => {
      const isSelected = prev.times.includes(time);
      const newTimes = isSelected 
        ? prev.times.filter((t) => t !== time)
        : [...prev.times, time];
      
      // Update slot capacities array to match times array
      const newSlotCapacities = newTimes.map((t, index) => {
        const originalIndex = prev.times.indexOf(t);
        return originalIndex !== -1 ? prev.slot_capacities[originalIndex] || 5 : 5;
      });
      
      return {
        ...prev,
        times: newTimes,
        slot_capacities: newSlotCapacities,
      };
    });
  };

  const handleSlotCapacityChange = (timeIndex, capacity) => {
    setDataTime((prev) => {
      const newCapacities = [...prev.slot_capacities];
      newCapacities[timeIndex] = parseInt(capacity) || 5;
      return {
        ...prev,
        slot_capacities: newCapacities,
      };
    });
  };

  const addCustomTime = () => {
    if (!customTime || !customSlots) return;
    
    // Convert 24-hour format to 12-hour format
    const time24hr = customTime;
    const time12hr = moment(time24hr, "HH:mm").format("hh:mm A");
    
    // Check if time already exists
    if (dataTime.times.includes(time12hr)) {
      alert("This time slot already exists!");
      return;
    }
    
    setDataTime((prev) => ({
      ...prev,
      times: [...prev.times, time12hr],
      slot_capacities: [...prev.slot_capacities, parseInt(customSlots) || 5],
    }));
    
    // Reset form
    setCustomTime("");
    setCustomSlots(5);
    setShowCustomTimeInput(false);
  };

  const removeTimeSlot = (index) => {
    setDataTime((prev) => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
      slot_capacities: prev.slot_capacities.filter((_, i) => i !== index),
    }));
  };

  const saveTime = (e) => {
    postTime(route("admin.services.time.update"), {
      preserveScroll: true,
      preserveState: false,
      onSuccess: async () => {
        // After saving sub-service times, also save day slot schedules if they exist
        if (daySlotSchedules.length > 0) {
          try {
            await saveDaySlotSchedules();
            // Don't close the dialog here, let saveDaySlotSchedules handle it
            return;
          } catch (error) {
            // Error already handled in saveDaySlotSchedules
            return;
          }
        }
        
        // If no day slot schedules, just close and show success
        setIsSubServiceDialogOpen(false);
        showToast("Success!", "Successfully Updated!", "success");
        // Refresh the page to get updated slot calculations
        router.reload({ only: ['services_'] });
      },
    });
  };

  // Date-specific slot management functions
  const addDateSlotOverride = () => {
    if (newDateOverride.date && newDateOverride.time && newDateOverride.capacity) {
      const override = {
        ...newDateOverride,
        id: Date.now() // Simple ID for now
      };
      setDateSlotOverrides(prev => [...prev, override]);
      setNewDateOverride({ date: '', time: '', capacity: 5 });
      setShowDateSlotModal(false);
    }
  };

  const removeDateSlotOverride = (index) => {
    setDateSlotOverrides(prev => prev.filter((_, i) => i !== index));
  };

  const saveDateSlotOverrides = async () => {
    try {
      // Send date-specific overrides to backend
      const response = await axios.post('/admin/services/date-slots/update', {
        subservice_id: selectedSubService?.id,
        overrides: dateSlotOverrides
      });
      
      if (response.data.success) {
        showToast("Success!", "Date-specific slots updated successfully!", "success");
        setIsSubServiceDialogOpen(false);
        router.reload({ only: ['services_'] });
      }
    } catch (error) {
      console.error('Error saving date slot overrides:', error);
      showToast("Error!", "Failed to update date-specific slots", "error");
    }
  };

  // Time format conversion helpers
  const formatTimeTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatTimeTo24Hour = (time12) => {
    if (!time12) return '';
    const [time, ampm] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (ampm === 'AM' && hour24 === 12) {
      hour24 = 0;
    } else if (ampm === 'PM' && hour24 !== 12) {
      hour24 += 12;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  };

  // Day-based slot management functions
  const addDaySlotSchedule = () => {
    if (newDaySchedule.day && newDaySchedule.timeSlots.length > 0) {
      // If we're editing an existing schedule (selectedDayScheduleIndex is not null)
      if (selectedDayScheduleIndex !== null) {
        // Update the existing schedule at that index
        setDaySlotSchedules(prev => prev.map((schedule, i) => 
          i === selectedDayScheduleIndex ? newDaySchedule : schedule
        ));
        setSelectedDayScheduleIndex(null);
        setNewDaySchedule({ day: '', timeSlots: [] });
        setShowDaySlotModal(false);
        showToast("Success", `${newDaySchedule.day} schedule updated successfully!`, "success");
        return;
      }
      
      // Check if the day already exists (only for new schedules)
      const dayExists = daySlotSchedules.some(schedule => schedule.day === newDaySchedule.day);
      
      if (dayExists) {
        showToast("Validation Error", `${newDaySchedule.day} already exists in the schedule. Please choose a different day or edit the existing one.`, "error");
        return;
      }
      
      const schedule = {
        ...newDaySchedule,
        id: Date.now()
      };
      setDaySlotSchedules(prev => [...prev, schedule]);
      setNewDaySchedule({ day: '', timeSlots: [] });
      setShowDaySlotModal(false);
      showToast("Success", `${newDaySchedule.day} schedule added successfully!`, "success");
    }
  };

  const removeDaySlotSchedule = (index) => {
    setDaySlotSchedules(prev => prev.filter((_, i) => i !== index));
  };

  const addTimeSlotToSchedule = () => {
    if (newDaySchedule.timeSlots.length < 10) { // Limit to 10 time slots per day
      setNewDaySchedule(prev => ({
        ...prev,
        timeSlots: [...prev.timeSlots, { time: '', capacity: 5 }]
      }));
    }
  };

  const removeTimeSlotFromSchedule = (slotIndex) => {
    setNewDaySchedule(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== slotIndex)
    }));
  };

  const updateTimeSlotInSchedule = (slotIndex, field, value) => {
    setNewDaySchedule(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === slotIndex ? { ...slot, [field]: value } : slot
      )
    }));
  };

  // Functions to edit existing day schedules
  const editTimeSlotInDaySchedule = (scheduleIndex, slotIndex, field, value) => {
    setDaySlotSchedules(prev => prev.map((schedule, sIndex) => 
      sIndex === scheduleIndex 
        ? {
            ...schedule,
            timeSlots: schedule.timeSlots.map((slot, slIndex) => 
              slIndex === slotIndex 
                ? { ...slot, [field]: value }
                : slot
            )
          }
        : schedule
    ));
    setHasUnsavedChanges(true);
  };

  const addTimeSlotToExistingSchedule = (scheduleIndex) => {
    setDaySlotSchedules(prev => prev.map((schedule, index) => 
      index === scheduleIndex 
        ? {
            ...schedule,
            timeSlots: [...schedule.timeSlots, { time: '09:00', capacity: 5 }]
          }
        : schedule
    ));
    setHasUnsavedChanges(true);
    
    // Show success toast
    const dayName = daySlotSchedules[scheduleIndex]?.day || 'Unknown';
    showToast("Time Slot Added", `New time slot added to ${dayName} schedule. Don't forget to save your changes!`, "success");
  };

  const removeTimeSlotFromExistingSchedule = (scheduleIndex, slotIndex) => {
    setDaySlotSchedules(prev => prev.map((schedule, index) => 
      index === scheduleIndex 
        ? {
            ...schedule,
            timeSlots: schedule.timeSlots.filter((_, slIndex) => slIndex !== slotIndex)
          }
        : schedule
    ));
    setHasUnsavedChanges(true);
    
    // Show success toast
    const dayName = daySlotSchedules[scheduleIndex]?.day || 'Unknown';
    showToast("Time Slot Removed", `Time slot removed from ${dayName} schedule. Don't forget to save your changes!`, "success");
  };

  const saveDaySlotSchedules = async () => {
    try {
      const response = await axios.post('/admin/services/day-slots/update', {
        subservice_id: selectedSubService?.id,
        schedules: daySlotSchedules
      });
      
      if (response.data.success) {
        if (daySlotSchedules.length === 0) {
          showToast("Success!", "All day-based schedules cleared successfully!", "success");
        } else {
          showToast("Success!", "Day-based schedules updated successfully!", "success");
        }
        setHasUnsavedChanges(false);
        setIsSubServiceDialogOpen(false);
        router.reload({ only: ['services_'] });
        return response; // Return response for the caller
      }
    } catch (error) {
      console.error('Error saving day slot schedules:', error);
      showToast("Error!", "Failed to update day-based schedules", "error");
      throw error; // Re-throw for caller to handle
    }
  };

  // Function to filter time slots by selected day
  const getFilteredTimeSlots = (subservice) => {
    if (!subservice?.time_slots) return [];
    
    if (selectedDayFilter === 'all') {
      return subservice.time_slots;
    }
    
    return subservice.time_slots.filter(timeSlot => timeSlot.day === selectedDayFilter);
  };

  // Function to get paginated time slots
  const getPaginatedTimeSlots = (subservice) => {
    const filteredSlots = getFilteredTimeSlots(subservice);
    
    if (selectedDayFilter === 'all') {
      // Paginate when showing all days
      const startIndex = (timeSlotsPage - 1) * timeSlotsPerPage;
      const endIndex = startIndex + timeSlotsPerPage;
      return filteredSlots.slice(startIndex, endIndex);
    }
    
    // Don't paginate when filtering by specific day
    return filteredSlots;
  };

  // Function to get total pages for time slots
  const getTimeSlotsTotalPages = (subservice) => {
    const filteredSlots = getFilteredTimeSlots(subservice);
    
    if (selectedDayFilter === 'all') {
      return Math.ceil(filteredSlots.length / timeSlotsPerPage);
    }
    
    return 1; // No pagination needed for specific day
  };

  // Reset pagination when day filter changes
  useEffect(() => {
    setTimeSlotsPage(1);
  }, [selectedDayFilter]);

  // Initialize daySlotSchedules when opening edit dialog
  useEffect(() => {
    if (isSubServiceDialogOpen && selectedSubService) {
      console.log('selectedSubService:', selectedSubService);
      console.log('selectedSubService.time_slots:', selectedSubService.time_slots);
      console.log('selectedSubService.has_day_schedules:', selectedSubService.has_day_schedules);
      
      // Check if this subservice has day-based schedules from the backend
      if (selectedSubService.has_day_schedules && selectedSubService.time_slots && selectedSubService.time_slots.length > 0) {
        // Group time_slots by day
        const schedules = [];
        const timesByDay = {};
        
        selectedSubService.time_slots.forEach(timeSlot => {
          // Only process day-based schedules
          if (timeSlot.is_day_schedule && timeSlot.day) {
            const day = timeSlot.day;
            if (!timesByDay[day]) {
              timesByDay[day] = [];
            }
            timesByDay[day].push({
              time: timeSlot.time,
              capacity: timeSlot.capacity || timeSlot.max_slots || 5
            });
          }
        });

        // Convert to daySlotSchedules format
        Object.entries(timesByDay).forEach(([day, slots]) => {
          schedules.push({
            day,
            timeSlots: slots
          });
        });

        console.log('Loaded schedules:', schedules);
        
        // Set the schedules
        if (schedules.length > 0) {
          setDaySlotSchedules(schedules);
        } else {
          // If still no schedules, keep empty for fresh start
          setDaySlotSchedules([]);
        }
      } else {
        // No existing schedules at all
        setDaySlotSchedules([]);
      }
    }
  }, [isSubServiceDialogOpen, selectedSubService]);

  // Function to get available days for a subservice
  const getAvailableDays = (subservice) => {
    if (!subservice?.time_slots) return [];
    
    const days = [...new Set(subservice.time_slots.map(slot => slot.day))];
    return days.sort();
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
                            {service?.servicedays?.map((day, i) => {
                                // Use the day-level availability data from backend
                                const totalMaxSlots = day.total_slots_for_day || day.slot_capacity || 5;
                                const totalAvailableSlots = day.available_slots_for_day || 0;
                                const totalBookedSlots = day.booked_appointments_for_day || 0;
                                
                                // Determine badge color based on real-time availability (same logic as patient calendar)
                                let badgeClass = "bg-blue-100 text-blue-700 border-blue-200"; // Default
                                
                                if (totalAvailableSlots === 0) {
                                    badgeClass = "bg-red-100 text-red-700 border-red-200"; // Full (0 slots) - RED
                                } else if (totalAvailableSlots <= 2) {
                                    badgeClass = "bg-orange-100 text-orange-700 border-orange-200"; // Limited (1-2 slots) - ORANGE
                                } else if (totalAvailableSlots <= 5) {
                                    badgeClass = "bg-yellow-100 text-yellow-700 border-yellow-200"; // Moderate (3-5 slots) - YELLOW
                                } else {
                                    badgeClass = "bg-green-100 text-green-700 border-green-200"; // Available (6+ slots) - GREEN
                                }
                                
                                return (
                                    <Badge key={i} variant="secondary" className={badgeClass}>
                                        <div className="flex items-center gap-1">
                                            <span>{day.day}</span>
                                            <span className="text-xs font-bold">
                                                ({totalAvailableSlots}/{totalMaxSlots})
                                            </span>
                                        </div>
                                    </Badge>
                                );
                            })}
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
                                          setData("subservicename", ""); // Clear sub-service name
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
                                              <SortableTableHead className="font-medium w-1/3">Available Time & Slots</SortableTableHead>
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
                                                  <div className="space-y-3">
                                                    {/* Day Filter Dropdown */}
                                                    {subservice?.time_slots && subservice.time_slots.length > 0 && (
                                                      <div className="flex items-center gap-2 mb-3">
                                                        <Label className="text-sm font-medium text-gray-600">Filter by Day:</Label>
                                                        <Select
                                                          value={selectedDayFilter}
                                                          onValueChange={setSelectedDayFilter}
                                                        >
                                                          <SelectTrigger className="w-40 h-8 text-sm">
                                                            <SelectValue placeholder="Select day" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <SelectItem value="all">All Days</SelectItem>
                                                            {getAvailableDays(subservice).map((day) => (
                                                              <SelectItem key={day} value={day}>
                                                                {day}
                                                              </SelectItem>
                                                            ))}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                    )}
                                                    
                                                    {/* Time Slots Display */}
                                                    <div className="flex flex-wrap gap-3 items-center h-full">
                                                      {getPaginatedTimeSlots(subservice).length > 0 ? (
                                                        getPaginatedTimeSlots(subservice).map((timeSlot, i) => {
                                                        const availableSlots = timeSlot.available_slots || 0;
                                                        const maxSlots = timeSlot.max_slots || 5;
                                                        const bookedSlots = timeSlot.booked_slots || 0;
                                                        const isFullyBooked = availableSlots === 0;
                                                        const isLowAvailability = availableSlots <= maxSlots * 0.3;
                                                        const isModerateAvailability = availableSlots >= 3 && availableSlots <= 5;
                                                        const isHighAvailability = availableSlots >= 6;
                                                        
                                                        // Determine color based on availability
                                                        let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";
                                                        if (isFullyBooked) {
                                                          badgeClass += "bg-red-100 text-red-700 border border-red-200";
                                                        } else if (isLowAvailability) {
                                                          badgeClass += "bg-orange-100 text-orange-700 border border-orange-200";
                                                        } else if (isModerateAvailability) {
                                                          badgeClass += "bg-yellow-100 text-yellow-700 border border-yellow-200";
                                                        } else if (isHighAvailability) {
                                                          badgeClass += "bg-green-100 text-green-700 border border-green-200";
                                                        } else {
                                                          badgeClass += "bg-gray-100 text-gray-700 border border-gray-200";
                                                        }
                                                        
                                                        return (
                                                          <div key={i} className={`relative flex flex-col items-center rounded-xl p-3 border-2 transition-all duration-200 hover:shadow-md ${
                                                            isFullyBooked 
                                                              ? "bg-red-50 border-red-200" 
                                                              : isLowAvailability 
                                                                ? "bg-orange-50 border-orange-200" 
                                                                : isModerateAvailability
                                                                  ? "bg-yellow-50 border-yellow-200"
                                                                  : "bg-green-50 border-green-200"
                                                          }`}>
                                                            <div className="flex items-center space-x-2 mb-2">
                                                              <div className={`p-1.5 rounded-lg ${
                                                                isFullyBooked 
                                                                  ? "bg-red-100" 
                                                                  : isLowAvailability 
                                                                    ? "bg-orange-100" 
                                                                    : isModerateAvailability
                                                                      ? "bg-yellow-100"
                                                                      : "bg-green-100"
                                                              }`}>
                                                                <Clock className={`h-3 w-3 ${
                                                                  isFullyBooked 
                                                                    ? "text-red-600" 
                                                                    : isLowAvailability 
                                                                      ? "text-orange-600" 
                                                                      : isModerateAvailability
                                                                        ? "text-yellow-600"
                                                                        : "text-green-600"
                                                                }`} />
                                                              </div>
                                                              <span className="text-sm font-semibold text-gray-800">
                                                                {moment(timeSlot.time, "HH:mm:ss").format("hh:mm A")}
                                                              </span>
                                                              {timeSlot.day && (
                                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                  {timeSlot.day}
                                                                </span>
                                                              )}
                                                            </div>
                                                            
                                                            <div className="flex items-center space-x-2">
                                                              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                                isFullyBooked 
                                                                  ? "bg-red-100 text-red-700" 
                                                                  : isLowAvailability 
                                                                    ? "bg-orange-100 text-orange-700" 
                                                                    : isModerateAvailability
                                                                      ? "bg-yellow-100 text-yellow-700"
                                                                      : "bg-green-100 text-green-700"
                                                              }`}>
                                                                {availableSlots}/{maxSlots}
                                                              </div>
                                                              <span className="text-xs text-gray-500">slots</span>
                                                            </div>
                                                            
                                                            {/* Progress bar */}
                                                            <div className="w-full mt-2">
                                                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                <div 
                                                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                                                    isFullyBooked 
                                                                      ? "bg-red-500" 
                                                                      : isLowAvailability 
                                                                        ? "bg-orange-500" 
                                                                        : isModerateAvailability
                                                                          ? "bg-yellow-500"
                                                                          : "bg-green-500"
                                                                  }`}
                                                                  style={{ width: `${((maxSlots - availableSlots) / maxSlots) * 100}%` }}
                                                                ></div>
                                                              </div>
                                                            </div>
                                                            
                                                            {/* Status indicator */}
                                                            {isFullyBooked && (
                                                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">!</span>
                                                              </div>
                                                            )}
                                                            
                                                          </div>
                                                        );
                                                      })
                                                      ) : (
                                                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                          <Clock className="h-8 w-8 text-gray-400 mb-2" />
                                                          <span className="text-sm text-gray-500 font-medium">
                                                            {subservice?.time_slots && subservice.time_slots.length > 0 
                                                              ? `No time slots for ${selectedDayFilter}` 
                                                              : "No times assigned"
                                                            }
                                                          </span>
                                                          <span className="text-xs text-gray-400">Click edit to add time slots</span>
                                                        </div>
                                                      )}
                                                    </div>
                                                    
                                                    {/* Pagination Controls */}
                                                    {selectedDayFilter === 'all' && getTimeSlotsTotalPages(subservice) > 1 && (
                                                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                                        <div className="text-sm text-gray-600">
                                                          Showing {((timeSlotsPage - 1) * timeSlotsPerPage) + 1} to {Math.min(timeSlotsPage * timeSlotsPerPage, getFilteredTimeSlots(subservice).length)} of {getFilteredTimeSlots(subservice).length} time slots
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                          <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setTimeSlotsPage(prev => Math.max(1, prev - 1))}
                                                            disabled={timeSlotsPage === 1}
                                                            className="h-8 w-8 p-0"
                                                          >
                                                            <ChevronLeft className="h-4 w-4" />
                                                          </Button>
                                                          
                                                          <div className="flex items-center space-x-1">
                                                            {Array.from({ length: getTimeSlotsTotalPages(subservice) }, (_, i) => i + 1).map((page) => (
                                                              <Button
                                                                key={page}
                                                                variant={page === timeSlotsPage ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => setTimeSlotsPage(page)}
                                                                className="h-8 w-8 p-0"
                                                              >
                                                                {page}
                                                              </Button>
                                                            ))}
                                                          </div>
                                                          
                                                          <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setTimeSlotsPage(prev => Math.min(getTimeSlotsTotalPages(subservice), prev + 1))}
                                                            disabled={timeSlotsPage === getTimeSlotsTotalPages(subservice)}
                                                            className="h-8 w-8 p-0"
                                                          >
                                                            <ChevronRight className="h-4 w-4" />
                                                          </Button>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </TableCell>
                                                <TableCell className="py-4 align-middle text-right">
                                                  <div className="flex items-center justify-end gap-1 h-full">
                                                    {/* Edit Time Slots - only if subservice has times */}
                                                    {subservice?.times && subservice.times.length > 0 ? (
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                          setDataTime("subservice_id", subservice.id);
                                                          setSelectedSubService(subservice);
                                                          setDataTime("subservicename", subservice.subservicename);
                                                          setDataTime("times", subservice?.times?.map((t) => moment(t.time, "HH:mm:ss").format("hh:mm A")) || []);
                                                          setDataTime("slot_capacities", subservice?.times?.map((t) => t.max_slots || 5) || []);
                                                          setIsEditingExistingSlots(true);
                                                          setIsSubServiceDialogOpen(true);
                                                        }}
                                                        className="hover:bg-green-100 hover:text-green-600 h-8 w-8 p-0"
                                                        title="Edit existing time slots"
                                                      >
                                                        <Clock className="h-4 w-4" />
                                                      </Button>
                                                    ) : null}
                                                    
                                                    {/* Add Time Slots - show always */}
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {
                                                        setDataTime("subservice_id", subservice.id);
                                                        setSelectedSubService(subservice);
                                                        setDataTime("subservicename", subservice.subservicename);
                                                        // Start with empty times for new schedules
                                                        setDataTime("times", []);
                                                        setDataTime("slot_capacities", []);
                                                        setIsEditingExistingSlots(false);
                                                        setIsSubServiceDialogOpen(true);
                                                      }}
                                                      className="hover:bg-blue-100 hover:text-blue-600 h-8 w-8 p-0"
                                                      title="Add time slots"
                                                    >
                                                      <Plus className="h-4 w-4" />
                                                    </Button>
                                                    
                                <Button
                                                      variant="ghost"
                                  size="sm"
                                                      onClick={() => {
                                                        // Set the sub-service name in the time dialog to enable editing
                                                        setDataTime("subservice_id", subservice.id);
                                                        setSelectedSubService(subservice);
                                                        setDataTime("subservicename", subservice.subservicename);
                                                        setDataTime("times", subservice?.times?.map((t) => moment(t.time, "HH:mm:ss").format("hh:mm A")) || []);
                                                        setDataTime("slot_capacities", subservice?.times?.map((t) => t.max_slots || 5) || []);
                                                        setIsEditingExistingSlots(true);
                                                        setIsSubServiceDialogOpen(true);
                                                      }}
                                                      className="hover:bg-blue-100 hover:text-blue-600 h-8 w-8 p-0"
                                                      title="Edit sub-service details"
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

          {/* Slot Availability Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Available Days Legend</h3>
                    <p className="text-sm text-gray-500">Color-coded slot availability for each day</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center">
                      <span className="text-green-700 text-xs font-bold"></span>
                    </div>
                    <span className="text-sm text-gray-700">Available (6+ slots)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded flex items-center justify-center">
                      <span className="text-yellow-700 text-xs font-bold"></span>
                    </div>
                    <span className="text-sm text-gray-700">Moderate (3-5 slots)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded flex items-center justify-center">
                      <span className="text-orange-700 text-xs font-bold"></span>
                    </div>
                    <span className="text-sm text-gray-700">Limited (1-2 slots)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                      <span className="text-red-700 text-xs font-bold"></span>
                    </div>
                    <span className="text-sm text-gray-700">Full (0 slots)</span>
                  </div>
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
                className={`border-2 focus:border-blue-500 ${errors?.subservicename ? 'border-red-500' : ''}`}
              />
              {errors?.subservicename && (
                <div className="text-sm text-red-600 mt-1">
                  {errors.subservicename}
                </div>
              )}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">Edit Available Days & Slots</DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Select days and set slot capacity for this service
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <Label className="text-base font-semibold">Available Days</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {days_.map((day) => (
                  <div key={day} className="space-y-2">
                    <Badge
                      className={`cursor-pointer transition-colors text-center py-2 px-4 w-full ${
                        dataDays.days.includes(day)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => handleRecurrenceDateChange(day)}
                    >
                      {day}
                    </Badge>
                    
                    {/* Slot Capacity for Selected Days */}
                    {dataDays.days.includes(day) && (
                      <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">{day} Slot Capacity</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Max Slots:</span>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={dataDays.daySlots[day] || 20}
                            onChange={(e) => updateDaySlots(day, e.target.value)}
                            className="w-20 h-8 text-center text-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded"
                          />
                          <span className="text-xs text-gray-500">slots</span>
                        </div>
                        
                        {/* Slot Availability Legend for this day */}
                        <div className="bg-white rounded p-2 text-xs">
                          <div className="text-gray-600 mb-1">Availability Status:</div>
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const slotCapacity = dataDays.daySlots[day] || 5;
                              let status, color, icon;
                              
                              if (slotCapacity === 0) {
                                status = 'Full (0 slots)';
                                color = 'bg-red-500';
                                icon = '✗';
                              } else if (slotCapacity <= 2) {
                                status = 'Limited (1-2 slots)';
                                color = 'bg-orange-500';
                                icon = '!';
                              } else if (slotCapacity <= 5) {
                                status = 'Moderate (3-5 slots)';
                                color = 'bg-yellow-500';
                                icon = '!';
                              } else {
                                status = 'Available (6+ slots)';
                                color = 'bg-green-500';
                                icon = '✓';
                              }
                              
                              return (
                                <>
                                  <div className={`w-3 h-3 rounded-full ${color} flex items-center justify-center`}>
                                    <span className="text-white text-xs font-bold">{icon}</span>
                                  </div>
                                  <span className="text-gray-600">{status}</span>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
            
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Summary</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Selected Days: {dataDays.days.length}</div>
              <div>Average Slots per Day: {dataDays.days.length > 0 ? Math.round(Object.values(dataDays.daySlots).reduce((sum, slots) => sum + (slots || 0), 0) / dataDays.days.length) : 0}</div>
            </div>
          </div>
        <DialogFooter className="flex justify-center pt-6 border-t border-gray-200">
          <Button
            onClick={saveDays}
            disabled={processDays}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
          >
            {processDays ? "Saving..." : "Save Days & Slots"}
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
          setDataTime("slot_capacities", selectedSubService?.times?.map((t) => t.max_slots || 5) || []);
        } else {
          // Reset when closing the dialog
          setDaySlotSchedules([]);
          setSelectedDayScheduleIndex(null);
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {isEditingExistingSlots ? 'Edit Sub-Service Times & Slots' : 'Add Sub-Service Times & Slots'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  {isEditingExistingSlots 
                    ? 'Update existing time slots and capacities for this sub-service'
                    : 'Add new time slots and capacities for this sub-service'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div>
                </div>
            </div>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-purple-100 rounded-md">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <Label className="text-base font-semibold">Sub-Service Name</Label>
              </div>
              <Input
                value={dataTime.subservicename}
                onChange={(e) => {
                  setDataTime("subservicename", e.target.value);
                }}
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg h-12 text-lg font-medium"
                placeholder="Enter sub-service name..."
              />
            </div>
            
            {/* Enhanced Day-Based Slot Management */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <Label className="text-xl font-bold text-gray-900">Day-Based Slot Management</Label>
                    <p className="text-sm text-gray-600 mt-1">Configure unique time slots and capacities for each day</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">Schedule Configuration</h3>
                        <p className="text-sm text-green-700">
                          {isEditingExistingSlots 
                            ? 'Current day schedules - Click on time slots or capacity to edit inline' 
                            : 'Click "Add Day Schedule" below to create new schedules'}
                        </p>
                      </div>
                    </div>
                    {!isEditingExistingSlots && (
                      <Button
                        onClick={() => setShowDaySlotModal(true)}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Day Schedule
                      </Button>
                    )}
                  </div>
                  
                  {/* Configured Days Summary */}
                  {daySlotSchedules.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-1 bg-blue-100 rounded">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-blue-800">Configured Days</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {daySlotSchedules.map((schedule, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-blue-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-700">{schedule.day}</span>
                            <span className="text-xs text-gray-500">({schedule.timeSlots.length} slots)</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        {daySlotSchedules.length} of 7 days configured. Each day can only be configured once.
                      </p>
                    </div>
                  )}
                  
                  {/* Day Schedules Grid */}
                  {daySlotSchedules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {daySlotSchedules.map((schedule, index) => (
                        <div key={index} className={`bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                          hasUnsavedChanges 
                            ? 'border-orange-300 bg-orange-50' 
                            : 'border-green-200'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 bg-green-100 rounded-lg">
                                <Calendar className="h-4 w-4 text-green-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-green-800">{schedule.day}</h4>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => {
                                  setNewDaySchedule(schedule);
                                  setSelectedDayScheduleIndex(index);
                                  setShowDaySlotModal(true);
                                }}
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit day schedule"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeDaySlotSchedule(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove day schedule"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {schedule.timeSlots.map((slot, slotIndex) => (
                              <div key={slotIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                                <div className="flex items-center space-x-2 flex-1">
                                  <Clock className="h-3 w-3 text-gray-500" />
                                  <Input
                                    type="time"
                                    value={slot.time}
                                    onChange={(e) => editTimeSlotInDaySchedule(index, slotIndex, 'time', e.target.value)}
                                    className="h-8 text-sm border-0 bg-transparent p-0 font-medium text-gray-800 focus:ring-0 focus:border-green-500"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={slot.capacity}
                                    onChange={(e) => editTimeSlotInDaySchedule(index, slotIndex, 'capacity', parseInt(e.target.value) || 1)}
                                    className="w-16 h-6 text-xs text-center border-0 bg-blue-100 text-blue-800 rounded-full focus:ring-0 focus:border-blue-500"
                                  />
                                  <span className="text-xs text-gray-500">slots</span>
                                  <button
                                    onClick={() => removeTimeSlotFromExistingSchedule(index, slotIndex)}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                    title="Remove time slot"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => addTimeSlotToExistingSchedule(index)}
                              className={`w-full p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg border border-dashed border-green-300 transition-colors text-sm font-medium ${
                                hasUnsavedChanges ? 'animate-pulse bg-green-100 border-green-400' : ''
                              }`}
                            >
                              <Plus className="h-3 w-3 mr-1 inline" />
                              Add Time Slot
                              {hasUnsavedChanges && (
                                <span className="ml-1 text-xs text-orange-600">(Unsaved)</span>
                              )}
                            </button>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{schedule.timeSlots.length} time slots</span>
                              <span>{schedule.timeSlots.reduce((sum, slot) => sum + slot.capacity, 0)} total capacity</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-4 bg-white rounded-xl border-2 border-dashed border-green-300 mb-4">
                        <Calendar className="h-12 w-12 text-green-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Day Schedules Configured</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {isEditingExistingSlots 
                            ? 'No additional schedules to manage. This sub-service does not have day-based schedules configured.'
                            : 'Start by adding day schedules to configure different time slots and capacities for each day of the week.'}
                        </p>
                        {!isEditingExistingSlots && (
                          <Button
                            onClick={() => setShowDaySlotModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Day Schedule
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  
                {/* Summary Stats */}
                {daySlotSchedules.length > 0 && (
                  <div className="mt-6 bg-white rounded-xl border border-green-200 p-4">
                    {hasUnsavedChanges && (
                      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-orange-700 font-medium">You have unsaved changes</span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{daySlotSchedules.length}</div>
                          <div className="text-sm text-gray-600">Days Configured</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {daySlotSchedules.reduce((sum, schedule) => sum + schedule.timeSlots.length, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Total Time Slots</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {daySlotSchedules.reduce((sum, schedule) => 
                              sum + schedule.timeSlots.reduce((slotSum, slot) => slotSum + slot.capacity, 0), 0
                            )}
                          </div>
                          <div className="text-sm text-gray-600">Total Capacity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {Math.round(daySlotSchedules.reduce((sum, schedule) => 
                              sum + schedule.timeSlots.reduce((slotSum, slot) => slotSum + slot.capacity, 0), 0
                            ) / daySlotSchedules.length)}
                          </div>
                          <div className="text-sm text-gray-600">Avg Capacity/Day</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
          
          <DialogFooter className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Changes will be saved immediately</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsSubServiceDialogOpen(false)}
                  disabled={procTime}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Check if there are any day schedules configured
                    if (daySlotSchedules.length === 0) {
                      showToast("Error!", "Please add at least one day schedule before saving", "error");
                      return;
                    }
                    // Update sub-service name using saveTime
                    saveTime();
                  }}
                  disabled={procTime || daySlotSchedules.length === 0}
                  className={`px-8 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                    procTime || daySlotSchedules.length === 0
                      ? 'bg-gray-400 cursor-not-allowed opacity-60'
                      : hasUnsavedChanges 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 animate-pulse' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  }`}
                >
                  {procTime ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {daySlotSchedules.length === 0 
                          ? 'Add Day Schedules to Enable Save' 
                          : hasUnsavedChanges ? 'Save Changes' : 'Save Times & Slots'}
                      </span>
                      {hasUnsavedChanges && daySlotSchedules.length > 0 && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Date Slot Override Modal */}
      <Dialog open={showDateSlotModal} onOpenChange={setShowDateSlotModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">Set Slot Capacity</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Set the number of available slots for a specific date and time
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Input
                type="date"
                value={newDateOverride.date}
                onChange={(e) => setNewDateOverride(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="border-2 border-gray-200 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time Slot</Label>
              <Select
                value={newDateOverride.time}
                onValueChange={(value) => setNewDateOverride(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {dataTime.times.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Slot Capacity</Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={newDateOverride.capacity}
                onChange={(e) => setNewDateOverride(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                className="border-2 border-gray-200 focus:border-purple-500"
                placeholder="Enter capacity (0 to disable)"
              />
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-purple-700 font-medium">
                  Set capacity for this specific date and time. Use 0 to disable this time slot.
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Capacity applies only to the selected date and time</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDateSlotModal(false);
                    setNewDateOverride({ date: '', time: '', capacity: 5 });
                  }}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addDateSlotOverride}
                  disabled={!newDateOverride.date || !newDateOverride.time || newDateOverride.capacity < 0}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Set Capacity</span>
                  </div>
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Day Slot Schedule Modal */}
      <Dialog open={showDaySlotModal} onOpenChange={(open) => {
        setShowDaySlotModal(open);
        if (!open) {
          // Reset state when closing the modal
          setSelectedDayScheduleIndex(null);
          setNewDaySchedule({ day: '', timeSlots: [] });
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {selectedDayScheduleIndex !== null ? 'Edit Day Schedule' : 'Add Day Schedule'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-base">
                  {selectedDayScheduleIndex !== null 
                    ? 'Update time slots and capacities for this day'
                    : 'Set time slots and capacities for a specific day of the week'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Day of Week</Label>
                <Select
                  value={newDaySchedule.day}
                  onValueChange={(value) => setNewDaySchedule(prev => ({ ...prev, day: value }))}
                  disabled={selectedDayScheduleIndex !== null}
                >
                  <SelectTrigger className={`border-2 border-gray-200 focus:border-green-500 h-12 text-base ${selectedDayScheduleIndex !== null ? 'bg-gray-100' : ''}`}>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                      const isDayTaken = daySlotSchedules.some(schedule => schedule.day === day);
                      return (
                        <SelectItem 
                          key={day} 
                          value={day} 
                          className={`text-base ${isDayTaken ? 'text-gray-400 cursor-not-allowed' : ''}`}
                          disabled={isDayTaken}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{day}</span>
                            {isDayTaken && (
                              <span className="text-xs text-red-500 ml-2">(Already exists)</span>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Quick Actions</Label>
                <div className="flex space-x-2">
                  <Button
                    onClick={addTimeSlotToSchedule}
                    disabled={newDaySchedule.timeSlots.length >= 10}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Time Slot
                  </Button>
                  <Button
                    onClick={() => {
                      const commonTimes = [
                        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
                      ];
                      const newSlots = commonTimes.map(time => ({ time, capacity: 5 }));
                      setNewDaySchedule(prev => ({
                        ...prev,
                        timeSlots: [...prev.timeSlots, ...newSlots]
                      }));
                    }}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Add Common Times
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Time Slots Configuration</Label>
                <div className="text-sm text-gray-500">
                  {newDaySchedule.timeSlots.length} time slots configured
                </div>
              </div>
              
              {newDaySchedule.timeSlots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newDaySchedule.timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <Label className="text-sm text-gray-600">Time</Label>
                        <Input
                          type="time"
                          value={slot.time}
                          onChange={(e) => updateTimeSlotInSchedule(index, 'time', e.target.value)}
                          className="h-10 text-base border-2 border-gray-200 focus:border-green-500"
                        />
                      </div>
                      <div className="w-24">
                        <Label className="text-sm text-gray-600">Capacity</Label>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={slot.capacity}
                          onChange={(e) => updateTimeSlotInSchedule(index, 'capacity', parseInt(e.target.value) || 1)}
                          className="h-10 text-base text-center border-2 border-gray-200 focus:border-green-500"
                        />
                      </div>
                      <button
                        onClick={() => removeTimeSlotFromSchedule(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove time slot"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-base">No time slots added yet</p>
                    <p className="text-sm text-gray-400">Click "Add Time Slot" to get started</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">
                  Each day can have its own unique time slots and capacities. This will apply to all weeks.
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Schedule applies to all {newDaySchedule.day}s</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDaySlotModal(false);
                    setNewDaySchedule({ day: '', timeSlots: [] });
                  }}
                  className="px-8 py-3 text-base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addDaySlotSchedule}
                  disabled={!newDaySchedule.day || newDaySchedule.timeSlots.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{selectedDayScheduleIndex !== null ? 'Update Schedule' : 'Add Schedule'}</span>
                  </div>
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
          </Dialog>
 
      <ConfirmationDialog />
    </ServicesLayout>
    
  );
};

export default Services;
