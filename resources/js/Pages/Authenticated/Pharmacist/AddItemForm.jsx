import React, { useState } from "react";
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
    Package, 
    Plus, 
    Calendar, 
    Hash, 
    Tag, 
    Building2, 
    MapPin, 
    ToggleLeft,
    ToggleRight
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

const AddItemForm = ({ open, onClose, categories = [] }) => {
    const [enableReordering, setEnableReordering] = useState(false);
    const [trackBatches, setTrackBatches] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
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
        enable_auto_reorder: false,
        track_individual_batches: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === 'checkbox' ? checked : value);
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
        if (data.minimum_stock < 0) {
            return;
        }
        if (data.maximum_stock < 0) {
            return;
        }
        if (data.minimum_stock > data.maximum_stock) {
            return;
        }
        
        post(route("pharmacist.inventory.item.add"), {
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
        { value: "boxes", label: "Boxes" },
        { value: "bottles", label: "Bottles" },
        { value: "tubes", label: "Tubes" },
        { value: "strips", label: "Strips" },
        { value: "vials", label: "Vials" },
        { value: "capsules", label: "Capsules" },
        { value: "tablets", label: "Tablets" },
    ];

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
                                        placeholder="e.g., PharmaCorp"
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
                                        {unitOptions.map((unit) => (
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
                                    />
                                </div>
                                {errors.expiry_date && (
                                    <p className="text-sm text-red-600">{errors.expiry_date}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Advanced Settings
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <Label htmlFor="enable_auto_reorder" className="text-sm font-medium">
                                        Enable Automatic Reordering
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Automatically create purchase orders when stock falls below minimum level
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEnableReordering(!enableReordering)}
                                    className="ml-4"
                                >
                                    {enableReordering ? (
                                        <ToggleRight className="h-6 w-6 text-gray-900" />
                                    ) : (
                                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <Label htmlFor="track_individual_batches" className="text-sm font-medium">
                                        Track Individual Batches
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Enable detailed batch tracking for compliance and traceability
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setTrackBatches(!trackBatches)}
                                    className="ml-4"
                                >
                                    {trackBatches ? (
                                        <ToggleRight className="h-6 w-6 text-gray-900" />
                                    ) : (
                                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                                    )}
                                </button>
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
