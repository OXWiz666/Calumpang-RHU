import React, { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import { format, differenceInYears } from "date-fns";
import {
    Calendar as CalendarIcon,
    Clock,
    Users,
    MapPin,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import LandingLayout from "@/Layouts/LandingLayout";
import CustomModal from "@/components/CustomModal";
import moment from "moment";
import { useForm } from "@inertiajs/react";
import PostErrors from "@/components/PostErrors";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
const ProgramRegistration = ({ isOpen, onClose = () => {}, schedule }) => {
    const { program, isLoggedin, auth } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);

    // Validation functions
    const validateContactNumber = (contactNumber) => {
        const philippineMobileRegex = /^(09|\+639)[0-9]{9}$/;
        return philippineMobileRegex.test(contactNumber);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return 0;
        return differenceInYears(new Date(), new Date(birthdate));
    };

    // Check for duplicate email and contact number
    const checkDuplicates = async (email, contactNumber, programId) => {
        try {
            const response = await fetch(`/api/check-duplicates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    email,
                    contact_number: contactNumber,
                    program_id: programId
                })
            });

            if (response.ok) {
                const result = await response.json();
                return result;
            }
            return { hasDuplicates: false };
        } catch (error) {
            console.error('Error checking duplicates:', error);
            return { hasDuplicates: false };
        }
    };

    // Download registration summary as PDF
    const downloadRegistrationSummary = () => {
        if (!registrationData || !schedule) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 30;

        // Title
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Program Registration Summary", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 20;

        // Program Details
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Program Information", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Program Name: ${schedule.program_name || "Health Program"}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Date: ${format(new Date(schedule.date), "MMMM dd, yyyy")}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Time: ${schedule.time}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Location: ${schedule.location || "Barangay Calumpang Health Center"}`, margin, yPosition);
        yPosition += 15;

        // Personal Information
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Personal Information", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Full Name: ${registrationData.first_name} ${registrationData.middle_name || ""} ${registrationData.last_name} ${registrationData.suffix || ""}`.trim(), margin, yPosition);
        yPosition += 8;
        doc.text(`Gender: ${registrationData.sex}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Date of Birth: ${format(new Date(registrationData.birthdate), "MMMM dd, yyyy")}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Age: ${registrationData.age} years old`, margin, yPosition);
        yPosition += 8;
        doc.text(`Contact Number: ${registrationData.contact_number}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Email: ${registrationData.email}`, margin, yPosition);
        yPosition += 15;

        // Registration Details
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Registration Details", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Registration Date: ${format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Status: Registered`, margin, yPosition);
        yPosition += 8;
        doc.text(`Registration ID: ${registrationData.id || "N/A"}`, margin, yPosition);
        yPosition += 20;

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("This document serves as proof of your program registration.", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 8;
        doc.text("Please keep this for your records.", pageWidth / 2, yPosition, { align: "center" });

        // Save the PDF
        const fileName = `Program_Registration_${registrationData.first_name}_${registrationData.last_name}_${format(new Date(), "yyyy-MM-dd")}.pdf`;
        doc.save(fileName);
    };

    const { data, setData, post, errors, recentlySuccessful, processing } =
        useForm({
            program_id: schedule?.id,
            user_id: null, // No user authentication required
            first_name: "",
            middle_name: "",
            last_name: "",
            suffix: "",
            sex: "Male",
            birthdate: "",
            age: 0,
            contact_number: "",
            email: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);
        setFormSuccess(null);
        setValidationErrors({});

        // Validate contact number
        if (!validateContactNumber(data.contact_number)) {
            setValidationErrors(prev => ({
                ...prev,
                contact_number: "Please enter a valid Philippine mobile number (09xxxxxxxxx or +639xxxxxxxxx)"
            }));
            setIsSubmitting(false);
            return;
        }

        // Validate email
        if (!validateEmail(data.email)) {
            setValidationErrors(prev => ({
                ...prev,
                email: "Please enter a valid email address"
            }));
            setIsSubmitting(false);
            return;
        }

        // Validate birthdate
        if (!data.birthdate) {
            setValidationErrors(prev => ({
                ...prev,
                birthdate: "Birthdate is required"
            }));
            setIsSubmitting(false);
            return;
        }

        // Calculate age from birthdate
        const calculatedAge = calculateAge(data.birthdate);
        if (calculatedAge < 0) {
            setValidationErrors(prev => ({
                ...prev,
                birthdate: "Birthdate cannot be in the future"
            }));
            setIsSubmitting(false);
            return;
        }

        // Update age in form data
        setData("age", calculatedAge);

        // Check for duplicates before submitting
        checkDuplicates(data.email, data.contact_number, schedule.id)
            .then(duplicateResult => {
                if (duplicateResult.hasDuplicates) {
                    if (duplicateResult.emailExists) {
                        setValidationErrors(prev => ({
                            ...prev,
                            email: "This email address is already registered for this program."
                        }));
                    }
                    if (duplicateResult.contactNumberExists) {
                        setValidationErrors(prev => ({
                            ...prev,
                            contact_number: "This contact number is already registered for this program."
                        }));
                    }
                    setIsSubmitting(false);
                    return;
                }

                // Proceed with registration if no duplicates
                post(route("patient.seasonal.join", { schedule: schedule.id }), {
                    onSuccess: (res) => {
                        // Store registration data for summary modal
                        setRegistrationData({
                            ...data,
                            id: res.props?.registration_id || Date.now(), // Use response ID or fallback
                        });
                        setFormSuccess("You have been registered for the program!");
                        // Show summary modal instead of closing immediately
                        setShowSummaryModal(true);
                    },
                    onError: (res) => {
                        console.log(res);
                        if (res.errors) {
                            setValidationErrors(res.errors);
                        } else {
                            setFormError("Registration failed. Please try again.");
                        }
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                });
            })
            .catch(error => {
                console.error('Error checking duplicates:', error);
                setIsSubmitting(false);
                setFormError("An error occurred while checking for duplicates. Please try again.");
            });
    };

    useEffect(() => {
        setData("program_id", schedule?.id);
    }, [schedule]);

    // Calculate age when birthdate changes
    useEffect(() => {
        if (data.birthdate) {
            const calculatedAge = calculateAge(data.birthdate);
            setData("age", calculatedAge);
        }
    }, [data.birthdate]);
    return (
        <>
            <CustomModal isOpen={isOpen} onClose={onClose}>
            <div className="max-w-[90vw] mx-auto w-full max-h-[90vh] overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Program Registration
                </h1>

                {formSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <div>
                            <h3 className="font-medium">
                                Registration Successful
                            </h3>
                            <p className="text-sm">{formSuccess}</p>
                        </div>
                    </div>
                )}

                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                        <div>
                            <h3 className="font-medium">Registration Failed</h3>
                            <p className="text-sm">{formError}</p>
                        </div>
                    </div>
                )}

                <Card>
                    <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                        <CardTitle className="text-xl flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            Register for Health Program
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-semibold text-lg mb-2">
                                    {schedule?.name || "Health Program"}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-700" />
                                        <span>
                                            {schedule?.date
                                                ? format(
                                                      new Date(schedule.date),
                                                      "MMMM d, yyyy"
                                                  )
                                                : "Date TBD"}
                                        </span>
                                        <input
                                            type="hidden"
                                            name="date"
                                            value={
                                                schedule?.date
                                                    ? format(
                                                          new Date(
                                                              schedule.date
                                                          ),
                                                          "MMMM d, yyyy"
                                                      )
                                                    : "Date TBD"
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-gray-700" />
                                        <span>
                                            {schedule?.time
                                                .split(" - ")
                                                .map((time) =>
                                                    moment(
                                                        time,
                                                        "HH:mm:ss"
                                                    ).format("hh:mm A")
                                                )
                                                .join(" - ")}
                                        </span>
                                        <input
                                            type="hidden"
                                            name="time"
                                            value={schedule?.time}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-gray-700" />
                                        <span>
                                            {schedule?.location ||
                                                "Location TBD"}
                                        </span>
                                        <input
                                            type="hidden"
                                            name="location"
                                            value={
                                                schedule?.location ||
                                                "Location TBD"
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-2 text-gray-700" />
                                        <span>
                                            {schedule?.availableSlots || 0}{" "}
                                            slots available
                                        </span>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="program_name"
                                        value={
                                            schedule?.name || "Health Program"
                                        }
                                    />
                                </div>
                            </div>
                            <PostErrors errors={errors} />
                            
                            {/* Display validation errors */}
                            {Object.keys(validationErrors).length > 0 && (
                                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                                        <div>
                                            <h3 className="font-medium">Please fix the following errors:</h3>
                                            <ul className="text-sm mt-1 list-disc list-inside">
                                                {Object.entries(validationErrors).map(([field, error]) => (
                                                    <li key={field}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label
                                            htmlFor="first_name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            className="w-full px-3 py-2 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            value={data.first_name}
                                            onChange={(e) => setData("first_name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="middle_name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Middle Name
                                        </label>
                                        <input
                                            type="text"
                                            id="middle_name"
                                            name="middle_name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.middle_name}
                                            onChange={(e) => setData("middle_name", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="last_name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.last_name}
                                            onChange={(e) => setData("last_name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="suffix"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Suffix
                                        </label>
                                        <input
                                            type="text"
                                            id="suffix"
                                            name="suffix"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.suffix}
                                            onChange={(e) => setData("suffix", e.target.value)}
                                            placeholder="Jr., Sr., III, etc."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label
                                            htmlFor="sex"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Sex
                                        </label>
                                        <select
                                            id="sex"
                                            name="sex"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.sex}
                                            onChange={(e) => setData("sex", e.target.value)}
                                            required
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="birthdate"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Birthdate
                                        </label>
                                        <input
                                            type="date"
                                            id="birthdate"
                                            name="birthdate"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.birthdate}
                                            onChange={(e) => setData("birthdate", e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="age"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >                                            
                                            Age 
                                        </label>
                                        <input
                                            type="number"
                                            id="age"
                                            name="age"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                            value={data.age}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="contact_number"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Contact Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="contact_number"
                                            name="contact_number"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                validationErrors.contact_number ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={data.contact_number}
                                            onChange={(e) => setData("contact_number", e.target.value)}
                                            placeholder="09xxxxxxxxx or +639xxxxxxxxx"
                                            required
                                        />
                                        {validationErrors.contact_number && (
                                            <p className="text-red-500 text-xs mt-1">{validationErrors.contact_number}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                validationErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            required
                                        />
                                        {validationErrors.email && (
                                            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                    <div className="flex items-start">
                                        <svg
                                            className="h-5 w-5 text-blue-600 mt-0.5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div>
                                            <h5 className="text-sm font-medium text-blue-800">
                                                Program Registration Information
                                            </h5>
                                            <p className="text-xs text-blue-700 mt-1">
                                                By registering for this program,
                                                you confirm that the information
                                                provided is accurate. You agree
                                                to participate in the program on
                                                the scheduled date at the
                                                specified time.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        name="terms"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        required
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        I agree to the program terms and
                                        conditions
                                    </label>
                                </div>
                            </div>
                            <div className="mt-8 flex d-flex  text-center justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(e) => {
                                        onClose();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing || isSubmitting}
                                >
                                    {processing || isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Registering...
                                        </>
                                    ) : (
                                        "Join the Program"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </CustomModal>

        {/* Registration Summary Modal */}
        <CustomModal isOpen={showSummaryModal} onClose={() => setShowSummaryModal(false)}>
            <div className="max-w-[98vw] mx-auto w-full">
                <div className="bg-white rounded-2xl shadow-2xl">
                    <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <CheckCircle2 className="h-7 w-7 text-green-600" />
                            Registration Complete!
                        </h2>
                    </div>
                    
                    <div className="px-8 py-6 max-h-[75vh] overflow-y-auto">
                        <div className="space-y-5">
                            {/* Success Message */}
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                <div className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                                    <p className="text-green-800 font-medium">
                                        You are now registered for the program!
                                    </p>
                                </div>
                            </div>

                            {/* Program Information */}
                            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                                    Program Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Program Name</p>
                                        <p className="text-gray-900">{schedule?.program_name || "Health Program"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Date</p>
                                        <p className="text-gray-900">{schedule?.date ? format(new Date(schedule.date), "MMMM dd, yyyy") : "TBD"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Time</p>
                                        <p className="text-gray-900">{schedule?.time || "TBD"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Location</p>
                                        <p className="text-gray-900">{schedule?.location || "Barangay Calumpang Health Center"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            {registrationData && (
                                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                        Your Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Full Name</p>
                                            <p className="text-gray-900">
                                                {registrationData.first_name} {registrationData.middle_name || ""} {registrationData.last_name} {registrationData.suffix || ""}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Gender</p>
                                            <p className="text-gray-900">{registrationData.sex}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                                            <p className="text-gray-900">
                                                {registrationData.birthdate ? format(new Date(registrationData.birthdate), "MMMM dd, yyyy") : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Age</p>
                                            <p className="text-gray-900">{registrationData.age} years old</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Contact Number</p>
                                            <p className="text-gray-900">{registrationData.contact_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Email</p>
                                            <p className="text-gray-900">{registrationData.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Registration Details */}
                            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    Registration Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Registration Date</p>
                                        <p className="text-gray-900">{format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Status</p>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Registered
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Registration ID</p>
                                        <p className="text-gray-900 font-mono text-sm">{registrationData?.id || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Important Notes */}
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                                <h4 className="text-lg font-bold text-yellow-900 mb-3">Important Notes</h4>
                                <ul className="text-base text-yellow-800 space-y-1">
                                    <li>• Please arrive 15 minutes before the scheduled time</li>
                                    <li>• Bring a valid ID for verification</li>
                                    <li>• You will receive program updates via email and SMS</li>
                                    <li>• Contact us if you need to reschedule or cancel</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 border-t-2 border-gray-200 bg-gray-50 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowSummaryModal(false);
                                onClose();
                                router.reload({
                                    only: ["flash"],
                                });
                            }}
                            className="px-6 py-2 text-base font-semibold border-2 hover:bg-gray-100"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={downloadRegistrationSummary}
                            className="px-6 py-2 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 border-2 border-blue-600"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Summary
                        </Button>
                    </div>
                </div>
            </div>
            </CustomModal>
        </>
    );
};

export default ProgramRegistration;
