import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/tempo/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tempo/components/ui/tabs";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  BarChart3,
  PieChart,
  Filter,
  Calendar,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  Stethoscope,
  HeartPulse,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Settings,
  FileSpreadsheet,
  Eye,
  Edit,
  Calendar as CalendarIcon,
  Repeat,
  Bell,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import { Button } from "@/components/tempo/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tempo/components/ui/select";
import { Badge } from "@/components/tempo/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/tempo/components/ui/dialog";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Checkbox } from "@/components/tempo/components/ui/checkbox";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { Switch } from "@/components/tempo/components/ui/switch";
import AdminLayout from "@/Layouts/AdminLayout";
import { usePage, router } from "@inertiajs/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import axios from "axios";
import { showToast } from "@/utils/toast.jsx";

const Reports = (
  { 
    dateRange, 
    patientData, 
    appointmentData, 
    serviceData, 
    programData, 
    staffData, 
    medicalData 
  }
) => {
  const propsszxc = usePage().props;


  useEffect(() => {
    console.log('Props updated:', propsszxc);
  },[propsszxc])
  
  const [timeframe, setTimeframe] = useState("thisMonth");
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: dateRange?.start || format(new Date(), 'yyyy-MM-01'),
    end: dateRange?.end || format(new Date(), 'yyyy-MM-dd')
  });

  // Report Generation State
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isCustomReportDialogOpen, setIsCustomReportDialogOpen] = useState(false);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [reportType, setReportType] = useState('pdf');
  const [reportCategory, setReportCategory] = useState('overview');
  const [customFields, setCustomFields] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [filters, setFilters] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Custom Report Configuration (similar to Pharmacist Reports)
  const [customReportConfig, setCustomReportConfig] = useState({
    includeOverview: false,
    includePatients: false,
    includeAppointments: false,
    includePrograms: false,
    includeServices: false,
    customTitle: "",
    customDescription: ""
  });
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [generatedCustomReport, setGeneratedCustomReport] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('pdf'); // 'pdf' or 'excel'

  // Report Scheduling State
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    name: '',
    description: '',
    reportType: 'pdf',
    reportCategory: 'overview',
    customFields: [],
    filters: {},
    frequency: 'daily',
    time: '09:00',
    dayOfWeek: 'monday',
    dayOfMonth: 1,
    emailRecipients: '',
    isActive: true
  });

  // Load report templates and scheduled reports on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await axios.get(route('admin.reports.templates'));
        setReportTemplates(response.data.templates);
      } catch (error) {
        console.error('Error loading report templates:', error);
      }
    };
    loadTemplates();
    loadScheduledReports();
  }, []);

  // Update available fields when category changes
  useEffect(() => {
    const fields = {
      'overview': ['patients', 'appointments', 'programs', 'services', 'staff', 'medical'],
      'patients': ['firstname', 'lastname', 'gender', 'birth', 'address', 'contactno', 'email'],
      'appointments': ['date', 'time', 'status', 'service.servicename', 'user.firstname', 'user.lastname', 'notes'],
      'programs': ['program_name', 'description', 'date', 'start_time', 'end_time', 'location', 'slots'],
      'services': ['servicename', 'description', 'subservices', 'appointment_count'],
      'staff': ['firstname', 'lastname', 'role.rolename', 'status', 'email', 'contactno'],
      'medical': ['patient.firstname', 'patient.lastname', 'doctor.firstname', 'doctor.lastname', 'diagnosis', 'treatment'],
      'custom': ['patient_registrations', 'appointment_completions', 'service_usage', 'staff_performance']
    };
    setAvailableFields(fields[reportCategory] || []);
  }, [reportCategory]);

  // Helper functions
  const getStatusColor = (status) => {
    // Normalize status to string and lowercase for comparison
    const statusStr = String(status).toLowerCase();
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'canceled': 'bg-red-100 text-red-800',
      'no-show': 'bg-gray-100 text-gray-800',
      'no_show': 'bg-gray-100 text-gray-800',
      '5': 'bg-green-100 text-green-800', // Completed (numeric)
      '1': 'bg-yellow-100 text-yellow-800', // Pending (numeric)
      '2': 'bg-blue-100 text-blue-800', // Confirmed (numeric)
      '3': 'bg-red-100 text-red-800', // Cancelled (numeric)
      '4': 'bg-gray-100 text-gray-800', // No-show (numeric)
    };
    return colors[statusStr] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    // Normalize status to string and lowercase for comparison
    const statusStr = String(status).toLowerCase();
    const icons = {
      'pending': <Clock className="h-4 w-4" />,
      'confirmed': <CheckCircle className="h-4 w-4" />,
      'completed': <CheckCircle className="h-4 w-4" />,
      'cancelled': <XCircle className="h-4 w-4" />,
      'canceled': <XCircle className="h-4 w-4" />,
      'no-show': <AlertCircle className="h-4 w-4" />,
      'no_show': <AlertCircle className="h-4 w-4" />,
      '5': <CheckCircle className="h-4 w-4" />, // Completed (numeric)
      '1': <Clock className="h-4 w-4" />, // Pending (numeric)
      '2': <CheckCircle className="h-4 w-4" />, // Confirmed (numeric)
      '3': <XCircle className="h-4 w-4" />, // Cancelled (numeric)
      '4': <AlertCircle className="h-4 w-4" />, // No-show (numeric)
    };
    return icons[statusStr] || <Clock className="h-4 w-4" />;
  };

  // Helper function to format status text
  const formatStatusText = (status) => {
    const statusStr = String(status).toLowerCase();
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'canceled': 'Cancelled',
      'no-show': 'No Show',
      'no_show': 'No Show',
      '5': 'Completed',
      '1': 'Pending',
      '2': 'Confirmed',
      '3': 'Cancelled',
      '4': 'No Show',
    };
    return statusMap[statusStr] || String(status);
  };

  const handleDateRangeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    const now = new Date();
    let start, end;

    switch (newTimeframe) {
      case 'today':
        start = end = format(now, 'yyyy-MM-dd');
        break;
      case 'thisWeek':
        start = format(new Date(now.setDate(now.getDate() - now.getDay())), 'yyyy-MM-dd');
        end = format(new Date(now.setDate(now.getDate() - now.getDay() + 6)), 'yyyy-MM-dd');
        break;
      case 'thisMonth':
        start = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
        end = format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd');
        break;
      case 'lastMonth':
        start = format(new Date(now.getFullYear(), now.getMonth() - 1, 1), 'yyyy-MM-dd');
        end = format(new Date(now.getFullYear(), now.getMonth(), 0), 'yyyy-MM-dd');
        break;
      case 'thisYear':
        start = format(new Date(now.getFullYear(), 0, 1), 'yyyy-MM-dd');
        end = format(new Date(now.getFullYear(), 11, 31), 'yyyy-MM-dd');
        break;
      default:
        return;
    }

    setSelectedDateRange({ start, end });
    router.get(route('admin.reports'), { start_date: start, end_date: end });
  };

  const handleExport = async (type) => {
    try {
      const response = await axios.post(route('admin.reports.generate'), {
        report_type: type,
        report_category: 'overview',
        date_range: selectedDateRange,
        custom_fields: [],
        filters: {}
      });

      if (response.data.success) {
        showToast(
          "Success!",
          `${type.toUpperCase()} report generated successfully`,
          "success",
          "create"
        );
        
        // Trigger download
        const link = document.createElement('a');
        link.href = response.data.download_url || '#';
        link.download = `admin_report_${type}_${new Date().toISOString().split('T')[0]}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        showToast(
          "Error",
          response.data.message || "Failed to generate report",
          "error"
        );
      }
    } catch (error) {
      console.error('Error generating report:', error);
      showToast(
        "Error",
        "Failed to generate report. Please try again.",
        "error"
      );
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(route('admin.reports.generate'), {
        report_type: reportType,
        report_category: reportCategory,
        date_range: selectedDateRange,
        custom_fields: customFields,
        filters: filters
      });

      if (response.data.success) {
        showToast(
          "Success!",
          response.data.message,
          "success",
          "create"
        );
        setIsGenerateDialogOpen(false);
        
        // In a real implementation, you would trigger a download here
        console.log('Report generated:', response.data);
      } else {
        showToast(
          "Error",
          response.data.message || "Failed to generate report",
          "error"
        );
      }
    } catch (error) {
      console.error('Error generating report:', error);
      showToast(
        "Error",
        error.response?.data?.message || "Failed to generate report",
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setReportCategory(template.category);
    setCustomFields(template.fields);
  };

  const handleFieldToggle = (field) => {
    setCustomFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Scheduling Functions
  const handleScheduleReport = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post(route('admin.reports.schedule'), {
        ...scheduleData,
        dateRange: selectedDateRange
      });

      if (response.data.success) {
        showToast(
          "Success!",
          "Report scheduled successfully!",
          "success",
          "create"
        );
        setIsScheduleDialogOpen(false);
        loadScheduledReports();
      } else {
        showToast(
          "Error",
          response.data.message || "Failed to schedule report",
          "error"
        );
      }
    } catch (error) {
      console.error('Error scheduling report:', error);
      showToast(
        "Error",
        error.response?.data?.message || "Failed to schedule report",
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const loadScheduledReports = async () => {
    try {
      const response = await axios.get(route('admin.reports.scheduled'));
      setScheduledReports(response.data.scheduledReports || []);
    } catch (error) {
      console.error('Error loading scheduled reports:', error);
    }
  };

  const handleScheduleDataChange = (key, value) => {
    setScheduleData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggleSchedule = async (scheduleId, isActive) => {
    try {
      const response = await axios.post(route('admin.reports.toggle-schedule'), {
        scheduleId,
        isActive
      });

      if (response.data.success) {
        showToast(
          "Success!",
          `Report schedule ${isActive ? 'activated' : 'deactivated'} successfully!`,
          "success",
          "update"
        );
        loadScheduledReports();
      }
    } catch (error) {
      console.error('Error toggling schedule:', error);
      showToast(
        "Error",
        "Failed to update schedule",
        "error"
      );
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await axios.delete(route('admin.reports.delete-schedule', { id: scheduleId }));

      if (response.data.success) {
        showToast(
          "Success!",
          "Scheduled report deleted successfully!",
          "success",
          "delete"
        );
        loadScheduledReports();
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      showToast(
        "Error",
        "Failed to delete schedule",
        "error"
      );
    }
  };

  // Download Custom Report as PDF or Excel
  const downloadCustomReport = async (format = 'pdf') => {
    if (!customReportConfig.includeOverview && 
        !customReportConfig.includePatients && 
        !customReportConfig.includeAppointments && 
        !customReportConfig.includePrograms && 
        !customReportConfig.includeServices) {
      showToast(
        "Warning",
        "Please select at least one report type to include",
        "warning"
      );
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Build query parameters for custom report
      const params = new URLSearchParams();
      params.append('format', format);
      params.append('custom_report', 'true');
      
      // Add selected report types
      const includeTypes = [];
      if (customReportConfig.includeOverview) {
        includeTypes.push('overview');
      }
      if (customReportConfig.includePatients) {
        includeTypes.push('patients');
      }
      if (customReportConfig.includeAppointments) {
        includeTypes.push('appointments');
      }
      if (customReportConfig.includePrograms) {
        includeTypes.push('programs');
      }
      if (customReportConfig.includeServices) {
        includeTypes.push('services');
      }

      includeTypes.forEach(type => {
        params.append('include_types[]', type);
      });
      
      // Add custom report details
      if (customReportConfig.customTitle) {
        params.append('custom_title', customReportConfig.customTitle);
      }
      if (customReportConfig.customDescription) {
        params.append('custom_description', customReportConfig.customDescription);
      }
      
      // Add date range
      params.append('start_date', selectedDateRange.start);
      params.append('end_date', selectedDateRange.end);
      
      // Use axios to download the file with proper response type
      const response = await axios({
        url: route('admin.reports.custom') + '?' + params.toString(),
        method: 'GET',
        responseType: 'blob', // Important for binary files
        headers: {
          'Accept': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        validateStatus: function (status) {
          // Accept status codes less than 500
          return status < 500;
        }
      });
      
      // Check response status - if error, try to parse JSON from blob
      if (response.status !== 200) {
        // Response might be a JSON error in blob format
        try {
          const text = await response.data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || errorData.error || `Server returned status ${response.status}`);
        } catch (parseError) {
          // If not JSON, throw generic error
          throw new Error(`Server returned status ${response.status}`);
        }
      }
      
      // Check if blob contains JSON error (check content type or size)
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json') || response.data.size < 100) {
        // Likely an error response, try to parse
        try {
          const text = await response.data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || errorData.error || 'Failed to generate report');
        } catch (parseError) {
          // If parsing fails, continue with download
        }
      }
      
      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Verify blob is not empty
      if (blob.size === 0) {
        throw new Error('Received empty file from server');
      }
      
      // Create a temporary URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename based on selected report types
      const dateStr = `${selectedDateRange.start}_to_${selectedDateRange.end}`;
      const selectedTypes = [];
      if (customReportConfig.includeOverview) selectedTypes.push('overview');
      if (customReportConfig.includePatients) selectedTypes.push('patients');
      if (customReportConfig.includeAppointments) selectedTypes.push('appointments');
      if (customReportConfig.includePrograms) selectedTypes.push('programs');
      if (customReportConfig.includeServices) selectedTypes.push('services');
      
      let filename;
      if (selectedTypes.length === 1) {
        // Single report type - use specific name
        const typeNames = {
          'overview': 'overview_report',
          'patients': 'patients_report',
          'appointments': 'appointments_report',
          'programs': 'health_programs_report',
          'services': 'services_report',
        };
        const reportName = typeNames[selectedTypes[0]] || 'custom_report';
        filename = `${reportName}_${dateStr}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      } else {
        // Multiple report types - use "custom_report"
        filename = `custom_report_${dateStr}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      }
      
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showToast(
        "Success!",
        `${format.toUpperCase()} report downloaded successfully!`,
        "success",
        "create"
      );
      
    } catch (error) {
      console.error('Error downloading custom report:', error);
      
      // Try to extract error message from blob if it's a JSON error
      let errorMessage = "Failed to download custom report";
      
      if (error.response && error.response.data) {
        try {
          // If response is a blob containing JSON error
          if (error.response.data instanceof Blob) {
            const text = await error.response.data.text();
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } catch (parseError) {
          // If parsing fails, use default message
          console.error('Error parsing error response:', parseError);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(
        "Error",
        errorMessage,
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Custom Report (similar to Pharmacist Reports)
  const generateCustomReport = async () => {
    if (!customReportConfig.includeOverview && 
        !customReportConfig.includePatients && 
        !customReportConfig.includeAppointments && 
        !customReportConfig.includePrograms && 
        !customReportConfig.includeServices) {
      showToast(
        "Warning",
        "Please select at least one report type to include",
        "warning"
      );
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Build query parameters for custom report
      const params = new URLSearchParams();
      params.append('format', 'json');
      params.append('custom_report', 'true');
      
      // Add selected report types
      const includeTypes = [];
      if (customReportConfig.includeOverview) {
        includeTypes.push('overview');
      }
      if (customReportConfig.includePatients) {
        includeTypes.push('patients');
      }
      if (customReportConfig.includeAppointments) {
        includeTypes.push('appointments');
      }
      if (customReportConfig.includePrograms) {
        includeTypes.push('programs');
      }
      if (customReportConfig.includeServices) {
        includeTypes.push('services');
      }

      includeTypes.forEach(type => {
        params.append('include_types[]', type);
      });
      
      // Add custom report details
      if (customReportConfig.customTitle) {
        params.append('custom_title', customReportConfig.customTitle);
      }
      if (customReportConfig.customDescription) {
        params.append('custom_description', customReportConfig.customDescription);
      }
      
      // Add date range
      params.append('start_date', selectedDateRange.start);
      params.append('end_date', selectedDateRange.end);
      
      const response = await axios.get(route('admin.reports.custom') + '?' + params.toString());
      
      if (response.data) {
        // Transform the data for display
        const reportData = {
          title: customReportConfig.customTitle || 'Custom Official Report',
          subtitle: `Generated on ${new Date().toLocaleString()}`,
          description: customReportConfig.customDescription || 'Comprehensive custom report with selected data sections',
          items: response.data.reportData || response.data,
          summary: response.data.analytics || {},
          customConfig: customReportConfig,
          filters: filters,
          generatedAt: new Date().toISOString()
        };
        
        setGeneratedCustomReport(reportData);
        showToast(
          "Success!",
          "Custom report generated successfully!",
          "success",
          "create"
        );
      }
      
    } catch (error) {
      console.error('Error generating custom report:', error);
      showToast(
        "Error",
        error.response?.data?.message || "Failed to generate custom report",
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
        {/* Header - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Reports
                </h1>
                <p className="text-gray-600 mt-1 font-medium">
                  Comprehensive analytics and reporting dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-gray-200 shadow-md">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div className="text-sm">
                <p className="font-semibold text-gray-700">Report Period</p>
                <p className="text-gray-600">
                  {format(new Date(selectedDateRange.start), 'MMM dd, yyyy')} - {format(new Date(selectedDateRange.end), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Schedule Report
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Generate Report</DialogTitle>
                  <DialogDescription>
                    Create a custom report with your selected data and filters.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Format</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            PDF Document
                          </div>
                        </SelectItem>
                        <SelectItem value="excel">
          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel Spreadsheet
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Report Category</Label>
                    <Select value={reportCategory} onValueChange={setReportCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Overview Report</SelectItem>
                        <SelectItem value="patients">Patient Report</SelectItem>
                        <SelectItem value="appointments">Appointment Report</SelectItem>
                        <SelectItem value="programs">Program Report</SelectItem>
                        <SelectItem value="services">Service Report</SelectItem>
                        <SelectItem value="staff">Staff Report</SelectItem>
                        <SelectItem value="medical">Medical Report</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={selectedDateRange.start}
                        onChange={(e) => setSelectedDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={selectedDateRange.end}
                        onChange={(e) => setSelectedDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>

                  {reportCategory !== 'overview' && (
                    <div className="space-y-2">
                      <Label>Select Fields to Include</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                        {availableFields.map((field) => (
                          <div key={field} className="flex items-center space-x-2">
                            <Checkbox
                              id={field}
                              checked={customFields.includes(field)}
                              onCheckedChange={() => handleFieldToggle(field)}
                            />
                            <Label htmlFor={field} className="text-sm">
                              {field.replace(/_/g, ' ').replace(/\./g, ' - ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reportCategory === 'patients' && (
                    <div className="space-y-2">
                      <Label>Filters</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select value={filters.gender || ''} onValueChange={(value) => handleFilterChange('gender', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="All genders" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All</SelectItem>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Age Range</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={filters.age_min || ''}
                              onChange={(e) => handleFilterChange('age_min', e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.age_max || ''}
                              onChange={(e) => handleFilterChange('age_max', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateReport} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCustomReportDialogOpen} onOpenChange={setIsCustomReportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Report Templates</DialogTitle>
                  <DialogDescription>
                    Choose from predefined report templates or create your own custom report.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              handleTemplateSelect(template);
                              setIsCustomReportDialogOpen(false);
                              setIsGenerateDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {template.fields.slice(0, 3).map((field) => (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {field.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                          {template.fields.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.fields.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCustomReportDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Schedule Report
                </DialogTitle>
                <DialogDescription>
                  Set up automatic report generation with custom frequency and email delivery.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduleName">Report Name</Label>
                      <Input
                        id="scheduleName"
                        value={scheduleData.name}
                        onChange={(e) => handleScheduleDataChange('name', e.target.value)}
                        placeholder="e.g., Weekly Patient Report"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduleDescription">Description</Label>
                      <Input
                        id="scheduleDescription"
                        value={scheduleData.description}
                        onChange={(e) => handleScheduleDataChange('description', e.target.value)}
                        placeholder="Brief description of the report"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Report Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Report Format</Label>
                      <Select value={scheduleData.reportType} onValueChange={(value) => handleScheduleDataChange('reportType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Report Category</Label>
                      <Select value={scheduleData.reportCategory} onValueChange={(value) => handleScheduleDataChange('reportCategory', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overview">Overview</SelectItem>
                          <SelectItem value="patients">Patients</SelectItem>
                          <SelectItem value="appointments">Appointments</SelectItem>
                          <SelectItem value="programs">Health Programs</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="medical">Medical Records</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schedule Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select value={scheduleData.frequency} onValueChange={(value) => handleScheduleDataChange('frequency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={scheduleData.time}
                        onChange={(e) => handleScheduleDataChange('time', e.target.value)}
                      />
                    </div>
                  </div>

                  {scheduleData.frequency === 'weekly' && (
                    <div className="space-y-2">
                      <Label>Day of Week</Label>
                      <Select value={scheduleData.dayOfWeek} onValueChange={(value) => handleScheduleDataChange('dayOfWeek', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {scheduleData.frequency === 'monthly' && (
                    <div className="space-y-2">
                      <Label>Day of Month</Label>
                      <Select value={scheduleData.dayOfMonth.toString()} onValueChange={(value) => handleScheduleDataChange('dayOfMonth', parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                            <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Email Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="emailRecipients">Email Recipients</Label>
                    <Input
                      id="emailRecipients"
                      value={scheduleData.emailRecipients}
                      onChange={(e) => handleScheduleDataChange('emailRecipients', e.target.value)}
                      placeholder="admin@example.com, manager@example.com"
                    />
                    <p className="text-sm text-gray-500">Separate multiple emails with commas</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={scheduleData.isActive}
                    onCheckedChange={(checked) => handleScheduleDataChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Active Schedule</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScheduleReport} disabled={isGenerating}>
                  {isGenerating ? 'Scheduling...' : 'Schedule Report'}
                </Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleExport('pdf')}
            >
              <Download className="h-4 w-4" />
              <span>Quick PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleExport('excel')}
            >
              <FileText className="h-4 w-4" />
              <span>Quick Excel</span>
            </Button> */}
            {/* <Select value={timeframe} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </motion.div>

        {/* Reports Customization Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 border-0 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white">
                      Reports Customization
                    </CardTitle>
                    <p className="text-blue-100 text-base">
                      Create custom reports by selecting multiple report types
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomConfig(!showCustomConfig)}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  <Settings className="h-4 w-4" />
                  {showCustomConfig ? 'Hide' : 'Show'} Customization
                </Button>
              </div>
            </CardHeader>
            {showCustomConfig && (
              <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="space-y-6">
                  {/* Report Type Selection */}
                  <div>
                    <Label className="text-lg font-bold text-gray-800 mb-4 block flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Select Report Types to Include
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                      >
                        <Checkbox
                          id="includeOverview"
                          checked={customReportConfig.includeOverview}
                          onCheckedChange={(checked) =>
                            setCustomReportConfig({
                              ...customReportConfig,
                              includeOverview: checked
                            })
                          }
                        />
                        <Label htmlFor="includeOverview" className="text-sm font-semibold cursor-pointer text-gray-700">
                          Overview Report
                        </Label>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                      >
                        <Checkbox
                          id="includePatients"
                          checked={customReportConfig.includePatients}
                          onCheckedChange={(checked) =>
                            setCustomReportConfig({
                              ...customReportConfig,
                              includePatients: checked
                            })
                          }
                        />
                        <Label htmlFor="includePatients" className="text-sm font-semibold cursor-pointer text-gray-700">
                          Patients Report
                        </Label>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
                      >
                        <Checkbox
                          id="includeAppointments"
                          checked={customReportConfig.includeAppointments}
                          onCheckedChange={(checked) =>
                            setCustomReportConfig({
                              ...customReportConfig,
                              includeAppointments: checked
                            })
                          }
                        />
                        <Label htmlFor="includeAppointments" className="text-sm font-semibold cursor-pointer text-gray-700">
                          Appointments Report
                        </Label>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                      >
                        <Checkbox
                          id="includePrograms"
                          checked={customReportConfig.includePrograms}
                          onCheckedChange={(checked) =>
                            setCustomReportConfig({
                              ...customReportConfig,
                              includePrograms: checked
                            })
                          }
                        />
                        <Label htmlFor="includePrograms" className="text-sm font-semibold cursor-pointer text-gray-700">
                          Health Programs Report
                        </Label>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                      >
                        <Checkbox
                          id="includeServices"
                          checked={customReportConfig.includeServices}
                          onCheckedChange={(checked) =>
                            setCustomReportConfig({
                              ...customReportConfig,
                              includeServices: checked
                            })
                          }
                        />
                        <Label htmlFor="includeServices" className="text-sm font-semibold cursor-pointer text-gray-700">
                          Services Report
                        </Label>
                      </motion.div>
                    </div>
                  </div>

                  {/* Custom Title and Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customTitle">Custom Report Title (Optional)</Label>
                      <Input
                        id="customTitle"
                        placeholder="e.g., Monthly Comprehensive Report"
                        value={customReportConfig.customTitle}
                        onChange={(e) =>
                          setCustomReportConfig({
                            ...customReportConfig,
                            customTitle: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customDescription">Custom Description (Optional)</Label>
                      <Input
                        id="customDescription"
                        placeholder="Brief description of the report"
                        value={customReportConfig.customDescription}
                        onChange={(e) =>
                          setCustomReportConfig({
                            ...customReportConfig,
                            customDescription: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Download Format Selection */}
                  <div className="space-y-4">
                    <Label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Download className="h-5 w-5 text-blue-600" />
                      Download Format
                    </Label>
                    <div className="flex items-center gap-6">
                      <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        htmlFor="format-pdf"
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          downloadFormat === 'pdf' 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          id="format-pdf"
                          name="downloadFormat"
                          value="pdf"
                          checked={downloadFormat === 'pdf'}
                          onChange={(e) => setDownloadFormat(e.target.value)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <FileText className={`h-5 w-5 ${downloadFormat === 'pdf' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-sm font-semibold ${downloadFormat === 'pdf' ? 'text-blue-700' : 'text-gray-700'}`}>
                          PDF Document
                        </span>
                      </motion.label>
                      <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        htmlFor="format-excel"
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          downloadFormat === 'excel' 
                            ? 'border-green-500 bg-green-50 shadow-md' 
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          id="format-excel"
                          name="downloadFormat"
                          value="excel"
                          checked={downloadFormat === 'excel'}
                          onChange={(e) => setDownloadFormat(e.target.value)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500"
                        />
                        <FileSpreadsheet className={`h-5 w-5 ${downloadFormat === 'excel' ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-sm font-semibold ${downloadFormat === 'excel' ? 'text-green-700' : 'text-gray-700'}`}>
                          Excel Spreadsheet
                        </span>
                      </motion.label>
                    </div>
                  </div>

                  {/* Generate and Download Buttons */}
                  <div className="flex items-center justify-end gap-4 pt-6 border-t-2 border-gray-200">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCustomConfig(false);
                          setCustomReportConfig({
                            includeOverview: false,
                            includePatients: false,
                            includeAppointments: false,
                            includePrograms: false,
                            includeServices: false,
                            customTitle: "",
                            customDescription: ""
                          });
                          setGeneratedCustomReport(null);
                        }}
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-semibold px-6 py-2 rounded-xl"
                      >
                        <Repeat className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={generateCustomReport}
                        disabled={isGenerating}
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 font-semibold px-6 py-2 rounded-xl"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Report
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => downloadCustomReport(downloadFormat)}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download {downloadFormat.toUpperCase()}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 hidden">
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics - Enhanced Design */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide mb-2">Total Patients</p>
                        <p className="text-4xl font-extrabold text-white mb-2">{patientData?.total || 0}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <TrendingUp className="h-4 w-4 text-blue-200" />
                          <p className="text-xs font-medium text-blue-100">
                            {patientData?.new || 0} new this period
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-100 uppercase tracking-wide mb-2">Appointments</p>
                        <p className="text-4xl font-extrabold text-white mb-2">{appointmentData?.total || 0}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle className="h-4 w-4 text-green-200" />
                          <p className="text-xs font-medium text-green-100">
                            {appointmentData?.completion_rate || 0}% completion rate
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <Calendar className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide mb-2">Health Programs</p>
                        <p className="text-4xl font-extrabold text-white mb-2">{programData?.total || 0}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Activity className="h-4 w-4 text-purple-200" />
                          <p className="text-xs font-medium text-purple-100">
                            {programData?.activePrograms || 0} active programs
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <HeartPulse className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide mb-2">Active Services</p>
                        <p className="text-4xl font-extrabold text-white mb-2">{serviceData?.activeServices || 0}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <BarChart3 className="h-4 w-4 text-orange-200" />
                          <p className="text-xs font-medium text-orange-100">
                            {serviceData?.subservices || 0} sub-services
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <Stethoscope className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Patient Growth Chart - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Patient Registration Trends
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Monthly patient registration growth over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line
                      data={{
                        labels: patientData?.monthlyTrend ? Object.keys(patientData.monthlyTrend) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [
                          {
                            label: 'New Patients 2025',
                            data: patientData?.monthlyTrend ? Object.values(patientData.monthlyTrend) : [12, 19, 15, 25, 22, 30],
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            pointBackgroundColor: 'rgb(59, 130, 246)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top',
                            labels: {
                              usePointStyle: true,
                              padding: 15,
                              font: {
                                size: 12,
                                weight: '500'
                              }
                            }
                          },
                          tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            cornerRadius: 8,
                            titleFont: {
                              size: 13,
                              weight: 'bold'
                            },
                            bodyFont: {
                              size: 12
                            },
                            callbacks: {
                              label: function(context) {
                                return ` ${context.dataset.label}: ${context.parsed.y} patients`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                              drawBorder: false
                            },
                            ticks: {
                              font: {
                                size: 11
                              },
                              callback: function(value) {
                                return value;
                              }
                            }
                          },
                          x: {
                            grid: {
                              display: false,
                              drawBorder: false
                            },
                            ticks: {
                              font: {
                                size: 11
                              }
                            }
                          }
                        },
                        interaction: {
                          mode: 'nearest',
                          axis: 'x',
                          intersect: false
                        }
                      }}
                    />
                  </div>
                  {patientData?.growth && (
                    <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                      {patientData.growth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        patientData.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {patientData.growth >= 0 ? '+' : ''}{patientData.growth}% growth this period
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats Grid - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Patient Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <span className="text-sm font-semibold text-gray-700">Male</span>
                        <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-bold">{patientData?.demographics?.male || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-pink-50 rounded-xl border border-pink-100">
                        <span className="text-sm font-semibold text-gray-700">Female</span>
                        <Badge className="bg-pink-600 text-white px-3 py-1 text-sm font-bold">{patientData?.demographics?.female || 0}</Badge>
                      </div>
                      {(patientData?.demographics?.other || 0) > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">Other</span>
                          <Badge variant="secondary" className="px-3 py-1 text-sm font-bold">{patientData?.demographics?.other || 0}</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50">
                  <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200">
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Appointment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {appointmentData?.statusDistribution && Object.keys(appointmentData.statusDistribution).length > 0 ? 
                        Object.entries(appointmentData.statusDistribution).map(([status, count]) => (
                          <motion.div 
                            key={status} 
                            whileHover={{ x: 4 }}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(status)}
                              <span className="text-sm font-semibold text-gray-700">{formatStatusText(status)}</span>
                            </div>
                            <Badge className={getStatusColor(status) + " px-3 py-1 text-sm font-bold"}>{count}</Badge>
                          </motion.div>
                        )) : (
                          <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-500">No appointment data available</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting the date range</p>
                          </div>
                        )
                      }
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-violet-100 border-b border-purple-200">
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-purple-600" />
                      Staff Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <span className="text-sm font-semibold text-gray-700">Doctors</span>
                        <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-bold">{staffData?.staffCounts?.doctors || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100">
                        <span className="text-sm font-semibold text-gray-700">Pharmacists</span>
                        <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-bold">{staffData?.staffCounts?.pharmacists || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-100">
                        <span className="text-sm font-semibold text-gray-700">Admins</span>
                        <Badge className="bg-purple-600 text-white px-3 py-1 text-sm font-bold">{staffData?.staffCounts?.admins || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                        <span className="text-sm font-semibold text-gray-700">Active Staff</span>
                        <Badge className="bg-emerald-600 text-white px-3 py-1 text-sm font-bold">{staffData?.staffCounts?.activeStaff || 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Detailed Sections - All Data in Overview */}
            <div className="space-y-8 mt-8">
              {/* Patients Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-white mb-1">
                            Patients Overview
                          </CardTitle>
                          <CardDescription className="text-blue-100">
                            Comprehensive patient demographics and statistics
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{patientData?.total || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Total Patients</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{patientData?.demographics?.male || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Male</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{patientData?.demographics?.female || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-pink-100">Female</p>
                      </motion.div>
                    </div>
                    {patientData?.demographics?.other > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 flex justify-center"
                      >
                        <div className="text-center p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300">
                          <p className="text-2xl font-bold text-gray-700">{patientData.demographics.other}</p>
                          <p className="text-sm font-medium text-gray-600 mt-1">Other</p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Appointments Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 via-green-700 to-teal-800 border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-white mb-1">
                            Appointments Overview
                          </CardTitle>
                          <CardDescription className="text-green-100">
                            Appointment statistics and performance metrics
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{appointmentData?.total || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-green-100">Total Appointments</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{appointmentData?.completed || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Completed</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{appointmentData?.completion_rate || 0}%</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-purple-100">Completion Rate</p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Health Programs Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-600 via-violet-700 to-indigo-800 border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                          <HeartPulse className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-white mb-1">
                            Health Programs Overview
                          </CardTitle>
                          <CardDescription className="text-purple-100">
                            Program statistics and enrollment information
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{programData?.total || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-purple-100">Total Programs</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{programData?.activePrograms || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-green-100">Active Programs</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{programData?.total || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Total Enrollments</p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Services Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-amber-600 via-orange-700 to-red-700 border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                          <Stethoscope className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-white mb-1">
                            Services Overview
                          </CardTitle>
                          <CardDescription className="text-orange-100">
                            Service statistics and availability
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{serviceData?.total || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-orange-100">Total Services</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{serviceData?.activeServices || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-green-100">Active Services</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg text-white"
                      >
                        <p className="text-5xl font-extrabold mb-2">{serviceData?.subservices || 0}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Sub-services</p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Hidden Tabs - Keep for backward compatibility */}
          <TabsContent value="appointments" className="space-y-6 hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Total Appointments</span>
                      <span className="text-2xl font-bold text-green-600">{appointmentData?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Completed</span>
                      <span className="text-2xl font-bold text-blue-600">{appointmentData?.completed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Completion Rate</span>
                      <span className="text-2xl font-bold text-purple-600">{appointmentData?.completion_rate || 0}%</span>
                    </div>
            </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                  <CardTitle>Service Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointmentData?.serviceDistribution ? 
                      Object.entries(appointmentData.serviceDistribution).map(([service, count]) => (
                        <div key={service} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{service}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500">No service data available</p>
                      )
                    }
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Hidden Tabs - Keep for backward compatibility */}
          <TabsContent value="patients" className="hidden">
            <div></div>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6 hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Program Overview</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Total Programs</span>
                      <span className="text-2xl font-bold text-purple-600">{programData?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Active Programs</span>
                      <span className="text-2xl font-bold text-green-600">{programData?.activePrograms || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Total Enrollments</span>
                      <span className="text-2xl font-bold text-blue-600">{programData?.total || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enrollment by Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {programData?.enrollmentTrend ? 
                      Object.entries(programData.enrollmentTrend).map(([program, count]) => (
                        <div key={program} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{program}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500">No enrollment data available</p>
                      )
                    }
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6 hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Service Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Total Services</span>
                      <span className="text-2xl font-bold text-orange-600">{serviceData?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Active Services</span>
                      <span className="text-2xl font-bold text-green-600">{serviceData?.activeServices || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Sub-services</span>
                      <span className="text-2xl font-bold text-blue-600">{serviceData?.subservices || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                  <CardTitle>Popular Services</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                    {serviceData?.popularServices?.length > 0 ? 
                      serviceData.popularServices.map((service, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{service.servicename}</span>
                          <Badge variant="outline">{service.count}</Badge>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500">No service usage data available</p>
                      )
                    }
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Staff Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Total Staff</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {(staffData?.staffCounts?.doctors || 0) + (staffData?.staffCounts?.pharmacists || 0) + (staffData?.staffCounts?.admins || 0)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-blue-600">{staffData?.staffCounts?.doctors || 0}</p>
                        <p className="text-xs text-gray-600">Doctors</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-green-600">{staffData?.staffCounts?.pharmacists || 0}</p>
                        <p className="text-xs text-gray-600">Pharmacists</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-purple-600">{staffData?.staffCounts?.admins || 0}</p>
                        <p className="text-xs text-gray-600">Admins</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                  <CardTitle>Staff Status</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Active Staff</span>
                      <span className="text-2xl font-bold text-green-600">{staffData?.staffCounts?.activeStaff || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Inactive Staff</span>
                      <span className="text-2xl font-bold text-red-600">{staffData?.staffCounts?.inactiveStaff || 0}</span>
                    </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="medical" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Total Records</span>
                      <span className="text-2xl font-bold text-blue-600">{medicalData?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Records This Period</span>
                      <span className="text-2xl font-bold text-green-600">{medicalData?.period || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Total Prescriptions</span>
                      <span className="text-2xl font-bold text-purple-600">{medicalData?.totalPrescriptions || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                  <CardTitle>Common Diagnoses</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                    {medicalData?.commonDiagnoses ? 
                      Object.entries(medicalData.commonDiagnoses).slice(0, 5).map(([diagnosis, count]) => (
                        <div key={diagnosis} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{diagnosis}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500">No diagnosis data available</p>
                      )
                    }
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Scheduled Reports Tab */}
          <TabsContent value="scheduled" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Scheduled Reports</h2>
                  <p className="text-gray-600 mt-1">
                    Manage your automated report generation schedules
                  </p>
                </div>
                <Button 
                  onClick={() => setIsScheduleDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Schedule New Report
                </Button>
              </div>

              {/* Scheduled Reports List */}
              <div className="grid gap-4">
                {scheduledReports.length > 0 ? (
                  scheduledReports.map((schedule) => (
                    <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {schedule.name}
                              </h3>
                              <Badge 
                                className={schedule.isActive 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                                }
                              >
                                {schedule.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{schedule.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Type:</span>
                                <span className="ml-2 font-medium capitalize">{schedule.reportType}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Category:</span>
                                <span className="ml-2 font-medium capitalize">{schedule.reportCategory}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Frequency:</span>
                                <span className="ml-2 font-medium capitalize">{schedule.frequency}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Time:</span>
                                <span className="ml-2 font-medium">{schedule.time}</span>
                              </div>
                            </div>

                            {schedule.emailRecipients && (
                              <div className="mt-3">
                                <span className="text-gray-500 text-sm">Recipients:</span>
                                <span className="ml-2 text-sm text-gray-700">{schedule.emailRecipients}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleSchedule(schedule.id, !schedule.isActive)}
                              className={schedule.isActive 
                                ? "text-orange-600 hover:text-orange-700" 
                                : "text-green-600 hover:text-green-700"
                              }
                            >
                              {schedule.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Scheduled Reports
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You haven't scheduled any reports yet. Create your first scheduled report to get started.
                      </p>
                      <Button 
                        onClick={() => setIsScheduleDialogOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Schedule Your First Report
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Reports;
