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
    Mail
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

    return (
        <AdminLayout header="Prescription Details">
            <Head title={`Prescription ${prescription.prescription_number}`} />

            <div className="space-y-6">
                {/* Header */}
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
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Dosage</p>
                                                        <p className="font-medium">{medicine.dosage}</p>
                                                    </div>
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
