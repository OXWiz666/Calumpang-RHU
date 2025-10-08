import React, { useEffect, useState } from "react";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import InputError from "@/components/InputError";
import { Label } from "@/components/tempo/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";
import { usePage } from "@inertiajs/react";
import CustomCalendar from "./CustomCalendar";
import moment from "moment";
import { tokenSessionManager } from "../../../../utils/tokenSession";
import ConfirmationModal from "../../../../components/tempo/components/landing/ConfirmationModal";


const AppointmentForm = ({
    onSubmit = () => {},
    formData,
    setFormData,
    errors,
    processing,
    services = [],

    //programs,
}) => {
    const user = usePage().props.auth.user;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [isFormLocked, setIsFormLocked] = useState(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

    useEffect(() => {
        if (user && !formData.firstname) {
            setFormData({
                ...formData,
                firstname: user.firstname,
                middlename: user.middlename ?? "",
                lastname: user.lastname,
                email: user.email,
                phone: user.contactno ?? "",
                servicename: "",
                service: "",
                gender: user.gender,
                birth: user.birth,
                priorityNumber: "", // Will be set by backend
                // Patient profile fields
                date_of_birth: user.birth || "",
                civil_status: user.civil_status || "",
                nationality: user.nationality || "",
                religion: user.religion || "",
                country: user.country || "",
                region: user.region || "",
                province: user.province || "",
                city: user.city || "",
                barangay: user.barangay || "",
                street: user.street || "",
                zip_code: user.zip_code || "",
                profile_picture: user.profile_picture || "",
            });
            // Lock form for authenticated users
            setIsFormLocked(true);
        }
    }, [user]);

    // Check for token session and populate form
    useEffect(() => {
        if (!user) {
            // Check for token session first
            if (tokenSessionManager.hasValidTokenSession()) {
                const patientData = tokenSessionManager.getPatientData();
                if (patientData) {
                    setFormData({
                        ...formData,
                        firstname: patientData.firstname || "",
                        middlename: patientData.middlename || "",
                        lastname: patientData.lastname || "",
                        email: patientData.email || "",
                        phone: patientData.phone || "",
                        gender: patientData.sex || "",
                        birth: patientData.birthdate || "",
                        servicename: "",
                        service: "",
                        priorityNumber: "", // Will be set by backend
                        // Patient profile fields
                        date_of_birth: patientData.birthdate || "",
                        civil_status: patientData.civilStatus || "",
                        nationality: patientData.nationality || "",
                        religion: patientData.religion || "",
                        country: patientData.country || "",
                        region: patientData.region || "",
                        province: patientData.province || "",
                        city: patientData.city || "",
                        barangay: patientData.barangay || "",
                        street: patientData.street || "",
                        zip_code: patientData.zipCode || "",
                        profile_picture: patientData.profileImage || "",
                    });
                    // Lock form for guest users who have completed verification
                    setIsFormLocked(true);
                }
            } else {
                // Fallback to localStorage for backward compatibility
                const storedData = localStorage.getItem('patientVerificationData');
                if (storedData) {
                    try {
                        const patientInfo = JSON.parse(storedData);
                        setFormData({
                            ...formData,
                            firstname: patientInfo.firstname || "",
                            middlename: patientInfo.middlename || "",
                            lastname: patientInfo.lastname || "",
                            email: patientInfo.email || "",
                            phone: patientInfo.phone || "",
                            gender: patientInfo.sex || "",
                            birth: patientInfo.birthdate || "",
                            servicename: "",
                            service: "",
                            priorityNumber: "", // Will be set by backend
                            // Patient profile fields
                            date_of_birth: patientInfo.birthdate || "",
                            civil_status: patientInfo.civilStatus || "",
                            nationality: patientInfo.nationality || "",
                            religion: patientInfo.religion || "",
                            country: patientInfo.country || "",
                            region: patientInfo.region || "",
                            province: patientInfo.province || "",
                            city: patientInfo.city || "",
                            barangay: patientInfo.barangay || "",
                            street: patientInfo.street || "",
                            zip_code: patientInfo.zipCode || "",
                            profile_picture: patientInfo.profileImage || "",
                        });
                        
                        // Clear the stored data after using it
                        localStorage.removeItem('patientVerificationData');
                    } catch (error) {
                        // Silently handle error
                    }
                }
            }
        }
    }, []);

    // Create a service lookup object
    const serviceLookup = services.reduce((acc, service) => {
        acc[service.id] = service;
        return acc;
    }, {});

    const [date, setDate] = useState(new Date());



    // Handler for final confirmation
    const handleFinalConfirmation = () => {
        setShowConfirmationModal(false);
        // Submit the appointment after confirmation
        onSubmit(formData);
    };



    // Separate handler for date changes
    const handleDateChange = (date) => {
        //setDate(date);
        setFormData((prev) => ({ ...prev, date }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for phone number
        if (name === "phone") {
            // Allow only numbers and + character
            const cleanedValue = value.replace(/[^0-9+]/g, "");
            setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value ?? null }));
    };


    const timeSlots = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
    ];

    // const services = [
    //     "General Consultation",
    //     "Vaccination",
    //     "Prenatal Check-up",
    //     "Child Health Check-up",
    //     "Blood Pressure Monitoring",
    //     "Family Planning",
    //     "Dental Services",
    //   ];

    const [subservices, setSubServices] = useState([]);

    const [timesArr, setTimesArr] = useState([]);

    const subServiceLookup = subservices?.reduce((acc, subservice) => {
        acc[subservice.id] = subservice;
        return acc;
    }, {});

    // useEffect(() => {
    //     //console.log("subservice: ", subservices);
    // }, [timesArr]);

    const [programs, setPrograms] = useState([]);
    useEffect(() => {
        const service = serviceLookup[formData.service]; // id

        setPrograms(service?.servicedays?.map((day) => day.day));
        //programs = service?.servicedays?.map((day) => day.day);
        //console.log("programs:: ", programs);
    }, [formData, serviceLookup]);

    // useEffect(() => {
    //     console.log("time:", formData.time?.toString().trim(), "wew");
    // }, [formData.time]);

    return (
        <>
        <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
        >
            {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{validationError}</p>
                    </div>
                    <button
                        onClick={() => setValidationError("")}
                        className="text-red-600 hover:text-red-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}

            {isFormLocked && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <div className="flex-1">
                        <p className="font-medium text-sm">
                            {user ? 'Personal information is locked for authenticated users' : 'Personal information is locked after verification'}
                        </p>
                        <p className="text-xs mt-1">
                            {user ? 'Your account information cannot be modified here' : 'This information was verified and cannot be changed'}
                        </p>
                    </div>
                </div>
            )}
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="name">First Name</Label>
                        <Input
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            placeholder="Your First Name"
                            disabled={isFormLocked}
                            required
                        />
                        <InputError message={errors.firstname} />
                    </div>
                    <div>
                        <Label htmlFor="middlename">Middle Name</Label>
                        <Input
                            id="middlename"
                            name="middlename"
                            value={formData.middlename}
                            placeholder="Your Middle Name"
                            disabled={isFormLocked}
                            required
                        />
                        <InputError message={errors.middlename} />
                    </div>
                    <div>
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            placeholder="Your Last Name"
                            disabled={isFormLocked}
                            required
                        />
                        <InputError message={errors.lastname} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="email">Email Address (Optional)</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            placeholder="juan@example.com"
                            disabled={isFormLocked}
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+63 912 345 6789"
                            disabled={isFormLocked}
                        />
                        <InputError message={errors.phone} />
                    </div>
                </div>

                {/* Patient Profile Information - Collapsible Section */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Additional Patient Information (Optional)</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                This information will be automatically stored in your Patient Record for future appointments
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            {showAdditionalInfo ? 'Hide Details' : 'Show Details'}
                        </button>
                    </div>
                    
                    {showAdditionalInfo && (
                        <div className="space-y-4">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        disabled={isFormLocked}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => handleInputChange("gender", value)}
                                        disabled={isFormLocked}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="civil_status">Civil Status</Label>
                                    <Select
                                        value={formData.civil_status}
                                        onValueChange={(value) => handleInputChange("civil_status", value)}
                                        disabled={isFormLocked}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Single</SelectItem>
                                            <SelectItem value="Married">Married</SelectItem>
                                            <SelectItem value="Widowed">Widowed</SelectItem>
                                            <SelectItem value="Divorced">Divorced</SelectItem>
                                            <SelectItem value="Separated">Separated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Nationality and Religion */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input
                                        id="nationality"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="e.g., Filipino"
                                        disabled={isFormLocked}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="religion">Religion</Label>
                                    <Input
                                        id="religion"
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleChange}
                                        placeholder="e.g., Catholic"
                                        disabled={isFormLocked}
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700">Address Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="e.g., Philippines"
                                            disabled={isFormLocked}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="region">Region</Label>
                                        <Input
                                            id="region"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            placeholder="e.g., Region IV-A"
                                            disabled={isFormLocked}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="province">Province</Label>
                                        <Input
                                            id="province"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            placeholder="e.g., Laguna"
                                            disabled={isFormLocked}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">City/Municipality</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="e.g., Calumpang"
                                            disabled={isFormLocked}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="barangay">Barangay</Label>
                                        <Input
                                            id="barangay"
                                            name="barangay"
                                            value={formData.barangay}
                                            onChange={handleChange}
                                            placeholder="e.g., Barangay Name"
                                            disabled={isFormLocked}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="zip_code">Zip Code</Label>
                                        <Input
                                            id="zip_code"
                                            name="zip_code"
                                            value={formData.zip_code}
                                            onChange={handleChange}
                                            placeholder="e.g., 4000"
                                            disabled={isFormLocked}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="street">Street Address</Label>
                                    <Input
                                        id="street"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="e.g., 123 Main Street"
                                        disabled={isFormLocked}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Service Type</Label>
                        <Select
                            value={formData.service?.toString()} // Ensure string value
                            onValueChange={(selectedId) => {
                                const service = serviceLookup[selectedId];
                                if (service) {
                                    handleSelectChange("service", service.id);
                                    handleSelectChange(
                                        "servicename",
                                        service.servicename
                                    );

                                    handleSelectChange("date", null);
                                    handleSelectChange("subservice", "");
                                    handleSelectChange("subservicename", "");
                                    handleSelectChange("timeid", "");
                                    handleSelectChange("time", "");
                                    //  handleSelectChange("customAttr", service.customAttribute);
                                } // handleSelectChange("servicename", selectedService?.servicename || "");

                                fetch(
                                    `/services/get-sub-services/${selectedId}`
                                )
                                    .then((resp) => resp.json())
                                    .then((data) => {
                                        setSubServices(data);
                                    });
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select service">
                                    {formData.service
                                        ? services.find(
                                              (s) =>
                                                  s.id.toString() ===
                                                  formData.service.toString()
                                          )?.servicename
                                        : "Select service"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem
                                        key={service.id} // Use service.id as key
                                        value={service.id} // Ensure string value
                                    >
                                        {service.servicename}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.service} />
                    </div>
                    <div>
                        <Label>Service Sub Type</Label>
                        <Select
                            value={formData.subservice?.toString()} // Ensure string value
                            onValueChange={(selectedId) => {
                                const subservice = subServiceLookup[selectedId];

                                setTimesArr(subservice?.times);
                                // handleSelectChange({
                                //     subservice: subservice.id,
                                //     subservicename: subservice.subservicename,
                                // });
                                // Correct - call separately for each field
                                handleSelectChange(
                                    "subservice",
                                    subservice.id ?? null
                                );
                                handleSelectChange(
                                    "subservicename",
                                    subservice.subservicename ?? null
                                );

                                handleSelectChange("timeid", "");
                                handleSelectChange("time", "");
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Sub Service">
                                    {formData.subservice
                                        ? subservices.find(
                                              (s) =>
                                                  s.id.toString() ===
                                                  formData.subservice.toString()
                                          )?.subservicename
                                        : "Select Sub-Service"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {subservices?.map((ss, i) => (
                                    <SelectItem key={i} value={ss.id}>
                                        {ss.subservicename}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.subservice} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Appointment Date</Label>
                        <CustomCalendar
                            selectedDate={formData.date}
                            onDateSelect={handleDateChange}
                            hasPrograms={programs}
                            serviceId={formData.service}
                            subserviceId={formData.subservice}
                        />
                        {/* <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.date &&
                                            "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.date ? (
                                        format(formData.date, "PPP")
                                    ) : (
                                        <span>Select date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={formData.date}
                                    onSelect={handleDateChange}
                                    initialFocus
                                    disabled={(date) => {
                                        // Disable past dates and weekends
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const day = date.getDay();
                                        return date < today || day === 0; // 0 is Sunday
                                    }}
                                />
                            </PopoverContent>
                        </Popover> */}
                        <InputError message={errors.date} />
                    </div>

                    <div>
                        <Label>Appointment Time</Label>
                        <Select
                            value={formData.timeid}
                            onValueChange={(value) => {
                                const subserv =
                                    subServiceLookup[formData.subservice];
                                handleSelectChange("timeid", value ?? null);
                                handleSelectChange(
                                    "time",
                                    moment(
                                        subserv?.times?.find(
                                            (t) => t.id == value
                                        )?.time,
                                        "HH:mm:ss"
                                    ).format("hh:mm A") ?? null
                                );
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select time">
                                    {formData.timeid ? (
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4" />
                                            {moment(
                                                formData.time,
                                                "HH:mm:ss"
                                            ).format("h:mm A")}
                                        </div>
                                    ) : (
                                        "Select time"
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {timesArr.map((time, i) => (
                                    <SelectItem key={time.id} value={time.id}>
                                        {moment(time.time, "HH:mm:ss").format(
                                            "h:mm A"
                                        )}
                                    </SelectItem>
                                ))}
                                {/* {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))} */}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.time} />
                    </div>
                </div>
            </div>

                <div className="space-y-4">
                {usePage().props.auth.user ? (
                    <Button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Validate required fields before showing verification modal
                            const requiredFields = ['firstname', 'lastname', 'service', 'date', 'time'];
                            const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
                            
                            if (missingFields.length > 0) {
                                // Show error message for missing fields
                                const fieldNames = {
                                    'firstname': 'First Name',
                                    'lastname': 'Last Name', 
                                    'service': 'Service Type',
                                    'date': 'Appointment Date',
                                    'time': 'Appointment Time'
                                };
                                const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
                                setValidationError(`Please fill in the following required fields: ${missingFieldNames.join(', ')}`);
                                
                                // Scroll to top to show error
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                            }
                            
                            // Clear any previous errors
                            setValidationError("");
                            
                            // All required fields are filled, submit the appointment directly
                            onSubmit(formData);
                        }}
                        disabled={processing} 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        {processing ? (
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>Schedule Appointment</span>
                            </div>
                        )}
                    </Button>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Book Your Appointment?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Complete your patient verification to access appointment booking and manage your health records.
                            </p>
                            <Button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    // Validate required fields before showing verification modal
                                    const requiredFields = ['firstname', 'lastname', 'service', 'date', 'time'];
                                    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
                                    
                                    if (missingFields.length > 0) {
                                        // Show error message for missing fields
                                        const fieldNames = {
                                            'firstname': 'First Name',
                                            'lastname': 'Last Name', 
                                            'service': 'Service Type',
                                            'date': 'Appointment Date',
                                            'time': 'Appointment Time'
                                        };
                                        const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
                                        setValidationError(`Please fill in the following required fields: ${missingFieldNames.join(', ')}`);
                                        
                                        // Scroll to top to show error
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        return;
                                    }
                                    
                                    // Clear any previous errors
                                    setValidationError("");
                                    
                                    // All required fields are filled, submit the appointment directly
                                    onSubmit(formData);
                                }}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>Appoint Now!</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </form>

        {/* Confirmation Modal */}
        <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={handleFinalConfirmation}
            title="Confirmation"
            message="Are you sure you want to confirm this appointment?"
            confirmText="Confirm"
            cancelText="Cancel"
        />

        </>
    );
};

export default AppointmentForm;
