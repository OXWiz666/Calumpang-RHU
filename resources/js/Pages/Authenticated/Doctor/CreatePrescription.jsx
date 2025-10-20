import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/tempo/components/ui/button';
import { Input } from '@/components/tempo/components/ui/input';
import { Label } from '@/components/tempo/components/ui/label';
import { Textarea } from '@/components/tempo/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/tempo/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { 
    Plus, 
    Trash2, 
    Calendar, 
    User, 
    Pill,
    ArrowLeft,
    AlertTriangle
} from 'lucide-react';

export default function CreatePrescription({ patients, medicines }) {
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [availableMedicines, setAvailableMedicines] = useState([]);

    // Set available medicines from props
    useEffect(() => {
        if (medicines && Array.isArray(medicines)) {
            setAvailableMedicines(medicines);
        }
    }, [medicines]);

    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        prescription_date: new Date().toISOString().split('T')[0],
        case_id: '',
        medicines: [],
        notes: ''
    });

    const addMedicine = () => {
        const newMedicine = {
            id: Date.now(),
            medicine_id: '',
            dosage: '',
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
        setSelectedMedicines(selectedMedicines.map(med => 
            med.id === id ? { ...med, [field]: value } : med
        ));
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
        
        // Check for quantity validation errors
        const hasQuantityErrors = selectedMedicines.some(med => 
            med.medicine_id && med.quantity && isQuantityExceeded(med.medicine_id, med.quantity)
        );
        
        if (hasQuantityErrors) {
            alert('Please fix quantity errors before submitting the prescription.');
            return;
        }
        
        // Prepare medicines data
        const medicinesData = selectedMedicines
            .filter(med => med.medicine_id && med.dosage && med.frequency && med.duration && med.quantity)
            .map(med => ({
                medicine_id: med.medicine_id,
                dosage: med.dosage,
                frequency: med.frequency,
                duration: med.duration,
                quantity: parseInt(med.quantity),
                instructions: med.instructions
            }));

        console.log('Selected medicines:', selectedMedicines);
        console.log('Filtered medicines data:', medicinesData);
        console.log('Form data before setData:', data);

        setData('medicines', medicinesData);
        
        console.log('Route URL:', route('doctor.prescriptions.store'));
        console.log('Form data after setData:', data);
        
        // Use hardcoded URL to fix the 404 issue
        post('/doctor/prescriptions', {
            onSuccess: () => {
                console.log('Prescription created successfully!');
                // Reset form
                setSelectedMedicines([]);
            },
            onError: (errors) => {
                console.error('Prescription creation failed:', errors);
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
                        <p className="text-gray-600">Create a new prescription for a patient</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Patient Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="patient_id">Select Patient *</Label>
                                <Select value={data.patient_id} onValueChange={(value) => setData('patient_id', value)}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Choose a patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map((patient) => (
                                            <SelectItem key={patient.id} value={String(patient.id)}>
                                                {patient.id} - {patient.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.patient_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.patient_id}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="prescription_date">Prescription Date *</Label>
                                <Input
                                    id="prescription_date"
                                    type="date"
                                    value={data.prescription_date}
                                    onChange={(e) => setData('prescription_date', e.target.value)}
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
                                                        <Label>Dosage *</Label>
                                                        <Input
                                                            value={medicine.dosage}
                                                            onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                                                            placeholder="e.g., 500mg, 1 tablet"
                                                            className="mt-1"
                                                        />
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
                        <Button type="submit" disabled={processing || selectedMedicines.length === 0}>
                            {processing ? 'Creating...' : 'Create Prescription'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
