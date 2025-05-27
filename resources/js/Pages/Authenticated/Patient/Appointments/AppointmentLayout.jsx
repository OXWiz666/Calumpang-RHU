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
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/tempo/components/ui/button";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";

const Appointment = ({ children }) => {
    // const [activeTab, setActiveTab] = useState("records");
    // const [isSubmitted, setIsSubmitted] = useState(false);
    // const {data, setData,errors,post,recentlySuccessful,processing} =
    // useForm({
    //     firstname: "",
    //     middlename: "",
    //     lastname:"",
    //     email: "",
    //     phone: "",
    //     date: new Date(),
    //     time: "",
    //     service: "",
    //     servicename: "",
    //     notes: "",
    // });
    // const handleSubmit = (data) => {
    //     // In a real application, you would send this data to your backend
    //     setData(data);
    //         console.log("Appointment data submitted:", data);
    //     post(route('patient.appoint.create'),{
    //             onSuccess: () => {
    //                 setIsSubmitted(true);
    //             },
    //             onFinish: () => {
    //                 window.scrollTo({ top: 0, behavior: "smooth" });
    //             }
    //         })
    // };
    // const App___ = usePage().props.appointments;
    // useEffect(() => {
    //     console.log(App___);
    // }, [App___]);
    return (
        <LandingLayout className=" p-5">
            <div className="container mx-auto mt-7 py-12 px-4 min-h-screen">
                {children}
            </div>
        </LandingLayout>
    );
};

export default Appointment;
