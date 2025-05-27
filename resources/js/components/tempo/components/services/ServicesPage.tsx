import React from "react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Calendar,
  Clock,
  FileText,
  Heart,
  Shield,
  Stethoscope,
  Users,
  Syringe,
} from "lucide-react";

const ServicesPage = () => {
  const primaryServices = [
    {
      title: "General Consultations",
      description:
        "Medical check-ups and consultations with our healthcare professionals for various health concerns.",
      icon: <Stethoscope className="h-10 w-10 text-primary" />,
      action: { label: "Book Consultation", href: "/appointments" },
    },
    {
      title: "Vaccination Services",
      description:
        "Routine immunizations for children and adults following the national immunization schedule.",
      icon: <Syringe className="h-10 w-10 text-primary" />,
      action: { label: "View Schedule", href: "/services/vaccinations" },
    },
    {
      title: "Maternal and Child Health",
      description:
        "Prenatal and postnatal care, well-baby check-ups, and growth monitoring for children.",
      icon: <Heart className="h-10 w-10 text-primary" />,
      action: { label: "Learn More", href: "/services/maternal-child" },
    },
    {
      title: "Medical Records Access",
      description:
        "Secure digital access to your personal and family health records through our online portal.",
      icon: <FileText className="h-10 w-10 text-primary" />,
      action: { label: "Access Records", href: "/services/records" },
    },
  ];

  const preventiveServices = [
    {
      title: "Health Education",
      description:
        "Regular workshops and information sessions on various health topics relevant to the community.",
      icon: <Users className="h-10 w-10 text-primary" />,
      action: { label: "View Schedule", href: "/services/education" },
    },
    {
      title: "Disease Prevention Programs",
      description:
        "Programs focused on preventing common diseases through early detection and lifestyle modifications.",
      icon: <Shield className="h-10 w-10 text-primary" />,
      action: { label: "Join Program", href: "/services/prevention" },
    },
    {
      title: "Regular Health Screenings",
      description:
        "Periodic health screenings for common conditions like hypertension, diabetes, and more.",
      icon: <Calendar className="h-10 w-10 text-primary" />,
      action: { label: "Schedule Screening", href: "/appointments" },
    },
    {
      title: "Community Outreach",
      description:
        "Health services and education brought directly to different areas within the barangay.",
      icon: <Clock className="h-10 w-10 text-primary" />,
      action: { label: "View Calendar", href: "/services/outreach" },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header auth={{}} isLoggedin={false} />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our Services
          </h1>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Barangay Calumpang Health Center offers a comprehensive range of
            healthcare services designed to meet the needs of our community.
            Explore our services below.
          </p>

          <Tabs defaultValue="primary" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="primary">Primary Healthcare</TabsTrigger>
              <TabsTrigger value="preventive">Preventive Services</TabsTrigger>
            </TabsList>

            <TabsContent value="primary" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {primaryServices.map((service, index) => (
                  <Card
                    key={index}
                    className="border-2 border-gray-100 hover:border-primary/20 transition-colors"
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      {service.icon}
                      <div>
                        <CardTitle>{service.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <a href={service.action.href}>{service.action.label}</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preventive" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {preventiveServices.map((service, index) => (
                  <Card
                    key={index}
                    className="border-2 border-gray-100 hover:border-primary/20 transition-colors"
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      {service.icon}
                      <div>
                        <CardTitle>{service.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <a href={service.action.href}>{service.action.label}</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="max-w-5xl mx-auto mt-16 bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Need a Service Not Listed?
            </h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              If you're looking for a specific healthcare service that's not
              listed here, please contact us. We may be able to provide the
              service or refer you to an appropriate healthcare facility.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <a href="/contact">Contact Us</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/appointments">Schedule Appointment</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
