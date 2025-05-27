import { useEffect, useState } from "react";
import { Link, usePage, Head, useForm } from "@inertiajs/react";
import LoginLayout from "@/Layouts/LoginLayout";
import { toast } from "react-toastify";
import NavLink from "@/Components/NavLink";
import {
    EnvelopeClosedIcon,
    LockClosedIcon,
    Cross2Icon,
    ArrowLeftIcon,
} from "@radix-ui/react-icons";

export default function Login2({ flash }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login.submit"), {
            onError: (e) => {
                console.log(e);
            },
        });
    };

    // Handle flash messages
    const { errors } = usePage().props;

    //   useEffect(() => {
    //     if (errors.error) {
    //       alert_toast('Error', errors.error, 'error');
    //     }
    //   }, [errors]);

    useEffect(() => {
        if (flash) {
            alert_toast(flash.title, flash.message, flash.icon);
        }
    }, [flash]);

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
                            Welcome
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to your account to continue
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
                    {/* {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 ro  unded-md">
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
                    {inertiaErrors.email && <li>{inertiaErrors.email}</li>}
                    {inertiaErrors.password && <li>{inertiaErrors.password}</li>}
                  </ul>
                </div>
              </div>
            </div>
          )} */}

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

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <svg
                                                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                                    clipRule="evenodd"
                                                />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me and Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Link className="text-sm font-medium text-black hover:text-gray-800 transition-colors">
                                    Forgot your password?
                                </Link>
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
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?
                                <NavLink
                                    href={route("register")}
                                    className="font-medium text-black hover:text-gray-800 transition-colors ml-1"
                                >
                                    Register now
                                </NavLink>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </LoginLayout>
    );
}
