import React, { useEffect, useState } from "react";
// import Header from "../landing/Header";
// import Footer from "../landing/Footer";
import AppointmentForm from "../partial/AppointmentForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/tempo/components/ui/alert";
import {
    CheckCircle2,
    Info,
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
import { Head, useForm, router, Link } from "@inertiajs/react";
import { Button } from "@/components/tempo/components/ui/button";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";

import AppointmentLayout from "../Appointments/AppointmentLayout";

import Sidebar from "./Sidebar";
import PrimaryButton from "@/components/PrimaryButton";
export default function Appointment({ services }) {
    //const [activeTab, setActiveTab] = useState(ActiveTAB);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { data, setData, errors, post, recentlySuccessful, processing } =
        useForm({
            firstname: "",
            middlename: "",
            lastname: "",
            email: "",
            phone: "",
            date: new Date(),
            timeid: null,
            time: null,
            service: "",
            servicename: "",
            subservice: "",
            subservicename: "",
            notes: "",
            gender: "",
            birth: "",
            priorityNumber: "",
        });
    async function handleSubmit(data) {
        // In a real application, you would send this data to your backend
        setData(data);
        //console.log("Appointment data submitted:", data);

        const isConfirmed = await alert_toast(
            "Confirmation",
            "Are you sure you want to confirm this appointment?",
            "warning", // Note: lowercase 'warning'
            true
        );
        if (isConfirmed) {
            post(route("patient.appoint.create"), {
                onSuccess: () => {
                    setIsSubmitted(true);
                },
                onFinish: () => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                },
            });
        }
    }

    return (
        <AppointmentLayout>
            {isSubmitted ? (
                <div className="space-y-6">
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <AlertTitle className="text-green-800 text-lg font-medium">
                            Appointment Request Received
                        </AlertTitle>
                        <AlertDescription className="text-green-700">
                            Thank you for scheduling an appointment with
                            Barangay Calumpang Health Center. We will review
                            your request and contact you shortly to confirm your
                            appointment.
                        </AlertDescription>
                    </Alert>

                    {data && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment Details</CardTitle>
                                <CardDescription>
                                    Please save this information for your
                                    reference
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Name
                                        </p>
                                        <p className="text-gray-900">
                                            {data.firstname} {data.lastname}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Service
                                        </p>
                                        <p className="text-gray-900">
                                            {data.servicename}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Date
                                        </p>
                                        <p className="text-gray-900">
                                            {data.date
                                                ? data.date.toLocaleDateString()
                                                : "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Time
                                        </p>
                                        <p className="text-gray-900">
                                            {data.time}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Email
                                        </p>
                                        <p className="text-gray-900">
                                            {data.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Phone
                                        </p>
                                        <p className="text-gray-900">
                                            {data.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Birth Date
                                        </p>
                                        <p className="text-gray-900">
                                            {data.birth}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Gender
                                        </p>
                                        <p className="text-gray-900">
                                            {data.gender}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Priority Number
                                        </p>
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-md text-center w-24 shadow-sm border border-blue-200">
                                                {data.priorityNumber || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {data.notes && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Additional Notes
                                        </p>
                                        <p className="text-gray-900">
                                            {data.notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <PrimaryButton className=" float-right">
                        <Link href="/appointments">Back</Link>
                    </PrimaryButton>
                </div>
            ) : (
                <div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Schedule an Appointment
                        </h1>
                        <p className="text-gray-600">
                            Book your visit to Barangay Calumpang Health Center.
                            Please fill out the form below with your information
                            and preferred appointment details.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* SideBar */}
                        <Sidebar activeTab="appointment" />
                        {/* Main Content */}

                        <div className="w-full md:w-3/4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-blue-500" />
                                        <CardTitle className="text-lg">
                                            Important Information
                                        </CardTitle>
                                    </div>
                                    <CardDescription>
                                        Please note the following before
                                        scheduling your appointment:
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                        <li>
                                            Appointments are available Monday to
                                            Saturday, 9:00 AM to 4:00 PM.
                                        </li>
                                        <li>
                                            Please arrive 15 minutes before your
                                            scheduled appointment time.
                                        </li>
                                        <li>
                                            Bring your valid ID and health
                                            records if available.
                                        </li>
                                        <li>
                                            Wear a face mask when visiting the
                                            health center.
                                        </li>
                                        <li>
                                            Appointment confirmation will be
                                            sent to your email or via SMS.
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <AppointmentForm
                                services={services}
                                formData={data}
                                setFormData={setData}
                                errors={errors}
                                processing={processing}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AppointmentLayout>
    );
}
