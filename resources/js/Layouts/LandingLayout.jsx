import Header from "@/components/tempo/components/landing/Header";
import Footer from "@/components/tempo/components/landing/Footer";
import { usePage, router } from "@inertiajs/react";
import PusherListener from "@/components/pusher";
import { useEffect } from "react";
import { showToast } from "@/utils/toast.jsx";
import { Toaster } from "@/components/Toaster";
export default function LandingLayout({ children, className, footer = false }) {
    // const { user } = usePage().props.auth;

    // useEffect(() => {
    //     console.log("user::", user);
    // }, [user]);

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash) {
            showToast(flash.title, flash.message, flash.icon);
        }
    }, [flash]);
    return (
        <div className={className}>
            <PusherListener
                channelName="notification"
                eventName="notification-event"
                onEvent={(data) => {
                    // Call hook at component top level
                    //console.log("handle data: ", data);
                    //setActivities(auth.notifications);
                    router.reload({
                        only: ["auth"],
                        preserveScroll: true,
                    });
                }}
            />
            <Header isLoggedIn={usePage().props?.auth?.user} />
            {children}
            {/* <HeroSection/>
            <ServiceSection/>
            <BenefitSection/>
            <TestimonialsSection/>
            <ContactSection/>*/}
            {footer && <Footer />}
            <Toaster />
        </div>
    );
}
