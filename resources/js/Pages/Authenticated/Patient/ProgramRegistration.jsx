import React, { useState } from "react";
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
import { format } from "date-fns";
import {
    Calendar as CalendarIcon,
    Clock,
    Users,
    MapPin,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import LandingLayout from "@/Layouts/LandingLayout";

const ProgramRegistration = () => {
    const { program, isLoggedin, auth } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);
        setFormSuccess(null);

        // Get form data
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());
        
        // Prepare registration data
        const registrationData = {
            program_id: program.id,
            first_name: formValues.first_name,
            middle_name: formValues.middle_name || '',
            last_name: formValues.last_name,
            suffix: formValues.suffix || '',
            sex: formValues.sex,
            age: formValues.age,
            contact_number: formValues.contact_number,
            email: formValues.email,
        };
        
        // Send registration data to the server
        router.post('/services/vaccinations/register', registrationData, {
            onSuccess: () => {
                setFormSuccess("Registration successful! You have been registered for the program.");
                setIsSubmitting(false);
                
                // Redirect to vaccinations page after 2 seconds
                setTimeout(() => {
                    window.location.href = "/services/vaccinations";
                }, 2000);
            },
            onError: (errors) => {
                setFormError(errors.message || "Registration failed. Please try again.");
                setIsSubmitting(false);
                console.error("Registration errors:", errors);
            }
        });
    };

    return (
        <LandingLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center">Program Registration</h1>
                    
                    {formSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                            <div>
                                <h3 className="font-medium">Registration Successful</h3>
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Register for Health Program
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="font-semibold text-lg mb-2">{program?.name || 'Health Program'}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-700" />
                                            <span>{program?.date ? format(new Date(program.date), 'MMMM d, yyyy') : 'Date TBD'}</span>
                                            <input type="hidden" name="date" value={program?.date ? format(new Date(program.date), 'MMMM d, yyyy') : 'Date TBD'} />
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-gray-700" />
                                            <span>{`${program?.startTime || ''} - ${program?.endTime || ''}`}</span>
                                            <input type="hidden" name="time" value={`${program?.startTime || ''} - ${program?.endTime || ''}`} />
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-700" />
                                            <span>{program?.location || 'Location TBD'}</span>
                                            <input type="hidden" name="location" value={program?.location || 'Location TBD'} />
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2 text-gray-700" />
                                            <span>{program?.availableSlots || 0} slots available</span>
                                        </div>
                                        <input type="hidden" name="program_name" value={program?.name || 'Health Program'} />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input 
                                                type="text" 
                                                id="first_name" 
                                                name="first_name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={auth?.user?.firstname || ''}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                            <input 
                                                type="text" 
                                                id="middle_name" 
                                                name="middle_name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={auth?.user?.middlename || ''}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input 
                                                type="text" 
                                                id="last_name" 
                                                name="last_name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={auth?.user?.lastname || ''}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                                            <input 
                                                type="text" 
                                                id="suffix" 
                                                name="suffix"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={auth?.user?.suffix || ''}
                                                placeholder="Jr., Sr., III, etc."
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                                            <select 
                                                id="sex" 
                                                name="sex"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={auth?.user?.gender || 'Male'}
                                                required
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                            <input 
                                                type="number" 
                                                id="age" 
                                                name="age"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min="0"
                                                defaultValue={auth?.user?.age || ''}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                            <input 
                                                type="tel" 
                                                id="contact_number" 
                                                name="contact_number"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={auth?.user?.contact || ''}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                name="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={auth?.user?.email || ''}
                                                required
                                            />
                                        </div>
                                    </div>    
                                    
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <h5 className="text-sm font-medium text-blue-800">Program Registration Information</h5>
                                                <p className="text-xs text-blue-700 mt-1">
                                                    By registering for this program, you confirm that the information provided is accurate. You agree to participate in the program on the scheduled date at the specified time.
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
                                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                            I agree to the program terms and conditions
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.location.href = "/services/vaccinations"}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Registering...
                                            </>
                                        ) : "Register for Program"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </LandingLayout>
    );
};

export default ProgramRegistration;
