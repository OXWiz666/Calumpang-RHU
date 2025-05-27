import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/tempo/components/ui/tabs";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import {
    FileText,
    Download,
    Calendar,
    Pill,
    Activity,
    Clipboard,
    Search,
    Filter,
    ChevronRight,
    AlertCircle,
    Shield,
} from "lucide-react";
import LandingLayout from "@/Layouts/LandingLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";

//import { useAuth } from "../../contexts/AuthContext";

const MedicalRecordsPage = ({ userData }) => {
    //const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState("records");
    const [searchQuery, setSearchQuery] = useState("");

    // Default user data
    // const defaultUser = {
    // name: "Juan Dela Cruz",
    // email: "juan.delacruz@example.com",
    // avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
    // };

    // // Use auth user if available, otherwise use default
    // const userData = authUser
    // ? {
    // ...defaultUser,
    // name: authUser.user_metadata?.full_name || defaultUser.name,
    // email: authUser.email || defaultUser.email,
    // avatar: authUser.user_metadata?.avatar_url || defaultUser.avatar,
    // }
    // : defaultUser;

    // Sample medical records data
    const medicalRecords = [
        {
            id: "MR-2023-001",
            date: "2023-03-15",
            type: "Annual Check-up",
            doctor: "Dr. Maria Santos",
            notes: "Patient is in good health. Blood pressure normal at 120/80. Recommended regular exercise and balanced diet.",
            attachments: ["Blood Test Results", "Chest X-Ray"],
        },
        {
            id: "MR-2023-002",
            date: "2023-07-22",
            type: "Vaccination",
            doctor: "Dr. Jose Reyes",
            notes: "Administered flu vaccine. No adverse reactions observed during the 30-minute observation period.",
            attachments: ["Vaccination Certificate"],
        },
        {
            id: "MR-2022-015",
            date: "2022-11-10",
            type: "Consultation",
            doctor: "Dr. Elena Cruz",
            notes: "Patient complained of mild fever and cough. Prescribed antibiotics for 5 days. Follow-up if symptoms persist.",
            attachments: ["Prescription"],
        },
    ];

    // Sample prescriptions data
    const prescriptions = [
        {
            id: "RX-2023-042",
            date: "2023-07-22",
            doctor: "Dr. Jose Reyes",
            medications: [
                {
                    name: "Paracetamol",
                    dosage: "500mg",
                    frequency: "Every 6 hours as needed",
                    duration: "5 days",
                },
            ],
            status: "Filled",
        },
        {
            id: "RX-2022-156",
            date: "2022-11-10",
            doctor: "Dr. Elena Cruz",
            medications: [
                {
                    name: "Amoxicillin",
                    dosage: "500mg",
                    frequency: "Every 8 hours",
                    duration: "5 days",
                },
                {
                    name: "Loratadine",
                    dosage: "10mg",
                    frequency: "Once daily",
                    duration: "5 days",
                },
            ],
            status: "Expired",
        },
    ];

    // Sample lab results data
    const labResults = [
        {
            id: "LAB-2023-078",
            date: "2023-03-15",
            type: "Complete Blood Count",
            requestedBy: "Dr. Maria Santos",
            status: "Completed",
            results: "Normal",
        },
        {
            id: "LAB-2023-079",
            date: "2023-03-15",
            type: "Urinalysis",
            requestedBy: "Dr. Maria Santos",
            status: "Completed",
            results: "Normal",
        },
        {
            id: "LAB-2022-145",
            date: "2022-11-10",
            type: "Chest X-Ray",
            requestedBy: "Dr. Elena Cruz",
            status: "Completed",
            results: "No significant findings",
        },
    ];

    // Filter records based on search query
    const filteredRecords = medicalRecords.filter(
        (record) =>
            record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPrescriptions = prescriptions.filter(
        (prescription) =>
            prescription.doctor
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            prescription.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prescription.medications.some((med) =>
                med.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
    );

    const filteredLabResults = labResults.filter(
        (result) =>
            result.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.requestedBy
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            result.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const { auth } = usePage().props;
    return (
        <LandingLayout className=" p-5">
            <div className="container mx-auto mt-7 py-12 px-4 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
                    <p className="text-gray-600">
                        Access and manage your health records securely
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4">
                        <Card className="bg-white sticky top-4">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col items-center">
                                    <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10">
                                        <AvatarImage 
                                            src={userData?.avatar ? `/storage/avatars/${userData.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth?.user.firstname}`} 
                                            alt={`${auth?.user.firstname} ${auth?.user.lastname}`} 
                                        />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                            {auth?.user.firstname?.charAt(0)}{auth?.user.lastname?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <CardTitle className="text-xl">
                                        {auth?.user.firstname}{" "}
                                        {auth?.user.lastname}
                                    </CardTitle>
                                    <CardDescription className="text-center">
                                        {auth?.user.email}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1.5">
                                    <Button
                                        variant={
                                            activeTab === "records"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                        size="lg"
                                        onClick={() => setActiveTab("records")}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <line x1="10" y1="9" x2="8" y2="9"></line>
                                        </svg>
                                        Medical Records
                                    </Button>
                                    {/* <Button
                                        variant={
                                            activeTab === "prescriptions"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                        size="lg"
                                        onClick={() =>
                                            setActiveTab("prescriptions")
                                        }
                                    >
                                        <Pill className="mr-2 h-5 w-5" />
                                        Prescriptions
                                    </Button> */}

                                    <Button
                                        variant={
                                            activeTab === "immunizations"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                        size="lg"
                                        onClick={() =>
                                            setActiveTab("immunizations")
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                                        </svg>
                                        Immunization Records
                                    </Button>
                                    {/* <Button
                                        variant={
                                            activeTab === "vitals"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                        size="lg"
                                        onClick={() => setActiveTab("vitals")}
                                    >
                                        <Activity className="mr-2 h-5 w-5" />
                                        Vital Signs History
                                    </Button> */}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    className="w-full justify-center text-sm px-5 py-2 shadow-md"
                                    onClick={() =>
                                        (window.location.href = "/patient/profile")
                                    }
                                >
                                    View Profile
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4">
                        <Card className="bg-white">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <CardTitle>
                                            {activeTab === "records"
                                                ? "Medical Records"
                                                : activeTab === "lab"
                                                ? "Laboratory Results"
                                                    ? activeTab ===
                                                      "immunizations"
                                                    : "Immunization Records"
                                                : ""}
                                        </CardTitle>
                                        <CardDescription>
                                            {activeTab === "records"
                                                ? "View your complete medical history"
                                                : activeTab === "prescriptions"
                                                ? "Manage your medication prescriptions"
                                                : activeTab === "lab"
                                                ? "Access your laboratory test results"
                                                : activeTab === "immunizations"
                                                ? "Track your vaccination history"
                                                : "Monitor your health metrics over time"}
                                        </CardDescription>
                                    </div>
                                    <div className="flex w-full md:w-auto gap-2">
                                        <div className="relative flex-grow">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                type="search"
                                                placeholder="Search records..."
                                                className="pl-8"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs
                                    value={activeTab}
                                    onValueChange={setActiveTab}
                                >
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="records">
                                            Medical Records
                                        </TabsTrigger>
                                        {/* <TabsTrigger value="prescriptions">
                                            Prescriptions
                                        </TabsTrigger> */}
                                        <TabsTrigger value="immunizations">
                                            Immunizations
                                        </TabsTrigger>
                                        {/* <TabsTrigger value="vitals">
                                            Vital Signs
                                        </TabsTrigger> */}
                                    </TabsList>

                                    <TabsContent
                                        value="records"
                                        className="space-y-4"
                                    >
                                        {filteredRecords.length > 0 ? (
                                            <div className="rounded-md border">
                                                <div className="p-4 bg-muted/50 flex justify-between items-center">
                                                    <h3 className="font-medium">
                                                        Medical Records
                                                    </h3>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        Request Records
                                                    </Button>
                                                </div>
                                                <div className="divide-y">
                                                    {/* {filteredRecords.map(
                                                        (record) => (
                                                            <div
                                                                key={record.id}
                                                                className="p-4 hover:bg-muted/20 transition-colors"
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <h4 className="font-medium flex items-center">
                                                                            {
                                                                                record.type
                                                                            }
                                                                            <span className="text-xs text-muted-foreground ml-2">
                                                                                {
                                                                                    record.id
                                                                                }
                                                                            </span>
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {
                                                                                record.doctor
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <span className="text-sm text-muted-foreground mr-2">
                                                                            {
                                                                                record.date
                                                                            }
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0"
                                                                        >
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm mb-2">
                                                                    {
                                                                        record.notes
                                                                    }
                                                                </p>
                                                                {record
                                                                    .attachments
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        {record.attachments.map(
                                                                            (
                                                                                attachment,
                                                                                index
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center"
                                                                                >
                                                                                    <FileText className="h-3 w-3 mr-1" />
                                                                                    {
                                                                                        attachment
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    )} */}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-md border p-8 text-center">
                                                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                                    <FileText className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="font-medium mb-1">
                                                    No records found
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {searchQuery
                                                        ? `No records match "${searchQuery}"`
                                                        : "You don't have any medical records yet"}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Request Records
                                                </Button>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent
                                        value="prescriptions"
                                        className="space-y-4"
                                    >
                                        {filteredPrescriptions.length > 0 ? (
                                            <div className="rounded-md border">
                                                <div className="p-4 bg-muted/50 flex justify-between items-center">
                                                    <h3 className="font-medium">
                                                        Prescription History
                                                    </h3>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        Request Refill
                                                    </Button>
                                                </div>
                                                <div className="divide-y">
                                                    {filteredPrescriptions.map(
                                                        (prescription) => (
                                                            <div
                                                                key={
                                                                    prescription.id
                                                                }
                                                                className="p-4 hover:bg-muted/20 transition-colors"
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <h4 className="font-medium flex items-center">
                                                                            Prescription
                                                                            <span className="text-xs text-muted-foreground ml-2">
                                                                                {
                                                                                    prescription.id
                                                                                }
                                                                            </span>
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {
                                                                                prescription.doctor
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <span
                                                                            className={`text-xs px-2 py-1 rounded-full
                                                        ${
                                                            prescription.status ===
                                                            "Filled"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-amber-100 text-amber-800"
                                                        }`}
                                                                        >
                                                                            {
                                                                                prescription.status
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 mt-3">
                                                                    {prescription.medications.map(
                                                                        (
                                                                            med,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="bg-muted/30 p-2 rounded-md"
                                                                            >
                                                                                <div className="flex justify-between">
                                                                                    <span className="font-medium">
                                                                                        {
                                                                                            med.name
                                                                                        }
                                                                                    </span>
                                                                                    <span className="text-sm">
                                                                                        {
                                                                                            med.dosage
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                <div className="text-sm text-muted-foreground">
                                                                                    {
                                                                                        med.frequency
                                                                                    }

                                                                                    ,
                                                                                    for{" "}
                                                                                    {
                                                                                        med.duration
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                                                    <Calendar className="h-4 w-4 mr-1" />
                                                                    <span>
                                                                        Prescribed
                                                                        on{" "}
                                                                        {
                                                                            prescription.date
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-md border p-8 text-center">
                                                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                                    <Pill className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="font-medium mb-1">
                                                    No prescriptions found
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {searchQuery
                                                        ? `No prescriptions match "${searchQuery}"`
                                                        : "You don't have any prescriptions yet"}
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent
                                        value="lab"
                                        className="space-y-4"
                                    >
                                        {filteredLabResults.length > 0 ? (
                                            <div className="rounded-md border">
                                                <div className="p-4 bg-muted/50 flex justify-between items-center">
                                                    <h3 className="font-medium">
                                                        Laboratory Test Results
                                                    </h3>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        Request Test
                                                    </Button>
                                                </div>
                                                <div className="divide-y">
                                                    {filteredLabResults.map(
                                                        (result) => (
                                                            <div
                                                                key={result.id}
                                                                className="p-4 hover:bg-muted/20 transition-colors"
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <h4 className="font-medium flex items-center">
                                                                            {
                                                                                result.type
                                                                            }
                                                                            <span className="text-xs text-muted-foreground ml-2">
                                                                                {
                                                                                    result.id
                                                                                }
                                                                            </span>
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Requested
                                                                            by:{" "}
                                                                            {
                                                                                result.requestedBy
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <span
                                                                            className={`text-xs px-2 py-1 rounded-full ${
                                                                                result.status ===
                                                                                "Completed"
                                                                                    ? "bg-green-100 text-green-800"
                                                                                    : "bg-blue-100 text-blue-800"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                result.status
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center mt-2">
                                                                    <div className="flex items-center text-sm">
                                                                        <span className="font-medium mr-2">
                                                                            Results:
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                result.results
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    >
                                                                        <Download className="h-4 w-4 mr-2" />
                                                                        Download
                                                                    </Button>
                                                                </div>
                                                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                                                    <Calendar className="h-4 w-4 mr-1" />
                                                                    <span>
                                                                        Test
                                                                        date:{" "}
                                                                        {
                                                                            result.date
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-md border p-8 text-center">
                                                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                                    <Clipboard className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="font-medium mb-1">
                                                    No lab results found
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {searchQuery
                                                        ? `No lab results match "${searchQuery}"`
                                                        : "You don't have any laboratory test results yet"}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Request Test
                                                </Button>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent
                                        value="immunizations"
                                        className="space-y-4"
                                    >
                                        <div className="rounded-md border p-8 text-center">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                                <Shield className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-medium mb-1">
                                                Immunization Records
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Your immunization records will
                                                appear here
                                            </p>
                                            <Button variant="outline" size="sm">
                                                Request Records
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="vitals"
                                        className="space-y-4"
                                    >
                                        <div className="rounded-md border p-8 text-center">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                                <Activity className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-medium mb-1">
                                                Vital Signs History
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Your vital signs history will
                                                appear here
                                            </p>
                                            <Button variant="outline" size="sm">
                                                Add Measurements
                                            </Button>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-6">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    For emergency services, please call the
                                    health center directly
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => router.visit("/contact")}
                                >
                                    Need Help?
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
};

export default MedicalRecordsPage;
