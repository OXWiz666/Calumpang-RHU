import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { toastSuccess, toastError } from "@/utils/toast";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Checkbox } from "@/components/tempo/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import {
    TrendingUp,
    Search,
    Package,
    AlertTriangle,
    Clock,
    X,
    Check,
    Plus,
    Minus,
    Hash,
} from "lucide-react";

export default function BulkUpdateModal({ 
    open, 
    onClose, 
    inventoryItems = [] 
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedBatches, setSelectedBatches] = useState({}); // {itemId: [batchIds]}
    const [availableBatches, setAvailableBatches] = useState({}); // {itemId: [batches]}
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [updateType, setUpdateType] = useState("add");
    const [updateValue, setUpdateValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBatches, setLoadingBatches] = useState({});
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // New fields for enhanced bulk update
    const [minimumStock, setMinimumStock] = useState("");
    const [maximumStock, setMaximumStock] = useState("");
    const [supplier, setSupplier] = useState("");
    const [reason, setReason] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    // Filter items based on search term and remove duplicates
    useEffect(() => {
        // Group items by name to remove duplicates
        const uniqueItems = {};
        inventoryItems.forEach(item => {
            if (item.status !== 0) { // Not archived
                const key = item.name.toLowerCase();
                if (!uniqueItems[key] || item.id > uniqueItems[key].id) {
                    uniqueItems[key] = item;
                }
            }
        });

        const filtered = Object.values(uniqueItems).filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.category?.name || 'Uncategorized').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.manufacturer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.supplier || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesSearch;
        });
        
        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchTerm, inventoryItems]);

    // Load batches for selected item
    const loadBatchesForItem = async (itemId) => {
        if (!itemId) {
            setAvailableBatches(prev => ({ ...prev, [itemId]: [] }));
            return;
        }
        
        setLoadingBatches(prev => ({ ...prev, [itemId]: true }));
        try {
            const response = await fetch(`/pharmacist/inventory/item/${itemId}/batches`);
            if (response.ok) {
                const batches = await response.json();
                console.log('Loaded batches for item', itemId, ':', batches);
                setAvailableBatches(prev => ({ 
                    ...prev, 
                    [itemId]: Array.isArray(batches) ? batches : [] 
                }));
            } else {
                console.error('Failed to load batches:', response.status);
                setAvailableBatches(prev => ({ ...prev, [itemId]: [] }));
            }
        } catch (error) {
            console.error('Error loading batches:', error);
            setAvailableBatches(prev => ({ ...prev, [itemId]: [] }));
        } finally {
            setLoadingBatches(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleItemSelect = (item, checked) => {
        if (!item || !item.id) {
            console.error('Invalid item selected:', item);
            return;
        }
        
        console.log('Selecting item:', item, 'checked:', checked);
        
        if (checked) {
            setSelectedItems(prev => [...prev, item]);
            loadBatchesForItem(item.id);
        } else {
            setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
            setSelectedBatches(prev => {
                const newBatches = { ...prev };
                delete newBatches[item.id];
                return newBatches;
            });
        }
    };

    const handleBatchSelect = (itemId, batchId, checked) => {
        setSelectedBatches(prev => {
            const currentBatches = prev[itemId] || [];
            if (checked) {
                return {
                    ...prev,
                    [itemId]: [...currentBatches, batchId]
                };
            } else {
                return {
                    ...prev,
                    [itemId]: currentBatches.filter(id => id !== batchId)
                };
            }
        });
    };


    const handleBulkUpdate = async () => {
        if (selectedItems.length === 0) {
            toastError("No Items Selected", "Please select at least one item to update.");
            return;
        }

        // Enhanced validation matching AddItemForm
        const minStock = parseInt(minimumStock) || 0;
        const maxStock = parseInt(maximumStock) || 0;
        const newErrors = {};

        if (minStock < 0) {
            newErrors.minimum_stock = "Minimum stock level cannot be negative.";
        }
        if (maxStock < 0) {
            newErrors.maximum_stock = "Maximum stock level cannot be negative.";
        }
        
        // Only validate if both fields have meaningful values
        if (minStock > 0 && maxStock > 0 && minStock > maxStock) {
            newErrors.minimum_stock = "Minimum stock level cannot be greater than maximum stock level.";
        }

        // Validate Expiry Date
        if (!expiryDate || expiryDate.trim() === "") {
            newErrors.expiry_date = "Expiry date is required.";
        } else {
            // Check if expiry date is in the past
            const expiryDateObj = new Date(expiryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (expiryDateObj < today) {
                newErrors.expiry_date = "Expiry date cannot be in the past.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            toast.error('Please fix the validation errors before submitting.');
            return;
        }

        setValidationErrors({});

        if (!updateValue || isNaN(parseInt(updateValue)) || parseInt(updateValue) <= 0) {
            toastError("Invalid Quantity", "Please enter a valid quantity value.");
            return;
        }

        // Validate required fields
        if (!minimumStock || isNaN(parseInt(minimumStock)) || parseInt(minimumStock) < 0) {
            toastError("Invalid Minimum Stock", "Please enter a valid minimum stock level.");
            return;
        }

        if (!maximumStock || isNaN(parseInt(maximumStock)) || parseInt(maximumStock) < 0) {
            toastError("Invalid Maximum Stock", "Please enter a valid maximum stock level.");
            return;
        }

        if (!supplier || supplier.trim() === "") {
            toastError("Missing Supplier", "Please enter a supplier name.");
            return;
        }

        // Validate that maximum stock is greater than minimum stock
        if (parseInt(maximumStock) <= parseInt(minimumStock)) {
            toastError("Invalid Stock Levels", "Maximum stock level must be greater than minimum stock level.");
            return;
        }

        setIsLoading(true);

        try {
            const updateAmount = parseInt(updateValue);
            const updateData = [];

        // Validate selections before processing
        const itemsWithBatches = [];
        const itemsWithoutBatches = [];
        let totalSelectedBatches = 0;

        selectedItems.forEach(item => {
            const selectedItemBatches = selectedBatches[item.id] || [];
            totalSelectedBatches += selectedItemBatches.length;
            
            if (selectedItemBatches.length > 0) {
                itemsWithBatches.push({ item, selectedBatches: selectedItemBatches });
            } else {
                itemsWithoutBatches.push(item);
            }
        });

        // Validation: If any batches are selected, only process items with selected batches
        if (totalSelectedBatches > 0 && itemsWithoutBatches.length > 0) {
            const errorMessage = `You have selected ${totalSelectedBatches} batch(es) but ${itemsWithoutBatches.length} item(s) have no batches selected. Please either select batches for all items or deselect items that don't have batches selected.`;
            toastError(
                "Batch Selection Error",
                errorMessage
            );
            setIsLoading(false);
            return;
        }

        // Prepare update data for all selected items and their batches
        selectedItems.forEach(item => {
            const itemBatches = availableBatches[item.id] || [];
            const selectedItemBatches = selectedBatches[item.id] || [];
            
            // If no batches are selected for this item, update the item's overall stock
            if (selectedItemBatches.length === 0) {
                const currentStock = item.stock?.stocks || 0;
                let newQuantity = currentStock;

                switch (updateType) {
                    case "add":
                        newQuantity = currentStock + updateAmount;
                        break;
                    case "subtract":
                        newQuantity = Math.max(0, currentStock - updateAmount);
                        break;
                    default:
                        newQuantity = currentStock;
                }

                updateData.push({
                    item_id: item.id,
                    current_quantity: currentStock,
                    new_quantity: newQuantity,
                    update_type: updateType,
                    update_amount: updateAmount,
                    is_batch_update: false
                });
            } else {
                // Update individual batches
                selectedItemBatches.forEach(batchId => {
                    const batch = itemBatches.find(b => String(b.batch_id || b.id) === String(batchId));
                    if (batch) {
                        const currentBatchStock = batch.available_quantity || 0;
                        let newBatchQuantity = currentBatchStock;

                        switch (updateType) {
                            case "add":
                                newBatchQuantity = currentBatchStock + updateAmount;
                                break;
                            case "subtract":
                                newBatchQuantity = Math.max(0, currentBatchStock - updateAmount);
                                break;
                            default:
                                newBatchQuantity = currentBatchStock;
                        }

                        updateData.push({
                            item_id: item.id,
                            batch_id: batch.batch_id || batch.id,
                            batch_number: batch.batch_number,
                            current_quantity: currentBatchStock,
                            new_quantity: newBatchQuantity,
                            update_type: updateType,
                            update_amount: updateAmount,
                            is_batch_update: true
                        });
                    } else {
                        console.warn(`Batch ${batchId} not found for item ${item.name}`);
                    }
                });
            }
        });

            if (updateData.length === 0) {
                toastError(
                    "No Items to Update",
                    "No valid items found for update. Please check your selections and try again."
                );
                setIsLoading(false);
                return;
            }

            // Log the update data for debugging
            console.log('Bulk Update Data:', {
                totalItems: updateData.length,
                updateType,
                updateAmount,
                items: updateData.map(item => ({
                    item_id: item.item_id,
                    is_batch_update: item.is_batch_update,
                    batch_number: item.batch_number || 'N/A',
                    current_quantity: item.current_quantity,
                    new_quantity: item.new_quantity
                }))
            });

            // Send bulk update request
            router.post(route('pharmacist.inventory.update.bulk'), {
                items: updateData,
                update_type: updateType,
                update_amount: updateValue,
                update_date: new Date().toISOString().split('T')[0],
                minimum_stock: minimumStock || null,
                maximum_stock: maximumStock || null,
                supplier: supplier || null,
                reason: reason || null,
                expiry_date: expiryDate || null
            }, {
                onSuccess: (page) => {
                    console.log('Bulk update successful:', page);
                    toastSuccess(
                        "Bulk Update Successful",
                        `Bulk update completed successfully! Updated ${updateData.length} item(s).`,
                        "update"
                    );
                    handleClose();
                    // Auto-refresh the page data - use visit to refresh the current page
                    router.visit(window.location.pathname, { method: 'get' });
                },
                onError: (errors) => {
                    console.error('Bulk update error:', errors);
                    
                    // Handle specific error types
                    if (errors && typeof errors === 'object') {
                        const errorMessages = [];
                        
                        // Handle validation errors
                        if (errors.minimum_stock) {
                            errorMessages.push(`Minimum stock: ${Array.isArray(errors.minimum_stock) ? errors.minimum_stock[0] : errors.minimum_stock}`);
                        }
                        if (errors.maximum_stock) {
                            errorMessages.push(`Maximum stock: ${Array.isArray(errors.maximum_stock) ? errors.maximum_stock[0] : errors.maximum_stock}`);
                        }
                        if (errors.supplier) {
                            errorMessages.push(`Supplier: ${Array.isArray(errors.supplier) ? errors.supplier[0] : errors.supplier}`);
                        }
                        if (errors.items) {
                            errorMessages.push(`Items: ${Array.isArray(errors.items) ? errors.items[0] : errors.items}`);
                        }
                        if (errors.update_value) {
                            errorMessages.push(`Update value: ${Array.isArray(errors.update_value) ? errors.update_value[0] : errors.update_value}`);
                        }
                        
                        if (errorMessages.length > 0) {
                            toastError(
                                "Validation Errors",
                                errorMessages.join(', ')
                            );
                        } else {
                            toastError(
                                "Bulk Update Failed",
                                "Please check your inputs and try again."
                            );
                        }
                    } else if (typeof errors === 'string') {
                        toastError("Bulk Update Error", errors);
                    } else {
                        toastError(
                            "Bulk Update Failed",
                            "An unexpected error occurred. Please try again."
                        );
                    }
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Bulk update error:', error);
            toastError(
                "Bulk Update Error",
                "An unexpected error occurred during bulk update. Please try again."
            );
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedItems([]);
        setSelectedBatches({});
        setAvailableBatches({});
        setUpdateType("add");
        setUpdateValue("");
        setSearchTerm("");
        setMinimumStock("");
        setMaximumStock("");
        setSupplier("");
        setReason("");
        setExpiryDate("");
        setCurrentPage(1);
        setValidationErrors({});
        onClose();
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getItemStatus = (item) => {
        const quantity = item.stock?.stocks || 0;
        const minStock = item.minimum_stock || 10;
        
        if (quantity === 0) return 'out_of_stock';
        if (quantity <= minStock) return 'low_stock';
        return 'in_stock';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "in_stock":
                return "bg-green-100 text-green-800 border-green-200";
            case "low_stock":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "out_of_stock":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "in_stock":
                return "In Stock";
            case "low_stock":
                return "Low Stock";
            case "out_of_stock":
                return "Out of Stock";
            default:
                return "Unknown";
        }
    };

    const getUpdateTypeIcon = (type) => {
        switch (type) {
            case "add":
                return <Plus className="h-4 w-4 text-green-600" />;
            case "subtract":
                return <Minus className="h-4 w-4 text-red-600" />;
            default:
                return <TrendingUp className="h-4 w-4" />;
        }
    };

    const getUpdateTypeText = (type) => {
        switch (type) {
            case "add":
                return "Add to Stock";
            case "subtract":
                return "Subtract from Stock";
            default:
                return "Update Stock";
        }
    };

    const calculateNewQuantity = (currentStock) => {
        if (!updateValue) return currentStock;
        
        const updateAmount = parseInt(updateValue) || 0;
        
        switch (updateType) {
            case "add":
                return currentStock + updateAmount;
            case "subtract":
                return Math.max(0, currentStock - updateAmount);
            default:
                return currentStock;
        }
    };

    const getTotalSelectedBatches = () => {
        return Object.values(selectedBatches).reduce((total, batches) => total + batches.length, 0);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Bulk Update Stock
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto max-h-[70vh]">
                    {/* Update Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Update Type
                            </label>
                            <Select value={updateType} onValueChange={setUpdateType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select update type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="add">
                                        <div className="flex items-center gap-2">
                                            <Plus className="h-4 w-4 text-green-600" />
                                            Add to Stock
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity Value *
                            </label>
                            <Input
                                type="number"
                                min="1"
                                value={updateValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setUpdateValue(value);
                                    // Real-time validation
                                    const numValue = parseInt(value) || 0;
                                    const newErrors = { ...validationErrors };
                                    if (numValue <= 0) {
                                        newErrors.update_value = "Quantity value must be greater than 0.";
                                    } else {
                                        delete newErrors.update_value;
                                    }
                                    setValidationErrors(newErrors);
                                }}
                                placeholder="Enter quantity"
                                className="w-full"
                                required
                            />
                            {validationErrors.update_value && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.update_value}</p>
                            )}
                        </div>
                    </div>

                    {/* Additional Update Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Stock Level *
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={minimumStock}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setMinimumStock(value);
                                    // Real-time validation
                                    const numValue = parseInt(value) || 0;
                                    const maxValue = parseInt(maximumStock) || 0;
                                    const newErrors = { ...validationErrors };
                                    if (numValue < 0) {
                                        newErrors.minimum_stock = "Minimum stock level cannot be negative.";
                                    } else if (maxValue > 0 && numValue >= maxValue) {
                                        newErrors.minimum_stock = "Minimum stock level must be less than maximum stock level.";
                                    } else {
                                        delete newErrors.minimum_stock;
                                    }
                                    setValidationErrors(newErrors);
                                }}
                                placeholder="Enter minimum stock level"
                                className="w-full"
                                required
                            />
                            {validationErrors.minimum_stock && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.minimum_stock}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maximum Stock Level *
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={maximumStock}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setMaximumStock(value);
                                    // Real-time validation
                                    const numValue = parseInt(value) || 0;
                                    const minValue = parseInt(minimumStock) || 0;
                                    const newErrors = { ...validationErrors };
                                    if (numValue < 0) {
                                        newErrors.maximum_stock = "Maximum stock level cannot be negative.";
                                    } else if (minValue > 0 && numValue <= minValue) {
                                        newErrors.maximum_stock = "Maximum stock level must be greater than minimum stock level.";
                                    } else {
                                        delete newErrors.maximum_stock;
                                    }
                                    setValidationErrors(newErrors);
                                }}
                                placeholder="Enter maximum stock level"
                                className="w-full"
                                required
                            />
                            {validationErrors.maximum_stock && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.maximum_stock}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Supplier *
                            </label>
                            <Input
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                placeholder="Enter supplier name"
                                className="w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason
                            </label>
                            <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Update reason (optional)"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date *
                            </label>
                            <Input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => {
                                    setExpiryDate(e.target.value);
                                    // Real-time validation
                                    const newErrors = { ...validationErrors };
                                    if (e.target.value && new Date(e.target.value) < new Date().setHours(0, 0, 0, 0)) {
                                        newErrors.expiry_date = "Expiry date cannot be in the past.";
                                    } else {
                                        delete newErrors.expiry_date;
                                    }
                                    setValidationErrors(newErrors);
                                }}
                                placeholder="Select expiry date"
                                className="w-full"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {validationErrors.expiry_date && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.expiry_date}</p>
                            )}
                        </div>
                    </div>

                    {/* Item Selection */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">Select Items</h3>
                        <div className="space-y-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search items by name, category, manufacturer, or supplier..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            
                            {/* Selection Count */}
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-sm">
                                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                                </Badge>
                                <span className="text-sm text-gray-600">
                                    {getTotalSelectedBatches()} batch{getTotalSelectedBatches() !== 1 ? 'es' : ''} selected
                                </span>
                            </div>
                            
                            {/* Batch Selection Summary */}
                            {getTotalSelectedBatches() > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Batch Selection Summary</span>
                                    </div>
                                    <div className="text-sm text-blue-700">
                                        {Object.entries(selectedBatches).map(([itemId, batches]) => {
                                            const item = selectedItems.find(i => i.id === itemId);
                                            return (
                                                <div key={itemId} className="mb-1">
                                                    <strong>{item?.name}</strong>: {batches.length} batch(es) selected
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {currentItems.map((item) => {
                            const isSelected = selectedItems.some(selected => selected.id === item.id);
                            const status = getItemStatus(item);
                            const currentStock = item.stock?.stocks || 0;
                            const newQuantity = calculateNewQuantity(currentStock);
                            
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 border rounded-lg transition-all ${
                                        isSelected 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleItemSelect(item, checked)}
                                            className="h-4 w-4"
                                        />
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-5 w-5 text-gray-600" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                    <div className="text-sm text-gray-500 space-y-1">
                                                        <p>{item.category?.name || 'Uncategorized'} • {item.manufacturer || 'Unknown Manufacturer'}</p>
                                                        <p>Supplier: {item.supplier || 'Not Set'} • Min: {item.minimum_stock || 'Not Set'} • Max: {item.maximum_stock || 'Not Set'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(status)}>
                                                {getStatusText(status)}
                                            </Badge>
                                            
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600">
                                                    {currentStock} → {newQuantity} units
                                                </div>
                                                {isSelected && updateValue && (
                                                    <Badge 
                                                        variant="outline" 
                                                        className={
                                                            newQuantity > currentStock 
                                                                ? 'text-green-600 border-green-300' 
                                                                : newQuantity < currentStock 
                                                                    ? 'text-red-600 border-red-300'
                                                                    : 'text-blue-600 border-blue-300'
                                                        }
                                                    >
                                                        +
                                                        {updateValue}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {filteredItems.length > itemsPerPage && (
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1"
                                >
                                    Previous
                                </Button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Batch Selection for Selected Items */}
                    {selectedItems.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3">Select Batches for Each Item</h3>
                            <div className="space-y-4">
                                {selectedItems.map((item) => {
                                    const itemBatches = availableBatches[item.id] || [];
                                    const selectedItemBatches = selectedBatches[item.id] || [];
                                    const isLoading = loadingBatches[item.id];
                                    
                                    return (
                                        <div key={item.id} className="p-3 bg-white border rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                                            
                                            {isLoading ? (
                                                <div className="text-center py-4">Loading batches...</div>
                                            ) : itemBatches.length > 0 ? (
                                                <div className="space-y-2">
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        Select batches to update:
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {itemBatches.map((batch) => {
                                                            const batchId = String(batch.batch_id || batch.id);
                                                            const isSelected = selectedItemBatches.includes(batchId);
                                                            const currentStock = batch.available_quantity || 0;
                                                            const newQuantity = calculateNewQuantity(currentStock);
                                                            
                                                            return (
                                                                <div
                                                                    key={batchId}
                                                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                                                        isSelected 
                                                                            ? 'border-blue-500 bg-blue-50' 
                                                                            : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                                    onClick={() => handleBatchSelect(item.id, batchId, !isSelected)}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                                                            isSelected
                                                                                ? 'bg-blue-500 border-blue-500'
                                                                                : 'border-gray-300'
                                                                        }`}>
                                                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                                                        </div>
                                                                        
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <Hash className="h-4 w-4" />
                                                                                <span className="font-medium">
                                                                                    {batch.batch_number || 'N/A'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {currentStock} → {newQuantity} units
                                                                                {batch.expiry_date && batch.expiry_date !== 'N/A' && (
                                                                                    <span className="ml-2">
                                                                                        (Exp: {new Date(batch.expiry_date).toLocaleDateString()})
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    No batches available for this item
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {selectedItems.length > 0 && getTotalSelectedBatches() > 0 && updateValue && minimumStock && maximumStock && supplier && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Update Summary</h4>
                            <div className="space-y-1 text-sm text-blue-800">
                                <p>Items: {selectedItems.length}</p>
                                <p>Batches: {getTotalSelectedBatches()}</p>
                                <p>Update Type: {getUpdateTypeText(updateType)}</p>
                                <p>Update Value: {updateValue}</p>
                                <p>Min Stock: {minimumStock}</p>
                                <p>Max Stock: {maximumStock}</p>
                                <p>Supplier: {supplier}</p>
                                {reason && <p>Reason: {reason}</p>}
                                <div className="mt-2">
                                    <p className="text-xs">
                                        Total updates: {getTotalSelectedBatches()} batch{getTotalSelectedBatches() !== 1 ? 'es' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBulkUpdate}
                        disabled={
                            selectedItems.length === 0 || 
                            getTotalSelectedBatches() === 0 || 
                            !updateValue || 
                            !minimumStock || 
                            !maximumStock || 
                            !supplier || 
                            isLoading
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Update {getTotalSelectedBatches()} Batch{getTotalSelectedBatches() !== 1 ? 'es' : ''}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
