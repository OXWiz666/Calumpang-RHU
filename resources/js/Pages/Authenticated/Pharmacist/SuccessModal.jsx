import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

const SuccessModal = ({ open, onClose, title = "Success!", message = "Operation completed successfully!" }) => {
    // Auto-close the notification after 3 seconds
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-green-800">
                            {title}
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="bg-white rounded-md inline-flex text-green-400 hover:text-green-500 focus:outline-none"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
