import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/tempo/components/ui/button";
import { Badge } from "@/components/tempo/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";
import moment from "moment";

const NotificationDropdown = ({ className = "", datas }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [notifications, setNotifications] = useState(datas.notifications);

    // Count unread notifications
    let unreadCount = notifications.filter(
        (notification) => !notification.read_at
    ).length;

    useEffect(() => {
        setNotifications(datas.notifications);
        unreadCount = notifications.filter(
            (notification) => !notification.read_at
        ).length;
    }, [datas]);

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Mark all as read when opening
            const updatedNotifications = notifications.map((notification) => ({
                ...notification,
                read: true,
            }));
            setNotifications(updatedNotifications);
        }
    };

    // Get icon color based on notification type
    const getIconColor = (type) => {
        switch (type) {
            // case "inventory":
            //     return "text-amber-500 bg-amber-100";
            case "appointment_resched":
                return "text-blue-500 bg-blue-100";
            // case "new_patient":
            //     return "text-green-500 bg-green-100";
            // case "program":
            //     return "text-purple-500 bg-purple-100";
            default:
                return "text-gray-500 bg-gray-100";
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={toggleDropdown}
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                        {unreadCount}
                    </Badge>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50"
                    >
                        <div className="p-3 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-primary">
                                    Notifications
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                    {notifications.length} total
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-muted-foreground"
                            >
                                Mark all as read
                            </Button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {notifications
                                        .slice(0, 3) // max 3
                                        .map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-3 hover:bg-accent/50 transition-colors ${
                                                    !notification.read_at
                                                        ? "bg-accent/20"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div
                                                        className={`h-8 w-8 rounded-full flex items-center justify-center ${getIconColor(
                                                            notification.data
                                                                .type
                                                        )}`}
                                                    >
                                                        <Bell className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm font-medium">
                                                                {
                                                                    notification
                                                                        .data
                                                                        .title
                                                                }
                                                            </p>
                                                            <span className="text-xs text-muted-foreground">
                                                                {moment(
                                                                    notification.created_at
                                                                ).fromNow()}
                                                            </span>
                                                            <div className=" text-sm">
                                                                {notification.read_at ? (
                                                                    <div>
                                                                        Read
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        Unread
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {
                                                                notification
                                                                    .data
                                                                    .message
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted-foreground text-sm">
                                    No notifications
                                </div>
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-200 bg-accent/10">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-muted-foreground"
                            >
                                View all notifications
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
