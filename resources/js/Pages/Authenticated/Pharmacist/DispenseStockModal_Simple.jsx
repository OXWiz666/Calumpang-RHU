import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { Badge } from "@/components/tempo/components/ui/badge";
import { useForm } from "@inertiajs/react";
import {
    Package,
    Hash,
    Calendar,
    AlertTriangle,
    Clock,
    CheckCircle,
    XCircle,
    ShoppingCart,
    User,
    FileText,
    Building2,
    MapPin,
    Zap
} from "lucide-react";

const DispenseStockModal = ({ open, onClose, item }) => {
    const [availableBatches, setAvailableBatches] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [loadingBatches, setLoadingBatches] = useState(false);
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [batchQuantities, setBatchQuantities] = useState({});
    const [currentStock, setCurrentStock] = useState(item?.quantity || 0);

    const { data, setData, post, processing, errors } = useForm({
        item_id: item?.id || "",
        batch_id: "",
        batch_number: "",
        quantity: "",
        reason: "",
        patient_name: "",
        case_id: "",
        dispensed_by: "",
        notes: ""
    });

    // Filter out expired batches
    const filterExpiredBatches = (batches) => {
        const currentDate = new Date();
        return batches.filter(batch => {
            if (!batch.expiry_date || batch.expiry_date === 'N/A') return true;
            try {
                const expiryDate = new Date(batch.expiry_date);
                return expiryDate > currentDate;
            } catch (error) {
                return true; // Keep batch if date parsing fails
            }
        });
    };

    // Load available batches
    const loadAvailableBatches = async () => {
        if (!item?.id) return;
        
        setLoadingBatches(true);
        try {
            const response = await fetch(`/pharmacist/inventory/item/${item.id}/batches`);
            if (response.ok) {
                const batches = await response.json();
                const filteredBatches = filterExpiredBatches(Array.isArray(batches) ? batches : []);
                setAvailableBatches(filteredBatches);
            }
        } catch (error) {
            console.error('Error loading batches:', error);
        } finally {
            setLoadingBatches(false);
        }
    };

    useEffect(() => {
        if (open && item) {
            loadAvailableBatches();
            setData('item_id', item.id);
            setData('dispensed_by', "Current User");
            setCurrentStock(item.quantity || 0);
            setSelectedBatches([]);
            setData('batch_id', '');
        }
    }, [open, item]);

    const handleBatchSelect = (batch, index) => {
        const batchUniqueId = `${batch.batch_number}-${index}-${batch.batch_id || batch.id}`;
        
        setSelectedBatches(prev => {
            const exists = prev.find(b => b.uniqueId === batchUniqueId);
            if (exists) {
                return prev.filter(b => b.uniqueId !== batchUniqueId);
            }
            return [...prev, { ...batch, uniqueId: batchUniqueId, quantity: batch.available_quantity || 0 }];
        });
        
        setData({ ...data, batch_number: batch.batch_number, quantity: batch.available_quantity || 0 });
        setValidationErrors({});
    };

    const updateBatchQuantity = (batchUniqueId, quantity) => {
        setSelectedBatches(prev => 
            prev.map(batch => 
                batch.uniqueId === batchUniqueId 
                    ? { ...batch, quantity: Math.max(0, Math.min(quantity, batch.available_quantity || 0)) }
                    : batch
            )
        );
    };

    const validateForm = () => {
        const errors = {};
        
        if (selectedBatches.length === 0) {
            errors.batch_number = "Please select at least one batch";
        }

        if (!data.patient_name.trim()) {
            errors.patient_name = "Please enter patient name";
        }

        if (!data.case_id.trim()) {
            errors.case_id = "Please enter case ID";
        }

        if (!data.reason.trim()) {
            errors.reason = "Please provide a reason for dispensing";
        }

        const totalQuantity = selectedBatches.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
        if (totalQuantity <= 0) {
            errors.quantity = "Please enter valid quantities for selected batches";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const totalQuantity = selectedBatches.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
        
        const payload = {
            item_id: data.item_id,
            batch_id: selectedBatches[0]?.batch_id || selectedBatches[0]?.id,
            batch_number: selectedBatches[0]?.batch_number,
            quantity: totalQuantity,
            reason: data.reason,
            patient_name: data.patient_name,
            case_id: data.case_id,
            dispensed_by: data.dispensed_by,
            notes: data.notes,
            batches: selectedBatches.map(batch => ({
                batch_id: batch.batch_id || batch.id,
                batch_number: batch.batch_number,
                quantity: batch.quantity
            }))
        };

        post(route('pharmacist.inventory.dispense'), {
            onSuccess: () => {
                onClose();
                // Auto-refresh the page data - use visit to refresh the current page
                router.visit(window.location.pathname, { method: 'get' });
                setData({
                    item_id: "",
                    batch_id: "",
                    batch_number: "",
                    quantity: "",
                    reason: "",
                    patient_name: "",
                    case_id: "",
                    dispensed_by: "",
                    notes: ""
                });
                setSelectedBatches([]);
                setValidationErrors({});
                window.location.reload();
            },
            onError: (errors) => {
                console.error("Dispense error:", errors);
                setValidationErrors(errors);
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

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-green-600" />
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
                            {loadingBatches ? (
                                <div className="text-center py-4">Loading batches...</div>
                            ) : (
                                availableBatches.map((batch, index) => {
                                    const expiryStatus = getExpiryStatus(batch.expiry_date);
                                    const isSelected = selectedBatches.some(b => b.uniqueId === `${batch.batch_number}-${index}-${batch.batch_id || batch.id}`);
                                    
                                    return (
                                        <motion.div
                                            key={`${batch.batch_number}-${index}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => handleBatchSelect(batch, index)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        isSelected ? 'bg-green-500' : 'bg-gray-300'
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
                                                </div>
                                            </div>
                                            
                                            {isSelected && (
                                                <div className="mt-3 pl-7">
                                                    <Label className="text-xs">Quantity to dispense for this batch</Label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={batch.available_quantity}
                                                        value={selectedBatches.find(b => b.uniqueId === `${batch.batch_number}-${index}-${batch.batch_id || batch.id}`)?.quantity || 0}
                                                        onChange={(e) => updateBatchQuantity(`${batch.batch_number}-${index}-${batch.batch_id || batch.id}`, parseInt(e.target.value) || 0)}
                                                        className="mt-1 w-40"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">Max {batch.available_quantity}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                        {validationErrors.batch_number && (
                            <p className="text-sm text-red-600 mt-1">{validationErrors.batch_number}</p>
                        )}
                    </div>

                    {/* Dispense Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="patient_name">Patient Name *</Label>
                            <Input
                                id="patient_name"
                                value={data.patient_name}
                                onChange={(e) => setData('patient_name', e.target.value)}
                                className="mt-1"
                                placeholder="Enter patient name"
                            />
                            {validationErrors.patient_name && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.patient_name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="case_id">Case ID *</Label>
                            <Input
                                id="case_id"
                                value={data.case_id}
                                onChange={(e) => setData('case_id', e.target.value)}
                                className="mt-1"
                                placeholder="Enter case ID"
                            />
                            {validationErrors.case_id && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.case_id}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="reason">Reason for Dispensing *</Label>
                        <Input
                            id="reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="mt-1"
                            placeholder="Enter reason for dispensing"
                        />
                        {validationErrors.reason && (
                            <p className="text-sm text-red-600 mt-1">{validationErrors.reason}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Any additional notes..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Dispense Summary */}
                    {selectedBatches.length > 0 && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Dispense Summary
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-green-700">Total Quantity:</span>
                                    <span className="ml-2 font-medium">
                                        {selectedBatches.reduce((sum, batch) => sum + (batch.quantity || 0), 0)} units
                                    </span>
                                </div>
                                <div>
                                    <span className="text-green-700">Selected Batches:</span>
                                    <span className="ml-2 font-medium">{selectedBatches.length}</span>
                                </div>
                                <div>
                                    <span className="text-green-700">Patient:</span>
                                    <span className="ml-2 font-medium">{data.patient_name || "Not specified"}</span>
                                </div>
                                <div>
                                    <span className="text-green-700">Case ID:</span>
                                    <span className="ml-2 font-medium">{data.case_id || "Not specified"}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
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
                            disabled={processing || selectedBatches.length === 0}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {processing ? "Dispensing..." : "Dispense Stock"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DispenseStockModal;
