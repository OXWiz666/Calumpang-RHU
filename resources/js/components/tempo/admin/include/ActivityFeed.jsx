import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Button } from "@/components/tempo/components/ui/button";
import { Separator } from "@/components/tempo/components/ui/separator";
import { ScrollArea } from "@/components/tempo/components/ui/scroll-area";
import {
    Check,
    Clock,
    FileText,
    MessageSquare,
    Package,
    User,
    AlertTriangle,
    Calendar,
} from "lucide-react";

// utils/formatTime.js
import moment from "moment";
import PrimaryButton from "@/components/PrimaryButton";
import Reschedule from "@/Pages/Authenticated/Admin/partials/Reschedule";
const getActivityIcon = () =>
    //   type: ActivityItem["type"],
    //   status?: ActivityItem["status"],
    {
        switch (type) {
            case "patient":
                return <User className="h-4 w-4 text-blue-500" />;
            case "appointment":
                return <Calendar className="h-4 w-4 text-purple-500" />;
            case "inventory":
                return <Package className="h-4 w-4 text-green-500" />;
            case "message":
                return <MessageSquare className="h-4 w-4 text-indigo-500" />;
            case "alert":
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case "program":
                return <FileText className="h-4 w-4 text-orange-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

const getStatusBadge = () => {
    if (!status) return null;

    switch (status) {
        case "success":
            return (
                <Badge variant="default" className="bg-green-500">
                    Completed
                </Badge>
            );
        case "pending":
            return (
                <Badge
                    variant="outline"
                    className="text-amber-500 border-amber-500"
                >
                    Pending
                </Badge>
            );
        case "warning":
            return (
                <Badge
                    variant="outline"
                    className="text-orange-500 border-orange-500"
                >
                    Warning
                </Badge>
            );
        case "error":
            return <Badge variant="destructive">Alert</Badge>;
        default:
            return null;
    }
};

const ActivityFeed = ({
    activities = [],
    title = "Recent Activities",
    maxItems = 10,
}) => {
    const displayActivities = activities; //activities.slice(0, maxItems);

    //const { links } = usePage().props; // Get pagination links

    useEffect(() => {
        if (displayActivities) {
            //console.log(displayActivities);
        }
    }, [displayActivities]);

    const [isOpen, setIsOpen] = useState(false);

    const [appointDatas, setAppointDatas] = useState({});
    //const [appointmentkey, setAppKey] = useState(null);
    const openModal = (data) => {
        setIsOpen(true);
        setAppointDatas(data);
    };

    // useEffect(() => {
    //     console.log("datas: ", appointDatas);
    // }, [appointDatas]);

    return (
        <Card className="w-full bg-white border-r-4 border-r-primary">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                        {displayActivities.length < 1 && <div>No Record</div>}
                        {displayActivities.map((activity, i) => (
                            <div key={i} className="relative">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                                        {/* {getActivityIcon(activity.type, activity.status)} */}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">
                                                {activity.data.title}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {/* {getStatusBadge(activity.status)} */}
                                                {activity.data.type ==
                                                    "new_appointment" && (
                                                    <PrimaryButton
                                                        onClick={() => {
                                                            //setIsOpen(true);
                                                            openModal({
                                                                primaryKey:
                                                                    activity
                                                                        .data
                                                                        .key,
                                                            });
                                                        }}
                                                    >
                                                        Reschedule
                                                    </PrimaryButton>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    {moment(
                                                        activity.created_at
                                                    ).format("h:mm A")}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {/* description here */}
                                            {activity.data.message}
                                        </p>

                                        {/* {activity.user && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    {activity.user.avatar ? (
                                                        <AvatarImage
                                                            src={
                                                                activity.user
                                                                    .avatar
                                                            }
                                                            alt={
                                                                activity.user
                                                                    .name
                                                            }
                                                        />
                                                    ) : (
                                                        <AvatarFallback className="text-xs">
                                                            {activity.user.name
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <span className="text-xs">
                                                    <span className="font-medium">
                                                        {activity.user.name}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {" "}
                                                        · {activity.user.role}
                                                    </span>
                                                </span>
                                            </div>
                                        )}

                                        {activity.actionLabel && (
                                            <div className="mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                >
                                                    {activity.actionLabel}
                                                </Button>
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                                <Separator className="my-4" />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <Reschedule
                maxWidth="lg"
                isOpen={isOpen}
                datas={appointDatas}
                onClose={() => setIsOpen(false)}
            />
        </Card>
    );
};

export default ActivityFeed;
