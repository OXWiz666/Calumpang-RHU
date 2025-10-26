import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/tempo/components/ui/button';
import { Input } from '@/components/tempo/components/ui/input';
import { Label } from '@/components/tempo/components/ui/label';
import { Textarea } from '@/components/tempo/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/tempo/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { toastError, toastSuccess, toastWarning } from '@/utils/toast';
import { 
    Plus, 
    Trash2, 
    Calendar, 
    User, 
    Pill,
    ArrowLeft,
    AlertTriangle
} from 'lucide-react';

export default function CreatePrescription({ medicalRecords, medicines }) {
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [availableMedicines, setAvailableMedicines] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [patientDiagnoses, setPatientDiagnoses] = useState([]);

    // Set available medicines from props
    useEffect(() => {
        if (medicines && Array.isArray(medicines)) {
            setAvailableMedicines(medicines);
        }
    }, [medicines]);

    // Create unique patients list
    const uniquePatients = React.useMemo(() => {
        if (!medicalRecords || !Array.isArray(medicalRecords)) return [];
        
        const uniqueMap = new Map();
        medicalRecords.forEach(record => {
            if (!uniqueMap.has(record.patient_name)) {
                uniqueMap.set(record.patient_name, {
                    id: record.patient_name, // Use patient name as ID for now
                    name: record.patient_name
                });
            }
        });
        
        return Array.from(uniqueMap.values());
    }, [medicalRecords]);

    // Handle patient selection
    const handlePatientSelection = (patientName) => {
        setSelectedPatientId(patientName);
        
        // Filter diagnoses for selected patient
        const patientDiagnosesList = medicalRecords.filter(record => record.patient_name === patientName);
        setPatientDiagnoses(patientDiagnosesList);
        
        // Reset medical record selection
        setData('medical_record_id', '');
    };

    const { data, setData, post, processing, errors } = useForm({
        medical_record_id: '',
        prescription_date: new Date().toISOString().split('T')[0],
        case_id: '',
        medicines: [],
        notes: ''
    });

    const addMedicine = () => {
        const newMedicine = {
            id: Date.now(),
            medicine_id: '',
            frequency: '',
            duration: '',
            quantity: '',
            instructions: ''
        };
        setSelectedMedicines([...selectedMedicines, newMedicine]);
    };

    const removeMedicine = (id) => {
        setSelectedMedicines(selectedMedicines.filter(med => med.id !== id));
    };

    const updateMedicine = (id, field, value) => {
        console.log('updateMedicine called:', { id, field, value });
        const updatedMedicines = selectedMedicines.map(med => 
            med.id === id ? { ...med, [field]: value } : med
        );
        console.log('Updated medicines:', updatedMedicines);
        setSelectedMedicines(updatedMedicines);
    };

    // Helper function to check if quantity exceeds available stock
    const isQuantityExceeded = (medicineId, quantity) => {
        if (!medicineId || !quantity) return false;
        const medicine = availableMedicines.find(med => med.id == medicineId);
        if (!medicine) return false;
        return parseInt(quantity) > parseInt(medicine.available_quantity);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Form submission started');
        console.log('Event prevented:', e.defaultPrevented);
        
        // Check for quantity validation errors
        const hasQuantityErrors = selectedMedicines.some(med => 
            med.medicine_id && med.quantity && isQuantityExceeded(med.medicine_id, med.quantity)
        );
        
        if (hasQuantityErrors) {
            toastError(
                "Quantity Validation Error",
                "Please fix quantity errors before submitting the prescription."
            );
            return;
        }
        
        // Prepare medicines data
        console.log('Raw selectedMedicines:', selectedMedicines);
        console.log('selectedMedicines length:', selectedMedicines.length);
        
        const medicinesData = selectedMedicines
            .filter(med => {
                console.log('Filtering medicine:', med);
                const isValid = med.medicine_id && med.frequency && med.duration && med.quantity;
                console.log('Medicine valid:', isValid, {
                    medicine_id: med.medicine_id,
                    frequency: med.frequency,
                    duration: med.duration,
                    quantity: med.quantity
                });
                return isValid;
            })
            .map(med => ({
                medicine_id: med.medicine_id,
                frequency: med.frequency,
                duration: med.duration,
                quantity: parseInt(med.quantity),
                instructions: med.instructions
            }));

        console.log('Selected medicines:', selectedMedicines);
        console.log('Filtered medicines data:', medicinesData);
        console.log('Form data before setData:', data);
        
        // Validate that we have medicines to submit
        if (medicinesData.length === 0) {
            toastError(
                "No Medicines Added",
                "Please add at least one medicine to the prescription."
            );
            return;
        }

        // Update the form data with medicines
        const updatedData = {
            ...data,
            medicines: medicinesData
        };
        
        console.log('Route URL:', route('doctor.prescriptions.store'));
        console.log('Form data after setData:', updatedData);
        console.log('Medicines array length:', medicinesData.length);
        console.log('Medicines validation:', medicinesData.every(med => 
            med.medicine_id && med.frequency && med.duration && med.quantity
        ));
        
        // Ensure we have valid data before submitting
        if (!updatedData.medical_record_id || !updatedData.case_id || updatedData.medicines.length === 0) {
            toastError(
                "Missing Required Information",
                "Please fill in all required fields and add at least one medicine."
            );
            return;
        }
        
        // Debug route generation
        try {
            const routeUrl = route('doctor.prescriptions.store');
            console.log('Generated route URL:', routeUrl);
        } catch (error) {
            console.error('Route generation error:', error);
            toastError(
                "Route Error",
                "Unable to generate the correct route. Please refresh the page and try again."
            );
            return;
        }
        
        // Use the proper route with updated data
        console.log('About to submit prescription with data:', updatedData);
        
        // Use hardcoded URL to ensure correct route
        const routeUrl = '/doctor/prescriptions';
        console.log('Route URL being used:', routeUrl);
        console.log('About to call router.post with data:', updatedData);
        
        router.post(routeUrl, updatedData, {
            onSuccess: (page) => {
                console.log('Prescription created successfully!', page);
                toastSuccess(
                    "Prescription Created Successfully",
                    `Prescription has been created successfully for ${medicinesData.length} medicine(s).`
                );
                
                // Reset form
                setSelectedMedicines([]);
                setData({
                    medical_record_id: '',
                    prescription_date: new Date().toISOString().split('T')[0],
                    case_id: '',
                    medicines: [],
                    notes: ''
                });
                
                // The redirect is handled by the backend
            },
            onError: (errors) => {
                console.error('Prescription creation failed:', errors);
                
                // Handle specific validation errors
                if (errors && typeof errors === 'object') {
                    const errorMessages = [];
                    
                    // Handle validation errors
                    if (errors.medicines) {
                        errorMessages.push(`Medicines: ${Array.isArray(errors.medicines) ? errors.medicines[0] : errors.medicines}`);
                    }
                    if (errors.medical_record_id) {
                        errorMessages.push(`Patient: ${Array.isArray(errors.medical_record_id) ? errors.medical_record_id[0] : errors.medical_record_id}`);
                    }
                    if (errors.case_id) {
                        errorMessages.push(`Case ID: ${Array.isArray(errors.case_id) ? errors.case_id[0] : errors.case_id}`);
                    }
                    if (errors.prescription_date) {
                        errorMessages.push(`Date: ${Array.isArray(errors.prescription_date) ? errors.prescription_date[0] : errors.prescription_date}`);
                    }
                    
                    // Show specific error messages
                    if (errorMessages.length > 0) {
                        toastError(
                            "Prescription Creation Failed",
                            errorMessages.join('\n')
                        );
                    } else {
                        // Generic error message
                        toastError(
                            "Prescription Creation Failed",
                            "An error occurred while creating the prescription. Please check your inputs and try again."
                        );
                    }
                    
                    // Log all errors for debugging
                    Object.keys(errors).forEach(key => {
                        console.error(`${key}:`, errors[key]);
                    });
                } else {
                    toastError(
                        "Prescription Creation Failed",
                        "An unexpected error occurred. Please try again."
                    );
                }
            },
            onFinish: () => {
                console.log('Form submission finished');
            }
        });
    };

    const getSelectedMedicine = (medicineId) => {
        return availableMedicines.find(med => med.id == medicineId);
    };


    return (
        <AdminLayout header="Create Prescription">
            <Head title="Create Prescription" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('doctor.prescriptions')}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Prescription</h1>
                        <p className="text-gray-600">Create a prescription based on a patient's diagnosis</p>
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Medical Workflow:</strong> Diagnosis → Prescription. You can only create prescriptions for patients who have been diagnosed.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Medical Record Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Patient Diagnosis Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Step 1: Select Patient */}
                            <div>
                                <Label htmlFor="patient_selection">Select Patient *</Label>
                                <Select value={selectedPatientId} onValueChange={handlePatientSelection}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Choose a patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniquePatients.map((patient) => (
                                            <SelectItem key={patient.id} value={String(patient.id)}>
                                                <span className="font-medium">{patient.name}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Step 2: Select Diagnosis (only show if patient is selected) */}
                            {selectedPatientId && patientDiagnoses.length > 0 && (
                                <div>
                                    <Label htmlFor="medical_record_id">Select Diagnosis *</Label>
                                    <Select value={data.medical_record_id} onValueChange={(value) => setData('medical_record_id', value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Choose a diagnosis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patientDiagnoses.map((diagnosis) => (
                                                <SelectItem key={diagnosis.id} value={String(diagnosis.id)}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{diagnosis.diagnosis}</span>
                                                        <span className="text-xs text-gray-500">{diagnosis.record_date}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                                
                                {/* Display selected diagnosis information */}
                                {data.medical_record_id && (
                                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-green-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-green-900 mb-1">
                                                    {selectedPatientId}
                                                </h4>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-green-700">
                                                        <span className="font-medium">Diagnosis:</span> {patientDiagnoses.find(d => d.id === parseInt(data.medical_record_id))?.diagnosis}
                                                    </p>
                                                    <p className="text-sm text-green-600">
                                                        <span className="font-medium">Date:</span> {patientDiagnoses.find(d => d.id === parseInt(data.medical_record_id))?.record_date}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {errors.medical_record_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.medical_record_id}</p>
                                )}
                                {medicalRecords.length === 0 && (
                                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                            <p className="text-sm text-yellow-800">
                                                No patients with diagnoses found. You must first create a medical record with a diagnosis before creating a prescription.
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Prescription Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="prescription_date">Prescription Date *</Label>
                                <Input
                                    id="prescription_date"
                                    type="date"
                                    value={data.prescription_date}
                                    onChange={(e) => setData('prescription_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="mt-1"
                                />
                                {errors.prescription_date && (
                                    <p className="text-sm text-red-600 mt-1">{errors.prescription_date}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="case_id">Case ID *</Label>
                                <Input
                                    id="case_id"
                                    type="text"
                                    value={data.case_id}
                                    onChange={(e) => setData('case_id', e.target.value)}
                                    placeholder="e.g., CASE-001, MED-2025-001, etc."
                                    className="mt-1"
                                />
                                {errors.case_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.case_id}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medicines */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Pill className="h-5 w-5" />
                                    Medicines
                                </div>
                                <Button type="button" onClick={addMedicine} className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Medicine
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedMedicines.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Pill className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p>No medicines added yet</p>
                                    <p className="text-sm">Click "Add Medicine" to start adding medicines to this prescription</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedMedicines.map((medicine, index) => {
                                        const selectedMed = getSelectedMedicine(medicine.medicine_id);
                                        return (
                                            <div key={medicine.id} className="border rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-medium text-gray-900">Medicine {index + 1}</h4>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeMedicine(medicine.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Medicine *</Label>
                                                        <Select 
                                                            value={medicine.medicine_id} 
                                                            onValueChange={(value) => updateMedicine(medicine.id, 'medicine_id', value)}
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Select medicine" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableMedicines && availableMedicines.length > 0 ? (
                                                                    availableMedicines.map((med) => (
                                                                        <SelectItem key={med.id} value={String(med.id)}>
                                                                            {med.name} ({med.generic_name}) - Batch: {med.batch_number} - Stock: {med.available_quantity} {med.unit}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <SelectItem value="no-medicines" disabled>
                                                                        No medicines available
                                                                    </SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label>Quantity *</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={medicine.quantity}
                                                            onChange={(e) => updateMedicine(medicine.id, 'quantity', e.target.value)}
                                                            placeholder="Enter quantity"
                                                            className={`mt-1 ${
                                                                isQuantityExceeded(medicine.medicine_id, medicine.quantity) 
                                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                                    : ''
                                                            }`}
                                                        />
                                                        {selectedMed && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Available: {selectedMed.available_quantity} {selectedMed.unit}
                                                            </p>
                                                        )}
                                                        {isQuantityExceeded(medicine.medicine_id, medicine.quantity) && (
                                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                Quantity exceeds available stock! Available: {selectedMed?.available_quantity || 0} {selectedMed?.unit || 'units'}
                                                            </p>
                                                        )}
                                                    </div>


                                                    <div>
                                                        <Label>Frequency *</Label>
                                                        <Select 
                                                            value={medicine.frequency} 
                                                            onValueChange={(value) => updateMedicine(medicine.id, 'frequency', value)}
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Select frequency" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Once daily">Once daily</SelectItem>
                                                                <SelectItem value="Twice daily">Twice daily</SelectItem>
                                                                <SelectItem value="Three times daily">Three times daily</SelectItem>
                                                                <SelectItem value="Four times daily">Four times daily</SelectItem>
                                                                <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                                                                <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                                                                <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                                                                <SelectItem value="As needed">As needed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label>Duration *</Label>
                                                        <Input
                                                            value={medicine.duration}
                                                            onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                                                            placeholder="e.g., 7 days, 2 weeks"
                                                            className="mt-1"
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <Label>Instructions</Label>
                                                        <Textarea
                                                            value={medicine.instructions}
                                                            onChange={(e) => updateMedicine(medicine.id, 'instructions', e.target.value)}
                                                            placeholder="Additional instructions for the patient"
                                                            className="mt-1"
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Any additional notes or instructions for this prescription"
                                rows={4}
                            />
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link href={route('doctor.prescriptions')}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button 
                            type="button" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit(e);
                            }}
                            disabled={processing || selectedMedicines.length === 0}
                        >
                            {processing ? 'Creating...' : 'Create Prescription'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
