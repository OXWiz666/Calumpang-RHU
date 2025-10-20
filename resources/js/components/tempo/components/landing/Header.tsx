import React, { useEffect, useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";

import importedCss from "./css/header.css";

// @ts-ignore
import NotficationDropdown from "../../patient/include/NotificationDropdown.jsx";
import PatientVerificationModal from "./PatientVerificationModal";
import TermsOfServiceModal from "./TermsOfServiceModal";
import PatientTypeSelectionModal from "./PatientTypeSelectionModal";
import { useAppointmentSession } from "../../../../hooks/useAppointmentSession";

const Header = ({
    auth,
    isLoggedin,
}: {
    auth: { user?: { firstname: string; lastname: string } };
    isLoggedin: boolean;
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPatientTypeModal, setShowPatientTypeModal] = useState(false);
    const [cameFromPatientTypeSelection, setCameFromPatientTypeSelection] = useState(false);
    const { isInAppointmentSession, handleAppointmentClick } = useAppointmentSession();
    
    // Check if we're in reschedule mode (from URL or localStorage)
    const [isRescheduleMode, setIsRescheduleMode] = useState(false);
    const [isExistingPatientMode, setIsExistingPatientMode] = useState(false);
    
    useEffect(() => {
        // Check URL parameters and localStorage for mode detection
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const existingPatientData = localStorage.getItem('existingPatientData');
        const patientType = localStorage.getItem('selectedPatientType');
        
        setIsRescheduleMode(mode === 'reschedule');
        setIsExistingPatientMode(!!existingPatientData && patientType === 'existing');
    }, []);
    
    // Determine if Seasonal Programs should be disabled
    const shouldDisableSeasonalPrograms = () => {
        // Disable in appointment session for ALL modes (Existing, New Patient, and Reschedule)
        return isInAppointmentSession;
    };

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const toggleServices = () => setServicesOpen(!servicesOpen);
    const toggleServicesDropdown = () =>
        setServicesDropdownOpen(!servicesDropdownOpen);
    const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

    // Handler for Terms of Service acceptance
    const handleTermsAccept = () => {
        setShowTermsModal(false);
        (window as any).isTermsModalOpen = false;
        // Open Patient Type Selection Modal after accepting terms
        setShowPatientTypeModal(true);
    };
    
    // Handler for closing Terms modal
    const handleTermsClose = () => {
        setShowTermsModal(false);
        (window as any).isTermsModalOpen = false;
    };

    // Handler for Patient Type Selection Modal
    const handlePatientTypeProceed = (patientType: string) => {
        setShowPatientTypeModal(false);
        // Store patient type in session or pass to verification modal
        localStorage.setItem('selectedPatientType', patientType);
        // Set flag to show back button
        setCameFromPatientTypeSelection(true);
        // Open Patient Verification Modal
        setShowPatientModal(true);
    };

    const handlePatientTypeClose = () => {
        setShowPatientTypeModal(false);
    };

    // Handler for back to selection from Patient Verification Modal
    const handleBackToSelection = () => {
        setShowPatientModal(false);
        setCameFromPatientTypeSelection(false);
        setShowPatientTypeModal(true);
    };

    // Handler for Appointments button click
    const handleAppointmentsClick = (e: React.MouseEvent) => {
        if (isInAppointmentSession) {
            e.preventDefault();
            e.stopPropagation();
            
            // Show a message that they're already in an appointment session
            alert('You are already in an appointment session. Please complete your current appointment or refresh the page to start a new one.');
            return false;
        }
        
        // Normal flow - show terms modal
        setShowTermsModal(true);
    };


    interface User {
        firstname?: string;
        lastname?: string; // Optional if it exists
        email: string;
        // Add other properties your user object has
    }

    // Then in your component
    const user__: User = (usePage().props as any).auth.user; // Or however you get the user

    const auth_ = usePage().props.auth;
    const [datas, setDatas] = useState(auth_);
    useEffect(() => {
        setDatas(auth_);
    }, [auth_]);

    // Listen for custom event to open Patient Verification Modal
    useEffect(() => {
        const handleOpenTermsModal = () => {
            // Prevent multiple modals from opening
            if ((window as any).isTermsModalOpen) {
                console.warn('Terms modal already open, ignoring duplicate request');
                return;
            }
            (window as any).isTermsModalOpen = true;
            setShowTermsModal(true);
        };

        window.addEventListener('openTermsOfServiceModal', handleOpenTermsModal);
        
        return () => {
            window.removeEventListener('openTermsOfServiceModal', handleOpenTermsModal);
        };
    }, []);
    return (
        <header className="w-full h-16 bg-white border-b border-gray-200 header-shadow fixed top-0 left-0 z-50">
            <div className="container mx-auto h-full flex items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <img
                        src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                        alt="Barangay Calumpang Health Center"
                        className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="ml-2 font-semibold text-base text-gray-800 group-hover:text-black transition-colors duration-300">
                        Calumpang RHU
                    </span>
                </Link>

                {/* Mobile Navigation */}
                <div className="md:hidden ml-auto">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-all duration-300 transform hover:scale-110 active:scale-95"
                        aria-label="toggle menu"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-50 to-white shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out ${
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                    style={{ display: mobileMenuOpen ? "block" : "none" }}
                >
                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <Link href="/" className="flex items-center group">
                            <img
                                src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                                alt="Barangay Calumpang Health Center"
                                className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
                            />
                            <span className="ml-2 font-semibold text-base text-gray-800 group-hover:text-black transition-colors duration-300">
                                Calumpang RHU
                            </span>
                        </Link>
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 transition-all duration-300 transform hover:rotate-180 active:scale-95"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <nav className="px-6 py-8">
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/"
                                    className="flex items-center py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm"
                                >
                                    <svg
                                        className="w-5 h-5 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        ></path>
                                    </svg>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={toggleServices}
                                    className="flex items-center justify-between w-full py-2 px-3 text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm"
                                >
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2m14 0V5a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                            ></path>
                                        </svg>
                                        Services
                                    </div>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-300 ${
                                            servicesOpen ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </button>
                                {servicesOpen && (
                                    <div className="pl-10 pr-3 py-1 space-y-1">
                                        <button
                                            onClick={handleAppointmentsClick}
                                            disabled={isInAppointmentSession}
                                            className={`w-full flex items-start py-2 px-2 text-sm font-medium rounded-md transition-all duration-300 transform ${
                                                isInAppointmentSession 
                                                    ? 'text-gray-400 cursor-not-allowed opacity-50' 
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100 hover:to-transparent hover:translate-x-1 hover:shadow-sm'
                                            }`}
                                            style={{ 
                                                textAlign: 'left',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                font: 'inherit'
                                            }}
                                            title={isInAppointmentSession ? 'You are already in an appointment session' : 'Schedule an appointment'}
                                        >
                                            <svg
                                                className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                                                    isInAppointmentSession ? 'text-gray-400' : 'text-blue-500'
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                ></path>
                                            </svg>
                                            <div className="flex flex-col text-left">
                                                <span className="font-medium">
                                                    {isInAppointmentSession ? 'Appointments (Active)' : 'Appointments'}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    Schedule your visit to the health center
                                                </span>
                                            </div>
                                        </button>

                                        {shouldDisableSeasonalPrograms() ? (
                                            <button
                                                disabled
                                                className="flex items-start py-2 px-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-50 rounded-md transition-all duration-300"
                                                title="Seasonal Programs is disabled during appointment session"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                    ></path>
                                                </svg>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium">Seasonal Programs</span>
                                                    <span className="text-xs text-gray-400 mt-0.5">
                                                        Disabled during appointment session
                                                    </span>
                                                </div>
                                            </button>
                                        ) : (
                                            <Link
                                                href="/services/seasonal-programs"
                                                className="flex items-start py-2 px-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100 hover:to-transparent rounded-md transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                    ></path>
                                                </svg>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium">Seasonal Programs</span>
                                                    <span className="text-xs text-gray-500 mt-0.5">
                                                        View seasonal programs and availability
                                                    </span>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="flex items-center py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm"
                                >
                                    <svg
                                        className="w-5 h-5 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="flex items-center py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm"
                                >
                                    <svg
                                        className="w-5 h-5 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        ></path>
                                    </svg>
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="flex items-center py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm"
                                >
                                    <svg
                                        className="w-5 h-5 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                        {user__ && (
                            <div className="mt-8">
                                <Link
                                    href="/logout"
                                    method="post"
                                    className="flex items-center justify-center w-full py-3 px-4 bg-gray-800 text-white text-center font-semibold rounded-lg transition-all duration-300 transform hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:scale-95 hover:shadow-lg"
                                >
                                    {/* <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                        ></path>
                                    </svg> */}
                                    Logout
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex space-x-6">
                        <li>
                            <Link
                                href="/"
                                className="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="relative">
                            <button
                                onClick={() =>
                                    setServicesDropdownOpen((prev) => !prev)
                                }
                                className={`nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative ${
                                    servicesDropdownOpen
                                        ? "bg-gray-100 text-gray-900"
                                        : ""
                                }`}
                            >
                                <span>Services</span>
                                <svg
                                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                                        servicesDropdownOpen ? "rotate-180" : ""
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            {servicesDropdownOpen && (
                                <div
                                    className="absolute left-0 mt-2 w-72 origin-top-right rounded-xl bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    onMouseEnter={() =>
                                        setServicesDropdownOpen(true)
                                    }
                                    onMouseLeave={() =>
                                        setTimeout(
                                            () =>
                                                setServicesDropdownOpen(false),
                                            500
                                        )
                                    }
                                >
                                    <div className="space-y-2">
                                        <button
                                            onClick={handleAppointmentsClick}
                                            disabled={isInAppointmentSession}
                                            className={`w-full group flex items-center rounded-lg p-3 transition-all duration-300 transform min-h-[60px] ${
                                                isInAppointmentSession 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : 'hover:bg-gray-50 hover:translate-x-1'
                                            }`}
                                            title={isInAppointmentSession ? 'You are already in an appointment session' : 'Schedule an appointment'}
                                        >
                                            <svg
                                                className={`mr-3 h-5 w-5 transition-colors duration-300 ${
                                                    isInAppointmentSession 
                                                        ? 'text-gray-400' 
                                                        : 'text-gray-400 group-hover:text-black'
                                                }`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <div className="text-center">
                                                <p className={`text-sm font-medium transition-colors duration-300 ${
                                                    isInAppointmentSession 
                                                        ? 'text-gray-400' 
                                                        : 'text-gray-900 group-hover:text-black'
                                                }`}>
                                                    {isInAppointmentSession ? 'Appointments (Active)' : 'Appointments'}
                                                </p>
                                                <p className={`text-xs transition-colors duration-300 ${
                                                    isInAppointmentSession 
                                                        ? 'text-gray-400' 
                                                        : 'text-gray-500 group-hover:text-gray-600'
                                                }`}>
                                                    {isInAppointmentSession 
                                                        ? 'Complete your current appointment first' 
                                                        : 'Schedule your visit to the health center'
                                                    }
                                                </p>
                                            </div>
                                        </button>
                                        {shouldDisableSeasonalPrograms() ? (
                                            <button
                                                disabled
                                                className="group flex items-center rounded-lg p-3 cursor-not-allowed opacity-50 min-h-[60px]"
                                                title="Seasonal Programs is disabled during appointment session"
                                            >
                                                <svg
                                                    className="mr-3 h-5 w-5 text-gray-400"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                        clipRule="evenodd"

/>
                                                </svg>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-gray-400">
                                                        Seasonal Programs
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Disabled during appointment session
                                                    </p>
                                                </div>
                                            </button>
                                        ) : (
                                            <Link
                                                href="/services/seasonal-programs"
                                                className="group flex items-center rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1 min-h-[60px]"
                                            >
                                                <svg
                                                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-black transition-colors duration-300"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                        clipRule="evenodd"

/>
                                                </svg>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors duration-300">
                                                        Seasonal Programs
                                                    </p>
                                                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                                                        View seasonal programs and availability
                                                    </p>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative"
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/faq"
                                className="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative"
                            >
                                FAQ
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* User Menu */}
                <div className="flex items-center">
                    {user__ && (
                        <div className="flex items-center gap-2">
                            <NotficationDropdown datas={datas} />
                            <div className="relative">
                                <button
                                    onClick={toggleUserMenu}
                                    className={`group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative ${
                                        userMenuOpen
                                            ? "bg-gray-100 text-gray-900"
                                            : ""
                                    }`}
                                >
                                    <span>
                                        {user__.firstname} {user__.lastname}
                                    </span>
                                    <svg
                                        className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                                            userMenuOpen ? "rotate-180" : ""
                                        }`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                                        <div className="p-2">
                                            <Link
                                                href="/patient/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 w-full text-left"
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
                {/* Patient Verification Modal */}
                <PatientVerificationModal 
                    isOpen={showPatientModal} 
                    onClose={() => {
                        setShowPatientModal(false);
                        setCameFromPatientTypeSelection(false);
                    }}
                    onBackToSelection={handleBackToSelection}
                    showBackButton={cameFromPatientTypeSelection}
                />

                {/* Terms of Service Modal */}
                <TermsOfServiceModal
                    isOpen={showTermsModal}
                    onClose={handleTermsClose}
                    onAccept={handleTermsAccept}
                />

                {/* Patient Type Selection Modal */}
                <PatientTypeSelectionModal
                    isOpen={showPatientTypeModal}
                    onClose={handlePatientTypeClose}
                    onProceed={handlePatientTypeProceed}
                />

            </header>
        );
    };

export default Header;
