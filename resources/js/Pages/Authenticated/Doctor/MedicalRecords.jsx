import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/tempo/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { Badge } from '@/components/tempo/components/ui/badge';
import { 
    Plus, 
    Stethoscope, 
    Calendar, 
    User,
    ArrowLeft,
    FileText
} from 'lucide-react';

export default function MedicalRecords({ medicalRecords }) {
    const getRecordTypeColor = (type) => {
        switch (type) {
            case 'consultation':
                return 'bg-blue-100 text-blue-800';
            case 'checkup':
                return 'bg-green-100 text-green-800';
            case 'emergency':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRecordTypeIcon = (type) => {
        switch (type) {
            case 'consultation':
                return '🩺';
            case 'checkup':
                return '✅';
            case 'emergency':
                return '🚨';
            default:
                return '📋';
        }
    };

    return (
        <AdminLayout header="Medical Records">
            <Head title="Medical Records" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('doctor.home')}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
                            <p className="text-gray-600">Patient diagnoses and medical information</p>
                        </div>
                    </div>
                    <Link href={route('doctor.medical-records.create')}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Medical Record
                        </Button>
                    </Link>
                </div>

                {/* Medical Records List */}
                <div className="space-y-4">
                    {medicalRecords.data.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Records</h3>
                                <p className="text-gray-600 mb-4">
                                    You haven't created any medical records yet. Create your first diagnosis to get started.
                                </p>
                                <Link href={route('doctor.medical-records.create')}>
                                    <Button className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create First Medical Record
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        medicalRecords.data.map((record) => (
                            <Card key={record.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Stethoscope className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{record.patient_name}</CardTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={getRecordTypeColor(record.record_type)}>
                                                        {getRecordTypeIcon(record.record_type)} {record.record_type}
                                                    </Badge>
                                                    {record.is_admin_record && (
                                                        <Badge className="bg-purple-100 text-purple-800">
                                                            📋 Admin Entry
                                                        </Badge>
                                                    )}
                                                    <span className="text-sm text-gray-500">
                                                        {record.created_at}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Record ID</p>
                                            <p className="font-mono text-sm">#{record.id}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Diagnosis</h4>
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                                                {record.diagnosis}
                                            </p>
                                        </div>

                                        {/* Admin Medical Record Data */}
                                        {record.is_admin_record && record.admin_data && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                                <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    Patient Information
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-blue-700 font-medium">Name:</span>
                                                        <p className="text-blue-900">{record.admin_data.name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-blue-700 font-medium">Age:</span>
                                                        <p className="text-blue-900">{record.admin_data.age} years old</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-blue-700 font-medium">Sex:</span>
                                                        <p className="text-blue-900 capitalize">{record.admin_data.sex}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-blue-700 font-medium">Birthdate:</span>
                                                        <p className="text-blue-900">{record.admin_data.birthdate}</p>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <span className="text-blue-700 font-medium">Address:</span>
                                                        <p className="text-blue-900">{record.admin_data.address}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-blue-700 font-medium">Mother:</span>
                                                        <p className="text-blue-900">{record.admin_data.name_of_mother}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-blue-700 font-medium">Father:</span>
                                                        <p className="text-blue-900">{record.admin_data.name_of_father}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-blue-700 font-medium">Contact:</span>
                                                        <p className="text-blue-900">{record.admin_data.contact_no}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-blue-700 font-medium">NHTS Status: *</span>
                                                        <p className="text-blue-900">
                                                            {record.admin_data.nhts_status === 'nhts' ? 'Yes' : 
                                                             record.admin_data.nhts_status === 'non_nhts' ? 'No' : 
                                                             'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {record.follow_up_date && (
                                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>Follow-up: {record.follow_up_date}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 pt-2 border-t">
                                            <Link href={route('doctor.prescriptions.create')}>
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Create Prescription
                                                </Button>
                                            </Link>
                                            <span className="text-xs text-gray-500">
                                                Based on this diagnosis
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {medicalRecords.data.length > 0 && medicalRecords.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            Showing {medicalRecords.from} to {medicalRecords.to} of {medicalRecords.total} results
                        </p>
                        <div className="flex gap-2">
                            {medicalRecords.prev_page_url && (
                                <Link href={medicalRecords.prev_page_url}>
                                    <Button variant="outline" size="sm">Previous</Button>
                                </Link>
                            )}
                            {medicalRecords.next_page_url && (
                                <Link href={medicalRecords.next_page_url}>
                                    <Button variant="outline" size="sm">Next</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Workflow Info */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Stethoscope className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-blue-900 mb-2">Medical Workflow</h3>
                                <div className="text-sm text-blue-800 space-y-1">
                                    <p><strong>Step 1:</strong> Create Medical Record (Diagnosis) → <strong>Step 2:</strong> Create Prescription</p>
                                    <p className="text-xs text-blue-600">
                                        Each prescription must be based on an existing medical record with a diagnosis.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
