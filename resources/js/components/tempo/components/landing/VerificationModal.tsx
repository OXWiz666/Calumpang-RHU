import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/tempo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/tempo/components/ui/card";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: (appointmentData?: any) => void;
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
        const [phoneNumber, setPhoneNumber] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0); // 2 minutes cooldown
    const [isSending, setIsSending] = useState(false); // Prevent multiple sends
    const [patientName, setPatientName] = useState("N/A");
    const [debugCode, setDebugCode] = useState(""); // For development mode

    // Helper function to safely format values for display
    const formatValue = (value: any): string => {
        if (value === null || value === undefined) {
            return 'N/A';
        }
        if (value instanceof Date) {
            return value.toLocaleDateString();
        }
        return String(value);
    };

    // Helper function to get patient name from appointment data
    // TODO: This is getting messy, should refactor this logic
    const getPatientName = (): string => {
        if (!appointmentData) return 'N/A';
        
        // Try different possible fields for patient name
        let name = appointmentData.patient_name || 
                   appointmentData.name || 
                   appointmentData.full_name;
        
        // If no direct name field, try combining first and last name
        if (!name) {
            const firstName = appointmentData.first_name || 
                             appointmentData.firstName || 
                             appointmentData.firstname || 
                             '';
            const lastName = appointmentData.last_name || 
                            appointmentData.lastName || 
                            appointmentData.Lastname || 
                            appointmentData.lastname || 
                            '';
            
            if (firstName || lastName) {
                name = `${firstName} ${lastName}`.trim();
            }
        }
        
        return name && name.trim() !== '' ? name.trim() : 'N/A';
    };

    // Countdown timer
    useEffect(() => {
        if (isCodeSent && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [isCodeSent, timeLeft]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Update patient name when appointment data changes
    useEffect(() => {
        if (appointmentData) {
            const extractedName = getPatientName();
            setPatientName(extractedName);
        }
    }, [appointmentData]);

    // Generate verification code when modal opens
    useEffect(() => {
        if (isOpen && !isCodeSent) {
            // Extract phone number from appointment data - try multiple possible fields
            let phone = appointmentData?.phone ||
                       appointmentData?.mobileNo ||
                       appointmentData?.contactno ||
                       (appointmentData?.mobileCountryCode && appointmentData?.mobileNo ?
                        appointmentData.mobileCountryCode + appointmentData.mobileNo : null);

            // Ensure phone is a string and clean it up
            if (phone) {
                phone = String(phone).trim();
            }

            console.log('VerificationModal - appointmentData:', appointmentData);
            console.log('VerificationModal - extracted phone:', phone, 'type:', typeof phone);

            if (phone && phone !== '') {
                setPhoneNumber(phone);
                generateVerificationCode();
            } else {
                setErrorMessage('Phone number not found in appointment data. Please check your appointment details.');
            }
        }
    }, [isOpen]);

    const generateVerificationCode = async () => {
        if (isSending) {
            setErrorMessage('Please wait, generating verification code...');
            return;
        }

        setIsSending(true);
        setErrorMessage("");

        // Generate development OTP code only in development mode
        const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
        const devOTP = isDevelopment ? Math.floor(100000 + Math.random() * 900000).toString() : null;
        if (isDevelopment && devOTP) {
            setDebugCode(devOTP);
        }

        try {
            // Send OTP via SMS API
            const response = await fetch('/api/sms/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    message: `Your SEHI appointment verification code is :otp. Valid for 5 minutes. Do not share this code with anyone.`
                })
            });

            const data = await response.json();

            if (data.success) {
                setIsCodeSent(true);
                setTimeLeft(300); // 5 minutes
                setResendCooldown(120); // 2 minutes cooldown
                setErrorMessage("");
                
                // Update OTP code with the one from API if available
                const otpCode = data.data?.otp_code || data.data?.otp || devOTP;
                setDebugCode(otpCode);

            } else {
                // Handle SMS failure based on environment
                if (isDevelopment) {
                    // In development, show development mode and allow verification
                    setIsCodeSent(true);
                    setTimeLeft(300); // 5 minutes
                    setResendCooldown(120); // 2 minutes cooldown
                    setErrorMessage("SMS sending failed, but you can use the development code below for testing.");
                    console.warn('SMS sending failed, using development mode:', data.message);
                } else {
                    // In production, show error without development mode
                    setErrorMessage("SMS sending failed. Please try again or contact support.");
                    console.error('SMS sending failed:', data.message);
                }
            }

        } catch (error: any) {
            console.error('Error sending OTP:', error);
            // Handle API failure based on environment
            if (isDevelopment) {
                // In development, show development mode and allow verification
                setIsCodeSent(true);
                setTimeLeft(300); // 5 minutes
                setResendCooldown(120); // 2 minutes cooldown
                setErrorMessage("SMS sending failed, but you can use the development code below for testing.");
            } else {
                // In production, show error without development mode
                setErrorMessage("SMS sending failed. Please try again or contact support.");
            }
        } finally {
            setIsSending(false);
        }
    };

    const handleVerify = async () => {
        if (!verificationCode.trim()) {
            setErrorMessage('Please enter the verification code');
            return;
        }

        if (!phoneNumber) {
            setErrorMessage('Phone number not found. Please try again.');
            return;
        }

        setIsVerifying(true);
        setErrorMessage("");

        try {
            // First try regular OTP verification
            const response = await fetch('/api/sms/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp_code: verificationCode
                })
            });

            const data = await response.json();

            if (data.success) {
                // Verification successful - pass appointment data to parent for database creation and email sending
                console.log('OTP verified successfully, passing data to parent for appointment creation');
                
                // Pass the complete appointment data back to parent
                const completeAppointmentData = {
                    ...appointmentData,
                    // Ensure all required fields are present
                    firstname: appointmentData?.firstname || appointmentData?.first_name || '',
                    lastname: appointmentData?.lastname || appointmentData?.last_name || '',
                    email: appointmentData?.email || '',
                    phone: phoneNumber,
                    date: appointmentData?.date || '',
                    time: appointmentData?.time || '',
                    service_name: appointmentData?.service_name || appointmentData?.servicename || '',
                    subservice_name: appointmentData?.subservice_name || appointmentData?.subservicename || '',
                    date_of_birth: appointmentData?.date_of_birth || appointmentData?.birth || '',
                    gender: appointmentData?.gender || ''
                };
                
                onVerified(completeAppointmentData);
            } else {
                // If regular verification fails, check if it's the development code (only in development)
                const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
                if (isDevelopment && debugCode && verificationCode === debugCode) {
                    console.log('Development mode verification successful');
                    
                    // Pass the complete appointment data back to parent
                    const completeAppointmentData = {
                        ...appointmentData,
                        // Ensure all required fields are present
                        firstname: appointmentData?.firstname || appointmentData?.first_name || '',
                        lastname: appointmentData?.lastname || appointmentData?.last_name || '',
                        email: appointmentData?.email || '',
                        phone: phoneNumber,
                        date: appointmentData?.date || '',
                        time: appointmentData?.time || '',
                        service_name: appointmentData?.service_name || appointmentData?.servicename || '',
                        subservice_name: appointmentData?.subservice_name || appointmentData?.subservicename || '',
                        date_of_birth: appointmentData?.date_of_birth || appointmentData?.birth || '',
                        gender: appointmentData?.gender || ''
                    };
                    
                    onVerified(completeAppointmentData);
                } else {
                    setErrorMessage(data.message || 'Invalid verification code. Please try again.');
                }
            }
        } catch (error: any) {
            console.error('Error verifying code:', error);
            
            // If API call fails, check if it's the development code (only in development)
            const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
            if (isDevelopment && debugCode && verificationCode === debugCode) {
                console.log('Development mode verification successful (API failed)');
                
                // Pass the complete appointment data back to parent
                const completeAppointmentData = {
                    ...appointmentData,
                    // Ensure all required fields are present
                    firstname: appointmentData?.firstname || appointmentData?.first_name || '',
                    lastname: appointmentData?.lastname || appointmentData?.last_name || '',
                    email: appointmentData?.email || '',
                    phone: phoneNumber,
                    date: appointmentData?.date || '',
                    time: appointmentData?.time || '',
                    service_name: appointmentData?.service_name || appointmentData?.servicename || '',
                    subservice_name: appointmentData?.subservice_name || appointmentData?.subservicename || '',
                    date_of_birth: appointmentData?.date_of_birth || appointmentData?.birth || '',
                    gender: appointmentData?.gender || ''
                };
                
                onVerified(completeAppointmentData);
            } else {
                setErrorMessage('Failed to verify code. Please try again.');
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) {
            setErrorMessage(`Please wait ${Math.ceil(resendCooldown / 60)} minutes before requesting another code.`);
            return;
        }

        if (isSending) {
            setErrorMessage('Please wait, generating verification code...');
            return;
        }

        setIsResending(true);
        setErrorMessage("");
        setVerificationCode(""); // Clear the input field
        setTimeLeft(300); // Reset timer to 5 minutes
        
        try {
            await generateVerificationCode();
        } catch (error) {
            setErrorMessage('Failed to generate verification code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <Card className="w-[500px] max-w-lg max-h-[90vh] shadow-lg rounded-lg flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
                    <CardTitle className="text-xl font-semibold flex items-center">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Verify Your Appointment
                    </CardTitle>
                    <Button variant="ghost" onClick={onClose} className="p-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto flex-1">
                    <p className="text-sm text-gray-600 text-center">
                        Please verify your appointment using the verification code below.
                    </p>

                    {/* Development Mode Notice - Compact */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-yellow-800">Development Mode</p>
                                <p className="text-xs text-yellow-700">OTP code will be displayed below for testing.</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details - Compact */}
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Appointment Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><span className="text-gray-600">Date:</span> <span className="font-medium">{formatValue(appointmentData?.date)}</span></div>
                            <div><span className="text-gray-600">Time:</span> <span className="font-medium">{formatValue(appointmentData?.time)}</span></div>
                            <div><span className="text-gray-600">Service:</span> <span className="font-medium">{formatValue(appointmentData?.service)}</span></div>
                            <div><span className="text-gray-600">Patient:</span> <span className="font-medium">{patientName}</span></div>
                        </div>
                    </div>

                    {/* Development Mode - Show OTP Code */}
                    {debugCode && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-700 font-medium mb-2">Development Code:</p>
                            <p className="text-lg font-mono text-yellow-900 bg-white p-2 rounded border border-yellow-300 text-center">
                                {debugCode}
                            </p>
                        </div>
                    )}

                    {/* SMS Sent Successfully Notice */}
                    {isCodeSent && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <p className="text-sm font-medium text-green-800">SMS Sent Successfully</p>
                            </div>
                            <p className="text-xs text-green-700 mt-1">
                                Verification code sent to your phone. Check your SMS messages.
                            </p>
                        </div>
                    )}

                    {/* Verification Input */}
                    <div className="space-y-3">
                        <div className="text-center">
                            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Verification Code
                            </label>
                            <input
                                id="verificationCode"
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg text-center tracking-widest font-mono"
                                maxLength={6}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter the verification code sent to your phone
                            </p>
                        </div>
                        
                        {/* Generate Code Button - Show if no code generated yet */}
                        {!isCodeSent && (
                            <div className="text-center">
                                <Button
                                    onClick={generateVerificationCode}
                                    disabled={isSending || isResending}
                                    variant="outline"
                                    size="default"
                                    className="px-6 py-2 text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSending || isResending ? 'Sending SMS...' : 'Send Verification Code'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Timer and Resend */}
                    {isCodeSent && (
                        <div className="text-center space-y-2">
                            {timeLeft > 0 ? (
                                <div className="space-y-2">
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                                        <p className="text-sm text-gray-700">
                                            Code expires in <span className="font-bold text-orange-600">{formatTime(timeLeft)}</span>
                                        </p>
                                        {resendCooldown > 0 && (
                                            <p className="text-xs text-red-600 mt-1">
                                                Resend in {Math.ceil(resendCooldown / 60)}m {resendCooldown % 60}s
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={handleResendCode}
                                        disabled={isResending || resendCooldown > 0 || isSending}
                                        variant="outline"
                                        size="sm"
                                        className="px-4 py-2 text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResending || isSending ? 'Sending...' : 
                                         resendCooldown > 0 ? `Wait ${Math.ceil(resendCooldown / 60)}m` : 
                                         'Send New Code'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                                        <p className="text-sm font-medium text-red-800">Code expired</p>
                                    </div>
                                    <Button
                                        onClick={handleResendCode}
                                        disabled={isResending || resendCooldown > 0 || isSending}
                                        variant="outline"
                                        size="sm"
                                        className="px-4 py-2 text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResending || isSending ? 'Sending...' : 
                                         resendCooldown > 0 ? `Wait ${Math.ceil(resendCooldown / 60)}m` : 
                                         'Send New Code'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-3 mt-4">
                        <Button 
                            variant="outline" 
                            onClick={onClose} 
                            disabled={isVerifying}
                            size="sm"
                            className="px-4 py-2"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleVerify} 
                            disabled={isVerifying || !verificationCode.trim()}
                            size="sm"
                            className="px-4 py-2"
                        >
                            {isVerifying ? 'Verifying...' : 'Verify'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerificationModal;