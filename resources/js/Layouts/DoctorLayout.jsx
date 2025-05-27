// import ApplicationLogo from "@/Components/ApplicationLogo";
// import Dropdown from "@/Components/Dropdown";
// import NavLink from "@/Components/NavLink";
// import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
// import { Link, usePage } from "@inertiajs/react";
// import { useState } from "react";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/tempo/doctor/include/Sidebar";
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
import { usePage } from "@inertiajs/react";

export default function AdminLayout({ header, children, tools }) {
    // const [activePage, setActivePage] = useState("dashboard"); // Default: 'dashboard'
    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <Sidebar
            // activePage={activePage}
            // setActivePage={setActivePage}
            />
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b bg-white p-4 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        {header && (
                            <h1 className="text-2xl font-bold">{header}</h1>
                        )}
                        <div className="relative max-w-md hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-8 w-[300px] bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {tools}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                        >
                            <Bell className="h-5 w-5" />
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                                3
                            </Badge>
                        </Button>

                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                                    alt="Admin"
                                />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium">
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

                <main className="p-6 bg-accent/20">{children}</main>
            </div>
        </div>
    );
}
