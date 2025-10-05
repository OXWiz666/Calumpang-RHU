import React, { useState } from "react";
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
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
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
            'low_stock_alert': 'Low Stock Alert',
            'expiry_report': 'Expiry Report',
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

    // Helper function to print report from history
    const printReportFromHistory = (report) => {
        if (report.data) {
            setGeneratedReport(report.data);
            // Trigger print after a short delay to ensure report is set
            setTimeout(() => {
                printReport();
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

    // Report types configuration
    const reportTypes = [
        {
            id: "inventory_summary",
            title: "Inventory Summary",
            description: "Complete overview of current inventory status",
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            id: "dispensing_report",
            title: "Dispensing Report",
            description: "Detailed report of all dispensed medications",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            id: "low_stock_alert",
            title: "Low Stock Alert",
            description: "Items that need immediate restocking",
            icon: AlertTriangle,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            id: "expiry_report",
            title: "Expiry Report",
            description: "Medications approaching expiration date",
            icon: Clock,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            id: "expired_batches",
            title: "Expired Batches Report",
            description: "Summary of all expired medication batches",
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },

        {
            id: "custom_report",
            title: "Custom Report",
            description: "Create a custom report with specific criteria",
            icon: FileText,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
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
            category: item.category?.name || 'Uncategorized',
            manufacturer: item.manufacturer || 'N/A',
            quantity: item.stock?.stocks || 0,
            unit: item.unit_type || 'pieces',
            batchNumber: item.batch_number || 'N/A',
            expiryDate: item.expiry_date || 'N/A',
            storageLocation: item.storage_location || 'N/A',
            minimumStock: item.minimum_stock || 10,
            maximumStock: item.maximum_stock || 100,
            status: item.status || 1,
            createdAt: item.created_at,
            updatedAt: item.updated_at
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
                    title: 'Low Stock Alert Report',
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
                    title: 'Expiry Report',
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
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const reportData = generateReportData(selectedReport);
        setGeneratedReport(reportData);
        
        // Save report to history
        saveReportToHistory(reportData, selectedReport);
        
        setIsGenerating(false);
    };

    // Download as PDF
    const downloadAsPDF = async () => {
        if (!generatedReport) return;
        
        const element = document.getElementById('report-content');
        if (!element) return;
        
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save(`${generatedReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    // Download as Excel
    const downloadAsExcel = () => {
        if (!generatedReport) return;
        
        try {
            // Prepare data for Excel based on report type
            let excelData;
            
            if (selectedReport === 'dispensing_report') {
                excelData = generatedReport.items.map(item => ({
                    'Item Name': item.name,
                    'Manufacturer': item.manufacturer,
                    'Patient Name': item.patientName,
                    'Prescription Number': item.prescriptionNumber,
                    'Quantity': item.quantity,
                    'Unit': item.unit,
                    'Batch Number': item.batchNumber,
                    'Dispensed By': item.staffName,
                    'Reason': item.reason,
                    'Notes': item.notes,
                    'Dispensed Date': new Date(item.dispensedAt).toLocaleDateString(),
                    'Dispensed Time': new Date(item.dispensedAt).toLocaleTimeString()
                }));
            } else {
                excelData = generatedReport.items.map(item => ({
                    'Item Name': item.name,
                    'Category': item.category,
                    'Manufacturer': item.manufacturer,
                    'Quantity': item.quantity,
                    'Unit': item.unit,
                    'Batch Number': item.batchNumber,
                    'Expiry Date': item.expiryDate !== 'N/A' ? new Date(item.expiryDate).toLocaleDateString() : 'N/A',
                    'Storage Location': item.storageLocation,
                    'Status': getItemStatus(item).replace('_', ' ').toUpperCase(),
                    'Minimum Stock': item.minimumStock,
                    'Maximum Stock': item.maximumStock
                }));
            }
            
            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);
            
            // Set column widths based on report type
            const colWidths = selectedReport === 'dispensing_report' ? [
                { wch: 25 }, // Item Name
                { wch: 20 }, // Manufacturer
                { wch: 20 }, // Patient Name
                { wch: 15 }, // Prescription Number
                { wch: 10 }, // Quantity
                { wch: 10 }, // Unit
                { wch: 15 }, // Batch Number
                { wch: 20 }, // Dispensed By
                { wch: 20 }, // Reason
                { wch: 30 }, // Notes
                { wch: 12 }, // Dispensed Date
                { wch: 12 }  // Dispensed Time
            ] : [
                { wch: 25 }, // Item Name
                { wch: 15 }, // Category
                { wch: 20 }, // Manufacturer
                { wch: 10 }, // Quantity
                { wch: 10 }, // Unit
                { wch: 15 }, // Batch Number
                { wch: 12 }, // Expiry Date
                { wch: 15 }, // Storage Location
                { wch: 12 }, // Status
                { wch: 12 }, // Minimum Stock
                { wch: 12 }  // Maximum Stock
            ];
            ws['!cols'] = colWidths;
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Report Data');
            
            // Add summary sheet
            if (Object.keys(generatedReport.summary).length > 0) {
                const summaryData = Object.entries(generatedReport.summary).map(([key, value]) => ({
                    'Metric': key.replace(/([A-Z])/g, ' $1').trim(),
                    'Value': value
                }));
                const summaryWs = XLSX.utils.json_to_sheet(summaryData);
                XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
            }
            
            // Save file
            XLSX.writeFile(wb, `${generatedReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error generating Excel:', error);
            alert('Error generating Excel file. Please try again.');
        }
    };

    // Print report
    const printReport = () => {
        if (!generatedReport) return;
        
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        
        const reportContent = document.getElementById('report-content');
        if (!reportContent) return;
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>${generatedReport.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .summary { margin-bottom: 30px; }
                        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; }
                        .summary-item { text-align: center; padding: 15px; background: #f5f5f5; border-radius: 8px; }
                        .summary-value { font-size: 24px; font-weight: bold; color: #333; }
                        .summary-label { font-size: 12px; color: #666; text-transform: uppercase; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; font-weight: bold; }
                        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
                        .status-in_stock { background: #d4edda; color: #155724; }
                        .status-low_stock { background: #fff3cd; color: #856404; }
                        .status-out_of_stock { background: #f8d7da; color: #721c24; }
                        .status-expired { background: #f8d7da; color: #721c24; }
                        .status-expiring_soon { background: #ffeaa7; color: #856404; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${generatedReport.title}</h1>
                        <p>Generated on ${new Date(generatedReport.generatedAt).toLocaleString()}</p>
                    </div>
                    
                    ${Object.keys(generatedReport.summary).length > 0 ? `
                        <div class="summary">
                            <h2>Summary</h2>
                            <div class="summary-grid">
                                ${Object.entries(generatedReport.summary).map(([key, value]) => `
                                    <div class="summary-item">
                                        <div class="summary-value">${value}</div>
                                        <div class="summary-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <h2>Items (${generatedReport.items.length})</h2>
                    <table>
                        <thead>
                            <tr>
                                ${selectedReport === 'dispensing_report' ? `
                                    <th>Item Name</th>
                                    <th>Patient</th>
                                    <th>Quantity</th>
                                    <th>Batch Number</th>
                                    <th>Prescription #</th>
                                    <th>Dispensed By</th>
                                    <th>Date</th>
                                ` : `
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Batch Number</th>
                                    <th>Expiry Date</th>
                                    <th>Status</th>
                                `}
                            </tr>
                        </thead>
                        <tbody>
                            ${generatedReport.items.map(item => {
                                if (selectedReport === 'dispensing_report') {
                                    return `
                                        <tr>
                                            <td>${item.name}<br><small>${item.manufacturer}</small></td>
                                            <td>${item.patientName}<br><small>${item.prescriptionNumber}</small></td>
                                            <td>${item.quantity} ${item.unit}</td>
                                            <td>${item.batchNumber}</td>
                                            <td>${item.prescriptionNumber}</td>
                                            <td>${item.staffName}<br><small>${item.reason}</small></td>
                                            <td>${new Date(item.dispensedAt).toLocaleDateString()}<br><small>${new Date(item.dispensedAt).toLocaleTimeString()}</small></td>
                                        </tr>
                                    `;
                                } else {
                                    const status = getItemStatus(item);
                                    const statusText = {
                                        'in_stock': 'In Stock',
                                        'low_stock': 'Low Stock',
                                        'out_of_stock': 'Out of Stock',
                                        'expired': 'Expired',
                                        'expiring_soon': 'Expiring Soon'
                                    };
                                    return `
                                        <tr>
                                            <td>${item.name}<br><small>${item.manufacturer}</small></td>
                                            <td>${item.category}</td>
                                            <td>${item.quantity} ${item.unit}</td>
                                            <td>${item.batchNumber}</td>
                                            <td>${item.expiryDate !== 'N/A' ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
                                            <td><span class="status-badge status-${status}">${statusText[status]}</span></td>
                                        </tr>
                                    `;
                                }
                            }).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Reports & Analytics
                        </h1>
                        <p className="text-gray-600">
                            Generate and manage inventory reports
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                            Print All
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Reports
                        </Button>
                    </div>
                </div>

                {/* Report Generation Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Generate New Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reportTypes.map((report) => (
                                <motion.div
                                    key={report.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <button
                                        onClick={() => setSelectedReport(report.id)}
                                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                                            selectedReport === report.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${report.bgColor}`}>
                                                <report.icon className={`h-5 w-5 ${report.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 mb-1">
                                                    {report.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {report.description}
                                                </p>
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
                                className="mt-6 p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex flex-col sm:flex-row gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date Range
                                        </label>
                                        <Select value={dateRange} onValueChange={setDateRange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select date range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="7d">Last 7 days</SelectItem>
                                                <SelectItem value="30d">Last 30 days</SelectItem>
                                                <SelectItem value="90d">Last 90 days</SelectItem>
                                                <SelectItem value="1y">Last year</SelectItem>
                                                <SelectItem value="custom">Custom range</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Search Items
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search items..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={generateReport} 
                                        disabled={isGenerating}
                                        className="flex items-center gap-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                        <FileText className="h-4 w-4" />
                                        Generate Report
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>

                {/* Generated Report Display */}
                {generatedReport && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        {generatedReport.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setGeneratedReport(null)}
                                        >
                                            Close
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex items-center gap-1"
                                                onClick={downloadAsPDF}
                                            >
                                                <Download className="h-4 w-4" />
                                                PDF
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex items-center gap-1"
                                                onClick={downloadAsExcel}
                                            >
                                                <Download className="h-4 w-4" />
                                                Excel
                                            </Button>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex items-center gap-1"
                                            onClick={printReport}
                                        >
                                            <Printer className="h-4 w-4" />
                                            Print
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Generated on {new Date(generatedReport.generatedAt).toLocaleString()}
                                </p>
                            </CardHeader>
                            <CardContent id="report-content">
                                {/* Report Summary */}
                                {Object.keys(generatedReport.summary).length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                            {Object.entries(generatedReport.summary).map(([key, value]) => (
                                                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Report Items Table */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Items ({generatedReport.items.length})
                                    </h3>
                                    
                                    {generatedReport.items.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="border-b bg-gray-50">
                                                        {selectedReport === 'dispensing_report' ? (
                                                            <>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Item Name</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Batch Number</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Prescription #</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Dispensed By</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Item Name</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Batch Number</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Expiry Date</th>
                                                                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                                            </>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {generatedReport.items.map((item, index) => {
                                                        if (selectedReport === 'dispensing_report') {
                                                            return (
                                                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                                                    <td className="py-3 px-4">
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">{item.name}</p>
                                                                            <p className="text-sm text-gray-500">{item.manufacturer}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">{item.patientName}</p>
                                                                            <p className="text-sm text-gray-500">{item.prescriptionNumber}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        <span className="font-medium">{item.quantity}</span>
                                                                        <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
                                                                    </td>
                                                                    <td className="py-3 px-4 font-mono text-sm">{item.batchNumber}</td>
                                                                    <td className="py-3 px-4 font-mono text-sm">{item.prescriptionNumber}</td>
                                                                    <td className="py-3 px-4">
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">{item.staffName}</p>
                                                                            <p className="text-sm text-gray-500">{item.reason}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        <span className="text-sm text-gray-600">
                                                                            {new Date(item.dispensedAt).toLocaleDateString()}
                                                                        </span>
                                                                        <br />
                                                                        <span className="text-xs text-gray-400">
                                                                            {new Date(item.dispensedAt).toLocaleTimeString()}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        } else {
                                                            const status = getItemStatus(item);
                                                            const statusColors = {
                                                                'in_stock': 'bg-green-100 text-green-800',
                                                                'low_stock': 'bg-yellow-100 text-yellow-800',
                                                                'out_of_stock': 'bg-red-100 text-red-800',
                                                                'expired': 'bg-red-100 text-red-800',
                                                                'expiring_soon': 'bg-orange-100 text-orange-800'
                                                            };
                                                            const statusText = {
                                                                'in_stock': 'In Stock',
                                                                'low_stock': 'Low Stock',
                                                                'out_of_stock': 'Out of Stock',
                                                                'expired': 'Expired',
                                                                'expiring_soon': 'Expiring Soon'
                                                            };
                                                            
                                                            return (
                                                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                                                    <td className="py-3 px-4">
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">{item.name}</p>
                                                                            <p className="text-sm text-gray-500">{item.manufacturer}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3 px-4 text-gray-600">{item.category}</td>
                                                                    <td className="py-3 px-4">
                                                                        <span className="font-medium">{item.quantity}</span>
                                                                        <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
                                                                    </td>
                                                                    <td className="py-3 px-4 font-mono text-sm">{item.batchNumber}</td>
                                                                    <td className="py-3 px-4">
                                                                        {item.expiryDate !== 'N/A' ? (
                                                                            <span className={`${
                                                                                isExpired(item.expiryDate) ? 'text-red-600' :
                                                                                isExpiringSoon(item.expiryDate) ? 'text-orange-600' :
                                                                                'text-gray-600'
                                                                            }`}>
                                                                                {new Date(item.expiryDate).toLocaleDateString()}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-gray-400">N/A</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        <Badge className={statusColors[status]}>
                                                                            {statusText[status]}
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>No items found for this report.</p>
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
                            {recentReports.length > 0 ? (
                                recentReports.map((report, index) => (
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
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex items-center gap-1"
                                                    onClick={() => printReportFromHistory(report)}
                                                >
                                                    <Printer className="h-3 w-3" />
                                                    Print
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

                {/* Expired Batches Summary */}
                {(expiredBatchesCount > 0 || expiringSoonBatchesCount > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="space-y-6"
                    >
                        {/* Expired Batches Alert */}
                        {expiredBatchesCount > 0 && (
                            <Card className="border-red-200 bg-red-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-800">
                                        <XCircle className="h-5 w-5" />
                                        Expired Batches Alert
                                        <Badge className="bg-red-100 text-red-800 border-red-200">
                                            {expiredBatchesCount} batches
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-4 bg-white rounded-lg border border-red-200">
                                            <p className="text-sm text-red-600">Total Expired Batches</p>
                                            <p className="text-2xl font-bold text-red-800">{expiredBatchesCount}</p>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-lg border border-red-200">
                                            <p className="text-sm text-red-600">Action Required</p>
                                            <p className="text-2xl font-bold text-red-800">Dispose</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-red-700">
                                            These batches have expired and should be disposed of immediately.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                className="border-red-300 text-red-700 hover:bg-red-100"
                                                onClick={() => setShowExpiredBatches(!showExpiredBatches)}
                                            >
                                                {showExpiredBatches ? 'Hide Details' : 'View Details'}
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={handleBulkDispose}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Dispose All
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {showExpiredBatches && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 space-y-2 max-h-96 overflow-y-auto"
                                        >
                                            {expiredBatches.map((batch, index) => (
                                                <div key={batch.id} className="p-3 bg-white rounded-lg border border-red-200">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-medium text-gray-900">{batch.name}</h4>
                                                                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                                                    EXPIRED
                                                                </Badge>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                                                <span>Batch: {batch.batch_number}</span>
                                                                <span>Qty: {batch.quantity} {batch.unit}</span>
                                                                <span>Expired: {new Date(batch.expiry_date).toLocaleDateString()}</span>
                                                                <span>Days: {batch.days_expired} ago</span>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="border-red-300 text-red-700 hover:bg-red-100"
                                                            onClick={() => handleDisposeBatch(batch)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Dispose
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Expiring Soon Alert */}
                        {expiringSoonBatchesCount > 0 && (
                            <Card className="border-amber-200 bg-amber-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-amber-800">
                                        <AlertCircle className="h-5 w-5" />
                                        Expiring Soon Alert
                                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                            {expiringSoonBatchesCount} batches
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                                            <p className="text-sm text-amber-600">Expiring Soon</p>
                                            <p className="text-2xl font-bold text-amber-800">{expiringSoonBatchesCount}</p>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                                            <p className="text-sm text-amber-600">Action Required</p>
                                            <p className="text-2xl font-bold text-amber-800">Use First</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-amber-700">
                                        These batches are expiring within 30 days and should be prioritized for use.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Batch Disposal Modal */}
            <BatchDisposalModal
                open={disposalModalOpen}
                onClose={handleDisposalClose}
                item={selectedBatchForDisposal}
                multi={bulkDisposalMode}
                itemsForMulti={bulkDisposalMode ? expiredBatches : []}
            />
        </AdminLayout>
    );
}
