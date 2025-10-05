import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { useForm, router } from "@inertiajs/react";
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

const BatchDisposalModal = ({ open, onClose, item, multi = false, itemsForMulti = [] }) => {
    const [availableBatches, setAvailableBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedBatches, setSelectedBatches] = useState([]); // [{batch_number, quantity, expiry_date, available_quantity}]
    const [selectedItems, setSelectedItems] = useState([]); // for multi mode: [{id, batch_number}]
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedOption, setSelectedOption] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        item_id: item?.id || "",
        batch_number: "",
        quantity: "",
        disposal_reason: "",
        disposal_method: "",
        disposal_date: "",
        disposed_by: "",
        notes: "",
        disposal_cost: "",
        batches: []
    });

    useEffect(() => {
        const loadBatches = async () => {
            if (!open) return;
            // Multi: load batches for multiple items
            if (multi) {
                if (!selectedItems || selectedItems.length === 0) {
                    setAvailableBatches([]);
                    return;
                }
                try {
                    const response = await fetch(route('pharmacist.inventory.items.batches'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                        body: JSON.stringify({ item_ids: selectedItems.map(si => si.id) })
                    });
                    const batches = await response.json();
                    setAvailableBatches(Array.isArray(batches) ? batches : []);
                } catch (e) {
                    console.error('Failed to load batches', e);
                    setAvailableBatches([]);
                }
                setData({
                    item_id: "",
                    batch_number: "",
                    quantity: "",
                    disposal_reason: "",
                    disposal_method: "",
                    disposal_date: new Date().toISOString().split('T')[0],
                    disposed_by: "Current User",
                    notes: "",
                    disposal_cost: ""
                });
                return;
            }

            // Single: load for selected item
            if (!item) return;
            try {
                const response = await fetch(route('pharmacist.inventory.item.batches', item.id));
                const batches = await response.json();
                setAvailableBatches(Array.isArray(batches) ? batches : []);
            } catch (e) {
                console.error('Failed to load batches', e);
                setAvailableBatches([]);
            }

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
        };

        loadBatches();
    }, [item, open, multi, JSON.stringify(selectedItems)]);

    const handleBatchToggle = (batch) => {
        setValidationErrors({});
        setSelectedBatch(batch);
        setData({ ...data, batch_number: batch.batch_number, quantity: batch.available_quantity });

        setSelectedBatches((prev) => {
            const exists = prev.find(b => b.batch_number === batch.batch_number);
            if (exists) {
                return prev.filter(b => b.batch_number !== batch.batch_number);
            }
            return [...prev, { ...batch, quantity: Math.min( batch.available_quantity, batch.quantity ?? batch.available_quantity ) }];
        });
    };

    const updateSelectedBatchQty = (itemId, batchNumber, qty) => {
        setSelectedBatches((prev) => prev.map(b => ((b.item_id || data.item_id) === itemId && b.batch_number === batchNumber) ? { ...b, quantity: qty } : b));
    };

    const validateForm = () => {
        const errors = {};
        
        if (selectedBatches.length === 0) {
            errors.batch_number = "Please select at least one batch";
        }

        const totalQty = Array.isArray(selectedBatches) ? selectedBatches.reduce((sum, b) => sum + (Number(b?.quantity) || 0), 0) : 0;
        if (totalQty <= 0) {
            errors.quantity = "Please enter a valid quantity for selected batches";
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
        if (!multi && selectedBatch && data.quantity > selectedBatch.available_quantity) {
            setValidationErrors({ quantity: `Cannot dispose more than available stock (${selectedBatch.available_quantity} units)` });
            return;
        }

        if (data.disposal_date && new Date(data.disposal_date) < new Date(new Date().toDateString())) {
            setValidationErrors({ disposal_date: 'Disposal date cannot be in the past' });
            return;
        }
        
        const payload = {
            item_id: data.item_id,
            batches: selectedBatches.map(b => ({ batch_number: b.batch_number, quantity: Number(b.quantity) || 0 })),
            disposal_reason: data.disposal_reason,
            disposal_method: data.disposal_method,
            disposal_date: data.disposal_date,
            disposed_by: data.disposed_by,
            notes: data.notes,
            disposal_cost: data.disposal_cost
        };

        if (selectedBatches.length > 1) {
            router.post(route('pharmacist.inventory.dispose.bulk'), payload, {
                onSuccess: () => {
                    onClose();
                    setData({
                        item_id: "",
                        batch_number: "",
                        quantity: "",
                        disposal_reason: "",
                        disposal_method: "",
                        disposal_date: "",
                        disposed_by: "",
                        notes: "",
                        disposal_cost: "",
                        batches: []
                    });
                    setSelectedBatch(null);
                    setSelectedBatches([]);
                    setValidationErrors({});
                },
                onError: (errors) => {
                    console.error("Disposal error:", errors);
                }
            });
            return;
        }

        post(route('pharmacist.inventory.dispose'), {
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
                    disposal_cost: "",
                    batches: []
                });
                setSelectedBatch(null);
                setSelectedBatches([]);
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

    if (!item && !multi) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        {multi ? 'Batch Disposal - Multiple Items' : `Batch Disposal - ${item?.name ?? ''}`}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Item Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Item Information</h3>
                        {!multi && item && (
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
                        )}
                        {multi && (
                            <div>
                                <Label className="text-sm font-medium">Select Batch Numbers</Label>
                                <div className="mt-2">
                                    <Select
                                        value={selectedOption}
                                        onValueChange={(value) => {
                                            setSelectedOption(value);
                                            const id = parseInt(value, 10);
                                            const inv = itemsForMulti.find((i) => i.id === id);
                                            if (inv && !selectedItems.find((si) => si.id === id)) {
                                                setSelectedItems((prev) => [...prev, { id: inv.id, batch_number: inv.batch_number }]);
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose expired batch to add" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {itemsForMulti.filter((inv) => {
                                                const exp = inv.expiry_date || inv.expiryDate;
                                                return exp ? (new Date(exp) < new Date()) : false;
                                            }).map((inv) => (
                                                <SelectItem key={inv.id} value={String(inv.id)}>
                                                    {(inv.batch_number || '') + (inv.name ? ` (${inv.name})` : '')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedItems.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {selectedItems.map((si) => {
                                            const inv = itemsForMulti.find((i) => i.id === si.id);
                                            return (
                                                <span key={si.id} className="text-xs bg-gray-100 border rounded px-2 py-1 flex items-center gap-2">
                                                    {(inv?.batch_number || '') + (inv?.name ? ` (${inv?.name})` : '')}
                                                    <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedItems((prev) => prev.filter((x) => x.id !== si.id))}>×</button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 mt-2">Batches across selected items are listed below.</p>
                            </div>
                        )}
                    </div>

                    {/* Available Batches */}
                    <div>
                        <Label className="text-sm font-medium">Available Batches</Label>
                        <div className="mt-2 space-y-2">
                            {(Array.isArray(availableBatches) ? availableBatches : []).map((batch, index) => {
                                const expiryStatus = getExpiryStatus(batch.expiry_date);
                                return (
                                    <motion.div
                                        key={`${batch.item_id || data.item_id}:${batch.batch_number || 'NB'}:${index}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                            selectedBatches.find(b => b.batch_number === batch.batch_number)
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => handleBatchToggle(batch)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    selectedBatches.find(b => b.batch_number === batch.batch_number)
                                                        ? 'bg-red-500'
                                                        : 'bg-gray-300'
                                                }`}></div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">{batch.batch_number}{batch.item_name ? ` (${batch.item_name})` : ''}</span>
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
                                        {selectedBatches.find(b => b.batch_number === batch.batch_number) && (
                                            <div className="mt-3 pl-7">
                                                <Label className="text-xs">Quantity to dispose for this batch</Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={batch.available_quantity}
                                                    value={selectedBatches.find(b => b.batch_number === batch.batch_number)?.quantity || 0}
                                                    onChange={(e) => updateSelectedBatchQty((batch.item_id || data.item_id), batch.batch_number, Math.min(Number(e.target.value)||0, batch.available_quantity))}
                                                    className="mt-1 w-40"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Max {batch.available_quantity}</p>
                                            </div>
                                        )}
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
                            <Label>Total Quantity to Dispose</Label>
                            <div className="mt-1 font-medium">
                                {selectedBatches.reduce((sum, b) => sum + (Number(b.quantity)||0), 0)} units
                            </div>
                            {validationErrors.quantity && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.quantity}</p>
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
                        {!multi && (
                            <Button
                                type="submit"
                                disabled={processing || !selectedBatch}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {processing ? "Disposing..." : "Dispose Batch"}
                            </Button>
                        )}
                        {multi && (
                            <Button
                                type="submit"
                                disabled={processing || selectedBatches.length === 0}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {processing ? "Disposing..." : "Dispose Selected Batches"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BatchDisposalModal;
