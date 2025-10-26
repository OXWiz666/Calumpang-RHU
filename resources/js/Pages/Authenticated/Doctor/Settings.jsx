import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { Button } from '@/components/tempo/components/ui/button';
import { Input } from '@/components/tempo/components/ui/input';
import { Label } from '@/components/tempo/components/ui/label';
import { Separator } from '@/components/tempo/components/ui/separator';
import { 
    Settings, 
    Lock, 
    Eye,
    EyeOff,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function DoctorSettings({ user }) {
    const { auth } = usePage().props;
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const { data: profileData, setData: setProfileData, post: updateProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        firstname: auth.user?.firstname || '',
        middlename: auth.user?.middlename || '',
        lastname: auth.user?.lastname || '',
        email: auth.user?.email || '',
        contactno: auth.user?.contactno || '',
    });

    // Password form
    const { data: passwordData, setData: setPasswordData, post: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        
        updateProfile(route('doctor.settings.profile'), {
            onSuccess: () => {
                toast.success('Profile updated successfully!');
                // Reload auth data using Inertia
                router.reload({ only: ['auth'] });
            },
            onError: () => {
                toast.error('Failed to update profile.');
            }
        });
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        updatePassword(route('doctor.settings.password'), {
            onSuccess: () => {
                toast.success('Password updated successfully!');
                resetPassword();
            },
            onError: () => {
                toast.error('Failed to update password. Please check your current password.');
            }
        });
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
        { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4" /> },
    ];

    return (
        <AdminLayout header="Doctor Settings">
            <Head title="Doctor Settings" />

            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4"
                >
                    <div className="p-3 rounded-xl bg-blue-100">
                        <Settings className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600">Manage your account settings and preferences</p>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Profile Settings */}
                {activeTab === 'profile' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstname">First Name</Label>
                                            <Input
                                                id="firstname"
                                                value={profileData.firstname}
                                                onChange={(e) => setProfileData('firstname', e.target.value)}
                                                className={profileErrors.firstname ? 'border-red-500' : ''}
                                            />
                                            {profileErrors.firstname && (
                                                <p className="text-sm text-red-500">{profileErrors.firstname}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="middlename">Middle Name</Label>
                                            <Input
                                                id="middlename"
                                                value={profileData.middlename}
                                                onChange={(e) => setProfileData('middlename', e.target.value)}
                                                className={profileErrors.middlename ? 'border-red-500' : ''}
                                            />
                                            {profileErrors.middlename && (
                                                <p className="text-sm text-red-500">{profileErrors.middlename}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastname">Last Name</Label>
                                            <Input
                                                id="lastname"
                                                value={profileData.lastname}
                                                onChange={(e) => setProfileData('lastname', e.target.value)}
                                                className={profileErrors.lastname ? 'border-red-500' : ''}
                                            />
                                            {profileErrors.lastname && (
                                                <p className="text-sm text-red-500">{profileErrors.lastname}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData('email', e.target.value)}
                                                className={profileErrors.email ? 'border-red-500' : ''}
                                            />
                                            {profileErrors.email && (
                                                <p className="text-sm text-red-500">{profileErrors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contactno">Contact Number</Label>
                                            <Input
                                                id="contactno"
                                                value={profileData.contactno}
                                                onChange={(e) => setProfileData('contactno', e.target.value)}
                                                className={profileErrors.contactno ? 'border-red-500' : ''}
                                            />
                                            {profileErrors.contactno && (
                                                <p className="text-sm text-red-500">{profileErrors.contactno}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={profileProcessing} className="bg-blue-600 hover:bg-blue-700">
                                            {profileProcessing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <User className="h-4 w-4 mr-2" />
                                                    Update Profile
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Security Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current_password">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="current_password"
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                    className={passwordErrors.current_password ? 'border-red-500' : ''}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {passwordErrors.current_password && (
                                                <p className="text-sm text-red-500">{passwordErrors.current_password}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={passwordData.password}
                                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                                    className={passwordErrors.password ? 'border-red-500' : ''}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {passwordErrors.password && (
                                                <p className="text-sm text-red-500">{passwordErrors.password}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={passwordData.password_confirmation}
                                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                    className={passwordErrors.password_confirmation ? 'border-red-500' : ''}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {passwordErrors.password_confirmation && (
                                                <p className="text-sm text-red-500">{passwordErrors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={passwordProcessing} className="bg-blue-600 hover:bg-blue-700">
                                            {passwordProcessing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    Update Password
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

            </div>
        </AdminLayout>
    );
}