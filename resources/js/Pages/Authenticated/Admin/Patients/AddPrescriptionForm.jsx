import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/tempo/components/ui/select";
import { X, Plus, Trash2, RefreshCw, FileText, Printer } from 'lucide-react';

export default function AddPrescriptionForm({ 
    patient, 
    doctors, 
    medicines, 
    onSubmit, 
    onCancel, 
    errors = {} 
}) {
    const { data, setData, post, processing, reset } = useForm({
        patient_id: patient?.id || '',
        doctor_id: doctors && doctors.length > 0 ? doctors[0].user_id : '', // Auto-select first doctor's user_id
        prescription_date: new Date().toISOString().split('T')[0],
        case_id: '',
        medicines: [{ medicine_id: '', dosage: '', frequency: '', duration: '', quantity: '', instructions: '' }]
    });

    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        console.log('Medicines prop received:', medicines);
        console.log('Medicines type:', typeof medicines);
        console.log('Medicines length:', medicines ? medicines.length : 'undefined');
        if (medicines) {
            setSelectedMedicines(medicines);
        } else {
            console.log('No medicines prop received');
        }

        // Load draft data if available
        const savedDraft = localStorage.getItem('prescription_draft');
        if (savedDraft) {
            try {
                const draftData = JSON.parse(savedDraft);
                if (draftData.patient_id === patient?.id) {
                    setData(draftData);
                    console.log('Loaded prescription draft');
                }
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, [medicines, patient?.id]);

    // Real-time updates for medicines
    useEffect(() => {
        if (window.Echo) {
            const channel = window.Echo.channel('inventory-updates')
                .listen('InventoryUpdated', (e) => {
                    console.log('Inventory updated, refreshing medicines...', e);
                    refreshMedicines();
                });

            return () => {
                window.Echo.leaveChannel('inventory-updates');
            };
        }
    }, []);

    const refreshMedicines = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['medicines'],
            onFinish: () => {
                setIsRefreshing(false);
            }
        });
    };

    const addMedicine = () => {
        setData('medicines', [...data.medicines, { 
            medicine_id: '', 
            dosage: '', 
            frequency: '', 
            duration: '', 
            quantity: '', 
            instructions: '' 
        }]);
    };

    const removeMedicine = (index) => {
        const newMedicines = data.medicines.filter((_, i) => i !== index);
        setData('medicines', newMedicines);
    };

    const updateMedicine = (index, field, value) => {
        const newMedicines = [...data.medicines];
        newMedicines[index][field] = value;
        
        // Auto-fill medicine details when medicine is selected
        if (field === 'medicine_id' && value) {
            const selectedMedicine = selectedMedicines.find(med => med.id == value);
            if (selectedMedicine) {
                newMedicines[index].medicine_name = selectedMedicine.name;
                newMedicines[index].available_stock = selectedMedicine.available_quantity;
                newMedicines[index].unit = selectedMedicine.unit;
            }
        }
        
        setData('medicines', newMedicines);
    };

    // Check for duplicate medicines
    const isDuplicateMedicine = (medicineId, currentIndex) => {
        return data.medicines.some((med, index) => 
            index !== currentIndex && med.medicine_id === medicineId
        );
    };

    // Validate stock availability
    const validateStock = (medicineId, quantity) => {
        const medicine = selectedMedicines.find(med => med.id == medicineId);
        if (medicine && parseInt(quantity) > medicine.available_quantity) {
            return `Only ${medicine.available_quantity} ${medicine.unit} available`;
        }
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate all medicines
        let hasErrors = false;
        const errors = {};
        
        // Check for empty medicines
        const validMedicines = data.medicines.filter(med => 
            med.medicine_id && med.dosage && med.frequency && med.duration && med.quantity
        );
        
        if (validMedicines.length === 0) {
            alert('Please add at least one medicine to the prescription.');
            return;
        }

        // Check for duplicates and stock validation
        data.medicines.forEach((med, index) => {
            if (med.medicine_id) {
                // Check for duplicates
                if (isDuplicateMedicine(med.medicine_id, index)) {
                    errors[`medicine_${index}_duplicate`] = 'This medicine is already added to the prescription.';
                    hasErrors = true;
                }
                
                // Check stock availability
                if (med.quantity) {
                    const stockError = validateStock(med.medicine_id, med.quantity);
                    if (stockError) {
                        errors[`medicine_${index}_stock`] = stockError;
                        hasErrors = true;
                    }
                }
            }
        });

        if (hasErrors) {
            // Show first error
            const firstError = Object.values(errors)[0];
            alert(firstError);
            return;
        }

        const prescriptionData = {
            ...data,
            medicines: validMedicines
        };

        // Clear draft after successful submission
        localStorage.removeItem('prescription_draft');
        
        onSubmit(prescriptionData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Add Prescription for {patient?.firstname} {patient?.lastname}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="doctor_id">Doctor *</Label>
                                <div className="mt-1 p-3 bg-gray-50 border rounded-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">
                                                {doctors && doctors.length > 0 ? 
                                                    `${doctors[0].user.firstname} ${doctors[0].user.lastname}` : 
                                                    'No doctor available'
                                                }
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ID: {doctors && doctors.length > 0 ? doctors[0].user_id : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-green-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {errors.doctor_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.doctor_id}</p>
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
                                    max={new Date().toISOString().split('T')[0]}
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
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Label>Medicines *</Label>
                                    {isRefreshing && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" onClick={refreshMedicines} variant="outline" size="sm" disabled={isRefreshing}>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                    <Button type="button" onClick={addMedicine} size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Medicine
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {data.medicines.map((medicine, index) => (
                                    <Card key={index}>
                                        <CardContent className="pt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-medium">Medicine {index + 1}</h4>
                                                {data.medicines.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeMedicine(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`medicine_${index}`}>Medicine *</Label>
                                                    <Select 
                                                        value={medicine.medicine_id} 
                                                        onValueChange={(value) => updateMedicine(index, 'medicine_id', value)}
                                                    >
                                                        <SelectTrigger className="mt-1">
                                                            <SelectValue placeholder="Select Medicine" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {selectedMedicines && selectedMedicines.length > 0 ? (
                                                                selectedMedicines.map((med) => (
                                                                    <SelectItem 
                                                                        key={med.id} 
                                                                        value={String(med.id)}
                                                                        disabled={isDuplicateMedicine(med.id, index)}
                                                                    >
                                                                        {med.name} ({med.generic_name}) - Batch: {med.batch_number} - Stock: {med.available_quantity} {med.unit}
                                                                        {isDuplicateMedicine(med.id, index) && ' (Already added)'}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <SelectItem value="no-medicines" disabled>
                                                                    No medicines available
                                                                </SelectItem>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {medicine.medicine_id && isDuplicateMedicine(medicine.medicine_id, index) && (
                                                        <p className="text-sm text-red-600 mt-1">This medicine is already added to the prescription.</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor={`dosage_${index}`}>Dosage *</Label>
                                                    <Input
                                                        id={`dosage_${index}`}
                                                        value={medicine.dosage}
                                                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                                        placeholder="e.g., 500mg"
                                                        className="mt-1"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor={`frequency_${index}`}>Frequency *</Label>
                                                    <Input
                                                        id={`frequency_${index}`}
                                                        value={medicine.frequency}
                                                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                                                        placeholder="e.g., 3 times daily"
                                                        className="mt-1"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor={`duration_${index}`}>Duration *</Label>
                                                    <Input
                                                        id={`duration_${index}`}
                                                        value={medicine.duration}
                                                        onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                                        placeholder="e.g., 7 days"
                                                        className="mt-1"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor={`quantity_${index}`}>Quantity *</Label>
                                                    <Input
                                                        id={`quantity_${index}`}
                                                        type="number"
                                                        min="1"
                                                        max={medicine.available_stock || 999999}
                                                        value={medicine.quantity}
                                                        onChange={(e) => updateMedicine(index, 'quantity', e.target.value)}
                                                        placeholder="e.g., 30"
                                                        className="mt-1"
                                                    />
                                                    {medicine.quantity && medicine.medicine_id && (
                                                        (() => {
                                                            const stockError = validateStock(medicine.medicine_id, medicine.quantity);
                                                            return stockError ? (
                                                                <p className="text-sm text-red-600 mt-1">{stockError}</p>
                                                            ) : (
                                                                <p className="text-sm text-green-600 mt-1">
                                                                    Available: {medicine.available_stock} {medicine.unit}
                                                                </p>
                                                            );
                                                        })()
                                                    )}
                                                </div>

                                                <div className="md:col-span-2">
                                                    <Label htmlFor={`instructions_${index}`}>Instructions</Label>
                                                    <Textarea
                                                        id={`instructions_${index}`}
                                                        value={medicine.instructions}
                                                        onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                                                        placeholder="Special instructions for this medicine"
                                                        className="mt-1"
                                                        rows={2}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>


                        {/* Prescription Summary */}
                        {data.medicines.some(med => med.medicine_id) && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3">Prescription Summary</h4>
                                <div className="space-y-2">
                                    {data.medicines
                                        .filter(med => med.medicine_id)
                                        .map((med, index) => {
                                            const medicine = selectedMedicines.find(m => m.id == med.medicine_id);
                                            return (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <span>
                                                        {medicine?.name} - {med.dosage} - {med.frequency} - {med.duration}
                                                    </span>
                                                    <span className="font-medium">
                                                        Qty: {med.quantity} {medicine?.unit}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                <div className="mt-3 pt-2 border-t">
                                    <div className="flex justify-between font-medium">
                                        <span>Total Medicines:</span>
                                        <span>{data.medicines.filter(med => med.medicine_id).length}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <div className="flex space-x-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                        if (confirm('Are you sure you want to clear all form data?')) {
                                            reset();
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear Form
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => {
                                        // Save as draft functionality
                                        const draftData = {
                                            ...data,
                                            medicines: data.medicines.filter(med => med.medicine_id)
                                        };
                                        localStorage.setItem('prescription_draft', JSON.stringify(draftData));
                                        alert('Prescription saved as draft!');
                                    }}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Save as Draft
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => {
                                        // Print preview functionality
                                        const printWindow = window.open('', '_blank');
                                        const prescriptionData = data.medicines.filter(med => med.medicine_id);
                                        const selectedDoctor = doctors && doctors.length > 0 ? doctors[0] : null;
                                        
                                        printWindow.document.write(`
                                            <html>
                                                <head><title>Prescription Preview</title></head>
                                                <body style="font-family: Arial, sans-serif; padding: 20px;">
                                                    <h2>Prescription for ${patient?.firstname} ${patient?.lastname}</h2>
                                                    <p><strong>Doctor:</strong> ${selectedDoctor?.user ? selectedDoctor.user.firstname + ' ' + selectedDoctor.user.lastname : 'Not selected'}</p>
                                                    <p><strong>Date:</strong> ${data.prescription_date}</p>
                                                    <p><strong>Case ID:</strong> ${data.case_id || 'Not selected'}</p>
                                                    <hr>
                                                    <h3>Medicines:</h3>
                                                    ${prescriptionData.map(med => {
                                                        const medicine = selectedMedicines.find(m => m.id == med.medicine_id);
                                                        return `
                                                            <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
                                                                <strong>${medicine?.name || 'Unknown'}</strong><br>
                                                                Dosage: ${med.dosage}<br>
                                                                Frequency: ${med.frequency}<br>
                                                                Duration: ${med.duration}<br>
                                                                Quantity: ${med.quantity} ${medicine?.unit || ''}<br>
                                                                ${med.instructions ? `Instructions: ${med.instructions}` : ''}
                                                            </div>
                                                        `;
                                                    }).join('')}
                                                </body>
                                            </html>
                                        `);
                                        printWindow.document.close();
                                        printWindow.print();
                                    }}
                                >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print Preview
                                </Button>
                            </div>
                            <div className="flex space-x-2">
                                <Button type="button" variant="outline" onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Prescription'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
