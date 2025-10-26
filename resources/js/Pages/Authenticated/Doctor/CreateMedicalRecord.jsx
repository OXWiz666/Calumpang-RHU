import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/tempo/components/ui/button';
import { Input } from '@/components/tempo/components/ui/input';
import { Label } from '@/components/tempo/components/ui/label';
import { Textarea } from '@/components/tempo/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/tempo/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { 
    ArrowLeft,
    User,
    Stethoscope,
    Calendar,
    FileText,
    AlertCircle
} from 'lucide-react';

export default function CreateMedicalRecord({ patients }) {
    const { data, setData, post, processing, errors } = useForm({
        appointment_id: '',
        diagnosis: '',
        symptoms: '',
        treatment: '',
        notes: '',
        vital_signs: {
            blood_pressure: '',
            heart_rate: '',
            temperature: '',
            weight: '',
            height: ''
        },
        lab_results: {
            blood_test: '',
            urine_test: '',
            x_ray: '',
            other: ''
        },
        follow_up_date: '',
        record_type: 'consultation'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('doctor.medical-records.store'));
    };

    const handleVitalSignChange = (field, value) => {
        setData('vital_signs', {
            ...data.vital_signs,
            [field]: value
        });
    };

    const handleLabResultChange = (field, value) => {
        setData('lab_results', {
            ...data.lab_results,
            [field]: value
        });
    };

    return (
        <AdminLayout header="Create Medical Record">
            <Head title="Create Medical Record" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('doctor.medical-records')}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Medical Record</h1>
                        <p className="text-gray-600">Record patient diagnosis and treatment information</p>
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Medical Workflow:</strong> Create diagnosis first, then create prescription based on this record.
                            </p>
                        </div>
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
                                <Label htmlFor="appointment_id">Select Patient *</Label>
                                <Select value={data.appointment_id} onValueChange={(value) => setData('appointment_id', value)}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Choose a patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map((patient) => (
                                            <SelectItem key={patient.id} value={String(patient.id)}>
                                                {patient.name} - {patient.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.appointment_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.appointment_id}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="record_type">Record Type *</Label>
                                <Select value={data.record_type} onValueChange={(value) => setData('record_type', value)}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select record type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="consultation">Consultation</SelectItem>
                                        <SelectItem value="checkup">Checkup</SelectItem>
                                        <SelectItem value="emergency">Emergency</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.record_type && (
                                    <p className="text-sm text-red-600 mt-1">{errors.record_type}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Diagnosis Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5" />
                                Diagnosis Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="diagnosis">Primary Diagnosis *</Label>
                                <Input
                                    id="diagnosis"
                                    value={data.diagnosis}
                                    onChange={(e) => setData('diagnosis', e.target.value)}
                                    placeholder="Enter primary diagnosis"
                                    className="mt-1"
                                />
                                {errors.diagnosis && (
                                    <p className="text-sm text-red-600 mt-1">{errors.diagnosis}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="symptoms">Symptoms</Label>
                                <Textarea
                                    id="symptoms"
                                    value={data.symptoms}
                                    onChange={(e) => setData('symptoms', e.target.value)}
                                    placeholder="Describe patient symptoms"
                                    className="mt-1"
                                    rows={3}
                                />
                                {errors.symptoms && (
                                    <p className="text-sm text-red-600 mt-1">{errors.symptoms}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="treatment">Treatment</Label>
                                <Textarea
                                    id="treatment"
                                    value={data.treatment}
                                    onChange={(e) => setData('treatment', e.target.value)}
                                    placeholder="Describe treatment provided"
                                    className="mt-1"
                                    rows={3}
                                />
                                {errors.treatment && (
                                    <p className="text-sm text-red-600 mt-1">{errors.treatment}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vital Signs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Vital Signs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="blood_pressure">Blood Pressure</Label>
                                    <Input
                                        id="blood_pressure"
                                        value={data.vital_signs.blood_pressure}
                                        onChange={(e) => handleVitalSignChange('blood_pressure', e.target.value)}
                                        placeholder="e.g., 120/80"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="heart_rate">Heart Rate (BPM)</Label>
                                    <Input
                                        id="heart_rate"
                                        value={data.vital_signs.heart_rate}
                                        onChange={(e) => handleVitalSignChange('heart_rate', e.target.value)}
                                        placeholder="e.g., 72"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="temperature">Temperature (°C)</Label>
                                    <Input
                                        id="temperature"
                                        value={data.vital_signs.temperature}
                                        onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                                        placeholder="e.g., 36.5"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        value={data.vital_signs.weight}
                                        onChange={(e) => handleVitalSignChange('weight', e.target.value)}
                                        placeholder="e.g., 70"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        value={data.vital_signs.height}
                                        onChange={(e) => handleVitalSignChange('height', e.target.value)}
                                        placeholder="e.g., 170"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lab Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Lab Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="blood_test">Blood Test Results</Label>
                                    <Textarea
                                        id="blood_test"
                                        value={data.lab_results.blood_test}
                                        onChange={(e) => handleLabResultChange('blood_test', e.target.value)}
                                        placeholder="Enter blood test results"
                                        className="mt-1"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="urine_test">Urine Test Results</Label>
                                    <Textarea
                                        id="urine_test"
                                        value={data.lab_results.urine_test}
                                        onChange={(e) => handleLabResultChange('urine_test', e.target.value)}
                                        placeholder="Enter urine test results"
                                        className="mt-1"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="x_ray">X-Ray Results</Label>
                                    <Textarea
                                        id="x_ray"
                                        value={data.lab_results.x_ray}
                                        onChange={(e) => handleLabResultChange('x_ray', e.target.value)}
                                        placeholder="Enter X-ray results"
                                        className="mt-1"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="other">Other Tests</Label>
                                    <Textarea
                                        id="other"
                                        value={data.lab_results.other}
                                        onChange={(e) => handleLabResultChange('other', e.target.value)}
                                        placeholder="Enter other test results"
                                        className="mt-1"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="notes">Clinical Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Additional clinical notes"
                                    className="mt-1"
                                    rows={4}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="follow_up_date">Follow-up Date</Label>
                                <Input
                                    id="follow_up_date"
                                    type="date"
                                    value={data.follow_up_date}
                                    onChange={(e) => setData('follow_up_date', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.follow_up_date && (
                                    <p className="text-sm text-red-600 mt-1">{errors.follow_up_date}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
                        >
                            {processing ? 'Creating...' : 'Create Medical Record'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
