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
    AlertTriangle,
    Trash2,
    FileText,
    CheckCircle,
    XCircle
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

const BatchDisposalModal = ({ open, onClose, item }) => {
    const [availableBatches, setAvailableBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        item_id: item?.id || "",
        batch_number: "",
        quantity: "",
        disposal_reason: "",
        disposal_method: "",
        disposal_date: "",
        disposed_by: "",
        notes: "",
        disposal_cost: ""
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
            
            // Set form data properly
            setData({
                item_id: item.id,
                batch_number: "",
                quantity: "",
                disposal_reason: "",
                disposal_method: "",
                disposal_date: new Date().toISOString().split('T')[0],
                disposed_by: "Current User",
                notes: "",
                disposal_cost: ""
            });
        }
    }, [item, open]);

    const handleBatchSelect = (batch) => {
        setSelectedBatch(batch);
        setData({
            ...data,
            batch_number: batch.batch_number,
            quantity: batch.available_quantity
        });
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
        
        if (!data.disposal_reason.trim()) {
            errors.disposal_reason = "Please provide a reason for disposal";
        }
        
        if (!data.disposal_method) {
            errors.disposal_method = "Please select a disposal method";
        }
        
        if (!data.disposal_date) {
            errors.disposal_date = "Please select a disposal date";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Additional validation for disposal
        if (data.quantity > selectedBatch.available_quantity) {
            setValidationErrors({ quantity: `Cannot dispose more than available stock (${selectedBatch.available_quantity} units)` });
            return;
        }

        if (data.disposal_date && new Date(data.disposal_date) < new Date()) {
            setValidationErrors({ disposal_date: 'Disposal date cannot be in the past' });
            return;
        }
        
        post(route("pharmacist.inventory.dispose"), {
            onSuccess: () => {
                onClose();
                // Reset form
                setData({
                    item_id: "",
                    batch_number: "",
                    quantity: "",
                    disposal_reason: "",
                    disposal_method: "",
                    disposal_date: "",
                    disposed_by: "",
                    notes: "",
                    disposal_cost: ""
                });
                setSelectedBatch(null);
                setValidationErrors({});
            },
            onError: (errors) => {
                console.error("Disposal error:", errors);
            }
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const isExpired = (expiryDate) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        return expiry < today;
    };

    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const getExpiryStatus = (expiryDate) => {
        if (isExpired(expiryDate)) {
            return { status: "expired", color: "text-red-600", bgColor: "bg-red-50", icon: <XCircle className="h-4 w-4" /> };
        } else if (isExpiringSoon(expiryDate)) {
            return { status: "expiring", color: "text-amber-600", bgColor: "bg-amber-50", icon: <AlertTriangle className="h-4 w-4" /> };
        } else {
            return { status: "valid", color: "text-green-600", bgColor: "bg-green-50", icon: <CheckCircle className="h-4 w-4" /> };
        }
    };

    const disposalMethods = [
        { value: "incineration", label: "Incineration" },
        { value: "landfill", label: "Landfill Disposal" },
        { value: "return_supplier", label: "Return to Supplier" },
        { value: "donation", label: "Donation (if applicable)" },
        { value: "other", label: "Other" }
    ];

    const disposalReasons = [
        { value: "Expired", label: "Expired Product" },
        { value: "Damaged", label: "Damaged Product" },
        { value: "Recalled", label: "Product Recall" },
        { value: "Contaminated", label: "Contaminated Product" },
        { value: "Excess Stock", label: "Excess Stock" },
        { value: "Other", label: "Other" }
    ];

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        Batch Disposal - {item.name}
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
                            {availableBatches.map((batch, index) => {
                                const expiryStatus = getExpiryStatus(batch.expiry_date);
                                return (
                                    <motion.div
                                        key={batch.batch_number}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                            selectedBatch?.batch_number === batch.batch_number
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => handleBatchSelect(batch)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    selectedBatch?.batch_number === batch.batch_number
                                                        ? 'bg-red-500'
                                                        : 'bg-gray-300'
                                                }`}></div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">{batch.batch_number}</span>
                                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${expiryStatus.bgColor} ${expiryStatus.color}`}>
                                                            {expiryStatus.icon}
                                                            {expiryStatus.status === "expired" ? "Expired" : 
                                                             expiryStatus.status === "expiring" ? "Expiring Soon" : "Valid"}
                                                        </div>
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
                                );
                            })}
                        </div>
                        {validationErrors.batch_number && (
                            <p className="text-sm text-red-600 mt-1">{validationErrors.batch_number}</p>
                        )}
                    </div>

                    {/* Disposal Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="quantity">Quantity to Dispose *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                max={selectedBatch?.available_quantity || 0}
                                value={data.quantity}
                                onChange={(e) => setData({ ...data, quantity: e.target.value })}
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
                            <Label htmlFor="disposal_date">Disposal Date *</Label>
                            <Input
                                id="disposal_date"
                                type="date"
                                value={data.disposal_date}
                                onChange={(e) => setData({ ...data, disposal_date: e.target.value })}
                                className="mt-1"
                            />
                            {validationErrors.disposal_date && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.disposal_date}</p>
                            )}
                        </div>
                    </div>

                    {/* Disposal Reason and Method */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="disposal_reason">Disposal Reason *</Label>
                            <Select value={data.disposal_reason} onValueChange={(value) => setData({ ...data, disposal_reason: value })}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {disposalReasons.map((reason) => (
                                        <SelectItem key={reason.value} value={reason.value}>
                                            {reason.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {validationErrors.disposal_reason && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.disposal_reason}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="disposal_method">Disposal Method *</Label>
                            <Select value={data.disposal_method} onValueChange={(value) => setData({ ...data, disposal_method: value })}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {disposalMethods.map((method) => (
                                        <SelectItem key={method.value} value={method.value}>
                                            {method.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {validationErrors.disposal_method && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.disposal_method}</p>
                            )}
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData({ ...data, notes: e.target.value })}
                            placeholder="Any additional notes about the disposal..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Disposal Summary */}
                    {selectedBatch && data.quantity && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-4"
                        >
                            <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Disposal Summary
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-red-700">Item:</span>
                                    <span className="ml-2 font-medium">{item.name}</span>
                                </div>
                                <div>
                                    <span className="text-red-700">Batch:</span>
                                    <span className="ml-2 font-medium">{selectedBatch.batch_number}</span>
                                </div>
                                <div>
                                    <span className="text-red-700">Quantity:</span>
                                    <span className="ml-2 font-medium">{data.quantity} units</span>
                                </div>
                                <div>
                                    <span className="text-red-700">Reason:</span>
                                    <span className="ml-2 font-medium">{data.disposal_reason || "Not specified"}</span>
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
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {processing ? "Disposing..." : "Dispose Batch"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BatchDisposalModal;
