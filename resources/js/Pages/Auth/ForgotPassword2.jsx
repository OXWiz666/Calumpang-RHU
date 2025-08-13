import { useEffect, useState } from "react";
import { Link, usePage, Head, useForm, router } from "@inertiajs/react";
import LoginLayout from "@/Layouts/LoginLayout";
import { toast } from "react-toastify";
import NavLink from "@/Components/NavLink";
import {
    EnvelopeClosedIcon,
    LockClosedIcon,
    Cross2Icon,
    ArrowLeftIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import { data } from "autoprefixer";
// import { data, data } from "autoprefixer";

export default function Login2({ flash }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const [foundUser, setFoundUser] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route("search.email"), {
            onFinish: () => {
                router.reload({
                    only: ["flash"],
                });
            },
        });
    };

    useEffect(() => {
        if (foundUser) {
            alert("user found");
        }
    }, [foundUser]);

    // Handle flash messages
    //const { errors } = usePage().props;

    return (
        <LoginLayout>
            <Head title="Login" />
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 relative">
                {/* Back to Home Button */}
                <div className="absolute top-4 left-4">
                    <NavLink
                        href={route("home")}
                        className="inline-flex items-center px-8 py-3 rounded-lg bg-black text-white shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800 border border-gray-700 group animate-fade-in relative overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-50 rounded-lg"></span>
                        <span className="relative flex items-center justify-center">
                            <ArrowLeftIcon className="h-6 w-6 mr-2 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-white" />
                            <span className="relative text-base font-medium transition-colors duration-300 group-hover:text-white">
                                Back to Home
                            </span>
                        </span>
                    </NavLink>
                </div>

                <div className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-2xl shadow-xl relative">
                    {/* Logo or Brand */}
                    <div className="text-center">
                        <img
                            className="mx-auto h-16 w-auto"
                            src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                            alt="Logo"
                        />
                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                            Forgot Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Find your account
                        </p>
                    </div>

                    {/* Display validation errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Cross2Icon className="h-5 w-5 text-red-400" />
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

                    {/* Login Form */}
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <EnvelopeClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                                    processing
                                        ? "opacity-75 cursor-not-allowed"
                                        : ""
                                }`}
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
                                {processing ? (
                                    <span className="flex items-center">
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
                                        Searching...
                                    </span>
                                ) : (
                                    "Forgot Password"
                                )}
                            </button>
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?
                                <NavLink
                                    href={route("login")}
                                    className="font-medium text-black hover:text-gray-800 transition-colors ml-1"
                                >
                                    Login here
                                </NavLink>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </LoginLayout>
    );
}
