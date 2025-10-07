import React, { useState } from "react";
import { tokenSessionManager } from "../../../../utils/tokenSession";

interface PatientData {
    firstname: string;
    middlename: string;
    lastname: string;
    suffix: string;
    sex: string;
    birthdate: string;
    age: number;
    civilStatus: string;
    nationality: string;
    religion: string;
    country: string;
    region: string;
    province: string;
    city: string;
    barangay: string;
    street: string;
    zipCode: string;
    mobileNo: string;
    emailAddress: string;
}

interface PatientVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PatientVerificationModal: React.FC<PatientVerificationModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [verificationStep, setVerificationStep] = useState(1);
    const [patientData, setPatientData] = useState<PatientData>({
        firstname: "",
        middlename: "",
        lastname: "",
        suffix: "",
        sex: "",
        birthdate: "",
        age: 0,
        civilStatus: "",
        nationality: "FILIPINO",
        religion: "",
        country: "Philippines",
        region: "",
        province: "",
        city: "",
        barangay: "",
        street: "",
        zipCode: "",
        mobileNo: "",
        emailAddress: "",
    });
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const calculateAge = (birthDate: string): number => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age >= 0 ? age : 0;
    };

    const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ type, message });
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    const handleInputChange = (field: keyof PatientData, value: string) => {
        setPatientData(prev => {
            const updatedData = {
                ...prev,
                [field]: value
            };
            
            // Auto-calculate age when birthdate changes
            if (field === 'birthdate') {
                updatedData.age = calculateAge(value);
            }
            
            return updatedData;
        });
    };

    const submitStep1 = async () => {
        setIsLoading(true);
        setErrorMessage("");
        
        // Simulate API call - replace with actual API call
        setTimeout(() => {
            if (patientData.firstname && patientData.lastname && patientData.birthdate && patientData.sex) {
                setVerificationStep(2);
                setSuccessMessage("Basic information collected successfully");
            } else {
                setErrorMessage("Please fill in all required fields (First Name, Last Name, Sex, and Birth Date)");
            }
            setIsLoading(false);
        }, 1500);
    };

    const submitStep2 = async () => {
        setIsLoading(true);
        setErrorMessage("");
        
        // Simulate API call - replace with actual API call
        setTimeout(() => {
            if (patientData.civilStatus && patientData.nationality && patientData.country && patientData.region && patientData.province && patientData.city && patientData.barangay && patientData.zipCode && patientData.mobileNo && patientData.emailAddress) {
                setSuccessMessage("Patient profile completed. Creating token session...");
                
                // Prepare patient data for token session
                const patientInfo = {
                    firstname: patientData.firstname,
                    middlename: patientData.middlename,
                    lastname: patientData.lastname,
                    suffix: patientData.suffix,
                    sex: patientData.sex,
                    birthdate: patientData.birthdate,
                    age: patientData.age,
                    email: patientData.emailAddress,
                    phone: patientData.mobileNo,
                    civilStatus: patientData.civilStatus,
                    nationality: patientData.nationality,
                    religion: patientData.religion,
                    country: patientData.country,
                    region: patientData.region,
                    province: patientData.province,
                    city: patientData.city,
                    barangay: patientData.barangay,
                    street: patientData.street,
                    zipCode: patientData.zipCode,
                    profileImage: profileImage
                };
                
                // Create token session
                const token = tokenSessionManager.createTokenSession(patientInfo);
                
                // Also store in localStorage for backward compatibility
                localStorage.setItem('patientVerificationData', JSON.stringify(patientInfo));
                
                // Close modal and redirect to appointments page
                onClose();
                window.location.href = "/appointments";
            } else {
                setErrorMessage("Please fill in all required fields");
            }
            setIsLoading(false);
        }, 1500);
    };



    const handleRefreshPhoto = () => {
        // Simulate refreshing the profile picture
        // Clear the current photo and reset to default
        setProfileImage(null);
        showNotification('success', 'Profile picture refreshed successfully!');
    };

    const handleUploadPhoto = () => {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        // Add event listener for file selection
        fileInput.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showNotification('error', 'Please select a valid image file.');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('error', 'File size must be less than 5MB.');
                    return;
                }
                
                // Process the file (you can add actual upload logic here)
                
                // Create image preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    setProfileImage(result);
                };
                reader.readAsDataURL(file);
                
                showNotification('success', `Photo uploaded successfully: ${file.name}`);
                
                // You can add actual upload logic here, such as:
                // - Upload to server
                // - Store file reference in state
            }
        });
        
        // Trigger file selection
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };


    const resetModal = () => {
        setVerificationStep(1);
        setPatientData({
            firstname: "",
            middlename: "",
            lastname: "",
            suffix: "",
            sex: "",
            birthdate: "",
            age: 0,
            civilStatus: "",
            nationality: "FILIPINO",
            religion: "",
            country: "Philippines",
            region: "",
            province: "",
            city: "",
            barangay: "",
            street: "",
            zipCode: "",
            mobileNo: "",
            emailAddress: "",
        });
        setVerificationCode("");
        setErrorMessage("");
        setSuccessMessage("");
        setProfileImage(null);
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
                    <div className={`relative bg-white rounded-2xl shadow-2xl w-full mx-auto border border-gray-100 ${verificationStep === 1 ? 'max-w-2xl' : 'max-w-6xl'}`}>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {verificationStep === 1 && "Patient Information"}
                                        {verificationStep === 2 && "Patient Profile"}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {verificationStep === 1 && "Please provide your information to continue"}
                                        {verificationStep === 2 && "Complete your patient profile to proceed to appointments"}
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
                    
                    {/* Notification inside modal */}
                    {notification && (
                        <div className="mx-8 mt-4 animate-in slide-in-from-top duration-300">
                            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-sm border-l-4 ${
                                notification.type === 'success' 
                                    ? 'bg-green-50 border-green-400 text-green-800' 
                                    : notification.type === 'error'
                                    ? 'bg-red-50 border-red-400 text-red-800'
                                    : 'bg-blue-50 border-blue-400 text-blue-800'
                            }`}>
                                <div className="flex-shrink-0">
                                    {notification.type === 'success' && (
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    )}
                                    {notification.type === 'error' && (
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    )}
                                    {notification.type === 'info' && (
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{notification.message}</p>
                                </div>
                                <button
                                    onClick={() => setNotification(null)}
                                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Modal Body */}
                    <div className="p-8">
                        {/* Step 1: Patient Information Form */}
                        {verificationStep === 1 && (
                            <div>
                                <div className="mb-6">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-700">Step 1 of 2</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Personal Information</h4>
                                    <p className="text-sm text-gray-600">
                                        Please provide your information to verify your identity and access appointment booking.
                                    </p>
                                </div>
                                
                                <form onSubmit={(e) => { e.preventDefault(); submitStep1(); }} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                            <input 
                                                type="text" 
                                                value={patientData.firstname}
                                                onChange={(e) => handleInputChange('firstname', e.target.value)}
                                                required
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                            <input 
                                                type="text" 
                                                value={patientData.middlename}
                                                onChange={(e) => handleInputChange('middlename', e.target.value)}
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                                placeholder="Enter your middle name"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                            <input 
                                                type="text" 
                                                value={patientData.lastname}
                                                onChange={(e) => handleInputChange('lastname', e.target.value)}
                                                required
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                                placeholder="Enter your last name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                                            <select 
                                                value={patientData.suffix}
                                                onChange={(e) => handleInputChange('suffix', e.target.value)}
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                            >
                                                <option value="">Select Suffix</option>
                                                <option value="Jr.">Jr.</option>
                                                <option value="Sr.">Sr.</option>
                                                <option value="II">II</option>
                                                <option value="III">III</option>
                                                <option value="IV">IV</option>
                                                <option value="V">V</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
                                        <select 
                                            value={patientData.sex}
                                            onChange={(e) => handleInputChange('sex', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                        >
                                            <option value="">Select Sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date *</label>
                                            <input 
                                                type="date" 
                                                value={patientData.birthdate}
                                                onChange={(e) => handleInputChange('birthdate', e.target.value)}
                                                required
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                            <div className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 flex items-center text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span className="font-medium">
                                                        {patientData.age > 0 ? `${patientData.age}` : 'Select birth date'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Error Message */}
                                    {errorMessage && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span className="text-red-700 text-sm font-medium">{errorMessage}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                        <button 
                                            type="button" 
                                            onClick={handleClose}
                                            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isLoading}
                                            className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 rounded-lg transition-all duration-200 flex items-center space-x-2"
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
                                                    <span>Verify Patient</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        
                        {/* Step 2: Patient Profile */}
                        {verificationStep === 2 && (
                            <div>
                                <div className="mb-8">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-700">Step 2 of 2</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Complete Patient Profile</h4>
                                    <p className="text-sm text-gray-600">
                                        Please provide additional information to complete your patient profile.
                                    </p>
                                </div>
                                
                                <form onSubmit={(e) => { e.preventDefault(); submitStep2(); }} className="space-y-8">
                                    {/* Profile Picture Section */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                                        <div className="flex items-center space-x-6">
                                            <div className="relative">
                                                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
                                                    {profileImage ? (
                                                        <img 
                                                            src={profileImage} 
                                                            alt="Profile" 
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        <svg className="w-14 h-14 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-lg font-semibold text-gray-900 mb-2">Profile Picture</h5>
                                                <p className="text-sm text-gray-600 mb-4">Upload a clear photo of yourself for identification purposes</p>
                                                <div className="flex space-x-3">
                                                    <button 
                                                        type="button" 
                                                        onClick={handleRefreshPhoto}
                                                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                        </svg>
                                                        <span className="text-sm">Refresh</span>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={handleUploadPhoto}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        </svg>
                                                        <span className="text-sm">Upload</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Information */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                            Personal Information
                                        </h6>
                                        <div className="grid grid-cols-4 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Civil Status *</label>
                                                <select 
                                                    value={patientData.civilStatus}
                                                    onChange={(e) => handleInputChange('civilStatus', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                >
                                                    <option value="">SELECT</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Widowed">Widowed</option>
                                                    <option value="Divorced">Divorced</option>
                                                    <option value="Separated">Separated</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality *</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.nationality}
                                                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-50"
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
                                                <select 
                                                    value={patientData.religion}
                                                    onChange={(e) => handleInputChange('religion', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                >
                                                    <option value="">SELECT</option>
                                                    <option value="Catholic">Catholic</option>
                                                    <option value="Protestant">Protestant</option>
                                                    <option value="Islam">Islam</option>
                                                    <option value="Buddhist">Buddhist</option>
                                                    <option value="Hindu">Hindu</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.country}
                                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-50"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                            Address Information
                                        </h6>
                                        <div className="grid grid-cols-4 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Region *</label>
                                                <select 
                                                    value={patientData.region}
                                                    onChange={(e) => handleInputChange('region', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                >
                                                    <option value="">Select Region</option>
                                                    <option value="NCR">NCR</option>
                                                    <option value="Region I">Region I</option>
                                                    <option value="Region II">Region II</option>
                                                    <option value="Region III">Region III</option>
                                                    <option value="Region IV-A">Region IV-A</option>
                                                    <option value="Region IV-B">Region IV-B</option>
                                                    <option value="Region V">Region V</option>
                                                    <option value="Region VI">Region VI</option>
                                                    <option value="Region VII">Region VII</option>
                                                    <option value="Region VIII">Region VIII</option>
                                                    <option value="Region IX">Region IX</option>
                                                    <option value="Region X">Region X</option>
                                                    <option value="Region XI">Region XI</option>
                                                    <option value="Region XII">Region XII</option>
                                                    <option value="CAR">CAR</option>
                                                    <option value="ARMM">ARMM</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Province *</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.province}
                                                    onChange={(e) => handleInputChange('province', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                    placeholder="Enter province"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.city}
                                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                    placeholder="Enter city"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Barangay *</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.barangay}
                                                    onChange={(e) => handleInputChange('barangay', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                    placeholder="Enter barangay"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                            Contact Information
                                        </h6>
                                        <div className="grid grid-cols-4 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Street</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.street}
                                                    onChange={(e) => handleInputChange('street', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                    placeholder="Enter street address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code *</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.zipCode}
                                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                    placeholder="Enter zip code"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile No. *</label>
                                                <input 
                                                    type="tel" 
                                                    value={patientData.mobileNo}
                                                    onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                    placeholder="+63999-999-9999"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                                                <input 
                                                    type="email" 
                                                    value={patientData.emailAddress}
                                                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className="flex justify-center space-x-4 pt-8">
                                        <button 
                                            type="button" 
                                            onClick={() => setVerificationStep(1)}
                                            className="px-8 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                            </svg>
                                            <span>Back</span>
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Proceed to Appointments</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                            
                        </div>
                    </div>
                </div>
            </div>
        );
    };

export default PatientVerificationModal;
