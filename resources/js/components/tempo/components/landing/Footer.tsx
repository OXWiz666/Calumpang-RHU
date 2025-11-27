import React from "react";
import { Button } from "../ui/button";
import {
    ChevronUp,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
    ArrowRight,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useAppointmentSession } from "../../../../hooks/useAppointmentSession";
import { motion } from "framer-motion";

interface FooterProps {
    logoSrc?: string;
    logoStyle?: {
        width: string;
        height: string;
        objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
    };
    socialLinks?: {
        platform: string;
        url: string;
    }[];
    contactInfo?: {
        address: string;
        phone: string;
        email: string;
    };
    quickLinks?: {
        title: string;
        url: string;
    }[];
}

const Footer = ({
    logoSrc = "https://iili.io/fqDOtbj.png",
    logoStyle = {
        width: "150px",
        height: "150px",
        objectFit: "contain",
    },
    socialLinks = [
        { platform: "Facebook", url: "https://facebook.com" },
        { platform: "Twitter", url: "https://twitter.com" },
        { platform: "Instagram", url: "https://instagram.com" },
    ],
    contactInfo = {
        address: "Calumpang, General Santos, Soccsksargen, Philippines",
        phone: "(083) 554-0146",
        email: "calumpangrhu@gmail.com",
    },
    quickLinks = [
        { title: "Home", url: "/" },
        { title: "Services", url: "/#services" },
        { title: "Appointments", url: "/appointments" },
        { title: "About Us", url: "/about" },
        { title: "Contact", url: "/#contact" },
        { title: "Terms of Service", url: "/terms" },
        { title: "FAQ", url: "/faq" },
    ],
}: FooterProps) => {
    const { isInAppointmentSession, handleAppointmentClick } = useAppointmentSession();
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4 md:px-8 lg:px-16 overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="container mx-auto relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between mb-12 gap-12"
                >
                    {/* Logo and description */}
                    <motion.div variants={itemVariants} className="md:w-1/3">
                        <motion.div
                            className="flex items-center mb-6 group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <motion.img
                                src={logoSrc}
                                alt="Barangay Calumpang Health Center"
                                style={{
                                    ...logoStyle,
                                    width: "50px",
                                    height: "50px",
                                }}
                                className="mr-3 filter drop-shadow-lg rounded-full"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            />
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                                Calumpang RHU
                            </h3>
                        </motion.div>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                            Providing quality healthcare services to the
                            residents of Barangay Calumpang through our
                            innovative digital health management system.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-lg"
                                    aria-label={link.platform}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {link.platform === "Facebook" && (
                                        <Facebook size={18} />
                                    )}
                                    {link.platform === "Twitter" && (
                                        <Twitter size={18} />
                                    )}
                                    {link.platform === "Instagram" && (
                                        <Instagram size={18} />
                                    )}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={itemVariants} className="md:w-1/3">
                        <h4 className="text-xl font-bold mb-6 text-teal-300">
                            Quick Links
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {quickLinks.map((link, index) => (
                                link.title === "Appointments" ? (
                                    <motion.button
                                        key={index}
                                        onClick={handleAppointmentClick}
                                        disabled={isInAppointmentSession}
                                        className={`text-left py-2 px-3 rounded-lg transition-all duration-300 flex items-center group ${isInAppointmentSession
                                            ? 'text-gray-500 cursor-not-allowed opacity-50'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800 hover:pl-5'
                                            }`}
                                        title={isInAppointmentSession ? 'You are already in an appointment session' : 'Schedule an appointment'}
                                        whileHover={!isInAppointmentSession ? { x: 5 } : {}}
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {isInAppointmentSession ? 'Appointments (Active)' : link.title}
                                    </motion.button>
                                ) : (
                                    <motion.a
                                        key={index}
                                        href={link.url}
                                        className="text-slate-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-lg hover:bg-slate-800 hover:pl-5 flex items-center group"
                                        whileHover={{ x: 5 }}
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.title}
                                    </motion.a>
                                )
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div variants={itemVariants} className="md:w-1/3">
                        <h4 className="text-xl font-bold mb-6 text-teal-300">
                            Contact Us
                        </h4>
                        <div className="space-y-4">
                            <motion.div
                                className="flex items-start group cursor-pointer p-3 rounded-lg hover:bg-slate-800 transition-all duration-300"
                                whileHover={{ x: 5 }}
                            >
                                <MapPin className="mr-3 h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300 group-hover:text-white transition-colors">
                                    {contactInfo.address}
                                </span>
                            </motion.div>
                            <motion.a
                                href={`tel:${contactInfo.phone}`}
                                className="flex items-center group p-3 rounded-lg hover:bg-slate-800 transition-all duration-300"
                                whileHover={{ x: 5 }}
                            >
                                <Phone className="mr-3 h-5 w-5 text-teal-400 flex-shrink-0" />
                                <span className="text-slate-300 group-hover:text-white transition-colors">
                                    {contactInfo.phone}
                                </span>
                            </motion.a>
                            <motion.a
                                href={`mailto:${contactInfo.email}`}
                                className="flex items-center group p-3 rounded-lg hover:bg-slate-800 transition-all duration-300"
                                whileHover={{ x: 5 }}
                            >
                                <Mail className="mr-3 h-5 w-5 text-teal-400 flex-shrink-0" />
                                <span className="text-slate-300 group-hover:text-white transition-colors">
                                    {contactInfo.email}
                                </span>
                            </motion.a>
                        </div>
                    </motion.div>
                </motion.div>

                <Separator className="bg-slate-700/50 my-8" />

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <p className="text-slate-400 text-sm flex items-center">
                        {new Date().getFullYear()} Barangay Calumpang Rural
                        Health Unit. All rights reserved.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-teal-600 border-teal-500 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/50 hover:shadow-xl hover:shadow-teal-900/70 transition-all duration-300"
                            onClick={scrollToTop}
                            aria-label="Back to top"
                        >
                            <ChevronUp className="h-5 w-5" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;