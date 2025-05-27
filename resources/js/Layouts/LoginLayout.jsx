import Swal from 'sweetalert2';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
export default function LoginLayout({ children }) {
    return (
        <div>
            <style jsx>{`
                /* Animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes floatAnimation {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes uniqueAnimation {
                    0% {
                        transform: scale(1) rotate(0deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1) rotate(10deg);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 1s ease-out;
                }
                .animate-slide-in {
                    animation: slideIn 0.8s ease-out;
                }
                .animate-float {
                    animation: floatAnimation 3s ease-in-out infinite;
                }
                .animate-unique {
                    animation: uniqueAnimation 1s ease-out;
                }
                .logo-glow {
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
                    transition: all 0.3s ease;
                }
                .logo-glow:hover {
                    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
                    transform: scale(1.05);
                }
                .bg-blur {
                    backdrop-filter: blur(8px);
                    transition: backdrop-filter 0.3s ease;
                }
                .bg-blur:hover {
                    backdrop-filter: blur(12px);
                }
                .text-shadow {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                }
            `}</style>

            <Head>
                <title>Login</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
                <div className="hidden md:flex md:w-1/2 bg-primary-900 relative animate-fade-in">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 to-black/85 bg-blur">
                        <div
                            className="absolute inset-0 opacity-40 transition-all duration-500 hover:opacity-50"
                            style={{
                                backgroundImage: "url('https://i.ibb.co/wFSCZYdV/471634916-609791331562667-4920390300131702624-n.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                filter: "blur(8px)"
                            }}
                        ></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white text-shadow">
                        <div className="text-center animate-slide-in">
                            <div className="relative group">
                                <img
                                    src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                                    alt="Barangay Calumpang Logo"
                                    className="w-32 h-32 mx-auto mb-8 logo-glow animate-float"
                                    style={{ 
                                        borderRadius: "50%",
                                        backgroundColor: "transparent",
                                        mixBlendMode: "multiply"
                                    }}
                                />
                                {/* Removed the white hover circle effect */}
                            </div>
                            <h1
                                className="text-4xl font-bold mb-4 animate-scale-in tracking-tight"
                                style={{ 
                                    animationDelay: "0.2s",
                                    fontFamily: "'Montserrat', sans-serif",
                                    letterSpacing: "-0.025em",
                                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
                                }}
                            >
                                Barangay Calumpang
                            </h1>
                            <h2
                                className="text-2xl font-semibold mb-6 animate-scale-in"
                                style={{ 
                                    animationDelay: "0.4s",
                                    fontFamily: "'Montserrat', sans-serif",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)"
                                }}
                            >
                                Rural Health Unit
                            </h2>
                            <p
                                className="text-lg max-w-md mx-auto text-gray-200 animate-scale-in leading-relaxed"
                                style={{ 
                                    animationDelay: "0.6s",
                                    fontFamily: "'Inter', sans-serif",
                                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
                                }}
                            >
                                Providing efficient healthcare services to our
                                community through digital transformation.
                            </p>
                        </div>

                        <div
                            className="mt-auto pt-12 animate-fade-in"
                            style={{ animationDelay: "0.8s" }}
                        >
                            <p className="text-sm opacity-80 font-light tracking-wide">
                                {new Date().getFullYear()} Barangay Calumpang Rural Health Unit. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-100 text-gray-900 animate-fade-in">
                    <div
                        className="w-full animate-scale-in"
                        style={{ animationDelay: "0.3s" }}
                    >
                        <main>{children}</main>
                    </div>
                </div>

                <div className="md:hidden text-center p-4 text-xs text-gray-400 bg-gray-800 animate-fade-in">
                    <p> {new Date().getFullYear()} Barangay Calumpang Rural Health Unit</p>
                    <p className="mt-1">All rights reserved</p>
                </div>
            </div>
        </div>
    );
}
