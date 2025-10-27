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
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no-show': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <Clock className="h-4 w-4" />,
      'confirmed': <CheckCircle className="h-4 w-4" />,
      'completed': <CheckCircle className="h-4 w-4" />,
      'cancelled': <XCircle className="h-4 w-4" />,
      'no-show': <AlertCircle className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
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

  return (
    <AdminLayout>
      <div className="p-6 bg-background min-h-screen">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights and data analysis for RHU Calumpang
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Period: {format(new Date(selectedDateRange.start), 'MMM dd, yyyy')} - {format(new Date(selectedDateRange.end), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
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
                  {/* Report Type */}
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

                  {/* Report Category */}
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

                  {/* Date Range */}
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

                  {/* Custom Fields */}
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

                  {/* Filters */}
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

            {/* Schedule Report Dialog */}
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
                {/* Basic Information */}
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

                {/* Report Configuration */}
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

                {/* Schedule Configuration */}
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

                  {/* Conditional fields based on frequency */}
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

                {/* Email Configuration */}
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

                {/* Status */}
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
            </Button>
            <Select value={timeframe} onValueChange={handleDateRangeChange}>
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
            </Select>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="programs">Health Programs</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Patients</p>
                      <p className="text-3xl font-bold text-blue-900">{patientData?.total || 0}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {patientData?.new || 0} new in period
                      </p>
                    </div>
                    <Users className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Appointments</p>
                      <p className="text-3xl font-bold text-green-900">{appointmentData?.total || 0}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {appointmentData?.completion_rate || 0}% completion rate
                      </p>
                    </div>
                    <Calendar className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Health Programs</p>
                      <p className="text-3xl font-bold text-purple-900">{programData?.total || 0}</p>
                      <p className="text-xs text-purple-600 mt-1">
                        {programData?.total || 0} enrollments
                      </p>
                    </div>
                    <HeartPulse className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Active Services</p>
                      <p className="text-3xl font-bold text-orange-900">{serviceData?.activeServices || 0}</p>
                      <p className="text-xs text-orange-600 mt-1">
                        {serviceData?.subservices || 0} sub-services
                      </p>
                    </div>
                    <Stethoscope className="h-12 w-12 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Patient Growth Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Patient Registration Trends
                  </CardTitle>
                  <CardDescription>
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

            {/* Quick Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Patient Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Male</span>
                      <Badge variant="secondary">{patientData?.demographics?.male || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Female</span>
                      <Badge variant="secondary">{patientData?.demographics?.female || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Other</span>
                      <Badge variant="secondary">{patientData?.demographics?.other || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Appointment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointmentData?.statusDistribution ? 
                      Object.entries(appointmentData.statusDistribution).map(([status, count]) => (
                        <div key={status} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <span className="text-sm text-gray-600 capitalize">{status}</span>
                          </div>
                          <Badge className={getStatusColor(status)}>{count}</Badge>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500">No appointment data</p>
                      )
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Staff Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Doctors</span>
                      <Badge variant="secondary">{staffData?.staffCounts?.doctors || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pharmacists</span>
                      <Badge variant="secondary">{staffData?.staffCounts?.pharmacists || 0}</Badge>
                  </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Admins</span>
                      <Badge variant="secondary">{staffData?.staffCounts?.admins || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Staff</span>
                      <Badge className="bg-green-100 text-green-800">{staffData?.staffCounts?.activeStaff || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Patient Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Total Patients</span>
                      <span className="text-2xl font-bold text-blue-600">{patientData?.total || 0}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{patientData?.demographics?.male || 0}</p>
                        <p className="text-sm text-gray-600">Male</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-pink-600">{patientData?.demographics?.female || 0}</p>
                        <p className="text-sm text-gray-600">Female</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patientData?.ageGroups ? 
                      Object.entries(patientData.ageGroups).map(([ageGroup, count]) => (
                        <div key={ageGroup} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{ageGroup}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500">No age data available</p>
                      )
                    }
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
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

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-6">
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

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
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
