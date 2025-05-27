import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
export default function HeroSection() {
    return (
        <section className="w-full h-[600px] bg-white relative overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://i.ibb.co/wFSCZYdV/471634916-609791331562667-4920390300131702624-n.jpg"
                    className="w-full h-full object-cover filter blur-sm"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
                <div className="max-w-lg">
                    <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-2 leading-tight text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-tight">
                        Welcome to Barangay <br />
                        Calumpang Rural Health Unit
                    </h1>
                    <p className="text-sm md:text-base mb-3 text-justify text-white leading-relaxed max-w-md font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        We provide accessible and quality healthcare services to
                        our community, making it easy for you to manage your
                        health needs with our digital healthcare system.
                    </p>
                    <Link
                        href="/appointments"
                        className="group inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 hover:scale-105 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg px-6 py-3 text-base relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center">
                            Schedule an Appointment
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
                            >
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </Link>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent z-10"></div>
        </section>
    );
}
