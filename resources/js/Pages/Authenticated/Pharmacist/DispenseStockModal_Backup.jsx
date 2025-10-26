import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/tempo/components/ui/select";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import jsPDF from 'jspdf';
// import "@/echo"; // Commented out - not needed for basic functionality
import { 
    Package, 
    Hash, 
    Calendar, 
    User,
    FileText,
    AlertTriangle,
    CheckCircle,
    Search,
    Stethoscope,
    Users,
    Zap
} from "lucide-react";

const DispenseStockModal = ({ open, onClose, item }) => {
    const [availableBatches, setAvailableBatches] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [loadingBatches, setLoadingBatches] = useState(false);
    const [selectedBatches, setSelectedBatches] = useState([]); // For multi-batch dispensing
    const [batchQuantities, setBatchQuantities] = useState({}); // Quantities for each batch
    const [showPreview, setShowPreview] = useState(false); // For dispense preview
    const [previewData, setPreviewData] = useState(null); // Preview data
    const [currentStock, setCurrentStock] = useState(item?.quantity || 0); // Track current stock
    const [isProcessing, setIsProcessing] = useState(false); // Processing state for dispense
    const [showSummaryModal, setShowSummaryModal] = useState(false); // Show dispense summary modal
    const [dispenseSummary, setDispenseSummary] = useState(null); // Dispense summary data
    const [showAllBatches, setShowAllBatches] = useState(false); // Toggle to show all batches including zero stock

    const { data, setData, post, processing, errors } = useForm({
        item_id: item?.id || "",
        batch_id: "", // Individual batch ID for dispensing
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
            // Skip filtering if expiry date is 'N/A' or invalid
            if (!batch.expiry_date || batch.expiry_date === 'N/A' || batch.expiry_date === 'Invalid Date') {
                return true; // Keep batches without valid expiry dates
            }
            
            try {
                const expiryDate = new Date(batch.expiry_date);
                // Check if the batch is not expired (expiry date is today or in the future)
                return expiryDate >= currentDate;
            } catch (error) {
                console.warn('Invalid expiry date format:', batch.expiry_date);
                return true; // Keep batches with invalid date formats
            }
        });
    };

    // Load real-time batch data
    const loadAvailableBatches = async () => {
        if (!item || !open) return;
        
        setLoadingBatches(true);
        try {
            let batches = [];
            
            // Check if item has the new grouped structure with batches array
            if (item.batches && Array.isArray(item.batches) && item.batches.length > 0) {
                // Use the grouped batch data directly
                batches = item.batches
                    .filter(batch => batch.batchNumber && batch.batchNumber !== 'new_batch' && batch.batchNumber !== 'N/A')
                    .map(batch => ({
                    batch_number: batch.batchNumber || 'N/A',
                    expiry_date: batch.expiryDate || 'N/A',
                    available_quantity: batch.quantity || 0,
                    location: batch.storageLocation || 'N/A',
                    batch_id: batch.id // Store the individual batch ID for dispensing
                }));
                console.log('Loaded grouped batches:', batches);
            } else {
                // Fallback to API call for single batch items
                const response = await fetch(`/pharmacist/inventory/item/${item.id}/batches`);
                if (response.ok) {
                    batches = await response.json();
                    console.log('Loaded API batches:', batches);
                } else {
                    console.error('Failed to load batches:', response.statusText);
                    // Fallback to item data if API fails
                    batches = [{
                        batch_number: item.batchNumber || item.batch_number || "N/A",
                        expiry_date: item.expiryDate || item.expiry_date || "N/A",
                        available_quantity: item.quantity || item.totalQuantity || 0,
                        location: item.storageLocation || item.storage_location || "N/A",
                        batch_id: item.id
                    }];
                }
            }
            
            // Filter out expired batches
            const nonExpiredBatches = filterExpiredBatches(batches);
            setAvailableBatches(nonExpiredBatches);
            console.log('Filtered batches (expired removed):', nonExpiredBatches);
            
        } catch (error) {
            console.error('Error loading batches:', error);
            // Fallback to item data if API fails
            const fallbackBatches = [{
                batch_number: item.batchNumber || item.batch_number || "N/A",
                expiry_date: item.expiryDate || item.expiry_date || "N/A",
                available_quantity: item.quantity || item.totalQuantity || 0,
                location: item.storageLocation || item.storage_location || "N/A",
                batch_id: item.id
            }];
            
            // Filter expired batches from fallback data too
            const nonExpiredFallbackBatches = filterExpiredBatches(fallbackBatches);
            setAvailableBatches(nonExpiredFallbackBatches);
        } finally {
            setLoadingBatches(false);
        }
    };

    useEffect(() => {
        if (item && open) {
            console.log('Modal opened, resetting to prescription mode');
            loadAvailableBatches();
            setData('item_id', item.id);
            setData('dispensed_by', "Current User"); // This would be the logged-in user
            // Initialize current stock
            setCurrentStock(item.quantity || 0);
            // Reset dispense mode to default
            setDispenseMode('prescription');
            // Clear any previously selected batches
            setSelectedBatches([]);
            setData('batch_id', '');
            setData('batch_number', '');
        }
    }, [item, open]);

    // Track mode changes
    useEffect(() => {
        console.log('Dispense mode changed to:', dispenseMode);
    }, [dispenseMode]);

    // Real-time updates for batch data (commented out - Echo not properly configured)
    useEffect(() => {
        // if (open && window.Echo) {
        //     const channel = window.Echo.channel('inventory-updates')
        //         .listen('InventoryUpdated', (e) => {
        //             console.log('Inventory updated, refreshing batch data...', e);
        //             // Refresh batch data when inventory is updated
        //             loadAvailableBatches();
        //         });

        //     return () => {
        //         window.Echo.leaveChannel('inventory-updates');
        //     };
        // }
    }, [open]);


    useEffect(() => {
        console.log('=== DISPENSE MODAL USEEFFECT ===');
        console.log('Modal open:', open);
        console.log('Item:', item);
        if (open) {
            console.log('Loading data for dispense modal...');
            loadAvailableBatches();
        }
    }, [open, item]);

    const handleBatchSelect = (batch, index) => {
        // Create a unique identifier for this batch instance
        const batchUniqueId = `${batch.batch_number}-${index}-${batch.batch_id || batch.id}`;
        
        console.log('Batch selection clicked:', {
            clickedBatch: batch.batch_number,
            batchUniqueId: batchUniqueId,
            currentSelectedBatches: selectedBatches.map(b => b.uniqueId),
            availableQuantity: batch.available_quantity,
            isSelectable: batch.available_quantity > 0
        });
        
        // Only select if the batch has available quantity > 0
        if (batch.available_quantity <= 0) {
            setValidationErrors({ 
                batch_number: `Cannot select batch ${batch.batch_number} - no available quantity (${batch.available_quantity} units)` 
            });
            return;
        }
        
        // Toggle batch selection
        const batchWithUniqueId = {
            ...batch,
            uniqueId: batchUniqueId
        };
        
        setSelectedBatches(prevSelected => {
            const isAlreadySelected = prevSelected.some(b => b.uniqueId === batchUniqueId);
            
            if (isAlreadySelected) {
                // Remove from selection
                console.log('Deselecting batch:', batch.batch_number, 'instance:', batchUniqueId);
                const newSelection = prevSelected.filter(b => b.uniqueId !== batchUniqueId);
                
                // Update form data based on remaining selections
                if (newSelection.length === 0) {
                    setData('batch_id', '');
                    setData('batch_number', '');
                } else if (newSelection.length === 1) {
                    setData('batch_id', newSelection[0].batch_id || newSelection[0].id);
                    setData('batch_number', newSelection[0].batch_number);
                }
                
                return newSelection;
            } else {
                // Add to selection
                console.log('Selecting batch:', batch.batch_number, 'instance:', batchUniqueId);
                const newSelection = [...prevSelected, batchWithUniqueId];
                
                // Update form data with the first selected batch for backward compatibility
                if (newSelection.length === 1) {
                    setData('batch_id', batch.batch_id || batch.id);
                    setData('batch_number', batch.batch_number);
                }
                
                return newSelection;
            }
        });
        
        setValidationErrors({});
    };


    const handlePrescriptionSelect = (prescription) => {
        setSelectedPrescription(prescription);
        setData('prescription_id', prescription.id);
        setData('patient_name', prescription.patient_name);
        setData('patient_id', prescription.patient_id);
        setData('doctor_id', prescription.doctor_id);
        setData('case_id', prescription.case_id || prescription.prescription_number);
        setData('reason', 'Prescription Dispensing');
    };

    // Auto-dispense validation and preparation
    const validatePrescriptionDispense = () => {
        if (!selectedPrescription) {
            setValidationErrors({ prescription: 'Please select a prescription' });
            return false;
        }

        if (selectedBatches.length === 0) {
            setValidationErrors({ batch_number: 'Please select at least one batch' });
            return false;
        }

        // Check if prescription has medicines for this item
        const hasMatchingMedicine = selectedPrescription.medicines?.some(med => 
            med.medicine_id === item.id
        );

        if (!hasMatchingMedicine) {
            setValidationErrors({ prescription: 'This prescription does not contain the selected item' });
            return false;
        }

        // Check stock availability in selected batches
        const requiredQuantity = selectedPrescription.medicines
            .filter(med => med.medicine_id === item.id)
            .reduce((total, med) => total + (med.quantity || 0), 0);

        const availableQuantity = selectedBatches.reduce((total, batch) => total + (batch.available_quantity || 0), 0);

        if (requiredQuantity > availableQuantity) {
            setValidationErrors({ 
                batch_number: `Insufficient stock in selected batches. Required: ${requiredQuantity}, Available: ${availableQuantity}` 
            });
            return false;
        }

        return true;
    };

    // Auto-allocate batches for prescription
    const autoAllocateBatches = (requiredQuantity) => {
        const allocatedBatches = [];
        let remainingQuantity = requiredQuantity;

        // Sort batches by expiry date (FIFO - First In, First Out)
        const sortedBatches = [...availableBatches].sort((a, b) => 
            new Date(a.expiry_date) - new Date(b.expiry_date)
        );

        for (const batch of sortedBatches) {
            if (remainingQuantity <= 0) break;

            const batchQuantity = Math.min(remainingQuantity, batch.available_quantity);
            if (batchQuantity > 0) {
                allocatedBatches.push({
                    batch_id: batch.batch_id || batch.id,
                    batch_number: batch.batch_number,
                    quantity: batchQuantity,
                    expiry_date: batch.expiry_date
                });
                remainingQuantity -= batchQuantity;
            }
        }

        return allocatedBatches;
    };

    // Generate dispense summary
    const generateDispenseSummary = (prescription, allocatedBatches) => {
        const medicine = prescription.medicines.find(med => med.medicine_id === item.id);
        const totalQuantity = allocatedBatches.reduce((sum, batch) => sum + batch.quantity, 0);
        
        // Get real-time medicine name from inventory
        const getMedicineName = () => {
            // First try to get from prescription medicine data
            if (medicine?.medicine_name && medicine.medicine_name !== 'Unknown Medicine') {
                return medicine.medicine_name;
            }
            
            // Fallback to item name from inventory
            if (item?.name) {
                return item.name;
            }
            
            // Last fallback
            return 'Medicine';
        };

        // Get real-time medicine details
        const getMedicineDetails = () => {
            return {
                name: getMedicineName(),
                generic_name: item?.generic_name || item?.name || 'Generic',
                unit: item?.unit || 'units',
                manufacturer: item?.manufacturer || 'Unknown Manufacturer'
            };
        };

        const medicineDetails = getMedicineDetails();
        
        return {
            prescription_number: prescription.prescription_number,
            case_id: prescription.case_id || 'N/A',
            patient_name: prescription.patient_name,
            doctor_name: prescription.doctor_name,
            medicine_name: medicineDetails.name,
            medicine_generic: medicineDetails.generic_name,
            medicine_unit: medicineDetails.unit,
            medicine_manufacturer: medicineDetails.manufacturer,
            required_quantity: medicine?.quantity || 0,
            dispensed_quantity: totalQuantity,
            batches_used: allocatedBatches.length,
            expiry_dates: allocatedBatches.map(batch => batch.expiry_date),
            allocated_batches: allocatedBatches
        };
    };

    // Preview dispense before actual dispensing
    const previewDispense = () => {
        // Validate based on current mode
        let errors = {};
        if (dispenseMode === 'prescription') {
            errors = validatePrescriptionMode();
        } else if (dispenseMode === 'manual') {
            errors = validateManualMode();
        }
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        if (!validatePrescriptionDispense()) {
            return;
        }

        const medicine = selectedPrescription.medicines.find(med => med.medicine_id === item.id);
        const requiredQuantity = medicine?.quantity || 0;
        
        // Use the selected batches instead of auto-allocating
        const allocatedBatches = selectedBatches.map(batch => ({
            batch_id: batch.batch_id || batch.id,
            batch_number: batch.batch_number,
            quantity: Math.min(requiredQuantity, batch.available_quantity),
            expiry_date: batch.expiry_date
        }));
        
        const summary = generateDispenseSummary(selectedPrescription, allocatedBatches);
        
        setPreviewData(summary);
        setShowPreview(true);
    };

    // Execute additional functions after successful dispense
    const executePostDispenseFunctions = (transactionId, previewData, successSummary) => {
        console.log('Executing post-dispense functions for transaction:', transactionId);

        // 1. Update stock quantities (minus dispensed amounts)
        updateStockQuantities(transactionId, previewData);

        // 2. Log dispense activity
        logDispenseActivity(transactionId, previewData, 'completed');

        // 3. Send notification to relevant parties
        sendDispenseNotification(transactionId, previewData);

        // 4. Update prescription status
        updatePrescriptionStatus(selectedPrescription.id, 'dispensed');

        // 5. Create audit trail entry
        createAuditTrail(transactionId, previewData, 'dispense_completed');

        // 6. Check for low stock alerts
        checkLowStockAlerts(item.id);

        // 7. Generate dispense receipt
        generateDispenseReceipt(transactionId, previewData);

        // 8. Refresh inventory data
        refreshInventoryData();

        console.log('Post-dispense functions completed for transaction:', transactionId);
    };

    // Update stock quantities after dispense
    const updateStockQuantities = (transactionId, previewData) => {
        console.log('Updating stock quantities for transaction:', transactionId);
        
        // Process each batch that was dispensed
        previewData.allocated_batches.forEach(batch => {
            console.log(`Updating batch ${batch.batch_number}: -${batch.quantity} units`);
            
            // Update the available batches state
            setAvailableBatches(prevBatches => 
                prevBatches.map(b => 
                    b.batch_number === batch.batch_number 
                        ? {
                            ...b,
                            available_quantity: Math.max(0, b.available_quantity - batch.quantity),
                            dispensed_quantity: (b.dispensed_quantity || 0) + batch.quantity
                        }
                        : b
                )
            );
        });

        // Update item's current stock display
        const totalDispensed = previewData.allocated_batches.reduce((sum, batch) => sum + batch.quantity, 0);
        console.log(`Total dispensed: ${totalDispensed} units from item ${item.name}`);
        
        // Update current stock state
        setCurrentStock(prevStock => {
            const newStock = Math.max(0, prevStock - totalDispensed);
            console.log(`Stock updated: ${prevStock} - ${totalDispensed} = ${newStock}`);
            return newStock;
        });
    };

    // Refresh inventory data after dispense
    const refreshInventoryData = () => {
        console.log('Refreshing inventory data...');
        
        // Reload available batches
        loadAvailableBatches();
        
        // Note: Echo trigger removed - not a valid method
        // Real-time updates will be handled by the backend events
    };

    // Export PDF functionality
    const exportToPDF = () => {
        if (!dispenseSummary) return;
        
        // Create new PDF document
        const doc = new jsPDF();
        
        // Set up professional government colors
        const colors = {
            black: [0, 0, 0],
            darkGray: [64, 64, 64],
            lightGray: [128, 128, 128],
            blue: [0, 51, 102],
            red: [153, 0, 0],
            white: [255, 255, 255]
        };
        
        let yPosition = 20;
        
        // Official Header
        doc.setFontSize(16);
        doc.setTextColor(...colors.blue);
        doc.text('REPUBLIC OF THE PHILIPPINES', 105, yPosition, { align: 'center' });
        yPosition += 8;
        
        doc.setFontSize(14);
        doc.setTextColor(...colors.blue);
        doc.text('RURAL HEALTH UNIT OF CALUMPANG', 105, yPosition, { align: 'center' });
        yPosition += 8;
        
        doc.setFontSize(12);
        doc.setTextColor(...colors.darkGray);
        doc.text('Calumpang, General Santos City.', 105, yPosition, { align: 'center' });
        yPosition += 15;
        
        // Document Title
        doc.setFontSize(18);
        doc.setTextColor(...colors.black);
        doc.text('MEDICINE DISPENSE RECEIPT', 105, yPosition, { align: 'center' });
        yPosition += 15;
        
        // Horizontal line
        doc.setDrawColor(...colors.blue);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
        
        // Transaction Details
        doc.setFontSize(10);
        doc.setTextColor(...colors.darkGray);
        doc.text(`Transaction ID: ${dispenseSummary.transactionId}`, 20, yPosition);
        doc.text(`Date: ${dispenseSummary.timestamp}`, 20, yPosition + 5);
        yPosition += 15;
        
        // Prescription Information Section
        doc.setFontSize(12);
        doc.setTextColor(...colors.blue);
        doc.text('PRESCRIPTION INFORMATION', 20, yPosition);
        yPosition += 8;
        
        // Prescription details table
        doc.setFontSize(10);
        doc.setTextColor(...colors.black);
        doc.text('Prescription Number:', 20, yPosition);
        doc.text(dispenseSummary.prescription.number, 80, yPosition);
        yPosition += 5;
        
        doc.text('Case ID:', 20, yPosition);
        doc.text(dispenseSummary.prescription.caseId || 'N/A', 80, yPosition);
        yPosition += 10;
        
        // Patient Information Section
        doc.setFontSize(12);
        doc.setTextColor(...colors.blue);
        doc.text('PATIENT INFORMATION', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(...colors.black);
        doc.text('Patient Name:', 20, yPosition);
        doc.text(dispenseSummary.patient.name, 80, yPosition);
        yPosition += 5;
        
        doc.text('Patient ID:', 20, yPosition);
        doc.text(dispenseSummary.patient.id, 80, yPosition);
        yPosition += 10;
        
        // Medicine Information Section
        doc.setFontSize(12);
        doc.setTextColor(...colors.blue);
        doc.text('MEDICINE INFORMATION', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(...colors.black);
        doc.text('Medicine Name:', 20, yPosition);
        doc.text(dispenseSummary.medicine.name, 80, yPosition);
        yPosition += 5;
        
        doc.text('Manufacturer:', 20, yPosition);
        doc.text(dispenseSummary.medicine.manufacturer, 80, yPosition);
        yPosition += 5;
        
        doc.text('Quantity Dispensed:', 20, yPosition);
        doc.text(`${dispenseSummary.medicine.quantity} ${dispenseSummary.medicine.unit}`, 80, yPosition);
        yPosition += 10;
        
        // Batch Information Section
        doc.setFontSize(12);
        doc.setTextColor(...colors.blue);
        doc.text('BATCH INFORMATION', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(...colors.black);
        doc.text('Batch Number:', 20, yPosition);
        doc.text(dispenseSummary.batch.number, 80, yPosition);
        yPosition += 5;
        
        doc.text('Expiration Date:', 20, yPosition);
        doc.text(dispenseSummary.batch.expiration, 80, yPosition);
        yPosition += 10;
        
        // Staff Information Section
        doc.setFontSize(12);
        doc.setTextColor(...colors.blue);
        doc.text('STAFF INFORMATION', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(...colors.black);
        doc.text('Prescribing Doctor:', 20, yPosition);
        doc.text(dispenseSummary.doctor.name, 80, yPosition);
        yPosition += 5;
        
        doc.text('Dispensing Pharmacist:', 20, yPosition);
        doc.text(dispenseSummary.pharmacist.name, 80, yPosition);
        yPosition += 15;
        
        // Summary Section
        doc.setFontSize(12);
        doc.setTextColor(...colors.blue);
        doc.text('DISPENSE SUMMARY', 20, yPosition);
        yPosition += 8;
        
        // Summary table
        doc.setFontSize(10);
        doc.setTextColor(...colors.black);
        
        // Table headers
        doc.setFillColor(...colors.lightGray);
        doc.rect(20, yPosition - 2, 50, 8, 'F');
        doc.rect(70, yPosition - 2, 50, 8, 'F');
        doc.rect(120, yPosition - 2, 50, 8, 'F');
        
        doc.setTextColor(...colors.white);
        doc.text('Total Items', 25, yPosition + 3);
        doc.text('Total Quantity', 75, yPosition + 3);
        doc.text('Inventory Impact', 125, yPosition + 3);
        
        yPosition += 8;
        
        // Table values
        doc.setTextColor(...colors.black);
        doc.text(dispenseSummary.summary.totalItems.toString(), 25, yPosition + 3);
        doc.text(dispenseSummary.summary.totalQuantity.toString(), 75, yPosition + 3);
        doc.text(dispenseSummary.summary.inventoryImpact.toString(), 125, yPosition + 3);
        
        yPosition += 20;
        
        // Signature lines
        doc.setFontSize(10);
        doc.setTextColor(...colors.black);
        doc.text('Dispensing Pharmacist:', 20, yPosition);
        doc.text('_________________________', 20, yPosition + 15);
        doc.text(dispenseSummary.pharmacist.name, 20, yPosition + 20);
        
        doc.text('Date:', 100, yPosition);
        doc.text('_________________________', 100, yPosition + 15);
        doc.text(new Date().toLocaleDateString(), 100, yPosition + 20);
        
        yPosition += 40;
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(...colors.lightGray);
        doc.text('This is an official document generated by RHU Calumpang Management System', 105, yPosition, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPosition + 5, { align: 'center' });
        
        // Download the PDF
        const fileName = `Dispense_Receipt_${dispenseSummary.transactionId}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    // Summary function (print functionality)
    const printSummary = () => {
        if (!dispenseSummary) return;
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Dispense Summary - ${dispenseSummary.transactionId}</title>
                <style>
                    * { box-sizing: border-box; }
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 10px; 
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 20px; 
                    }
                    .header h1 { 
                        color: #059669; 
                        margin: 0; 
                        font-size: 18px;
                    }
                    .header p { 
                        color: #666; 
                        margin: 3px 0; 
                        font-size: 12px;
                    }
                    .section { 
                        margin-bottom: 15px; 
                        padding: 10px; 
                        border-radius: 4px; 
                    }
                    .prescription { background: #dbeafe; }
                    .patient { background: #e9d5ff; }
                    .medicine { background: #dcfce7; }
                    .batch { background: #fed7aa; }
                    .staff { background: #f3f4f6; }
                    .summary { 
                        background: #f0f9ff; 
                        border: 1px solid #93c5fd; 
                    }
                    .section h3 { 
                        margin: 0 0 8px 0; 
                        font-size: 14px; 
                    }
                    .info-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 10px; 
                    }
                    .info-item { 
                        margin-bottom: 5px; 
                    }
                    .info-label { 
                        font-weight: bold; 
                        color: #374151; 
                        font-size: 10px; 
                    }
                    .info-value { 
                        color: #111827; 
                        font-size: 12px; 
                    }
                    .summary-cards { 
                        display: grid; 
                        grid-template-columns: repeat(3, 1fr); 
                        gap: 10px; 
                        text-align: center; 
                    }
                    .summary-card { 
                        background: white; 
                        padding: 8px; 
                        border-radius: 4px; 
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1); 
                    }
                    .summary-number { 
                        font-size: 16px; 
                        font-weight: bold; 
                        margin-bottom: 3px; 
                    }
                    .summary-label { 
                        font-size: 10px; 
                        color: #666; 
                    }
                    .blue { color: #2563eb; }
                    .green { color: #059669; }
                    .purple { color: #7c3aed; }
                    @media print { 
                        body { 
                            margin: 0; 
                            padding: 8px; 
                            font-size: 10px;
                        }
                        .no-print { display: none; }
                        .section { 
                            margin-bottom: 10px; 
                            padding: 8px; 
                        }
                        .summary-cards { 
                            gap: 8px; 
                        }
                        .summary-card { 
                            padding: 6px; 
                        }
                        .summary-number { 
                            font-size: 14px; 
                        }
                    }
                    @page {
                        margin: 0.5in;
                        size: A4;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Dispense Summary</h1>
                    <p>Transaction ID: ${dispenseSummary.transactionId}</p>
                    <p>Date: ${dispenseSummary.timestamp}</p>
                </div>
                
                <div class="info-grid">
                    <div class="section prescription">
                        <h3>Prescription Information</h3>
                        <div class="info-item">
                            <div class="info-label">Prescription Number:</div>
                            <div class="info-value">${dispenseSummary.prescription.number}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Case ID:</div>
                            <div class="info-value">${dispenseSummary.prescription.caseId || 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="section patient">
                        <h3>Patient Information</h3>
                        <div class="info-item">
                            <div class="info-label">Patient Name:</div>
                            <div class="info-value">${dispenseSummary.patient.name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Patient ID:</div>
                            <div class="info-value">${dispenseSummary.patient.id}</div>
                        </div>
                    </div>
                    
                    <div class="section medicine">
                        <h3>Medicine Details</h3>
                        <div class="info-item">
                            <div class="info-label">Medicine Name:</div>
                            <div class="info-value">${dispenseSummary.medicine.name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Manufacturer:</div>
                            <div class="info-value">${dispenseSummary.medicine.manufacturer}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Quantity Dispensed:</div>
                            <div class="info-value">${dispenseSummary.medicine.quantity} ${dispenseSummary.medicine.unit}</div>
                        </div>
                    </div>
                    
                    <div class="section batch">
                        <h3>Batch Information</h3>
                        <div class="info-item">
                            <div class="info-label">Batch Number:</div>
                            <div class="info-value">${dispenseSummary.batch.number}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Expiration Date:</div>
                            <div class="info-value">${dispenseSummary.batch.expiration}</div>
                        </div>
                    </div>
                </div>
                
                <div class="section staff">
                    <h3>Staff Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Prescribing Doctor:</div>
                            <div class="info-value">${dispenseSummary.doctor.name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Dispensing Pharmacist:</div>
                            <div class="info-value">${dispenseSummary.pharmacist.name}</div>
                        </div>
                    </div>
                </div>
                
                <div class="section summary">
                    <h3>Dispense Summary</h3>
                    <div class="summary-cards">
                        <div class="summary-card">
                            <div class="summary-number blue">${dispenseSummary.summary.totalItems}</div>
                            <div class="summary-label">Total Items</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-number green">${dispenseSummary.summary.totalQuantity}</div>
                            <div class="summary-label">Total Quantity</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-number purple">${dispenseSummary.summary.inventoryImpact}</div>
                            <div class="summary-label">Inventory Impact</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    // Log dispense activity
    const logDispenseActivity = (transactionId, previewData, status) => {
        const activityLog = {
            transaction_id: transactionId,
            action: 'dispense',
            status: status,
            patient_name: previewData.patient_name,
            prescription_number: previewData.prescription_number,
            medicine_name: previewData.medicine_name,
            quantity: previewData.dispensed_quantity,
            batches_used: previewData.batches_used,
            timestamp: new Date().toISOString(),
            user: 'pharmacist'
        };

        console.log('Dispense activity logged:', activityLog);
        
        // You can send this to your backend for storage
        // fetch('/api/activity-logs', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(activityLog)
        // });
    };

    // Send notification about dispense
    const sendDispenseNotification = (transactionId, previewData) => {
        const notification = {
            type: 'dispense_completed',
            title: 'Medicine Dispensed Successfully',
            message: `Prescription ${previewData.prescription_number} has been dispensed for ${previewData.patient_name}`,
            transaction_id: transactionId,
            patient_name: previewData.patient_name,
            medicine_name: previewData.medicine_name,
            quantity: previewData.dispensed_quantity,
            timestamp: new Date().toISOString()
        };

        console.log('Dispense notification:', notification);

        // You can send this to your notification system
        // fetch('/api/notifications', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(notification)
        // });
    };

    // Update prescription status
    const updatePrescriptionStatus = (prescriptionId, status) => {
        console.log(`Updating prescription ${prescriptionId} status to: ${status}`);
        
        // You can send this to your backend
        // fetch(`/api/prescriptions/${prescriptionId}/status`, {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ status: status })
        // });
    };

    // Create audit trail entry
    const createAuditTrail = (transactionId, previewData, action) => {
        const auditEntry = {
            transaction_id: transactionId,
            action: action,
            entity_type: 'prescription',
            entity_id: selectedPrescription.id,
            changes: {
                status: 'dispensed',
                dispensed_at: new Date().toISOString(),
                dispensed_by: 'pharmacist',
                dispensed_quantity: previewData.dispensed_quantity,
                batches_used: previewData.batches_used
            },
            timestamp: new Date().toISOString(),
            user: 'pharmacist'
        };

        console.log('Audit trail entry created:', auditEntry);
    };

    // Check for low stock alerts
    const checkLowStockAlerts = (itemId) => {
        console.log(`Checking low stock alerts for item: ${itemId}`);
        
        // You can implement low stock checking logic here
        // This could check if the remaining stock is below a threshold
        // and send alerts to relevant staff
    };

    // Generate dispense receipt
    const generateDispenseReceipt = (transactionId, previewData) => {
        const receipt = {
            transaction_id: transactionId,
            prescription_number: previewData.prescription_number,
            patient_name: previewData.patient_name,
            doctor_name: previewData.doctor_name,
            medicine_name: previewData.medicine_name,
            quantity: previewData.dispensed_quantity,
            batches: previewData.allocated_batches,
            dispensed_at: new Date().toISOString(),
            dispensed_by: 'pharmacist'
        };

        console.log('Dispense receipt generated:', receipt);
        
        // You can generate a PDF receipt or send to printer
        // generatePDFReceipt(receipt);
    };

    // Enhanced confirm and execute dispense with progress tracking
    const confirmDispense = async () => {
        console.log('Confirm Dispense started');
        console.log('Preview data:', previewData);
        console.log('Selected prescription:', selectedPrescription);
        console.log('Selected batches:', selectedBatches);
        console.log('Item:', item);
        
        if (!previewData) {
            console.error('No preview data available!');
            alert('Error: No preview data available. Please try again.');
            return;
        }

        if (!selectedPrescription) {
            console.error('No prescription selected!');
            alert('Error: No prescription selected. Please select a prescription first.');
            return;
        }

        if (selectedBatches.length === 0) {
            console.error('No batches selected!');
            alert('Error: No batches selected. Please select at least one batch first.');
            return;
        }

        // Generate unique transaction ID
        const transactionId = `DISP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('Generated transaction ID:', transactionId);
        
        // Use the first selected batch for backward compatibility
        const firstBatch = selectedBatches[0];
        
        const autoDispenseData = {
            prescription_id: selectedPrescription.id,
            dispensed_by: 'pharmacist',
            batch_id: String(firstBatch?.batch_id || firstBatch?.id || ''),
            batch_number: firstBatch?.batch_number,
            item_id: item.id
        };

        // Show processing state
        setIsProcessing(true);
        
        console.log('Sending dispense data:', autoDispenseData);
        
        let apiUrl;
        try {
            apiUrl = "/pharmacist/inventory/prescriptions/auto-dispense";
        } catch (error) {
            console.error('Route helper failed:', error);
            apiUrl = '/pharmacist/inventory/prescriptions/auto-dispense';
        }

        try {
            console.log('Making API call...');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(autoDispenseData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Dispense completed successfully:', result);
                
                // Use the dispense summary from backend
                const summaryData = result.dispense_summary || {};
                console.log('Dispense summary from backend:', summaryData);

                // Prepare summary data for modal
                const summary = {
                    transactionId: summaryData.transaction_id || transactionId,
                    timestamp: new Date().toLocaleString(),
                    prescription: {
                        number: previewData.prescription_number,
                        caseId: previewData.case_id || 'N/A'
                    },
                    patient: {
                        name: previewData.patient_name,
                        id: summaryData.patient?.id || 'N/A'
                    },
                    doctor: {
                        name: previewData.doctor_name,
                        id: summaryData.doctor?.id || 'N/A'
                    },
                    medicine: {
                        name: previewData.medicine_name,
                        generic: previewData.medicine_generic,
                        manufacturer: previewData.medicine_manufacturer,
                        quantity: previewData.dispensed_quantity,
                        unit: previewData.medicine_unit
                    },
                    batch: {
                        number: selectedBatches.length > 0 ? selectedBatches[0].batch_number : 'N/A',
                        expiration: selectedBatches.length > 0 ? 
                            (selectedBatches[0].expiry_date ? 
                                new Date(selectedBatches[0].expiry_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }) : 'N/A') : 'N/A'
                    },
                    summary: {
                        totalItems: summaryData.summary?.total_items || 1,
                        totalQuantity: summaryData.summary?.total_quantity || previewData.dispensed_quantity,
                        inventoryImpact: summaryData.inventory_impact?.items_affected || 1
                    },
                    pharmacist: {
                        name: summaryData.pharmacist?.name || 'Current User',
                        id: summaryData.pharmacist?.id || 'N/A'
                    }
                };

                // Set summary data and show modal
                setDispenseSummary(summary);
                setShowSummaryModal(true);

                // Close other modals and reset
                onClose();
                resetForm();
                setShowPreview(false);
                setPreviewData(null);
                setIsProcessing(false);

                // Additional functions after successful dispense
                executePostDispenseFunctions(summary.transactionId, previewData, summary);

                // Note: Echo trigger removed - not a valid method
                // Real-time updates will be handled by the backend events
            } else {
                const errorData = await response.json();
                console.error("Auto-dispense error:", errorData);
                setValidationErrors(errorData);
                setIsProcessing(false);

                // Generate error summary
                const errorSummary = {
                    transactionId: transactionId,
                    prescription: previewData.prescription_number,
                    patient: previewData.patient_name,
                    medicine: previewData.medicine_name,
                    error: errorData,
                    timestamp: new Date().toLocaleString(),
                    status: 'failed'
                };

                console.log('Dispense error summary:', errorSummary);

                // Show detailed error message
                const errorMessage = `❌ Dispense Failed!\n\n` +
                    `📋 Transaction ID: ${transactionId}\n` +
                    `👤 Patient: ${previewData.patient_name}\n` +
                    `💊 Medicine: ${previewData.medicine_name}\n` +
                    `🏷️ Generic: ${previewData.medicine_generic}\n` +
                    `🏭 Manufacturer: ${previewData.medicine_manufacturer}\n` +
                    `❌ Error: ${Object.values(errorData).join(', ')}\n` +
                    `⏰ Time: ${new Date().toLocaleString()}`;
                
                alert(errorMessage);
            }
        } catch (error) {
            console.error("Network error during dispense:", error);
            setIsProcessing(false);
            
            const errorMessage = `❌ Network Error!\n\n` +
                `📋 Transaction ID: ${transactionId}\n` +
                `👤 Patient: ${previewData.patient_name}\n` +
                `💊 Medicine: ${previewData.medicine_name}\n` +
                `❌ Error: ${error.message}\n` +
                `⏰ Time: ${new Date().toLocaleString()}`;
            
            alert(errorMessage);
        }
        
        console.log('Confirm Dispense completed');
    };

    // Separate validation functions for each mode
    const validatePrescriptionMode = () => {
        const errors = {};
        
        if (selectedBatches.length === 0) {
            errors.batch_number = 'Please select at least one batch';
        }
        
        if (!selectedPrescription) {
            errors.prescription = 'Please select a prescription';
        }
        
        return errors;
    };

    const validateManualMode = () => {
        const errors = {};
        
        if (selectedBatches.length === 0) {
            errors.batch_number = 'Please select at least one batch';
        }
        
        if (!data.quantity || data.quantity <= 0) {
            errors.quantity = 'Please enter a valid quantity';
        }
        
        if (!data.reason) {
            errors.reason = 'Please enter a reason for dispensing';
        }
        
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('=== FORM SUBMITTED ===');
        console.log('Form submitted, mode:', dispenseMode);
        console.log('Selected batches:', selectedBatches);
        console.log('Selected prescription:', selectedPrescription);
        console.log('Form data:', data);
        
        // Validate form based on mode
        let errors = {};
        
        if (dispenseMode === 'prescription') {
            errors = validatePrescriptionMode();
        } else if (dispenseMode === 'manual') {
            errors = validateManualMode();
        }
        
        console.log('Validation errors:', errors);
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        
        setValidationErrors({});
        
        if (dispenseMode === 'prescription') {
            // Show preview before dispensing for prescription mode
            console.log('Calling previewDispense');
            previewDispense();
        } else {
            // Direct dispense for manual mode
            console.log('Calling handleManualDispense');
            handleManualDispense();
        }
    };

    const handleManualDispense = () => {
        console.log('=== MANUAL DISPENSE STARTED ===');
        console.log('Selected batches:', selectedBatches);
        console.log('Quantity:', data.quantity);
        console.log('Reason:', data.reason);
        console.log('Patient name:', data.patient_name);
        console.log('Case ID:', data.case_id);
        console.log('Notes:', data.notes);
        
        // Validate required fields
        if (selectedBatches.length === 0) {
            console.error('No batches selected');
            setValidationErrors({ batch_number: 'Please select at least one batch' });
            return;
        }
        
        if (!data.quantity || data.quantity <= 0) {
            console.error('Invalid quantity');
            setValidationErrors({ quantity: 'Please enter a valid quantity' });
            return;
        }
        
        if (!data.reason) {
            console.error('No reason provided');
            setValidationErrors({ reason: 'Please enter a reason for dispensing' });
            return;
        }
        
        // Use the first selected batch for backward compatibility
        const firstBatch = selectedBatches[0];
        
        // Prepare the dispense data
        const dispenseData = {
            item_id: item.id,
            batch_id: firstBatch.batch_id || firstBatch.id,
            batch_number: firstBatch.batch_number,
            quantity: parseInt(data.quantity),
            reason: data.reason,
            patient_name: data.patient_name || 'Manual Dispense',
            case_id: data.case_id || null,
            dispensed_by: data.dispensed_by || 'Current User',
            notes: data.notes || `Manual dispense - ${data.reason}`,
            dispense_mode: 'manual'
        };
        
        console.log('Dispense data prepared:', dispenseData);
        console.log('Submitting to route:', '/pharmacist/inventory/dispense');
        
        // Submit the dispense request
        post('/pharmacist/inventory/dispense', dispenseData, {
            onSuccess: () => {
                console.log('=== MANUAL DISPENSE SUCCESSFUL ===');
                onClose();
                resetForm();
                // Refresh the page to update inventory data
                window.location.reload();
            },
            onError: (errors) => {
                console.error('=== MANUAL DISPENSE ERROR ===', errors);
                setValidationErrors(errors);
            }
        });
    };

    const resetForm = () => {
        console.log('Resetting form and clearing selected batches');
        setData({
            item_id: "",
            batch_id: "",
            batch_number: "",
            quantity: "",
            reason: "",
            patient_name: "",
            case_id: "",
            dispensed_by: "",
            notes: "",
            prescription_id: "",
            patient_id: "",
            doctor_id: ""
        });
        setSelectedPrescription(null);
        setSelectedBatches([]);
        setBatchQuantities({});
        setValidationErrors({});
        setDispenseMode('prescription');
        setAvailableCaseIds([]);
        setShowAllBatches(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30;
    };

    if (!item) return null;

    return (
        <>
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Dispense Stock - {item.name}
                    </DialogTitle>
                    <DialogDescription>
                        {dispenseMode === 'prescription' 
                            ? 'Select a prescription to automatically dispense the required medicines from available stock.'
                            : 'Select a batch and enter dispensing details to dispense stock from inventory.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Stock Dispense Header */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Stock Dispense
                        </h3>
                        <p className="text-sm text-gray-600">
                            {dispenseMode === 'prescription' 
                                ? 'Choose how you want to dispense this item from inventory.'
                                : 'Enter the details for manual dispensing of this item.'
                            }
                        </p>
                    </div>

                    {/* Dispense Mode Selector */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Dispense Mode (Current: {dispenseMode})</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    console.log('Switching to prescription mode');
                                    setDispenseMode('prescription');
                                }}
                                className={`p-3 border rounded-lg text-left transition-all ${
                                    dispenseMode === 'prescription'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="h-4 w-4" />
                                    <span className="font-medium">Prescription Based</span>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Dispense based on existing prescriptions
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log('Switching to manual mode');
                                    setDispenseMode('manual');
                                }}
                                className={`p-3 border rounded-lg text-left transition-all ${
                                    dispenseMode === 'manual'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Package className="h-4 w-4" />
                                    <span className="font-medium">Manual Dispense</span>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Dispense directly without prescription
                                </p>
                            </button>
                        </div>
                    </div>

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
                                <span className="ml-2 font-medium">{currentStock} {item.unit_type || "units"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Available Batches */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium">Available Batches for {item.name}</Label>
                                {selectedBatches.length > 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                        {selectedBatches.length} selected
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={showAllBatches}
                                        onChange={(e) => setShowAllBatches(e.target.checked)}
                                        className="rounded"
                                    />
                                    Show all batches
                                </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={loadAvailableBatches}
                                disabled={loadingBatches}
                                className="flex items-center gap-1"
                            >
                                <Package className={`h-3 w-3 ${loadingBatches ? 'animate-spin' : ''}`} />
                                {loadingBatches ? 'Loading...' : 'Refresh'}
                            </Button>
                            </div>
                        </div>
                        <div className="mt-2 space-y-2">
                            {loadingBatches && availableBatches.length === 0 ? (
                                <div className="flex items-center justify-center py-4 text-gray-500">
                                    <Package className="h-4 w-4 animate-spin mr-2" />
                                    Loading available batches...
                                </div>
                            ) : availableBatches.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    No batches available for this item
                                </div>
                            ) : (
                                availableBatches
                                    .filter(batch => showAllBatches || batch.available_quantity > 0)
                                    .map((batch, index) => {
                                        const isSelectable = batch.available_quantity > 0;
                                        const batchUniqueId = `${batch.batch_number}-${index}-${batch.batch_id || batch.id}`;
                                        const isSelected = selectedBatches.some(b => b.uniqueId === batchUniqueId);
                                        
                                        console.log('Rendering batch:', {
                                            batchNumber: batch.batch_number,
                                            batchUniqueId: batchUniqueId,
                                            isSelectable,
                                            isSelected,
                                            selectedBatchesCount: selectedBatches.length,
                                            selectedBatchUniqueIds: selectedBatches.map(b => b.uniqueId),
                                            availableQuantity: batch.available_quantity
                                        });
                                    
                                    return (
                                    <motion.div
                                            key={batchUniqueId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                            className={`p-3 border rounded-lg transition-all ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : isSelectable
                                                        ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
                                                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                        }`}
                                            onClick={() => isSelectable ? handleBatchSelect(batch, index) : null}
                                    >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                isSelected
                                                    ? 'bg-blue-500 border-blue-500'
                                                    : isSelectable
                                                        ? 'bg-white border-gray-300 hover:border-blue-300'
                                                        : 'bg-gray-100 border-gray-200'
                                            }`}>
                                                {isSelected && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">{batch.batch_number}</span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        #{index + 1}
                                                    </span>
                                                    {isExpiringSoon(batch.expiry_date) && (
                                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    )}
                                                    {!isSelectable && (
                                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                                            No Stock
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`text-sm ${
                                                    isSelectable ? 'text-gray-600' : 'text-gray-400'
                                                }`}>
                                                    Available: {batch.available_quantity} units
                                                    {!isSelectable && ' (Cannot select)'}
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
                                })
                            )}
                        </div>
                        {validationErrors.batch_number && (
                            <p className="text-sm text-red-600 mt-1">{validationErrors.batch_number}</p>
                        )}
                    </div>

                    {/* Prescription Selection - Only show in prescription mode */}
                    {dispenseMode === 'prescription' && (
                        <div>
                            <Label className="text-sm font-medium">Select Prescription</Label>
                            {loadingPrescriptions ? (
                                <div className="mt-2 p-4 text-center text-gray-500">
                                    Loading prescriptions...
                                </div>
                            ) : (
                                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                                    {pendingPrescriptions.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No pending prescriptions found for {item?.name || 'this medicine'}
                                        </div>
                                    ) : (
                                        pendingPrescriptions.map((prescription, index) => (
                                            <motion.div
                                                key={prescription.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                                    selectedPrescription?.id === prescription.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handlePrescriptionSelect(prescription)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full ${
                                                            selectedPrescription?.id === prescription.id
                                                                ? 'bg-blue-500'
                                                                : 'bg-gray-300'
                                                        }`}></div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-4 w-4 text-gray-500" />
                                                                <span className="font-medium">{prescription.prescription_number}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Patient: {prescription.patient_name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Doctor: {prescription.doctor_name}
                                                            </div>
                                                            <div className="text-sm text-blue-600 font-medium">
                                                                Case ID: {prescription.case_id || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(prescription.prescription_date)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {prescription.medicines.length} medicines
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Prescription Medicines */}
                                                {selectedPrescription?.id === prescription.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="mt-3 pt-3 border-t border-gray-200"
                                                    >
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Medicines in Prescription:</h4>
                                                        <div className="space-y-2">
                                                            {prescription.medicines.map((medicine, medIndex) => (
                                                                <div key={medIndex} className="bg-white p-2 rounded border text-sm">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <span className="font-medium">{medicine.medicine_name}</span>
                                                                            <div className="text-gray-600">
                                                                                Quantity: {medicine.quantity} | Dosage: {medicine.dosage}
                                                                            </div>
                                                                            <div className="text-gray-600">
                                                                                Frequency: {medicine.frequency} | Duration: {medicine.duration}
                                                                            </div>
                                                                            {medicine.instructions && (
                                                                                <div className="text-gray-600">
                                                                                    Instructions: {medicine.instructions}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {medicine.is_dispensed && (
                                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            )}
                            {validationErrors.prescription && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.prescription}</p>
                            )}
                        </div>
                    )}

                    {/* Manual Dispense Form - Only show in manual mode */}
                    {dispenseMode === 'manual' && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="quantity">Quantity to Dispense *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    placeholder="Enter quantity to dispense"
                                    className="mt-1"
                                />
                                {validationErrors.quantity && (
                                    <p className="text-sm text-red-600 mt-1">{validationErrors.quantity}</p>
                                )}
                            </div>
                            
                            <div>
                                <Label htmlFor="reason">Reason for Dispensing *</Label>
                                <Input
                                    id="reason"
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    placeholder="e.g., Emergency use, Over-the-counter, etc."
                                    className="mt-1"
                                />
                                {validationErrors.reason && (
                                    <p className="text-sm text-red-600 mt-1">{validationErrors.reason}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="patient_name">Patient/Recipient Name</Label>
                                <Input
                                    id="patient_name"
                                    value={data.patient_name}
                                    onChange={(e) => setData('patient_name', e.target.value)}
                                    placeholder="Enter patient or recipient name (optional)"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="case_id">Case ID</Label>
                                <Input
                                    id="case_id"
                                    value={data.case_id}
                                    onChange={(e) => setData('case_id', e.target.value)}
                                    placeholder="Enter case ID (optional)"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Any additional notes or instructions..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Dispense Summary */}
                    {selectedPrescription && selectedBatches.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                        >
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Dispense Summary
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-700">Item:</span>
                                    <span className="ml-2 font-medium">{item.name}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Selected Batches:</span>
                                    <span className="ml-2 font-medium">{selectedBatches.length} batch(es)</span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Total Available:</span>
                                    <span className="ml-2 font-medium">
                                        {selectedBatches.reduce((total, batch) => total + (batch.available_quantity || 0), 0)} units
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Batch Numbers:</span>
                                    <span className="ml-2 font-medium">
                                        {selectedBatches.map(b => b.batch_number).join(', ')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Patient:</span>
                                    <span className="ml-2 font-medium">{selectedPrescription.patient_name}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Case ID:</span>
                                    <span className="ml-2 font-medium">{selectedPrescription.case_id || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Doctor:</span>
                                    <span className="ml-2 font-medium">{selectedPrescription.doctor_name}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700">Prescription:</span>
                                    <span className="ml-2 font-medium">{selectedPrescription.prescription_number}</span>
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
                            disabled={processing || selectedBatches.length === 0 || (dispenseMode === 'prescription' && !selectedPrescription)}
                            style={{ backgroundColor: '#2C3E50' }}
                            onClick={(e) => {
                                console.log('=== BUTTON CLICKED ===');
                                console.log('Button type:', e.target.type);
                                console.log('Form element:', e.target.closest('form'));
                                console.log('Dispense mode:', dispenseMode);
                                console.log('Selected batches:', selectedBatches);
                                console.log('Form data:', data);
                                console.log('Button disabled:', processing || selectedBatches.length === 0 || (dispenseMode === 'prescription' && !selectedPrescription));
                                console.log('Processing:', processing);
                                console.log('Selected batches count:', selectedBatches.length);
                                console.log('Prescription mode check:', dispenseMode === 'prescription' && !selectedPrescription);
                            }}
                        >
                            {processing ? "Stock Dispensing..." : `Stock Dispense${selectedBatches.length > 0 ? ` (${selectedBatches.length} batches)` : ''}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* Preview Modal */}
        {showPreview && previewData && (
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Dispense Preview
                        </DialogTitle>
                        <DialogDescription>
                            Review the dispense details before confirming
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        {/* Prescription Info */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-3">Prescription Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-700 font-medium">Prescription:</span>
                                    <span className="ml-2">{previewData.prescription_number}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700 font-medium">Patient:</span>
                                    <span className="ml-2">{previewData.patient_name}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700 font-medium">Doctor:</span>
                                    <span className="ml-2">{previewData.doctor_name}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700 font-medium">Medicine:</span>
                                    <span className="ml-2">{previewData.medicine_name}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700 font-medium">Generic Name:</span>
                                    <span className="ml-2">{previewData.medicine_generic}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700 font-medium">Manufacturer:</span>
                                    <span className="ml-2">{previewData.medicine_manufacturer}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dispense Summary */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-900 mb-3">Dispense Summary</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-green-700 font-medium">Required Quantity:</span>
                                    <span className="ml-2">{previewData.required_quantity} units</span>
                                </div>
                                <div>
                                    <span className="text-green-700 font-medium">Will Dispense:</span>
                                    <span className="ml-2 font-bold text-green-800">{previewData.dispensed_quantity} units</span>
                                </div>
                                <div>
                                    <span className="text-green-700 font-medium">Batches Used:</span>
                                    <span className="ml-2">{previewData.batches_used} batches</span>
                                </div>
                                <div>
                                    <span className="text-green-700 font-medium">Status:</span>
                                    <span className="ml-2">
                                        {previewData.required_quantity === previewData.dispensed_quantity ? 
                                            <span className="text-green-600 font-medium">✓ Complete</span> : 
                                            <span className="text-orange-600 font-medium">⚠ Partial</span>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Batch Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3">Batch Allocation</h3>
                            <div className="space-y-2">
                                {previewData.allocated_batches.map((batch, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                                        <div>
                                            <span className="font-medium">{batch.batch_number}</span>
                                            <span className="text-gray-500 ml-2">({new Date(batch.expiry_date).toLocaleDateString()})</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-blue-600">{batch.quantity} units</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowPreview(false);
                                setPreviewData(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmDispense}
                            disabled={isProcessing || !selectedPrescription || selectedBatches.length === 0}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isProcessing ? "Processing..." : "Confirm Dispense"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}

        {/* Dispense Summary Modal */}
        {showSummaryModal && dispenseSummary && (
            <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-green-600">Dispense Completed Successfully!</DialogTitle>
                                <p className="text-sm text-gray-600">Transaction Summary</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Transaction Info */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h3 className="font-semibold text-base mb-2 text-gray-800">Transaction Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-600">Transaction ID:</span>
                                    <p className="font-mono text-sm font-semibold">{dispenseSummary.transactionId}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Date & Time:</span>
                                    <p className="text-sm font-semibold">{dispenseSummary.timestamp}</p>
                                </div>
                            </div>
                        </div>

                        {/* Prescription & Patient Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-base mb-2 text-blue-800">Prescription Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-blue-600">Prescription Number:</span>
                                        <p className="font-semibold">{dispenseSummary.prescription.number}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-blue-600">Case ID:</span>
                                        <p className="font-semibold">{dispenseSummary.prescription.caseId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-base mb-2 text-purple-800">Patient Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-purple-600">Patient Name:</span>
                                        <p className="font-semibold">{dispenseSummary.patient.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-purple-600">Patient ID:</span>
                                        <p className="font-semibold">{dispenseSummary.patient.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medicine & Batch Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-base mb-2 text-green-800">Medicine Details</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-green-600">Medicine Name:</span>
                                        <p className="font-semibold">{dispenseSummary.medicine.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-green-600">Manufacturer:</span>
                                        <p className="font-semibold">{dispenseSummary.medicine.manufacturer}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-green-600">Quantity Dispensed:</span>
                                        <p className="font-semibold text-lg">{dispenseSummary.medicine.quantity} {dispenseSummary.medicine.unit}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-base mb-2 text-orange-800">Batch Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-orange-600">Batch Number:</span>
                                        <p className="font-semibold">{dispenseSummary.batch.number}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-orange-600">Expiration Date:</span>
                                        <p className="font-semibold">{dispenseSummary.batch.expiration}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Staff Information */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h3 className="font-semibold text-base mb-2 text-gray-800">Staff Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-600">Prescribing Doctor:</span>
                                    <p className="font-semibold">{dispenseSummary.doctor.name}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Dispensing Pharmacist:</span>
                                    <p className="font-semibold">{dispenseSummary.pharmacist.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Statistics */}
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-base mb-2 text-gray-800">Dispense Summary</h3>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <div className="text-lg font-bold text-blue-600">{dispenseSummary.summary.totalItems}</div>
                                    <div className="text-xs text-gray-600">Total Items</div>
                                </div>
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <div className="text-lg font-bold text-green-600">{dispenseSummary.summary.totalQuantity}</div>
                                    <div className="text-xs text-gray-600">Total Quantity</div>
                                </div>
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <div className="text-lg font-bold text-purple-600">{dispenseSummary.summary.inventoryImpact}</div>
                                    <div className="text-xs text-gray-600">Inventory Impact</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowSummaryModal(false);
                                setDispenseSummary(null);
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            type="button"
                            onClick={printSummary}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Print Summary
                        </Button>
                        <Button
                            type="button"
                            onClick={exportToPDF}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Export PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
        </>
    );
};

export default DispenseStockModal;
