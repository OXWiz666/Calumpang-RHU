import React, { useEffect, useState } from "react";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import InputError from "@/components/InputError";
import { Label } from "@/components/tempo/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";
import { usePage } from "@inertiajs/react";
import CustomCalendar from "./CustomCalendar";
import moment from "moment";
import { tokenSessionManager } from "../../../../utils/tokenSession";
import ConfirmationModal from "../../../../components/tempo/components/landing/ConfirmationModal";
import PhilippinesAddressLookup from "../../../../components/PhilippinesAddressLookup";
import VerificationModal from "../../../../components/tempo/components/landing/VerificationModal";


const AppointmentForm = ({
    onSubmit = () => {},
    formData,
    setFormData,
    errors,
    processing,
    services = [],
    setIsSubmitted,

    //programs,
}) => {
    // Debug logging for formData
    console.log('AppointmentForm received formData:', formData);
    console.log('formData type:', typeof formData);
    console.log('formData is object:', typeof formData === 'object' && formData !== null);
    console.log('formData keys:', formData && typeof formData === 'object' ? Object.keys(formData) : 'not an object');
    
    // Safety check for formData
    if (typeof formData !== 'object' || formData === null) {
        console.error('formData is not a valid object:', formData);
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Form Error</h3>
                <p className="text-red-700">There was an error loading the form data. Please refresh the page.</p>
            </div>
        );
    }
    
    const user = usePage().props.auth.user;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [isFormLocked, setIsFormLocked] = useState(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [isRescheduleMode, setIsRescheduleMode] = useState(false);
    const [rescheduleData, setRescheduleData] = useState(null);
    const [isExistingPatientMode, setIsExistingPatientMode] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [pendingAppointmentData, setPendingAppointmentData] = useState(null);
    const [verificationMethod, setVerificationMethod] = useState('email');


    // Check for reschedule mode and existing patient mode on component mount
    useEffect(() => {
        // Get URL parameters to detect reschedule mode
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const rescheduleAppointmentData = localStorage.getItem('rescheduleAppointmentData');
        const existingPatientData = localStorage.getItem('existingPatientData');
        const patientType = localStorage.getItem('selectedPatientType');
        
        // Debug logging
        console.log('AppointmentForm useEffect - Mode Detection:', {
            mode,
            rescheduleAppointmentData: !!rescheduleAppointmentData,
            existingPatientData: !!existingPatientData,
            patientType,
            isRescheduleMode,
            isExistingPatientMode
        });
        
        // Handle reschedule mode based on URL parameter
        if (mode === 'reschedule' && rescheduleAppointmentData) {
            try {
                const appointmentData = JSON.parse(rescheduleAppointmentData);
                setIsRescheduleMode(true);
                setRescheduleData(appointmentData);
                
                // Pre-fill form with reschedule data (locked fields)
                setFormData(prev => ({
                    ...(typeof prev === 'object' && prev !== null ? prev : {}),
                    firstname: appointmentData.firstname || '',
                    middlename: appointmentData.middlename || '',
                    lastname: appointmentData.lastname || '',
                    email: appointmentData.email || '',
                    phone: appointmentData.phone || '',
                    gender: appointmentData.gender || '',
                    birth: appointmentData.date_of_birth || '',
                    civil_status: appointmentData.civil_status || '',
                    nationality: appointmentData.nationality || '',
                    religion: appointmentData.religion || '',
                    country: appointmentData.country || '',
                    region: appointmentData.region || '',
                    province: appointmentData.province || '',
                    city: appointmentData.city || '',
                    barangay: appointmentData.barangay || '',
                    street: appointmentData.street || '',
                    zip_code: appointmentData.zip_code || '',
                    profile_picture: appointmentData.profile_picture || '',
                    region_id: appointmentData.region_id || null,
                    province_id: appointmentData.province_id || null,
                    city_id: appointmentData.city_id || null,
                    barangay_id: appointmentData.barangay_id || null,
                    // Keep service and subservice from original appointment (will be locked)
                    // We need to find the actual IDs for the service and sub-service
                    service: '', // Will be set after services are loaded
                    servicename: appointmentData.last_service || '',
                    subservice: '', // Will be set after sub-services are loaded
                    subservicename: appointmentData.last_subservice || '',
                }));
                
                // Reschedule mode activated - fields will be locked
            } catch (error) {
                console.error('Error parsing reschedule data:', error);
            }
        }
        // Handle existing patient mode (fields should be locked)
        else if (existingPatientData && patientType === 'existing') {
            try {
                const patientData = JSON.parse(existingPatientData);
                setIsExistingPatientMode(true);
                
                // Pre-fill form with existing patient data (all fields locked)
                setFormData(prev => ({
                    ...(typeof prev === 'object' && prev !== null ? prev : {}),
                    firstname: patientData.firstname || '',
                    middlename: patientData.middlename || '',
                    lastname: patientData.lastname || '',
                    email: patientData.email || '',
                    phone: patientData.phone ? String(patientData.phone) : '',
                    gender: patientData.gender || '',
                    birth: patientData.date_of_birth || '',
                    civil_status: patientData.civil_status || '',
                    nationality: patientData.nationality || '',
                    religion: patientData.religion || '',
                    country: patientData.country || '',
                    region: patientData.region || '',
                    province: patientData.province || '',
                    city: patientData.city || '',
                    barangay: patientData.barangay || '',
                    street: patientData.street || '',
                    zip_code: patientData.zip_code || '',
                    profile_picture: patientData.profile_picture || '',
                    region_id: patientData.region_id || null,
                    province_id: patientData.province_id || null,
                    city_id: patientData.city_id || null,
                    barangay_id: patientData.barangay_id || null,
                    // Don't pre-fill service and subservice for existing patients - let them choose
                    service: '',
                    servicename: '',
                    subservice: '',
                    subservicename: '',
                }));
                
                // Lock form for existing patients
                setIsFormLocked(true);
                
                // Existing patient mode activated - all fields locked
            } catch (error) {
                console.error('Error parsing existing patient data:', error);
            }
        }
        // Clean mode - new appointment
        else {
            // Clean mode - new appointment, all fields enabled
            setIsRescheduleMode(false);
            setIsExistingPatientMode(false);
            setRescheduleData(null);
        }
    }, []);

    // Effect to set service and sub-service IDs when services are loaded in reschedule mode
    useEffect(() => {
        if (isRescheduleMode && rescheduleData && services && services.length > 0) {
            // Find the service ID that matches the service name
            const matchingService = services.find(s => s.servicename === rescheduleData.last_service);
            if (matchingService) {
                setFormData(prev => ({
                    ...(typeof prev === 'object' && prev !== null ? prev : {}),
                    service: matchingService.id,
                    servicename: matchingService.servicename
                }));
                
                // Fetch sub-services for this service
                fetch(`/services/get-sub-services/${matchingService.id}`)
                    .then((resp) => resp.json())
                    .then((subServicesData) => {
                        setSubServices(subServicesData);
                        
                        // Find the sub-service ID that matches the sub-service name
                        const matchingSubService = subServicesData.find(s => s.subservicename === rescheduleData.last_subservice);
                        if (matchingSubService) {
                            setFormData(prev => ({
                                ...(typeof prev === 'object' && prev !== null ? prev : {}),
                                subservice: matchingSubService.id,
                                subservicename: matchingSubService.subservicename
                            }));
                            
                            // Set the times array for this sub-service
                            setTimesArr(matchingSubService.times);
                            
                            // If there's a time in the reschedule data, try to match it
                            if (rescheduleData.last_time) {
                                const matchingTime = matchingSubService.times.find(t => 
                                    moment(t.time, "HH:mm:ss").format("hh:mm A") === rescheduleData.last_time
                                );
                                if (matchingTime) {
                                    setFormData(prev => ({
                                        ...(typeof prev === 'object' && prev !== null ? prev : {}),
                                        timeid: matchingTime.id,
                                        time: moment(matchingTime.time, "HH:mm:ss").format("hh:mm A")
                                    }));
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching sub-services:', error);
                    });
            }
        }
    }, [isRescheduleMode, rescheduleData, services]);

    // Cleanup function to clear localStorage when component unmounts
    useEffect(() => {
        return () => {
            // Don't clear data on unmount as it might be needed for navigation
        };
    }, []);

    useEffect(() => {
        if (user && !formData.firstname && !isRescheduleMode && !isExistingPatientMode) {
            setFormData({
                ...(typeof formData === 'object' && formData !== null ? formData : {}),
                firstname: user.firstname,
                middlename: user.middlename ?? "",
                lastname: user.lastname,
                email: user.email,
                phone: user.contactno ? String(user.contactno) : "",
                servicename: "",
                service: "",
                gender: user.gender,
                birth: user.birth,
                priorityNumber: "", // Will be set by backend
                // Patient profile fields
                date_of_birth: user.birth || "",
                civil_status: user.civil_status || "",
                nationality: user.nationality || "",
                religion: user.religion || "",
                country: user.country || "",
                region: user.region || "",
                province: user.province || "",
                city: user.city || "",
                barangay: user.barangay || "",
                street: user.street || "",
                zip_code: user.zip_code || "",
                profile_picture: user.profile_picture || "",
                // Address ID fields for yajra/laravel-address
                region_id: user.region_id || null,
                province_id: user.province_id || null,
                city_id: user.city_id || null,
                barangay_id: user.barangay_id || null,
            });
            // Lock form for authenticated users
            setIsFormLocked(true);
        }
    }, [user]);

    // Check for token session and populate form
    useEffect(() => {
        if (!user) {
            // Check for token session first
            if (tokenSessionManager.hasValidTokenSession()) {
                const patientData = tokenSessionManager.getPatientData();
                if (patientData) {
                    setFormData({
                        ...(typeof formData === 'object' && formData !== null ? formData : {}),
                        firstname: patientData.firstname || "",
                        middlename: patientData.middlename || "",
                        lastname: patientData.lastname || "",
                        email: patientData.email || "",
                        phone: patientData.phone ? String(patientData.phone) : "",
                        gender: patientData.sex || "",
                        birth: patientData.birthdate || "",
                        servicename: "",
                        service: "",
                        priorityNumber: "", // Will be set by backend
                        // Patient profile fields
                        date_of_birth: patientData.birthdate || "",
                        civil_status: patientData.civilStatus || "",
                        nationality: patientData.nationality || "",
                        religion: patientData.religion || "",
                        country: patientData.country || "",
                        region: patientData.region || "",
                        province: patientData.province || "",
                        city: patientData.city || "",
                        barangay: patientData.barangay || "",
                        street: patientData.street || "",
                        zip_code: patientData.zipCode || "",
                        profile_picture: patientData.profileImage || "",
                        // Address ID fields for yajra/laravel-address
                        region_id: patientData.region_id || null,
                        province_id: patientData.province_id || null,
                        city_id: patientData.city_id || null,
                        barangay_id: patientData.barangay_id || null,
                    });
                    // Lock form for guest users who have completed verification
                    setIsFormLocked(true);
                }
            } else {
                // Fallback to localStorage for backward compatibility
                const storedData = localStorage.getItem('patientVerificationData');
                if (storedData) {
                    try {
                        const patientInfo = JSON.parse(storedData);
                        setFormData({
                            ...(typeof formData === 'object' && formData !== null ? formData : {}),
                            firstname: patientInfo.firstname || "",
                            middlename: patientInfo.middlename || "",
                            lastname: patientInfo.lastname || "",
                            email: patientInfo.email || "",
                            phone: patientInfo.phone ? String(patientInfo.phone) : "",
                            gender: patientInfo.sex || "",
                            birth: patientInfo.birthdate || "",
                            servicename: "",
                            service: "",
                            priorityNumber: "", // Will be set by backend
                            // Patient profile fields
                            date_of_birth: patientInfo.birthdate || "",
                            civil_status: patientInfo.civilStatus || "",
                            nationality: patientInfo.nationality || "",
                            religion: patientInfo.religion || "",
                            country: patientInfo.country || "",
                            region: patientInfo.region || "",
                            province: patientInfo.province || "",
                            city: patientInfo.city || "",
                            barangay: patientInfo.barangay || "",
                            street: patientInfo.street || "",
                            zip_code: patientInfo.zipCode || "",
                            profile_picture: patientInfo.profileImage || "",
                            // Address ID fields for yajra/laravel-address
                            region_id: patientInfo.region_id || null,
                            province_id: patientInfo.province_id || null,
                            city_id: patientInfo.city_id || null,
                            barangay_id: patientInfo.barangay_id || null,
                        });
                        
                        // Clear the stored data after using it
                        localStorage.removeItem('patientVerificationData');
                    } catch (error) {
                        // Silently handle error
                    }
                }
            }
        }
    }, []);

    // Create a service lookup object with additional safety checks
    const serviceLookup = React.useMemo(() => {
        if (!Array.isArray(services) || services.length === 0) {
            console.warn('Services is not a valid array:', services);
            return {};
        }
        return services.reduce((acc, service) => {
            if (service && service.id) {
        acc[service.id] = service;
            }
        return acc;
    }, {});
    }, [services]);

    const [date, setDate] = useState(new Date());



    // Handler for final confirmation
    const handleFinalConfirmation = () => {
        setShowConfirmationModal(false);
        // Submit the appointment after confirmation
        onSubmit(formData);
    };



    // Separate handler for date changes
    const handleDateChange = (date) => {
        //setDate(date);
        setFormData((prev) => ({ ...(typeof prev === 'object' && prev !== null ? prev : {}), date }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for phone number
        if (name === "phone") {
            // Allow only numbers and + character, ensure it's a string
            const cleanedValue = String(value).replace(/[^0-9+]/g, "");
            setFormData((prev) => ({ ...(typeof prev === 'object' && prev !== null ? prev : {}), [name]: cleanedValue }));
        } else {
            setFormData((prev) => ({ ...(typeof prev === 'object' && prev !== null ? prev : {}), [name]: value }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...(typeof prev === 'object' && prev !== null ? prev : {}), [name]: value ?? null }));
    };

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({ ...(typeof prev === 'object' && prev !== null ? prev : {}), [name]: value }));
    };


    const timeSlots = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
    ];

    // const services = [
    //     "General Consultation",
    //     "Vaccination",
    //     "Prenatal Check-up",
    //     "Child Health Check-up",
    //     "Blood Pressure Monitoring",
    //     "Family Planning",
    //     "Dental Services",
    //   ];

    const [subservices, setSubServices] = useState([]);

    const [timesArr, setTimesArr] = useState([]);

    const subServiceLookup = React.useMemo(() => {
        if (!Array.isArray(subservices) || subservices.length === 0) {
            return {};
        }
        return subservices.reduce((acc, subservice) => {
            if (subservice && subservice.id) {
        acc[subservice.id] = subservice;
            }
        return acc;
    }, {});
    }, [subservices]);

    // useEffect(() => {
    //     //console.log("subservice: ", subservices);
    // }, [timesArr]);

    const [programs, setPrograms] = useState([]);
    useEffect(() => {
        const service = serviceLookup[formData.service]; // id

        setPrograms(service?.servicedays?.map((day) => day.day));
        //programs = service?.servicedays?.map((day) => day.day);
        //console.log("programs:: ", programs);
    }, [formData, serviceLookup]);

    // useEffect(() => {
    //     console.log("time:", formData.time?.toString().trim(), "wew");
    // }, [formData.time]);

    // Helper function to determine if personal fields should be disabled
    const shouldDisablePersonalFields = () => {
        // Disable personal fields in reschedule mode, not in existing patient mode
        return isRescheduleMode && !isExistingPatientMode;
    };

    // Helper function to determine if service fields should be disabled
    const shouldDisableServiceFields = () => {
        // Only disable service fields in reschedule mode, not in existing patient or new patient mode
        return isRescheduleMode && !isExistingPatientMode;
    };

    // Helper function to determine if time field should be disabled
    const shouldDisableTimeField = () => {
        // Time field is always enabled, even in reschedule mode
        return false;
    };

    // Function to clear all mode flags and start fresh
    const clearAllModes = () => {
        localStorage.removeItem('isRescheduleMode');
        localStorage.removeItem('rescheduleAppointmentData');
        localStorage.removeItem('existingPatientData');
        localStorage.removeItem('selectedPatientType');
        setIsRescheduleMode(false);
        setIsExistingPatientMode(false);
        setRescheduleData(null);
        
        // Clear URL parameters and reload to clean state
        const url = new URL(window.location);
        url.searchParams.delete('mode');
        window.history.replaceState({}, '', url);
        window.location.reload();
    };

    // Handle appointment submission with verification
    const handleAppointmentSubmit = async (data) => {
        // Ensure phone is a string before calling trim
        const phoneValue = data.phone ? String(data.phone) : '';
        const emailValue = data.email ? String(data.email) : '';
        
        // Determine verification method based on available contact info
        const hasEmail = emailValue && emailValue.trim() !== '';
        const hasPhone = phoneValue && phoneValue.trim() !== '';
        
        if (!hasEmail && !hasPhone) {
            setValidationError('Please provide either email or phone number for verification');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Prefer email if available, otherwise use SMS
        const method = hasEmail ? 'email' : 'sms';
        setVerificationMethod(method);
        
        // Store the appointment data temporarily (don't create in database yet)
        setPendingAppointmentData({
            ...data,
            id: null // No ID yet since we haven't created the appointment
        });
        
        // Show verification modal immediately
        setShowVerificationModal(true);
    };

    // Handle successful verification
    const handleVerificationSuccess = async (verifiedAppointmentData) => {
        console.log('Verification successful! Creating appointment...');
        console.log('Pending appointment data:', pendingAppointmentData);
        console.log('Verified appointment data from modal:', verifiedAppointmentData);
        
        setShowVerificationModal(false);
        
        // Now create the appointment in the database after successful verification
        try {
            console.log('Sending appointment creation request...');
            
            // Use verified appointment data if available, otherwise fall back to pending data
            const appointmentDataToSend = verifiedAppointmentData || pendingAppointmentData;
            console.log('Using appointment data:', appointmentDataToSend);
            
            const response = await fetch(route("patient.appoint.create"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(appointmentDataToSend)
            });

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Appointment creation result after verification:', result);
            console.log('Priority number from result:', result.priority_number);
            console.log('Priority number from appointment_data:', result.appointment_data?.priority_number);

            if (result.success) {
                console.log('Appointment created successfully! Showing confirmation...');
                console.log('Current formData before update:', formData);
                console.log('Result appointment_data:', result.appointment_data);
                // Set the form as submitted to show the confirmation page
                if (setIsSubmitted) {
                    setIsSubmitted(true);
                }
                // Also update the form data with the appointment details
                const newFormData = {
                    ...formData,
                    ...result.appointment_data,
                    id: result.appointment_data.id,
                    priorityNumber: result.appointment_data?.priority_number || result.priority_number || formData.priorityNumber || "TEST123",
                    referenceNumber: result.appointment_data.reference_number || result.reference_number || formData.referenceNumber,
                    // Ensure all patient data is properly mapped
                    firstname: result.appointment_data?.firstname || formData.firstname || "",
                    lastname: result.appointment_data?.lastname || formData.lastname || "",
                    middlename: result.appointment_data?.middlename || formData.middlename || "",
                    email: result.appointment_data?.email || formData.email || "",
                    phone: result.appointment_data?.phone || formData.phone || "",
                    gender: result.appointment_data?.gender || formData.gender || "",
                    date_of_birth: result.appointment_data?.date_of_birth || formData.date_of_birth || "",
                    birth: result.appointment_data?.date_of_birth || formData.birth || formData.date_of_birth || "",
                    servicename: result.appointment_data?.service_name || formData.servicename || "",
                    subservicename: result.appointment_data?.subservice_name || formData.subservicename || "",
                    date: result.appointment_data?.date || formData.date || "",
                    time: result.appointment_data?.time || formData.time || "",
                    notes: result.appointment_data?.notes || formData.notes || ""
                };
                console.log('Setting form data with priority number:', newFormData.priorityNumber);
                console.log('Setting form data with patient data:', {
                    firstname: newFormData.firstname,
                    lastname: newFormData.lastname,
                    email: newFormData.email,
                    phone: newFormData.phone
                });
                console.log('Full new form data:', newFormData);
                // Store appointment data in localStorage for persistence across page reloads
                localStorage.setItem('confirmed_appointment_data', JSON.stringify(newFormData));
                console.log('Stored appointment data in localStorage:', newFormData);
                
                // Send appointment confirmation email if patient has email
                if (newFormData.email && newFormData.email.trim() !== '') {
                    try {
                        console.log('Sending appointment confirmation email to:', newFormData.email);
                        const emailResponse = await fetch('/api/sms/send-appointment-email', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                appointment_data: {
                                    email: newFormData.email,
                                    firstname: newFormData.firstname,
                                    lastname: newFormData.lastname,
                                    date: newFormData.date,
                                    time: newFormData.time,
                                    service_name: newFormData.servicename,
                                    subservice_name: newFormData.subservicename,
                                    priority_number: newFormData.priorityNumber,
                                    appointment_id: newFormData.id,
                                    phone: newFormData.phone,
                                    date_of_birth: newFormData.date_of_birth
                                }
                            })
                        });
                        
                        const emailResult = await emailResponse.json();
                        if (emailResult.success) {
                            console.log('Appointment confirmation email sent successfully');
                            // Show success message to user
                            if (window.toast) {
                                window.toast.success('Appointment confirmation email sent successfully!');
                            }
                        } else {
                            console.warn('Failed to send appointment confirmation email:', emailResult.message);
                            // Show warning to user but don't block appointment creation
                            if (window.toast) {
                                window.toast.warning('Appointment created but email confirmation failed. Please check your email settings.');
                            }
                        }
                    } catch (emailError) {
                        console.error('Error sending appointment confirmation email:', emailError);
                        // Show error to user but don't block appointment creation
                        if (window.toast) {
                            window.toast.error('Appointment created but email confirmation failed. Please contact support if needed.');
                        }
                    }
                } else {
                    console.log('No email address provided, skipping email confirmation');
                }
                
                // Also update the form data
                setFormData(newFormData);
                // Update URL to show confirmation state
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('confirmed', 'true');
                window.history.replaceState({}, '', newUrl);
                
                // Scroll to top to show the confirmation
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error('Appointment creation failed:', result);
                setValidationError(result.message || 'Failed to create appointment after verification');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error creating appointment after verification:', error);
            setValidationError('An error occurred while creating the appointment. Please try again.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle verification modal close
    const handleVerificationClose = () => {
        setShowVerificationModal(false);
        setPendingAppointmentData(null);
    };


    return (
        <>
        <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
        >

            {/* Reschedule Mode Banner - Show when in reschedule mode */}
            {isRescheduleMode && !isExistingPatientMode && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-orange-900">Reschedule Appointment</h3>
                            <p className="text-sm text-orange-700">
                                You are rescheduling your appointment. Personal information and service type are locked. You can change the sub-service, date, and time.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{validationError}</p>
                    </div>
                    <button
                        onClick={() => setValidationError("")}
                        className="text-red-600 hover:text-red-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}

            {isFormLocked && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <div className="flex-1">
                        <p className="font-medium text-sm">
                            {user ? 'Personal information is locked for authenticated users' : 'Personal information is locked after verification'}
                        </p>
                        <p className="text-xs mt-1">
                            {user ? 'Your account information cannot be modified here' : 'This information was verified and cannot be changed'}
                        </p>
                    </div>
                </div>
            )}
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="name">First Name</Label>
                        <Input
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder="Your First Name"
                            disabled={isFormLocked || shouldDisablePersonalFields()}
                            required
                        />
                        <InputError message={errors.firstname} />
                    </div>
                    <div>
                        <Label htmlFor="middlename">Middle Name</Label>
                        <Input
                            id="middlename"
                            name="middlename"
                            value={formData.middlename}
                            onChange={handleChange}
                            placeholder="N/A"
                            disabled={isFormLocked || shouldDisablePersonalFields()}
                            required
                        />
                        <InputError message={errors.middlename} />
                    </div>
                    <div>
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder="Your Last Name"
                            disabled={isFormLocked || shouldDisablePersonalFields()}
                            required
                        />
                        <InputError message={errors.lastname} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="email">Email Address (Optional)</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="juan@example.com"
                            disabled={isFormLocked || shouldDisablePersonalFields()}
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+63 912 345 6789"
                            disabled={isFormLocked || shouldDisablePersonalFields()}
                        />
                        <InputError message={errors.phone} />
                    </div>
                </div>

                {/* Patient Profile Information - Collapsible Section */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Additional Patient Information (Optional)</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                This information will be automatically stored in your Patient Record for future appointments
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            {showAdditionalInfo ? 'Hide Details' : 'Show Details'}
                        </button>
                    </div>
                    
                    {showAdditionalInfo && (
                        <div className="space-y-4">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        disabled={isFormLocked || shouldDisablePersonalFields()}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => handleInputChange("gender", value)}
                                        disabled={isFormLocked || shouldDisablePersonalFields()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="civil_status">Civil Status</Label>
                                    <Select
                                        value={formData.civil_status}
                                        onValueChange={(value) => handleInputChange("civil_status", value)}
                                        disabled={isFormLocked || shouldDisablePersonalFields()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Single</SelectItem>
                                            <SelectItem value="Married">Married</SelectItem>
                                            <SelectItem value="Widowed">Widowed</SelectItem>
                                            <SelectItem value="Divorced">Divorced</SelectItem>
                                            <SelectItem value="Separated">Separated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Nationality and Religion */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input
                                        id="nationality"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="e.g., Filipino"
                                        disabled={isFormLocked || shouldDisablePersonalFields()}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="religion">Religion</Label>
                                    <Input
                                        id="religion"
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleChange}
                                        placeholder="e.g., Catholic"
                                        disabled={isFormLocked || shouldDisablePersonalFields()}
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <PhilippinesAddressLookup
                                formData={formData}
                                setFormData={setFormData}
                                isDisabled={isFormLocked || shouldDisablePersonalFields()}
                                showStreet={true}
                                showZipCode={true}
                            />
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Service Type</Label>
                        <Select
                            value={formData.service?.toString()} // Ensure string value
                            onValueChange={(selectedId) => {
                                if (shouldDisableServiceFields()) return; // Prevent changes in all modes
                                
                                const service = serviceLookup[selectedId];
                                if (service) {
                                    handleSelectChange("service", service.id);
                                    handleSelectChange(
                                        "servicename",
                                        service.servicename
                                    );

                                    handleSelectChange("date", null);
                                    handleSelectChange("subservice", "");
                                    handleSelectChange("subservicename", "");
                                    handleSelectChange("timeid", "");
                                    handleSelectChange("time", "");
                                    //  handleSelectChange("customAttr", service.customAttribute);
                                } // handleSelectChange("servicename", selectedService?.servicename || "");

                                fetch(
                                    `/services/get-sub-services/${selectedId}`
                                )
                                    .then((resp) => resp.json())
                                    .then((data) => {
                                        setSubServices(data);
                                    });
                            }}
                            disabled={shouldDisableServiceFields()}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select service">
                                    {formData.service
                                        ? (services || []).find(
                                              (s) =>
                                                  s.id.toString() ===
                                                  formData.service.toString()
                                          )?.servicename
                                        : "Select service"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {(services || []).map((service) => (
                                    <SelectItem
                                        key={service.id} // Use service.id as key
                                        value={service.id} // Ensure string value
                                    >
                                        {service.servicename}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.service} />
                    </div>
                    <div>
                        <Label>Service Sub Type</Label>
                        <Select
                            value={formData.subservice?.toString()} // Ensure string value
                            onValueChange={(selectedId) => {
                                if (shouldDisableServiceFields()) return; // Prevent changes in all modes
                                
                                const subservice = subServiceLookup[selectedId];

                                setTimesArr(subservice?.times);
                                // handleSelectChange({
                                //     subservice: subservice.id,
                                //     subservicename: subservice.subservicename,
                                // });
                                // Correct - call separately for each field
                                handleSelectChange(
                                    "subservice",
                                    subservice.id ?? null
                                );
                                handleSelectChange(
                                    "subservicename",
                                    subservice.subservicename ?? null
                                );

                                handleSelectChange("timeid", "");
                                handleSelectChange("time", "");
                            }}
                            disabled={shouldDisableServiceFields()}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Sub Service">
                                    {formData.subservice
                                        ? subservices.find(
                                              (s) =>
                                                  s.id.toString() ===
                                                  formData.subservice.toString()
                                          )?.subservicename
                                        : "Select Sub-Service"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {subservices?.map((ss, i) => (
                                    <SelectItem key={i} value={ss.id}>
                                        {ss.subservicename}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.subservice} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Appointment Date</Label>
                        <CustomCalendar
                            selectedDate={formData.date}
                            onDateSelect={handleDateChange}
                            hasPrograms={programs}
                            serviceId={formData.service}
                            subserviceId={formData.subservice}
                        />
                        {/* <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.date &&
                                            "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.date ? (
                                        format(formData.date, "PPP")
                                    ) : (
                                        <span>Select date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={formData.date}
                                    onSelect={handleDateChange}
                                    initialFocus
                                    disabled={(date) => {
                                        // Disable past dates and weekends
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const day = date.getDay();
                                        return date < today || day === 0; // 0 is Sunday
                                    }}
                                />
                            </PopoverContent>
                        </Popover> */}
                        <InputError message={errors.date} />
                    </div>

                    <div>
                        <Label>Appointment Time</Label>
                        <Select
                            value={formData.timeid}
                            onValueChange={(value) => {
                                if (shouldDisableTimeField()) return; // Time field is always enabled
                                
                                const subserv =
                                    subServiceLookup[formData.subservice];
                                handleSelectChange("timeid", value ?? null);
                                handleSelectChange(
                                    "time",
                                    moment(
                                        subserv?.times?.find(
                                            (t) => t.id == value
                                        )?.time,
                                        "HH:mm:ss"
                                    ).format("hh:mm A") ?? null
                                );
                            }}
                            disabled={shouldDisableTimeField()}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select time">
                                    {formData.timeid ? (
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4" />
                                            {moment(
                                                formData.time,
                                                "HH:mm:ss"
                                            ).format("h:mm A")}
                                        </div>
                                    ) : (
                                        "Select time"
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {timesArr.map((time, i) => (
                                    <SelectItem key={time.id} value={time.id}>
                                        {moment(time.time, "HH:mm:ss").format(
                                            "h:mm A"
                                        )}
                                    </SelectItem>
                                ))}
                                {/* {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))} */}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.time} />
                    </div>
                </div>
            </div>

                <div className="space-y-4">
                {usePage().props.auth.user && !isExistingPatientMode ? (
                    <Button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Validate required fields before showing verification modal
                            const requiredFields = ['firstname', 'lastname', 'service', 'date', 'time'];
                            const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
                            
                            if (missingFields.length > 0) {
                                // Show error message for missing fields
                                const fieldNames = {
                                    'firstname': 'First Name',
                                    'lastname': 'Last Name', 
                                    'service': 'Service Type',
                                    'date': 'Appointment Date',
                                    'time': 'Appointment Time'
                                };
                                const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
                                setValidationError(`Please fill in the following required fields: ${missingFieldNames.join(', ')}`);
                                
                                // Scroll to top to show error
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                            }
                            
                            // Clear any previous errors
                            setValidationError("");
                            
                            // All required fields are filled, submit the appointment directly
                            onSubmit(formData);
                        }}
                        disabled={processing} 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        {processing ? (
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>
                                    {isRescheduleMode && !isExistingPatientMode ? 'Reschedule Appointment' : 'Schedule Appointment'}
                                </span>
                            </div>
                        )}
                    </Button>
                ) : isExistingPatientMode ? (
                    <Button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Validate required fields before showing verification modal
                            const requiredFields = ['firstname', 'lastname', 'service', 'date', 'time'];
                            const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
                            
                            if (missingFields.length > 0) {
                                // Show error message for missing fields
                                const fieldNames = {
                                    'firstname': 'First Name',
                                    'lastname': 'Last Name', 
                                    'service': 'Service Type',
                                    'date': 'Appointment Date',
                                    'time': 'Appointment Time'
                                };
                                const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
                                setValidationError(`Please fill in the following required fields: ${missingFieldNames.join(', ')}`);
                                
                                // Scroll to top to show error
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                            }
                            
                            // Clear any previous errors
                            setValidationError("");
                            
                            // All required fields are filled, start verification process
                            handleAppointmentSubmit(formData);
                        }}
                        disabled={processing} 
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        {processing ? (
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Book New Appointment</span>
                            </div>
                        )}
                    </Button>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Book Your Appointment?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Complete your patient verification to access appointment booking and manage your health records.
                            </p>
                            <Button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    // Validate required fields before showing verification modal
                                    const requiredFields = ['firstname', 'lastname', 'service', 'date', 'time'];
                                    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
                                    
                                    if (missingFields.length > 0) {
                                        // Show error message for missing fields
                                        const fieldNames = {
                                            'firstname': 'First Name',
                                            'lastname': 'Last Name', 
                                            'service': 'Service Type',
                                            'date': 'Appointment Date',
                                            'time': 'Appointment Time'
                                        };
                                        const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
                                        setValidationError(`Please fill in the following required fields: ${missingFieldNames.join(', ')}`);
                                        
                                        // Scroll to top to show error
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        return;
                                    }
                                    
                                    // Clear any previous errors
                                    setValidationError("");
                                    
                                    // All required fields are filled, start verification process
                                    handleAppointmentSubmit(formData);
                                }}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>Appoint Now!</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </form>

        {/* Confirmation Modal */}
        <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={handleFinalConfirmation}
            title="Confirmation"
            message="Are you sure you want to confirm this appointment?"
            confirmText="Confirm"
            cancelText="Cancel"
        />

        {/* Verification Modal */}
        <VerificationModal
            isOpen={showVerificationModal}
            onClose={handleVerificationClose}
            onVerified={handleVerificationSuccess}
            appointmentData={pendingAppointmentData}
            verificationMethod={verificationMethod}
        />

        </>
    );
};

export default AppointmentForm;
