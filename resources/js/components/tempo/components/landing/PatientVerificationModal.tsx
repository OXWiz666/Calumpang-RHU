import React, { useState, useEffect } from "react";
import { tokenSessionManager } from "../../../../utils/tokenSession";
// @ts-ignore
import PhilippinesAddressLookup from "../../../PhilippinesAddressLookup";

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
    religionOther?: string;
    country: string;
    region: string;
    province: string;
    city: string;
    barangay: string;
    street: string;
    zipCode: string;
    mobileNo: string;
    emailAddress: string;
    // Address ID fields for yajra/laravel-address
    region_id?: number | null;
    province_id?: number | null;
    city_id?: number | null;
    barangay_id?: number | null;
    // Mobile number with country code
    mobileCountryCode: string;
}

interface PatientVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToSelection?: () => void;
    showBackButton?: boolean;
}

const PatientVerificationModal: React.FC<PatientVerificationModalProps> = ({
    isOpen,
    onClose,
    onBackToSelection,
    showBackButton = false,
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
        religionOther: "",
        country: "Philippines",
        region: "",
        province: "",
        city: "",
        barangay: "",
        street: "",
        zipCode: "",
        mobileNo: "",
        emailAddress: "",
        // Address ID fields for yajra/laravel-address
        region_id: null,
        province_id: null,
        city_id: null,
        barangay_id: null,
        // Mobile number with country code
        mobileCountryCode: "+63",
    });
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof PatientData, string>>>({});
    const [profileImageError, setProfileImageError] = useState<string>("");
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    // Cleanup camera stream on component unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    // Country codes for mobile numbers with flag icons
    const countryCodes = [
        { code: "+63", country: "Philippines", flag: "🇵🇭" },
        { code: "+1", country: "United States", flag: "🇺🇸" },
        { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
        { code: "+86", country: "China", flag: "🇨🇳" },
        { code: "+81", country: "Japan", flag: "🇯🇵" },
        { code: "+82", country: "South Korea", flag: "🇰🇷" },
        { code: "+65", country: "Singapore", flag: "🇸🇬" },
        { code: "+60", country: "Malaysia", flag: "🇲🇾" },
        { code: "+66", country: "Thailand", flag: "🇹🇭" },
        { code: "+84", country: "Vietnam", flag: "🇻🇳" },
        { code: "+62", country: "Indonesia", flag: "🇮🇩" },
        { code: "+61", country: "Australia", flag: "🇦🇺" },
        { code: "+49", country: "Germany", flag: "🇩🇪" },
        { code: "+33", country: "France", flag: "🇫🇷" },
        { code: "+39", country: "Italy", flag: "🇮🇹" },
        { code: "+34", country: "Spain", flag: "🇪🇸" },
        { code: "+7", country: "Russia", flag: "🇷🇺" },
        { code: "+91", country: "India", flag: "🇮🇳" },
        { code: "+55", country: "Brazil", flag: "🇧🇷" },
        { code: "+52", country: "Mexico", flag: "🇲🇽" },
        { code: "+1", country: "Canada", flag: "🇨🇦" },
        { code: "+971", country: "UAE", flag: "🇦🇪" },
        { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
        { code: "+974", country: "Qatar", flag: "🇶🇦" },
        { code: "+965", country: "Kuwait", flag: "🇰🇼" },
        { code: "+973", country: "Bahrain", flag: "🇧🇭" },
        { code: "+968", country: "Oman", flag: "🇴🇲" },
        { code: "+20", country: "Egypt", flag: "🇪🇬" },
        { code: "+27", country: "South Africa", flag: "🇿🇦" },
        { code: "+234", country: "Nigeria", flag: "🇳🇬" },
        { code: "+254", country: "Kenya", flag: "🇰🇪" },
        { code: "+233", country: "Ghana", flag: "🇬🇭" },
        { code: "+212", country: "Morocco", flag: "🇲🇦" },
        { code: "+213", country: "Algeria", flag: "🇩🇿" },
        { code: "+216", country: "Tunisia", flag: "🇹🇳" },
        { code: "+218", country: "Libya", flag: "🇱🇾" },
        { code: "+220", country: "Gambia", flag: "🇬🇲" },
        { code: "+221", country: "Senegal", flag: "🇸🇳" },
        { code: "+222", country: "Mauritania", flag: "🇲🇷" },
        { code: "+223", country: "Mali", flag: "🇲🇱" },
        { code: "+224", country: "Guinea", flag: "🇬🇳" },
        { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
        { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
        { code: "+227", country: "Niger", flag: "🇳🇪" },
        { code: "+228", country: "Togo", flag: "🇹🇬" },
        { code: "+229", country: "Benin", flag: "🇧🇯" },
        { code: "+230", country: "Mauritius", flag: "🇲🇺" },
        { code: "+231", country: "Liberia", flag: "🇱🇷" },
        { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
        { code: "+235", country: "Chad", flag: "🇹🇩" },
        { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
        { code: "+237", country: "Cameroon", flag: "🇨🇲" },
        { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
        { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
        { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
        { code: "+241", country: "Gabon", flag: "🇬🇦" },
        { code: "+242", country: "Republic of the Congo", flag: "🇨🇬" },
        { code: "+243", country: "Democratic Republic of the Congo", flag: "🇨🇩" },
        { code: "+244", country: "Angola", flag: "🇦🇴" },
        { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
        { code: "+246", country: "British Indian Ocean Territory", flag: "🇮🇴" },
        { code: "+248", country: "Seychelles", flag: "🇸🇨" },
        { code: "+249", country: "Sudan", flag: "🇸🇩" },
        { code: "+250", country: "Rwanda", flag: "🇷🇼" },
        { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
        { code: "+252", country: "Somalia", flag: "🇸🇴" },
        { code: "+253", country: "Djibouti", flag: "🇩🇯" },
        { code: "+255", country: "Tanzania", flag: "🇹🇿" },
        { code: "+256", country: "Uganda", flag: "🇺🇬" },
        { code: "+257", country: "Burundi", flag: "🇧🇮" },
        { code: "+258", country: "Mozambique", flag: "🇲🇿" },
        { code: "+260", country: "Zambia", flag: "🇿🇲" },
        { code: "+261", country: "Madagascar", flag: "🇲🇬" },
        { code: "+262", country: "Réunion", flag: "🇷🇪" },
        { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
        { code: "+264", country: "Namibia", flag: "🇳🇦" },
        { code: "+265", country: "Malawi", flag: "🇲🇼" },
        { code: "+266", country: "Lesotho", flag: "🇱🇸" },
        { code: "+267", country: "Botswana", flag: "🇧🇼" },
        { code: "+268", country: "Swaziland", flag: "🇸🇿" },
        { code: "+269", country: "Comoros", flag: "🇰🇲" },
        { code: "+290", country: "Saint Helena", flag: "🇸🇭" },
        { code: "+291", country: "Eritrea", flag: "🇪🇷" },
        { code: "+297", country: "Aruba", flag: "🇦🇼" },
        { code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
        { code: "+299", country: "Greenland", flag: "🇬🇱" },
        { code: "+350", country: "Gibraltar", flag: "🇬🇮" },
        { code: "+351", country: "Portugal", flag: "🇵🇹" },
        { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
        { code: "+353", country: "Ireland", flag: "🇮🇪" },
        { code: "+354", country: "Iceland", flag: "🇮🇸" },
        { code: "+355", country: "Albania", flag: "🇦🇱" },
        { code: "+356", country: "Malta", flag: "🇲🇹" },
        { code: "+357", country: "Cyprus", flag: "🇨🇾" },
        { code: "+358", country: "Finland", flag: "🇫🇮" },
        { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
        { code: "+370", country: "Lithuania", flag: "🇱🇹" },
        { code: "+371", country: "Latvia", flag: "🇱🇻" },
        { code: "+372", country: "Estonia", flag: "🇪🇪" },
        { code: "+373", country: "Moldova", flag: "🇲🇩" },
        { code: "+374", country: "Armenia", flag: "🇦🇲" },
        { code: "+375", country: "Belarus", flag: "🇧🇾" },
        { code: "+376", country: "Andorra", flag: "🇦🇩" },
        { code: "+377", country: "Monaco", flag: "🇲🇨" },
        { code: "+378", country: "San Marino", flag: "🇸🇲" },
        { code: "+380", country: "Ukraine", flag: "🇺🇦" },
        { code: "+381", country: "Serbia", flag: "🇷🇸" },
        { code: "+382", country: "Montenegro", flag: "🇲🇪" },
        { code: "+383", country: "Kosovo", flag: "🇽🇰" },
        { code: "+385", country: "Croatia", flag: "🇭🇷" },
        { code: "+386", country: "Slovenia", flag: "🇸🇮" },
        { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
        { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
        { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
        { code: "+421", country: "Slovakia", flag: "🇸🇰" },
        { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
        { code: "+500", country: "Falkland Islands", flag: "🇫🇰" },
        { code: "+501", country: "Belize", flag: "🇧🇿" },
        { code: "+502", country: "Guatemala", flag: "🇬🇹" },
        { code: "+503", country: "El Salvador", flag: "🇸🇻" },
        { code: "+504", country: "Honduras", flag: "🇭🇳" },
        { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
        { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
        { code: "+507", country: "Panama", flag: "🇵🇦" },
        { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
        { code: "+509", country: "Haiti", flag: "🇭🇹" },
        { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
        { code: "+591", country: "Bolivia", flag: "🇧🇴" },
        { code: "+592", country: "Guyana", flag: "🇬🇾" },
        { code: "+593", country: "Ecuador", flag: "🇪🇨" },
        { code: "+594", country: "French Guiana", flag: "🇬🇫" },
        { code: "+595", country: "Paraguay", flag: "🇵🇾" },
        { code: "+596", country: "Martinique", flag: "🇲🇶" },
        { code: "+597", country: "Suriname", flag: "🇸🇷" },
        { code: "+598", country: "Uruguay", flag: "🇺🇾" },
        { code: "+599", country: "Netherlands Antilles", flag: "🇧🇶" },
        { code: "+670", country: "East Timor", flag: "🇹🇱" },
        { code: "+672", country: "Antarctica", flag: "🇦🇶" },
        { code: "+673", country: "Brunei", flag: "🇧🇳" },
        { code: "+674", country: "Nauru", flag: "🇳🇷" },
        { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
        { code: "+676", country: "Tonga", flag: "🇹🇴" },
        { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
        { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
        { code: "+679", country: "Fiji", flag: "🇫🇯" },
        { code: "+680", country: "Palau", flag: "🇵🇼" },
        { code: "+681", country: "Wallis and Futuna", flag: "🇼🇫" },
        { code: "+682", country: "Cook Islands", flag: "🇨🇰" },
        { code: "+683", country: "Niue", flag: "🇳🇺" },
        { code: "+684", country: "American Samoa", flag: "🇦🇸" },
        { code: "+685", country: "Samoa", flag: "🇼🇸" },
        { code: "+686", country: "Kiribati", flag: "🇰🇮" },
        { code: "+687", country: "New Caledonia", flag: "🇳🇨" },
        { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
        { code: "+689", country: "French Polynesia", flag: "🇵🇫" },
        { code: "+690", country: "Tokelau", flag: "🇹🇰" },
        { code: "+691", country: "Micronesia", flag: "🇫🇲" },
        { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
        { code: "+850", country: "North Korea", flag: "🇰🇵" },
        { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
        { code: "+853", country: "Macau", flag: "🇲🇴" },
        { code: "+855", country: "Cambodia", flag: "🇰🇭" },
        { code: "+856", country: "Laos", flag: "🇱🇦" },
        { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
        { code: "+886", country: "Taiwan", flag: "🇹🇼" },
        { code: "+960", country: "Maldives", flag: "🇲🇻" },
        { code: "+961", country: "Lebanon", flag: "🇱🇧" },
        { code: "+962", country: "Jordan", flag: "🇯🇴" },
        { code: "+963", country: "Syria", flag: "🇸🇾" },
        { code: "+964", country: "Iraq", flag: "🇮🇶" },
        { code: "+967", country: "Yemen", flag: "🇾🇪" },
        { code: "+968", country: "Oman", flag: "🇴🇲" },
        { code: "+970", country: "Palestine", flag: "🇵🇸" },
        { code: "+972", country: "Israel", flag: "🇮🇱" },
        { code: "+973", country: "Bahrain", flag: "🇧🇭" },
        { code: "+974", country: "Qatar", flag: "🇶🇦" },
        { code: "+975", country: "Bhutan", flag: "🇧🇹" },
        { code: "+976", country: "Mongolia", flag: "🇲🇳" },
        { code: "+977", country: "Nepal", flag: "🇳🇵" },
        { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
        { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
        { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
        { code: "+995", country: "Georgia", flag: "🇬🇪" },
        { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
        { code: "+998", country: "Uzbekistan", flag: "🇺🇿" }
    ];

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

    // Function to check if email already exists
    const checkEmailExists = async (email: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/check-email-exists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            return result.exists || false;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    // Function to check if phone number already exists
    const checkPhoneExists = async (phone: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/check-phone-exists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ phone })
            });
            const result = await response.json();
            return result.exists || false;
        } catch (error) {
            console.error('Error checking phone:', error);
            return false;
        }
    };

    const validateField = (field: keyof PatientData, value: string): string => {
        switch (field) {
            case 'civilStatus':
                return !value || value === 'SELECT' ? 'Please select your civil status' : '';
            case 'nationality':
                return !value.trim() ? 'Nationality is required' : '';
            case 'religion':
                return !value || value === 'SELECT' ? 'Please select your religion' : '';
            case 'religionOther':
                return patientData.religion === 'Other' && (!value || value.trim() === '') ? 'Please specify your religion' : '';
            case 'country':
                return !value.trim() ? 'Country is required' : '';
            case 'region':
                return !value || value === 'Select Region' ? 'Please select your region' : '';
            case 'province':
                return !value.trim() ? 'Province is required' : '';
            case 'city':
                return !value.trim() ? 'City is required' : '';
            case 'barangay':
                return !value.trim() ? 'Barangay is required' : '';
            case 'street':
                return !value.trim() ? 'Street address is required' : '';
            case 'zipCode':
                if (!value.trim()) return 'Zip code is required';
                if (!/^\d{4}$/.test(value.trim())) return 'Zip code must be 4 digits';
                return '';
            case 'mobileNo':
                if (!value.trim()) return 'Mobile number is required';
                // Remove spaces and dashes for validation
                const cleanNumber = value.replace(/[\s-]/g, '');
                // Check if it's a valid mobile number format (10 digits starting with 9)
                if (!/^9\d{9}$/.test(cleanNumber)) {
                    return 'Please enter a valid 10-digit mobile number starting with 9';
                }
                return '';
            case 'emailAddress':
                if (!value.trim()) return 'Email address is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                    return 'Please enter a valid email address';
                }
                return '';
            case 'mobileCountryCode':
                if (!value.trim()) return 'Country code is required';
                return '';
            default:
                return '';
        }
    };

    const validateAllFields = async (): Promise<boolean> => {
        const errors: Partial<Record<keyof PatientData, string>> = {};
        let hasErrors = false;

        const requiredFields: (keyof PatientData)[] = [
            'civilStatus', 'nationality', 'religion', 'country', 
            'region', 'province', 'city', 'barangay', 'street', 
            'zipCode', 'mobileNo', 'mobileCountryCode', 'emailAddress'
        ];

        // Add religionOther to validation if religion is "Other"
        if (patientData.religion === 'Other') {
            requiredFields.push('religionOther');
        }

        requiredFields.forEach(field => {
            const error = validateField(field, String(patientData[field]));
            if (error) {
                errors[field] = error;
                hasErrors = true;
            }
        });

        // Check for duplicate email
        if (patientData.emailAddress && !errors.emailAddress) {
            const emailExists = await checkEmailExists(patientData.emailAddress);
            if (emailExists) {
                errors.emailAddress = 'This email address is already taken. Please use a different email.';
                hasErrors = true;
            }
        }

        // Check for duplicate phone number
        if (patientData.mobileNo && !errors.mobileNo) {
            const fullPhoneNumber = `${patientData.mobileCountryCode}${patientData.mobileNo}`;
            const phoneExists = await checkPhoneExists(fullPhoneNumber);
            if (phoneExists) {
                errors.mobileNo = 'This phone number is already taken. Please use a different phone number.';
                hasErrors = true;
            }
        }

        // Validate profile picture requirement
        if (!profileImage) {
            setProfileImageError("Profile picture is required to complete verification");
            hasErrors = true;
        } else {
            setProfileImageError("");
        }

        setFieldErrors(errors);
        return !hasErrors;
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

        // Clear error for this field when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Handle blur validation for email and phone
    const handleBlur = async (field: keyof PatientData, value: string) => {
        if (field === 'emailAddress' && value && !fieldErrors.emailAddress) {
            const emailExists = await checkEmailExists(value);
            if (emailExists) {
                setFieldErrors(prev => ({
                    ...prev,
                    emailAddress: 'This email address is already taken. Please use a different email.'
                }));
            }
        }

        if (field === 'mobileNo' && value && !fieldErrors.mobileNo) {
            const fullPhoneNumber = `${patientData.mobileCountryCode}${value}`;
            const phoneExists = await checkPhoneExists(fullPhoneNumber);
            if (phoneExists) {
                setFieldErrors(prev => ({
                    ...prev,
                    mobileNo: 'This phone number is already taken. Please use a different phone number.'
                }));
            }
        }
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
        
        // Validate all fields before proceeding
        const isValid = await validateAllFields();
        if (!isValid) {
            setIsLoading(false);
            if (!profileImage) {
                showNotification('error', 'Profile picture is required to complete verification');
            } else {
                showNotification('error', 'Please correct the errors below before proceeding');
            }
            return;
        }
        
        // Simulate API call - replace with actual API call
        setTimeout(() => {
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
                    phone: `${patientData.mobileCountryCode}${patientData.mobileNo}`,
                    civilStatus: patientData.civilStatus,
                    nationality: patientData.nationality,
                    religion: patientData.religion === 'Other' ? patientData.religionOther : patientData.religion,
                    country: patientData.country,
                    region: patientData.region,
                    province: patientData.province,
                    city: patientData.city,
                    barangay: patientData.barangay,
                    street: patientData.street,
                    zipCode: patientData.zipCode,
                    profileImage: profileImage,
                    // Address ID fields for yajra/laravel-address
                    region_id: patientData.region_id,
                    province_id: patientData.province_id,
                    city_id: patientData.city_id,
                    barangay_id: patientData.barangay_id
                };
                
                // Create token session
                const token = tokenSessionManager.createTokenSession(patientInfo);
                
                // Also store in localStorage for backward compatibility
                localStorage.setItem('patientVerificationData', JSON.stringify(patientInfo));
                
                // Set verification session to prevent bypass
                fetch('/set-verification-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    }
                }).then(() => {
                    // Close modal and redirect to appointments page
                    onClose();
                    window.location.href = "/appointments";
                });
            setIsLoading(false);
        }, 1500);
    };



    const handleRefreshPhoto = () => {
        // Simulate refreshing the profile picture
        // Clear the current photo and reset to default
        setProfileImage(null);
        showNotification('success', 'Profile picture refreshed successfully!');
    };

    // Camera functionality for profile picture
    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } 
            });
            setCameraStream(stream);
            setIsCameraOpen(true);
            showNotification('info', 'Camera opened. Position yourself in the frame and click capture.');
        } catch (error) {
            console.error('Error accessing camera:', error);
            showNotification('error', 'Unable to access camera. Please check permissions or use file upload instead.');
        }
    };

    const closeCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setIsCameraOpen(false);
        setCapturedImage(null);
    };

    const capturePhoto = () => {
        if (!cameraStream) return;
        
        setIsCapturing(true);
        const video = document.getElementById('camera-video') as HTMLVideoElement;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (video && ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            // Compress the captured image
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(compressedDataUrl);
            setProfileImage(compressedDataUrl);
            setProfileImageError("");
            
            showNotification('success', 'Photo captured successfully!');
            closeCamera();
        }
        setIsCapturing(false);
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
                
                // Compress and resize image to reduce base64 size
                const compressImage = (file: File): Promise<string> => {
                    return new Promise((resolve) => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        
                        img.onload = () => {
                            // Set maximum dimensions
                            const maxWidth = 300;
                            const maxHeight = 300;
                            
                            // Calculate new dimensions
                            let { width, height } = img;
                            if (width > height) {
                                if (width > maxWidth) {
                                    height = (height * maxWidth) / width;
                                    width = maxWidth;
                                }
                            } else {
                                if (height > maxHeight) {
                                    width = (width * maxHeight) / height;
                                    height = maxHeight;
                                }
                            }
                            
                            // Set canvas dimensions
                            canvas.width = width;
                            canvas.height = height;
                            
                            // Draw and compress
                            ctx?.drawImage(img, 0, 0, width, height);
                            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
                            resolve(compressedDataUrl);
                        };
                        
                        img.src = URL.createObjectURL(file);
                    });
                };
                
                // Compress the image and set it
                compressImage(file).then((compressedDataUrl) => {
                    setProfileImage(compressedDataUrl);
                    // Clear profile image error when user uploads a picture
                    setProfileImageError("");
                });
                
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
            religionOther: "",
            country: "Philippines",
            region: "",
            province: "",
            city: "",
            barangay: "",
            street: "",
            zipCode: "",
            mobileNo: "",
            emailAddress: "",
            // Address ID fields for yajra/laravel-address
            region_id: null,
            province_id: null,
            city_id: null,
            barangay_id: null,
            // Mobile number with country code
            mobileCountryCode: "+63",
        });
        setVerificationCode("");
        setErrorMessage("");
        setSuccessMessage("");
        setProfileImage(null);
        setFieldErrors({});
        setProfileImageError("");
        closeCamera();
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    // Error display component
    const ErrorMessage = ({ field }: { field: keyof PatientData }) => {
        const error = fieldErrors[field];
        if (!error) return null;
        
        return (
            <div className="mt-1 flex items-center space-x-1">
                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-xs text-red-600 font-medium">{error}</span>
            </div>
        );
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
                        <div className="flex items-center space-x-3">
                            {/* Back to Selection Button - Only show on step 1 and when showBackButton is true */}
                            {showBackButton && verificationStep === 1 && onBackToSelection && (
                                <button
                                    onClick={onBackToSelection}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                    </svg>
                                    <span>Back to Selection</span>
                                </button>
                            )}
                            
                            {/* Close Button */}
                            <button 
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
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
                                    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-2 ${
                                        profileImageError ? 'border-red-300 bg-red-50' : 'border-transparent'
                                    }`}>
                                        <div className="flex items-center space-x-6">
                                            <div className="relative">
                                                <div className={`w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg border-4 overflow-hidden ${
                                                    profileImageError ? 'border-red-300' : 'border-white'
                                                }`}>
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
                                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                                    profileImageError ? 'bg-red-500' : 'bg-green-500'
                                                }`}>
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-lg font-semibold text-gray-900 mb-2">
                                                    Profile Picture <span className="text-red-500">*</span>
                                                </h5>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Upload a clear photo of yourself for identification purposes
                                                </p>
                                                {profileImageError && (
                                                    <div className="mb-4 flex items-center space-x-1">
                                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span className="text-sm text-red-600 font-medium">{profileImageError}</span>
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-3">
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
                                                        onClick={openCamera}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        </svg>
                                                        <span className="text-sm">Camera</span>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={handleUploadPhoto}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
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
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
                                                        fieldErrors.civilStatus ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                    }`}
                                                >
                                                    <option value="">SELECT</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Widowed">Widowed</option>
                                                    <option value="Divorced">Divorced</option>
                                                    <option value="Separated">Separated</option>
                                                </select>
                                                <ErrorMessage field="civilStatus" />
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
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Religion *</label>
                                                <select 
                                                    value={patientData.religion}
                                                    onChange={(e) => handleInputChange('religion', e.target.value)}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
                                                        fieldErrors.religion ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                    }`}
                                                >
                                                    <option value="">SELECT</option>
                                                    <option value="Roman Catholic">Roman Catholic</option>
                                                    <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                                                    <option value="Protestant">Protestant</option>
                                                    <option value="Baptist">Baptist</option>
                                                    <option value="Methodist">Methodist</option>
                                                    <option value="Adventist">Adventist</option>
                                                    <option value="Jehovah's Witness">Jehovah's Witness</option>
                                                    <option value="Mormon">Mormon</option>
                                                    <option value="Islam">Islam</option>
                                                    <option value="Buddhist">Buddhist</option>
                                                    <option value="Hindu">Hindu</option>
                                                    <option value="Agnostic">Agnostic</option>
                                                    <option value="Atheist">Atheist</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <ErrorMessage field="religion" />
                                                {patientData.religion === 'Other' && (
                                                    <div className="mt-3">
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Specify: *</label>
                                                        <input 
                                                            type="text"
                                                            value={patientData.religionOther || ''}
                                                            onChange={(e) => handleInputChange('religionOther', e.target.value)}
                                                            placeholder="Please specify your religion"
                                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
                                                                fieldErrors.religionOther ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                            }`}
                                                        />
                                                        <ErrorMessage field="religionOther" />
                                                    </div>
                                                )}
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
                                        <PhilippinesAddressLookup
                                            formData={patientData}
                                            setFormData={setPatientData}
                                            isDisabled={false}
                                        />
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                            Contact Information
                                        </h6>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Street *</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.street}
                                                    onChange={(e) => handleInputChange('street', e.target.value)}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
                                                        fieldErrors.street ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Enter street address"
                                                />
                                                <ErrorMessage field="street" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code *</label>
                                                <input 
                                                    type="text" 
                                                    value={patientData.zipCode}
                                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                                    required
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
                                                        fieldErrors.zipCode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Enter zip code"
                                                />
                                                <ErrorMessage field="zipCode" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile No. *</label>
                                                <div className="flex items-center">
                                                    <div className="relative">
                                                        <select
                                                            value={patientData.mobileCountryCode}
                                                            onChange={(e) => handleInputChange('mobileCountryCode', e.target.value)}
                                                            className={`h-12 px-3 pr-8 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white border-r-0 text-sm appearance-none cursor-pointer min-w-[120px] ${
                                                                fieldErrors.mobileCountryCode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                            }`}
                                                            style={{ 
                                                                backgroundImage: 'none',
                                                                WebkitAppearance: 'none',
                                                                MozAppearance: 'none'
                                                            }}
                                                        >
                                                            {countryCodes.map((country) => (
                                                                <option key={country.code} value={country.code}>
                                                                    {country.flag} {country.code}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="tel" 
                                                        value={patientData.mobileNo}
                                                        onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                                                        onBlur={(e) => handleBlur('mobileNo', e.target.value)}
                                                        required
                                                        className={`flex-1 h-12 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
                                                            fieldErrors.mobileNo ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                        }`}
                                                        placeholder="999-999-9999"
                                                    />
                                                </div>
                                                <ErrorMessage field="mobileNo" />
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Format: {patientData.mobileCountryCode} 999-999-9999
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                                                <input 
                                                    type="email" 
                                                    value={patientData.emailAddress}
                                                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                                                    onBlur={(e) => handleBlur('emailAddress', e.target.value)}
                                                    required
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
                                                        fieldErrors.emailAddress ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Enter email address"
                                                />
                                                <ErrorMessage field="emailAddress" />
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
                                            className={`px-8 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105 ${
                                                !profileImage
                                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                            } disabled:opacity-50`}
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
                                                    <span>
                                                        {!profileImage ? 'Upload Profile Picture Required' : 'Proceed to Appointments'}
                                                    </span>
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

                {/* Camera Modal Overlay */}
                {isCameraOpen && (
                <div className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Camera</h3>
                            <button 
                                onClick={closeCamera}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="relative">
                            <video 
                                id="camera-video"
                                autoPlay 
                                playsInline 
                                muted
                                className="w-full h-96 bg-gray-900 rounded-lg"
                                ref={(video) => {
                                    if (video && cameraStream) {
                                        video.srcObject = cameraStream;
                                    }
                                }}
                            />
                            
                            {/* Camera Controls */}
                            <div className="flex justify-center space-x-4 mt-4">
                                <button 
                                    onClick={closeCamera}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={capturePhoto}
                                    disabled={isCapturing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
                                >
                                    {isCapturing ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Capturing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            <span>Capture Photo</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientVerificationModal;
    