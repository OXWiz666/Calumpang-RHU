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
    return (
        <LandingLayout className=" p-5">
            <div className="container mx-auto mt-7 py-12 px-4 min-h-screen">
                {children}
            </div>
        </LandingLayout>
    );
};

export default Appointment;
