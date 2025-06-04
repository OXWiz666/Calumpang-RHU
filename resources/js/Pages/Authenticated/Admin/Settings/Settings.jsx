import SettingsLayout from "./SettingsLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import Sidebar from "./Sidebar";
import InputLabel from "@/components/InputLabel";
import { Input } from "@/components/tempo/components/ui/input";
import { router, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";

import PrintErrors from "@/components/PrintErrors";

// import "bootstrap/dist/css/bootstrap.min.css";
export default function Settings({}) {
    const { user } = usePage().props.auth;
    const { data, setData, recentlySuccessful, processing, errors, post } =
        useForm({
            firstname: user?.firstname,
            middlename: user?.middlename,
            lastname: user?.lastname,
            email: user?.email,
            contactno: user?.contactno,
        });

    const textchange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const saveChanges = (e) => {
        e.preventDefault();
        post(route("admin.settings.update"), {
            onFinish: () => {
                router.reload({
                    only: ["flash"],
                });
            },
            onError: (er) => {
                console.log("errror:", er);
            },
        });
    };

    return (
        <SettingsLayout
            onsave={saveChanges}
            processing={processing}
            description="These are your account information."
        >
            <PrintErrors errors={errors} />
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                <div>
                    <InputLabel value="First Name" />
                    <Input
                        name="firstname"
                        value={data.firstname}
                        onChange={textchange}
                        className="w-full"
                    />
                </div>
                <div>
                    <InputLabel value="Middle Name" />
                    <Input
                        value={data.middlename}
                        name="middlename"
                        onChange={textchange}
                        className="w-full"
                    />
                </div>
                <div>
                    <InputLabel value="Last Name" />
                    <Input
                        value={data.lastname}
                        name="lastname"
                        onChange={textchange}
                        className="w-full"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 gap-4 mt-5">
                <div>
                    <InputLabel value="Email" />
                    <Input
                        name="email"
                        value={data.email}
                        onChange={textchange}
                        className="w-full"
                    />
                </div>
                <div>
                    <InputLabel value="Contact #" />
                    <Input
                        value={data.contactno}
                        name="contactno"
                        onChange={textchange}
                        className="w-full"
                    />
                </div>
            </div>
        </SettingsLayout>
    );
}
