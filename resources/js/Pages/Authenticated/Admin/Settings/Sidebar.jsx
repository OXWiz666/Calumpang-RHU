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
    Layers,
    Layers2,
    SquareKanban,
    UserPen,
    Bell,
    UserCog,
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
                                    activeTab === "accinfo"
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                                size="lg"
                                onClick={(e) =>
                                    router.visit(route("admin.settings.index"))
                                }
                            >
                                <UserPen className="mr-2 h-5 w-5" />
                                Account Information
                            </Button>
                            <Button
                                variant={
                                    activeTab === "pwsettings"
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                                size="lg"
                                onClick={(e) =>
                                    router.visit(route("admin.settings.pw"))
                                }
                            >
                                <UserCog className="mr-2 h-5 w-5" />
                                Password Settings
                            </Button>
                            <Button
                                variant={
                                    activeTab === "notifsettings"
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                                size="lg"
                            >
                                <Bell className="mr-2 h-5 w-5" />
                                Notification Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
