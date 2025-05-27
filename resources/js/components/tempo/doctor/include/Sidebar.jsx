import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import NavLink from "@/components/NavLink";
import {
    Users,
    Calendar,
    HeartPulse,
    Package,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    Stethoscope,
} from "lucide-react";
import { cn } from "@/components/tempo/lib/utils";
import { Button } from "@/components/tempo/components/ui/button";
import { router } from "@inertiajs/react";
// interface SidebarProps {
//   activePage?: string;
//   userRole?: "Admin" | "Doctor" | "Pharmacist";
// }

const Sidebar = ({ activePage, userRole = "Admin" }) => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            title: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            route: "doctor.home",
            path: "/doctor",
            id: "dashboard",
            roles: ["Admin", "Doctor", "Pharmacist"],
        },
        {
            title: "Appointments",
            icon: <Calendar className="h-5 w-5" />,
            route: "admin.appointments",
            path: "/auth/appointments",
            id: "appointments",
            roles: ["Admin", "Doctor"],
        },
        {
            title: "Patient Records",
            icon: <Users className="h-5 w-5" />,
            route: "admin.patients",
            path: "/auth/patients",
            id: "patients",
            roles: ["Admin", "Doctor"],
        },
        {
            title: "Settings",
            icon: <Settings className="h-5 w-5" />,
            path: "/settings",
            id: "settings",
            roles: ["Admin"],
        },
    ];

    const filteredMenuItems = menuItems.filter((item) =>
        item.roles.includes(userRole)
    );

    const user = usePage().props.auth.user;
    const role = usePage().props.auth.role;
    //const [activePage, setActivePage] = useState('dashboard');
    return (
        <div
            className={cn(
                "flex flex-col h-full bg-white border-r transition-all duration-300 shadow-sm",
                collapsed ? "w-20" : "w-64 md:w-72"
            )}
        >
            {/* Header with logo */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                    {!collapsed && (
                        <div className="flex flex-col">
                            <h1 className="font-bold text-lg text-primary">
                                RHU Calumpang
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Management System
                            </p>
                        </div>
                    )}
                    {collapsed && (
                        <div className="mx-auto">
                            <span className="font-bold text-xl text-primary">
                                RHU
                            </span>
                        </div>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? (
                        <Menu className="h-5 w-5" />
                    ) : (
                        <X className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Navigation menu */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {filteredMenuItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                href={item.path}
                                className={cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    route().current(item.route) && item.route
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                    collapsed && "justify-center px-0"
                                )}
                            >
                                {item.icon}
                                {!collapsed && (
                                    <span className="ml-3">{item.title}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User role indicator */}
            <div className="mt-auto border-t p-4">
                <div
                    className={cn(
                        "flex items-center",
                        collapsed && "justify-center"
                    )}
                >
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        {userRole[0]}
                    </div>
                    {!collapsed && (
                        <div className="ml-3">
                            <p className="text-sm font-medium">
                                {user.firstname} {user.lastname}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {role.roletype}
                            </p>
                        </div>
                    )}
                </div>

                {/* Logout button */}
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full mt-4 text-muted-foreground hover:text-foreground",
                        collapsed && "px-0"
                    )}
                    onClick={(e) => router.post("/logout")}
                >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span className="ml-2">Logout</span>}
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
