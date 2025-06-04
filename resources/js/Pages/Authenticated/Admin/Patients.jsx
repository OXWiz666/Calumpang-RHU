import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/components/tempo/admin/include/Sidebar";
import {
    Search,
    Filter,
    UserPlus,
    ChevronDown,
    ChevronUp,
    Download,
} from "lucide-react";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableCaption,
    SortableTable,
    SortableTableHead,
} from "@/components/tempo/components/ui/table2";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

import AdminLayout from "@/Layouts/AdminLayout";
// Mock data for patients
const mockPatients = [
    {
        id: "P12345",
        name: "Maria Santos",
        age: 32,
        gender: "Female",
        contactNumber: "09123456789",
        address: "123 Rizal St., Calumpang",
        lastVisit: "2023-06-10",
        status: "Active",
        medicalConditions: "Hypertension, Diabetes",
        avatar: "maria",
    },
    {
        id: "P12346",
        name: "Juan Cruz",
        age: 45,
        gender: "Male",
        contactNumber: "09234567890",
        address: "456 Bonifacio Ave., Calumpang",
        lastVisit: "2023-05-22",
        status: "Active",
        medicalConditions: "Asthma",
        avatar: "juan",
    },
    {
        id: "P12347",
        name: "Elena Magtanggol",
        age: 28,
        gender: "Female",
        contactNumber: "09345678901",
        address: "789 Mabini St., Calumpang",
        lastVisit: "2023-06-05",
        status: "Pregnant",
        medicalConditions: "Pregnancy - 2nd Trimester",
        avatar: "elena",
    },
    {
        id: "P12348",
        name: "Pedro Penduko",
        age: 60,
        gender: "Male",
        contactNumber: "09456789012",
        address: "101 Aguinaldo St., Calumpang",
        lastVisit: "2023-04-15",
        status: "Inactive",
        medicalConditions: "Arthritis, Hypertension",
        avatar: "pedro",
    },
    {
        id: "P12349",
        name: "Lorna Diaz",
        age: 35,
        gender: "Female",
        contactNumber: "09567890123",
        address: "202 Luna St., Calumpang",
        lastVisit: "2023-06-12",
        status: "Active",
        medicalConditions: "None",
        avatar: "lorna",
    },
];

