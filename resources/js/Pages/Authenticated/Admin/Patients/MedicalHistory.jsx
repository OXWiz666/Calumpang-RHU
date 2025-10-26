"use client";

import React, { useState, useEffect } from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import { toast } from 'react-hot-toast';
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
    Heart,
    Plus,
    Calendar,
    User,
    FileText,
    Activity,
    Edit,
    Stethoscope,
} from "lucide-react";
import AddMedicalRecordForm from "./add-medical-record-form";

export default function MedicalHistory({ patient, doctors, onAddRecord }) {
    const [showAddRecord, setShowAddRecord] = useState(false);
    const [showEditRecord, setShowEditRecord] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [medicalRecords, setMedicalRecords] = useState(patient?.medical_records || []);

    // Get page props at the top level
    // const { flash } = usePage().props; // No longer needed since we're using direct JSON responses

    const {
        data,
        setData,
        post,
        put,
        processing,
        recentlySuccessful,
        errors,
        clearErrors,
        reset,
    } = useForm({});

    // Update medical records when patient data changes
    useEffect(() => {
        console.log('MedicalHistory - Patient data received:', patient);
        console.log('MedicalHistory - Medical records:', patient?.medical_records);
        console.log('MedicalHistory - Medical records length:', patient?.medical_records?.length);
        
        if (patient?.medical_records && Array.isArray(patient.medical_records)) {
            setMedicalRecords(patient.medical_records);
            console.log('MedicalHistory - Medical records set to state:', patient.medical_records);
        } else {
            console.log('MedicalHistory - No medical records found in patient data');
            setMedicalRecords([]);
        }
    }, [patient?.medical_records]);

    // Handle flash messages from backend redirects - No longer needed since we're using direct JSON responses
    // useEffect(() => {
    //     console.log('Medical History - Flash message check:', flash);
    //     if (flash?.success) {
    //         console.log('Medical History - Showing success toast:', flash.success);
    //         toast.success(flash.success);
    //     }
    //     if (flash?.error) {
    //         console.log('Medical History - Showing error toast:', flash.error);
    //         toast.error(flash.error);
    //     }
    // }, [flash]);

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            console.log('Medical History - Form data received:', data);
            console.log('Medical History - Patient object:', patient);
            console.log('Medical History - Patient ID:', patient?.id);
            
            // Close modal immediately
            if (showEditRecord) {
                setShowEditRecord(false);
            }
            if (showAddRecord) {
                setShowAddRecord(false);
            }
            
            // Check if patient ID exists
            if (!patient?.id) {
                console.error('Medical History - No patient ID found!');
                return;
            }
            
            // Determine if this is an update or create operation
            const isUpdate = showEditRecord && editingRecord && editingRecord.id;
            const routeName = isUpdate ? "admin.patients.medical-records.update" : "admin.patients.medical-records.store";
            
            console.log('Medical History - Using route:', routeName);
            console.log('Medical History - Is update:', isUpdate);
            console.log('Medical History - Patient ID:', patient?.id);
            console.log('Medical History - Patient ID (patient_id):', patient?.patient_id);
            console.log('Medical History - Patient object:', patient);
            console.log('Medical History - Editing record:', editingRecord);
            
            // Check if route exists and get the URL
            let routeUrl;
            try {
                if (isUpdate) {
                    routeUrl = route(routeName, { 
                        patient: patient?.patient_id || patient?.id, 
                        medicalRecord: editingRecord.id 
                    });
                } else {
                    routeUrl = route(routeName, { patient: patient?.patient_id || patient?.id });
                }
                console.log('Medical History - Route URL:', routeUrl);
                console.log('Medical History - Patient ID used:', patient?.patient_id || patient?.id);
            } catch (error) {
                console.error('Medical History - Route generation error:', error);
                return;
            }
            
            // Use Inertia post/put method for proper CSRF handling and page refresh
            const method = isUpdate ? 'put' : 'post';
            
            if (isUpdate) {
                // Use put method for updates
                put(
                    routeUrl,
                    { ...data },
                    {
                        preserveScroll: false,
                        preserveState: true,
                        onSuccess: () => {
                            console.log('Medical History - Update Success!');
                            toast.success('Medical record updated successfully!');
                            setShowAddRecord(false);
                            setShowEditRecord(false);
                            setEditingRecord(null);
                            reset();
                        },
                        onError: (errors) => {
                            console.error('Medical History - Error updating record:', errors);
                            toast.error('Failed to update medical record. Please try again.');
                            console.log('Medical History - Update errors:', errors);
                        },
                        onFinish: () => {
                            console.log('Medical History - Update request finished');
                            // Close modal after request finishes - use a small delay to ensure state update
                            setTimeout(() => {
                                setShowAddRecord(false);
                                setShowEditRecord(false);
                                setEditingRecord(null);
                            }, 50);
                        },
                    }
                );
            } else {
                // Use post method for creates
                post(
                    routeUrl,
                    { ...data },
                    {
                        preserveScroll: false,
                        preserveState: true,
                        onSuccess: () => {
                            console.log('Medical History - Create Success!');
                            toast.success('Medical record created successfully!');
                            setShowAddRecord(false);
                            reset();
                        },
                        onError: (errors) => {
                            console.error('Medical History - Error adding record:', errors);
                            toast.error('Failed to create medical record. Please try again.');
                            console.log('Medical History - Create errors:', errors);
                        },
                        onFinish: () => {
                            console.log('Medical History - Create request finished');
                            // Close modal after request finishes - use a small delay to ensure state update
                            setTimeout(() => {
                                setShowAddRecord(false);
                            }, 50);
                        },
                    }
                );
            }
        }
    }, [data]);

    // Remove conditional rendering - forms will be shown as modals

    return (
        <div className="space-y-6">
            {/* Header with Add/Edit Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
                    <p className="text-gray-600 mt-1">
                        Complete medical record history for {patient?.firstname} {patient?.lastname}
                    </p>
                </div>
                {medicalRecords && medicalRecords.length > 0 ? (
                    <Button 
                        onClick={() => {
                            setEditingRecord(medicalRecords[0]);
                            setShowEditRecord(true);
                        }} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Edit className="h-5 w-5 mr-2" />
                        Edit Medical Record
                    </Button>
                ) : (
                    <Button 
                        onClick={() => setShowAddRecord(true)} 
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Medical Record
                    </Button>
                )}
            </div>

            {/* Medical Records Display */}
            <Card>
                <CardContent className="p-6">
                    {medicalRecords && medicalRecords.length > 0 ? (
                        <div className="space-y-6">
                            <div className="border-b-2 border-blue-600 pb-4 mb-6">
                                <h3 className="text-2xl font-bold text-blue-800 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    Medical Records History
                                </h3>
                                <p className="text-base text-gray-700 mt-2 font-medium">Comprehensive medical documentation and patient health records</p>
                            </div>
                            {medicalRecords.map((record) => (
                                <Card key={record.id} className="border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-white shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                                    <Heart className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl font-bold text-white">Medical Record Entry</CardTitle>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-base text-blue-100 font-medium">
                                                            {record.appointment_service || 'Medical Record'}
                                                        </span>
                                                        <span className="text-base text-blue-100">
                                                            {record.appointment_date}
                                                        </span>
                                                        <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm font-semibold rounded-full border border-white border-opacity-30">
                                                            {record.record_type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base text-white font-semibold">Dr. {record.doctor_name}</p>
                                                <p className="text-sm text-blue-100">{record.created_at}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Symptoms, Treatment, and Notes are not displayed for admin medical records */}
                                            {/* Vital Signs and Measurements */}
                                            {record.admin_data && (
                                                <div className="md:col-span-2">
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                                                        <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                                                            <Stethoscope className="h-5 w-5" />
                                                            Vital Signs & Measurements
                                                        </h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                            {record.admin_data.weight && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                                                                    <span className="text-sm font-semibold text-green-700">Weight:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.weight} kg</span>
                                                                </div>
                                                            )}
                                                            {record.admin_data.height && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                                                                    <span className="text-sm font-semibold text-green-700">Height:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.height} cm</span>
                                                                </div>
                                                            )}
                                                            {record.admin_data.temperature && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                                                                    <span className="text-sm font-semibold text-green-700">Temperature:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.temperature}°C</span>
                                                                </div>
                                                            )}
                                                            {record.admin_data.rr && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                                                                    <span className="text-sm font-semibold text-green-700">RR:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.rr} bpm</span>
                                                                </div>
                                                            )}
                                                            {record.admin_data.pr && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                                                                    <span className="text-sm font-semibold text-green-700">PR:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.pr} bpm</span>
                                                                </div>
                                                            )}
                                                            {record.admin_data.bp && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                                                                    <span className="text-sm font-semibold text-green-700">BP:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.bp}</span>
                                                                </div>
                                                            )}
                                                            {record.admin_data.bmi && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                                                                    <span className="text-sm font-semibold text-green-700">BMI:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.bmi}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Lab Results are not displayed for admin medical records */}
                                            {record.follow_up_date && (
                                                <div className="md:col-span-2">
                                                    <label className="text-sm font-medium text-gray-700">Follow-up Date</label>
                                                    <p className="text-sm text-blue-600 mt-1">{record.follow_up_date}</p>
                                                </div>
                                            )}
                                            
                                            {/* Past Medical History */}
                                            {record.admin_data?.past_medical_history && (
                                                <div className="md:col-span-2">
                                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                                                        <h4 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                                                            <FileText className="h-5 w-5" />
                                                            Past Medical History
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {Object.entries(record.admin_data.past_medical_history).map(([condition, data]) => {
                                                                if (condition === 'others') {
                                                                    return data ? (
                                                                        <div key={condition} className="bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                                                                            <span className="text-sm font-semibold text-orange-700">Others:</span>
                                                                            <span className="text-base font-medium text-gray-800 ml-2">{data}</span>
                                                                        </div>
                                                                    ) : null;
                                                                }
                                                                
                                                                if (typeof data === 'object' && data.checked) {
                                                                    return (
                                                                        <div key={condition} className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 flex items-center gap-2">
                                                                            <span className="text-green-600 font-bold text-lg">✓</span>
                                                                            <span className="text-base font-semibold text-gray-800">
                                                                                {condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                            </span>
                                                                            {data.specify && <span className="text-sm text-gray-600">- {data.specify}</span>}
                                                                            {data.specify_organ && <span className="text-sm text-gray-600">- {data.specify_organ}</span>}
                                                                            {data.category && <span className="text-sm text-gray-600">- {data.category}</span>}
                                                                            {data.specify_type && <span className="text-sm text-gray-600">- {data.specify_type}</span>}
                                                                            {data.highest_bp && <span className="text-sm text-gray-600">- {data.highest_bp}</span>}
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                            {/* Show message if no conditions are checked */}
                                                            {Object.entries(record.admin_data.past_medical_history).every(([condition, data]) => {
                                                                if (condition === 'others') return !data;
                                                                return !(typeof data === 'object' && data.checked);
                                                            }) && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 text-center">
                                                                    <span className="text-base text-gray-500 italic">No past medical conditions recorded</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Past Surgical History */}
                                            {record.admin_data?.past_surgical_history && (
                                                <div className="md:col-span-2">
                                                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                                                        <h4 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                                                            <Calendar className="h-5 w-5" />
                                                            Past Surgical History
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {record.admin_data.past_surgical_history.map((surgery, index) => {
                                                                if (surgery.operation || surgery.date) {
                                                                    return (
                                                                        <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="text-sm font-semibold text-purple-700">Operation:</span>
                                                                                <span className="text-base font-bold text-gray-800">{surgery.operation || 'Not specified'}</span>
                                                                            </div>
                                                                            {surgery.date && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-sm font-semibold text-purple-700">Date:</span>
                                                                                    <span className="text-base font-medium text-gray-700">{surgery.date}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                            {/* Show message if no surgeries are recorded */}
                                                            {record.admin_data.past_surgical_history.every(surgery => !surgery.operation && !surgery.date) && (
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100 text-center">
                                                                    <span className="text-base text-gray-500 italic">No past surgical procedures recorded</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Admin Medical Record Data */}
                                            {record.admin_data && (
                                                <div className="md:col-span-2">
                                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                                                        <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                                                            <User className="h-5 w-5" />
                                                            Patient Information
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-3">
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">Name:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.name}</span>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">Sex:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2 capitalize">{record.admin_data.sex}</span>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">Address:</span>
                                                                    <span className="text-base font-medium text-gray-800 ml-2">{record.admin_data.address}</span>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">Mother:</span>
                                                                    <span className="text-base font-medium text-gray-800 ml-2">{record.admin_data.name_of_mother}</span>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">Contact:</span>
                                                                    <span className="text-base font-medium text-gray-800 ml-2">{record.admin_data.contact_no}</span>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">Age:</span>
                                                                    <span className="text-base font-bold text-gray-800 ml-2">{record.admin_data.age} years old</span>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">Birthdate:</span>
                                                                    <span className="text-base font-medium text-gray-800 ml-2">{record.admin_data.birthdate}</span>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">Father:</span>
                                                                    <span className="text-base font-medium text-gray-800 ml-2">{record.admin_data.name_of_father}</span>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                                    <span className="text-sm font-semibold text-blue-700">NHTS Status:</span>
                                                                    <span className="text-base font-medium text-gray-800 ml-2">
                                                                        {record.admin_data.nhts_status === 'nhts' ? 'Yes' : 
                                                                         record.admin_data.nhts_status === 'non_nhts' ? 'No' : 
                                                                         'Not specified'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <FileText className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Medical Records Found</h3>
                            <p className="text-base text-gray-500 mb-6">This patient has no medical records documented yet.</p>
                            <div className="text-sm text-gray-400 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                                <p className="font-medium mb-2">Medical records typically include:</p>
                                <ul className="text-left space-y-1">
                                    <li>• Vital signs and measurements</li>
                                    <li>• Past medical history</li>
                                    <li>• Past surgical procedures</li>
                                    <li>• Patient demographic information</li>
                                </ul>
                            </div>
                            <Button 
                                onClick={() => setShowAddRecord(true)} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add First Medical Record
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Legacy Medical Histories (from medical_history table) - for backward compatibility */}
            {patient?.medical_histories && patient.medical_histories.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-600">Legacy Medical Records</CardTitle>
                        <CardDescription>Older medical history records</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {patient.medical_histories.map((record) => (
                                <Card key={record.id} className="border-l-4 border-l-gray-400">
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Date</label>
                                                <p>{new Date(record.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Doctor</label>
                                                <p>
                                                    {record?.doctor?.user?.firstname} {record?.doctor?.user?.lastname}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Diagnosis</label>
                                                <p>{record.diagnosis}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Treatment</label>
                                                <p>{record.treatment}</p>
                                            </div>
                                            {record.clinic_notes && (
                                                <div className="md:col-span-2">
                                                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                                    <p>{record.clinic_notes}</p>
                                                </div>
                                            )}
                                            {record.followup_inst && (
                                                <div className="md:col-span-2">
                                                    <label className="text-sm font-medium text-muted-foreground">Follow-up</label>
                                                    <p>{record.followup_inst}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Add Medical Record Modal */}
            <AddMedicalRecordForm
                patientName={`${patient.firstname} ${patient.lastname}`}
                onSubmit={(record) => setData(record)}
                onCancel={() => setShowAddRecord(false)}
                doctors={doctors}
                patient={patient}
                errors={errors}
                isOpen={showAddRecord}
            />

            {/* Edit Medical Record Modal */}
            <AddMedicalRecordForm
                patientName={`${patient.firstname} ${patient.lastname}`}
                onSubmit={(record) => setData(record)}
                onCancel={() => {
                    setShowEditRecord(false);
                    setEditingRecord(null);
                }}
                doctors={doctors}
                patient={patient}
                errors={errors}
                editingRecord={editingRecord}
                isEditing={true}
                isOpen={showEditRecord && editingRecord !== null}
            />
        </div>
    );
}
