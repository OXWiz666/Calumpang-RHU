import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    FileText,
    Download,
    Calendar,
    Filter,
    Search,
    Package,
    TrendingUp,
    AlertTriangle,
    Clock,
    BarChart3,
    Printer,
    Mail,
    XCircle,
    AlertCircle,
    Trash2,
    Shield,
    Building2,
    Users,
    FileSpreadsheet,
    Settings,
    CheckCircle,
    Star,
    Award,
    Globe,
    Activity,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
// PDF generation now uses backend API
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import BatchDisposalModal from "./BatchDisposalModal";

export default function PharmacistReports({ 
    analytics = {},
    expiredBatches = [], 
    expiringSoonBatches = [], 
    expiredBatchesCount = 0, 
    expiringSoonBatchesCount = 0,
    inventoryItems = [],
    dispensingData = [],
    dispensingSummary = {},
    topDispensedItems = []
}) {
    const [selectedReport, setSelectedReport] = useState("");
    const [dateRange, setDateRange] = useState("30d");
    const [searchTerm, setSearchTerm] = useState("");
    const [showExpiredBatches, setShowExpiredBatches] = useState(false);
    const [generatedReport, setGeneratedReport] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [recentReports, setRecentReports] = useState([]);
    const [disposalModalOpen, setDisposalModalOpen] = useState(false);
    const [selectedBatchForDisposal, setSelectedBatchForDisposal] = useState(null);
    const [bulkDisposalMode, setBulkDisposalMode] = useState(false);
    
    // Pagination for Recent Reports
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(5);
    
    // Pagination for Detailed Report data
    const [currentDataPage, setCurrentDataPage] = useState(1);
    const [dataPerPage] = useState(10);
    
    // Enhanced report features
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedPriority, setSelectedPriority] = useState("all");
    
    // Custom Report Configuration
    const [customReportConfig, setCustomReportConfig] = useState({
        selectedReportTypes: [],
        includeInventorySummary: false,
        includeDispensingActivity: false,
        includeExpiryReport: false,
        includeDisposalReport: false,
        includeExpiredBatches: false,
        customTitle: "",
        customDescription: ""
    });
    const [showCustomConfig, setShowCustomConfig] = useState(false);
    
    // Pagination calculations
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = recentReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(recentReports.length / reportsPerPage);
    
    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    // Sorting function for report items
    const sortReportItems = (items) => {
        if (!items || items.length === 0) return items;
        
        const sortedItems = [...items];
        
        sortedItems.sort((a, b) => {
            let aValue = null;
            let bValue = null;
            
            switch (sortBy) {
                case 'name':
                case 'id':
                    aValue = sortBy === 'id' ? (a.id || 0) : (a.name || '').toLowerCase();
                    bValue = sortBy === 'id' ? (b.id || 0) : (b.name || '').toLowerCase();
                    break;
                case 'category':
                    aValue = (a.category || '').toLowerCase();
                    bValue = (b.category || '').toLowerCase();
                    break;
                case 'quantity':
                case 'totalDispensed':
                case 'quantityDisposed':
                    aValue = parseFloat(a.quantity || a.totalDispensed || a.quantityDisposed || 0);
                    bValue = parseFloat(b.quantity || b.totalDispensed || b.quantityDisposed || 0);
                    break;
                case 'unit':
                    aValue = (a.unit || '').toLowerCase();
                    bValue = (b.unit || '').toLowerCase();
                    break;
                case 'batchNumber':
                    aValue = (a.batchNumber || '').toLowerCase();
                    bValue = (b.batchNumber || '').toLowerCase();
                    break;
                case 'expiryDate':
                    aValue = a.expiryDate ? new Date(a.expiryDate) : new Date(0);
                    bValue = b.expiryDate ? new Date(b.expiryDate) : new Date(0);
                    break;
                case 'status':
                    aValue = (a.status || getItemStatus(a) || '').toLowerCase();
                    bValue = (b.status || getItemStatus(b) || '').toLowerCase();
                    break;
                case 'manufacturer':
                    aValue = (a.manufacturer || '').toLowerCase();
                    bValue = (b.manufacturer || '').toLowerCase();
                    break;
                case 'description':
                    aValue = (a.description || '').toLowerCase();
                    bValue = (b.description || '').toLowerCase();
                    break;
                case 'storageLocation':
                    aValue = (a.storageLocation || '').toLowerCase();
                    bValue = (b.storageLocation || '').toLowerCase();
                    break;
                case 'dispenseCount':
                    aValue = parseFloat(a.dispenseCount || 0);
                    bValue = parseFloat(b.dispenseCount || 0);
                    break;
                case 'movementType':
                    aValue = (a.movementType || '').toLowerCase();
                    bValue = (b.movementType || '').toLowerCase();
                    break;
                case 'movementDate':
                case 'disposalDate':
                    aValue = a.movementDate || a.disposalDate ? new Date(a.movementDate || a.disposalDate) : new Date(0);
                    bValue = b.movementDate || b.disposalDate ? new Date(b.movementDate || b.disposalDate) : new Date(0);
                    break;
                case 'staffMember':
                case 'disposedBy':
                    aValue = (a.staffMember || a.disposedBy || '').toLowerCase();
                    bValue = (b.staffMember || b.disposedBy || '').toLowerCase();
                    break;
                case 'reason':
                    aValue = (a.reason || '').toLowerCase();
                    bValue = (b.reason || '').toLowerCase();
                    break;
                case 'notes':
                    aValue = (a.notes || '').toLowerCase();
                    bValue = (b.notes || '').toLowerCase();
                    break;
                default:
                    aValue = a[sortBy] || '';
                    bValue = b[sortBy] || '';
            }
            
            if (typeof aValue === 'string') {
                if (sortOrder === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            } else {
                if (sortOrder === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            }
        });
        
        return sortedItems;
    };
    
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [reportLimit, setReportLimit] = useState(100);
    const [dashboardAnalytics, setDashboardAnalytics] = useState({
        analytics: analytics || {},
        inventoryItems: inventoryItems || [],
        expiredBatches: expiredBatches || [],
        expiringSoonBatches: expiringSoonBatches || [],
        expiredBatchesCount: expiredBatchesCount || 0,
        expiringSoonBatchesCount: expiringSoonBatchesCount || 0,
        dispensingData: dispensingData || [],
        dispensingSummary: dispensingSummary || {},
        topDispensedItems: topDispensedItems || []
    });
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showReportsSettings, setShowReportsSettings] = useState(false);
    const [reportSettings, setReportSettings] = useState({
        defaultFormat: 'pdf',
        autoRefresh: false,
        emailNotifications: false,
        defaultDateRange: '30d',
        defaultSortBy: 'name',
        defaultSortOrder: 'asc',
        maxResults: 100
    });

    // Load recent reports from localStorage on component mount
    React.useEffect(() => {
        const savedReports = localStorage.getItem('pharmacist_reports_history');
        if (savedReports) {
            try {
                const parsedReports = JSON.parse(savedReports);
                setRecentReports(parsedReports);
            } catch (error) {
                console.error('Error loading report history:', error);
            }
        }
    }, []);

    // Clear localStorage on mount to ensure fresh state after data truncation
    React.useEffect(() => {
        // Clear localStorage for reports if inventory is empty
        if (inventoryItems.length === 0) {
            localStorage.removeItem('pharmacist_reports_history');
            setRecentReports([]);
        }
    }, [inventoryItems.length]);

    // Load dashboard analytics
    const loadDashboardAnalytics = async () => {
        setIsLoadingAnalytics(true);
        try {
            const response = await fetch('/pharmacist/inventory-reports/dashboard-analytics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setDashboardAnalytics(data);
        } catch (error) {
            console.error('Error loading dashboard analytics:', error);
        } finally {
            setIsLoadingAnalytics(false);
        }
    };

    // Reset to first page when sorting changes
    React.useEffect(() => {
        setCurrentDataPage(1);
    }, [sortBy, sortOrder]);

    // Load analytics on component mount only if not already loaded
    React.useEffect(() => {
        // Only load via AJAX if we don't have data from props
        if (!dashboardAnalytics.analytics || Object.keys(dashboardAnalytics.analytics).length === 0) {
        loadDashboardAnalytics();
        }
    }, []);

    // Print All Reports function
    const printAllReports = async () => {
        try {
            const reportTypes = ['inventory_summary', 'expiry_report', 'dispensing_report', 'low_stock_alert'];
            const promises = reportTypes.map(async (reportType) => {
                const reportUrl = `/pharmacist/inventory-reports/${reportType}?format=pdf`;
                return window.open(reportUrl, '_blank');
            });
            
            await Promise.all(promises);
            showToast("Success", "All reports are being generated and opened in new tabs", "success");
        } catch (error) {
            console.error('Error printing all reports:', error);
            showToast("Error", "Failed to print all reports. Please try again.", "error");
        }
    };


    // Reports Settings function
    const openReportsSettings = () => {
        setShowReportsSettings(true);
    };

    // Save Reports Settings
    const saveReportsSettings = () => {
        localStorage.setItem('pharmacist_report_settings', JSON.stringify(reportSettings));
        showToast("Success", "Report settings saved successfully", "success");
        setShowReportsSettings(false);
    };

    // Load Reports Settings
    React.useEffect(() => {
        const savedSettings = localStorage.getItem('pharmacist_report_settings');
        if (savedSettings) {
            try {
                setReportSettings(JSON.parse(savedSettings));
            } catch (error) {
                console.error('Error loading report settings:', error);
            }
        }
    }, []);

    // Helper function to calculate file size estimate
    const calculateFileSize = (reportData) => {
        const jsonString = JSON.stringify(reportData);
        const bytes = new Blob([jsonString]).size;
        const mb = (bytes / (1024 * 1024)).toFixed(1);
        return `${mb} MB`;
    };

    // Helper function to get report type display name
    const getReportTypeName = (type) => {
        const typeMap = {
            'inventory_summary': 'Inventory Summary',
            'dispensing_report': 'Dispensing Report',
            'low_stock_alert': 'Disposal Report',
            'expiry_report': 'Stock Movement Reports',
            'expired_batches': 'Expired Batches Report',
            'custom_report': 'Custom Report'
        };
        return typeMap[type] || 'Unknown Report';
    };

    // Helper function to save report to history
    const saveReportToHistory = (reportData, reportType) => {
        const newReport = {
            id: Date.now(),
            name: `${getReportTypeName(reportType)} - ${new Date().toLocaleDateString()}`,
            type: reportType,
            generated: new Date().toISOString().split('T')[0],
            size: calculateFileSize(reportData),
            status: 'completed',
            data: reportData,
            generatedAt: new Date().toISOString()
        };

        const updatedReports = [newReport, ...recentReports].slice(0, 10); // Keep only last 10 reports
        setRecentReports(updatedReports);
        
        // Save to localStorage
        localStorage.setItem('pharmacist_reports_history', JSON.stringify(updatedReports));
    };

    // Helper function to download report from history
    const downloadReportFromHistory = (report) => {
        if (report.data) {
            setGeneratedReport(report.data);
            // Trigger download after a short delay to ensure report is set
            setTimeout(() => {
                downloadAsPDF();
            }, 100);
        }
    };


    // Handle single batch disposal
    const handleDisposeBatch = (batch) => {
        setSelectedBatchForDisposal(batch);
        setBulkDisposalMode(false);
        setDisposalModalOpen(true);
    };

    // Handle bulk disposal of all expired batches
    const handleBulkDispose = () => {
        setSelectedBatchForDisposal(null);
        setBulkDisposalMode(true);
        setDisposalModalOpen(true);
    };

    // Handle disposal modal close
    const handleDisposalClose = () => {
        setDisposalModalOpen(false);
        setSelectedBatchForDisposal(null);
        setBulkDisposalMode(false);
    };

    // Professional Government Report types configuration
    const reportTypes = [
        {
            id: "inventory_summary",
            title: "Inventory Summary Report",
            description: "Official comprehensive overview of pharmaceutical inventory status",
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            hoverColor: "hover:border-blue-400",
            official: true,
            category: "Inventory Management"
        },
        {
            id: "dispensing_report",
            title: "Dispensing Activity Report",
            description: "Detailed official record of all dispensed medications and prescriptions",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            hoverColor: "hover:border-green-400",
            official: true,
            category: "Patient Care"
        },
        {
            id: "low_stock_alert",
            title: "Disposal Report",
            description: "Comprehensive report of items requiring disposal or disposal tracking",
            icon: AlertTriangle,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200",
            hoverColor: "hover:border-amber-400",
            official: true,
            category: "Critical Alerts"
        },
        {
            id: "expiry_report",
            title: "Stock Movement Reports",
            description: "Comprehensive tracking of all stock movements and inventory transactions",
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            hoverColor: "hover:border-blue-400",
            official: true,
            category: "Inventory Management"
        },
        {
            id: "expired_batches",
            title: "Expired Batches Report",
            description: "Official summary of all expired medication batches for disposal",
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            hoverColor: "hover:border-red-400",
            official: true,
            category: "Quality Control"
        },
    ];


    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Helper function to process inventory data
    const processInventoryData = (items) => {
        if (!items || items.length === 0) return [];
        
        return items.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category || 'Uncategorized',
            manufacturer: item.manufacturer || 'N/A',
            quantity: item.quantity || 0,
            unit: item.unit || 'pieces',
            batchNumber: item.batch_number || 'N/A',
            expiryDate: item.expiry_date || 'N/A',
            storageLocation: item.storage_location || 'N/A',
            status: item.status || 'Active',
            description: item.description || 'N/A',
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }));
    };

    // Helper function to process disposal data
    const processDisposalData = (items) => {
        if (!items || items.length === 0) return [];
        
        return items.map(item => ({
            id: item.id || Math.random(),
            name: item['Item Name'] || 'Unknown Item',
            category: item['Category'] || 'Uncategorized',
            batchNumber: item['Batch Number'] || 'N/A',
            quantityDisposed: item['Quantity Disposed'] || 0,
            disposalDate: item['Disposal Date'] || 'N/A',
            reason: item['Reason'] || 'N/A',
            disposedBy: item['Disposed By'] || 'Unknown',
            manufacturer: item['Manufacturer'] || 'N/A',
            expiryDate: item['Expiry Date'] || 'N/A',
            notes: item['Notes'] || 'N/A'
        }));
    };

    // Helper function to safely format dates
    const formatDate = (dateString) => {
        try {
            if (!dateString || dateString === 'N/A') return 'N/A';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            // Format as MM/DD/YYYY for consistency
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        } catch (error) {
            return 'N/A';
        }
    };

    const formatTime = (dateString) => {
        try {
            if (!dateString || dateString === 'N/A') return 'N/A';
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? 'N/A' : date.toLocaleTimeString();
        } catch (error) {
            return 'N/A';
        }
    };

    // Helper function to process dispensing data
    const processDispensingData = (items) => {
        if (!items || items.length === 0) return [];
        
        return items.map(item => ({
            id: item.id || Math.random(),
            name: item['Item Name'] || 'Unknown Item',
            manufacturer: item['Manufacturer'] || 'N/A',
            patientName: item['Patient Name/Reason'] || 'N/A',
            prescriptionNumber: item['Prescription Number'] || '-',
            quantity: item['Total Dispensed'] || 0,
            unit: item['Unit Type'] || 'pieces',
            batchNumber: item['Batch Number'] || 'N/A',
            staffName: item['Most Recent Staff'] || 'N/A',
            reason: item['Mode'] || 'Dispensed',
            date: item['Last Dispensed'] || 'N/A',
            // Keep original fields for other reports
            genericName: item['Generic Name'] || item['Item Name'] || 'Unknown Item',
            category: item['Category'] || 'Uncategorized',
            totalDispensed: item['Total Dispensed'] || 0,
            dispenseCount: item['Dispense Count'] || 0,
            averagePerDispense: item['Average per Dispense'] || 0,
            firstDispensed: item['First Dispensed'] || 'N/A',
            lastDispensed: item['Last Dispensed'] || 'N/A',
            expiryDate: item['Expiry Date'] || 'N/A'
        }));
    };

    // Helper function to process stock movement data
    const processStockMovementData = (items) => {
        if (!items || items.length === 0) return [];
        
        return items.map(item => ({
            id: item['Movement ID'] || Math.random(),
            name: item['Item Name'] || 'Unknown Item',
            category: item['Category'] || 'Uncategorized',
            movementType: item['Movement Type'] || 'Unknown',
            quantity: item['Quantity'] || 0,
            batchNumber: item['Batch Number'] || 'N/A',
            movementDate: item['Movement Date'] || 'N/A',
            staffMember: item['Staff Member'] || 'Unknown',
            reason: item['Reason'] || 'N/A',
            manufacturer: item['Manufacturer'] || 'N/A',
            expiryDate: item['Expiry Date'] || 'N/A',
            notes: item['Notes'] || 'N/A'
        }));
    };

    // Helper function to process expired batches data
    const processExpiredBatchesData = (items) => {
        if (!items || items.length === 0) return [];
        
        return items.map(item => ({
            id: item['Item Name'] || Math.random(),
            name: item['Item Name'] || 'Unknown Item',
            category: item['Category'] || 'Uncategorized',
            batchNumber: item['Batch Number'] || 'N/A',
            currentStock: item['Current Stock'] || 0,
            unitType: item['Unit Type'] || 'pieces',
            expiryDate: item['Expiry Date'] || 'N/A',
            daysExpired: item['Days Expired'] || 0,
            status: item['Status'] || 'Expired',
            manufacturer: item['Manufacturer'] || 'N/A',
            storageLocation: item['Storage Location'] || 'N/A'
        }));
    };

    // Helper function to check if item is expired
    const isExpired = (expiryDate) => {
        if (!expiryDate || expiryDate === 'N/A') return false;
        try {
            const expiry = new Date(expiryDate);
            const today = new Date();
            return expiry < today;
        } catch (error) {
            return false;
        }
    };

    // Helper function to check if item is expiring soon (within 30 days)
    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate || expiryDate === 'N/A') return false;
        try {
            const expiry = new Date(expiryDate);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        } catch (error) {
            return false;
        }
    };

    // Helper function to get item status
    const getItemStatus = (item) => {
        if (isExpired(item.expiryDate)) return 'expired';
        if (isExpiringSoon(item.expiryDate)) return 'expiring_soon';
        if (item.quantity === 0) return 'out_of_stock';
        if (item.quantity <= item.minimumStock) return 'low_stock';
        return 'in_stock';
    };

    // Generate actual report data
    const generateReportData = (reportType) => {
        const processedItems = processInventoryData(inventoryItems);
        
        switch (reportType) {
            case 'inventory_summary':
                return {
                    title: 'Inventory Summary Report',
                    generatedAt: new Date().toISOString(),
                    summary: {
                        totalItems: processedItems.length,
                        inStock: processedItems.filter(item => getItemStatus(item) === 'in_stock').length,
                        lowStock: processedItems.filter(item => getItemStatus(item) === 'low_stock').length,
                        outOfStock: processedItems.filter(item => getItemStatus(item) === 'out_of_stock').length,
                        expired: processedItems.filter(item => getItemStatus(item) === 'expired').length,
                        expiringSoon: processedItems.filter(item => getItemStatus(item) === 'expiring_soon').length,
                    },
                    items: processedItems
                };
            
            case 'low_stock_alert':
                return {
                    title: 'Disposal Report',
                    generatedAt: new Date().toISOString(),
                    summary: {
                        lowStockItems: processedItems.filter(item => getItemStatus(item) === 'low_stock').length,
                        outOfStockItems: processedItems.filter(item => getItemStatus(item) === 'out_of_stock').length,
                    },
                    items: processedItems.filter(item => 
                        getItemStatus(item) === 'low_stock' || getItemStatus(item) === 'out_of_stock'
                    )
                };
            
            case 'dispensing_report':
                return {
                    title: 'Dispensing Report',
                    generatedAt: new Date().toISOString(),
                    summary: {
                        totalDispensed: dispensingSummary.totalDispensed || 0,
                        totalQuantity: dispensingSummary.totalQuantity || 0,
                        todayDispensed: dispensingSummary.todayDispensed || 0,
                        thisWeekDispensed: dispensingSummary.thisWeekDispensed || 0,
                        thisMonthDispensed: dispensingSummary.thisMonthDispensed || 0,
                    },
                    items: dispensingData.map(dispense => ({
                        id: dispense.id,
                        name: dispense.inventory_name,
                        category: dispense.inventory?.category?.name || 'N/A',
                        manufacturer: dispense.inventory?.manufacturer || 'N/A',
                        quantity: dispense.quantity,
                        unit: dispense.inventory?.unit_type || 'pieces',
                        batchNumber: dispense.batch_number || 'N/A',
                        expiryDate: dispense.inventory?.expiry_date || 'N/A',
                        storageLocation: dispense.inventory?.storage_location || 'N/A',
                        dispenseMode: dispense.dispense_mode || 'Manual Dispense',
                        patientName: dispense.patient_name || 'N/A',
                        prescriptionNumber: dispense.prescription_number || 'N/A',
                        dispensedBy: dispense.dispensed_by || 'N/A',
                        reason: dispense.reason || 'N/A',
                        notes: dispense.notes || '',
                        dispensedAt: dispense.created_at || new Date().toISOString(),
                        staffName: dispense.staff?.firstname + ' ' + dispense.staff?.lastname || 'Unknown'
                    }))
                };
            
            case 'expiry_report':
                return {
                    title: 'Stock Movement Reports',
                    generatedAt: new Date().toISOString(),
                    summary: {
                        expiringSoon: processedItems.filter(item => getItemStatus(item) === 'expiring_soon').length,
                        expired: processedItems.filter(item => getItemStatus(item) === 'expired').length,
                    },
                    items: processedItems.filter(item => 
                        getItemStatus(item) === 'expiring_soon' || getItemStatus(item) === 'expired'
                    )
                };
            
            case 'expired_batches':
                return {
                    title: 'Expired Batches Report',
                    generatedAt: new Date().toISOString(),
                    summary: {
                        expiredBatches: processedItems.filter(item => getItemStatus(item) === 'expired').length,
                    },
                    items: processedItems.filter(item => getItemStatus(item) === 'expired')
                };
            
            default:
                return {
                    title: 'Custom Report',
                    generatedAt: new Date().toISOString(),
                    summary: {},
                    items: processedItems
                };
        }
    };

    const generateReport = async () => {
        if (!selectedReport) return;
        
        setIsGenerating(true);
        
        try {
            // Build query parameters for enhanced filtering
            const params = new URLSearchParams();
            params.append('format', 'json');
            
            if (selectedCategory !== 'all') {
                params.append('category_id', selectedCategory);
            }
            if (selectedStatus !== 'all') {
                params.append('status', selectedStatus);
            }
            if (selectedPriority !== 'all') {
                params.append('priority', selectedPriority);
            }
            if (sortBy !== 'name') {
                params.append('sort_by', sortBy);
            }
            if (sortOrder !== 'asc') {
                params.append('sort_order', sortOrder);
            }
            if (reportLimit !== 100) {
                params.append('limit', reportLimit);
            }
            
            // Add date range - SET TO ALL TIME TO SHOW ALL DATA
            const endDate = new Date();
            const startDate = new Date('2020-01-01'); // Start from beginning to get all data
            
            console.log('🎯 USING ALL-TIME DATE RANGE - v2025-10-27-05:45:', { startDate: startDate.toISOString(), endDate: endDate.toISOString() });
            
            // Format dates with time to include full day range - USE TOMORROW TO INCLUDE TODAY
            const tomorrow = new Date(endDate);
            tomorrow.setDate(tomorrow.getDate() + 1); // Add one day to ensure today is included
            
            const startDateStr = startDate.toISOString().split('T')[0] + ' 00:00:00';
            const endDateStr = tomorrow.toISOString().split('T')[0] + ' 23:59:59';
            
            params.append('start_date', startDateStr);
            params.append('end_date', endDateStr);
            
            // Determine the correct endpoint based on report type
            let endpoint = '/pharmacist/inventory-reports/summary';
            switch (selectedReport) {
                case 'inventory_summary':
                    endpoint = '/pharmacist/inventory-reports/summary';
                    break;
                case 'expiry_report':
                    endpoint = '/pharmacist/inventory-reports/expiry';
                    break;
                case 'dispensing_report':
                    endpoint = '/pharmacist/inventory-reports/dispensing';
                    break;
                case 'low_stock_alert':
                    endpoint = '/pharmacist/inventory-reports/low-stock-alert';
                    break;
                case 'expired_batches':
                    endpoint = '/pharmacist/inventory-reports/expired-batches';
                    break;
                default:
                    endpoint = '/pharmacist/inventory-reports/summary';
            }
            
            console.log('Fetching from:', `${endpoint}?${params.toString()}`);
            console.log('Date range params:', { startDateStr, endDateStr });
            
            const response = await fetch(`${endpoint}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                credentials: 'same-origin'
            });
            const data = await response.json();
            
            // Debug logging
            console.log('Report data received:', {
                selectedReport,
                dataKeys: Object.keys(data),
                itemsCount: Array.isArray(data.items) ? data.items.length : 'not array',
                dataCount: Array.isArray(data.data) ? data.data.length : 'not array',
                rawData: data
            });
            
            // Process data based on report type
            let processedItems = [];
            
            // Get the data array - try multiple possible locations
            let rawDataArray = [];
            if (Array.isArray(data.items)) {
                rawDataArray = data.items;
            } else if (Array.isArray(data.data)) {
                rawDataArray = data.data;
            } else if (Array.isArray(data)) {
                rawDataArray = data;
            }
            
            console.log('Raw data array:', rawDataArray);
            
            if (selectedReport === 'low_stock_alert') {
                processedItems = processDisposalData(rawDataArray);
            } else if (selectedReport === 'dispensing_report') {
                processedItems = processDispensingData(rawDataArray);
            } else if (selectedReport === 'expiry_report') {
                // For expiry_report, we're getting stock movement data from the backend
                // Map the data to include additional fields needed for the frontend display
                processedItems = processStockMovementData(rawDataArray);
            } else if (selectedReport === 'expired_batches') {
                processedItems = processExpiredBatchesData(rawDataArray);
            } else {
                processedItems = processInventoryData(rawDataArray);
            }
            
            console.log('Processed items:', processedItems);

            // Transform the data for display
            const reportData = {
                title: getReportTypeName(selectedReport),
                subtitle: `Generated on ${new Date().toLocaleString()}`,
                items: processedItems,
                summary: data.analytics || {},
                generatedAt: new Date().toISOString(),
                filters: {
                    category: selectedCategory,
                    status: selectedStatus,
                    priority: selectedPriority,
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    limit: reportLimit
                }
            };
            
            setGeneratedReport(reportData);
            setCurrentDataPage(1); // Reset to first page when new report is generated
            
            // Save report to history
            saveReportToHistory(reportData, selectedReport);
            
        } catch (error) {
            console.error('Error generating report:', error);
            // Show error message instead of fallback data
            alert('Error generating report: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    // Generate Custom Report
    const generateCustomReport = async () => {
        if (!customReportConfig.includeInventorySummary && 
            !customReportConfig.includeDispensingActivity && 
            !customReportConfig.includeExpiryReport && 
            !customReportConfig.includeDisposalReport && 
            !customReportConfig.includeExpiredBatches) {
            return;
        }
        
        setIsGenerating(true);
        
        try {
            // Build query parameters for custom report
            const params = new URLSearchParams();
            params.append('format', 'json');
            params.append('custom_report', 'true');
            
            // Add selected report types
            if (customReportConfig.includeInventorySummary) {
                params.append('include_types[]', 'inventory_summary');
            }
            if (customReportConfig.includeDispensingActivity) {
                params.append('include_types[]', 'dispensing_report');
            }
            if (customReportConfig.includeExpiryReport) {
                params.append('include_types[]', 'expiry_report');
            }
            if (customReportConfig.includeDisposalReport) {
                params.append('include_types[]', 'low_stock_alert');
            }
            if (customReportConfig.includeExpiredBatches) {
                params.append('include_types[]', 'expired_batches');
            }
            
            // Add custom report details
            if (customReportConfig.customTitle) {
                params.append('custom_title', customReportConfig.customTitle);
            }
            if (customReportConfig.customDescription) {
                params.append('custom_description', customReportConfig.customDescription);
            }
            
            // Add filters
            if (selectedCategory !== 'all') {
                params.append('category_id', selectedCategory);
            }
            if (selectedStatus !== 'all') {
                params.append('status', selectedStatus);
            }
            if (selectedPriority !== 'all') {
                params.append('priority', selectedPriority);
            }
            params.append('sort_by', sortBy);
            params.append('sort_order', sortOrder);
            params.append('limit', reportLimit);
            
            const response = await fetch(`/pharmacist/inventory-reports/custom?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Transform the data for display
            const reportData = {
                title: customReportConfig.customTitle || 'Custom Official Report',
                subtitle: `Generated on ${new Date().toLocaleString()}`,
                description: customReportConfig.customDescription || 'Comprehensive custom report with selected data sections',
                items: data.reportData || data,
                summary: data.analytics || {},
                customConfig: customReportConfig,
                filters: {
                    category: selectedCategory,
                    status: selectedStatus,
                    priority: selectedPriority,
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    limit: reportLimit
                },
                generatedAt: new Date().toISOString()
            };
            
            setGeneratedReport(reportData);
            saveReportToHistory(reportData, 'custom_report');
            
        } catch (error) {
            console.error('Error generating custom report:', error);
            // Show error message instead of fallback data
            alert('Error generating custom report: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    // Download as PDF
    const downloadAsPDF = async () => {
        console.log('PDF download requested');
        console.log('Selected report type:', selectedReport);
        console.log('Generated report available:', !!generatedReport);
        
        // If no report is selected, default to inventory summary
        const reportType = selectedReport || 'inventory_summary';
        
        try {
            // Use backend API for PDF generation
            let reportUrl;
            
            // Map report types to backend endpoints
            switch (reportType) {
                case 'inventory_summary':
                    reportUrl = '/pharmacist/inventory-reports/summary?format=pdf';
                    break;
                case 'expiry_report':
                    reportUrl = '/pharmacist/inventory-reports/expiry?format=pdf';
                    break;
                case 'dispensing_report':
                    reportUrl = '/pharmacist/inventory-reports/dispensing?format=pdf';
                    break;
                case 'low_stock_alert':
                    reportUrl = '/pharmacist/inventory-reports/low-stock-alert?format=pdf';
                    break;
                case 'expired_batches':
                    reportUrl = '/pharmacist/inventory-reports/expired-batches?format=pdf';
                    break;
                default:
                    reportUrl = '/pharmacist/inventory-reports/summary?format=pdf';
            }
            
            // Add query parameters if needed
            const params = new URLSearchParams();
            if (selectedCategory && selectedCategory !== 'all') {
                params.append('category_id', selectedCategory);
            }
            if (selectedStatus && selectedStatus !== 'all') {
                params.append('status', selectedStatus);
            }
            if (selectedPriority && selectedPriority !== 'all') {
                params.append('priority', selectedPriority);
            }
            if (sortBy && sortBy !== 'name') {
                params.append('sort_by', sortBy);
            }
            if (sortOrder && sortOrder !== 'asc') {
                params.append('sort_order', sortOrder);
            }
            if (reportLimit && reportLimit !== 100) {
                params.append('limit', reportLimit);
            }
            
            // Add date range - SET TO ALL TIME TO SHOW ALL DATA
            const endDate = new Date();
            const startDate = new Date('2020-01-01'); // Start from beginning to get all data
            
            // Use tomorrow to ensure today is included in the range
            const tomorrow = new Date(endDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Format dates with time to include full day range
            const startDateStr = startDate.toISOString().split('T')[0] + ' 00:00:00';
            const endDateStr = tomorrow.toISOString().split('T')[0] + ' 23:59:59';
            
            params.append('start_date', startDateStr);
            params.append('end_date', endDateStr);
            
            const fullUrl = `${reportUrl}${params.toString() ? '&' + params.toString() : ''}`;
            
            console.log('Generated PDF URL:', fullUrl);
            
            // Automatically download PDF
            console.log('Downloading PDF from:', fullUrl);
            
            // Create a temporary link element to trigger download
            const link = document.createElement('a');
            link.href = fullUrl;
            link.download = `${getReportTypeName(reportType).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert(`Error generating PDF: ${error.message}. Please try again.`);
        }
    };

    // Download as Excel
    const downloadAsExcel = async () => {
        if (!selectedReport) return;
        
        try {
            // Use backend API for Excel generation
            let reportUrl;
            
            // Map report types to backend endpoints
            switch (selectedReport) {
                case 'inventory_summary':
                    reportUrl = '/pharmacist/inventory-reports/summary?format=excel';
                    break;
                case 'expiry_report':
                    reportUrl = '/pharmacist/inventory-reports/expiry?format=excel';
                    break;
                case 'dispensing_report':
                    reportUrl = '/pharmacist/inventory-reports/dispensing?format=excel';
                    break;
                case 'low_stock_alert':
                    reportUrl = '/pharmacist/inventory-reports/low-stock-alert?format=excel';
                    break;
                case 'expired_batches':
                    reportUrl = '/pharmacist/inventory-reports/expired-batches?format=excel';
                    break;
                default:
                    reportUrl = '/pharmacist/inventory-reports/summary?format=excel';
            }
            
            // Add query parameters if needed
            const params = new URLSearchParams();
            if (selectedCategory && selectedCategory !== 'all') {
                params.append('category_id', selectedCategory);
            }
            if (selectedStatus && selectedStatus !== 'all') {
                params.append('status', selectedStatus);
            }
            if (selectedPriority && selectedPriority !== 'all') {
                params.append('priority', selectedPriority);
            }
            if (sortBy && sortBy !== 'name') {
                params.append('sort_by', sortBy);
            }
            if (sortOrder && sortOrder !== 'asc') {
                params.append('sort_order', sortOrder);
            }
            if (reportLimit && reportLimit !== 100) {
                params.append('limit', reportLimit);
            }
            
            // Add date range - SET TO ALL TIME TO SHOW ALL DATA
            const endDate = new Date();
            const startDate = new Date('2020-01-01'); // Start from beginning to get all data
            
            // Use tomorrow to ensure today is included in the range
            const tomorrow = new Date(endDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Format dates with time to include full day range
            const startDateStr = startDate.toISOString().split('T')[0] + ' 00:00:00';
            const endDateStr = tomorrow.toISOString().split('T')[0] + ' 23:59:59';
            
            params.append('start_date', startDateStr);
            params.append('end_date', endDateStr);
            
            const fullUrl = `${reportUrl}${params.toString() ? '&' + params.toString() : ''}`;
            
            console.log('Generated Excel URL:', fullUrl);
            
            // Automatically download Excel
            console.log('Downloading Excel from:', fullUrl);
            
            // Create a temporary link element to trigger download
            const link = document.createElement('a');
            link.href = fullUrl;
            link.download = `${getReportTypeName(selectedReport).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error generating Excel:', error);
            alert('Error generating Excel file. Please try again.');
        }
    };



    return (
        <AdminLayout header="Reports">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-xl p-8 text-white"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <Building2 className="h-8 w-8 text-white" />
                                    </div>
                    <div>
                                        <h1 className="text-3xl font-bold text-white">
                                            RURAL HEALTH UNIT CALUMPANG
                        </h1>
                                        <p className="text-blue-100 text-lg font-medium">
                                            Pharmacy Department - Reports & Analytics
                        </p>
                    </div>
                                </div>
                                <p className="text-blue-100 text-lg max-w-2xl">
                                    Professional inventory management and pharmaceutical reporting system for government healthcare services
                                </p>
                                <div className="flex items-center gap-6 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-blue-200" />
                                        <span className="text-blue-100 font-medium">Official Government System</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="h-5 w-5 text-blue-200" />
                                        <span className="text-blue-100 font-medium">Certified Healthcare Reports</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                    </div>
                </div>
                    </div>
                </motion.div>


                {/* Professional Report Generation Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Card className="border-2 border-blue-200 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-600 rounded-lg">
                                        <FileText className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-bold text-blue-900">
                                            Generate Official Report
                                        </CardTitle>
                                        <p className="text-blue-700 text-base">
                                            Create professional government healthcare reports
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Official Document
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reportTypes.map((report) => (
                                <motion.div
                                    key={report.id}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => setSelectedReport(report.id)}
                                        className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
                                            selectedReport === report.id
                                                ? `border-blue-500 bg-blue-50 shadow-lg ${report.hoverColor}`
                                                : `${report.borderColor} hover:shadow-md ${report.hoverColor}`
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${report.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                                                <report.icon className={`h-6 w-6 ${report.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold text-gray-900 text-lg">
                                                    {report.title}
                                                </h3>
                                                    {report.official && (
                                                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            Official
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                                    {report.description}
                                                </p>
                                                <div className="flex items-center justify-start">
                                                    <Badge variant="outline" className="text-xs">
                                                        {report.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {selectedReport && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-blue-600 rounded-lg">
                                        <Settings className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-blue-900">Report Configuration</h3>
                                        <p className="text-blue-700 text-base">Configure your official government report parameters</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-blue-900 mb-2">
                                            <FileText className="h-4 w-4 inline mr-2" />
                                            Generate Report
                                        </label>
                                    <Button 
                                        onClick={generateReport} 
                                        disabled={isGenerating}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                                    >
                                        {isGenerating ? (
                                            <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Generating Official Report...
                                            </>
                                        ) : (
                                            <>
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Generate Official Report
                                            </>
                                        )}
                                    </Button>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 text-blue-800">
                                        <Shield className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            This will generate an official government document with proper authentication and formatting.
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
                </motion.div>

                {/* Generated Report Display */}
                {generatedReport && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="border-2 border-gray-300 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 text-white border-b-4 border-gray-600">
                                <div className="text-center">
                                    <div className="mb-4">
                                        <h1 className="text-3xl font-bold text-white mb-2">
                                            REPUBLIC OF THE PHILIPPINES
                                        </h1>
                                        <h2 className="text-2xl font-semibold text-gray-200 mb-1">
                                            RURAL HEALTH UNIT OF CALUMPANG
                                        </h2>
                                        <p className="text-gray-300 text-lg">
                                            Calumpang, General Santos City.
                                        </p>
                                    </div>
                                    <div className="border-t border-gray-500 pt-4">
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {generatedReport.title}
                                        </h3>
                                        <div className="flex justify-center items-center space-x-6 text-sm text-gray-200">
                                            <p className="flex items-center">
                                                <Building2 className="h-4 w-4 mr-1" />
                                                RHU Calumpang Management System
                                            </p>
                                            <p className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                Generated: {new Date(generatedReport.generatedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="bg-white text-gray-800 hover:bg-gray-50 border-white"
                                            onClick={() => setGeneratedReport(null)}
                                        >
                                            Close
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex items-center gap-1 bg-white text-blue-900 hover:bg-blue-50 border-white"
                                                onClick={downloadAsPDF}
                                            >
                                                <Download className="h-4 w-4" />
                                                PDF
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex items-center gap-1 bg-white text-blue-900 hover:bg-blue-50 border-white"
                                                onClick={downloadAsExcel}
                                            >
                                                <Download className="h-4 w-4" />
                                                Excel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent id="report-content">
                                {/* Report Summary */}
                                {Object.keys(generatedReport.summary).length > 0 && (
                                    <div className="mb-8">
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                            <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center">
                                                <BarChart3 className="h-5 w-5 mr-2" />
                                                Executive Summary
                                            </h3>
                                            <p className="text-blue-700 text-sm">
                                                Comprehensive inventory analysis and status overview
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                                            {Object.entries(generatedReport.summary).map(([key, value]) => {
                                                const statusColors = {
                                                    'total_items': 'bg-blue-100 border-blue-300 text-blue-800',
                                                    'in_stock': 'bg-green-100 border-green-300 text-green-800',
                                                    'low_stock_items': 'bg-yellow-100 border-yellow-300 text-yellow-800',
                                                    'out_of_stock': 'bg-red-100 border-red-300 text-red-800',
                                                    'expired_items': 'bg-red-100 border-red-300 text-red-800',
                                                    'expiring_soon': 'bg-orange-100 border-orange-300 text-orange-800',
                                                    'critical_alerts': 'bg-purple-100 border-purple-300 text-purple-800'
                                                };
                                                
                                                const statusIcons = {
                                                    'total_items': <Package className="h-5 w-5" />,
                                                    'in_stock': <CheckCircle className="h-5 w-5" />,
                                                    'low_stock_items': <AlertTriangle className="h-5 w-5" />,
                                                    'out_of_stock': <XCircle className="h-5 w-5" />,
                                                    'expired_items': <AlertCircle className="h-5 w-5" />,
                                                    'expiring_soon': <Clock className="h-5 w-5" />,
                                                    'critical_alerts': <AlertTriangle className="h-5 w-5" />
                                                };
                                                
                                                return (
                                                    <div key={key} className={`text-center p-4 rounded-lg border-2 ${statusColors[key] || 'bg-gray-100 border-gray-300 text-gray-800'}`}>
                                                        <div className="flex justify-center mb-2">
                                                            {statusIcons[key] || <Package className="h-5 w-5" />}
                                                        </div>
                                                        <p className="text-3xl font-bold mb-1">{value}</p>
                                                        <p className="text-sm font-medium capitalize">
                                                        {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                                                    </p>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Report Items Table */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 border-l-4 border-gray-500 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                                            <FileText className="h-5 w-5 mr-2" />
                                            Detailed Inventory Report
                                    </h3>
                                        <p className="text-gray-600 text-sm">
                                            Complete listing of all inventory items ({generatedReport.items.length} items)
                                        </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                                                    <Select value={sortBy} onValueChange={setSortBy}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {selectedReport === 'dispensing_report' ? (
                                                                <>
                                                                    <SelectItem value="name">Item Name</SelectItem>
                                                                    <SelectItem value="category">Category</SelectItem>
                                                                    <SelectItem value="totalDispensed">Total Dispensed</SelectItem>
                                                                    <SelectItem value="dispenseCount">Dispense Count</SelectItem>
                                                                    <SelectItem value="batchNumber">Batch Number</SelectItem>
                                                                </>
                                                            ) : selectedReport === 'expiry_report' ? (
                                                                <>
                                                                    <SelectItem value="id">Movement ID</SelectItem>
                                                                    <SelectItem value="name">Item Name</SelectItem>
                                                                    <SelectItem value="category">Category</SelectItem>
                                                                    <SelectItem value="movementType">Movement Type</SelectItem>
                                                                    <SelectItem value="quantity">Quantity</SelectItem>
                                                                    <SelectItem value="batchNumber">Batch Number</SelectItem>
                                                                    <SelectItem value="movementDate">Movement Date</SelectItem>
                                                                    <SelectItem value="staffMember">Staff Member</SelectItem>
                                                                    <SelectItem value="reason">Reason</SelectItem>
                                                                    <SelectItem value="notes">Notes</SelectItem>
                                                                </>
                                                            ) : selectedReport === 'low_stock_alert' ? (
                                                                <>
                                                                    <SelectItem value="name">Item Name</SelectItem>
                                                                    <SelectItem value="category">Category</SelectItem>
                                                                    <SelectItem value="batchNumber">Batch Number</SelectItem>
                                                                    <SelectItem value="quantityDisposed">Quantity Disposed</SelectItem>
                                                                    <SelectItem value="disposalDate">Disposal Date</SelectItem>
                                                                    <SelectItem value="reason">Reason</SelectItem>
                                                                    <SelectItem value="disposedBy">Disposed By</SelectItem>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <SelectItem value="name">Name</SelectItem>
                                                                    <SelectItem value="category">Category</SelectItem>
                                                                    <SelectItem value="quantity">Quantity</SelectItem>
                                                                    <SelectItem value="unit">Unit</SelectItem>
                                                                    <SelectItem value="status">Status</SelectItem>
                                                                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                                                                    <SelectItem value="batchNumber">Batch Number</SelectItem>
                                                                    <SelectItem value="expiryDate">Expiry Date</SelectItem>
                                                                    <SelectItem value="description">Description</SelectItem>
                                                                    <SelectItem value="storageLocation">Storage Location</SelectItem>
                                                                </>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <label className="text-sm font-medium text-gray-700">Order:</label>
                                                    <Select value={sortOrder} onValueChange={setSortOrder}>
                                                        <SelectTrigger className="w-[120px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="asc">Ascending</SelectItem>
                                                            <SelectItem value="desc">Descending</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {generatedReport.items.length > 0 ? (
                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="w-full border-collapse bg-white">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                                                        {selectedReport === 'dispensing_report' ? (
                                                            <>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Item Name</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Category</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Total Dispensed</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Dispense Count</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">First Dispensed</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Last Dispensed</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Unit Type</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Staff Name</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Manufacturer</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Patient Name/Reason</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Batch Number</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Mode</th>
                                                            </>
                                                        ) : selectedReport === 'expiry_report' ? (
                                                            <>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Movement ID</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Item Name</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Category</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Movement Type</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Quantity</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Batch Number</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Movement Date</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Staff Member</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Reason</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Manufacturer</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Expiry Date</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Notes</th>
                                                            </>
                                                        ) : selectedReport === 'low_stock_alert' ? (
                                                            <>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Item Name</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Category</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Batch Number</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Quantity Disposed</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Disposal Date</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Reason</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Disposed By</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Manufacturer</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Notes</th>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Name</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Category</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Quantity</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Unit</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Status</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Manufacturer</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Batch number</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Expiry date</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Description</th>
                                                                <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Storage location</th>
                                                            </>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortReportItems(generatedReport.items)
                                                        .slice((currentDataPage - 1) * dataPerPage, currentDataPage * dataPerPage)
                                                        .map((item, index) => {
                                                        if (selectedReport === 'dispensing_report') {
                                                            return (
                                                                <tr key={item.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <td className="py-4 px-6">
                                                                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {item.category}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-bold text-lg text-gray-900">{item.totalDispensed || item.quantity}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.dispenseCount}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.firstDispensed || 'N/A'}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.lastDispensed || item.date || 'N/A'}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.unit}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.staffName || item.dispensedBy}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.manufacturer}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.patientName}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">{item.batchNumber}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.reason}</p>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        } else if (selectedReport === 'expiry_report') {
                                                            return (
                                                                <tr key={item.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <td className="py-4 px-6">
                                                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">{item.id || 'N/A'}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {item.category}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                                            {item.movementType || 'N/A'}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                            <span className="font-bold text-lg text-gray-900">{item.quantity}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">{item.batchNumber}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.movementDate}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.staffMember}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.reason}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.manufacturer}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.expiryDate}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.notes}</p>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        } else if (selectedReport === 'low_stock_alert') {
                                                            return (
                                                                <tr key={item.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {item.category}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">{item.batchNumber}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="font-bold text-lg text-gray-900">{item.quantityDisposed}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.disposalDate}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.reason}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="font-medium text-gray-900 text-sm">{item.disposedBy}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.manufacturer}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.notes}</p>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        } else {
                                                            const status = getItemStatus(item);
                                                            const statusColors = {
                                                                'in_stock': 'bg-green-100 text-green-800 border-green-200',
                                                                'low_stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                                                'out_of_stock': 'bg-red-100 text-red-800 border-red-200',
                                                                'expired': 'bg-red-100 text-red-800 border-red-200',
                                                                'expiring_soon': 'bg-orange-100 text-orange-800 border-orange-200'
                                                            };
                                                            const statusText = {
                                                                'in_stock': 'In Stock',
                                                                'low_stock': 'Low Stock Items',
                                                                'out_of_stock': 'Out of Stock Items',
                                                                'expired': 'Expired Items',
                                                                'expiring_soon': 'Expiring Soon Items'
                                                            };
                                                            
                                                            return (
                                                                <tr key={item.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <td className="py-4 px-6">
                                                                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {item.category}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="font-bold text-lg text-gray-900">{item.quantity || 0}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="text-sm text-gray-700">{item.unit || 'N/A'}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <Badge className={`${statusColors[status]} border`}>
                                                                            {statusText[status]}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.manufacturer || 'N/A'}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">{item.batchNumber || 'N/A'}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        {item.expiryDate !== 'N/A' ? (
                                                                            <p className="font-medium text-gray-900 text-sm">{formatDate(item.expiryDate)}</p>
                                                                        ) : (
                                                                            <span className="text-gray-400 text-sm">N/A</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.description || 'N/A'}</p>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <p className="text-sm text-gray-700">{item.storageLocation || 'N/A'}</p>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                            {/* Pagination Controls */}
                                            {generatedReport.items.length > dataPerPage && (
                                                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                                                    <div className="text-sm text-gray-700">
                                                        Showing {(currentDataPage - 1) * dataPerPage + 1} to {Math.min(currentDataPage * dataPerPage, generatedReport.items.length)} of {generatedReport.items.length} items
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentDataPage(Math.max(1, currentDataPage - 1))}
                                                            disabled={currentDataPage === 1}
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                            Previous
                                                        </Button>
                                                        <span className="text-sm text-gray-700 px-4">
                                                            Page {currentDataPage} of {Math.ceil(generatedReport.items.length / dataPerPage)}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentDataPage(Math.min(Math.ceil(generatedReport.items.length / dataPerPage), currentDataPage + 1))}
                                                            disabled={currentDataPage >= Math.ceil(generatedReport.items.length / dataPerPage)}
                                                        >
                                                            Next
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Inventory Data Available</h3>
                                            <p className="text-gray-500 mb-4">There are currently no inventory items to display in this report.</p>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Note:</strong> This report will automatically populate once inventory items are added to the system.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Recent Reports */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Reports
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-500">Filter</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {currentReports.length > 0 ? (
                                currentReports.map((report, index) => (
                                    <motion.div
                                        key={report.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {report.name}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                                                    <span>Size: {report.size}</span>
                                                    <span>Type: {getReportTypeName(report.type)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(report.status)}>
                                                {report.status}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex items-center gap-1"
                                                    onClick={() => downloadReportFromHistory(report)}
                                                >
                                                    <Download className="h-3 w-3" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No reports generated yet</p>
                                    <p className="text-sm">Generate your first report to see it here</p>
                                </div>
                            )}
                            
                            {/* Pagination Controls */}
                            {recentReports.length > reportsPerPage && (
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>
                                            Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, recentReports.length)} of {recentReports.length} reports
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1"
                                        >
                                            <ChevronLeft className="h-3 w-3" />
                                            Previous
                                        </Button>
                                        
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                                <Button
                                                    key={pageNumber}
                                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1"
                                        >
                                            Next
                                            <ChevronRight className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Reports</p>
                                        <p className="text-2xl font-bold text-gray-900">{recentReports.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Download className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">This Month</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {recentReports.filter(report => {
                                                const reportDate = new Date(report.generatedAt);
                                                const now = new Date();
                                                return reportDate.getMonth() === now.getMonth() && 
                                                       reportDate.getFullYear() === now.getFullYear();
                                            }).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <BarChart3 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Avg. Report Size</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {recentReports.length > 0 ? 
                                                (recentReports.reduce((sum, report) => {
                                                    const size = parseFloat(report.size);
                                                    return sum + (isNaN(size) ? 0 : size);
                                                }, 0) / recentReports.length).toFixed(1) + ' MB'
                                                : '0 MB'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

            </motion.div>

            {/* Batch Disposal Modal */}
            <BatchDisposalModal
                open={disposalModalOpen}
                onClose={handleDisposalClose}
                item={selectedBatchForDisposal}
                multi={bulkDisposalMode}
                itemsForMulti={bulkDisposalMode ? expiredBatches : []}
            />

            {/* Reports Settings Modal */}
            {showReportsSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Reports Settings</h2>
                            <Button
                                variant="outline"
                                onClick={() => setShowReportsSettings(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Default Format */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Default Export Format
                                </label>
                                <Select 
                                    value={reportSettings.defaultFormat} 
                                    onValueChange={(value) => setReportSettings({...reportSettings, defaultFormat: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">PDF</SelectItem>
                                        <SelectItem value="excel">Excel</SelectItem>
                                        <SelectItem value="csv">CSV</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Default Date Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Default Date Range
                                </label>
                                <Select 
                                    value={reportSettings.defaultDateRange} 
                                    onValueChange={(value) => setReportSettings({...reportSettings, defaultDateRange: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7d">Last 7 days</SelectItem>
                                        <SelectItem value="30d">Last 30 days</SelectItem>
                                        <SelectItem value="90d">Last 90 days</SelectItem>
                                        <SelectItem value="1y">Last year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Default Sorting */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Default Sort By
                                    </label>
                                    <Select 
                                        value={reportSettings.defaultSortBy} 
                                        onValueChange={(value) => setReportSettings({...reportSettings, defaultSortBy: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">Name</SelectItem>
                                            <SelectItem value="category">Category</SelectItem>
                                            <SelectItem value="stock">Stock Level</SelectItem>
                                            <SelectItem value="expiry">Expiry Date</SelectItem>
                                            <SelectItem value="status">Status</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort Order
                                    </label>
                                    <Select 
                                        value={reportSettings.defaultSortOrder} 
                                        onValueChange={(value) => setReportSettings({...reportSettings, defaultSortOrder: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asc">Ascending</SelectItem>
                                            <SelectItem value="desc">Descending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Max Results */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Results per Report
                                </label>
                                <Input
                                    type="number"
                                    value={reportSettings.maxResults}
                                    onChange={(e) => setReportSettings({...reportSettings, maxResults: parseInt(e.target.value) || 100})}
                                    min="1"
                                    max="1000"
                                />
                            </div>

                            {/* Notifications */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Auto Refresh Reports</label>
                                            <p className="text-xs text-gray-500">Automatically refresh dashboard analytics</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={reportSettings.autoRefresh}
                                            onChange={(e) => setReportSettings({...reportSettings, autoRefresh: e.target.checked})}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                                            <p className="text-xs text-gray-500">Receive email alerts for critical reports</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={reportSettings.emailNotifications}
                                            onChange={(e) => setReportSettings({...reportSettings, emailNotifications: e.target.checked})}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={() => setShowReportsSettings(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={saveReportsSettings}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Save Settings
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
}
