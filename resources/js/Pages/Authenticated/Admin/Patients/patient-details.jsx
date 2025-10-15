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
    Plus,
} from "lucide-react";
import EditPatientForm from "./edit-patient-form";
import AddMedicalRecordForm from "./add-medical-record-form";
import { Trash2 } from "lucide-react";
import { router, useForm } from "@inertiajs/react";

// interface PatientDetailsProps {
//   patient: Patient
//   onBack: () => void
//   onUpdate: (patient: Patient) => void
// }

export default function PatientDetails({ patient, onBack, onUpdate, doctors }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showAddRecord, setShowAddRecord] = useState(false);
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

    const {
        data,
        setData,
        post,
        processing,
        recentlySuccessful,
        errors,
        clearErrors,
        reset,
    } = useForm({});

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            post(
                route("patients.medicalrec.store", { patientid: patient?.id }),
                {
                    onSuccess: () => {
                        setShowAddRecord(false);
                    },
                    onFinish: () => {
                        router.reload({
                            only: ["patients_", "doctors", "flash"],
                            //preserveState: false,
                        });
                    },
                }
            );
        }
    }, [data]);

    // Remove the early return for editing - we'll render the modal alongside the main content

    if (showAddRecord) {
        return (
            <AddMedicalRecordForm
                patientName={`${patient.firstname} ${patient.lastname}`}
                onSubmit={(record) => setData(record)}
                onCancel={() => setShowAddRecord(false)}
                doctors={doctors}
                errors={errors}
            />
        );
    }

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
                    <Button onClick={() => setShowAddRecord(true)} className="bg-green-600 hover:bg-green-700 shadow-sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medical Record
                    </Button>
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
                    <TabsTrigger value="medications">
                        Medications & Allergies
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 overflow-y-auto">
                    {/* Professional Patient Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Personal Information Card */}
                        <Card className="shadow-lg border-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">
                                            {patient.firstname} {patient.middlename} {patient.lastname}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">
                                            {(patient.gender || patient.sex) == "M" || (patient.gender || patient.sex) == "Male"
                                                ? "Male"
                                                : (patient.gender || patient.sex) == "F" || (patient.gender || patient.sex) == "Female"
                                                ? "Female"
                                                : (patient.gender || patient.sex) || "Not specified"}
                                        </p>
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
                        <Card className="shadow-lg border-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Phone className="w-5 h-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
                                    <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-green-600" />
                                        {patient.contactno || patient.phone || "Not Set"}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
                                    <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        {patient.email || "Not Set"}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                                    <div className="text-sm text-gray-900 mt-1">
                                        {isAppointmentPatient ? (
                                            <div className="space-y-1">
                                                {patient.street && <p className="flex items-center gap-2"><MapPin className="w-3 h-3 text-purple-600" />{patient.street}</p>}
                                                {patient.barangay && <p className="ml-5">{patient.barangay}</p>}
                                                {patient.city && <p className="ml-5">{patient.city}</p>}
                                                {patient.province && <p className="ml-5">{patient.province}</p>}
                                                {patient.region && <p className="ml-5">{patient.region}</p>}
                                                {patient.zip_code && <p className="ml-5">{patient.zip_code}</p>}
                                                {patient.country && <p className="ml-5">{patient.country}</p>}
                                                {!patient.street && !patient.barangay && !patient.city && !patient.province && !patient.region && !patient.zip_code && !patient.country && (
                                                    <p className="text-gray-500 italic">No address provided</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-purple-600" />
                                                {patient.address ?? "Not Set"}
                                            </p>
                                        )}
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
                        <Card className="shadow-lg border-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Medical & Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Patient Status</label>
                                    <div className="mt-1">
                                        <Badge
                                            variant={patient.status === "active" ? "default" : "secondary"}
                                            className="text-sm px-3 py-1"
                                        >
                                            {patient.status}
                                        </Badge>
                                    </div>
                                </div>
                                
                                {isAppointmentPatient && (
                                    <>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registration Date</label>
                                            <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-600" />
                                                {patient.registration_date ? new Date(patient.registration_date).toLocaleDateString() : "Not Set"}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Appointments</label>
                                            <p className="text-2xl font-bold text-orange-600 mt-1">
                                                {patient.appointment_count || 1}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Emergency Contact & Visit Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Emergency Contact Card */}
                        <Card className="shadow-lg border-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <AlertTriangle className="w-5 h-5" />
                                    Emergency Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {patient?.emercont && patient.emercont.length > 0 ? (
                                    <div className="space-y-3">
                                        {patient.emercont.map((contact, index) => (
                                            <div key={contact?.id || index} className="bg-gray-50 p-3 rounded-lg border">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-600">Contact #{index + 1}</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => handleEditEmergencyContact(contact)}
                                                            title="Edit emergency contact"
                                                            className="h-6 w-6 p-0"
                                                        >
                                                            <Edit className="h-3 w-3 text-primary" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => handleDeleteEmergencyContact(contact.id)}
                                                            title="Delete emergency contact"
                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact Person</label>
                                                        <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
                                                        <p className="text-sm text-gray-700">{contact.contactno}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Plus className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-1">No Emergency Contacts</h3>
                                        <p className="text-xs text-gray-500 mb-3">Add emergency contact information for this patient.</p>
                                        <Button variant="outline" size="sm" className="text-xs">
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Emergency Contact
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Visit Information Card */}
                        <Card className="shadow-lg border-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Calendar className="w-5 h-5" />
                                    Visit Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registration Date</label>
                                    <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-green-600" />
                                        {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 
                                         patient.registration_date ? new Date(patient.registration_date).toLocaleDateString() : 
                                         "Not available"}
                                    </p>
                                </div>

                                {patient.lastVisit && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Visit</label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            {new Date(patient.lastVisit).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {isAppointmentPatient && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Appointments</label>
                                        <p className="text-2xl font-bold text-orange-600 mt-1">
                                            {patient.appointment_count || 1}
                                        </p>
                                    </div>
                                )}

                                {patient.prescriptions && patient.prescriptions.length > 0 && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Prescriptions</label>
                                        <p className="text-2xl font-bold text-purple-600 mt-1 flex items-center gap-2">
                                            <Pill className="w-5 h-5" />
                                            {patient.prescriptions.length}
                                        </p>
                                    </div>
                                )}

                                {patient.medical_histories && patient.medical_histories.length > 0 && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Medical Records</label>
                                        <p className="text-2xl font-bold text-red-600 mt-1">
                                            {patient.medical_histories.length}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="medical-history" className="space-y-4 overflow-y-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical History</CardTitle>
                            <CardDescription>
                                Complete medical record history for this patient
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {patient.medical_histories &&
                            patient.medical_histories.length > 0 ? (
                                <div className="space-y-4">
                                    {patient.medical_histories.map((record) => (
                                        <Card key={record.id}>
                                            <CardContent className="pt-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            Date
                                                        </label>
                                                        <p>
                                                            {new Date(
                                                                record.created_at
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            Doctor
                                                        </label>
                                                        <p>
                                                            {
                                                                record?.doctor
                                                                    ?.user
                                                                    ?.firstname
                                                            }{" "}
                                                            {
                                                                record?.doctor
                                                                    ?.user
                                                                    ?.lastname
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            Diagnosis
                                                        </label>
                                                        <p>
                                                            {record.diagnosis}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            Treatment
                                                        </label>
                                                        <p>
                                                            {record.treatment}
                                                        </p>
                                                    </div>
                                                    {record.clinic_notes && (
                                                        <div className="md:col-span-2">
                                                            <label className="text-sm font-medium text-muted-foreground">
                                                                Notes
                                                            </label>
                                                            <p>
                                                                {
                                                                    record.clinic_notes
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    {record.followUp && (
                                                        <div className="md:col-span-2">
                                                            <label className="text-sm font-medium text-muted-foreground">
                                                                Follow-up
                                                            </label>
                                                            <p>
                                                                {
                                                                    record.followup_inst
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">
                                    No medical records found for this patient.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="medications" className="space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current Medications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Pill className="h-5 w-5" />
                                    Current Medications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {patient.medications &&
                                patient.medications.length > 0 ? (
                                    <div className="space-y-2">
                                        {patient.medications.map(
                                            (medication, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="mr-2 mb-2"
                                                >
                                                    {medication}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">
                                        No current medications recorded.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Allergies */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Known Allergies
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {patient.allergies &&
                                patient.allergies.length > 0 ? (
                                    <div className="space-y-2">
                                        {patient.allergies.map(
                                            (allergy, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="destructive"
                                                    className="mr-2 mb-2"
                                                >
                                                    {allergy}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">
                                        No known allergies recorded.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
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
