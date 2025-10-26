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
    BarChart3,
    Settings,
    Database,
    UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
// interface ModuleCardProps {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   href: string;
// }

const ModuleCard = ({ title, description, icon, href = "#", gradientFrom, gradientTo, iconBg, iconColor, stats }) => {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="h-full"
        >
            <Card className={`h-full flex flex-col border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                gradientFrom && gradientTo ? `bg-gradient-to-br ${gradientFrom} ${gradientTo}` : 'bg-white'
            }`}>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${iconBg || 'bg-blue-100'} ${iconColor || 'text-blue-600'}`}>
                            {icon}
                        </div>
                        {stats && (
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800">{stats.value}</div>
                                <div className="text-xs text-gray-600">{stats.label}</div>
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">{title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    {/* Additional content can be added here if needed */}
                </CardContent>
                <CardFooter className="pt-0">
                    <Button
                        variant="outline"
                        className="w-full justify-between group hover:bg-white/80 transition-all duration-300"
                        asChild
                    >
                        <Link href={href}>
                            Access Module
                            <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
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

const ModuleCards = ({ modules, dashboardData = {} }) => {
    const defaultModules = [
        {
            title: "Patient Records",
            description: "Manage patient profiles, medical histories, and comprehensive health records",
            icon: <Users className="h-6 w-6" />,
            href: "/auth/patients",
            gradientFrom: "from-blue-50",
            gradientTo: "to-blue-100",
            iconBg: "bg-blue-500",
            iconColor: "text-white",
            stats: { 
                value: dashboardData.patients?.total?.toLocaleString() || "0", 
                label: "Total Patients" 
            }
        },
        {
            title: "Appointments",
            description: "Schedule, view, and manage patient appointments with real-time updates",
            icon: <Calendar className="h-6 w-6" />,
            href: "/auth/appointments",
            gradientFrom: "from-green-50",
            gradientTo: "to-green-100",
            iconBg: "bg-green-500",
            iconColor: "text-white",
            stats: { 
                value: dashboardData.appointments?.today || "0", 
                label: "Today" 
            }
        },
        {
            title: "Health Programs",
            description: "Create and monitor community health initiatives and wellness campaigns",
            icon: <Activity className="h-6 w-6" />,
            href: "/admin/programs",
            gradientFrom: "from-purple-50",
            gradientTo: "to-purple-100",
            iconBg: "bg-purple-500",
            iconColor: "text-white",
            stats: { 
                value: dashboardData.programs?.active || "0", 
                label: "Active" 
            }
        },
        {
            title: "Reports & Analytics",
            description: "Generate comprehensive reports and view system analytics",
            icon: <BarChart3 className="h-6 w-6" />,
            href: "/admin/reports",
            gradientFrom: "from-orange-50",
            gradientTo: "to-orange-100",
            iconBg: "bg-orange-500",
            iconColor: "text-white",
            stats: { 
                value: dashboardData.prescriptions?.total || "0", 
                label: "Prescriptions" 
            }
        },
        {
            title: "Staff Management",
            description: "Manage staff profiles, roles, and system access permissions",
            icon: <UserCheck className="h-6 w-6" />,
            href: "/admin/staff/overview",
            gradientFrom: "from-indigo-50",
            gradientTo: "to-indigo-100",
            iconBg: "bg-indigo-500",
            iconColor: "text-white",
            stats: { 
                value: dashboardData.staff?.total || "0", 
                label: "Staff" 
            }
        },
    ];

    const displayModules = modules || defaultModules;

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Access Modules</h2>
                <p className="text-gray-600">Access all system modules and management tools</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayModules.map((module, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        <ModuleCard
                            title={module.title}
                            description={module.description}
                            icon={module.icon}
                            href={module.href}
                            gradientFrom={module.gradientFrom}
                            gradientTo={module.gradientTo}
                            iconBg={module.iconBg}
                            iconColor={module.iconColor}
                            stats={module.stats}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ModuleCards;
