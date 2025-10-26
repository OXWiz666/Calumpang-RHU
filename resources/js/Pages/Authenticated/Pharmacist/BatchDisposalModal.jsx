import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { useForm, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { toastSuccess, toastError } from "@/utils/toast";
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

// Helper function to get today's date in Philippines/Hong Kong timezone (UTC+8)
const getManilaDate = () => {
    const now = new Date();
    // Get the current time in Manila (UTC+8)
    // Use Intl.DateTimeFormat to convert to Manila timezone
    const manilaFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return manilaFormatter.format(now);
};

const BatchDisposalModal = ({ open, onClose, item, multi = false, itemsForMulti = [] }) => {
    const [availableBatches, setAvailableBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedBatches, setSelectedBatches] = useState([]); // [{batch_number, quantity, expiry_date, available_quantity}]
    const [selectedItems, setSelectedItems] = useState([]); // for multi mode: [{id, batch_number}]
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedOption, setSelectedOption] = useState("");
    const [customDisposalMethod, setCustomDisposalMethod] = useState("");
    const [customDisposalReason, setCustomDisposalReason] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        item_id: item?.id || "",
        batch_number: "",
        quantity: "",
        disposal_reason: "",
        disposal_method: "",
        disposal_date: getManilaDate(),
        disposed_by: "",
        notes: "",
        disposal_cost: "",
        batches: []
    });

    useEffect(() => {
        const loadBatches = async () => {
            if (!open) return;
            // Multi: load all batches for disposal
            if (multi) {
                try {
                    console.log('Loading batches for multi disposal, itemsForMulti:', itemsForMulti);
                    // Load all inventory items and their batches for disposal
                    const itemIds = itemsForMulti.map(item => item.id).filter(id => id);
                    console.log('Item IDs to fetch:', itemIds);
                    
                    if (itemIds.length === 0) {
                        console.log('No valid item IDs found');
                        setAvailableBatches([]);
                        return;
                    }
                    
                    const response = await fetch(route('pharmacist.inventory.items.batches'), {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                        },
                        body: JSON.stringify({ item_ids: itemIds })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const batches = await response.json();
                    console.log('Fetched batches:', batches);
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
                    disposal_date: getManilaDate(),
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
                disposal_date: getManilaDate(),
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
        
        // Reset dropdown selection after adding batch
        setSelectedOption("");
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
        
        // Validate custom disposal method when "other" is selected
        if (data.disposal_method === 'other' && !customDisposalMethod.trim()) {
            errors.custom_disposal_method = "Please specify the disposal method";
        }
        
        // Validate custom disposal reason when "Other" is selected
        if (data.disposal_reason === 'Other' && !customDisposalReason.trim()) {
            errors.custom_disposal_reason = "Please specify the disposal reason";
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

        // Validate disposal date must be today (not past or future)
        if (data.disposal_date) {
            const todayManila = getManilaDate();
            
            // Compare dates in YYYY-MM-DD format
            const disposalDateStr = data.disposal_date;
            
            if (disposalDateStr < todayManila) {
                setValidationErrors({ disposal_date: 'Disposal date cannot be in the past' });
                return;
            }
            if (disposalDateStr > todayManila) {
                setValidationErrors({ disposal_date: 'Disposal date cannot be in the future. Only today\'s date is allowed for disposal.' });
                return;
            }
        }
        
        // Enhanced validation for selected batches
        const validationErrors = {};
        
        if (selectedBatches.length === 0) {
            validationErrors.general = "Please select at least one batch to dispose";
        }
        
        // Validate quantities for each selected batch
        const invalidBatches = [];
        selectedBatches.forEach(batch => {
            const quantity = Number(batch.quantity);
            const availableQuantity = Number(batch.available_quantity);
            
            if (!batch.quantity || quantity <= 0) {
                invalidBatches.push(`${batch.batch_number}: Quantity must be greater than 0`);
            } else if (quantity > availableQuantity) {
                invalidBatches.push(`${batch.batch_number}: Cannot dispose more than available (${availableQuantity} units)`);
            }
        });
        
        if (invalidBatches.length > 0) {
            validationErrors.quantity = invalidBatches.join('\n');
        }
        
        // Validate disposal method
        if (!data.disposal_method) {
            validationErrors.disposal_method = "Please select a disposal method";
        }
        
        // Validate disposal reason
        if (!data.disposal_reason) {
            validationErrors.disposal_reason = "Please select a disposal reason";
        }
        
        // Validate custom disposal method
        if (data.disposal_method === 'other' && (!customDisposalMethod || customDisposalMethod.trim() === '')) {
            validationErrors.custom_disposal_method = "Please specify the disposal method";
        }
        
        // Validate custom disposal reason
        if (data.disposal_reason === 'Other' && (!customDisposalReason || customDisposalReason.trim() === '')) {
            validationErrors.custom_disposal_reason = "Please specify the disposal reason";
        }
        
        // Check for any validation errors
        if (Object.keys(validationErrors).length > 0) {
            setValidationErrors(validationErrors);
            return;
        }

        const payload = {
            item_id: multi ? (selectedBatches[0]?.item_id || data.item_id) : data.item_id,
            batches: selectedBatches.map(b => ({ 
                batch_number: b.batch_number, 
                quantity: Number(b.quantity) || 0,
                item_id: b.item_id || data.item_id
            })),
            disposal_reason: data.disposal_reason === 'Other' ? customDisposalReason : data.disposal_reason,
            disposal_method: data.disposal_method === 'other' ? customDisposalMethod : data.disposal_method,
            disposal_date: data.disposal_date,
            disposed_by: data.disposed_by,
            notes: data.notes,
            disposal_cost: data.disposal_cost
        };

        console.log('Payload validation:', {
            batchesCount: payload.batches.length,
            batches: payload.batches,
            totalQuantity: payload.batches.reduce((sum, b) => sum + b.quantity, 0)
        });

        if (selectedBatches.length > 1 || multi) {
            console.log('Submitting bulk disposal with payload:', payload);
            console.log('Selected batches:', selectedBatches);
            router.post(route('pharmacist.inventory.dispose.bulk'), payload, {
                onSuccess: (page) => {
                    console.log('Bulk disposal successful:', page);
                    toastSuccess(
                        "Bulk Disposal Successful",
                        "Bulk disposal completed successfully!",
                        "delete"
                    );
                    onClose();
                    // Auto-refresh the page data - use visit to refresh the current page
                    router.visit(window.location.pathname, { method: 'get' });
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
                    setCustomDisposalMethod("");
                    setCustomDisposalReason("");
                    // Refresh the page to update inventory data
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error("Bulk disposal error:", errors);
                    
                    // Handle specific error types
                    if (errors && typeof errors === 'object') {
                        const errorMessages = [];
                        
                        // Handle validation errors
                        if (errors.batches) {
                            errorMessages.push(`Batches: ${Array.isArray(errors.batches) ? errors.batches[0] : errors.batches}`);
                        }
                        if (errors.disposal_reason) {
                            errorMessages.push(`Disposal reason: ${Array.isArray(errors.disposal_reason) ? errors.disposal_reason[0] : errors.disposal_reason}`);
                        }
                        if (errors.disposal_method) {
                            errorMessages.push(`Disposal method: ${Array.isArray(errors.disposal_method) ? errors.disposal_method[0] : errors.disposal_method}`);
                        }
                        if (errors.disposal_date) {
                            errorMessages.push(`Disposal date: ${Array.isArray(errors.disposal_date) ? errors.disposal_date[0] : errors.disposal_date}`);
                        }
                        if (errors.disposed_by) {
                            errorMessages.push(`Disposed by: ${Array.isArray(errors.disposed_by) ? errors.disposed_by[0] : errors.disposed_by}`);
                        }
                        if (errors.disposal_cost) {
                            errorMessages.push(`Disposal cost: ${Array.isArray(errors.disposal_cost) ? errors.disposal_cost[0] : errors.disposal_cost}`);
                        }
                        
                        if (errorMessages.length > 0) {
                            toastError(
                                "Validation Errors",
                                errorMessages.join(', ')
                            );
                        } else {
                            toastError(
                                "Bulk Disposal Failed",
                                "Please check your inputs and try again."
                            );
                        }
                    } else if (typeof errors === 'string') {
                        toastError("Bulk Disposal Error", errors);
                    } else {
                        toastError(
                            "Bulk Disposal Failed",
                            "An unexpected error occurred. Please try again."
                        );
                    }
                    
                    setValidationErrors(errors);
                }
            });
            return;
        }

        post(route('pharmacist.inventory.dispose'), {
            onSuccess: (page) => {
                console.log('Disposal successful:', page);
                toastSuccess(
                    "Disposal Successful",
                    "Disposal completed successfully!",
                    "delete"
                );
                onClose();
                // Auto-refresh the page data - use visit to refresh the current page
                router.visit(window.location.pathname, { method: 'get' });
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
                setCustomDisposalMethod("");
                setCustomDisposalReason("");
                // Refresh the page to update inventory data
                window.location.reload();
            },
            onError: (errors) => {
                console.error("Disposal error:", errors);
                
                // Handle specific error types
                if (errors && typeof errors === 'object') {
                    const errorMessages = [];
                    
                    // Handle validation errors
                    if (errors.item_id) {
                        errorMessages.push(`Item: ${Array.isArray(errors.item_id) ? errors.item_id[0] : errors.item_id}`);
                    }
                    if (errors.batch_number) {
                        errorMessages.push(`Batch number: ${Array.isArray(errors.batch_number) ? errors.batch_number[0] : errors.batch_number}`);
                    }
                    if (errors.quantity) {
                        errorMessages.push(`Quantity: ${Array.isArray(errors.quantity) ? errors.quantity[0] : errors.quantity}`);
                    }
                    if (errors.disposal_reason) {
                        errorMessages.push(`Disposal reason: ${Array.isArray(errors.disposal_reason) ? errors.disposal_reason[0] : errors.disposal_reason}`);
                    }
                    if (errors.disposal_method) {
                        errorMessages.push(`Disposal method: ${Array.isArray(errors.disposal_method) ? errors.disposal_method[0] : errors.disposal_method}`);
                    }
                    if (errors.disposal_date) {
                        errorMessages.push(`Disposal date: ${Array.isArray(errors.disposal_date) ? errors.disposal_date[0] : errors.disposal_date}`);
                    }
                    if (errors.disposed_by) {
                        errorMessages.push(`Disposed by: ${Array.isArray(errors.disposed_by) ? errors.disposed_by[0] : errors.disposed_by}`);
                    }
                    if (errors.disposal_cost) {
                        errorMessages.push(`Disposal cost: ${Array.isArray(errors.disposal_cost) ? errors.disposal_cost[0] : errors.disposal_cost}`);
                    }
                    
                    if (errorMessages.length > 0) {
                        toastError(
                            "Validation Errors",
                            errorMessages.join(', ')
                        );
                    } else {
                        toastError(
                            "Disposal Failed",
                            "Please check your inputs and try again."
                        );
                    }
                } else if (typeof errors === 'string') {
                    toastError("Disposal Error", errors);
                } else {
                    toastError(
                        "Disposal Failed",
                        "An unexpected error occurred. Please try again."
                    );
                }
                
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
    
    // Handle bulk disposal mode
    const isBulkMode = multi && item && item.id === 'bulk';

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
                        {!multi && item && item.id !== 'bulk' && (
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
                        {(multi || isBulkMode) && (
                            <div>
                                <p className="text-sm text-gray-600">
                                    Select batches from the list below to dispose. You can select multiple batches from different items.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Available Batches */}
                    <div>
                        <Label className="text-sm font-medium">Available Batches</Label>
                        <div className="mt-2">
                            <Select
                                value={selectedOption}
                                onValueChange={(value) => {
                                    setSelectedOption(value);
                                    if (value && value !== '') {
                                        const batch = availableBatches.find(b => `${b.batch_number}-${b.item_id || data.item_id}` === value);
                                        if (batch) {
                                            handleBatchToggle(batch);
                                        }
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select batches to dispose (multiple selection)" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {(Array.isArray(availableBatches) ? availableBatches : [])
                                        .filter(batch => 
                                            batch.batch_number && 
                                            batch.batch_number !== 'new_batch' && 
                                            batch.batch_number !== 'N/A' &&
                                            batch.available_quantity > 0 // Filter out 0 quantity batches
                                        )
                                        .map((batch, index) => {
                                            const expiryStatus = getExpiryStatus(batch.expiry_date);
                                            const isSelected = selectedBatches.find(b => b.batch_number === batch.batch_number);
                                            return (
                                                <SelectItem 
                                                    key={`${batch.item_id || data.item_id}:${batch.batch_number || 'NB'}:${index}`}
                                                    value={`${batch.batch_number}-${batch.item_id || data.item_id}`}
                                                    className="cursor-pointer"
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-full ${
                                                                isSelected ? 'bg-red-500' : 'bg-gray-300'
                                                            }`}></div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <Hash className="h-4 w-4 text-gray-500" />
                                                                    <span className="font-medium">{batch.batch_number}{batch.item_name ? ` (${batch.item_name})` : ''}</span>
                                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${expiryStatus.bgColor} ${expiryStatus.color}`}>
                                                                        {expiryStatus.icon}
                                                                        {expiryStatus.status === "expired" ? "Expired" : 
                                                                         expiryStatus.status === "expiring" ? "Expiring Soon Items" : "Valid"}
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
                                                </SelectItem>
                                            );
                                        })}
                                </SelectContent>
                            </Select>
                            {validationErrors.batch_number && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.batch_number}</p>
                            )}
                        </div>
                    </div>

                    {/* Selected Batches with Quantity Input */}
                    {selectedBatches.length > 0 && (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Selected Batches - Set Quantities</Label>
                            {selectedBatches.map((batch, index) => (
                                <div key={`${batch.batch_number}-${batch.item_id || data.item_id}`} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{batch.batch_number}{batch.item_name ? ` (${batch.item_name})` : ''}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedBatches(prev => prev.filter(b => b.batch_number !== batch.batch_number));
                                            }}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label className="text-xs">Quantity to dispose</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={batch.available_quantity}
                                                value={batch.quantity || 0}
                                                onChange={(e) => updateSelectedBatchQty((batch.item_id || data.item_id), batch.batch_number, Math.min(Number(e.target.value)||0, batch.available_quantity))}
                                                className="mt-1"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Max {batch.available_quantity} units</p>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div>Available: {batch.available_quantity} units</div>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(batch.expiry_date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

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
                            <Label htmlFor="disposal_date">Disposed Date *</Label>
                            <Input
                                id="disposal_date"
                                type="date"
                                value={data.disposal_date}
                                readOnly
                                className="mt-1"
                                min={new Date().toISOString().split('T')[0]}
                                max={new Date().toISOString().split('T')[0]}
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
                            
                            {/* Custom disposal reason input when "Other" is selected */}
                            {data.disposal_reason === 'Other' && (
                                <div className="mt-2">
                                    <Label htmlFor="custom_disposal_reason">Specify: *</Label>
                                    <Input
                                        id="custom_disposal_reason"
                                        type="text"
                                        value={customDisposalReason}
                                        onChange={(e) => setCustomDisposalReason(e.target.value)}
                                        placeholder="Please specify the disposal reason"
                                        className="mt-1"
                                        required
                                    />
                                    {validationErrors.custom_disposal_reason && (
                                        <p className="text-sm text-red-600 mt-1">{validationErrors.custom_disposal_reason}</p>
                                    )}
                                </div>
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
                            
                            {/* Custom disposal method input when "Other" is selected */}
                            {data.disposal_method === 'other' && (
                                <div className="mt-2">
                                    <Label htmlFor="custom_disposal_method">Specify: *</Label>
                                    <Input
                                        id="custom_disposal_method"
                                        type="text"
                                        value={customDisposalMethod}
                                        onChange={(e) => setCustomDisposalMethod(e.target.value)}
                                        placeholder="Please specify the disposal method"
                                        className="mt-1"
                                        required
                                    />
                                    {validationErrors.custom_disposal_method && (
                                        <p className="text-sm text-red-600 mt-1">{validationErrors.custom_disposal_method}</p>
                                    )}
                                </div>
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
                    {selectedBatches.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-4"
                        >
                            <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Disposal Summary
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-red-700">Total Batches:</span>
                                    <span className="ml-2 font-medium">{selectedBatches.length}</span>
                                </div>
                                <div>
                                    <span className="text-red-700">Total Quantity:</span>
                                    <span className="ml-2 font-medium">{selectedBatches.reduce((sum, b) => sum + (Number(b?.quantity) || 0), 0)} units</span>
                                </div>
                                <div>
                                    <span className="text-red-700">Reason:</span>
                                    <span className="ml-2 font-medium">{data.disposal_reason || "Not specified"}</span>
                                </div>
                                <div>
                                    <span className="text-red-700">Method:</span>
                                    <span className="ml-2 font-medium">{data.disposal_method || "Not specified"}</span>
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
                        {(multi || isBulkMode) && (
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
