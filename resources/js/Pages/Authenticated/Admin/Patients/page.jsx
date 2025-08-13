"use client";

import { useEffect, useState } from "react";
import PatientList from "./patient-list";
import PatientDetails from "./patient-details";
import AddPatientForm from "./add-patient-form";
import { Button } from "@/components/tempo/components/ui/button";
import { Plus, Users, Activity, Calendar, FileText } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import { router, usePage } from "@inertiajs/react";

// export interface Patient {
//   id: string
//   firstName: string
//   lastName: string
//   dateOfBirth: string
//   gender: string
//   phoneNumber: string
//   email?: string
//   address: string
//   emergencyContact: string
//   emergencyPhone: string
//   bloodType?: string
//   allergies?: string[]
//   medications?: string[]
//   medicalHistory?: MedicalRecord[]
//   lastVisit?: string
//   status: "active" | "inactive"
//   registrationDate: string
// }

// export interface MedicalRecord {
//   id: string
//   date: string
//   diagnosis: string
//   treatment: string
//   doctor: string
//   notes?: string
//   followUp?: string
// }

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

export default function PatientRecords({ patients_, doctors }) {
    const [patients, setPatients] = useState(patients_);

    const [selectedPatient, setSelectedPatient] = useState(null);

    const { flash } = usePage().props;

    useEffect(() => {
        setPatients(patients_);
    }, [patients_]);

    // useEffect(() => {
    //     router.visit({
    //         only: ["patients_", "doctors", "flash"],
    //     });
    // }, [flash]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [view, setView] = useState("list");

    const handleAddPatient = (newPatient) => {
        const patient = {
            ...newPatient,
            id: Date.now().toString(),
            registrationDate: new Date().toISOString().split("T")[0],
        };
        setPatients([...patients, patient]);
        setView("list");
        setShowAddForm(false);
    };

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setView("details");
    };

    const handleUpdatePatient = (updatedPatient) => {
        setPatients(
            patients.map((p) =>
                p.id === updatedPatient.id ? updatedPatient : p
            )
        );
        setSelectedPatient(updatedPatient);
    };

    const totalPatients = patients.length;
    const activePatients = patients.filter((p) => p.status === "active").length;
    const recentVisits = patients.filter(
        (p) =>
            p.lastVisit &&
            new Date(p.lastVisit) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return (
        <AdminLayout header="Patients">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-gray-50">
                    {/* Header */}
                    {/* <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Patient Records
                                </h1>
                                <p className="text-gray-600">
                                    Rural Health Unit - Admin Dashboard
                                </p>
                            </div>
                            <Button
                                onClick={() => setView("add")}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Patient
                            </Button>
                        </div>
                    </div>
                </div> */}

                    {/* max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 */}
                    <div className="">
                        {/* Stats Cards */}
                        {view === "list" && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Patients
                                        </CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {totalPatients}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Registered patients
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Active Patients
                                        </CardTitle>
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {activePatients}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Currently active
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Recent Visits
                                        </CardTitle>
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {recentVisits}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Last 7 days
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Medical Records
                                        </CardTitle>
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {patients.reduce(
                                                (acc, p) =>
                                                    acc +
                                                    (p.medicalHistory?.length ||
                                                        0),
                                                0
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Total records
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Main Content */}
                        {view === "list" && (
                            <PatientList
                                patients={patients}
                                onSelectPatient={handleSelectPatient}
                            />
                        )}

                        {view === "details" && selectedPatient && (
                            <PatientDetails
                                patient={selectedPatient}
                                onBack={() => setView("list")}
                                onUpdate={handleUpdatePatient}
                                doctors={doctors}
                            />
                        )}

                        {view === "add" && (
                            <AddPatientForm
                                onSubmit={handleAddPatient}
                                onCancel={() => setView("list")}
                            />
                        )}
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
