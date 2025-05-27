import Header from "@/components/tempo/components/landing/Header";
import HeroSection from "@/components/tempo/components/landing/HeroSection";
import ServiceSection from "@/components/tempo/components/landing/ServicesSection";
import BenefitSection from "@/components/tempo/components/landing/BenefitsSection";
import TestimonialsSection from "@/components/tempo/components/landing/TestimonialsSection";
import ContactSection from "@/components/tempo/components/landing/ContactSection";
import Footer from "@/components/tempo/components/landing/Footer";
import { usePage } from "@inertiajs/react";
import LandingLayout from "@/Layouts/LandingLayout";

import PusherListener from "@/components/pusher";
export default function Dashboard() {
    return (
        <LandingLayout footer={true}>
            <PusherListener />
            <HeroSection />
            <ServiceSection />
            <BenefitSection />
            <TestimonialsSection
                title="What Our Community Says"
                subtitle="Hear from residents who have experienced our digital healthcare services"
            />
            <ContactSection />
        </LandingLayout>
    );
}
