import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowRight, Users, Calendar, Shield, Heart } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useAppointmentSession } from "../../../../hooks/useAppointmentSession";

export default function HeroSection() {
    const { isInAppointmentSession, handleAppointmentClick } = useAppointmentSession();
    const [currentStat, setCurrentStat] = useState(0);
    
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
        <section className="w-full h-[700px] bg-white relative overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div className="absolute inset-0">
                <img
                    src="https://i.ibb.co/wFSCZYdV/471634916-609791331562667-4920390300131702624-n.jpg"
                    className="w-full h-full object-cover filter blur-sm transform scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/70" />
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-gray-500/20 rounded-full animate-bounce"></div>
                <div className="absolute bottom-40 left-20 w-12 h-12 bg-gray-400/20 rounded-full animate-pulse"></div>
                <div className="absolute top-60 right-40 w-8 h-8 bg-gray-600/20 rounded-full animate-bounce"></div>
            </div>

            <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
                                <Heart className="w-4 h-4 mr-2 text-gray-300" />
                                Trusted Healthcare Provider
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
                                Welcome to Barangay{" "}
                                <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                                    Calumpang
                                </span>{" "}
                                Rural Health Unit
                            </h1>
                            
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-lg font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                We provide accessible and quality healthcare services to our community, 
                                making it easy for you to manage your health needs with our innovative 
                                digital healthcare system.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAppointmentClick}
                                disabled={isInAppointmentSession}
                                className={`group inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 focus-visible:outline-none shadow-lg rounded-lg px-8 py-4 text-lg relative overflow-hidden ${
                                    isInAppointmentSession 
                                        ? 'opacity-50 cursor-not-allowed bg-gray-500' 
                                        : 'hover:scale-105 shadow-xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700'
                                }`}
                                title={isInAppointmentSession ? 'You are already in an appointment session' : 'Schedule an appointment'}
                            >
                                <span className="relative z-10 flex items-center text-white font-semibold">
                                    {isInAppointmentSession ? 'Schedule an Appointment (Active)' : 'Schedule an Appointment'}
                                    <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                                {!isInAppointmentSession && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Statistics */}
                    <div className="space-y-6">
                        <div className="text-center lg:text-right">
                            <h3 className="text-2xl font-bold text-white mb-2">Our Impact</h3>
                            <p className="text-white/80">Serving the community with excellence</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-500 ${
                                            currentStat === index 
                                                ? 'scale-105 bg-white/20 shadow-lg' 
                                                : 'hover:bg-white/15'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-3 mx-auto">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white mb-1">
                                                {stat.number}
                                            </div>
                                            <div className="text-sm text-white/80">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/20 to-transparent z-10"></div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
                </div>
            </div>
        </section>
    );
}
