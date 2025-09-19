import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
    Package, 
    Hash, 
    Calendar, 
    User,
    FileText,
    AlertTriangle,
    CheckCircle
} from "lucide-react";

const DispenseStockModal = ({ open, onClose, item }) => {
    const [availableBatches, setAvailableBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        item_id: item?.id || "",
        batch_number: "",
        quantity: "",
        reason: "",
        patient_name: "",
        prescription_number: "",
        dispensed_by: "",
        notes: ""
    });

    useEffect(() => {
        if (item && open) {
            // Simulate available batches - in real app, this would come from the backend
            const batches = [
                {
                    batch_number: item.batch_number || "BATCH-001",
                    expiry_date: item.expiry_date || "2025-12-31",
                    available_quantity: item.quantity || 100,
                    location: item.storage_location || "Shelf A1"
                }
            ];
            setAvailableBatches(batches);
            setData('item_id', item.id);
            setData('dispensed_by', "Current User"); // This would be the logged-in user
        }
    }, [item, open]);

    const handleBatchSelect = (batch) => {
        setSelectedBatch(batch);
        setData('batch_number', batch.batch_number);
        setData('quantity', '');
        setValidationErrors({});
    };

    const validateForm = () => {
        const errors = {};
        
        if (!data.batch_number) {
            errors.batch_number = "Please select a batch";
        }
        
        if (!data.quantity || data.quantity <= 0) {
            errors.quantity = "Please enter a valid quantity";
        } else if (selectedBatch && data.quantity > selectedBatch.available_quantity) {
            errors.quantity = `Quantity cannot exceed available stock (${selectedBatch.available_quantity})`;
        }
        
        if (!data.reason.trim()) {
            errors.reason = "Please provide a reason for dispensing";
        }
        
        if (!data.patient_name.trim()) {
            errors.patient_name = "Please enter patient name";
        }
        
        if (!data.prescription_number.trim()) {
            errors.prescription_number = "Please enter prescription number";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        post(route("pharmacist.inventory.dispense"), {
            onSuccess: () => {
                onClose();
                // Reset form
                setData({
                    item_id: "",
                    batch_number: "",
                    quantity: "",
                    reason: "",
                    patient_name: "",
                    prescription_number: "",
                    dispensed_by: "",
                    notes: ""
                });
                setSelectedBatch(null);
                setValidationErrors({});
            },
            onError: (errors) => {
                console.error("Dispense error:", errors);
            }
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30;
    };

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Dispense Stock - {item.name}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Item Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Item Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Item:</span>
                                <span className="ml-2 font-medium">{item.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Manufacturer:</span>
                                <span className="ml-2 font-medium">{item.manufacturer || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Category:</span>
                                <span className="ml-2 font-medium">{item.category?.name || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Current Stock:</span>
                                <span className="ml-2 font-medium">{item.quantity || 0} {item.unit_type || "units"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Available Batches */}
                    <div>
                        <Label className="text-sm font-medium">Available Batches</Label>
                        <div className="mt-2 space-y-2">
                            {availableBatches.map((batch, index) => (
                                <motion.div
                                    key={batch.batch_number}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                        selectedBatch?.batch_number === batch.batch_number
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleBatchSelect(batch)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                selectedBatch?.batch_number === batch.batch_number
                                                    ? 'bg-blue-500'
                                                    : 'bg-gray-300'
                                            }`}></div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">{batch.batch_number}</span>
                                                    {isExpiringSoon(batch.expiry_date) && (
                                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Available: {batch.available_quantity} units
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(batch.expiry_date)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {batch.location}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {validationErrors.batch_number && (
                            <p className="text-sm text-red-600 mt-1">{validationErrors.batch_number}</p>
                        )}
                    </div>

                    {/* Dispense Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="quantity">Quantity to Dispense *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                max={selectedBatch?.available_quantity || 0}
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                placeholder="Enter quantity"
                                className="mt-1"
                            />
                            {validationErrors.quantity && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.quantity}</p>
                            )}
                            {selectedBatch && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Max: {selectedBatch.available_quantity} units
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="reason">Reason for Dispensing *</Label>
                            <Input
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="e.g., Prescription, Emergency"
                                className="mt-1"
                            />
                            {validationErrors.reason && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.reason}</p>
                            )}
                        </div>
                    </div>

                    {/* Patient Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="patient_name">Patient Name *</Label>
                            <Input
                                id="patient_name"
                                value={data.patient_name}
                                onChange={(e) => setData('patient_name', e.target.value)}
                                placeholder="Enter patient name"
                                className="mt-1"
                            />
                            {validationErrors.patient_name && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.patient_name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="prescription_number">Prescription Number *</Label>
                            <Input
                                id="prescription_number"
                                value={data.prescription_number}
                                onChange={(e) => setData('prescription_number', e.target.value)}
                                placeholder="Enter prescription number"
                                className="mt-1"
                            />
                            {validationErrors.prescription_number && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.prescription_number}</p>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Any additional notes or instructions..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Dispense Summary */}
                    {selectedBatch && data.quantity && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                        >
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Dispense Summary
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-700">Item:</span>
                                    <span className="ml-2 font-medium">{item.name}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Batch:</span>
                                    <span className="ml-2 font-medium">{selectedBatch.batch_number}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Quantity:</span>
                                    <span className="ml-2 font-medium">{data.quantity} units</span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Patient:</span>
                                    <span className="ml-2 font-medium">{data.patient_name || "Not specified"}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !selectedBatch}
                            style={{ backgroundColor: '#2C3E50' }}
                        >
                            {processing ? "Dispensing..." : "Dispense Stock"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DispenseStockModal;
