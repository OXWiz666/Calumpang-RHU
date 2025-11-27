import React from "react";
import { useAppointmentSession } from "../../../../hooks/useAppointmentSession";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";

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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section className="w-full py-24 px-4 md:px-8 bg-white overflow-hidden" id="contact">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-800 rounded-full text-sm font-medium mb-6 border border-teal-100">
                        <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                        Visit Us
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Contact Us
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Get in touch with Calumpang Rural Health Unit General
                        Santos City
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Information */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        {/* Map */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-2xl overflow-hidden shadow-2xl h-80 md:h-[400px] border border-gray-100 transition-all duration-500 hover:shadow-3xl relative group"
                        >
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
                        </motion.div>

                        {/* Contact Details */}
                        <div className="space-y-6 pl-4">
                            <motion.div variants={itemVariants} className="flex items-start space-x-6 group">
                                <div className="bg-teal-50 p-4 rounded-2xl group-hover:bg-teal-100 transition-colors duration-300">
                                    <MapPin className="h-6 w-6 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        Our Location
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Calumpang, General Santos, Soccsksargen,
                                        Philippines
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-start space-x-6 group">
                                <div className="bg-emerald-50 p-4 rounded-2xl group-hover:bg-emerald-100 transition-colors duration-300">
                                    <Phone className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        Phone Number
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        (083) 554-0146
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-start space-x-6 group">
                                <div className="bg-indigo-50 p-4 rounded-2xl group-hover:bg-indigo-100 transition-colors duration-300">
                                    <Mail className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        Email Address
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        calumpangrhu@gmail.com
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Quick Contact Options */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100 relative overflow-hidden group"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-1000 ease-in-out"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-1000 ease-in-out"></div>

                        <h3 className="text-3xl font-bold text-gray-900 mb-6 relative">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                                Get in Touch
                            </span>
                        </h3>

                        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                            Choose the most convenient way to reach us. We're here to help with your healthcare needs.
                        </p>

                        {/* Quick Contact Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            {/* Call Us */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-6 border border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-teal-100 p-3 rounded-xl mr-4 group-hover:bg-teal-600 transition-colors duration-300">
                                        <Phone className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Call Us</h4>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Direct Line</p>
                                    </div>
                                </div>
                                <a href="tel:+63835540146" className="text-teal-600 font-bold hover:text-teal-700 transition-colors text-lg">
                                    (083) 554-0146
                                </a>
                            </motion.div>

                            {/* Email Us */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-emerald-100 p-3 rounded-xl mr-4 group-hover:bg-emerald-600 transition-colors duration-300">
                                        <Mail className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email Us</h4>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Support</p>
                                    </div>
                                </div>
                                <a href="mailto:calumpangrhu@gmail.com" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors text-sm break-all">
                                    calumpangrhu@gmail.com
                                </a>
                            </motion.div>
                        </div>

                        {/* Service Hours */}
                        <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
                            <div className="flex items-center mb-6">
                                <div className="bg-gray-200 p-3 rounded-xl mr-4">
                                    <Clock className="w-6 h-6 text-gray-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Service Hours</h4>
                                    <p className="text-sm text-gray-600">When we're available to help</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="font-bold text-gray-800 mb-1">Monday - Friday</p>
                                    <p className="text-gray-600">8:00 AM - 5:00 PM</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 mb-1">Saturday</p>
                                    <p className="text-gray-600">8:00 AM - 12:00 PM</p>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start">
                                <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-0.5">
                                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                                </div>
                                <p className="text-sm text-yellow-800 font-medium">
                                    Sunday is closed. For emergencies, please call our hotline.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAppointmentClick}
                                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-bold"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Book Appointment</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.location.href = '/#services'}
                                className="bg-white text-gray-800 border-2 border-gray-200 px-6 py-4 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 font-bold"
                            >
                                <span>View Services</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
