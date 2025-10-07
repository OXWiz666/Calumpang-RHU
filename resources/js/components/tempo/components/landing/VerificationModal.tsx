import React, { useState, useEffect } from "react";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: () => void;
    patientData: {
        emailAddress: string;
        mobileNo: string;
    };
}

const VerificationModal: React.FC<VerificationModalProps> = ({
    isOpen,
    onClose,
    onVerify,
    patientData,
}) => {
    const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms' | null>(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Send verification code
    const sendVerificationCode = async (method: 'email' | 'sms') => {
        setIsSendingCode(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await fetch('/api/verification/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    method: method,
                    email: method === 'email' ? patientData.emailAddress : undefined,
                    phone: method === 'sms' ? patientData.mobileNo : undefined,
                }),
            });

            const data = await response.json();
            console.log('Send code response:', data);

            if (data.success) {
                setSuccessMessage(data.message);
                setCodeSent(true);
                setResendCooldown(60); // 60 seconds cooldown
                startResendCooldown();
                
                // For development: Show the code in console and alert
                if (data.debug_code) {
                    console.log('🔐 VERIFICATION CODE:', data.debug_code);
                    alert(`🔐 VERIFICATION CODE: ${data.debug_code}\n\n(This is for development testing. In production, this code would be sent via SMS.)`);
                }
            } else {
                setErrorMessage(data.message || 'Failed to send verification code');
            }
        } catch (error) {
            setErrorMessage('Network error. Please try again.');
        } finally {
            setIsSendingCode(false);
        }
    };

    // Verify the code
    const handleVerify = async () => {
        if (!verificationMethod || !verificationCode || verificationCode.length !== 6) {
            setErrorMessage("Please enter a valid 6-digit verification code");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch('/api/verification/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    method: verificationMethod,
                    email: verificationMethod === 'email' ? patientData.emailAddress : undefined,
                    phone: verificationMethod === 'sms' ? patientData.mobileNo : undefined,
                    code: verificationCode,
                }),
            });

            const data = await response.json();
            console.log('Verify code response:', data);

            if (data.success) {
                setSuccessMessage("Verification successful!");
                setTimeout(() => {
                    onVerify();
                }, 1000);
            } else {
                setErrorMessage(data.message || 'Invalid verification code');
            }
        } catch (error) {
            setErrorMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle resend code
    const handleResendCode = async () => {
        if (verificationMethod && resendCooldown === 0) {
            await sendVerificationCode(verificationMethod);
        }
    };

    // Resend cooldown timer
    const startResendCooldown = () => {
        const timer = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Auto-send code when method is selected
    useEffect(() => {
        if (verificationMethod && !codeSent) {
            sendVerificationCode(verificationMethod);
        }
    }, [verificationMethod]);

    const resetModal = () => {
        setVerificationMethod(null);
        setVerificationCode("");
        setErrorMessage("");
        setSuccessMessage("");
        setCodeSent(false);
        setResendCooldown(0);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={handleClose}></div>
            
            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto border border-gray-100">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Verify Your Identity</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    We'll send a verification code to confirm your identity before booking
                                </p>
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
                    <div className="p-8">
                        <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-8">
                            {/* Verification Method Selection */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                                <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                    Choose Verification Method
                                </h6>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setVerificationMethod('email')}
                                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                            verificationMethod === 'email' 
                                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                verificationMethod === 'email' ? 'bg-blue-500' : 'bg-gray-100'
                                            }`}>
                                                <svg className={`w-5 h-5 ${verificationMethod === 'email' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900">Email Verification</div>
                                                <div className="text-sm text-gray-600">{patientData.emailAddress}</div>
                                            </div>
                                        </div>
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setVerificationMethod('sms')}
                                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                            verificationMethod === 'sms' 
                                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                verificationMethod === 'sms' ? 'bg-blue-500' : 'bg-gray-100'
                                            }`}>
                                                <svg className={`w-5 h-5 ${verificationMethod === 'sms' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900">SMS Verification</div>
                                                <div className="text-sm text-gray-600">{patientData.mobileNo}</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Verification Code Input */}
                            {verificationMethod && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Enter Verification Code
                                    </h6>
                                    <div className="max-w-md mx-auto">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Verification Code *
                                        </label>
                                        <input 
                                            type="text" 
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            required
                                            className="w-full px-4 py-4 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm tracking-widest"
                                            placeholder="000000"
                                            maxLength={6}
                                        />
                                        <p className="text-sm text-gray-600 mt-2 text-center">
                                            {isSendingCode 
                                                ? `Sending code to your ${verificationMethod === 'email' ? 'email' : 'mobile number'}...`
                                                : `We've sent a 6-digit code to your ${verificationMethod === 'email' ? 'email' : 'mobile number'}`
                                            }
                                        </p>
                                        <button 
                                            type="button"
                                            onClick={handleResendCode}
                                            disabled={resendCooldown > 0 || isSendingCode}
                                            className={`text-sm font-medium mt-2 mx-auto block transition-colors ${
                                                resendCooldown > 0 || isSendingCode
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-blue-600 hover:text-blue-700'
                                            }`}
                                        >
                                            {isSendingCode 
                                                ? 'Sending...' 
                                                : resendCooldown > 0 
                                                    ? `Resend in ${resendCooldown}s` 
                                                    : 'Resend Code'
                                            }
                                        </button>
                                    </div>
                                </div>
                            )}
                        
                            {/* Success Message */}
                            {successMessage && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className="text-green-700 text-sm font-medium">{successMessage}</span>
                                </div>
                            )}

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className="text-red-700 text-sm font-medium">{errorMessage}</span>
                                </div>
                            )}
                        
                            <div className="flex justify-center space-x-4 pt-8">
                                <button 
                                    type="button" 
                                    onClick={handleClose}
                                    className="px-8 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    <span>Cancel</span>
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isLoading || !verificationMethod || !verificationCode}
                                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Verifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Complete Verification</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
