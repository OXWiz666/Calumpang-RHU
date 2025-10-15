import React, { useState } from "react";
import { Button } from "../../../../components/tempo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/tempo/components/ui/card";
import { router } from "@inertiajs/react";

interface RescheduleAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReschedule: (appointmentData: any) => void;
}

const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
    isOpen,
    onClose,
    onReschedule,
}) => {
    const [referenceNumber, setReferenceNumber] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleRescheduleLookup = async () => {
        if (!referenceNumber.trim()) {
            setErrorMessage('Please enter your reference number');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`/api/patient-lookup/${referenceNumber.trim()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            if (data.success) {
                // Store appointment data for reschedule
                localStorage.setItem('rescheduleAppointmentData', JSON.stringify(data.patient));
                
                // Close modal and navigate to appointments page with reschedule parameter
                onClose();
                router.visit('/appointments?mode=reschedule');
            } else {
                setErrorMessage(data.message || 'Reference number not found. Please check your reference number and try again.');
            }
        } catch (error) {
            console.error('Error looking up appointment:', error);
            setErrorMessage('An error occurred while looking up your appointment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setReferenceNumber("");
        setErrorMessage("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={handleClose}></div>
                
                {/* Modal Content */}
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-100">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Reschedule Appointment</h3>
                                <p className="text-sm text-gray-600 mt-1">Enter your reference number to reschedule</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-900 mb-1">How to Reschedule</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Enter your current appointment reference number</li>
                                            <li>• Only the appointment date can be changed</li>
                                            <li>• All other details will remain the same</li>
                                            <li>• You'll receive a new confirmation</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Reference Number Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reference Number *
                                </label>
                                <input
                                    type="text"
                                    value={referenceNumber}
                                    onChange={(e) => {
                                        setReferenceNumber(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    placeholder="Enter your reference number (e.g., REF-2024-001234)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                    You can find this on your appointment confirmation email or SMS.
                                </p>
                                {errorMessage && (
                                    <p className="text-sm text-red-600 mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-4 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <Button 
                            onClick={handleClose}
                            variant="outline"
                            className="px-6 py-3"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleRescheduleLookup}
                            disabled={!referenceNumber.trim() || isLoading}
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Looking up...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    Reschedule Appointment
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RescheduleAppointmentModal;
