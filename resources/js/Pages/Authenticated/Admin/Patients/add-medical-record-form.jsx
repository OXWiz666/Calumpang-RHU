"use client";

import React, { useEffect } from "react";

import { useState } from "react";
// import { MedicalRecord } from "./page";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { ArrowLeft, Save, User, Info } from "lucide-react";
import moment from "moment";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "react-day-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/tempo/components/ui/radio-group";
import { Checkbox } from "@/components/tempo/components/ui/checkbox";
import PrintErrors from "@/components/PrintErrors";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";

// interface AddMedicalRecordFormProps {
//   patientName: string
//   onSubmit: (record: Omit<MedicalRecord, "id">) => void
//   onCancel: () => void
// }

export default function AddMedicalRecordForm({
    patientName,
    onSubmit,
    onCancel,
    doctors,
    patient, // Add patient data prop
    errors,
    editingRecord = null,
    isEditing = false,
    isOpen = true, // Add isOpen prop for modal
}) {
    const [formData, setFormData] = useState({
        name: "",
        birthdate: "",
        sex: "",
        address: "",
        age: "",
        name_of_mother: "",
        nhts_status: "", // Will be "nhts", "non_nhts", or ""
        name_of_father: "",
        contact_no: "",
        date: moment(new Date()).format("YYYY-MM-DD"),
        time: moment(new Date()).format("HH:mm"),
        patient_id: null, // Add patient_id field
        // Pertinent findings / vitals - initialize to empty strings to keep inputs controlled
        weight: "",
        height: "",
        temperature: "",
        rr: "",
        pr: "",
        bp: "",
        bmi: "",
        // Past Medical History
        past_medical_history: {
            allergy: { checked: false, specify: "" },
            pneumonia: { checked: false },
            asthma: { checked: false },
            thyroid_disease: { checked: false },
            cancer: { checked: false, specify_organ: "" },
            cerebrovascular_disease: { checked: false },
            ptb: { checked: false, category: "" },
            coronary_artery_disease: { checked: false },
            urinary_tract_infection: { checked: false },
            diabetes_mellitus: { checked: false },
            emphysema: { checked: false },
            epilepsy_seizure: { checked: false },
            hepatitis: { checked: false, specify_type: "" },
            hyperlipidemia: { checked: false },
            hypertension: { checked: false, highest_bp: "" },
            peptic_ulcer_disease: { checked: false },
            tuberculosis: { checked: false, specify_organ: "" },
            others: ""
        },
        // Past Surgical History
        past_surgical_history: [
            { operation: "", date: "" },
            { operation: "", date: "" }
        ]
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [isAutoPopulated, setIsAutoPopulated] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const validateForm = () => {
        // Skip validation when editing - just return empty errors
        if (isEditing) {
            return {};
        }
        
        const errors = {};
        
        // Name validation
        if (!formData.name.trim()) {
            errors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        }

        // Birthdate validation
        if (!formData.birthdate) {
            errors.birthdate = "Birthdate is required";
        } else {
            const birthDate = new Date(formData.birthdate);
            const today = new Date();
            if (birthDate > today) {
                errors.birthdate = "Birthdate cannot be in the future";
            }
            if (birthDate.getFullYear() < 1900) {
                errors.birthdate = "Birthdate cannot be before 1900";
            }
        }

        // Sex validation
        if (!formData.sex) {
            errors.sex = "Sex is required";
        }

        // Address validation
        if (!formData.address.trim()) {
            errors.address = "Address is required";
        } else if (formData.address.trim().length < 10) {
            errors.address = "Address must be at least 10 characters";
        }

        // Age validation (should be calculated automatically)
        if (!formData.age) {
            errors.age = "Age is required";
        } else if (isNaN(formData.age) || formData.age < 0 || formData.age > 150) {
            errors.age = "Age must be a valid number between 0 and 150";
        }

        // Name of Mother validation
        if (!formData.name_of_mother.trim()) {
            errors.name_of_mother = "Name of Mother is required";
        } else if (formData.name_of_mother.trim().length < 2) {
            errors.name_of_mother = "Name of Mother must be at least 2 characters";
        }

        // Name of Father validation
        if (!formData.name_of_father.trim()) {
            errors.name_of_father = "Name of Father is required";
        } else if (formData.name_of_father.trim().length < 2) {
            errors.name_of_father = "Name of Father must be at least 2 characters";
        }

        // Contact number validation
        if (!formData.contact_no.trim()) {
            errors.contact_no = "Contact number is required";
        } else {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
            if (!phoneRegex.test(formData.contact_no.trim())) {
                errors.contact_no = "Please enter a valid contact number";
            }
        }

        // Date validation
        if (!formData.date) {
            errors.date = "Date is required";
        } else {
            const recordDate = new Date(formData.date);
            const today = new Date();
            // Allow current date and time, only reject if it's more than 1 day in the future
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (recordDate > tomorrow) {
                errors.date = "Record date cannot be more than 1 day in the future";
            }
        }

        // NHTS Status validation
        if (!formData.nhts_status) {
            errors.nhts_status = "NHTS Status is required";
        }

        // Time validation
        if (!formData.time) {
            errors.time = "Time is required";
        }

        // Past Medical History validation
        const pastMedicalHistory = formData.past_medical_history;
        
        // Validate specify_type for Hepatitis
        if (pastMedicalHistory.hepatitis.checked && !pastMedicalHistory.hepatitis.specify_type.trim()) {
            errors.hepatitis_specify_type = "Please specify the type of Hepatitis";
        }
        
        // Validate highest_bp for Hypertension
        if (pastMedicalHistory.hypertension.checked && !pastMedicalHistory.hypertension.highest_bp.trim()) {
            errors.hypertension_highest_bp = "Please specify the highest blood pressure";
        }
        
        // Validate specify_organ for Tuberculosis
        if (pastMedicalHistory.tuberculosis.checked && !pastMedicalHistory.tuberculosis.specify_organ.trim()) {
            errors.tuberculosis_specify_organ = "Please specify the organ affected by Tuberculosis";
        }
        
        // Validate specify_organ for Cancer
        if (pastMedicalHistory.cancer.checked && !pastMedicalHistory.cancer.specify_organ.trim()) {
            errors.cancer_specify_organ = "Please specify the organ affected by Cancer";
        }
        
        // Validate category for PTB
        if (pastMedicalHistory.ptb.checked && !pastMedicalHistory.ptb.category.trim()) {
            errors.ptb_category = "Please specify the PTB category";
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('AddMedicalRecordForm - Form submitted with data:', formData);
        
        const errors = validateForm();
        
        if (Object.keys(errors).length > 0) {
            console.log('AddMedicalRecordForm - Validation errors:', errors);
            setValidationErrors(errors);
            return;
        }
        
        console.log('AddMedicalRecordForm - Validation passed, calling onSubmit');
        setValidationErrors({});
        
        // Ensure patient_id is set
        const formDataWithPatientId = {
            ...formData,
            patient_id: patient?.id || patient?.patient_id
        };
        
        console.log('AddMedicalRecordForm - Final form data:', formDataWithPatientId);
        
        // Call onSubmit with the complete form data
        onSubmit(formDataWithPatientId);
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear validation error for this field when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return "";
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age.toString();
    };

    const handleBirthdateChange = (value) => {
        handleInputChange("birthdate", value);
        const calculatedAge = calculateAge(value);
        handleInputChange("age", calculatedAge);
    };

    const calculateBMI = (weight, height) => {
        if (!weight || !height || weight <= 0 || height <= 0) return "";
        const heightInMeters = height / 100; // Convert cm to meters
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        return bmi;
    };

    const handleWeightChange = (value) => {
        handleInputChange("weight", value);
        const bmi = calculateBMI(value, formData.height);
        handleInputChange("bmi", bmi);
    };

    const handleHeightChange = (value) => {
        handleInputChange("height", value);
        const bmi = calculateBMI(formData.weight, value);
        handleInputChange("bmi", bmi);
    };

    // Handle medical history checkbox changes
    const handleMedicalHistoryChange = (condition, field, value) => {
        setFormData(prev => ({
            ...prev,
            past_medical_history: {
                ...prev.past_medical_history,
                [condition]: {
                    ...prev.past_medical_history[condition],
                    [field]: value
                }
            }
        }));
    };

    // Handle surgical history changes
    const handleSurgicalHistoryChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            past_surgical_history: prev.past_surgical_history.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    // Auto-fetch patient information when component loads
    useEffect(() => {
        console.log('AddMedicalRecordForm - isEditing:', isEditing);
        console.log('AddMedicalRecordForm - editingRecord:', editingRecord);
        
        if (isEditing && editingRecord && editingRecord.admin_data) {
            console.log('AddMedicalRecordForm - admin_data:', editingRecord.admin_data);
            console.log('AddMedicalRecordForm - vital_signs:', editingRecord.vital_signs);
            
            // Populate form with existing medical record data
            const adminData = editingRecord.admin_data;
            const vitalSigns = editingRecord.vital_signs || {};
            
            console.log('AddMedicalRecordForm - Vital signs to populate:');
            console.log('  adminData.weight:', adminData.weight);
            console.log('  adminData.height:', adminData.height);
            console.log('  adminData.temperature:', adminData.temperature);
            console.log('  vitalSigns.respiratory_rate:', vitalSigns.respiratory_rate);
            console.log('  vitalSigns.pulse_rate:', vitalSigns.pulse_rate);
            console.log('  vitalSigns.blood_pressure:', vitalSigns.blood_pressure);
            
            setFormData(prev => ({
                ...prev,
                name: adminData.name || "",
                birthdate: adminData.birthdate || "",
                sex: adminData.sex || "",
                address: adminData.address || "",
                age: adminData.age || "",
                name_of_mother: adminData.name_of_mother || "",
                name_of_father: adminData.name_of_father || "",
                contact_no: adminData.contact_no || "",
                date: adminData.date || moment(new Date()).format("YYYY-MM-DD"),
                time: adminData.time || moment(new Date()).format("HH:mm"),
                nhts_status: adminData.nhts_status || "",
                past_medical_history: adminData.past_medical_history || prev.past_medical_history,
                past_surgical_history: adminData.past_surgical_history || prev.past_surgical_history,
                // Vital signs and measurements - try admin_data first, then vital_signs
                weight: adminData.weight || vitalSigns.weight || "",
                height: adminData.height || vitalSigns.height || "",
                temperature: adminData.temperature || vitalSigns.temperature || "",
                rr: adminData.rr || vitalSigns.respiratory_rate || "",
                pr: adminData.pr || vitalSigns.pulse_rate || "",
                bp: adminData.bp || vitalSigns.blood_pressure || "",
                bmi: adminData.bmi || vitalSigns.bmi || "",
            }));
            console.log('AddMedicalRecordForm - Form data updated with vital signs');
        } else if (patient) {
            // Build full name
            const fullName = `${patient.firstname || ''} ${patient.middlename || ''} ${patient.lastname || ''}`.trim();
            
            // Build address from components
            const addressParts = [];
            if (patient.street) addressParts.push(patient.street);
            if (patient.barangay) addressParts.push(patient.barangay);
            if (patient.city) addressParts.push(patient.city);
            if (patient.province) addressParts.push(patient.province);
            if (patient.region) addressParts.push(patient.region);
            if (patient.zip_code) addressParts.push(patient.zip_code);
            const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : (patient.address || '');
            
            // Normalize sex/gender value for form
            const normalizeSex = (genderValue) => {
                if (!genderValue) return '';
                const value = genderValue.toString().toLowerCase();
                if (value === 'm' || value === 'male') return 'male';
                if (value === 'f' || value === 'female') return 'female';
                return '';
            };
            
            // Format birthdate for HTML date input (YYYY-MM-DD)
            const formatBirthdate = (dateValue) => {
                if (!dateValue) return '';
                try {
                    const date = new Date(dateValue);
                    if (isNaN(date.getTime())) return '';
                    // Ensure we return YYYY-MM-DD format without timezone issues
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                } catch (error) {
                    console.log('Error formatting birthdate:', error);
                    return '';
                }
            };
            
            const patientBirthdate = patient.date_of_birth || patient.birth;
            const formattedBirthdate = formatBirthdate(patientBirthdate);
            
            console.log('Patient birthdate data:', {
                date_of_birth: patient.date_of_birth,
                birth: patient.birth,
                formatted: formattedBirthdate
            });
            
            // Set form data with patient information
            setFormData(prev => ({
                ...prev,
                name: fullName || prev.name,
                birthdate: formattedBirthdate || prev.birthdate,
                sex: normalizeSex(patient.gender || patient.sex) || prev.sex,
                address: fullAddress || prev.address,
                contact_no: patient.contactno || patient.phone || prev.contact_no,
                patient_id: patient?.id || patient?.patient_id || prev.patient_id,
                // Note: We don't auto-fill parent names as they might not be in patient data
                // The user will need to enter these manually
            }));
            
            // Mark as auto-populated if any data was filled
            if (fullName || patient.date_of_birth || patient.birth || patient.gender || patient.sex || fullAddress || patient.contactno || patient.phone) {
                setIsAutoPopulated(true);
            }
            
            // Calculate age from patient birthdate if available
            if (patientBirthdate && !formData.age) {
                const calculatedAge = calculateAge(patientBirthdate);
                console.log('Calculating age from patient data:', {
                    patientBirthdate: patientBirthdate,
                    calculatedAge: calculatedAge
                });
                handleInputChange("age", calculatedAge);
            }
        }
    }, [patient, isEditing, editingRecord]);

    // Live time updates
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            // Update form time to current time
            setFormData(prev => ({
                ...prev,
                time: moment(now).format("HH:mm")
            }));
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, []);

    // Calculate age when component loads if birthdate is already set
    useEffect(() => {
        if (formData.birthdate && !formData.age) {
            const calculatedAge = calculateAge(formData.birthdate);
            console.log('Auto-calculating age:', {
                birthdate: formData.birthdate,
                calculatedAge: calculatedAge
            });
            handleInputChange("age", calculatedAge);
        }
    }, [formData.birthdate]);


    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold">{isEditing ? 'Edit Medical Record' : 'Add Medical Record'}</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Patient: {patientName}
                                </p>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">

            {/* Creation Date & Time Display */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                            <p className="text-sm font-medium text-green-900">
                                Medical Record Creation
                            </p>
                            <p className="text-xs text-green-700">
                                Date & Time automatically set to current time
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-green-900">
                            {moment(currentTime).format("MMM DD, YYYY")}
                        </p>
                        <p className="text-xs text-green-700">
                            {moment(currentTime).format("hh:mm:ss A")}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                        <CardDescription>
                            Enter the patient's basic information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!isEditing && <PrintErrors errors={errors} />}
                        
                        {/* Display medical record exists error */}
                        {errors.medical_record_exists && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Medical Record Already Exists
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{errors.medical_record_exists}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleInputChange("name", e.target.value)
                                    }
                                    placeholder="Full name"
                                    className={validationErrors.name ? "border-red-500" : ""}
                                    required
                                />
                                {validationErrors.name && (
                                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthdate">Birthdate *</Label>
                                <Input
                                    id="birthdate"
                                    type="date"
                                    value={formData.birthdate}
                                    onChange={(e) =>
                                        handleBirthdateChange(e.target.value)
                                    }
                                    className={validationErrors.birthdate ? "border-red-500" : ""}
                                    required
                                />
                                {validationErrors.birthdate && (
                                    <p className="text-sm text-red-500">{validationErrors.birthdate}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sex">Sex *</Label>
                                <Select
                                    value={formData.sex}
                                    onValueChange={(val) =>
                                        handleInputChange("sex", val)
                                    }
                                >
                                    <SelectTrigger className={validationErrors.sex ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select sex" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                {validationErrors.sex && (
                                    <p className="text-sm text-red-500">{validationErrors.sex}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="age">Age *</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={formData.age}
                                    readOnly
                                    className={`bg-gray-50 cursor-not-allowed ${validationErrors.age ? "border-red-500" : ""}`}
                                    placeholder="Age will be calculated from birthdate"
                                />
                                {validationErrors.age && (
                                    <p className="text-sm text-red-500">{validationErrors.age}</p>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address *</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleInputChange("address", e.target.value)
                                    }
                                    placeholder="Complete address"
                                    rows={3}
                                    className={validationErrors.address ? "border-red-500" : ""}
                                    required
                                />
                                {validationErrors.address && (
                                    <p className="text-sm text-red-500">{validationErrors.address}</p>
                                )}
                        </div>

                        <div className="space-y-2">
                                <Label htmlFor="name_of_mother">Name of Mother *</Label>
                            <Input
                                    id="name_of_mother"
                                    value={formData.name_of_mother}
                                onChange={(e) =>
                                        handleInputChange("name_of_mother", e.target.value)
                                }
                                    placeholder="Mother's full name"
                                    className={validationErrors.name_of_mother ? "border-red-500" : ""}
                                required
                            />
                                {validationErrors.name_of_mother && (
                                    <p className="text-sm text-red-500">{validationErrors.name_of_mother}</p>
                                )}
                        </div>

                        <div className="space-y-2">
                                <Label htmlFor="name_of_father">Name of Father *</Label>
                                <Input
                                    id="name_of_father"
                                    value={formData.name_of_father}
                                onChange={(e) =>
                                        handleInputChange("name_of_father", e.target.value)
                                }
                                    placeholder="Father's full name"
                                    className={validationErrors.name_of_father ? "border-red-500" : ""}
                                    required
                            />
                                {validationErrors.name_of_father && (
                                    <p className="text-sm text-red-500">{validationErrors.name_of_father}</p>
                                )}
                        </div>

                        <div className="space-y-2">
                                <Label htmlFor="contact_no">Contact No. *</Label>
                            <Input
                                    id="contact_no"
                                    value={formData.contact_no}
                                onChange={(e) =>
                                        handleInputChange("contact_no", e.target.value)
                                }
                                    placeholder="Phone number"
                                    className={validationErrors.contact_no ? "border-red-500" : ""}
                                required
                            />
                                {validationErrors.contact_no && (
                                    <p className="text-sm text-red-500">{validationErrors.contact_no}</p>
                                )}
                            </div>


                            <div className="space-y-2">
                                <Label>NHTS Status *</Label>
                                <RadioGroup
                                    value={formData.nhts_status}
                                    onValueChange={(value) => handleInputChange("nhts_status", value)}
                                    className="flex flex-col space-y-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="nhts" id="nhts" />
                                        <Label htmlFor="nhts" className="text-sm font-normal">
                                            NHTS (National Household Targeting System)
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="non_nhts" id="non_nhts" />
                                        <Label htmlFor="non_nhts" className="text-sm font-normal">
                                            NON-NHTS (Non-NHTS beneficiary)
                                        </Label>
                                    </div>

                                </RadioGroup>
                                {validationErrors.nhts_status && (
                                    <p className="text-sm text-red-500">{validationErrors.nhts_status}</p>
                                )}
                        </div>

                        <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="date">Date & Time *</Label>
                                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-medium">Auto-filled</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            handleInputChange("date", e.target.value)
                                        }
                                        className={`flex-1 ${validationErrors.date ? "border-red-500" : "border-green-200 bg-green-50"}`}
                                        required
                                    />
                                    <Input
                                        id="time"
                                        type="time"
                                        value={formData.time}
                                onChange={(e) =>
                                            handleInputChange("time", e.target.value)
                                        }
                                        className={`flex-1 ${validationErrors.time ? "border-red-500" : "border-green-200 bg-green-50"}`}
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>Live time: {moment(currentTime).format("MMM DD, YYYY - hh:mm:ss A")}</span>
                                    </div>
                                </div>
                                {validationErrors.date && (
                                    <p className="text-sm text-red-500">{validationErrors.date}</p>
                                )}
                                {validationErrors.time && (
                                    <p className="text-sm text-red-500">{validationErrors.time}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pertinent Findings Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pertinent Findings</CardTitle>
                        <CardDescription>
                            Enter the patient's vital signs and measurements
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={(e) =>
                                        handleWeightChange(e.target.value)
                                    }
                                    placeholder="Weight in kilograms"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) =>
                                        handleHeightChange(e.target.value)
                                    }
                                    placeholder="Height in centimeters"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="temperature">Temperature (°C)</Label>
                                <Input
                                    id="temperature"
                                    type="number"
                                    step="0.1"
                                    value={formData.temperature}
                                    onChange={(e) =>
                                        handleInputChange("temperature", e.target.value)
                                    }
                                    placeholder="Body temperature"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rr">RR (Respiratory Rate)</Label>
                                <Input
                                    id="rr"
                                    type="number"
                                    value={formData.rr}
                                    onChange={(e) =>
                                        handleInputChange("rr", e.target.value)
                                    }
                                    placeholder="Breaths per minute"
                            />
                        </div>

                        <div className="space-y-2">
                                <Label htmlFor="pr">PR (Pulse Rate)</Label>
                                <Input
                                    id="pr"
                                    type="number"
                                    value={formData.pr}
                                onChange={(e) =>
                                        handleInputChange("pr", e.target.value)
                                }
                                    placeholder="Beats per minute"
                            />
                        </div>

                                    <div className="space-y-2">
                                <Label htmlFor="bp">BP (Blood Pressure)</Label>
                                        <Input
                                    id="bp"
                                    value={formData.bp}
                                            onChange={(e) =>
                                        handleInputChange("bp", e.target.value)
                                            }
                                            placeholder="e.g., 120/80"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                <Label htmlFor="bmi">BMI</Label>
                                <Input
                                    id="bmi"
                                    value={formData.bmi}
                                    readOnly
                                    className="bg-gray-50 cursor-not-allowed"
                                    placeholder="BMI will be calculated from weight and height"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Past Medical History Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Past Medical History</CardTitle>
                        <CardDescription>
                            Check all applicable medical conditions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Allergy */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="allergy"
                                        checked={formData.past_medical_history.allergy.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('allergy', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="allergy" className="text-sm font-medium">
                                        Allergy
                                    </Label>
                                    {formData.past_medical_history.allergy.checked && (
                                        <Input
                                            placeholder="specify"
                                            value={formData.past_medical_history.allergy.specify}
                                            onChange={(e) =>
                                                handleMedicalHistoryChange('allergy', 'specify', e.target.value)
                                            }
                                            className="ml-2 flex-1"
                                        />
                                    )}
                                </div>

                                {/* Pneumonia */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="pneumonia"
                                        checked={formData.past_medical_history.pneumonia.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('pneumonia', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="pneumonia" className="text-sm font-medium">
                                        Pneumonia
                                    </Label>
                                </div>

                                {/* Asthma */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="asthma"
                                        checked={formData.past_medical_history.asthma.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('asthma', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="asthma" className="text-sm font-medium">
                                        Asthma
                                    </Label>
                                </div>

                                {/* Thyroid Disease */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="thyroid_disease"
                                        checked={formData.past_medical_history.thyroid_disease.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('thyroid_disease', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="thyroid_disease" className="text-sm font-medium">
                                        Thyroid disease
                                    </Label>
                                    </div>

                                {/* Cancer */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="cancer"
                                        checked={formData.past_medical_history.cancer.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('cancer', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="cancer" className="text-sm font-medium">
                                        Cancer
                                    </Label>
                                    {formData.past_medical_history.cancer.checked && (
                                        <div className="ml-2 flex-1">
                                            <Input
                                                placeholder="specify organ"
                                                value={formData.past_medical_history.cancer.specify_organ || ''}
                                                onChange={(e) =>
                                                    handleMedicalHistoryChange('cancer', 'specify_organ', e.target.value)
                                                }
                                                className={validationErrors.cancer_specify_organ ? "border-red-500" : ""}
                                            />
                                            {validationErrors.cancer_specify_organ && (
                                                <p className="text-sm text-red-500 mt-1">{validationErrors.cancer_specify_organ}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Cerebrovascular Disease */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="cerebrovascular_disease"
                                        checked={formData.past_medical_history.cerebrovascular_disease.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('cerebrovascular_disease', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="cerebrovascular_disease" className="text-sm font-medium">
                                        Cerebrovascular disease
                                    </Label>
                                    </div>

                                {/* PTB */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="ptb"
                                        checked={formData.past_medical_history.ptb.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('ptb', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="ptb" className="text-sm font-medium">
                                        PTB
                                    </Label>
                                    {formData.past_medical_history.ptb.checked && (
                                        <div className="ml-2 flex-1">
                                            <Input
                                                placeholder="What category?"
                                                value={formData.past_medical_history.ptb.category || ''}
                                                onChange={(e) =>
                                                    handleMedicalHistoryChange('ptb', 'category', e.target.value)
                                                }
                                                className={validationErrors.ptb_category ? "border-red-500" : ""}
                                            />
                                            {validationErrors.ptb_category && (
                                                <p className="text-sm text-red-500 mt-1">{validationErrors.ptb_category}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Coronary Artery Disease */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="coronary_artery_disease"
                                        checked={formData.past_medical_history.coronary_artery_disease.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('coronary_artery_disease', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="coronary_artery_disease" className="text-sm font-medium">
                                        Coronary artery disease
                                    </Label>
                                </div>

                                {/* Urinary Tract Infection */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="urinary_tract_infection"
                                        checked={formData.past_medical_history.urinary_tract_infection.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('urinary_tract_infection', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="urinary_tract_infection" className="text-sm font-medium">
                                        Urinary tract infection
                                    </Label>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Diabetes Mellitus */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="diabetes_mellitus"
                                        checked={formData.past_medical_history.diabetes_mellitus.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('diabetes_mellitus', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="diabetes_mellitus" className="text-sm font-medium">
                                        Diabetes mellitus
                                    </Label>
                                </div>

                                {/* Emphysema */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="emphysema"
                                        checked={formData.past_medical_history.emphysema.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('emphysema', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="emphysema" className="text-sm font-medium">
                                        Emphysema
                                    </Label>
                                </div>

                                {/* Epilepsy/Seizure Disorder */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="epilepsy_seizure"
                                        checked={formData.past_medical_history.epilepsy_seizure.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('epilepsy_seizure', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="epilepsy_seizure" className="text-sm font-medium">
                                        Epilepsy/Seizure disorder
                                    </Label>
                                    </div>

                                {/* Hepatitis */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hepatitis"
                                        checked={formData.past_medical_history.hepatitis.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('hepatitis', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="hepatitis" className="text-sm font-medium">
                                        Hepatitis
                                    </Label>
                                    {formData.past_medical_history.hepatitis.checked && (
                                        <div className="ml-2 flex-1">
                                            <Input
                                                placeholder="specify type"
                                                value={formData.past_medical_history.hepatitis.specify_type || ''}
                                                onChange={(e) =>
                                                    handleMedicalHistoryChange('hepatitis', 'specify_type', e.target.value)
                                                }
                                                className={validationErrors.hepatitis_specify_type ? "border-red-500" : ""}
                                            />
                                            {validationErrors.hepatitis_specify_type && (
                                                <p className="text-sm text-red-500 mt-1">{validationErrors.hepatitis_specify_type}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Hyperlipidemia */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hyperlipidemia"
                                        checked={formData.past_medical_history.hyperlipidemia.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('hyperlipidemia', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="hyperlipidemia" className="text-sm font-medium">
                                        Hyperlipidemia
                                    </Label>
                        </div>

                                {/* Hypertension */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hypertension"
                                        checked={formData.past_medical_history.hypertension.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('hypertension', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="hypertension" className="text-sm font-medium">
                                        Hypertension
                                    </Label>
                                    {formData.past_medical_history.hypertension.checked && (
                                        <div className="ml-2 flex-1">
                                            <Input
                                                placeholder="highest BP"
                                                value={formData.past_medical_history.hypertension.highest_bp || ''}
                                                onChange={(e) =>
                                                    handleMedicalHistoryChange('hypertension', 'highest_bp', e.target.value)
                                                }
                                                className={validationErrors.hypertension_highest_bp ? "border-red-500" : ""}
                                            />
                                            {validationErrors.hypertension_highest_bp && (
                                                <p className="text-sm text-red-500 mt-1">{validationErrors.hypertension_highest_bp}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Peptic Ulcer Disease */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="peptic_ulcer_disease"
                                        checked={formData.past_medical_history.peptic_ulcer_disease.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('peptic_ulcer_disease', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="peptic_ulcer_disease" className="text-sm font-medium">
                                        Peptic ulcer disease
                                    </Label>
                                    </div>

                                {/* Tuberculosis */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="tuberculosis"
                                        checked={formData.past_medical_history.tuberculosis.checked}
                                        onCheckedChange={(checked) => 
                                            handleMedicalHistoryChange('tuberculosis', 'checked', checked)
                                        }
                                    />
                                    <Label htmlFor="tuberculosis" className="text-sm font-medium">
                                        Tuberculosis
                                    </Label>
                                    {formData.past_medical_history.tuberculosis.checked && (
                                        <div className="ml-2 flex-1">
                                            <Input
                                                placeholder="specify organ"
                                                value={formData.past_medical_history.tuberculosis.specify_organ || ''}
                                                onChange={(e) =>
                                                    handleMedicalHistoryChange('tuberculosis', 'specify_organ', e.target.value)
                                                }
                                                className={validationErrors.tuberculosis_specify_organ ? "border-red-500" : ""}
                                            />
                                            {validationErrors.tuberculosis_specify_organ && (
                                                <p className="text-sm text-red-500 mt-1">{validationErrors.tuberculosis_specify_organ}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                                    </div>

                        {/* Others */}
                                    <div className="space-y-2">
                            <Label htmlFor="others" className="text-sm font-medium">
                                Others:
                            </Label>
                            <Input
                                id="others"
                                value={formData.past_medical_history.others}
                                onChange={(e) => 
                                    setFormData(prev => ({
                                        ...prev,
                                        past_medical_history: {
                                            ...prev.past_medical_history,
                                            others: e.target.value
                                        }
                                    }))
                                }
                                placeholder="Specify other medical conditions"
                                className="w-full"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Past Surgical History Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Past Surgical History</CardTitle>
                        <CardDescription>
                            Record any previous surgical procedures
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formData.past_surgical_history.map((surgery, index) => (
                            <div key={index} className="space-y-4 p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor={`operation_${index}`} className="text-sm font-medium">
                                            Operation:
                                        </Label>
                                        <Input
                                            id={`operation_${index}`}
                                            value={surgery.operation}
                                            onChange={(e) =>
                                                handleSurgicalHistoryChange(index, 'operation', e.target.value)
                                            }
                                            placeholder="Enter operation/procedure name"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor={`date_${index}`} className="text-sm font-medium">
                                            Date:
                                        </Label>
                                        <Input
                                            id={`date_${index}`}
                                            type="date"
                                            value={surgery.date}
                                            onChange={(e) =>
                                                handleSurgicalHistoryChange(index, 'date', e.target.value)
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                    </div>
                                ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {isEditing ? 'Update Medical Record' : 'Add Medical Record'}
                    </Button>
                </div>
            </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
