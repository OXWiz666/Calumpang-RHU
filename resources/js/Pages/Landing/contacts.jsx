import LandingLayout from "@/Layouts/LandingLayout";
import { useAppointmentSession } from "@/hooks/useAppointmentSession";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Calendar, ArrowRight } from "lucide-react";

const ContactSection = () => {
    const { handleAppointmentClick } = useAppointmentSession();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <LandingLayout>
            <section
                className="w-full py-16 px-4 mt-6 md:px-8 bg-gradient-to-br from-gray-50 to-gray-100"
                id="contact"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-800 rounded-full text-sm font-medium mb-6 border border-teal-100"
                        >
                            <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                            Visit Us
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                            Contact Us
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Get in touch with Calumpang Rural Health Unit General Santos City
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            {/* Map */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="rounded-2xl overflow-hidden shadow-2xl h-64 md:h-[400px] border border-gray-200 transition-all duration-300 hover:shadow-3xl relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
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
                                />
                            </motion.div>

                            {/* Contact Details */}
                            <div className="space-y-6">
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white transition-all duration-300"
                                >
                                    <div className="bg-teal-50 p-3 rounded-2xl">
                                        <MapPin className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Our Location
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            Calumpang, General Santos, Soccsksargen, Philippines
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.a
                                    href="tel:+63835540146"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white transition-all duration-300 group"
                                >
                                    <div className="bg-emerald-50 p-3 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                                        <Phone className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Phone Number
                                        </h3>
                                        <p className="text-emerald-600 mt-1 font-medium">
                                            (083) 554-0146
                                        </p>
                                    </div>
                                </motion.a>

                                <motion.a
                                    href="mailto:calumpangrhu@gmail.com"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white transition-all duration-300 group"
                                >
                                    <div className="bg-cyan-50 p-3 rounded-2xl group-hover:bg-cyan-100 transition-colors">
                                        <Mail className="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Email Address
                                        </h3>
                                        <p className="text-cyan-600 mt-1 font-medium break-all">
                                            calumpangrhu@gmail.com
                                        </p>
                                    </div>
                                </motion.a>
                            </div>
                        </motion.div>

                        {/* Quick Contact Options */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden group"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"></div>
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-1000"></div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-6 relative">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                                    Get in Touch
                                </span>
                            </h3>

                            <p className="text-gray-600 mb-8 text-lg">
                                Choose the most convenient way to reach us. We're here to help with your healthcare needs.
                            </p>

                            {/* Quick Contact Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Call Us */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-2xl p-6 border border-teal-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="bg-teal-100 p-3 rounded-xl mr-4 group-hover:bg-teal-600 transition-colors">
                                            <Phone className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Call Us</h4>
                                            <p className="text-sm text-gray-600">Speak directly with our staff</p>
                                        </div>
                                    </div>
                                    <a href="tel:+63835540146" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
                                        (083) 554-0146
                                    </a>
                                </motion.div>

                                {/* Email Us */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="bg-emerald-100 p-3 rounded-xl mr-4 group-hover:bg-emerald-600 transition-colors">
                                            <Mail className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Email Us</h4>
                                            <p className="text-sm text-gray-600">Send us a message</p>
                                        </div>
                                    </div>
                                    <a href="mailto:calumpangrhu@gmail.com" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors text-sm break-all">
                                        calumpangrhu@gmail.com
                                    </a>
                                </motion.div>
                            </div>

                            {/* Service Hours */}
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gray-200 p-3 rounded-xl mr-4">
                                        <Clock className="w-6 h-6 text-gray-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Service Hours</h4>
                                        <p className="text-sm text-gray-600">When we're available to help</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-bold text-gray-800">Monday - Friday</p>
                                        <p className="text-gray-600">8:00 AM - 5:00 PM</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Saturday</p>
                                        <p className="text-gray-600">8:00 AM - 12:00 PM</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-medium">Note:</span> Sunday is closed. For emergencies, please call our hotline.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.button
                                    onClick={handleAppointmentClick}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-bold group"
                                >
                                    <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Book Appointment</span>
                                </motion.button>
                                <motion.button
                                    onClick={() => window.location.href = '/#services'}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white text-gray-800 border-2 border-gray-200 px-6 py-4 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 font-bold group"
                                >
                                    <span>View Services</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </LandingLayout>
    );
};

export default ContactSection;
