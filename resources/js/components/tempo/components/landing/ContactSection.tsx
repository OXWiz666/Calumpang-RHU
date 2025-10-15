import React from "react";
import { useAppointmentSession } from "../../../../hooks/useAppointmentSession";

interface ContactSectionProps {
    formErrors?: string[];
    formSuccess?: string;
    formError?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({
    formErrors = [],
    formSuccess = "",
    formError = "",
}) => {
    const { handleAppointmentClick } = useAppointmentSession();
    return (
        <section className="w-full py-16 px-4 md:px-8 bg-white" id="contact">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get in touch with Calumpang Rural Health Unit General
                        Santos City
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Map */}
                        <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-[400px] border border-gray-100 transition-all duration-300 hover:shadow-xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.6284443055966!2d125.16923!3d6.0967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f79ef7e2b25c07%3A0x745350b9a55d91ce!2sCalumpang%2C%20General%20Santos%20City%2C%20South%20Cotabato!5e0!3m2!1sen!2sph!4v1656123456789!5m2!1sen!2sph"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Barangay Calumpang General Santos City"
                                className="w-full h-full filter contrast-[1.02] group-hover:contrast-[1.05] transition-all duration-300"
                            ></iframe>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <svg
                                        className="h-6 w-6 text-primary"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Our Location
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        Calumpang, General Santos, Soccsksargen,
                                        Philippines
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <svg
                                        className="h-6 w-6 text-primary"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <path d="M22 6l-10 7L2 6"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Phone Number
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        (083) 554-0146
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <svg
                                        className="h-6 w-6 text-primary"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9l1.3 1.5a8.76 8.76 0 0 1 1.5 1.3V5.4z"></path>
                                        <path d="M12 21v-8m0 4-4-4 4-4 4 4-4 4z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Email Address
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        calumpangrhu@gmail.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contact Options */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100 relative overflow-hidden group">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500"></div>
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700"></div>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 relative">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
                                Get in Touch
                            </span>
                            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                        </h3>

                        <p className="text-gray-600 mb-8 text-lg">
                            Choose the most convenient way to reach us. We're here to help with your healthcare needs.
                        </p>

                        {/* Quick Contact Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Call Us */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-500 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Call Us</h4>
                                        <p className="text-sm text-gray-600">Speak directly with our staff</p>
                                    </div>
                                </div>
                                <a href="tel:+63835540146" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                    (083) 554-0146
                                </a>
                            </div>

                            {/* Email Us */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-500 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Email Us</h4>
                                        <p className="text-sm text-gray-600">Send us a detailed message</p>
                                    </div>
                                </div>
                                <a href="mailto:calumpangrhu@gmail.com" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                                    calumpangrhu@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Service Hours */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="bg-gray-600 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Service Hours</h4>
                                    <p className="text-sm text-gray-600">When we're available to help</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-700">Monday - Friday</p>
                                    <p className="text-gray-600">8:00 AM - 5:00 PM</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Saturday</p>
                                    <p className="text-gray-600">8:00 AM - 12:00 PM</p>
                                </div>
                            </div>
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <span className="font-medium">Note:</span> Sunday is closed. For emergencies, please call our hotline.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                onClick={handleAppointmentClick}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
                            >
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span className="font-medium">Book Appointment</span>
                            </button>
                            <button 
                                onClick={() => window.location.href = '/#services'}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
                            >
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span className="font-medium">View Services</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
