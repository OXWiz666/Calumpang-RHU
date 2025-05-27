import Header from "@/components/tempo/components/landing/Header";
import Footer from "@/components/tempo/components/landing/Footer";
import { usePage, router } from "@inertiajs/react";
import PusherListener from "@/components/pusher";
export default function LandingLayout({ children, className, footer = false }) {
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
        </div>
    );
}
