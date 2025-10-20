import React, { useState } from 'react';
import { Button } from '@/components/tempo/components/ui/button';
import { Input } from '@/components/tempo/components/ui/input';
import { Label } from '@/components/tempo/components/ui/label';
import { Textarea } from '@/components/tempo/components/ui/textarea';

interface MedicalRecordsRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MedicalRecordsRequestModal: React.FC<MedicalRecordsRequestModalProps> = ({
    isOpen,
    onClose
}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        requestType: 'medical-records',
        reason: '',
        additionalInfo: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 2000);
    };

    const handleClose = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            birthDate: '',
            requestType: 'medical-records',
            reason: '',
            additionalInfo: ''
        });
        setIsSubmitted(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Request Medical Records</h2>
                                <p className="text-gray-600">Fill out the form below to request your medical records</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                            Phone Number *
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="+63 912 345 6789"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                                            Birth Date *
                                        </Label>
                                        <Input
                                            id="birthDate"
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                                            Reason for Request *
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            value={formData.reason}
                                            onChange={(e) => handleInputChange('reason', e.target.value)}
                                            required
                                            className="mt-1"
                                            rows={3}
                                            placeholder="Please specify why you need your medical records (e.g., for insurance, second opinion, personal records)"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
                                            Additional Information
                                        </Label>
                                        <Textarea
                                            id="additionalInfo"
                                            value={formData.additionalInfo}
                                            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                                            className="mt-1"
                                            rows={2}
                                            placeholder="Any additional information that might help us locate your records"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Important Notice:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Medical records will be processed within 3-5 business days</li>
                                            <li>You will be contacted via email or phone for verification</li>
                                            <li>Records can be picked up at the health center or sent via secure email</li>
                                            <li>Valid ID is required for record pickup</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    className="px-6 py-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        /* Success Message */
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted Successfully!</h3>
                            <p className="text-gray-600 mb-6">
                                Your medical records request has been submitted. We will contact you within 3-5 business days to verify your information and process your request.
                            </p>
                            <Button
                                onClick={handleClose}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Close
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordsRequestModal;


