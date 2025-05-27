import Header from "./landing/Header";
import HeroSection from "./landing/HeroSection";
import ServicesSection from "./landing/ServicesSection";
import BenefitsSection from "./landing/BenefitsSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import ContactSection from "./landing/ContactSection";
import Footer from "./landing/Footer";

function Home() {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="pt-20">
        {" "}
        {/* Add padding top to account for fixed header */}
        <HeroSection />
        <ServicesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
