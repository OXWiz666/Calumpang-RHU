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
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
    Calendar, 
    Hash, 
    Building2,
    Plus
} from "lucide-react";

const AddBatchModal = ({ open, onClose, item, categories = [], onBatchAdded, onCloseEditModal }) => {
    const [formData, setFormData] = useState({
        storage_location: "",
        batch_number: "",
        expiry_date: "",
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success"); // "success" or "error"

    // Initialize form data when item changes
    useEffect(() => {
        if (item) {
            setFormData({
                storage_location: item.storageLocation || "",
                batch_number: "",
                expiry_date: "",
            });
        }
    }, [item]);

    const { data, setData, post, processing, errors } = useForm(formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Form submitted with data:', data);
        console.log('Item object:', item);
        
        // Client-side validation for batch-specific fields only
        if (!data.batch_number.trim()) {
            console.log('Validation failed: No batch number');
            alert('Please enter a batch number');
            return;
        }
        if (!data.expiry_date) {
            console.log('Validation failed: No expiry date');
            alert('Please select an expiry date');
            return;
        }
        if (data.expiry_date && new Date(data.expiry_date) <= new Date()) {
            console.log('Validation failed: Expiry date in past');
            alert('Expiry date must be in the future');
            return;
        }
        
        // Prepare data with item information from the original item
        const submitData = {
            itemname: item.name || "",
            categoryid: item.categoryId || item.category?.id || "",
            manufacturer: item.manufacturer || "",
            description: item.description || "",
            unit_type: item.unit || item.unit_type || "",
            storage_location: data.storage_location || "",
            batch_number: data.batch_number.trim(),
            expiry_date: data.expiry_date,
            original_item_id: item.id
        };
        
        console.log('Item object:', item);
        console.log('Creating new batch:', submitData);
        console.log('About to call post with route:', route("pharmacist.inventory.item.add-batch"));
        
        // Add a timeout fallback to prevent stuck loading state
        const timeoutId = setTimeout(() => {
            console.log('Request timeout - resetting loading state');
            setToastMessage("Request timed out. Please try again.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }, 10000); // 10 second timeout
        
        // Try using fetch instead of Inertia post
        fetch(route("pharmacist.inventory.item.add-batch"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(submitData)
        })
        .then(response => {
            clearTimeout(timeoutId);
            console.log('Response received:', response.status);
            
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .then(data => {
            console.log('Batch creation successful:', data);
            setToastMessage("Batch added successfully!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                onClose(); // Close AddBatchModal
                if (onCloseEditModal) {
                    onCloseEditModal(); // Close EditItemModal
                }
                if (onBatchAdded) {
                    onBatchAdded();
                }
            }, 2000);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.error("Error creating batch:", error);
            setToastMessage("Error creating batch: " + error.message);
            setToastType("error");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        });
    };

    const unitOptions = [
        { value: "pieces", label: "Pieces" },
        { value: "tablets", label: "Tablets" },
        { value: "capsules", label: "Capsules" },
        { value: "vials", label: "Vials" },
        { value: "boxes", label: "Boxes" },
        { value: "bottles", label: "Bottles" },
        { value: "tubes", label: "Tubes" },
        { value: "sachets", label: "Sachets" },
        { value: "strips", label: "Strips" },
        { value: "units", label: "Units" },
    ];

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Add New Batch
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Add a new batch for "{item.name}"
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-900">Batch Information</h3>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                New batch details
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="batch_number" className="text-sm font-medium">
                                    Batch/Lot Number *
                                </Label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="batch_number"
                                        name="batch_number"
                                        value={data.batch_number}
                                        onChange={handleChange}
                                        placeholder="Enter batch number (e.g., RX12001121)"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {errors.batch_number && (
                                    <p className="text-sm text-red-600">{errors.batch_number}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiry_date" className="text-sm font-medium">
                                    Expiry Date *
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="expiry_date"
                                        name="expiry_date"
                                        type="date"
                                        value={data.expiry_date}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {errors.expiry_date && (
                                    <p className="text-sm text-red-600">{errors.expiry_date}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storage_location" className="text-sm font-medium">
                                    Storage Location
                                </Label>
                                <Input
                                    id="storage_location"
                                    name="storage_location"
                                    value={data.storage_location}
                                    onChange={handleChange}
                                    placeholder="Enter storage location"
                                />
                                {errors.storage_location && (
                                    <p className="text-sm text-red-600">{errors.storage_location}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end space-x-2">
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
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {processing ? "Adding Batch..." : "Add Batch"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            
            {/* Toast Notification */}
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.5 }}
                    className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
                        toastType === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
                    }`}
                >
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className={`flex-shrink-0 ${
                                toastType === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {toastType === 'success' ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className={`text-sm font-medium ${
                                    toastType === 'success' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {toastMessage}
                                </p>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => setShowToast(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </Dialog>
    );
};

export default AddBatchModal;
