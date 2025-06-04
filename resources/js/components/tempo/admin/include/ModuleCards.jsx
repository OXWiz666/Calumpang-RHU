import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import {
    ArrowRightIcon,
    Users,
    Calendar,
    Activity,
    Package,
    MessageSquare,
    BarChart3,
} from "lucide-react";

import { Link } from "@inertiajs/react";
// interface ModuleCardProps {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   href: string;
// }

const ModuleCard = ({ title, description, icon, href = "#" }) => {
    return (
        <Card className="bg-white h-full flex flex-col hover:shadow-md transition-all duration-300 border-t-4 border-t-primary">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-accent">{icon}</div>
                </div>
                <CardTitle className="mt-4">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {/* Additional content can be added here if needed */}
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    className="w-full justify-between"
                    asChild
                >
                    <Link href={href}>
                        Access Module{" "}
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

// interface ModuleCardsProps {
//   modules?: Array<{
//     title: string;
//     description: string;
//     icon: React.ReactNode;
//     href: string;
//   }>;
// }

const ModuleCards = ({ modules }) => {
    const defaultModules = [
        {
            title: "Patient Records",
            description:
                "Manage patient profiles, medical histories, and health records",
            icon: <Users className="h-5 w-5 text-primary" />,
            href: "/auth/patients",
        },
        {
            title: "Appointments",
            description: "Schedule, view, and manage patient appointments",
            icon: <Calendar className="h-5 w-5 text-primary" />,
            href: "/auth/appointments",
        },
        {
            title: "Health Programs",
            description:
                "Create and monitor community health initiatives and campaigns",
            icon: <Activity className="h-5 w-5 text-primary" />,
            href: "/admin/programs",
        },
        {
            title: "Reports",
            description: "Generate and view comprehensive system data reports",
            icon: <BarChart3 className="h-5 w-5 text-primary" />,
            href: "/admin/reports",
        },
    ];

    const displayModules = modules || defaultModules;

    return (
        <div className="bg-background p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayModules.map((module, index) => (
                    <ModuleCard
                        key={index}
                        title={module.title}
                        description={module.description}
                        icon={module.icon}
                        href={module.href}
                    />
                ))}
            </div>
        </div>
    );
};

export default ModuleCards;
