import React from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/tempo/components/ui/button";

const NotificationsIndex = ({ notifications = [], unread_count = 0 }) => {
    const { post, processing } = useForm({});
    const markAll = (e) => {
        e.preventDefault();
        post(route("notifications.markAllRead"));
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Notifications</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Unread: {unread_count}</span>
                    <form onSubmit={markAll}>
                        <Button type="submit" size="sm" variant="outline" disabled={processing}>
                            Mark all as read
                        </Button>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-md border">
                {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    <ul className="divide-y">
                        {notifications.map((n) => (
                            <li key={n.id} className={`p-4 ${!n.read_at ? "bg-accent/20" : ""}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm font-medium">{n.data?.title ?? "Notification"}</div>
                                        <div className="text-sm text-muted-foreground">{n.data?.message}</div>
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                        {new Date(n.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationsIndex;


