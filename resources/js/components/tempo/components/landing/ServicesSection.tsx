import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useAppointmentSession } from "../../../../hooks/useAppointmentSession";
import { Calendar, FileText, Clock, ArrowRight, Users, Check, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Service {
    icon: any; // ComponentType<IconProps>
    title: string;
    description: string;
    features: string[];
    color: string;
    bgColor: string;
    iconColor: string;
    buttonColor: string;
}

interface ServicesSectionProps {
    title?: string;
    subtitle?: string;
    services?: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
    title = "Our Digital Healthcare Services",
    subtitle = "Discover the comprehensive range of digital services available to Barangay Calumpang residents through our innovative health center management system.",
    services,
}) => {
    const { isInAppointmentSession, handleAppointmentClick } = useAppointmentSession();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});

    // Button handler functions
    const handleViewSchedule = () => {
        // Navigate to seasonal programs/vaccination schedule
        window.location.href = '/services/vaccinations/registration';
    };

    const handleServiceClick = async (serviceIndex: number, action: string, event?: React.MouseEvent) => {
        // Set loading state
        setLoadingStates(prev => ({ ...prev, [serviceIndex]: true }));

        try {
            switch (serviceIndex) {
                case 0: // Online Appointment Booking
                    if (action === 'book') {
                        if (event) {
                            const result = handleAppointmentClick(event);
                            if (!result) {
                                // If appointment click was prevented, clear loading state
                                setLoadingStates(prev => ({ ...prev, [serviceIndex]: false }));
                                return;
                            }
                        }
                    }
                    break;
                case 1: // Seasonal Health Programs
                    if (action === 'schedule') {
                        // Add a small delay for better UX
                        await new Promise(resolve => setTimeout(resolve, 500));
                        handleViewSchedule();
                    }
                    break;
                default:
                    console.log('Unknown service action');
            }
        } catch (error) {
            console.error('Error handling service click:', error);
        } finally {
            // Clear loading state
            setLoadingStates(prev => ({ ...prev, [serviceIndex]: false }));
        }
    };

    const serviceData = [
        {
            icon: Calendar,
            title: "Online Appointment Booking",
            description: "Schedule medical consultations, check-ups, and other health services online without the need to visit the health center in person.",
            features: ["24/7 Online Booking", "Real-time Availability", "Fast Confirmation", "SMS & Email Reminders"],
            color: "from-blue-50 to-indigo-50",
            bgColor: "bg-white",
            iconColor: "text-blue-600",
            buttonColor: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200"
        },
        {
            icon: Clock,
            title: "Seasonal Health Programs",
            description: "Stay informed about our seasonal health programs, vaccination drives, and other community health initiatives.",
            features: ["Program Schedules", "Vaccination Tracking", "Health Alerts", "Community Updates"],
            color: "from-teal-50 to-emerald-50",
            bgColor: "bg-white",
            iconColor: "text-teal-600",
            buttonColor: "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-teal-200"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-gray-50/50">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4 border border-teal-100">
                        <Star className="w-4 h-4 mr-2 text-teal-500" />
                        Trusted Digital Healthcare
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>

                {/* Services Grid - Centered for 2 services */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex justify-center"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl w-full">
                        {(services || serviceData).map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className={`group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full ${hoveredCard === index ? 'ring-2 ring-blue-100' : ''
                                        }`}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                >
                                    {/* Card Header */}
                                    <div className={`p-8 relative bg-gradient-to-br ${service.color}`}>
                                        <div className="relative z-10">
                                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className={`w-8 h-8 ${service.iconColor}`} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {service.title}
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed font-medium">
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Decorative background shape */}
                                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-8 flex flex-col flex-grow bg-white">
                                        <div className="space-y-4 mb-8 flex-grow">
                                            <h4 className="font-semibold text-gray-900 mb-3 uppercase text-xs tracking-wider text-gray-500">Key Features</h4>
                                            {service.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center space-x-3">
                                                    <div className={`p-1 rounded-full ${index === 0 ? 'bg-blue-100' : 'bg-teal-100'}`}>
                                                        <Check className={`w-3 h-3 ${index === 0 ? 'text-blue-600' : 'text-teal-600'}`} />
                                                    </div>
                                                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                                                </div>
                                            ))}

                                            {/* Statistics Bar */}
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Service Efficiency</span>
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {index === 0 ? '98%' : '95%'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: index === 0 ? '98%' : '95%' }}
                                                        transition={{ duration: 1.5, delay: 0.5 }}
                                                        className={`h-full rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-teal-500'}`}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="mt-auto">
                                            {index === 0 ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleServiceClick(index, 'book', e);
                                                    }}
                                                    disabled={isInAppointmentSession || loadingStates[index]}
                                                    className={`w-full inline-flex items-center justify-center px-8 py-4 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer relative z-10 ${isInAppointmentSession || loadingStates[index]
                                                        ? 'text-gray-400 bg-gray-200 cursor-not-allowed opacity-50'
                                                        : service.buttonColor
                                                        }`}
                                                    title={isInAppointmentSession ? 'You are already in an appointment session' : 'Book an appointment'}
                                                >
                                                    {loadingStates[index] ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isInAppointmentSession ? 'Book Now (Active)' : 'Book Now'}
                                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleServiceClick(index, 'schedule');
                                                    }}
                                                    disabled={loadingStates[index]}
                                                    className={`w-full inline-flex items-center justify-center px-8 py-4 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer relative z-10 ${loadingStates[index]
                                                        ? 'text-gray-400 bg-gray-200 cursor-not-allowed opacity-50'
                                                        : service.buttonColor
                                                        }`}
                                                    title="View seasonal health program schedules"
                                                >
                                                    {loadingStates[index] ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            View Schedule
                                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default ServicesSection;
