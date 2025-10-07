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

    if (isEditing) {
        return (
            <EditPatientForm
                patient={patient}
                onSubmit={(updatedPatient) => {
                    onUpdate(updatedPatient);
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to List
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {patient.firstName} {patient.lastName}
                        </h1>
                        <p className="text-muted-foreground">
                            Patient ID: {patient.id} • Age:{" "}
                            {calculateAge(patient.birth)}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowAddRecord(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medical Record
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Patient
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="medical-history">
                        Medical History
                    </TabsTrigger>
                    <TabsTrigger value="medications">
                        Medications & Allergies
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Full Name
                                    </label>
                                    <p className="text-lg">
                                        {patient.firstname} {patient.middlename} {patient.lastname}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Patient ID
                                    </label>
                                    <p className="font-mono text-sm">
                                        {patient.id}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Gender
                                    </label>
                                    <p>
                                        {(patient.gender || patient.sex) == "M" || (patient.gender || patient.sex) == "Male"
                                            ? "Male"
                                            : (patient.gender || patient.sex) == "F" || (patient.gender || patient.sex) == "Female"
                                            ? "Female"
                                            : (patient.gender || patient.sex) || "Not specified"}
                                    </p>
                                </div>
                                {isAppointmentPatient && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Total Appointments
                                        </label>
                                        <p>
                                            {patient.appointment_count || 1}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mr-2">
                                        Status
                                    </label>
                                    <Badge
                                        variant={
                                            patient.status === "active"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {patient.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Phone
                                        </label>
                                        <p>{patient.contactno || patient.phone || "Not Set"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </label>
                                        <p>{patient.email || "Not Set"}</p>
                                    </div>
                                </div>

                                {isAppointmentPatient && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Registration Date
                                            </label>
                                            <p>{patient.registration_date ? new Date(patient.registration_date).toLocaleDateString() : "Not Set"}</p>
                                        </div>
                                    </div>
                                )}

                                {!isAppointmentPatient && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Address
                                            </label>
                                            <p>{patient.address ?? "Not Set"}</p>
                                        </div>
                                    </div>
                                )}

                                {patient.bloodtype && (
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Blood Type
                                            </label>
                                            <p>{patient.bloodtype}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Emergency Contact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Contact Person
                                    </label>
                                    {patient?.emercont?.map((contact) => (
                                        <p>{contact.name}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Phone Number
                                    </label>
                                    {patient?.emercont?.map((contact) => (
                                        <p>{contact.contactno}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-sm text-center font-medium text-muted-foreground">
                                        Action
                                    </label>
                                    {patient?.emercont?.map((contact) => (
                                        <div key={contact?.id} className="flex gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleEditEmergencyContact(contact)}
                                                title="Edit emergency contact"
                                            >
                                                <Edit className="h-4 w-4 text-primary" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleDeleteEmergencyContact(contact.id)}
                                                title="Delete emergency contact"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visit Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Visit Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Registration Date
                                        </label>
                                        <p>
                                            {new Date(
                                                patient.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {patient.lastVisit && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Last Visit
                                            </label>
                                            <p>
                                                {new Date(
                                                    patient.lastVisit
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="medical-history" className="space-y-6">
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

                <TabsContent value="medications" className="space-y-6">
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
        </div>
    );
}
