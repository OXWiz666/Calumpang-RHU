import CustomModal from "@/components/CustomModal";
import InputLabel from "@/components/InputLabel";
import { Label } from "@/components/tempo/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/tempo/components/ui/popover";
import { Button } from "@/components/tempo/components/ui/button";
import { cn } from "@/components/tempo/lib/utils"; //
import { useEffect, useState } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/tempo/components/ui/calendar";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
// At the top with other imports
import { addDays } from "date-fns";
import { usePage, useForm } from "@inertiajs/react";
import CustomCalendar from "@/components/CustomCalendar";
import TextInput from "@/components/TextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { time } from "framer-motion";
import InputError from "@/components/InputError";
export default function Reschedule({
    isOpen,
    onClose = () => {},
    maxWidth = "2xl",
    datas,
}) {
    // useEffect(() => {
    //     if (primaryKey) {
    //         console.log("primary key: ", primaryKey);
    //     }
    // }, [primaryKey]);
    const {
        data: formData,
        setData: setFormData,
        post,
        processing,
        errors,
        clearErrors,
        reset,
        recentlySuccessful,
    } = useForm({
        date: new Date(),
        time: null,
    });
    const handleDateChange = (date) => {
        //setDate(date);
        setFormData((prev) => ({ ...prev, date }));
    };
    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        //console.log(value);
    };

    const timeSlots = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
    ];

    const submitResched = (e) => {
        e.preventDefault();
        //alert("asd");
        post(route("admin.resched", { appointment: datas["primaryKey"] }), {
            onSuccess: () => {
                alert_toast("Success", "Appointment Rescheduled!", "success");
            },
        });
        /// onClose();
    };
    return (
        <CustomModal isOpen={isOpen} onClose={onClose} maxWidth={maxWidth}>
            <Label>Reschedule Date: </Label>
            <form action="#" onSubmit={submitResched}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="">
                        <Label>New Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.date &&
                                            "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.date ? (
                                        format(formData.date, "PPP")
                                    ) : (
                                        <span>Select date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={formData.date}
                                    onSelect={handleDateChange}
                                    initialFocus
                                    disabled={(date) => {
                                        // Disable past dates and weekends
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const day = date.getDay();
                                        return date < today || day === 0; // 0 is Sunday
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.date} />
                    </div>
                    <div className="">
                        <InputLabel>New Time</InputLabel>
                        <Select
                            value={formData.time}
                            onValueChange={(value) =>
                                handleSelectChange("time", value)
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select time">
                                    {formData.time ? (
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4" />
                                            {formData.time}
                                        </div>
                                    ) : (
                                        "Select time"
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.time} />
                    </div>
                </div>
                <div className="grid grid-cols-1 mt-2">
                    <Label>Reason</Label>
                    <TextInput />
                </div>
                <div className=" pt-2">
                    <PrimaryButton className=" float-right">
                        Reschedule
                    </PrimaryButton>
                </div>
            </form>
        </CustomModal>
    );
}
