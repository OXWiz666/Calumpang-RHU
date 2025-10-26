import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { useForm, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { 
    Package, 
    Plus, 
    Calendar, 
    Hash, 
    Tag, 
    Building2, 
    MapPin
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import { UNIT_OPTIONS } from "@/constants/unitOptions";

const AddItemForm = ({ open, onClose, categories = [] }) => {
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        itemname: "",
        categoryid: "",
        manufacturer: "",
        description: "",
        quantity: 0,
        unit_type: "",
        minimum_stock: 0,
        maximum_stock: 0,
        storage_location: "",
        batch_number: "",
        expiry_date: "",
    });

    // Clear errors when modal opens/closes
    useEffect(() => {
        if (open) {
            clearErrors();
            setValidationErrors({});
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setData(name, newValue);
        
        // Real-time validation for minimum and maximum stock levels
        if (type === 'number' && (name === 'minimum_stock' || name === 'maximum_stock')) {
            const numValue = parseInt(value) || 0;
            const newErrors = { ...validationErrors };
            
            // Clear existing errors for both fields when user types
            delete newErrors.minimum_stock;
            delete newErrors.maximum_stock;
            
            if (numValue < 0) {
                newErrors[name] = `${name === 'minimum_stock' ? 'Minimum' : 'Maximum'} stock level cannot be negative.`;
            } else {
                // Check if minimum > maximum or vice versa
                const minValue = name === 'minimum_stock' ? numValue : parseInt(data.minimum_stock) || 0;
                const maxValue = name === 'maximum_stock' ? numValue : parseInt(data.maximum_stock) || 0;
                
                if (minValue > 0 && maxValue > 0 && minValue >= maxValue) {
                    if (name === 'minimum_stock') {
                        newErrors.minimum_stock = 'Minimum stock level must be less than maximum stock level.';
                    } else {
                        newErrors.maximum_stock = 'Maximum stock level must be greater than minimum stock level.';
                    }
                }
            }
            
            setValidationErrors(newErrors);
        }
        
        // Real-time validation for quantity against maximum stock level
        if (type === 'number' && name === 'quantity') {
            const numValue = parseInt(value) || 0;
            const maxStock = parseInt(data.maximum_stock) || 0;
            const newErrors = { ...validationErrors };
            
            // Clear existing quantity error
            delete newErrors.quantity;
            
            if (numValue < 0) {
                newErrors.quantity = 'Quantity cannot be negative.';
            } else if (maxStock > 0 && numValue > maxStock) {
                newErrors.quantity = `Quantity cannot exceed maximum stock level of ${maxStock}`;
            }
            
            setValidationErrors(newErrors);
        }
        
        // If maximum stock changes, re-validate quantity
        if (type === 'number' && name === 'maximum_stock') {
            const numValue = parseInt(value) || 0;
            const quantity = parseInt(data.quantity) || 0;
            const newErrors = { ...validationErrors };
            
            if (numValue > 0 && quantity > numValue) {
                newErrors.quantity = `Quantity cannot exceed maximum stock level of ${numValue}`;
            } else {
                delete newErrors.quantity;
            }
            
            setValidationErrors(newErrors);
        }
    };

    const handleSelectChange = (name, value) => {
        setData(name, value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!data.itemname.trim()) {
            return;
        }
        if (!data.categoryid) {
            return;
        }
        if (!data.unit_type) {
            return;
        }
        if (data.quantity <= 0) {
            return;
        }
        if (!data.batch_number.trim()) {
            return;
        }
        if (!data.expiry_date) {
            return;
        }
        if (new Date(data.expiry_date) <= new Date()) {
            return;
        }
        // Check for client-side validation errors
        if (Object.keys(validationErrors).length > 0) {
            toast.error('Please fix the validation errors before submitting.');
            return;
        }
        
        // Additional validation: Minimum stock cannot be greater than maximum stock
        const minStock = parseInt(data.minimum_stock) || 0;
        const maxStock = parseInt(data.maximum_stock) || 0;
        const quantity = parseInt(data.quantity) || 0;
        
        // Only validate if both fields have meaningful values
        if (minStock > 0 && maxStock > 0 && minStock > maxStock) {
            setValidationErrors({ minimum_stock: 'Minimum stock level cannot be greater than maximum stock level.' });
            toast.error('Minimum stock level cannot be greater than maximum stock level.');
            return;
        }
        
        // Additional validation: Quantity cannot exceed maximum stock level
        if (maxStock > 0 && quantity > maxStock) {
            setValidationErrors({ quantity: `Quantity cannot exceed maximum stock level of ${maxStock}` });
            toast.error(`Quantity cannot exceed maximum stock level of ${maxStock}`);
            return;
        }
        
        post(route("pharmacist.inventory.item.add"), {
            onSuccess: () => {
                console.log('Item added successfully');
                toast.success('Item added successfully!');
                onClose();
                // Auto-refresh the page data - use visit to refresh the current page
                router.visit(window.location.pathname, { method: 'get' });
            },
            onError: (errors) => {
                console.error("Validation errors:", errors);
                // Display error toast
                if (errors.itemname) {
                    toast.error(errors.itemname);
                } else {
                    toast.error('Failed to add item. Please check all fields.');
                }
            }
        });
    };

    // Using shared unit options from constants

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Plus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Add New Inventory Item</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Enter the details for the new inventory item. All required fields must be completed.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Basic Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="itemname" className="text-sm font-medium">
                                    Item Name *
                                </Label>
                                <Input
                                    id="itemname"
                                    name="itemname"
                                    value={data.itemname}
                                    onChange={handleChange}
                                    placeholder="e.g., Amoxicillin 500mg"
                                    className="w-full"
                                    required
                                />
                                {errors.itemname && (
                                    <p className="text-sm text-red-600">{errors.itemname}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categoryid" className="text-sm font-medium">
                                    Category *
                                </Label>
                                <Select value={data.categoryid} onValueChange={(value) => handleSelectChange('categoryid', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryid && (
                                    <p className="text-sm text-red-600">{errors.categoryid}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label htmlFor="manufacturer" className="text-sm font-medium">
                                    Manufacturer
                                </Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="manufacturer"
                                        name="manufacturer"
                                        value={data.manufacturer}
                                        onChange={handleChange}
                                        placeholder="e.g., City Health Office"
                                        className="w-full pl-10"
                                    />
                                </div>
                                {errors.manufacturer && (
                                    <p className="text-sm text-red-600">{errors.manufacturer}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                placeholder="Enter item description, usage instructions, or notes"
                                className="w-full min-h-[80px] resize-none"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Stock Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Stock Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-sm font-medium">
                                    Current Quantity *
                                </Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    value={data.quantity}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full"
                                    required
                                />
                                {errors.quantity && (
                                    <p className="text-sm text-red-600">{errors.quantity}</p>
                                )}
                                {validationErrors.quantity && (
                                    <p className="text-sm text-red-600">{validationErrors.quantity}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit_type" className="text-sm font-medium">
                                    Unit of Measure *
                                </Label>
                                <Select value={data.unit_type} onValueChange={(value) => handleSelectChange('unit_type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNIT_OPTIONS.map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.unit_type && (
                                    <p className="text-sm text-red-600">{errors.unit_type}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label htmlFor="storage_location" className="text-sm font-medium">
                                    Storage Location
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="storage_location"
                                        name="storage_location"
                                        value={data.storage_location}
                                        onChange={handleChange}
                                        placeholder="e.g., A-1-01"
                                        className="w-full pl-10"
                                    />
                                </div>
                                {errors.storage_location && (
                                    <p className="text-sm text-red-600">{errors.storage_location}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minimum_stock" className="text-sm font-medium">
                                    Minimum Stock Level
                                </Label>
                                <Input
                                    id="minimum_stock"
                                    name="minimum_stock"
                                    type="number"
                                    value={data.minimum_stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full"
                                />
                                {errors.minimum_stock && (
                                    <p className="text-sm text-red-600">{errors.minimum_stock}</p>
                                )}
                                {validationErrors.minimum_stock && (
                                    <p className="text-sm text-red-600">{validationErrors.minimum_stock}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maximum_stock" className="text-sm font-medium">
                                    Maximum Stock Level
                                </Label>
                                <Input
                                    id="maximum_stock"
                                    name="maximum_stock"
                                    type="number"
                                    value={data.maximum_stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full"
                                />
                                {errors.maximum_stock && (
                                    <p className="text-sm text-red-600">{errors.maximum_stock}</p>
                                )}
                                {validationErrors.maximum_stock && (
                                    <p className="text-sm text-red-600">{validationErrors.maximum_stock}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Batch & Expiry Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Batch & Expiry Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="batch_number" className="text-sm font-medium">
                                    Batch/Lot Number
                                </Label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="batch_number"
                                        name="batch_number"
                                        value={data.batch_number}
                                        onChange={handleChange}
                                        placeholder="e.g., RX12001121"
                                        className="w-full pl-10"
                                    />
                                </div>
                                {errors.batch_number && (
                                    <p className="text-sm text-red-600">{errors.batch_number}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiry_date" className="text-sm font-medium">
                                    Expiry Date
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="expiry_date"
                                        name="expiry_date"
                                        type="date"
                                        value={data.expiry_date}
                                        onChange={handleChange}
                                        className="w-full pl-10"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                {errors.expiry_date && (
                                    <p className="text-sm text-red-600">{errors.expiry_date}</p>
                                )}
                            </div>
                        </div>
                    </div>


                    <DialogFooter className="flex gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex-1"
                            style={{ backgroundColor: '#2C3E50' }}
                        >
                            {processing ? "Adding..." : "Add Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddItemForm;
