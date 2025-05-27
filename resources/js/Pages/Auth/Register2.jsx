import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import LoginLayout from "@/Layouts/LoginLayout";
import NavLink from "@/Components/NavLink";
import { Button } from "@/components/tempo/components/ui/button";
import { Calendar } from "@/components/tempo/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/tempo/components/ui/popover";
import { cn } from "@/components/tempo/lib/utils"; //
import { CalendarIcon, Clock } from "lucide-react";
export default function Register({ roles, questions, errors }) {
    const { data, setData, post, processing } = useForm({
        first_name: "",
        middlename: "",
        last_name: "",
        suffix: "",
        contactNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: "",
        gender: "",
        birth: "",
        isAdmin: "false",
        address: "",
    });

    const [showPositionDropdown, setShowPositionDropdown] = useState(false);
    const [showSecurityDropdown, setShowSecurityDropdown] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("register.submit"));
    };

    return (
        <LoginLayout>
            <Head title="Register" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                    {/* Logo or Brand */}
                    <div className="text-center">
                        <img
                            className="mx-auto h-16 w-auto"
                            src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                            alt="Logo"
                        />
                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join our healthcare community
                        </p>
                    </div>

                    {/* Display validation errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <ul className="text-sm text-red-600">
                                        {Object.entries(errors).map(
                                            ([key, error]) => (
                                                <li key={key}>{error}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        placeholder="ex. Juan"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Middle Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="middlename"
                                        name="middlename"
                                        placeholder="ex. Mezuko"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.middlename}
                                        onChange={(e) =>
                                            setData(
                                                "middlename",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        placeholder="ex. Dela Cruz"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Suffix */}
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Suffix
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="suffix"
                                        name="suffix"
                                        placeholder="ex. Jr."
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.suffix}
                                        onChange={(e) =>
                                            setData("suffix", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label
                                    htmlFor="contactNumber"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Contact Number
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="contactNumber"
                                        name="contactNumber"
                                        placeholder="09123456789"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.contactNumber}
                                        onChange={(e) =>
                                            setData(
                                                "contactNumber",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        placeholder="Enter your complete address"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="juan.delacruz@example.com"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Birth Date
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="date" // Changed to 'date' for birthdate
                                        id="birthdate"
                                        name="birthdate"
                                        placeholder="YYYY-MM-DD"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.birth}
                                        onChange={(e) =>
                                            setData("birth", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Sex
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <select
                                        id="gender"
                                        name="gender"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                                        value={data.gender}
                                        onChange={(e) =>
                                            setData("gender", e.target.value)
                                        }
                                    >
                                        <option value="" disabled hidden>
                                            Select
                                        </option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                    {/* Dropdown arrow icon */}
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="********"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="********"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.confirmPassword}
                                        onChange={(e) =>
                                            setData(
                                                "confirmPassword",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Security Question Dropdown */}
                            <div className="relative">
                                <label
                                    htmlFor="securityQuestion"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Security Question
                                </label>
                                <div className="mt-1 relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowSecurityDropdown(
                                                !showSecurityDropdown
                                            )
                                        }
                                        className={`relative w-full bg-gray-50 pl-10 pr-10 py-3 text-left cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100 ${
                                            showSecurityDropdown
                                                ? "ring-2 ring-black"
                                                : ""
                                        }`}
                                    >
                                        <span className="block truncate">
                                            {selectedQuestion ||
                                                "Select a security question"}
                                        </span>
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <svg
                                                className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                                                    showSecurityDropdown
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    </button>

                                    {showSecurityDropdown && (
                                        <div
                                            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <select
                                                id="securityQuestion"
                                                name="securityQuestion"
                                                className="sr-only"
                                                value={data.securityQuestion}
                                                onChange={(e) =>
                                                    setData(
                                                        "securityQuestion",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select a security question
                                                </option>
                                                {questions.map((question) => (
                                                    <option
                                                        key={question.id}
                                                        value={question.id}
                                                    >
                                                        {question.question}
                                                    </option>
                                                ))}
                                            </select>
                                            {questions.map((question) => (
                                                <button
                                                    type="button"
                                                    key={question.id}
                                                    onClick={() => {
                                                        setSelectedQuestion(
                                                            question.question
                                                        );
                                                        setData(
                                                            "securityQuestion",
                                                            question.id
                                                        );
                                                        setShowSecurityDropdown(
                                                            false
                                                        );
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer flex items-center space-x-2 ${
                                                        selectedQuestion ===
                                                        question.question
                                                            ? "bg-gray-50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="flex-1">
                                                        {question.question}
                                                    </span>
                                                    {selectedQuestion ===
                                                        question.question && (
                                                        <svg
                                                            className="h-4 w-4 text-black"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Security Answer */}
                            <div>
                                <label
                                    htmlFor="securityAnswer"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Security Answer
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="securityAnswer"
                                        name="securityAnswer"
                                        placeholder="Your answer"
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={data.securityAnswer}
                                        onChange={(e) =>
                                            setData(
                                                "securityAnswer",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg
                                        className="h-5 w-5 text-gray-400 group-hover:text-gray-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                {processing ? "Processing..." : "Register"}
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?
                                <Link
                                    href={route("login")}
                                    className="font-medium text-black hover:text-gray-800 transition-colors ml-1"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </LoginLayout>
    );
}
