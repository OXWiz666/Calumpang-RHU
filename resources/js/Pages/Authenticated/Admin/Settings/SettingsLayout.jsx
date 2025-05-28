import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import Sidebar from "./Sidebar";
import PrimaryButton from "@/components/PrimaryButton";
export default function SettingsLayout({
    children,
    description = "",
    activeTab = "accinfo",

    onsave = () => {},
    processing = false,

    header = "Account Information",
}) {
    return (
        <AdminLayout header="Settings">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className=" mb-5">
                    <h1 className="text-3xl font-bold mb-2">{header}</h1>
                    <p className="text-gray-600">
                        Here you can customize your settings on your own.
                    </p>
                    <p className="text-muted-foreground"></p>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <Sidebar activeTab={activeTab} />

                    <div className="w-full">
                        <Card>
                            <CardHeader>
                                <div className="">
                                    <div>
                                        <CardTitle>
                                            Account Information
                                        </CardTitle>
                                        <CardDescription>
                                            {description}
                                            {/* Manage your personal information and account
                                                    settings */}
                                        </CardDescription>
                                        <CardContent>{children}</CardContent>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter>
                                {onsave && (
                                    <PrimaryButton
                                        disabled={processing}
                                        onClick={onsave}
                                    >
                                        Save
                                    </PrimaryButton>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
