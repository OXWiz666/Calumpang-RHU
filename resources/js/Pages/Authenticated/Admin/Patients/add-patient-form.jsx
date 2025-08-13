"use client";

import React from "react";

import { useState } from "react";
// import { Patient } from "./page";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

// interface AddPatientFormProps {
//   onSubmit: (patient: Omit<Patient, "id" | "registrationDate">) => void
//   onCancel: () => void
// }

export default function AddPatientForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        email: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
        bloodType: "",
        allergies: "",
        medications: "",
        status: "active",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const patient = {
            ...formData,
            allergies: formData.allergies
                ? formData.allergies.split(",").map((a) => a.trim())
                : [],
            medications: formData.medications
                ? formData.medications.split(",").map((m) => m.trim())
                : [],
            medicalHistory: [],
        };

        onSubmit(patient);
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
                    <h1 className="text-3xl font-bold">Add New Patient</h1>
                    <p className="text-muted-foreground">
                        Enter patient information to create a new record
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Patient's personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) =>
                                    handleInputChange(
                                        "firstName",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) =>
                                    handleInputChange(
                                        "lastName",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) =>
                                    handleInputChange(
                                        "dateOfBirth",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender *</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) =>
                                    handleInputChange("gender", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                            <Input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    handleInputChange(
                                        "phoneNumber",
                                        e.target.value
                                    )
                                }
                                placeholder="+63 912 345 6789"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                                placeholder="patient@email.com"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address *</Label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) =>
                                    handleInputChange("address", e.target.value)
                                }
                                placeholder="Complete address including barangay, municipality, province"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                    <CardHeader>
                        <CardTitle>Emergency Contact</CardTitle>
                        <CardDescription>
                            Person to contact in case of emergency
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContact">
                                Emergency Contact Name *
                            </Label>
                            <Input
                                id="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={(e) =>
                                    handleInputChange(
                                        "emergencyContact",
                                        e.target.value
                                    )
                                }
                                placeholder="Full name and relationship"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emergencyPhone">
                                Emergency Contact Phone *
                            </Label>
                            <Input
                                id="emergencyPhone"
                                value={formData.emergencyPhone}
                                onChange={(e) =>
                                    handleInputChange(
                                        "emergencyPhone",
                                        e.target.value
                                    )
                                }
                                placeholder="+63 912 345 6789"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Medical Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Medical Information</CardTitle>
                        <CardDescription>
                            Optional medical details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="bloodType">Blood Type</Label>
                            <Select
                                value={formData.bloodType}
                                onValueChange={(value) =>
                                    handleInputChange("bloodType", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="allergies">Known Allergies</Label>
                            <Input
                                id="allergies"
                                value={formData.allergies}
                                onChange={(e) =>
                                    handleInputChange(
                                        "allergies",
                                        e.target.value
                                    )
                                }
                                placeholder="Separate multiple allergies with commas"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="medications">
                                Current Medications
                            </Label>
                            <Input
                                id="medications"
                                value={formData.medications}
                                onChange={(e) =>
                                    handleInputChange(
                                        "medications",
                                        e.target.value
                                    )
                                }
                                placeholder="Separate multiple medications with commas"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Add Patient
                    </Button>
                </div>
            </form>
        </div>
    );
}
