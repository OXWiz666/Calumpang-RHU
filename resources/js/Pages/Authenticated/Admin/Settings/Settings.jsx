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
import { useForm } from "@inertiajs/react";

// import "bootstrap/dist/css/bootstrap.min.css";
export default function Settings({}) {
    const { data, setData, recentlySuccessful, processing, errors, post } =
        useForm({
            firstname: "",
            middlename: "",
            lastname: "",
        });

    const textchange = (e) => {
        setData(e.target.name, e.target.value);
    };

    return (
        <SettingsLayout description="These are your account information.">
            <div className="grid grid-cols-3 gap-4 mt-5">
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
        </SettingsLayout>
    );
}
