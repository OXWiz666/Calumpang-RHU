"use client";

import React, { useState } from "react";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
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
import { X, Save, User } from "lucide-react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";
import { motion } from "framer-motion";

export default function EditAdminModal({ admin, isOpen, onClose, onSuccess }) {
    // Convert integer status to string for form
    const getStatusString = (statusInt) => {
        const statusMap = {
            1: 'active',
            2: 'inactive', 
            3: 'suspended'
        };
        return statusMap[statusInt] || 'active';
    };

    const [formData, setFormData] = useState({
        firstname: admin?.firstname || "",
        lastname: admin?.lastname || "",
        email: admin?.email || "",
        contactno: admin?.contactno || "",
        status: getStatusString(admin?.status) || "active",
        role_id: admin?.role_id || 1, // Admin role
        password: "",
        password_confirmation: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({}); // Clear previous errors

        // Client-side validation - only for password
        const validationErrors = {};
        
        // Check if password is provided but confirmation is missing
        if (formData.password && !formData.password_confirmation) {
            validationErrors.password_confirmation = 'Please confirm your new password.';
        }
        
        // Check if passwords don't match
        if (formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation) {
            validationErrors.password_confirmation = 'Passwords do not match.';
        }
        
        // Check password length if provided
        if (formData.password && formData.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters.';
        }
        
        // If there are validation errors, show them and stop submission
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        // Ensure contactno is sent as string
        const submitData = {
            ...formData,
            contactno: String(formData.contactno)
        };

        router.put(`/admin/staff/admins/${admin.id}`, submitData, {
            onSuccess: (page) => {
                console.log('Update successful:', page);
                setErrors({}); // Clear errors on success
                // Show success toast
                if (page.props.flash?.success) {
                    // Toast will be handled by the parent component
                }
                onSuccess && onSuccess(formData);
                onClose();
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
                setErrors(errors); // Store errors for display
                setIsSubmitting(false);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Edit Admin Account</h2>
                            <p className="text-sm text-muted-foreground">
                                Update admin information and settings
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Error Display */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Please correct the following errors:
                                    </h3>
                                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                        {Object.entries(errors).map(([field, error]) => (
                                            <li key={field}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Personal Information</CardTitle>
                                <CardDescription>
                                    Basic admin account details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstname">First Name </Label>
                                        <Input
                                            id="firstname"
                                            value={formData.firstname}
                                            onChange={(e) => handleInputChange("firstname", e.target.value)}
                                            
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastname">Last Name </Label>
                                        <Input
                                            id="lastname"
                                            value={formData.lastname}
                                            onChange={(e) => handleInputChange("lastname", e.target.value)}
                                            
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactno">Contact Number </Label>
                                        <Input
                                            id="contactno"
                                            value={formData.contactno}
                                            onChange={(e) => handleInputChange("contactno", e.target.value)}
                                            
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Account Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleInputChange("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Security Settings</CardTitle>
                                <CardDescription>
                                    Update account password
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            placeholder="Leave blank to keep current password"
                                            className={errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={formData.password_confirmation}
                                            onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                                            placeholder="Confirm new password"
                                            className={errors.password_confirmation ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                        />
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
