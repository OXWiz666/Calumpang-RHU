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
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
    Calendar, 
    Hash, 
    Building2
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

const EditItemModal = ({ open, onClose, item, categories = [] }) => {
    const [formData, setFormData] = useState({
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
    
    const [availableBatches, setAvailableBatches] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(false);

    const fetchAvailableBatches = async () => {
        if (!item?.id) return;
        
        setLoadingBatches(true);
        try {
            const response = await fetch(`/pharmacist/inventory/item/${item.id}/batches?t=${Date.now()}`);
            if (response.ok) {
                const batches = await response.json();
                setAvailableBatches(batches);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
        } finally {
            setLoadingBatches(false);
        }
    };

    useEffect(() => {
        if (item) {
            setFormData({
                itemname: item.name || "Invalid Name",
                categoryid: item.categoryId || "Invalid Category",
                manufacturer: item.manufacturer || "Invalid Manufacturer",
                description: item.description || "Invalid Description",
                unit_type: item.unit || "Invalid Unit",
                storage_location: item.storageLocation || "Invalid Storage Location",
                batch_number: (() => {
                    // For new batch structure, use first batch number or concatenate all
                    if (item.batches && item.batches.length > 0) {
                        return item.batches[0].batchNumber || "Invalid Batch Number";
                    }
                    // Fallback for old structure
                    return item.batchNumber || "Invalid Batch Number";
                })(),
                expiry_date: (() => {
                    // For new batch structure, use earliest expiry date
                    if (item.batches && item.batches.length > 0) {
                        const earliestBatch = item.batches.reduce((earliest, batch) => {
                            if (!earliest || batch.expiryDate === 'N/A') return batch;
                            if (earliest.expiryDate === 'N/A') return batch;
                            try {
                                const batchDate = new Date(batch.expiryDate);
                                const earliestDate = new Date(earliest.expiryDate);
                                if (isNaN(batchDate.getTime()) || isNaN(earliestDate.getTime())) return earliest;
                                return batchDate < earliestDate ? batch : earliest;
                            } catch (error) {
                                return earliest;
                            }
                        }, null);
                        
                        if (earliestBatch && earliestBatch.expiryDate && earliestBatch.expiryDate !== 'N/A') {
                            try {
                                const date = new Date(earliestBatch.expiryDate);
                                if (!isNaN(date.getTime())) {
                                    return date.toISOString().split('T')[0];
                                }
                            } catch (error) {
                                console.warn('Invalid expiry date in EditItemModal:', earliestBatch.expiryDate);
                            }
                        }
                    }
                    // Fallback for old structure or invalid dates
                    if (item.expiryDate && item.expiryDate !== 'N/A' && item.expiryDate !== 'Invalid Date') {
                        try {
                            const date = new Date(item.expiryDate);
                            if (!isNaN(date.getTime())) {
                                return date.toISOString().split('T')[0];
                            }
                        } catch (error) {
                            console.warn('Invalid expiry date in EditItemModal:', item.expiryDate);
                        }
                    }
                    return "";
                })(),
            });
            
            // Fetch available batches when modal opens
            if (open) {
                fetchAvailableBatches();
            }
        }
    }, [item, open]);

    const { data, setData, put, processing, errors } = useForm(formData);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
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
        if (data.expiry_date && new Date(data.expiry_date) <= new Date()) {
            return;
        }
        
        put(route("pharmacist.inventory.item.update", item.id), {
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                console.error("Validation errors:", errors);
            }
        });
    };

    const unitOptions = [
        { value: "pieces", label: "Pieces" },
        { value: "tablets", label: "Tablets" },
        { value: "capsules", label: "Capsules" },
        { value: "bottles", label: "Bottles" },
        { value: "vials", label: "Vials" },
        { value: "tubes", label: "Tubes" },
        { value: "boxes", label: "Boxes" },
        { value: "packs", label: "Packs" },
    ];

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Edit Item
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Update the information for this inventory item
                    </p>
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
                                    name="item name"
                                    value={data.itemname}
                                    onChange={handleChange}
                                    placeholder="Enter item name"
                                    className="w-full"
                                />
                                {errors.itemname && (
                                    <p className="text-sm text-red-600">{errors.itemname}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categoryid" className="text-sm font-medium">
                                    Category *
                                </Label>
                                <Select
                                    value={data.categoryid}
                                    onValueChange={(value) => handleSelectChange('categoryid', value)}
                                >
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
                                        placeholder="Enter manufacturer"
                                        className="w-full pl-10"
                                    />
                                </div>
                                {errors.manufacturer && (
                                    <p className="text-sm text-red-600">{errors.manufacturer}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit_type" className="text-sm font-medium">
                                    Unit of Measure *
                                </Label>
                                <Select
                                    value={data.unit_type}
                                    onValueChange={(value) => handleSelectChange('unit_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unitOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.unit_type && (
                                    <p className="text-sm text-red-600">{errors.unit_type}</p>
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
                                placeholder="Enter item description"
                                rows={3}
                                className="w-full"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Stock Information removed as requested */}

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
                                    <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                    <Select value={data.batch_number} onValueChange={(value) => {
                                        if (value === "new_batch") {
                                            setData("batch_number", "");
                                        } else {
                                            setData("batch_number", value);
                                        }
                                    }}>
                                        <SelectTrigger className="w-full pl-10">
                                            <SelectValue placeholder={loadingBatches ? "Loading batches..." : "Select a batch number"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableBatches.length > 0 ? (
                                                <>
                                                    {availableBatches.map((batch) => (
                                                        <SelectItem key={batch.batch_number} value={batch.batch_number}>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{batch.batch_number}</span>
                                                                {batch.expiry_date && (
                                                                    <span className="text-xs text-gray-500">
                                                                        Expires: {new Date(batch.expiry_date).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="new_batch">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">+ Add New Batch</span>
                                                            <span className="text-xs text-gray-500">Create a new batch number</span>
                                                        </div>
                                                    </SelectItem>
                                                </>
                                            ) : (
                                                <SelectItem value="new_batch">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">+ Add New Batch</span>
                                                        <span className="text-xs text-gray-500">Create a new batch number</span>
                                                    </div>
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {(availableBatches.length === 0 || data.batch_number === "") && !loadingBatches && (
                                    <div className="mt-1">
                                        <Input
                                            id="batch_number_input"
                                            value={data.batch_number}
                                            onChange={handleChange}
                                            placeholder="Enter new batch number (e.g., RX12001121)"
                                            className="pl-10"
                                        />
                                    </div>
                                )}
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
                            {processing ? "Updating..." : "Update Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditItemModal;
