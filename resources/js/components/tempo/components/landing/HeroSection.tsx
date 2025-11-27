import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { ArrowRight, Users, Calendar, Shield, Heart } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useAppointmentSession } from "../../../../hooks/useAppointmentSession";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function HeroSection() {
    const { isInAppointmentSession, handleAppointmentClick } = useAppointmentSession();
    const [currentStat, setCurrentStat] = useState(0);
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const stats = [
        { number: "2,847", label: "Residents Served", icon: Users },
        { number: "1,200", label: "Monthly Consultations", icon: Calendar },
        { number: "100%", label: "Prenatal Coverage", icon: Shield },
        { number: "15+", label: "Years of Service", icon: Heart }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStat((prev) => (prev + 1) % stats.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [stats.length]);

    return (
        <section ref={containerRef} className="w-full h-[800px] bg-white relative overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <motion.div
                style={{ y: y1 }}
                className="absolute inset-0"
            >
                <img
                    src="https://iili.io/fqDCxse.md.jpg"
                    className="w-full h-full object-cover filter blur-sm scale-110"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80" />
            </motion.div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                />
                <motion.div
                    animate={{ y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-40 right-20 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center px-4 py-2 bg-teal-900/30 backdrop-blur-md rounded-full text-teal-200 text-sm font-medium border border-teal-800/50 shadow-lg"
                            >
                                <Heart className="w-4 h-4 mr-2 text-rose-400" />
                                Trusted Healthcare Provider
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg tracking-tight">
                                Welcome to Barangay{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-300">
                                    Calumpang
                                </span>{" "}
                                <br />
                                Rural Health Unit
                            </h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg font-medium drop-shadow-md"
                            >
                                We provide accessible and quality healthcare services to our community,
                                making it easy for you to manage your health needs with our innovative
                                digital healthcare system.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <motion.button
                                onClick={handleAppointmentClick}
                                disabled={isInAppointmentSession}
                                className={`group inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 focus-visible:outline-none shadow-xl rounded-xl px-8 py-4 text-lg relative overflow-hidden ${isInAppointmentSession
                                    ? 'opacity-50 cursor-not-allowed bg-gray-500'
                                    : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-teal-900/50'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center font-bold">
                                    {isInAppointmentSession ? 'Session Active' : 'Book Appointment'}
                                    {!isInAppointmentSession && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Right Content - Statistics */}
                    <motion.div
                        style={{ y: y2 }}
                        className="space-y-6 hidden lg:block"
                    >
                        <div className="text-right mb-8">
                            <motion.h3
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="text-3xl font-bold text-white mb-2"
                            >
                                Our Impact
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 }}
                                className="text-teal-200 text-lg"
                            >
                                Serving the community with excellence
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 + index * 0.1 }}
                                        className={`backdrop-blur-md rounded-2xl p-6 border transition-all duration-500 ${currentStat === index
                                            ? 'bg-slate-800/80 border-teal-500/50 shadow-2xl shadow-teal-900/20 scale-105 ring-1 ring-teal-400/30'
                                            : 'bg-slate-900/40 border-slate-700/50 hover:bg-slate-800/60'
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 mx-auto ${currentStat === index ? 'bg-teal-600 text-white' : 'bg-slate-800 text-teal-400'
                                            }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white mb-1">
                                                {stat.number}
                                            </div>
                                            <div className="text-sm text-slate-400 font-medium">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10"></div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            >
                <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-1">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
