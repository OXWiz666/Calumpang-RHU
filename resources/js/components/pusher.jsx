import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

/**
 * Dynamic component for listening to Pusher private channels
 * @param {string} channelName - Base channel name (e.g., "notification")
 * @param {string} eventName - Event name to listen for (e.g., "NotificationEvent")
 * @param {function} onEvent - Callback when event is received
 * @param {array} dependencies - Additional useEffect dependencies
 */
export default function PusherListener({
    channelName = "notification",
    eventName = "notification-event",
    onEvent = (data) => {},
}) {
    const { auth } = usePage().props;
    useEffect(() => {
        if (!auth.user?.id) return;

        const channel = window.Echo.private(`${channelName}.${auth.user.id}`);

        // 'notifications' => optional($request->user())->unreadNotifications ?? [],
        //         'notifications_count' => optional($request->user())->unreadNotifications ? optional($request->user())->unreadNotifications->count() : 0,
        //         'all_notifications' => optional($request->user())->notifications ?? [],
        channel.listen(`.${eventName}`, onEvent);

        return () => {
            window.Echo.leave(`${channelName}.${auth.user.id}`);

            channel.stopListening(`.${eventName}`);
        };
    }, [auth.user?.id]);

    return null; // This component doesn't render anything
}
