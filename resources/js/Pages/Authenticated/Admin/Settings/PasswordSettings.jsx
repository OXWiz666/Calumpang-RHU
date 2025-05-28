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
    const {
        data,
        setData,
        recentlySuccessful,
        processing,
        errors,
        post,
        reset,
    } = useForm({
        oldpw: "",
        newpw: "",
        confirmpw: "",
    });

    const textchange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const saveChanges = (e) => {
        e.preventDefault();
        post(route("admin.settings.pw.update"), {
            onSuccess: () => {
                reset();
            },
            onFinish: (res) => {
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
            description="These are your password information."
            activeTab="pwsettings"
            header="Password Settings"
        >
            <PrintErrors errors={errors} />
            <div className="grid grid-cols-2 gap-4 mt-5 w-1/2">
                <div>
                    <InputLabel value="Old Password" />
                    <Input
                        name="oldpw"
                        value={data.oldpw}
                        onChange={textchange}
                        className="w-full"
                        type="password"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5 w-full lg:w-1/2">
                <div>
                    <InputLabel value="New Password" />
                    <Input
                        name="newpw"
                        value={data.newpw}
                        onChange={textchange}
                        className="w-full"
                        type="password"
                    />
                </div>
                <div>
                    <InputLabel value="Confirm Password" />
                    <Input
                        name="confirmpw"
                        value={data.confirmpw}
                        onChange={textchange}
                        className="w-full"
                        type="password"
                    />
                </div>
            </div>
        </SettingsLayout>
    );
}
