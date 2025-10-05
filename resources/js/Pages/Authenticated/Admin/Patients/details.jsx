"use client";

import { useEffect, useState } from "react";
import PatientList from "./patient-list";
import PatientDetails from "./patient-details";
import AddPatientForm from "./add-patient-form";
import AddPrescriptionForm from "./AddPrescriptionForm";
import { Button } from "@/components/tempo/components/ui/button";
import {
    Plus,
    Users,
    Activity,
    Calendar,
    FileText,
    ArrowLeft,
    Edit,
    Phone,
    MapPin,
    Heart,
    Pill,
    AlertTriangle,
    Mail,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/tempo/components/ui/card";
import { Badge } from "@/components/tempo/components/ui/badge";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/tempo/components/ui/tabs";

import EditPatientForm from "./edit-patient-form";
import AddMedicalRecordForm from "./add-medical-record-form";

// Sample data
const samplePatients = [
    {
        id: "1",
        firstName: "Maria",
        lastName: "Santos",
        dateOfBirth: "1985-03-15",
        gender: "Female",
        phoneNumber: "+63 912 345 6789",
        email: "maria.santos@email.com",
        address: "123 Barangay Road, Rural Town, Province",
        emergencyContact: "Juan Santos (Husband)",
        emergencyPhone: "+63 912 345 6790",
        bloodType: "O+",
        allergies: ["Penicillin"],
        medications: ["Metformin 500mg"],
        lastVisit: "2024-01-15",
        status: "active",
        registrationDate: "2023-06-01",
        medicalHistory: [
            {
                id: "1",
                date: "2024-01-15",
                diagnosis: "Type 2 Diabetes",
                treatment: "Medication adjustment",
                doctor: "Dr. Rodriguez",
                notes: "Blood sugar levels improving",
            },
        ],
    },
    {
        id: "2",
        firstName: "Jose",
        lastName: "Cruz",
        dateOfBirth: "1978-11-22",
        gender: "Male",
        phoneNumber: "+63 917 654 3210",
        address: "456 Village Street, Rural Town, Province",
        emergencyContact: "Ana Cruz (Wife)",
        emergencyPhone: "+63 917 654 3211",
        bloodType: "A+",
        allergies: [],
        medications: ["Lisinopril 10mg"],
        lastVisit: "2024-01-10",
        status: "active",
        registrationDate: "2023-08-15",
    },
    {
        id: "3",
        firstName: "Elena",
        lastName: "Reyes",
        dateOfBirth: "1992-07-08",
        gender: "Female",
        phoneNumber: "+63 905 123 4567",
        address: "789 Mountain View, Rural Town, Province",
        emergencyContact: "Pedro Reyes (Father)",
        emergencyPhone: "+63 905 123 4568",
        bloodType: "B+",
        allergies: ["Shellfish"],
        medications: [],
        lastVisit: "2023-12-20",
        status: "active",
        registrationDate: "2023-05-10",
    },
];

export default function PatientRecords({ patients_, doctors, patient, medicines, isAdminView = false }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showAddRecord, setShowAddRecord] = useState(false);
    const [showAddPrescription, setShowAddPrescription] = useState(false);

    // Debug logging
    console.log('PatientRecords props:', { patient, medicines, doctors });

    const calculateAge = (dateOfBirth) => {
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
            // Check if it's prescription data
            if (data.medicines && data.doctor_id) {
                post(
                    route("patients.prescription.store", { patientid: patient?.id }),
                    {
                        onSuccess: () => {
                            setShowAddPrescription(false);
                        },
                        onFinish: () => {
                            router.reload({
                                only: ["patient", "doctors", "medicines", "flash"],
                            });
                        },
                    }
                );
            } else {
                // Medical record data
                post(
                    route("patients.medicalrec.store", { patientid: patient?.id }),
                    {
                        onSuccess: () => {
                            setShowAddRecord(false);
                        },
                        onFinish: () => {
                            router.reload({
                                only: ["patients_", "doctors", "flash"],
                            });
                        },
                    }
                );
            }
        }
    }, [data]);

    // Real-time updates for prescriptions and medicines
    useEffect(() => {
        if (window.Echo) {
            const channel = window.Echo.channel('inventory-updates')
                .listen('InventoryUpdated', (e) => {
                    console.log('Inventory updated, refreshing patient data...', e);
                    router.reload({
                        only: ["patient", "medicines"],
                    });
                });

            return () => {
                window.Echo.leaveChannel('inventory-updates');
            };
        }
    }, []);

    const GetCurrentView = () => {
        if (isEditing) {
            return (
                <EditPatientForm
                    patient={patient}
                    // isOpen={isEditing}
                    // onClose={() => setIsEditing(false)}
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

        if (showAddPrescription && !isAdminView) {
            console.log('Passing props to AddPrescriptionForm:', { patient, doctors, medicines });
            return (
                <AddPrescriptionForm
                    patient={patient}
                    doctors={doctors}
                    medicines={medicines}
                    onSubmit={(prescriptionData) => setData(prescriptionData)}
                    onCancel={() => setShowAddPrescription(false)}
                    errors={errors}
                />
            );
        }

        return (
            <div className="bg-gray-50">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={(e) => {
                                    router.visit(route("patients.index"));
                                }}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to List
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {patient.firstName} {patient.lastName}
                                </h1>
                                <p className="text-muted-foreground">
                                    Patient ID: {patient.id} • Age:{" "}
                                    {calculateAge(patient.birth)} • Name:{" "}
                                    {patient?.firstname} {patient?.lastname}
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
                                Medical Records
                            </TabsTrigger>
                            {!isAdminView && (
                                <TabsTrigger value="prescriptions">
                                    Prescriptions
                                </TabsTrigger>
                            )}
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
                                                {patient.firstname}{" "}
                                                {patient.lastname}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Date of Birth
                                            </label>
                                            <p>
                                                {new Date(
                                                    patient.birth
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Gender
                                            </label>
                                            <p>
                                                {patient.gender == "M"
                                                    ? "Male"
                                                    : patient.gender == "F"
                                                    ? "Female"
                                                    : ""}
                                            </p>
                                        </div>
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
                                                <p>{patient.contactno}</p>
                                            </div>
                                        </div>

                                        {patient.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Email
                                                    </label>
                                                    <p>{patient.email}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Address
                                                </label>
                                                <p>
                                                    {patient.address ??
                                                        "Not Set"}
                                                </p>
                                            </div>
                                        </div>

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
                                            {patient?.emercont?.map(
                                                (contact) => (
                                                    <p>{contact.name}</p>
                                                )
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Phone Number
                                            </label>
                                            {patient?.emercont?.map(
                                                (contact) => (
                                                    <p>{contact.contactno}</p>
                                                )
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm text-center font-medium text-muted-foreground">
                                                Action
                                            </label>
                                            {patient?.emercont?.map(
                                                (contact) => (
                                                    <p key={contact?.id}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Edit className="h-4 w-4 text-primary" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </p>
                                                )
                                            )}
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

                        <TabsContent
                            value="medical-history"
                            className="space-y-6"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Medical History</CardTitle>
                                    <CardDescription>
                                        Complete medical record history for this
                                        patient
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {patient.medical_histories &&
                                    patient.medical_histories.length > 0 ? (
                                        <div className="space-y-4">
                                            {patient.medical_histories.map(
                                                (record) => (
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
                                                                            record
                                                                                ?.doctor
                                                                                ?.user
                                                                                ?.firstname
                                                                        }{" "}
                                                                        {
                                                                            record
                                                                                ?.doctor
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
                                                                        {
                                                                            record.diagnosis
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-medium text-muted-foreground">
                                                                        Treatment
                                                                    </label>
                                                                    <p>
                                                                        {
                                                                            record.treatment
                                                                        }
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
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            No medical records found for this
                                            patient.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {!isAdminView && (
                            <TabsContent value="prescriptions" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Prescriptions</CardTitle>
                                            <CardDescription>
                                                Prescription history and management for this patient
                                            </CardDescription>
                                        </div>
                                        <Button onClick={() => setShowAddPrescription(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Prescription
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {patient.prescriptions && patient.prescriptions.length > 0 ? (
                                        <div className="space-y-4">
                                            {patient.prescriptions.map((prescription) => (
                                                <Card key={prescription.id}>
                                                    <CardContent className="pt-6">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div>
                                                                <h3 className="font-semibold">
                                                                    {prescription.prescription_number}
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {new Date(prescription.prescription_date).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <Badge 
                                                                variant={
                                                                    prescription.status === 'pending' ? 'warning' :
                                                                    prescription.status === 'dispensed' ? 'success' : 'secondary'
                                                                }
                                                            >
                                                                {prescription.status}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <label className="text-sm font-medium text-muted-foreground">
                                                                    Doctor
                                                                </label>
                                                                <p>{prescription.doctor_name}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-sm font-medium text-muted-foreground">
                                                                    Case ID
                                                                </label>
                                                                <p>{prescription.case_id || 'N/A'}</p>
                                                            </div>
                                                        </div>

                                                        {prescription.medicines && prescription.medicines.length > 0 && (
                                                            <div>
                                                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                                                    Medicines
                                                                </label>
                                                                <div className="space-y-2">
                                                                    {prescription.medicines.map((medicine, index) => (
                                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                                            <div>
                                                                                <p className="font-medium">{medicine.medicine_name}</p>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {medicine.dosage} - {medicine.frequency} - {medicine.duration}
                                                                                </p>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="text-sm font-medium">Qty: {medicine.quantity}</p>
                                                                                {medicine.is_dispensed && (
                                                                                    <Badge variant="success" className="text-xs">
                                                                                        Dispensed
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {prescription.notes && (
                                                            <div className="mt-4">
                                                                <label className="text-sm font-medium text-muted-foreground">
                                                                    Notes
                                                                </label>
                                                                <p className="text-sm">{prescription.notes}</p>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-muted-foreground mb-4">
                                                No prescriptions found for this patient.
                                            </p>
                                            <Button onClick={() => setShowAddPrescription(true)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Prescription
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        )}

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
            </div>
        );
    };

    return (
        <AdminLayout header="Patients">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* {getCurrentView()} */}
                <GetCurrentView />
            </motion.div>
        </AdminLayout>
    );
}
