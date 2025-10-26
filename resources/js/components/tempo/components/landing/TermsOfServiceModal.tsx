import React, { useState } from "react";

interface TermsOfServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
    isOpen,
    onClose,
    onAccept,
}) => {
    const [hasReadTerms, setHasReadTerms] = useState(false);
    const [hasReadGuidelines, setHasReadGuidelines] = useState(false);

    const handleAccept = () => {
        if (hasReadTerms && hasReadGuidelines) {
            onAccept();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto border border-gray-100">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Terms of Service & Community Guidelines</h3>
                                <p className="text-sm text-gray-600 mt-1">Please read and accept our terms before proceeding</p>
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
                    
                    {/* Modal Body */}
                    <div className="p-8 max-h-96 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Terms of Service */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Terms of Service
                                </h4>
                                <div className="text-sm text-gray-700 space-y-3">
                                    <p><strong>1. Service Usage:</strong> By using our appointment booking system, you agree to provide accurate and truthful information about your health and personal details.</p>
                                    <p><strong>2. Data Privacy:</strong> We are committed to protecting your personal information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).</p>
                                    <p><strong>3. Appointment Policy:</strong> Appointments must be scheduled at least 24 hours in advance. Same-day cancellations may be subject to rescheduling.</p>
                                    <p><strong>4. Medical Records:</strong> All medical information provided will be kept confidential and used solely for healthcare purposes.</p>
                                    <p><strong>5. System Availability:</strong> While we strive for 24/7 availability, we cannot guarantee uninterrupted service due to maintenance or technical issues.</p>
                                </div>
                            </div>

                            {/* Community Guidelines */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    Community Guidelines
                                </h4>
                                <div className="text-sm text-gray-700 space-y-3">
                                    <p><strong>1. Respectful Communication:</strong> Please maintain respectful and professional communication with our healthcare staff and other patients.</p>
                                    <p><strong>2. Accurate Information:</strong> Provide accurate and complete information about your health condition and medical history.</p>
                                    <p><strong>3. Punctuality:</strong> Arrive on time for your appointments. Late arrivals may result in rescheduling.</p>
                                    <p><strong>4. Privacy Respect:</strong> Respect the privacy of other patients and maintain confidentiality of shared spaces.</p>
                                    <p><strong>5. Compliance:</strong> Follow all health and safety protocols, including wearing masks and maintaining social distancing when required.</p>
                                </div>
                            </div>

                            {/* Agreement Checkboxes */}
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        id="termsCheckbox"
                                        checked={hasReadTerms}
                                        onChange={(e) => setHasReadTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label htmlFor="termsCheckbox" className="text-sm text-gray-700">
                                        I have read and agree to the <strong>Terms of Service</strong> and understand my rights and responsibilities as a patient.
                                    </label>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        id="guidelinesCheckbox"
                                        checked={hasReadGuidelines}
                                        onChange={(e) => setHasReadGuidelines(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                    />
                                    <label htmlFor="guidelinesCheckbox" className="text-sm text-gray-700">
                                        I have read and agree to follow the <strong>Community Guidelines</strong> and will maintain respectful behavior.
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-4 p-8 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleAccept}
                            disabled={!hasReadTerms || !hasReadGuidelines}
                            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Accept & Continue</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServiceModal;
