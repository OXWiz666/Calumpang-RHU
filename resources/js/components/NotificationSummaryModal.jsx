import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/tempo/components/ui/dialog';
import { Button } from '@/components/tempo/components/ui/button';
import { Badge } from '@/components/tempo/components/ui/badge';
import { 
    Calendar, 
    User, 
    Pill, 
    FileText, 
    Clock,
    CheckCircle,
    Package,
    Printer
} from 'lucide-react';

const NotificationSummaryModal = ({ 
    isOpen, 
    onClose, 
    notification 
}) => {
    if (!notification) return null;

    // Parse notification data to extract dispense details
    const parseDispenseData = (message) => {
        const data = {
            prescriptionId: '',
            patientName: '',
            pharmacistName: '',
            medicines: [],
            timestamp: notification.created_at
        };

        // Extract prescription ID
        const prescriptionMatch = message.match(/RX-(\d+)/);
        if (prescriptionMatch) {
            data.prescriptionId = `RX-${prescriptionMatch[1]}`;
        }

        // Extract patient name
        const patientMatch = message.match(/to\s+([^,]+)/);
        if (patientMatch) {
            data.patientName = patientMatch[1].trim();
        }

        // Extract pharmacist name
        const pharmacistMatch = message.match(/by\s+([^(]+)/);
        if (pharmacistMatch) {
            data.pharmacistName = pharmacistMatch[1].trim();
        }

        // Extract medicines
        const medicineMatches = message.match(/•\s+([^-]+)\s+-\s+(\d+)\s+(\w+)/g);
        if (medicineMatches) {
            data.medicines = medicineMatches.map(match => {
                const parts = match.match(/•\s+([^-]+)\s+-\s+(\d+)\s+(\w+)/);
                return {
                    name: parts[1].trim(),
                    quantity: parseInt(parts[2]),
                    unit: parts[3]
                };
            });
        }

        return data;
    };

    const dispenseData = parseDispenseData(notification.data.message);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'prescription_dispensed':
            case 'admin_dispense_activity':
                return <CheckCircle className="h-6 w-6 text-green-600" />;
            case 'prescription_ready':
                return <Package className="h-6 w-6 text-blue-600" />;
            default:
                return <FileText className="h-6 w-6 text-gray-600" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'prescription_dispensed':
            case 'admin_dispense_activity':
                return 'bg-green-50 border-green-200';
            case 'prescription_ready':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getNotificationColor(notification.data.type)}`}>
                            {getNotificationIcon(notification.data.type)}
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                                {notification.data.title}
                            </DialogTitle>
                            <p className="text-gray-600">Notification Details</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Notification Info */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-base mb-2 text-gray-800">Notification Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-600">Status:</span>
                                <Badge variant={notification.read_at ? "secondary" : "default"} className="text-base px-3 py-1">
                                    {notification.read_at ? "Read" : "Unread"}
                                </Badge>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Time:</span>
                                <p className="font-semibold">{new Date(notification.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dispense Details */}
                    {dispenseData.prescriptionId && (
                        <>
                            {/* Prescription & Patient Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h3 className="font-semibold text-base mb-2 text-blue-800">Prescription Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-blue-600">Prescription ID:</span>
                                            <p className="font-semibold">{dispenseData.prescriptionId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <h3 className="font-semibold text-base mb-2 text-purple-800">Patient Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-purple-600">Patient Name:</span>
                                            <p className="font-semibold">{dispenseData.patientName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medicine Details */}
                            {dispenseData.medicines.length > 0 && (
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <h3 className="font-semibold text-base mb-2 text-green-800">Dispensed Medicines</h3>
                                    <div className="space-y-2">
                                        {dispenseData.medicines.map((medicine, index) => (
                                            <div key={index} className="bg-white p-2 rounded-lg border border-green-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Pill className="h-5 w-5 text-green-600" />
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{medicine.name}</p>
                                                            <p className="text-sm text-gray-600">Quantity: {medicine.quantity} {medicine.unit}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Staff Information */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-base mb-2 text-gray-800">Staff Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-600">Dispensing Pharmacist:</span>
                                        <p className="font-semibold">{dispenseData.pharmacistName}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Dispense Time:</span>
                                        <p className="font-semibold">{new Date(notification.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}


                    {/* Full Message */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-base mb-2 text-gray-800">Full Message</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{notification.data.message}</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            // Print functionality
                            window.print();
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Print Summary
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NotificationSummaryModal;
