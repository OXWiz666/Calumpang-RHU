import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { toastSuccess, toastError } from "@/utils/toast";
import DispenseSummary from "@/components/DispenseSummary";
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
    ShoppingCart,
    Search,
    Package,
    AlertTriangle,
    Clock,
    X,
    Check,
    FileText,
    User,
    Stethoscope,
    Calendar,
    Hash,
} from "lucide-react";

export default function BulkDispenseModal({ 
    open, 
    onClose, 
    inventoryItems = [] 
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [dispenseQuantities, setDispenseQuantities] = useState({});
    const [reasonForDispensing, setReasonForDispensing] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Prescription mode states
    const [dispenseMode, setDispenseMode] = useState("manual"); // "manual" or "prescription"
    const [availableCaseIds, setAvailableCaseIds] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState("");
    const [casePrescription, setCasePrescription] = useState(null);
    const [loadingCaseIds, setLoadingCaseIds] = useState(false);
    const [loadingCasePrescription, setLoadingCasePrescription] = useState(false);
    const [caseError, setCaseError] = useState("");
    
    // Dispense summary states
    const [showDispenseSummary, setShowDispenseSummary] = useState(false);
    const [dispenseSummaryData, setDispenseSummaryData] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter items based on search term and availability
    useEffect(() => {
        const filtered = inventoryItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.category?.name || 'Uncategorized').toLowerCase().includes(searchTerm.toLowerCase());
            
            // Only show items that have stock, are not archived, and are not expired
            const hasStock = (item.stock?.stocks || 0) > 0;
            const isNotArchived = item.status !== 0;
            const isNotExpired = !item.expiry_date || new Date(item.expiry_date) > new Date();
            
            // Debug logging
            if (!hasStock) {
                console.log(`Filtered out ${item.name}: No stock (${item.stock?.stocks || 0})`);
            }
            if (!isNotArchived) {
                console.log(`Filtered out ${item.name}: Archived`);
            }
            if (!isNotExpired && item.expiry_date) {
                console.log(`Filtered out ${item.name}: Expired (${item.expiry_date})`);
            }
            
            return matchesSearch && hasStock && isNotArchived && isNotExpired;
        });
        
        console.log(`Filtered items: ${filtered.length} out of ${inventoryItems.length}`);
        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchTerm, inventoryItems]);

    // Load Case IDs when prescription mode is selected
    useEffect(() => {
        if (dispenseMode === "prescription" && availableCaseIds.length === 0) {
            loadAvailableCaseIds();
        }
    }, [dispenseMode]);

    // Load available Case IDs
    const loadAvailableCaseIds = async () => {
        setLoadingCaseIds(true);
        try {
            const url = route('pharmacist.inventory.prescriptions.case-ids');
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                const caseIds = await response.json();
                setAvailableCaseIds(Array.isArray(caseIds) ? caseIds : []);
            } else {
                setAvailableCaseIds([]);
            }
        } catch (error) {
            console.error('Error loading Case IDs:', error);
            setAvailableCaseIds([]);
        } finally {
            setLoadingCaseIds(false);
        }
    };

    // Fetch prescription by CASE ID
    const fetchPrescriptionByCaseId = async (caseId) => {
        if (!caseId.trim()) {
            setCaseError("Please select a CASE ID");
            return;
        }

        setLoadingCasePrescription(true);
        setCaseError("");
        
        try {
            const url = route('pharmacist.inventory.prescriptions.by-case', { caseId: encodeURIComponent(caseId.trim()) });
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    setCaseError("No prescription found for this CASE ID");
                } else {
                    setCaseError("Failed to fetch prescription. Please try again.");
                }
                setCasePrescription(null);
                return;
            }

            const prescription = await response.json();
            
            if (prescription && prescription.medicines && prescription.medicines.length > 0) {
                console.log('Fetched prescription data:', prescription);
                setCasePrescription(prescription);
                setCaseError("");
                
                // Auto-select items that are in the prescription
                // Match by medicine_id (inventory item ID) to ensure correct items are selected
                const prescriptionMedicineIds = prescription.medicines.map(med => med.medicine_id);
                
                // Find matching items by ID from all inventory items
                const matchingItems = inventoryItems.filter(item => 
                    prescriptionMedicineIds.includes(item.id)
                );
                setSelectedItems(matchingItems);
                
                // Set quantities based on prescription
                const quantities = {};
                matchingItems.forEach(item => {
                    const prescriptionMedicine = prescription.medicines.find(med => med.medicine_id === item.id);   
                    quantities[item.id] = prescriptionMedicine ? prescriptionMedicine.quantity : 1;
                });
                setDispenseQuantities(quantities);
                
                // Patient info is already in prescription object
            } else {
                setCaseError("No medicines found in this prescription");
                setCasePrescription(null);
            }
        } catch (error) {
            console.error('Error fetching prescription by CASE ID:', error);
            setCaseError("Error searching prescription. Please try again.");
            setCasePrescription(null);
        } finally {
            setLoadingCasePrescription(false);
        }
    };

    // Initialize dispense quantities when items are selected
    useEffect(() => {
        const quantities = {};
        selectedItems.forEach(item => {
            if (!dispenseQuantities[item.id]) {
                quantities[item.id] = 1;
            } else {
                quantities[item.id] = dispenseQuantities[item.id];
            }
        });
        setDispenseQuantities(quantities);
    }, [selectedItems]);

    const handleItemSelect = (item, checked) => {
        if (checked) {
            setSelectedItems(prev => [...prev, item]);
        } else {
            setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
            // Remove quantity when item is deselected
            setDispenseQuantities(prev => {
                const newQuantities = { ...prev };
                delete newQuantities[item.id];
                return newQuantities;
            });
        }
    };


    const handleQuantityChange = (itemId, quantity) => {
        const numQuantity = parseInt(quantity) || 0;
        const maxQuantity = inventoryItems.find(item => item.id === itemId)?.stock?.stocks || 0;
        
        if (numQuantity > maxQuantity) {
            return; // Don't allow quantity greater than available stock
        }
        
        setDispenseQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(0, numQuantity)
        }));
    };

    const handleBulkDispense = async () => {
        if (selectedItems.length === 0) {
            toastError(
                "No Items Selected",
                "Please select at least one item to dispense."
            );
            return;
        }

        if (dispenseMode === "prescription" && !casePrescription) {
            toastError(
                "Prescription Required",
                "Please enter a valid CASE ID and search the prescription first."
            );
            return;
        }

        if (dispenseMode === "manual") {
            if (!reasonForDispensing.trim()) {
                toastError(
                    "Reason Required",
                    "Please enter reason for dispensing."
                );
                return;
            }
        }

        // Enhanced quantity validation with detailed error messages
        const validationErrors = [];
        
        selectedItems.forEach(item => {
            const quantity = dispenseQuantities[item.id] || 0;
            const availableStock = item.stock?.stocks || 0;
            
            if (quantity <= 0) {
                validationErrors.push(`${item.name}: Quantity must be greater than 0 (entered: ${quantity})`);
            } else if (quantity > availableStock) {
                validationErrors.push(`${item.name}: Insufficient stock (requested: ${quantity}, available: ${availableStock})`);
            }
            
            // Prescription mode validation: Check if available stock is below prescription requirement
            if (dispenseMode === "prescription" && casePrescription && casePrescription.medicines) {
                const prescriptionMedicine = casePrescription.medicines.find(med => med.medicine_id === item.id);
                if (prescriptionMedicine) {
                    const prescriptionQuantity = prescriptionMedicine.quantity;
                    if (availableStock < prescriptionQuantity) {
                        validationErrors.push(`${item.name}: Insufficient stock for prescription (required: ${prescriptionQuantity}, available: ${availableStock})`);
                    }
                }
            }
        });

        if (validationErrors.length > 0) {
            toastError(
                "Validation Errors",
                validationErrors.join('\n')
            );
            return;
        }

        setIsLoading(true);

        try {
            let dispenseData;
            let requestData;

            if (dispenseMode === "prescription") {
                // Handle prescription-based dispense
                dispenseData = selectedItems.map(item => ({
                    item_id: item.id,
                    quantity: dispenseQuantities[item.id] || 1,
                    batch_number: item.batch_number || 'N/A',
                    expiry_date: item.expiry_date || null
                }));

                // Validate required prescription fields
                console.log('Validating prescription fields:', {
                    patient_name: casePrescription.patient_name,
                    case_id: casePrescription.case_id,
                    id: casePrescription.id,
                    patient_id: casePrescription.patient_id,
                    doctor_id: casePrescription.doctor_id
                });
                
                if (!casePrescription.patient_name || !casePrescription.case_id || !casePrescription.id || !casePrescription.patient_id) {
                    toastError(
                        "Missing Prescription Information",
                        "Missing required prescription information. Please search the prescription again."
                    );
                    console.error('Missing prescription fields:', {
                        patient_name: !!casePrescription.patient_name,
                        case_id: !!casePrescription.case_id,
                        id: !!casePrescription.id,
                        patient_id: !!casePrescription.patient_id
                    });
                    setIsLoading(false);
                    return;
                }

                requestData = {
                    items: dispenseData,
                    patient_name: casePrescription.patient_name,
                    case_id: casePrescription.case_id,
                    doctor_name: casePrescription.doctor_name || null,
                    dispense_date: new Date().toISOString().split('T')[0],
                    prescription_id: parseInt(casePrescription.id),
                    patient_id: casePrescription.patient_id.toString(),
                    doctor_id: casePrescription.doctor_id ? parseInt(casePrescription.doctor_id) : null
                };
            } else {
                // Handle manual dispense
                dispenseData = selectedItems.map(item => ({
                    item_id: item.id,
                    quantity: dispenseQuantities[item.id] || 1,
                    batch_number: item.batch_number || 'N/A',
                    expiry_date: item.expiry_date || null
                }));

                requestData = {
                    items: dispenseData,
                    reason_for_dispensing: reasonForDispensing,
                    dispense_date: new Date().toISOString().split('T')[0]
                };
            }

            
            // Debug: Log the request data
            console.log('Bulk dispense request data:', requestData);
            console.log('Selected items:', selectedItems);
            console.log('Dispense quantities:', dispenseQuantities);
            console.log('Case prescription:', casePrescription);
            
            // Additional debugging
            console.log('Dispense mode:', dispenseMode);
            console.log('Request data keys:', Object.keys(requestData));
            console.log('Items array length:', requestData.items ? requestData.items.length : 'NO ITEMS');
            
            // Validate each item in the request
            if (requestData.items) {
                requestData.items.forEach((item, index) => {
                    console.log(`Item ${index}:`, {
                        item_id: item.item_id,
                        quantity: item.quantity,
                        batch_number: item.batch_number,
                        expiry_date: item.expiry_date
                    });
                });
            }
            
            // Send bulk dispense request
            router.post(route('pharmacist.inventory.dispense.bulk'), requestData, {
                onSuccess: (page) => {
                    console.log('Bulk dispense successful:', page);
                    
                    // Prepare dispense summary data
                    const summaryData = {
                        dispense_date: requestData.dispense_date,
                        mode: dispenseMode,
                        dispensed_items: selectedItems.map(item => ({
                            name: item.name,
                            batch_number: item.batch_number || 'N/A',
                            quantity: dispenseQuantities[item.id] || 1,
                            expiry_date: item.expiry_date || null
                        })),
                        ...(dispenseMode === 'prescription' ? {
                            patient_name: requestData.patient_name,
                            case_id: requestData.case_id,
                            doctor_name: requestData.doctor_name,
                            prescription_id: requestData.prescription_id
                        } : {
                            reason_for_dispensing: requestData.reason_for_dispensing
                        })
                    };
                    
                    // Debug log for prescription mode
                    console.log('Dispense Summary Data:', {
                        mode: dispenseMode,
                        summaryData,
                        requestData,
                        casePrescription
                    });
                    
                    // Set summary data and show summary
                    setDispenseSummaryData(summaryData);
                    setShowDispenseSummary(true);
                    
                    // Close the main modal
                    handleClose();
                    
                    toastSuccess(
                        "Bulk Dispense Successful",
                        `${dispenseMode === "prescription" ? "Prescription dispense" : "Manual dispense"} completed successfully! ${selectedItems.length} item(s) dispensed.`,
                        "update"
                    );
                },
                onError: (errors) => {
                    console.error('Bulk dispense error:', errors);
                    
                    // Handle specific error types
                    if (errors && typeof errors === 'object') {
                        const errorMessages = [];
                        
                        // Handle validation errors
                        if (errors.items) {
                            errorMessages.push(`Items: ${Array.isArray(errors.items) ? errors.items[0] : errors.items}`);
                        }
                        if (errors.patient_name) {
                            errorMessages.push(`Patient name: ${Array.isArray(errors.patient_name) ? errors.patient_name[0] : errors.patient_name}`);
                        }
                        if (errors.case_id) {
                            errorMessages.push(`Case ID: ${Array.isArray(errors.case_id) ? errors.case_id[0] : errors.case_id}`);
                        }
                        if (errors.doctor_name) {
                            errorMessages.push(`Doctor name: ${Array.isArray(errors.doctor_name) ? errors.doctor_name[0] : errors.doctor_name}`);
                        }
                        if (errors.dispense_date) {
                            errorMessages.push(`Dispense date: ${Array.isArray(errors.dispense_date) ? errors.dispense_date[0] : errors.dispense_date}`);
                        }
                        
                        if (errorMessages.length > 0) {
                            toastError(
                                "Validation Errors",
                                errorMessages.join(', ')
                            );
                        } else {
                            toastError(
                                "Bulk Dispense Failed",
                                "Please check your inputs and try again."
                            );
                        }
                    } else if (typeof errors === 'string') {
                        toastError("Bulk Dispense Error", errors);
                    } else {
                        toastError(
                            "Bulk Dispense Failed",
                            "An unexpected error occurred. Please try again."
                        );
                    }
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Bulk dispense error:', error);
            toastError(
                "Bulk Dispense Error",
                "An unexpected error occurred during bulk dispense. Please try again."
            );
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedItems([]);
        setDispenseQuantities({});
        setReasonForDispensing("");
        setSearchTerm("");
        setDispenseMode("manual");
        setAvailableCaseIds([]);
        setSelectedCaseId("");
        setCasePrescription(null);
        setCaseError("");
        onClose();
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

    const totalSelectedQuantity = selectedItems.reduce((sum, item) => {
        return sum + (dispenseQuantities[item.id] || 0);
    }, 0);

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

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                        Bulk Dispense Items
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto max-h-[70vh]">
                    {/* Dispense Mode Selection */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">Dispense Mode</h3>
                        <div className="flex gap-4">
                            <Button
                                variant={dispenseMode === "manual" ? "default" : "outline"}
                                onClick={() => setDispenseMode("manual")}
                                className="flex items-center gap-2"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Manual Dispense
                            </Button>
                            <Button
                                variant={dispenseMode === "prescription" ? "default" : "outline"}
                                onClick={() => setDispenseMode("prescription")}
                                className="flex items-center gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                Prescription Mode
                            </Button>
                        </div>
                    </div>

                    {/* Prescription Mode - CASE ID Dropdown */}
                    {dispenseMode === "prescription" && (
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3">Select CASE ID</h3>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <Select
                                            value={selectedCaseId}
                                            onValueChange={(value) => {
                                                setSelectedCaseId(value);
                                                fetchPrescriptionByCaseId(value);
                                            }}
                                            disabled={loadingCaseIds}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={
                                                    loadingCaseIds 
                                                        ? "Loading Case IDs..." 
                                                        : "Select a CASE ID to search prescription..."
                                                } />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableCaseIds.map((caseId) => (
                                                    <SelectItem key={caseId.case_id} value={caseId.case_id}>
                                                        <div className="flex items-center gap-2">
                                                            <Hash className="h-4 w-4" />
                                                            <span>{caseId.display_text}</span>
                                                            <span className="text-xs text-gray-500">
                                                                ({new Date(caseId.created_at).toLocaleDateString()})
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {selectedCaseId && (
                                        <Button
                                            onClick={() => fetchPrescriptionByCaseId(selectedCaseId)}
                                            disabled={loadingCasePrescription}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {loadingCasePrescription ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="h-4 w-4 mr-2" />
                                                    Search
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                                
                                {caseError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{caseError}</p>
                                    </div>
                                )}
                                
                                {casePrescription && (
                                    <div className="p-3 bg-white rounded-lg border">
                                        <h4 className="font-medium text-gray-900 mb-2">Prescription Details</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Patient:</span>
                                                <span className="ml-2 font-medium">{casePrescription.patient_name}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Doctor:</span>
                                                <span className="ml-2 font-medium">{casePrescription.doctor_name}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Case ID:</span>
                                                <span className="ml-2 font-medium">{casePrescription.case_id || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Medicines:</span>
                                                <span className="ml-2 font-medium">{casePrescription.medicines?.length || 0}</span>
                                            </div>
                                        </div>
                                        
                                        {casePrescription.medicines && casePrescription.medicines.length > 0 && (
                                            <div className="mt-3">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Required Medicines:</h5>
                                                <div className="space-y-1">
                                                    {casePrescription.medicines.map((medicine, index) => (
                                                        <div key={index} className="text-xs text-gray-600 flex justify-between">
                                                            <span>{medicine.medicine_name || 'Unknown Medicine'}</span>
                                                            <span className="font-medium">{medicine.quantity} units</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reason for Dispensing - Manual Mode Only */}
                    {dispenseMode === "manual" && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Dispensing *
                                </label>
                                <Input
                                    value={reasonForDispensing}
                                    onChange={(e) => setReasonForDispensing(e.target.value)}
                                    placeholder="Enter reason for dispensing (e.g., Emergency supply, Stock transfer, etc.)"
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Search and Filter */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Badge variant="outline" className="text-sm">
                            {selectedItems.length} selected
                        </Badge>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium">No valid items available</p>
                                <p className="text-sm">All items are either out of stock, archived, or expired</p>
                            </div>
                        ) : (
                            currentItems.map((item) => {
                            const isSelected = selectedItems.some(selected => selected.id === item.id);
                            const status = getItemStatus(item);
                            const availableStock = item.stock?.stocks || 0;
                            
                            // Check prescription requirements for this item
                            const prescriptionMedicine = dispenseMode === "prescription" && casePrescription && casePrescription.medicines 
                                ? casePrescription.medicines.find(med => med.medicine_id === item.id)
                                : null;
                            const prescriptionQuantity = prescriptionMedicine ? prescriptionMedicine.quantity : 0;
                            const meetsPrescriptionRequirement = prescriptionQuantity === 0 || availableStock >= prescriptionQuantity;
                            
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 border rounded-lg transition-all ${
                                        isSelected 
                                            ? 'border-green-500 bg-green-50' 
                                            : !meetsPrescriptionRequirement && dispenseMode === "prescription"
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleItemSelect(item, checked)}
                                            className="h-4 w-4"
                                            disabled={!meetsPrescriptionRequirement && dispenseMode === "prescription"}
                                        />
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-5 w-5 text-gray-600" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {item.category?.name || 'Uncategorized'} • 
                                                        Available: {availableStock} {item.unit_type || 'pieces'}
                                                        {prescriptionQuantity > 0 && (
                                                            <span className="ml-2 text-blue-600 font-medium">
                                                                (Prescription needs: {prescriptionQuantity})
                                                            </span>
                                                        )}
                                                    </p>
                                                    {!meetsPrescriptionRequirement && dispenseMode === "prescription" && (
                                                        <p className="text-sm text-red-600 font-medium mt-1">
                                                            ⚠️ Insufficient stock for prescription requirement
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(status)}>
                                                {getStatusText(status)}
                                            </Badge>
                                            
                                            {isSelected && (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={availableStock}
                                                        value={dispenseQuantities[item.id] || 1}
                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                        className="w-20 text-center"
                                                    />
                                                    <span className="text-sm text-gray-500">
                                                        {item.unit_type || 'pieces'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                        )}
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

                    {/* Summary */}
                    {selectedItems.length > 0 && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Dispense Summary</h4>
                            <div className="space-y-1 text-sm text-blue-800">
                                <p>Total Items: {selectedItems.length}</p>
                                <p>Total Quantity: {totalSelectedQuantity}</p>
                                {dispenseMode === "manual" ? (
                                    <p>Reason: {reasonForDispensing || 'Not specified'}</p>
                                ) : (
                                    <>
                                        <p>Patient: {casePrescription?.patient_name || 'Not specified'}</p>
                                        <p>Case ID: {casePrescription?.case_id || 'Not specified'}</p>
                                    </>
                                )}
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
                        onClick={handleBulkDispense}
                        disabled={
                            selectedItems.length === 0 || 
                            (dispenseMode === "manual" && !reasonForDispensing) || 
                            (dispenseMode === "prescription" && !casePrescription) || 
                            isLoading
                        }
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                {dispenseMode === "prescription" ? (
                                    <>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Dispense {selectedItems.length} Items
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Dispense {selectedItems.length} Items
                                    </>
                                )}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
            
            {/* Dispense Summary Modal */}
            <DispenseSummary
                isOpen={showDispenseSummary}
                onClose={() => {
                    setShowDispenseSummary(false);
                    setDispenseSummaryData(null);
                    // Auto-refresh the page data
                    router.visit(window.location.pathname, { method: 'get' });
                }}
                dispenseData={dispenseSummaryData}
                mode={dispenseMode}
            />
        </Dialog>
    );
}
