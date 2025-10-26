// import ApplicationLogo from "@/Components/ApplicationLogo";
// import Dropdown from "@/Components/Dropdown";
// import NavLink from "@/Components/NavLink";
// import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
// import { Link, usePage } from "@inertiajs/react";
// import { useState } from "react";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/tempo/admin/include/Sidebar";
import StatisticsOverview from "@/components/tempo/admin/include/StatisticsOverview";
import ModuleCards from "@/components/tempo/admin/include/ModuleCards";
import ActivityFeed from "@/components/tempo/admin/include/ActivityFeed";
import { Bell, User, Search } from "lucide-react";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import { usePage, router } from "@inertiajs/react";

import Sidebar2 from "@/components/tempo/doctor/include/Sidebar";

import NotificationDropdown from "@/components/tempo/admin/include/NotificationDropdown";
import { data } from "autoprefixer";
import PusherListener from "@/components/pusher";
import { Toaster } from "@/components/Toaster";

import { create } from "zustand";

import SidebarPhar from "@/components/tempo/pharmacist/include/Sidebar";

export const useSidebarState = create((set) => ({
    sidebarstate: false,

    setSidebarstate: (sidebarstate) => set({ sidebarstate }),
}));

export default function AdminLayout({ header, children, tools }) {
    const role = usePage().props.auth.role;
    const { auth } = usePage().props;
    const [datas, setDatas] = useState(auth);
    useEffect(() => {
        //setActivities(notifs);
        //console.log("auth:", auth);
        setDatas(auth);
    }, [auth]);
    // const [activePage, setActivePage] = useState("dashboard"); // Default: 'dashboard'

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash) {
            if (flash.toast) {
                window.show_toast(flash.title, flash.message, flash.icon);
            } else {
                alert_toast(flash.title, flash.message, flash.icon);
            }
        }
    }, [flash]);

    return (
        <div className="flex h-screen bg-background text-gray-900">
            <PusherListener
                channelName="notification"
                eventName="notification-event"
                onEvent={(data) => {
                    router.reload({
                        only: ["auth"],
                        preserveScroll: true,
                    });
                }}
            />
            {/* Sidebar */}
            {role.id == 7 ? (
                <Sidebar />
            ) : role.id == 6 ? (
                <SidebarPhar />
            ) : (
                <Sidebar2 />
            )}
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b p-4 flex justify-between items-center shadow-sm bg-white border-gray-200">
                    <div className="flex items-center gap-4">
                        {header && (
                            <h1 className="text-2xl font-bold text-gray-900">
                                {header}
                            </h1>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {tools}
                        
                        
                        <NotificationDropdown datas={datas} />

                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage
                                    src={usePage().props.auth.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usePage().props.auth.user?.firstname}`}
                                    alt={usePage().props.auth.user?.firstname}
                                />
                                <AvatarFallback>
                                    {usePage().props.auth.user?.firstname?.[0]}{usePage().props.auth.user?.lastname?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {usePage().props.auth.user?.firstname}{" "}
                                    {usePage().props.auth.user?.lastname}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {usePage().props.auth.role?.roletype}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6 bg-accent/20">
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
}
