import React, { useEffect, useState } from "react";
// import Header from "../landing/Header";
// import Footer from "../landing/Footer";
//import AppointmentForm from "../partial/AppointmentForm";
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
    FileText,
    Clipboard,
    Stethoscope,
    Shield,
    ShieldPlus,
    SquareKanban,
} from "lucide-react";
import LandingLayout from "@/Layouts/LandingLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/tempo/components/ui/button";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";

export default function Sidebar({ activeTab }) {
    const { user } = usePage().props.auth;

    //console.log("auth: ", user);

    return (
        <>
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
                <Card className="bg-white sticky top-4">
                    <CardHeader className="pb-4"></CardHeader>
                    <CardContent>
                        <div className="">
                            <Button
                                variant={
                                    activeTab === "overview"
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                                size="lg"
                                onClick={(e) =>
                                    router.visit(route("admin.staff.overview"))
                                }
                            >
                                <SquareKanban className="mr-2 h-5 w-5" />
                                Overview
                            </Button>
                            <Button
                                variant={
                                    activeTab === "admins"
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                                size="lg"
                                onClick={(e) => router.visit("/appointments")}
                            >
                                <Shield className="mr-2 h-5 w-5" />
                                Admins
                            </Button>

                            <Button
                                variant={
                                    activeTab === "doctors"
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                                size="lg"
                                onClick={(e) =>
                                    router.visit(route("admin.staff.doctors"))
                                }
                            >
                                <Stethoscope className="mr-2 h-5 w-5" />
                                {/* <Pill className="mr-2 h-5 w-5" /> */}
                                Doctors
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
