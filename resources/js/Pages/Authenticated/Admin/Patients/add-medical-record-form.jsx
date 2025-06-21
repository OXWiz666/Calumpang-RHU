"use client";

import React from "react";

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
import { ArrowLeft, Save } from "lucide-react";

// interface AddMedicalRecordFormProps {
//   patientName: string
//   onSubmit: (record: Omit<MedicalRecord, "id">) => void
//   onCancel: () => void
// }

export default function AddMedicalRecordForm({
    patientName,
    onSubmit,
    onCancel,
}) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        diagnosis: "",
        treatment: "",
        doctor: "",
        notes: "",
        followUp: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onCancel}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Add Medical Record</h1>
                    <p className="text-muted-foreground">
                        Patient: {patientName}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Medical Record Details</CardTitle>
                        <CardDescription>
                            Enter the medical consultation details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "date",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="doctor">
                                    Doctor/Healthcare Provider *
                                </Label>
                                <Input
                                    id="doctor"
                                    value={formData.doctor}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "doctor",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Dr. Smith"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="diagnosis">Diagnosis *</Label>
                            <Input
                                id="diagnosis"
                                value={formData.diagnosis}
                                onChange={(e) =>
                                    handleInputChange(
                                        "diagnosis",
                                        e.target.value
                                    )
                                }
                                placeholder="Primary diagnosis or condition"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="treatment">Treatment *</Label>
                            <Input
                                id="treatment"
                                value={formData.treatment}
                                onChange={(e) =>
                                    handleInputChange(
                                        "treatment",
                                        e.target.value
                                    )
                                }
                                placeholder="Treatment provided or prescribed"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Clinical Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) =>
                                    handleInputChange("notes", e.target.value)
                                }
                                placeholder="Additional observations, symptoms, or clinical notes"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="followUp">
                                Follow-up Instructions
                            </Label>
                            <Textarea
                                id="followUp"
                                value={formData.followUp}
                                onChange={(e) =>
                                    handleInputChange(
                                        "followUp",
                                        e.target.value
                                    )
                                }
                                placeholder="Follow-up care instructions or next appointment details"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Add Medical Record
                    </Button>
                </div>
            </form>
        </div>
    );
}
