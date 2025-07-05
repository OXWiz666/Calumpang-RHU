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
import CustomModal from "@/components/CustomModal";
import AdminLayout from "@/Layouts/AdminLayout";

import { motion } from "framer-motion";

// interface EditPatientFormProps {
//   patient: Patient
//   onSubmit: (patient: Patient) => void
//   onCancel: () => void
// }

export default function EditPatientForm({ patient, onCancel, onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: patient.firstname,
        lastName: patient.lastname,
        dateOfBirth: patient.birth,
        gender: patient?.gender,
        phoneNumber: patient.contactno,
        email: patient.email || "",
        address: patient.address,
        // emergencyContact: patient.emergencyContact,
        // emergencyPhone: patient.emergencyPhone,
        bloodType: patient.bloodtype || "",
        allergies: patient.allergies?.join(", ") || "",
        medications: patient.medications?.join(", ") || "",
        status: patient.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedPatient = {
            ...patient,
            ...formData,
            allergies: formData.allergies
                ? formData.allergies.split(",").map((a) => a.trim())
                : [],
            medications: formData.medications
                ? formData.medications.split(",").map((m) => m.trim())
                : [],
        };

        onSubmit(updatedPatient);
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={onCancel}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Patient</h1>
                        <p className="text-muted-foreground">
                            Update patient information
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
                                <Label htmlFor="dateOfBirth">
                                    Date of Birth *
                                </Label>
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
                                        <SelectItem value="M">Male</SelectItem>
                                        <SelectItem value="F">
                                            Female
                                        </SelectItem>
                                        <SelectItem value="Other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">
                                    Phone Number *
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "phoneNumber",
                                            e.target.value
                                        )
                                    }
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
                                        handleInputChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        handleInputChange("status", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address *</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    {/* <Card>
                            <CardHeader>
                                <CardTitle>Emergency Contact</CardTitle>
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
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card> */}

                    {/* Medical Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical Information</CardTitle>
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
                                        <SelectItem value="none">
                                            Not specified
                                        </SelectItem>
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
                                <Label htmlFor="allergies">
                                    Known Allergies
                                </Label>
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
