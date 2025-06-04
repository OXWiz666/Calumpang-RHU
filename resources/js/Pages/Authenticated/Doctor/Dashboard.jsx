import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
//import Sidebar from "@/components/tempo/admin/include/Sidebar";
import StatisticsOverview from "@/components/tempo/admin/include/StatisticsOverview";
import ModuleCards from "@/components/tempo/admin/include/ModuleCards";
import ActivityFeed from "@/components/tempo/admin/include/ActivityFeed";
import DoctorLayout from "@/Layouts/DoctorLayout";
import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Users, Calendar } from "lucide-react";
export default function Dashboard({}) {
    const notifs = usePage().props.auth.notifications;

    const [activities, setActivities] = useState(notifs);

    const { auth } = usePage().props;
    useEffect(() => {
        setActivities(notifs);
        //console.log(notifs);
    }, [auth]);
    return (
        <AdminLayout header="Doctor">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-primary">
                        Welcome to RHU Management System
                    </h2>
                    <p className="text-muted-foreground">
                        Barangay Calumpang, General Santos City
                    </p>
                </div>

                {/* Statistics Overview */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                        {/* Overview */}
                    </h3>
                    <StatisticsOverview />
                </section>

                {/* Module Cards - Filtered for Doctor */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                        {/* Quick Access */}
                    </h3>
                    <ModuleCards 
                        modules={[
                            {
                                title: "Patient Records",
                                description: "Manage patient profiles, medical histories, and health records",
                                icon: <Users className="h-5 w-5 text-primary" />,
                                href: "/auth/patients",
                            },
                            {
                                title: "Appointments",
                                description: "Schedule, view, and manage patient appointments",
                                icon: <Calendar className="h-5 w-5 text-primary" />,
                                href: "/auth/appointments",
                            }
                        ]}
                    />
                </section>

                {/* Activity Feed */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                        Recent Activities
                    </h3>
                    <ActivityFeed activities={activities} />
                </section>
            </motion.div>
        </AdminLayout>
    );
}
