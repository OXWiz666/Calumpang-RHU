import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useAppointmentSession } from "../../../../hooks/useAppointmentSession";
import { Calendar, FileText, Clock, ArrowRight, Users, Check, Star } from "lucide-react";

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
    
    console.log('ServicesSection component rendered');
    console.log('isInAppointmentSession:', isInAppointmentSession);
    console.log('loadingStates:', loadingStates);

    // Button handler functions
    const handleViewSchedule = () => {
        // Navigate to seasonal programs/vaccination schedule
        console.log('Navigating to vaccination registration...');
        window.location.href = '/services/vaccinations/registration';
    };


    const handleServiceClick = async (serviceIndex: number, action: string, event?: React.MouseEvent) => {
        console.log(`Service ${serviceIndex + 1} - ${action} clicked`);
        console.log('Event:', event);
        console.log('Loading states:', loadingStates);
        
        // Set loading state
        setLoadingStates(prev => ({ ...prev, [serviceIndex]: true }));
        
        try {
            // Add analytics tracking or other functionality here
            switch (serviceIndex) {
                case 0: // Online Appointment Booking
                    if (action === 'book') {
                        console.log('Booking appointment...');
                        if (event) {
                            const result = handleAppointmentClick(event);
                            console.log('Appointment click result:', result);
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
                        console.log('Viewing schedule...');
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
            color: "from-gray-100 to-gray-200",
            bgColor: "bg-white",
            iconColor: "text-gray-600",
            buttonColor: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
        },
        {
            icon: Clock,
            title: "Seasonal Health Programs",
            description: "Stay informed about our seasonal health programs, vaccination drives, and other community health initiatives.",
            features: ["Program Schedules", "Vaccination Tracking", "Health Alerts", "Community Updates"],
            color: "from-gray-100 to-gray-200",
            bgColor: "bg-white",
            iconColor: "text-gray-600",
            buttonColor: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-4">
                        <Star className="w-4 h-4 mr-2 text-gray-600" />
                        Trusted Digital Healthcare
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Services Grid - Centered for 2 services */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl">
                    {(services || serviceData).map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full ${
                                    hoveredCard === index ? 'ring-2 ring-gray-300 shadow-xl' : ''
                                }`}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Card Header */}
                                <div className="bg-gray-50 p-8 relative">
                                    <div className="relative z-10">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-200 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`w-8 h-8 ${service.iconColor}`} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="space-y-4 mb-8 flex-grow">
                                        <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                                        {service.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center space-x-3">
                                                <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                        
                                        {/* Statistics Bar */}
                                        <div className="mt-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Service Efficiency</span>
                                                <span className="text-sm text-gray-500">
                                                    {index === 0 ? '95%' : '92%'}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="h-2 rounded-full bg-gray-900 transition-all duration-1000 ease-out"
                                                    style={{ 
                                                        width: index === 0 ? '95%' : '92%' 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Yellow Accent Note */}
                                        {index === 0 && (
                                            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-800 font-medium">
                                                    Note: Available 24/7 for emergency appointments
                                                </p>
                                            </div>
                                        )}
                                        {index === 1 && (
                                            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-800 font-medium">
                                                    Note: Check our calendar for upcoming vaccination schedules
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <div className="pt-6 border-t border-gray-100 mt-auto">
                                        {index === 0 ? (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleServiceClick(index, 'book', e);
                                                }}
                                                disabled={isInAppointmentSession || loadingStates[index]}
                                                className={`w-full inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer relative z-10 ${
                                                    isInAppointmentSession || loadingStates[index]
                                                        ? 'text-gray-400 bg-gray-200 cursor-not-allowed opacity-50' 
                                                        : service.buttonColor + ' group-hover:scale-105 hover:shadow-lg'
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
                                                className={`w-full inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer relative z-10 ${
                                                    loadingStates[index] 
                                                        ? 'text-gray-400 bg-gray-200 cursor-not-allowed opacity-50' 
                                                        : service.buttonColor + ' group-hover:scale-105 hover:shadow-lg'
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

                                {/* Hover Effect Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>
                            </div>
                        );
                    })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ServicesSection;
