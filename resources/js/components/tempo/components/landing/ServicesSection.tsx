import React from "react";
import { Link, usePage } from "@inertiajs/react";
interface Service {
    icon: "calendar" | "file-text" | "clock";
    title: string;
    description: string;
    ctaText: string;
}

interface ServicesSectionProps {
    title: string;
    subtitle: string;
    services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
    title,
    subtitle,
    services,
}) => {
    const renderIcon = (icon: string) => {
        switch (icon) {
            case "calendar":
                return (
                    <svg
                        className="w-8 h-8 bg-gray-200 p-1 rounded-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                    </svg>
                );
            case "file-text":
                return (
                    <svg
                        className="w-8 h-8 bg-gray-200 p-1 rounded-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                    </svg>
                );
            case "clock":
                return (
                    <svg
                        className="w-8 h-8 bg-gray-200 p-1 rounded-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <section className="py-12 px-4 md:px-8 lg:px-16 bg-slate-50">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Our Digital Healthcare Services
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        Discover the range of digital services available to
                        Barangay Calumpang residents through our health center
                        management system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div
                        // key={index}
                        className="bg-white p-6 rounded-lg shadow-lg h-full border border-gray-300 flex flex-col"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                            <svg
                                className="w-8 h-8 bg-gray-200 p-1 rounded-full"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-5">
                            Online Appointment Booking
                        </h3>
                        <p className="text-gray-700 mb-4 leading-relaxed flex-grow">
                            Schedule medical consultations, check-ups, and other
                            health services online without the need to visit the
                            health center in person.
                        </p>
                        <div className="mt-auto">
                            <Link
                                href="/appointments"
                                className="inline-block px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>

                    <div
                        // key={index}
                        className="bg-white p-6 rounded-lg shadow-lg h-full border border-gray-300 flex flex-col"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                            <svg
                                className="w-8 h-8 bg-gray-200 p-1 rounded-full"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-5">
                            Medical Records Access
                        </h3>
                        <p className="text-gray-700 mb-4 leading-relaxed flex-grow">
                            Securely access your personal medical history, immunization record, and treatment plans through
                            our digital platform.
                        </p>
                        <div className="mt-auto">
                            <Link
                                href="/patient/medical-records"
                                className="inline-block px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors"
                            >
                                Access Records
                            </Link>
                        </div>
                    </div>

                    <div
                        // key={index}
                        className="bg-white p-6 rounded-lg shadow-lg h-full border border-gray-300 flex flex-col"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                            <svg
                                className="w-8 h-8 bg-gray-200 p-1 rounded-full"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-5">
                            Seasonal Health Programs Schedules
                        </h3>
                        <p className="text-gray-700 mb-4 leading-relaxed flex-grow">
                            Stay informed about our seasonal health programs,
                            vaccination drives, and other community health
                            initiatives.
                        </p>
                        <div className="mt-auto">
                            <a
                                href="#"
                                className="inline-block px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors"
                            >
                                View Schedule
                            </a>
                        </div>
                    </div>
                    {/* {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg h-full border border-gray-300 flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                {renderIcon(service.icon)}
              </div>
              <h3 className="text-xl font-bold mb-5">{service.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed flex-grow">{service.description}</p>
              <div className="mt-auto">
                <a
                  href="#"
                  className="inline-block px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors"
                >
                  {service.ctaText}
                </a>
              </div>
            </div>
          ))} */}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
