import HeroSection from "@/components/tempo/components/landing/HeroSection";
import ServiceSection from "@/components/tempo/components/landing/ServicesSection";
import BenefitSection from "@/components/tempo/components/landing/BenefitsSection";
import StatisticsSection from "@/components/tempo/components/landing/StatisticsSection";
import ContactSection from "@/Pages/Landing/contacts";
import { usePage } from "@inertiajs/react";
import LandingLayout from "@/Layouts/LandingLayout";
import PusherListener from "@/components/pusher";

export default function Dashboard() {
    return (
        <LandingLayout footer={true}>
            <PusherListener />
            <HeroSection />
            <ServiceSection />
            <StatisticsSection />
            <BenefitSection />
            <ContactSection />
        </LandingLayout>
    );
}
