import React, { useRef } from 'react';
import { X, Printer, Calendar, User, FileText, Package, CheckCircle, Building2, Clock, Hash, Stethoscope } from 'lucide-react';
import { Button } from '@/components/tempo/components/ui/button';

const DispenseSummary = ({ 
    isOpen, 
    onClose, 
    dispenseData, 
    mode = 'prescription' // 'prescription' or 'manual'
}) => {
    const summaryRef = useRef(null);

    if (!isOpen || !dispenseData) return null;

    // Debug logging to see the data structure
    console.log('DispenseSummary dispenseData:', dispenseData);
    console.log('Dispensed items:', dispenseData.dispensed_items);
    if (dispenseData.dispensed_items && dispenseData.dispensed_items.length > 0) {
        console.log('First item:', dispenseData.dispensed_items[0]);
        console.log('First item quantity:', dispenseData.dispensed_items[0].quantity);
    }

    const handlePrint = () => {
        // Create a clean print-optimized content
        const printContent = `
                <div class="print-container">
                    <!-- System Header -->
                    <div class="header">
                        <h1>RHU Calumpang Management System</h1>
                        <h2>Dispense Summary</h2>
                        <div class="generated-time">Generated on ${formatDate(new Date())}</div>
                    </div>

                    <!-- Dispense Information -->
                    <div class="summary-section">
                        <div class="summary-title">Dispense Information</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Dispense Mode:</span>
                                <span class="info-value">${mode}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Dispense Date:</span>
                                <span class="info-value">${formatDate(dispenseData.dispense_date)}</span>
                            </div>
                            ${mode === 'prescription' ? `
                                <div class="info-item">
                                    <span class="info-label">Patient:</span>
                                    <span class="info-value">${dispenseData.patient_name || 'N/A'}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Case ID:</span>
                                    <span class="info-value">${dispenseData.case_id || 'N/A'}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Doctor:</span>
                                    <span class="info-value">${dispenseData.doctor_name || 'N/A'}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Prescription ID:</span>
                                    <span class="info-value">RX-${String(dispenseData.prescription_id).padStart(6, '0')}</span>
                                </div>
                            ` : ''}
                            ${mode === 'manual' && dispenseData.reason_for_dispensing ? `
                                <div class="info-item">
                                    <span class="info-label">Reason:</span>
                                    <span class="info-value">${dispenseData.reason_for_dispensing}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Dispensed Items -->
                    <div class="summary-section">
                        <div class="summary-title">Dispensed Items</div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Batch Number</th>
                                    <th>Quantity</th>
                                    <th>Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dispenseData.dispensed_items?.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.batch_number}</td>
                                        <td>${item.quantity || item.qty || 'N/A'}</td>
                                        <td>${item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                `).join('') || '<tr><td colspan="4">No items dispensed</td></tr>'}
                            </tbody>
                        </table>
                    </div>

                    <!-- Transaction Summary -->
                    <div class="summary-section">
                        <div class="summary-title">Transaction Summary</div>
                        <div class="summary-stats">
                            <div class="stat-item">
                                <div class="stat-label">Total Items</div>
                                <div class="stat-value">${dispenseData.dispensed_items?.length || 0}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Total Quantity</div>
                                <div class="stat-value">${dispenseData.dispensed_items?.reduce((sum, item) => sum + (item.quantity || item.qty || 0), 0) || 0}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Transaction Status</div>
                                <div class="stat-value">Completed</div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <div class="system-name">RHU Calumpang Management System</div>
                        <div class="disclaimer">This is a computer-generated dispense summary. Generated on ${formatDate(new Date())}</div>
                    </div>
                </div>
            `;

            // Create print window with clean content
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            
            // Create a safer print document without TrustedScript issues
            const printDocument = printWindow.document;
            printDocument.open();
            printDocument.write(`
                <!DOCTYPE html>
            <html>
                <head>
                    <title>Dispense Summary - ${dispenseData.patient_name || 'Manual Dispense'}</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        * { 
                            box-sizing: border-box; 
                            margin: 0; 
                            padding: 0; 
                        }
                        
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            margin: 0; 
                            padding: 0; 
                            background: white; 
                            font-size: 11pt;
                            line-height: 1.4;
                            color: #333;
                        }
                        
                        .print-container {
                            max-width: 100%;
                            margin: 0 auto;
                            padding: 0;
                        }
                        
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            border-bottom: 4px solid #059669; 
                            padding-bottom: 25px; 
                            page-break-inside: avoid;
                            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                            padding: 25px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        
                        .header h1 { 
                            color: #059669; 
                            font-size: 20pt; 
                            margin: 0 0 10px 0; 
                            font-weight: bold;
                            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
                        }
                        
                        .header h2 { 
                            color: #374151; 
                            font-size: 16pt; 
                            margin: 0 0 10px 0; 
                            font-weight: 600;
                        }
                        
                        .header .generated-time {
                            color: #6b7280;
                            font-size: 10pt;
                            font-weight: normal;
                        }
                        
                        .summary-section { 
                            margin-bottom: 20px; 
                            background: #f8fafc; 
                            padding: 15px; 
                            border: 1px solid #e2e8f0; 
                            border-radius: 6px;
                            page-break-inside: avoid;
                        }
                        
                        .summary-title { 
                            font-size: 12pt; 
                            font-weight: bold; 
                            margin-bottom: 12px; 
                            color: #1e293b; 
                            border-bottom: 1px solid #cbd5e1;
                            padding-bottom: 6px;
                        }
                        
                        .info-grid { 
                            display: grid; 
                            grid-template-columns: 1fr 1fr; 
                            gap: 15px; 
                            margin-bottom: 15px; 
                        }
                        
                        .info-item { 
                            margin-bottom: 8px; 
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                        
                        .info-label { 
                            font-weight: 600; 
                            color: #475569; 
                            font-size: 9pt; 
                            min-width: 80px;
                        }
                        
                        .info-value { 
                            color: #1e293b; 
                            font-size: 10pt; 
                            font-weight: 500;
                        }
                        
                        .items-table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px; 
                            background: white; 
                            font-size: 9pt;
                            border: 2px solid #374151;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        }
                        
                        .items-table th, .items-table td { 
                            border: 1px solid #6b7280; 
                            padding: 10px 8px; 
                            text-align: left; 
                            vertical-align: middle;
                        }
                        
                        .items-table th { 
                            background-color: #f1f5f9; 
                            font-weight: bold; 
                            color: #334155; 
                            font-size: 9pt;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        
                        .items-table tr:nth-child(even) { 
                            background-color: #f8fafc; 
                        }
                        
                        .items-table tr:hover {
                            background-color: #f1f5f9;
                        }
                        
                        .summary-stats {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 15px;
                            margin-top: 15px;
                        }
                        
                        .stat-item {
                            background: #f8fafc;
                            padding: 12px;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            text-align: center;
                        }
                        
                        .stat-label {
                            font-size: 9pt;
                            color: #64748b;
                            font-weight: 600;
                            margin-bottom: 4px;
                        }
                        
                        .stat-value {
                            font-size: 12pt;
                            color: #1e293b;
                            font-weight: bold;
                        }
                        
                        .footer { 
                            margin-top: 25px; 
                            text-align: center; 
                            font-size: 9pt; 
                            color: #64748b; 
                            background: #f1f5f9; 
                            padding: 12px; 
                            border-radius: 6px; 
                            border: 1px solid #e2e8f0;
                            page-break-inside: avoid;
                        }
                        
                        .footer .system-name {
                            font-weight: bold;
                            color: #059669;
                            margin-bottom: 4px;
                        }
                        
                        .footer .disclaimer {
                            font-size: 8pt;
                            color: #94a3b8;
                        }
                        
                        /* Print-specific styles */
                        @media print { 
                            body { 
                                margin: 0; 
                                padding: 0; 
                                font-size: 10pt;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            
                            .no-print { 
                                display: none !important; 
                            }
                            
                            .items-table { 
                                font-size: 8pt;
                                page-break-inside: avoid;
                            }
                            
                            .items-table th, .items-table td { 
                                padding: 6px 4px; 
                            }
                            
                            .summary-section {
                                page-break-inside: avoid;
                                margin-bottom: 15px;
                            }
                            
                            .header {
                                page-break-after: avoid;
                            }
                            
                            .footer {
                                page-break-before: avoid;
                            }
                            
                            /* Ensure proper spacing */
                            .print-container {
                                padding: 0;
                            }
                        }
                        
                        @page {
                            margin: 0.75in 0.5in;
                            size: A4;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
            printDocument.close();
            
            // Wait for content to load before printing
            setTimeout(() => {
                printWindow.print();
            }, 100);
    };


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-gray-200">
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Dispense Summary</h2>
                                <p className="text-green-100 text-sm">Transaction completed successfully</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrint}
                                className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-green-700 flex items-center gap-2"
                            >
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)] bg-gray-50">
                    <div ref={summaryRef} className="dispense-summary">
                        {/* System Header */}
                        <div className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm border">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Building2 className="h-8 w-8 text-green-600" />
                                <h1 className="text-3xl font-bold text-gray-900">
                                    RHU Calumpang Management System
                                </h1>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                Dispense Summary
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                Generated on {formatDate(new Date())}
                            </div>
                        </div>

                        {/* Enhanced Dispense Information */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Dispense Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Package className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Dispense Mode</div>
                                            <div className="font-semibold text-gray-900 capitalize">{mode}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Calendar className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Dispense Date</div>
                                            <div className="font-semibold text-gray-900">{formatDate(dispenseData.dispense_date)}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {mode === 'prescription' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 p-2 rounded-lg">
                                                <User className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Patient</div>
                                                <div className="font-semibold text-gray-900">{dispenseData.patient_name}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-2 rounded-lg">
                                                <Hash className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Case ID</div>
                                                <div className="font-semibold text-gray-900">{dispenseData.case_id}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-2 rounded-lg">
                                                <Stethoscope className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Doctor</div>
                                                <div className="font-semibold text-gray-900">{dispenseData.doctor_name || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-100 p-2 rounded-lg">
                                                <FileText className="h-4 w-4 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Prescription ID</div>
                                                <div className="font-semibold text-gray-900">RX-{String(dispenseData.prescription_id).padStart(6, '0')}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {mode === 'manual' && dispenseData.reason_for_dispensing && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-yellow-100 p-2 rounded-lg">
                                                <FileText className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Reason</div>
                                                <div className="font-semibold text-gray-900">{dispenseData.reason_for_dispensing}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Dispensed Items */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <Package className="h-5 w-5 text-green-600" />
                                Dispensed Items
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dispenseData.dispensed_items?.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                                                            <Package className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {item.batch_number}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                                        {item.quantity || item.qty || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Enhanced Summary Statistics */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Transaction Summary
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-blue-600">Total Items</div>
                                            <div className="text-3xl font-bold text-blue-900">
                                                {dispenseData.dispensed_items?.length || 0}
                                            </div>
                                        </div>
                                        <div className="bg-blue-200 p-3 rounded-full">
                                            <Package className="h-6 w-6 text-blue-700" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-green-600">Total Quantity</div>
                                            <div className="text-3xl font-bold text-green-900">
                                                {dispenseData.dispensed_items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                                            </div>
                                        </div>
                                        <div className="bg-green-200 p-3 rounded-full">
                                            <CheckCircle className="h-6 w-6 text-green-700" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-purple-600">Transaction Status</div>
                                            <div className="text-lg font-bold text-purple-900">Completed</div>
                                        </div>
                                        <div className="bg-purple-200 p-3 rounded-full">
                                            <CheckCircle className="h-6 w-6 text-purple-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Footer */}
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                                <Building2 className="h-4 w-4" />
                                <span>RHU Calumpang Management System</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                This is a computer-generated dispense summary. Generated on {formatDate(new Date())}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Footer Actions */}
                <div className="bg-white border-t border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Transaction completed successfully
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                onClick={onClose}
                                className="px-6 py-2"
                            >
                                Close
                            </Button>
                            <Button 
                                onClick={handlePrint} 
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-2"
                            >
                                <Printer className="h-4 w-4" />
                                Print Summary
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DispenseSummary;
