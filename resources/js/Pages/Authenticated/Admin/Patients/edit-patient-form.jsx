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
import { ArrowLeft, Save, X } from "lucide-react";
import CustomModal from "@/components/CustomModal";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";

import { motion } from "framer-motion";

// interface EditPatientFormProps {
//   patient: Patient
//   onSubmit: (patient: Patient) => void
//   onCancel: () => void
// }

export default function EditPatientForm({ patient, onCancel, onSubmit, isOpen = true }) {
    const isAppointmentPatient = patient?.id?.startsWith('PAT_');
    
    const [formData, setFormData] = useState({
        // Basic Information
        firstName: patient.firstname || "",
        middleName: patient.middlename || "",
        lastName: patient.lastname || "",
        dateOfBirth: isAppointmentPatient ? patient.date_of_birth : patient.birth,
        gender: patient?.gender || patient?.sex || "",
        phoneNumber: patient.contactno || patient.phone || "",
        email: patient.email || "",
        status: patient.status || "active",
        
        // Personal Information (for appointment patients)
        civilStatus: patient.civil_status || "",
        nationality: patient.nationality || "",
        religion: patient.religion || "",
        country: patient.country || "",
        
        // Address Information (for appointment patients)
        region: patient.region || "",
        province: patient.province || "",
        city: patient.city || "",
        barangay: patient.barangay || "",
        street: patient.street || "",
        zipCode: patient.zip_code || "",
        
        // Legacy address (for regular users)
        address: patient.address || "",
        
        // Medical Information
        bloodType: patient.bloodtype || "",
        allergies: patient.allergies?.join(", ") || "",
        medications: patient.medications?.join(", ") || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            // Basic Information
            firstname: formData.firstName,
            middlename: formData.middleName,
            lastname: formData.lastName,
            email: formData.email,
            status: formData.status,
            
            // Handle different date fields based on patient type
            ...(isAppointmentPatient ? {
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                phone: formData.phoneNumber,
                contactno: formData.phoneNumber,
                
                // Personal Information
                civil_status: formData.civilStatus,
                nationality: formData.nationality,
                religion: formData.religion,
                country: formData.country,
                
                // Address Information
                region: formData.region,
                province: formData.province,
                city: formData.city,
                barangay: formData.barangay,
                street: formData.street,
                zip_code: formData.zipCode,
            } : {
                birth: formData.dateOfBirth,
                sex: formData.gender,
                contactno: formData.phoneNumber,
                address: formData.address,
            }),
            
            // Medical Information
            bloodtype: formData.bloodType,
            allergies: formData.allergies
                ? formData.allergies.split(",").map((a) => a.trim())
                : [],
            medications: formData.medications
                ? formData.medications.split(",").map((m) => m.trim())
                : [],
        };

        // Submit the form using Inertia router
        router.put(`/auth/patients/${patient.id}`, submitData, {
            onSuccess: () => {
                // Call the original onSubmit callback to close the form
                onSubmit({
                    ...patient,
                    ...submitData
                });
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
                // You could show error messages here
            }
        });
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Edit Patient</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Update patient information
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-1"
                >
                <div className="space-y-3 pb-0">

                <form onSubmit={handleSubmit} className="space-y-3 mb-0">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                            <CardDescription className="text-sm">
                                Patient's personal details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
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

                            <div className="space-y-1">
                                <Label htmlFor="middleName">Middle Name</Label>
                                <Input
                                    id="middleName"
                                    value={formData.middleName}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "middleName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-1">
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

                            <div className="space-y-1">
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

                            <div className="space-y-1">
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

                            <div className="space-y-1">
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

                            <div className="space-y-1">
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

                            <div className="space-y-1">
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

                            <div className="space-y-1 md:col-span-2">
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
                                    required={!isAppointmentPatient}
                                    className="min-h-[60px] max-h-[80px]"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    {(
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Personal Information</CardTitle>
                                <CardDescription className="text-sm">
                                    Additional personal details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="civilStatus">Civil Status</Label>
                                    <Select
                                        value={formData.civilStatus}
                                        onValueChange={(value) =>
                                            handleInputChange("civilStatus", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select civil status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Single</SelectItem>
                                            <SelectItem value="Married">Married</SelectItem>
                                            <SelectItem value="Widowed">Widowed</SelectItem>
                                            <SelectItem value="Divorced">Divorced</SelectItem>
                                            <SelectItem value="Separated">Separated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input
                                        id="nationality"
                                        value={formData.nationality}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "nationality",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Filipino"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Input
                                        id="religion"
                                        value={formData.religion}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "religion",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Catholic"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "country",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Philippines"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Address Information */}
                    {(
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Address Information</CardTitle>
                                <CardDescription className="text-sm">
                                    Complete address details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="region">Region</Label>
                                    <Input
                                        id="region"
                                        value={formData.region}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "region",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Region IV-A"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="province">Province</Label>
                                    <Input
                                        id="province"
                                        value={formData.province}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "province",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Laguna"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "city",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Calamba"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="barangay">Barangay</Label>
                                    <Input
                                        id="barangay"
                                        value={formData.barangay}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "barangay",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Barangay 1"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="street">Street</Label>
                                    <Input
                                        id="street"
                                        value={formData.street}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "street",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., 123 Main Street"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="zipCode">Zip Code</Label>
                                    <Input
                                        id="zipCode"
                                        value={formData.zipCode}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "zipCode",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., 4027"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Emergency Contact */}
                    {/* <Card>
                            <CardHeader>
                                <CardTitle>Emergency Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
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

                                <div className="space-y-1">
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
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Medical Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1">
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

                            <div className="space-y-1">
                                <Label htmlFor="allergies">
                                    Known Allergies
                                </Label>
                                <Textarea
                                    id="allergies"
                                    value={formData.allergies}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "allergies",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Separate multiple allergies with commas"
                                    className="min-h-[50px] max-h-[80px]"
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="medications">
                                    Current Medications
                                </Label>
                                <Textarea
                                    id="medications"
                                    value={formData.medications}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "medications",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Separate multiple medications with commas"
                                    className="min-h-[50px] max-h-[80px]"
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-3 pb-2">
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
            </DialogContent>
        </Dialog>
    );
}
