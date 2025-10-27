"use client";

import { useEffect, useState } from "react";
// import { Patient, MedicalRecord } from "./page";
import { Button } from "@/components/tempo/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { Badge } from "@/components/tempo/components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/tempo/components/ui/tabs";
import {
    ArrowLeft,
    Edit,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Heart,
    Pill,
    AlertTriangle,
} from "lucide-react";
import EditPatientForm from "./edit-patient-form";
import MedicalHistory from "./MedicalHistory";
import { Trash2 } from "lucide-react";

// interface PatientDetailsProps {
//   patient: Patient
//   onBack: () => void
//   onUpdate: (patient: Patient) => void
// }

export default function PatientDetails({ patient, onBack, onUpdate, doctors }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmergencyContact, setEditingEmergencyContact] = useState(null);

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'Unknown';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };

    // Check if this is an appointment-based patient
    const isAppointmentPatient = patient?.id?.startsWith('PAT_');


    // Emergency contact handlers
    const handleEditEmergencyContact = (contact) => {
        setEditingEmergencyContact(contact);
        // TODO: Implement edit emergency contact modal/form
        console.log('Edit emergency contact:', contact);
    };

    const handleDeleteEmergencyContact = (contactId) => {
        if (confirm('Are you sure you want to delete this emergency contact?')) {
            // TODO: Implement delete emergency contact API call
            console.log('Delete emergency contact:', contactId);
        }
    };


    return (
        <div className="space-y-4 h-full overflow-hidden">
        {/* Professional Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Button variant="outline" onClick={onBack} className="shadow-sm border-gray-300">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to List
                    </Button>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                            {patient.profile_picture ? (
                                <img 
                                    src={patient.profile_picture} 
                                    alt={`${patient.firstname} ${patient.lastname}`}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                patient.firstname?.charAt(0)?.toUpperCase() || 'P'
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {patient.firstname} {patient.middlename} {patient.lastname}
                            </h1>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Patient ID:</span>
                                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">{patient.id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Age:</span>
                                    <span className="text-sm font-semibold text-blue-600">
                                        {isAppointmentPatient ? 
                                            (patient.date_of_birth ? (() => {
                                                const birthDate = new Date(patient.date_of_birth);
                                                const today = new Date();
                                                let age = today.getFullYear() - birthDate.getFullYear();
                                                const monthDiff = today.getMonth() - birthDate.getMonth();
                                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                                    age--;
                                                }
                                                return age;
                                            })() : 'Unknown') : 
                                            calculateAge(patient.birth)
                                        } Years Old
                                    </span>
                                </div>
                                <Badge 
                                    variant={patient.status === "active" ? "default" : "secondary"}
                                    className="px-3 py-1"
                                >
                                    {patient.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="shadow-sm border-gray-300"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Patient
                    </Button>
                </div>
            </div>
        </div>

            <Tabs defaultValue="overview" className="space-y-4 h-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="medical-history">
                        Medical History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 overflow-y-auto">
                    {/* Professional Patient Information Grid - Full Width Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Personal Information Card */}
                        <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Full Name</label>
                                    <p className="text-lg font-bold text-blue-900 mt-1">
                                        {patient.firstname} {patient.middlename} {patient.lastname}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">
                                            {(patient.gender || patient.sex) == "M" || (patient.gender || patient.sex) == "Male"
                                                ? "Male"
                                                : (patient.gender || patient.sex) == "F" || (patient.gender || patient.sex) == "Female"
                                                ? "Female"
                                                : (patient.gender || patient.sex) || "Not specified"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                                        <div className="mt-1">
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                Active
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                
                                {isAppointmentPatient && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "Not provided"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</label>
                                                <p className="text-lg font-bold text-blue-600 mt-1">
                                                    {patient.date_of_birth ? (() => {
                                                        const birthDate = new Date(patient.date_of_birth);
                                                        const today = new Date();
                                                        let age = today.getFullYear() - birthDate.getFullYear();
                                                        const monthDiff = today.getMonth() - birthDate.getMonth();
                                                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                                            age--;
                                                        }
                                                        return age;
                                                    })() : "N/A"} Years Old
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Civil Status</label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {patient.civil_status || "Not provided"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationality</label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {patient.nationality || "Not provided"}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Religion</label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {patient.religion || "Not provided"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country</label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {patient.country || "Not provided"}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Information Card */}
                        <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Phone className="w-5 h-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Phone Number</label>
                                            <p className="text-lg font-bold text-blue-900 mt-1">
                                                {patient.contactno || patient.phone || "Not Set"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {patient.email || "Not Set"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                                            <div className="text-sm font-semibold text-gray-900 mt-1">
                                                {isAppointmentPatient ? (
                                                    <div className="space-y-1">
                                                        {patient.street && <p className="text-left">{patient.street}</p>}
                                                        {patient.barangay && <p className="text-left">{patient.barangay}</p>}
                                                        {patient.city && <p className="text-left">{patient.city}</p>}
                                                        {patient.province && <p className="text-left">{patient.province}</p>}
                                                        {patient.region && <p className="text-left">{patient.region}</p>}
                                                        {patient.zip_code && <p className="text-left">{patient.zip_code}</p>}
                                                        {patient.country && <p className="text-left">{patient.country}</p>}
                                                        {!patient.street && !patient.barangay && !patient.city && !patient.province && !patient.region && !patient.zip_code && !patient.country && (
                                                            <p className="text-gray-500 italic text-left">No address provided</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-left">
                                                        {patient.address ?? "Not Set"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {patient.bloodtype && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Blood Type</label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-red-600" />
                                            {patient.bloodtype}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Medical & Status Card */}
                        <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Medical & Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500 rounded-full">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Patient Status</label>
                                            <p className="text-lg font-bold text-blue-900 mt-1">Active & Available</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {isAppointmentPatient && (
                                    <>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registration Date</label>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                                        {patient.registration_date ? new Date(patient.registration_date).toLocaleDateString() : "Not Set"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Appointment</label>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                                        {patient.last_visit_date ? new Date(patient.last_visit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "No appointments recorded"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </TabsContent>

                <TabsContent value="medical-history" className="space-y-4 overflow-y-auto">
                    <MedicalHistory 
                        patient={patient} 
                        doctors={doctors}
                        onAddRecord={() => {}} // Not needed since it's handled internally
                    />
                </TabsContent>

            </Tabs>

            {/* Edit Patient Modal */}
            <EditPatientForm
                patient={patient}
                isOpen={isEditing}
                onSubmit={(updatedPatient) => {
                    onUpdate(updatedPatient);
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
            />
        </div>
    );
}
