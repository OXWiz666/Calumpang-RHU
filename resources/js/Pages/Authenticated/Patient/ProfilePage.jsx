import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card"; //@/components/tempo/components/ui/card
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/tempo/components/ui/tabs";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { usePage, useForm, router } from "@inertiajs/react";
import {
    User,
    Settings,
    Bell,
    Shield,
    LogOut,
    Calendar,
    FileText,
    Check,
    AlertCircle,
} from "lucide-react";

import LandingLayout from "@/Layouts/LandingLayout";
//import { useAuth } from "../../contexts/AuthContext";

const ProfilePage = ({ errors }) => {
    // Try to get user from auth context, otherwise use default
    //const { signOut } = useAuth();

    //     interface userx {
    //       firstname?: string;
    //       lastname?: string; // Optional if it exists
    //       email: string;
    //       // Add other properties your user object has
    //   }

    // Then in your component
    const { auth, recentAppointments } = usePage().props; // Get user and appointments from props
    const user__ = auth.user;

    // State for form data
    // const {data, setFormData} = userForm(
    //     defaultUser
    // );
    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [isSavingx, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Update form data when user changes
    useEffect(() => {
        //setData(defaultUser);
        //setFormData(defaultUser);
    }, [user__]);

    // Get real appointments from props or use empty array if not available
    const appointments = recentAppointments || [];

    const { data, setData, post, patch, processing, recentlySuccessful } =
        useForm({
            firstname: user__.firstname,
            middlename: user__.middlename,
            lastname: user__.lastname,
            suffix: user__.suffix,
            email: user__.email,
            avatar: user__.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
            phone: user__.contactno,
            address: user__.address,
            medicalInfo: "No known allergies. Last check-up: March 2023",
            birthdate: user__.birth,
            emergencyContact: user__.emercont?.[0]?.contactno,
            bloodtype: user__.bloodtype,
            allergies: "None",
            medications: "None",
            gender: user__.gender,
        });

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        // setFormData((prev) => ({
        //     ...prev,
        //     [id]: value,
        // }));

        setData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        post(route("patient.profile.update"), {
            onFinish: () => {
                onFinish();
            },
        });

        // Simulate API call
        // setTimeout(() => {
        //     setIsSaving(false);
        //     setSaveSuccess(true);
        //     setIsEditing(false);

        //     // Reset success message after 3 seconds
        //     setTimeout(() => {
        //         setSaveSuccess(false);
        //     }, 3000);
        // }, 1000);
    };
    const onFinish = () => {
        setIsSaving(false);
        setSaveSuccess(true);
        setIsEditing(false);
        setSaveSuccess(false);
    };

    // Handle tab change
    const handleTabChange = (value) => {
        setActiveTab(value);
        // Reset editing state when changing tabs
        setIsEditing(false);
    };

    // Handle avatar upload
    const handleAvatarUpload = () => {
        // Trigger file input click
        fileInputRef.current.click();
    };
    
    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            
            // Create FormData and submit
            const formData = new FormData();
            formData.append('avatar', file);
            
            // Use Inertia to submit the form
            router.post(route('patient.avatar.upload'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    // Clean up the preview URL
                    URL.revokeObjectURL(previewUrl);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                },
                onError: () => {
                    setSaveError(true);
                    setTimeout(() => setSaveError(false), 3000);
                    // Clean up the preview URL
                    URL.revokeObjectURL(previewUrl);
                    setAvatarPreview(null);
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 1:
                return (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Scheduled</span>
                    </div>
                );
            case 2:
                return (
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Completed</span>
                    </div>
                );
            case 3:
                return (
                    <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span>Cancelled</span>
                    </div>
                );
            case 4:
                return (
                    <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span>Declined</span>
                    </div>
                );
            case 5:
                return (
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Confirmed</span>
                    </div>
                );
            default:
                return (
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>Pending</span>
                    </div>
                );
        }
    };

    return (
        <LandingLayout className="p-5">
            <div className="container m-5 mx-auto py-12 px-4 min-h-screen">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4">
                        <Card className="bg-white sticky top-4">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col items-center">
                                    <div className="relative group">
                                        <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10">
                                            <AvatarImage
                                                src={avatarPreview || (user__.avatar ? `/storage/avatars/${user__.avatar}` : data.avatar)}
                                                alt={`${user__.firstname} ${user__.lastname}`}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                                {user__.firstname?.charAt(0)}{user__.lastname?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <button
                                            onClick={handleAvatarUpload}
                                            className="absolute bottom-4 right-0 bg-primary text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Upload avatar"
                                        >
                                            {/* Inline SVG for upload icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                <line x1="12" y1="3" x2="12" y2="15"></line>
                                            </svg>
                                        </button>
                                        {/* Hidden file input */}
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <CardTitle className="text-xl">
                                        {user__.firstname} {user__.lastname}
                                    </CardTitle>
                                    <CardDescription className="text-center">
                                        {user__.email}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1.5">
                                    <Button
                                        variant={
                                            activeTab === "personal"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                        size="lg"
                                        onClick={() =>
                                            handleTabChange("personal")
                                        }
                                    >
                                        <User className="mr-2 h-5 w-5" />
                                        Personal Information
                                    </Button>
                                    {/* <Button
                                        variant={
                                            activeTab === "medical"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                        size="lg"
                                        onClick={() =>
                                            handleTabChange("medical")
                                        }
                                    >
                                        <FileText className="mr-2 h-5 w-5" />
                                        Medical Information
                                    </Button> */}
                                    <Button
                                        variant={
                                            activeTab === "appointments"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                        size="lg"
                                        onClick={() =>
                                            handleTabChange("appointments")
                                        }
                                    >
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Appointment History
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        size="lg"
                                    >
                                        <Settings className="mr-2 h-5 w-5" />
                                        Account Settings
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        size="lg"
                                    >
                                        <Bell className="mr-2 h-5 w-5" />
                                        Notifications
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        size="lg"
                                    >
                                        <Shield className="mr-2 h-5 w-5" />
                                        Privacy & Security
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="mr-2 h-5 w-5" />
                                    Sign Out
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4">
                        <Card className="bg-white">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Profile Settings</CardTitle>
                                        <CardDescription>
                                            Manage your personal information and
                                            account settings
                                        </CardDescription>
                                    </div>
                                    {activeTab !== "appointments" && (
                                        <Button
                                            variant={
                                                isEditing
                                                    ? "outline"
                                                    : "default"
                                            }
                                            onClick={() =>
                                                setIsEditing(!isEditing)
                                            }
                                        >
                                            {isEditing
                                                ? "Cancel"
                                                : "Edit Profile"}
                                        </Button>
                                    )}
                                </div>
                                {recentlySuccessful && (
                                    <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md flex items-center">
                                        <Check className="h-5 w-5 mr-2" />
                                        Profile updated successfully!
                                    </div>
                                )}
                                {saveError && (
                                    <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2" />
                                        Failed to update profile. Please try
                                        again.
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <Tabs
                                    value={activeTab}
                                    onValueChange={handleTabChange}
                                >
                                    <div className="row"></div>
                                    <TabsList className="mb-4 grid grid-cols-3 gap-1">
                                        <TabsTrigger
                                            value="personal"
                                            className="text-xs sm:text-sm "
                                        >
                                            Personal Information
                                        </TabsTrigger>
                                        {/* <TabsTrigger
                                            value="medical"
                                            className="text-xs sm:text-sm "
                                        >
                                            Medical Information
                                        </TabsTrigger> */}
                                        <TabsTrigger
                                            value="appointments"
                                            className="text-xs sm:text-sm "
                                        >
                                            Appointment History
                                        </TabsTrigger>
                                    </TabsList>
                                    {/* Display validation errors */}
                                    {Object.keys(errors).length > 0 && (
                                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
                                                    <ul className="text-sm text-red-600">
                                                        {Object.entries(
                                                            errors
                                                        ).map(
                                                            ([key, error]) => (
                                                                <li key={key}>
                                                                    {error}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <TabsContent
                                        value="personal"
                                        className="space-y-4"
                                    >
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">
                                                        First Name
                                                    </Label>
                                                    <Input
                                                        id="firstname"
                                                        value={data.firstname}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="middlename">
                                                        Middle Name
                                                    </Label>
                                                    <Input
                                                        id="middlename"
                                                        value={data.middlename}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastname">
                                                        Last Name
                                                    </Label>
                                                    <Input
                                                        id="lastname"
                                                        value={data.lastname}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 mt-2 md:grid-cols-3 gap-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="suffix">
                                                            Suffix
                                                        </Label>
                                                        <Input
                                                            id="suffix"
                                                            type="text"
                                                            value={data.suffix}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            disabled={
                                                                !isEditing
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="bloodtype">
                                                            Blood Type
                                                        </Label>
                                                        <Input
                                                            id="bloodtype"
                                                            type="text"
                                                            value={
                                                                data.bloodtype
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            disabled={
                                                                !isEditing
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">
                                                        Phone Number
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        value={data.phone}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        required
                                                    />
                                                </div>
                                                <div className=" space-y-2">
                                                    <Label htmlFor="birthdate">
                                                        Date of Birth
                                                    </Label>
                                                    <Input
                                                        id="birthdate"
                                                        type="date"
                                                        value={data.birthdate}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className=" space-y-2">
                                                        <Label htmlFor="birthdate">
                                                            Gender
                                                        </Label>
                                                        <Input
                                                            id="gender"
                                                            type="text"
                                                            value={data.gender}
                                                            disabled={
                                                                !isEditing
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                <Label htmlFor="address">
                                                    Address
                                                </Label>
                                                <Textarea
                                                    id="address"
                                                    value={data.address}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            {isEditing && (
                                                <Button
                                                    type="submit"
                                                    className="mt-4"
                                                    disabled={processing}
                                                >
                                                    {processing
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </Button>
                                            )}
                                        </form>
                                    </TabsContent>

                                    <TabsContent
                                        value="appointments"
                                        className="space-y-4"
                                    >
                                        {appointments.length > 0 ? (
                                            <div className="rounded-md border">
                                                <div className="p-4 bg-muted/50 flex justify-between items-center">
                                                    <h3 className="font-medium">
                                                        Recent Appointments
                                                    </h3>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="px-3 py-1 text-sm shadow-sm flex items-center justify-center"
                                                        onClick={() => window.location.href = "/patient/appointments/history"}
                                                    >
                                                        <span>View All</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                                            <polyline points="9 18 15 12 9 6"></polyline>
                                                        </svg>
                                                    </Button>
                                                </div>
                                                <div className="divide-y">
                                                    {appointments.map(
                                                        (appointment) => (
                                                            <div
                                                                key={
                                                                    appointment.id
                                                                }
                                                                className="p-4 hover:bg-muted/20 transition-colors"
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <h4 className="font-medium flex items-center">
                                                                            {appointment.purpose}
                                                                            <span className="text-xs text-muted-foreground ml-2">
                                                                                #{appointment.id}
                                                                            </span>
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {appointment.doctor}
                                                                        </p>
                                                                    </div>
                                                                    {getStatusBadge(appointment.status_code)}
                                                                </div>
                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                                                    </svg>
                                                                    <span>
                                                                        {appointment.date}{" "}
                                                                        at{" "}
                                                                        {appointment.time}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-8 border rounded-md bg-muted/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                <h3 className="font-medium mb-1">
                                                    No Appointments Yet
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    You haven't scheduled any
                                                    appointments yet.
                                                </p>
                                                <Button
                                                    onClick={() => window.location.href = "/appointments"}
                                                    className="px-4 py-1 text-sm shadow-md flex items-center justify-center"
                                                >
                                                    <span>Schedule an Appointment</span>
                                                </Button>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
};

export default ProfilePage;
