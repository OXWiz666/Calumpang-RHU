import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/tempo/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { Badge } from '@/components/tempo/components/ui/badge';
import { 
    Plus, 
    Eye, 
    FileText, 
    Calendar, 
    User, 
    Pill,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';

export default function DoctorPrescriptions({ prescriptions }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredPrescriptions = prescriptions.filter(prescription => {
        const patientName = prescription.patient_name || '';
        const prescriptionNumber = prescription.prescription_number || '';
        const searchLower = searchTerm.toLowerCase();
        
        const matchesSearch = patientName.toLowerCase().includes(searchLower) ||
                            prescriptionNumber.toLowerCase().includes(searchLower);
        const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
        <AdminLayout header="Prescriptions">
            <Head title="Prescriptions" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
                        <p className="text-gray-600">Manage patient prescriptions</p>
                    </div>
                    <Link href={route('doctor.prescriptions.create')}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New Prescription
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by patient name or prescription number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="dispensed">Dispensed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Prescriptions List */}
                <div className="space-y-4">
                    {filteredPrescriptions.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm || statusFilter !== 'all' 
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first prescription.'
                                    }
                                </p>
                                {!searchTerm && statusFilter === 'all' && (
                                    <Link href={route('doctor.prescriptions.create')}>
                                        <Button>Create Prescription</Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        filteredPrescriptions.map((prescription) => (
                            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {prescription.prescription_number}
                                                </h3>
                                                {getStatusBadge(prescription.status)}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>{prescription.patient_name || 'Unknown Patient'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{prescription.prescription_date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Pill className="h-4 w-4" />
                                                    <span>{prescription.medicines_count} medicines</span>
                                                </div>
                                            </div>

                                            {prescription.notes && (
                                                <p className="text-sm text-gray-600 mt-2 italic">
                                                    "{prescription.notes}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link href={route('doctor.prescriptions.show', prescription.id)}>
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {prescriptions.filter(p => p.status === 'pending').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Dispensed</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {prescriptions.filter(p => p.status === 'dispensed').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {prescriptions.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
