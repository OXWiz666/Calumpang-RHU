import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    User,
    Lock,
    Bell,
    Shield,
    Mail,
    Phone,
    MapPin,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Badge } from "@/components/tempo/components/ui/badge";

export default function PharmacistSettings() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Mock user data
    const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@pharmacy.com",
        phone: "+1 (555) 123-4567",
        address: "123 Pharmacy Street, Medical City",
        role: "Pharmacist",
        lastLogin: "2024-01-15 10:30 AM",
        accountStatus: "Active",
    };

    return (
        <AdminLayout header="Settings">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Profile Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-10 w-10 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {userData.firstName} {userData.lastName}
                                </h2>
                                <p className="text-gray-600 mb-2">{userData.role}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Last login: {userData.lastLogin}</span>
                                    <Badge className="bg-green-100 text-green-800">
                                        {userData.accountStatus}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        defaultValue={userData.firstName}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        defaultValue={userData.lastName}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={userData.email}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative mt-1">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        defaultValue={userData.phone}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <div className="relative mt-1">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="address"
                                        defaultValue={userData.address}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            <Button className="w-full flex items-center gap-2" style={{ backgroundColor: '#2C3E50' }}>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <Button className="w-full flex items-center gap-2" style={{ backgroundColor: '#2C3E50' }}>
                                <Shield className="h-4 w-4" />
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Notification Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Low Stock Alerts</h3>
                                    <p className="text-sm text-gray-500">
                                        Get notified when inventory items are running low
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Enabled
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Expiry Notifications</h3>
                                    <p className="text-sm text-gray-500">
                                        Receive alerts for items approaching expiration
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Enabled
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Daily Reports</h3>
                                    <p className="text-sm text-gray-500">
                                        Get daily summary reports via email
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Disabled
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">System Updates</h3>
                                    <p className="text-sm text-gray-500">
                                        Notifications about system maintenance and updates
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Enabled
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Export Data
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Two-Factor Authentication
                            </Button>
                            <Button variant="destructive" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Deactivate Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AdminLayout>
    );
}
