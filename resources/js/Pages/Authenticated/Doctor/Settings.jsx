import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { Button } from '@/components/tempo/components/ui/button';
import { Input } from '@/components/tempo/components/ui/input';
import { Label } from '@/components/tempo/components/ui/label';
import { Textarea } from '@/components/tempo/components/ui/textarea';
import { Separator } from '@/components/tempo/components/ui/separator';
import { 
    Settings, 
    User, 
    Lock, 
    Bell, 
    Shield, 
    Save,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function DoctorSettings({ user }) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const { data: profileData, setData: setProfileData, post: updateProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        specialization: user?.specialization || '',
        bio: user?.bio || '',
    });

    // Password form
    const { data: passwordData, setData: setPasswordData, post: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Notification preferences
    const [notificationPrefs, setNotificationPrefs] = useState({
        email_notifications: true,
        sms_notifications: false,
        appointment_reminders: true,
        prescription_updates: true,
        system_alerts: true,
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        updateProfile(route('doctor.settings.profile'), {
            onSuccess: () => {
                toast.success('Profile updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update profile. Please try again.');
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

    const handleNotificationUpdate = () => {
        // This would typically make an API call to update notification preferences
        toast.success('Notification preferences updated!');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
        { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
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
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            <Label htmlFor="email">Email Address</Label>
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
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData('phone', e.target.value)}
                                                className={profileErrors.phone ? 'border-red-500' : ''}
                                            />
                                            {profileErrors.phone && (
                                                <p className="text-sm text-red-500">{profileErrors.phone}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="specialization">Specialization</Label>
                                            <Input
                                                id="specialization"
                                                value={profileData.specialization}
                                                onChange={(e) => setProfileData('specialization', e.target.value)}
                                                placeholder="e.g., Internal Medicine, Pediatrics, etc."
                                                className={profileErrors.specialization ? 'border-red-500' : ''}
                                            />
                                            {profileErrors.specialization && (
                                                <p className="text-sm text-red-500">{profileErrors.specialization}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData('bio', e.target.value)}
                                                placeholder="Tell us about yourself..."
                                                rows={4}
                                                className={profileErrors.bio ? 'border-red-500' : ''}
                                            />
                                            {profileErrors.bio && (
                                                <p className="text-sm text-red-500">{profileErrors.bio}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={profileProcessing} className="bg-blue-600 hover:bg-blue-700">
                                            {profileProcessing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
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

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notification Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Email Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive notifications via email</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationPrefs.email_notifications}
                                                    onChange={(e) => setNotificationPrefs(prev => ({
                                                        ...prev,
                                                        email_notifications: e.target.checked
                                                    }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">SMS Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationPrefs.sms_notifications}
                                                    onChange={(e) => setNotificationPrefs(prev => ({
                                                        ...prev,
                                                        sms_notifications: e.target.checked
                                                    }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Appointment Reminders</h3>
                                                <p className="text-sm text-gray-600">Get reminded about upcoming appointments</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationPrefs.appointment_reminders}
                                                    onChange={(e) => setNotificationPrefs(prev => ({
                                                        ...prev,
                                                        appointment_reminders: e.target.checked
                                                    }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Prescription Updates</h3>
                                                <p className="text-sm text-gray-600">Get notified about prescription status changes</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationPrefs.prescription_updates}
                                                    onChange={(e) => setNotificationPrefs(prev => ({
                                                        ...prev,
                                                        prescription_updates: e.target.checked
                                                    }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">System Alerts</h3>
                                                <p className="text-sm text-gray-600">Receive important system notifications</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationPrefs.system_alerts}
                                                    onChange={(e) => setNotificationPrefs(prev => ({
                                                        ...prev,
                                                        system_alerts: e.target.checked
                                                    }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end">
                                        <Button onClick={handleNotificationUpdate} className="bg-blue-600 hover:bg-blue-700">
                                            <Bell className="h-4 w-4 mr-2" />
                                            Save Preferences
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </AdminLayout>
    );
}
