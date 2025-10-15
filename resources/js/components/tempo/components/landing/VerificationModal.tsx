import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/tempo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/tempo/components/ui/card";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
    appointmentData: any;
    verificationMethod: 'email' | 'sms';
}

const VerificationModal: React.FC<VerificationModalProps> = ({
    isOpen,
    onClose,
    onVerified,
    appointmentData,
    verificationMethod
}) => {
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [debugCode, setDebugCode] = useState(""); // For testing purposes

    // Countdown timer
    useEffect(() => {
        if (isCodeSent && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [isCodeSent, timeLeft]);

    // Send verification code when modal opens
    useEffect(() => {
        if (isOpen && !isCodeSent) {
            sendVerificationCode();
        }
    }, [isOpen]);

    const sendVerificationCode = async () => {
        // Generate a verification code locally since we don't have an appointment ID yet
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store the verification code in localStorage temporarily
        localStorage.setItem('temp_verification_code', verificationCode);
        localStorage.setItem('temp_verification_expiry', (Date.now() + 300000).toString()); // 5 minutes
        
        console.log('Generated verification code:', verificationCode);
        
        // Simulate sending email/SMS
        try {
            // For now, just show the code in console and set as debug code
            console.log(`Verification code for ${verificationMethod}: ${verificationCode}`);
            setDebugCode(verificationCode);
            setIsCodeSent(true);
            setTimeLeft(300);
            setErrorMessage("");
            
            // TODO: Implement actual email/SMS sending here
            // For email: send to appointmentData.email
            // For SMS: send to appointmentData.phone
            
        } catch (error) {
            console.error('Error generating verification code:', error);
            setErrorMessage('Failed to generate verification code. Please try again.');
        }
    };

    const handleVerify = async () => {
        if (!verificationCode.trim()) {
            setErrorMessage('Please enter the verification code');
            return;
        }

        setIsVerifying(true);
        setErrorMessage("");

        try {
            // Check against locally stored verification code
            const storedCode = localStorage.getItem('temp_verification_code');
            const storedExpiry = localStorage.getItem('temp_verification_expiry');
            
            if (!storedCode || !storedExpiry) {
                setErrorMessage('No verification code found. Please request a new one.');
                return;
            }
            
            // Check if code has expired
            if (Date.now() > parseInt(storedExpiry)) {
                setErrorMessage('Verification code has expired. Please request a new one.');
                localStorage.removeItem('temp_verification_code');
                localStorage.removeItem('temp_verification_expiry');
                return;
            }
            
            // Check if codes match
            if (verificationCode === storedCode) {
                // Verification successful - clear the stored code
                localStorage.removeItem('temp_verification_code');
                localStorage.removeItem('temp_verification_expiry');
                onVerified();
            } else {
                setErrorMessage('Invalid verification code. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            setErrorMessage('Failed to verify code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        setErrorMessage("");
        await sendVerificationCode();
        setIsResending(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                    <h3 className="text-xl font-bold text-gray-900">Verify Your Appointment</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                        Please verify your appointment using the code below
                                </p>
                            </div>
                        </div>
                        <button 
                                onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                                            </div>
                                        </div>

                    {/* Body */}
                    <div className="px-8 py-6">
                        <div className="space-y-6">
                            {/* Appointment Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Appointment Details</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-medium">Date:</span> {appointmentData.date ? new Date(appointmentData.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'N/A'}</p>
                                    <p><span className="font-medium">Time:</span> {appointmentData.time || 'N/A'}</p>
                                    <p><span className="font-medium">Service:</span> {appointmentData.servicename || 'N/A'}</p>
                                    <p><span className="font-medium">Patient:</span> {appointmentData.firstname} {appointmentData.lastname}</p>
                                </div>
                            </div>

                            {/* Verification Code Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter Verification Code
                                        </label>
                                        <input 
                                            type="text" 
                                            value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                                            maxLength={6}
                                        />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter the verification code shown below
                                </p>
                                
                                {/* Verification Code Display */}
                                {debugCode && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm font-medium text-blue-800">Your Verification Code:</p>
                                        <p className="text-lg font-mono text-blue-900">{debugCode}</p>
                                        <p className="text-xs text-blue-700 mt-1">Enter this code to verify your appointment</p>
                                    </div>
                                )}
                            </div>

                            {/* Timer and Resend */}
                            {isCodeSent && (
                                <div className="text-center">
                                    {timeLeft > 0 ? (
                                        <p className="text-sm text-gray-600">
                                            Code expires in <span className="font-semibold text-orange-600">{formatTime(timeLeft)}</span>
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-sm text-red-600">Verification code has expired</p>
                                            <Button
                                            onClick={handleResendCode}
                                                disabled={isResending}
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                {isResending ? 'Sending...' : 'Resend Code'}
                                            </Button>
                                </div>
                            )}
                                </div>
                            )}

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-medium">{errorMessage}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-3">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="px-6 py-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={!verificationCode.trim() || isVerifying || timeLeft === 0}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifying ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                    Verifying...
                                        </>
                                    ) : (
                                'Verify Appointment'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;