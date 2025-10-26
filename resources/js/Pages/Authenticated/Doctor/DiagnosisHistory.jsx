import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { Button } from '@/components/tempo/components/ui/button';
import { Badge } from '@/components/tempo/components/ui/badge';
import { Input } from '@/components/tempo/components/ui/input';
import { Textarea } from '@/components/tempo/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/tempo/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/tempo/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { 
    Stethoscope, 
    Search, 
    Filter,
    Calendar,
    User,
    FileText,
    Eye,
    Edit,
    Archive,
    ArchiveRestore,
    Plus,
    ArrowLeft,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Printer
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiagnosisHistory({ diagnoses, patients, services }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [patientFilter, setPatientFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        diagnosis: '',
        symptoms: '',
        treatment_plan: '',
        assessment: '',
        pertinent_findings: '',
        status: ''
    });

    // Filter diagnoses based on search and filters
    const filteredDiagnoses = diagnoses.filter(diagnosis => {
        const matchesSearch = searchTerm === "" || 
            diagnosis.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            diagnosis.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            diagnosis.symptoms?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || diagnosis.status === statusFilter;
        const matchesPatient = patientFilter === "all" || diagnosis.patient_id === patientFilter;
        
        // Date filter logic
        let matchesDate = true;
        if (dateFilter !== "all") {
            const diagnosisDate = new Date(diagnosis.created_at);
            const today = new Date();
            
            switch (dateFilter) {
                case "today":
                    matchesDate = diagnosisDate.toDateString() === today.toDateString();
                    break;
                case "week":
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = diagnosisDate >= weekAgo;
                    break;
                case "month":
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = diagnosisDate >= monthAgo;
                    break;
            }
        }

        return matchesSearch && matchesStatus && matchesPatient && matchesDate;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredDiagnoses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDiagnoses = filteredDiagnoses.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, patientFilter, dateFilter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Modal handlers
    const openViewModal = (diagnosis) => {
        setSelectedDiagnosis(diagnosis);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedDiagnosis(null);
    };

    const openEditModal = (diagnosis) => {
        setSelectedDiagnosis(diagnosis);
        setEditForm({
            diagnosis: diagnosis.diagnosis || '',
            symptoms: diagnosis.symptoms || '',
            treatment_plan: diagnosis.treatment_plan || '',
            assessment: diagnosis.assessment || diagnosis.notes || '',
            pertinent_findings: diagnosis.pertinent_findings || '',
            status: diagnosis.status || 'active'
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedDiagnosis(null);
        setEditForm({
            diagnosis: '',
            symptoms: '',
            treatment_plan: '',
            assessment: '',
            pertinent_findings: '',
            status: ''
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        router.post(route('doctor.diagnosis.update', selectedDiagnosis.id), editForm, {
            onSuccess: () => {
                toast.success('Diagnosis updated successfully!');
                closeEditModal();
            },
            onError: (errors) => {
                console.error('Update errors:', errors);
                toast.error('Failed to update diagnosis. Please try again.');
            }
        });
    };

    const handleArchiveToggle = (diagnosis) => {
        const newStatus = diagnosis.status === 'archived' ? 'active' : 'archived';
        router.post(route('doctor.diagnosis.update', diagnosis.id), {
            status: newStatus
        }, {
            onSuccess: () => {
                toast.success(newStatus === 'archived' ? 'Diagnosis archived successfully!' : 'Diagnosis unarchived successfully!');
            },
            onError: (errors) => {
                console.error('Archive error:', errors);
                toast.error('Failed to update diagnosis status. Please try again.');
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
            case 'completed':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
            case 'follow_up':
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Follow-up Required</Badge>;
            case 'archived':
                return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Archived</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
        }
    };

    const printDiagnosisSummary = (diagnosis) => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Diagnosis Summary - ${diagnosis.patient_name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        line-height: 1.6;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #2563eb;
                        margin: 0;
                        font-size: 24px;
                    }
                    .header h2 {
                        color: #6b7280;
                        margin: 5px 0 0 0;
                        font-size: 16px;
                        font-weight: normal;
                    }
                    .section {
                        margin-bottom: 25px;
                        padding: 15px;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        background-color: #f9fafb;
                    }
                    .section h3 {
                        color: #2563eb;
                        margin: 0 0 15px 0;
                        font-size: 18px;
                        border-bottom: 1px solid #d1d5db;
                        padding-bottom: 8px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .info-item {
                        margin-bottom: 10px;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #374151;
                        margin-bottom: 5px;
                    }
                    .info-value {
                        color: #111827;
                        padding: 8px;
                        background-color: white;
                        border-radius: 4px;
                        border: 1px solid #d1d5db;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    .status-active {
                        background-color: #dcfce7;
                        color: #166534;
                    }
                    .status-completed {
                        background-color: #dbeafe;
                        color: #1e40af;
                    }
                    .status-follow_up {
                        background-color: #fef3c7;
                        color: #92400e;
                    }
                    .status-archived {
                        background-color: #f3f4f6;
                        color: #6b7280;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #2563eb;
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>RHU Calumpang Management System</h1>
                    <h2>Diagnosis Summary Report</h2>
                </div>

                <div class="section">
                    <h3>Patient Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Patient Name</div>
                            <div class="info-value">${diagnosis.patient_name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Status</div>
                            <div class="info-value">
                                <span class="status-badge status-${diagnosis.status}">${diagnosis.status.replace('_', ' ')}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Date Created</div>
                            <div class="info-value">${formatDate(diagnosis.created_at)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Doctor</div>
                            <div class="info-value">Dr. ${diagnosis.doctor_name}</div>
                        </div>
                        ${diagnosis.doctor_license_number ? `
                        <div class="info-item">
                            <div class="info-label">License Number</div>
                            <div class="info-value">${diagnosis.doctor_license_number}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="section">
                    <h3>Medical Diagnosis</h3>
                    <div class="info-item">
                        <div class="info-label">Diagnosis</div>
                        <div class="info-value">${diagnosis.diagnosis}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Symptoms</div>
                        <div class="info-value">${diagnosis.symptoms}</div>
                    </div>
                </div>

                ${diagnosis.treatment_plan ? `
                <div class="section">
                    <h3>Treatment Plan</h3>
                    <div class="info-item">
                        <div class="info-value">${diagnosis.treatment_plan}</div>
                    </div>
                </div>
                ` : ''}

                ${diagnosis.assessment ? `
                <div class="section">
                    <h3>Assessment</h3>
                    <div class="info-item">
                        <div class="info-value">${diagnosis.assessment}</div>
                    </div>
                </div>
                ` : ''}

                ${diagnosis.pertinent_findings ? `
                <div class="section">
                    <h3>Pertinent Findings</h3>
                    <div class="info-item">
                        <div class="info-value">${diagnosis.pertinent_findings}</div>
                    </div>
                </div>
                ` : ''}

                <div class="footer">
                    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    <p>RHU Calumpang Management System - Diagnosis Summary</p>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <AdminLayout header="Diagnosis History">
            <Head title="Diagnosis History" />

            <div className="space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <Link href={route('doctor.home')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Diagnosis History</h1>
                            <p className="text-gray-600">View and manage patient diagnosis records</p>
                        </div>
                    </div>
                </motion.div>

                {/* Filters Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters & Search
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Search Bar */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Search Diagnoses</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search by patient name, diagnosis, symptoms, or treatment plan..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Search across patient names, diagnosis, symptoms, and treatment plans
                                    </p>
                                </div>

                                {/* Filter Controls */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Patient</label>
                                        <Select value={patientFilter} onValueChange={setPatientFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Patients" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Patients</SelectItem>
                                                {patients?.map((patient) => (
                                                    <SelectItem key={patient.id || patient.name} value={patient.id?.toString() || patient.name}>
                                                        {patient.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Status</label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="follow_up">Follow-up Required</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Date Range</label>
                                        <Select value={dateFilter} onValueChange={setDateFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Dates" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Dates</SelectItem>
                                                <SelectItem value="today">Today</SelectItem>
                                                <SelectItem value="week">Last 7 Days</SelectItem>
                                                <SelectItem value="month">Last 30 Days</SelectItem>
                                                <SelectItem value="year">Last Year</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Filter Summary */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="text-sm text-gray-600">
                                        Showing {filteredDiagnoses.length} of {diagnoses.length} diagnoses
                                        {(searchTerm || statusFilter !== "all" || patientFilter !== "all" || dateFilter !== "all") && (
                                            <span className="ml-2 text-blue-600">(filtered)</span>
                                        )}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setStatusFilter("all");
                                            setPatientFilter("all");
                                            setDateFilter("all");
                                        }}
                                        className="text-gray-600"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Diagnoses List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5" />
                                    Diagnosis Records ({filteredDiagnoses.length})
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {filteredDiagnoses.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="p-4 rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No diagnoses found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm || statusFilter !== "all" || patientFilter !== "all" || dateFilter !== "all"
                                            ? "Try adjusting your filters to see more results."
                                            : "Create your first diagnosis to get started."}
                                    </p>
                                    <Link href={route('doctor.home')}>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Diagnosis
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {paginatedDiagnoses.map((diagnosis, index) => (
                                        <motion.div
                                            key={diagnosis.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-2 rounded-lg bg-indigo-100">
                                                            <Stethoscope className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {diagnosis.diagnosis}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Patient: {diagnosis.patient_name}
                                                            </p>
                                                        </div>
                                                        {getStatusBadge(diagnosis.status)}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Symptoms</h4>
                                                            <p className="text-sm text-gray-600">{diagnosis.symptoms}</p>
                                                        </div>
                                                        {diagnosis.treatment_plan && (
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700 mb-1">Treatment Plan</h4>
                                                                <p className="text-sm text-gray-600">{diagnosis.treatment_plan}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {diagnosis.assessment && (
                                                        <div className="mb-4">
                                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Assessment</h4>
                                                            <p className="text-sm text-gray-600">{diagnosis.assessment}</p>
                                                        </div>
                                                    )}

                                                    {diagnosis.pertinent_findings && (
                                                        <div className="mb-4">
                                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Pertinent Findings</h4>
                                                            <p className="text-sm text-gray-600">{diagnosis.pertinent_findings}</p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(diagnosis.created_at)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            Dr. {diagnosis.doctor_name}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => openViewModal(diagnosis)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View Summary
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => openEditModal(diagnosis)}
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    {diagnosis.status === 'archived' ? (
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleArchiveToggle(diagnosis)}
                                                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                        >
                                                            <ArchiveRestore className="h-4 w-4 mr-1" />
                                                            Unarchive
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleArchiveToggle(diagnosis)}
                                                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                        >
                                                            <Archive className="h-4 w-4 mr-1" />
                                                            Archive
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredDiagnoses.length > itemsPerPage && (
                                <div className="flex items-center justify-between pt-6 border-t">
                                    <div className="text-sm text-gray-600">
                                        Showing {startIndex + 1} to {Math.min(endIndex, filteredDiagnoses.length)} of {filteredDiagnoses.length} diagnoses
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-8 h-8 p-0 ${
                                                        currentPage === page 
                                                            ? "bg-indigo-600 text-white" 
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* View Modal */}
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5" />
                                Diagnosis Summary
                            </DialogTitle>
                        </DialogHeader>
                        {selectedDiagnosis && (
                            <div className="space-y-4">
                                {/* Print Button */}
                                <div className="flex justify-end mb-4">
                                    <Button 
                                        onClick={() => printDiagnosisSummary(selectedDiagnosis)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print Summary
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Patient</label>
                                        <p className="text-sm text-gray-900">{selectedDiagnosis.patient_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Status</label>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedDiagnosis.status)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Diagnosis</label>
                                    <p className="text-sm text-gray-900 mt-1">{selectedDiagnosis.diagnosis}</p>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Symptoms</label>
                                    <p className="text-sm text-gray-900 mt-1">{selectedDiagnosis.symptoms}</p>
                                </div>
                                
                                {selectedDiagnosis.treatment_plan && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Treatment Plan</label>
                                        <p className="text-sm text-gray-900 mt-1">{selectedDiagnosis.treatment_plan}</p>
                                    </div>
                                )}
                                
                                {selectedDiagnosis.assessment && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Assessment</label>
                                        <p className="text-sm text-gray-900 mt-1">{selectedDiagnosis.assessment}</p>
                                    </div>
                                )}

                                {selectedDiagnosis.pertinent_findings && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Pertinent Findings</label>
                                        <p className="text-sm text-gray-900 mt-1">{selectedDiagnosis.pertinent_findings}</p>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Created</label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedDiagnosis.created_at)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Doctor</label>
                                        <p className="text-sm text-gray-900">Dr. {selectedDiagnosis.doctor_name}</p>
                                        {selectedDiagnosis.doctor_license_number && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                License Number: {selectedDiagnosis.doctor_license_number}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Edit Diagnosis
                            </DialogTitle>
                        </DialogHeader>
                        {selectedDiagnosis && (
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Patient</label>
                                        <p className="text-sm text-gray-900">{selectedDiagnosis.patient_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Status</label>
                                        <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="follow_up">Follow-up Required</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Diagnosis *</label>
                                    <Input
                                        value={editForm.diagnosis}
                                        onChange={(e) => setEditForm({...editForm, diagnosis: e.target.value})}
                                        placeholder="Enter diagnosis"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Symptoms *</label>
                                    <Textarea
                                        value={editForm.symptoms}
                                        onChange={(e) => setEditForm({...editForm, symptoms: e.target.value})}
                                        placeholder="Enter symptoms"
                                        rows={3}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Treatment Plan</label>
                                    <Textarea
                                        value={editForm.treatment_plan}
                                        onChange={(e) => setEditForm({...editForm, treatment_plan: e.target.value})}
                                        placeholder="Enter treatment plan"
                                        rows={3}
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Assessment</label>
                                    <Textarea
                                        value={editForm.assessment}
                                        onChange={(e) => setEditForm({...editForm, assessment: e.target.value})}
                                        placeholder="Enter assessment"
                                        rows={3}
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Pertinent Findings</label>
                                    <Textarea
                                        value={editForm.pertinent_findings}
                                        onChange={(e) => setEditForm({...editForm, pertinent_findings: e.target.value})}
                                        placeholder="Enter pertinent findings"
                                        rows={3}
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button type="button" variant="outline" onClick={closeEditModal}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Update Diagnosis
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
