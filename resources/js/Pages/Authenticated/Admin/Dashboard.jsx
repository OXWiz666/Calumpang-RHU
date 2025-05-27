import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
//import Sidebar from "@/components/tempo/admin/include/Sidebar";
import StatisticsOverview from "@/components/tempo/admin/include/StatisticsOverview";
import ModuleCards from "@/components/tempo/admin/include/ModuleCards";
import ActivityFeed from "@/components/tempo/admin/include/ActivityFeed";
import AdminLayout from "@/Layouts/AdminLayout";
import { usePage, router } from "@inertiajs/react";

// import { Bell, User, Search } from "lucide-react";
// import { Button } from "@/components/tempo/components/ui/button";
// import { Input } from "@/components/tempo/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/tempo/components/ui/avatar";
// import { Badge } from "@/components/tempo/components/ui/badge";

export default function Dashboard({ totalPatients, patientGrowthPercentage }) {
    const notifs = usePage().props.auth.notifications;

    const [activities, setActivities] = useState(notifs);

    const [patients, setPatients] = useState({
        total: totalPatients,
        growth: patientGrowthPercentage,
    });

    const { auth } = usePage().props;
    const [datas_, setDatas] = useState(auth);
    useEffect(() => {
        setActivities(notifs);
        //console.log(notifs);
    }, [auth]);

    return (
        <AdminLayout
            header="Dashboard"
            //datas={datas_}
        >
            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-primary">
                        Welcome to Calumpang Rural Health Unit Dashboard
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
                    <StatisticsOverview patients={patients} />
                </section>

                {/* Module Cards */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                        {/* Quick Access */}
                    </h3>
                    <ModuleCards />
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
