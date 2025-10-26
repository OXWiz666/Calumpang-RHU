import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/tempo/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { Badge } from '@/components/tempo/components/ui/badge';
import { 
    ArrowLeft, 
    Calendar, 
    User, 
    Pill,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Phone,
    Mail,
    Printer
} from 'lucide-react';

export default function ViewPrescription({ prescription }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case 'dispensed':
                return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Dispensed</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Prescription - ${prescription.prescription_number}</title>
                <style>
                    @page {
                        size: A4;
                        margin: 0.5in;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        font-size: 11pt;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                        background: #fff;
                        color: #333;
                    }
                    .prescription-header {
                        text-align: center;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #000;
                        padding-bottom: 10px;
                    }
                    .doctor-name {
                        font-weight: bold;
                        font-size: 14pt;
                        text-transform: uppercase;
                        margin-bottom: 5px;
                    }
                    .clinic-info {
                        font-size: 11pt;
                        margin-bottom: 3px;
                    }
                    .patient-info {
                        display: flex;
                        justify-content: space-between;
                        margin: 20px 0;
                        border-bottom: 1px solid #000;
                        padding-bottom: 10px;
                    }
                    .patient-left {
                        flex: 1;
                    }
                    .patient-right {
                        flex: 1;
                        margin-left: 20px;
                    }
                    .patient-field {
                        display: flex;
                        margin-bottom: 8px;
                    }
                    .patient-label {
                        font-weight: bold;
                        width: 80px;
                        margin-right: 10px;
                    }
                    .patient-value {
                        border-bottom: 1px solid #000;
                        flex: 1;
                        padding-bottom: 2px;
                        font-style: italic;
                    }
                    .prescription-content {
                        padding: 25px;
                        background: #fff;
                        min-height: 250px;
                    }
                    .rx-symbol {
                        font-size: 32pt;
                        font-weight: 900;
                        margin-right: 20px;
                        display: inline-block;
                        vertical-align: top;
                        color:rgb(0, 0, 0);
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                        font-family: 'Georgia', serif;
                    }
                    .medicine-item {
                        margin-bottom: 15px;
                        display: flex;
                        align-items: flex-start;
                    }
                    .medicine-details {
                        flex: 1;
                    }
                    .medicine-name {
                        font-weight: bold;
                        font-style: italic;
                        margin-bottom: 3px;
                    }
                    .medicine-instructions {
                        font-style: italic;
                        margin-top: 5px;
                    }
                    .medicine-quantity {
                        font-weight: bold;
                        margin-left: 10px;
                    }
                    .doctor-signature {
                        margin-top: 50px;
                        text-align: right;
                        padding: 20px;
                        background: #f8fafc;
                        border-top: 2px solid #e5e7eb;
                    }
                    .signature-line {
                        border-bottom: 2px solid rgb(0, 0, 0);
                        width: 250px;
                        margin: 25px 0 10px auto;
                        height: 2px;
                    }
                    .doctor-credentials {
                        text-align: right;
                        font-size: 11pt;
                        margin-top: 8px;
                    }
                    .doctor-credentials strong {
                        color: rgb(0, 0, 0);
                        font-size: 12pt;
                    }
                    .license-info {
                        font-size: 9pt;
                        margin-top: 8px;
                        color: #6b7280;
                        line-height: 1.4;
                    }
                    .prescription-date {
                        text-align: right;
                        margin-bottom: 20px;
                        font-size: 10pt;
                        color: #6b7280;
                        font-weight: 500;
                    }
                    @media print {
                        body { margin: 0; padding: 0; }
                        .no-print { display: none; }
                        .prescription-container { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="prescription-header">
                        <div class="doctor-name">${prescription.doctor.name}</div>
                        <div class="clinic-info">Calumpang Rural Health Unit</div>
                        <div class="clinic-info">Calumpang, General Santos City</div>
                        <div class="clinic-info">Tel No: (083) 554-0146</div>
                    </div>

                    <div class="patient-info">
                        <div class="patient-left">
                            <div class="patient-field">
                                <span class="patient-label">Name:</span>
                                <span class="patient-value">${prescription.patient.name}</span>
                            </div>
                            <div class="patient-field">
                                <span class="patient-label">Address:</span>
                                <span class="patient-value">${prescription.patient.address || 'N/A'}</span>
                            </div>
                            <div class="patient-field">
                                <span class="patient-label">Date:</span>
                                <span class="patient-value">${prescription.prescription_date}</span>
                            </div>
                        </div>
                        <div class="patient-right">
                            <div class="patient-field">
                                <span class="patient-label">Sex:</span>
                                <span class="patient-value">${prescription.patient.gender || 'N/A'}</span>
                            </div>
                            <div class="patient-field">
                                <span class="patient-label">Age:</span>
                                <span class="patient-value">${prescription.patient.age || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="prescription-content">
                        <div class="prescription-date">Prescription #${prescription.prescription_number}</div>
                        <div class="rx-symbol">Rx</div>
                        <div style="display: inline-block; width: calc(100% - 80px);">
                            ${prescription.medicines.map(medicine => `
                                <div class="medicine-item">
                                    <div class="medicine-details">
                                        <div class="medicine-name">
                                            ${medicine.medicine.name} ${medicine.medicine.generic_name ? `(${medicine.medicine.generic_name})` : ''}
                                        </div>
                                        <div class="medicine-instructions">
                                            ${medicine.frequency} ${medicine.duration} ${medicine.instructions ? `- ${medicine.instructions}` : ''}
                                        </div>
                                    </div>
                                    <div class="medicine-quantity">${medicine.quantity}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="doctor-signature">
                        <div class="signature-line"></div>
                        <div class="doctor-credentials">
                            <strong>Dr. ${prescription.doctor.name}</strong><br>
                            <div class="license-info">
                                Lic. No: ${prescription.doctor.license_number || 'N/A'}
                            </div>
                        </div>
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
        <AdminLayout header="Prescription Details">
            <Head title={`Prescription ${prescription.prescription_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('doctor.prescriptions')}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Prescriptions
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{prescription.prescription_number}</h1>
                            <p className="text-gray-600">Prescription Details</p>
                        </div>
                    </div>
                    {prescription.status === 'dispensed' && (
                        <Button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                            <Printer className="h-4 w-4" />
                            Print Prescription
                        </Button>
                    )}
                </div>

                {/* Prescription Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Patient Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Patient Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-medium">{prescription.patient.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date of Birth</p>
                                <p className="font-medium">{prescription.patient.date_of_birth}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Age</p>
                                <p className="font-medium">{prescription.patient.age}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Gender</p>
                                <p className="font-medium capitalize">{prescription.patient.gender}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Contact</p>
                                <p className="font-medium">{prescription.patient.contact_number}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prescription Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Prescription Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Prescription Number</p>
                                <p className="font-medium">{prescription.prescription_number}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-medium">{prescription.prescription_date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <div className="mt-1">{getStatusBadge(prescription.status)}</div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Doctor</p>
                                <p className="font-medium">{prescription.doctor.name}</p>
                            </div>
                            {prescription.dispensed_at && (
                                <div>
                                    <p className="text-sm text-gray-600">Dispensed At</p>
                                    <p className="font-medium">{prescription.dispensed_at}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Pill className="h-5 w-5" />
                                Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Total Medicines</p>
                                <p className="text-2xl font-bold text-blue-600">{prescription.medicines.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Dispensed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {prescription.medicines.filter(med => med.is_dispensed).length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {prescription.medicines.filter(med => !med.is_dispensed).length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Medicines List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5" />
                            Prescribed Medicines
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {prescription.medicines.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Pill className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>No medicines prescribed</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {prescription.medicines.map((medicine, index) => (
                                    <div key={medicine.id} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {medicine.medicine.name}
                                                    </h4>
                                                    {medicine.is_dispensed ? (
                                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Dispensed
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Frequency</p>
                                                        <p className="font-medium">{medicine.frequency}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Duration</p>
                                                        <p className="font-medium">{medicine.duration}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Quantity</p>
                                                        <p className="font-medium">{medicine.quantity} {medicine.medicine.unit}</p>
                                                    </div>
                                                </div>

                                                {medicine.instructions && (
                                                    <div className="mt-3">
                                                        <p className="text-gray-600 text-sm">Instructions</p>
                                                        <p className="text-sm italic">{medicine.instructions}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Notes */}
                {prescription.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">{prescription.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