export default function Patients({ patients_ }) {
    // Get authentication information
    const { auth } = usePage().props;
    // Log auth object to console for debugging
    console.log("Auth object:", auth);
    
    // Check for doctor role in multiple ways to ensure we catch it
    const isDoctor = auth?.user?.role === "doctor" || 
                    auth?.user?.role === "Doctor" || 
                    auth?.user?.type === "doctor" || 
                    auth?.user?.type === "Doctor";
    
    const [patients, setPatients] = useState(patients_);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "ascending",
    });

    // State for medical record modal
    const [medicalRecordModal, setMedicalRecordModal] = useState({
        isOpen: false,
        patient: null
    });
    
    // State for diagnosis notes modal
    const [diagnosisModal, setDiagnosisModal] = useState({
        isOpen: false,
        patient: null,
        notes: ""
    });

    const openMedicalRecordModal = (patient) => {
        setMedicalRecordModal({
            isOpen: true,
            patient
        });
    };

    const closeMedicalRecordModal = () => {
        setMedicalRecordModal({
            ...medicalRecordModal,
            isOpen: false
        });
    };
    
    const openDiagnosisModal = (patient) => {
        setDiagnosisModal({
            isOpen: true,
            patient,
            notes: patient.diagnosis_notes || ""
        });
    };
    
    const closeDiagnosisModal = () => {
        setDiagnosisModal({
            ...diagnosisModal,
            isOpen: false
        });
    };
    
    const updateDiagnosisNotes = (notes) => {
        setDiagnosisModal({
            ...diagnosisModal,
            notes
        });
    };
    
    const saveDiagnosisNotes = () => {
        // Here you would typically save the notes to your backend
        // For now, we'll just update the local state and close the modal
        if (diagnosisModal.patient) {
            // In a real app, you would make an API call here
            console.log("Saving diagnosis notes:", diagnosisModal.notes);
        }
        closeDiagnosisModal();
    };

    // Medical Record Modal Component
    const MedicalRecordModal = () => {
        if (!medicalRecordModal.isOpen || !medicalRecordModal.patient) return null;
        
        const patient = medicalRecordModal.patient;
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                    onClick={closeMedicalRecordModal}
                ></div>
                
                {/* Modal */}
                <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-auto max-h-[90vh] transform transition-all">
                    {/* Header */}
                    <div className="sticky top-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
                        <h3 className="text-lg font-medium text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-semibold">Medical Record:</span> <span className="ml-2">{patient.firstname} {patient.lastname}</span>
                        </h3>
                        <button 
                            onClick={closeMedicalRecordModal}
                            className="text-white hover:text-gray-200 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Medical Record Content */}
                    <div className="p-6">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                            {/* 1. Patient Information */}
                            <div className="border-b border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800">
                                <h4 className="font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    1. Patient Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex">
                                            <span className="font-medium w-32 text-white">Name:</span>
                                            <span className="text-white">{patient.firstname} {patient.lastname}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-32 text-white">Address:</span>
                                            <span className="text-white">{patient.address || 'Purok ___, Brgy. Calumpang, GenSan'}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-32 text-white">Contact No.:</span>
                                            <span className="text-white">{patient.contactno || '___________'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex">
                                            <span className="font-medium w-32 text-white">Age:</span>
                                            <span className="text-white">{patient.age || '___'}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-32 text-white">Sex:</span>
                                            <span className="text-white">{patient.gender || 'M / F'}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-32 text-white">PhilHealth No.:</span>
                                            <span className="text-white">{patient.philhealth_no || '___________'}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-32 text-white">Created At:</span>
                                            <span className="text-white">{patient.created_at ? new Date(patient.created_at).toLocaleString() : 'Not available'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium w-32 text-white">4Ps Member:</span>
                                            <div className="flex items-center space-x-2">
                                                <input type="checkbox" id="4ps-yes" className="h-4 w-4" checked={patient.is_4ps} />
                                                <label htmlFor="4ps-yes" className="text-sm text-white">Yes</label>
                                                <input type="checkbox" id="4ps-no" className="h-4 w-4 ml-2" checked={!patient.is_4ps} />
                                                <label htmlFor="4ps-no" className="text-sm text-white">No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Vital Signs & Initial Assessment */}
                            <div className="border-b border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800">
                                <h4 className="font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    2. Vital Signs & Initial Assessment
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Date:</span>
                                        <span className="text-white">{patient.last_visit_date || '__/__/____'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex">
                                            <span className="font-medium w-16 text-white">BP:</span>
                                            <span className="text-white">{patient.bp || '___/__'} mmHg</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-16 text-white">Temp:</span>
                                            <span className="text-white">{patient.temp || '__'} °C</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-16 text-white">Pulse:</span>
                                            <span className="text-white">{patient.pulse || '___'} bpm</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-16 text-white">RR:</span>
                                            <span className="text-white">{patient.rr || '___'} breaths/min</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex">
                                            <span className="font-medium w-24 text-white">Height:</span>
                                            <span className="text-white">{patient.height || '___'} cm</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-24 text-white">Weight:</span>
                                            <span className="text-white">{patient.weight || '___'} kg</span>
                                        </div>
                                        <div className="flex">
                                            <span className="font-medium w-24 text-white">BMI:</span>
                                            <span className="text-white">{patient.bmi || '___'}</span>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Chief Complaint:</span>
                                        <span className="text-white">{patient.chief_complaint || '___________________'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Medical History */}
                            <div className="border-b border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800">
                                <h4 className="font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    3. Medical History
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Past Illnesses:</span>
                                        <span className="text-white">{patient.past_illnesses || '___________________'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Family History:</span>
                                        <span className="text-white">{patient.family_history || '___________________'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Allergies:</span>
                                        <span className="text-white">{patient.allergies || '___________________'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Current Medications:</span>
                                        <span className="text-white">{patient.current_medications || '___________________'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Consultation Details */}
                            <div className="p-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    4. Consultation Details
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Diagnosis/Findings:</span>
                                        <span className="text-white">{patient.diagnosis || '___________________'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Treatment Given:</span>
                                        <span className="text-white">{patient.treatment || '___________________'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Medications Prescribed:</span>
                                        <span className="text-white">{patient.medications_prescribed || '___________________'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium w-32 text-white">Referral Needed?</span>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="referral-yes" className="h-4 w-4" checked={patient.referral_needed} />
                                            <label htmlFor="referral-yes" className="text-sm text-white">Yes (Specify: {patient.referral_details || '_______'})</label>
                                            <input type="checkbox" id="referral-no" className="h-4 w-4 ml-2" checked={!patient.referral_needed} />
                                            <label htmlFor="referral-no" className="text-sm text-white">No</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Maternal & Child Health */}
                            <div className="border-b border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800">
                                <h4 className="font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    5. Maternal & Child Health
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="prenatal" className="h-4 w-4" checked={patient.prenatal_checkup} />
                                        <label htmlFor="prenatal" className="ml-2 text-white">Prenatal Checkup - LMP: {patient.lmp || '_________'} AOG: {patient.aog || '____'} weeks</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="postnatal" className="h-4 w-4" checked={patient.postnatal_checkup} />
                                        <label htmlFor="postnatal" className="ml-2 text-white">Postnatal Checkup - Date of Delivery: {patient.delivery_date || '___________'}</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="immunization" className="h-4 w-4" checked={patient.child_immunization} />
                                        <label htmlFor="immunization" className="ml-2 text-white">Child Immunization - Vaccine Given: {patient.vaccine_given || '___________'}</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="nutritional" className="h-4 w-4" checked={patient.nutritional_status} />
                                        <label htmlFor="nutritional" className="ml-2 text-white">Nutritional Status - </label>
                                        <div className="flex items-center space-x-2 ml-2">
                                            <input type="checkbox" id="normal" className="h-4 w-4" checked={patient.nutritional_status === 'Normal'} />
                                            <label htmlFor="normal" className="text-sm text-white">Normal</label>
                                            <input type="checkbox" id="underweight" className="h-4 w-4 ml-2" checked={patient.nutritional_status === 'Underweight'} />
                                            <label htmlFor="underweight" className="text-sm text-white">Underweight</label>
                                            <input type="checkbox" id="overweight" className="h-4 w-4 ml-2" checked={patient.nutritional_status === 'Overweight'} />
                                            <label htmlFor="overweight" className="text-sm text-white">Overweight</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 6. Follow-Up & Health Worker's Notes */}
                            <div className="p-5 bg-white dark:bg-gray-800">
                                <h4 className="font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    6. Follow-Up & Health Worker's Notes
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Next Visit Date:</span>
                                        <span className="text-white">{patient.next_visit_date || '__/__/____'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Health Advice Given:</span>
                                        <span className="text-white">{patient.health_advice || '___________________'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium w-32 text-white">Attending Health Worker:</span>
                                        <span className="text-white">{patient.attending_health_worker || '___________________'} (Signature)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-100 dark:bg-gray-800 px-6 py-3 flex justify-between border-t border-gray-200 dark:border-gray-700 shadow-inner">
                        <button 
                            onClick={() => openDiagnosisModal(patient)}
                            className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-md text-sm font-medium shadow-md flex items-center justify-center w-32 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Diagnosis Notes
                        </button>
                        <button 
                            onClick={closeMedicalRecordModal}
                            className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Diagnosis Notes Modal Component
    const DiagnosisNotesModal = () => {
        if (!diagnosisModal.isOpen || !diagnosisModal.patient) return null;
        
        const patient = diagnosisModal.patient;
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                    onClick={closeDiagnosisModal}
                ></div>
                
                {/* Modal */}
                <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-auto max-h-[90vh] transform transition-all">
                    {/* Header */}
                    <div className="sticky top-0 bg-primary border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
                        <h3 className="text-lg font-medium text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="font-semibold">Diagnosis Notes:</span> <span className="ml-2">{patient.firstname} {patient.lastname}</span>
                        </h3>
                        <button 
                            onClick={closeDiagnosisModal}
                            className="text-white hover:text-gray-200 rounded-full p-1 hover:bg-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="diagnosis-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Doctor's Diagnosis Notes
                                </label>
                                <textarea
                                    id="diagnosis-notes"
                                    rows={10}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
                                    placeholder="Enter detailed diagnosis notes here..."
                                    value={diagnosisModal.notes}
                                    onChange={(e) => updateDiagnosisNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-100 dark:bg-gray-800 px-6 py-3 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 shadow-inner">
                        <button 
                            onClick={closeDiagnosisModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={saveDiagnosisNotes}
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md flex items-center transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Notes
                        </button>
                    </div>
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
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-primary">
                            All Patients
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Filter by:
                                </span>
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="Active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="Inactive">
                                        Inactive
                                    </SelectItem>
                                    <SelectItem value="Pregnant">
                                        Pregnant
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <SortableTable
                            data={patients}
                            defaultSort={{
                                key: "user.firstname",
                                direction: "asc",
                            }}
                        >
                            {({ sortedData }) => (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {/* <SortableTableHead
                                                sortKey="id"
                                                sortable
                                            >
                                                ID
                                            </SortableTableHead> */}
                                            <SortableTableHead
                                                sortKey="user.firstname"
                                                sortable
                                            >
                                                Patient
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="user.birth"
                                                sortable
                                            >
                                                Birth
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="user.gender"
                                                sortable
                                            >
                                                Gender
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="user.contactno"
                                                sortable
                                            >
                                                Contact Information
                                            </SortableTableHead>
                                            <SortableTableHead>
                                                Last Visit
                                            </SortableTableHead>
                                            <SortableTableHead
                                                sortKey="created_at"
                                                sortable
                                            >
                                                Created At
                                            </SortableTableHead>
                                            <SortableTableHead>
                                                Action
                                            </SortableTableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedData.map((p, i) => (
                                            <TableRow>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=metformin`}
                                                                alt={
                                                                    p.firstname
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {`${p.firstname} ${p.lastname}`
                                                                    .split(" ")
                                                                    .map(
                                                                        (n) =>
                                                                            n[0]
                                                                    )
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">
                                                                {p.firstname}{" "}
                                                                {p.lastname}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                P - {p.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {p.birth ?? "Not Set"}
                                                </TableCell>
                                                <TableCell>
                                                    {p.gender}
                                                </TableCell>
                                                <TableCell>09123</TableCell>
                                                <TableCell>2023-5-3</TableCell>
                                                <TableCell>
                                                    {p.created_at ? new Date(p.created_at).toLocaleString() : 'Not available'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-24 text-sm px-4 py-1.5 shadow-sm flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md transition-colors"
                                                            onClick={() => openMedicalRecordModal(p)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            VIEW
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </SortableTable>
                    </div>
                </div>
            </motion.div>
            {MedicalRecordModal()}
            {DiagnosisNotesModal()}
        </AdminLayout>
    );
}
