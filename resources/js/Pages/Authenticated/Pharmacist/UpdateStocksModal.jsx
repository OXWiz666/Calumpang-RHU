import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/tempo/components/ui/select";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Package, Plus, Minus, Hash, Calendar, Building2, FileText } from "lucide-react";

const UpdateStocksModal = ({ open, onClose, item }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [availableBatches, setAvailableBatches] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        item_id: item?.id || "",
        adjustment_type: "add", // 'add' | 'reduce'
        quantity: "",
        reason: "",
        reference_number: "",
        supplier: "",
        batch_number: item?.batch_number || "",
        expiry_date: item?.expiry_date ? new Date(item.expiry_date).toISOString().split('T')[0] : "",
        notes: "",
        minimum_stock: item?.minimumStock || 0,
        maximum_stock: item?.maximumStock || 0,
    });

    useEffect(() => {
        if (item && open) {
            setData("item_id", item.id);
            setData("batch_number", item.batchNumber || item.batch_number || "");
            setData("expiry_date", item.expiryDate && item.expiryDate !== 'N/A' ? new Date(item.expiryDate).toISOString().split('T')[0] : "");
            
            // Fetch available batches for this item
            fetchAvailableBatches();
        }
    }, [item, open]);

    const fetchAvailableBatches = async () => {
        if (!item?.id) return;
        
        console.log('Fetching batches for item:', item.name, 'ID:', item.id);
        setLoadingBatches(true);
        try {
            const url = `/pharmacist/inventory/item/${item.id}/batches?t=${Date.now()}`;
            console.log('API URL:', url);
            const response = await fetch(url);
            console.log('Response status:', response.status);
            if (response.ok) {
                const batches = await response.json();
                console.log('Received batches for item', item.name, ':', batches);
                setAvailableBatches(batches);
            } else {
                console.error('API response not OK:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
        } finally {
            setLoadingBatches(false);
        }
    };

    const getCurrentStock = () => {
        return Number(item?.quantity ?? item?.stock?.stocks ?? 0) || 0;
    };

    const getProjectedStock = () => {
        const current = getCurrentStock();
        const qty = Number(data.quantity) || 0;
        return data.adjustment_type === 'add' ? current + qty : current - qty;
    };

    const adjustQuantityBy = (delta) => {
        const next = Math.max(0, Number(data.quantity || 0) + delta);
        setData("quantity", next);
    };

    const validateForm = () => {
        const errs = {};
        if (!data.quantity || Number(data.quantity) <= 0) {
            errs.quantity = "Please enter a valid quantity";
        }
        if (!data.adjustment_type) {
            errs.adjustment_type = "Please select an adjustment type";
        }
        if (!data.reason.trim()) {
            errs.reason = "Please provide a reason";
        }
        const current = getCurrentStock();
        if (data.adjustment_type === 'reduce' && Number(data.quantity) > current) {
            errs.quantity = `Cannot reduce more than current stock (${current})`;
        }
        if (data.adjustment_type === 'reduce' && getProjectedStock() < 0) {
            errs.quantity = "Resulting stock cannot be negative";
        }
        const projected = getProjectedStock();
        const effectiveMax = Number(data.maximum_stock || 0);
        if (effectiveMax > 0 && projected > effectiveMax) {
            errs.quantity = `Projected stock (${projected}) exceeds maximum (${effectiveMax})`;
        }
        if (data.minimum_stock < 0) {
            errs.minimum_stock = "Minimum stock cannot be negative";
        }
        if (data.maximum_stock < 0) {
            errs.maximum_stock = "Maximum stock cannot be negative";
        }
        if (Number(data.minimum_stock) > Number(data.maximum_stock)) {
            errs.maximum_stock = "Maximum must be greater than or equal to minimum";
        }
        setValidationErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        post(route("pharmacist.inventory.update-stocks"), {
            onSuccess: () => {
                onClose();
                reset();
            },
            onError: (err) => {
                console.error("Update stocks error:", err);
            },
            preserveScroll: true,
        });
    };

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Update Stocks - {item.name}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Item Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Item:</span>
                                <span className="ml-2 font-medium">{item.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Current Stock:</span>
                                <span className="ml-2 font-medium">{item.quantity || item.stock?.stocks || 0} {item.unit || item.unit_type || "units"}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Category:</span>
                                <span className="ml-2 font-medium">{item.category?.name || item.category || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Manufacturer:</span>
                                <span className="ml-2 font-medium">{item.manufacturer || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Adjustment Type</Label>
                            <Select value={data.adjustment_type} onValueChange={(v) => setData("adjustment_type", v)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="add">Add Stock</SelectItem>
                                    <SelectItem value="reduce">Reduce Stock</SelectItem>
                                </SelectContent>
                            </Select>
                            {validationErrors.adjustment_type && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.adjustment_type}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={data.quantity}
                                onChange={(e) => setData("quantity", e.target.value)}
                                placeholder="Enter quantity"
                                className="mt-1"
                            />
                            <div className="flex gap-2 mt-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => adjustQuantityBy(-10)}>-10</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => adjustQuantityBy(-1)}>-1</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => adjustQuantityBy(1)}>+1</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => adjustQuantityBy(10)}>+10</Button>
                            </div>
                            {validationErrors.quantity && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.quantity}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="reason">Reason *</Label>
                            <Input
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData("reason", e.target.value)}
                                placeholder="e.g., New delivery, correction, damage, audit"
                                className="mt-1"
                            />
                            {validationErrors.reason && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.reason}</p>
                            )}
                        </div>
                    </div>

                    {/* Adjustment Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                        <h4 className="font-semibold text-blue-900 mb-2">Adjustment Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-blue-700">Current Stock:</span>
                                <span className="ml-2 font-medium">{getCurrentStock()} {item.unit || item.unit_type || "units"}</span>
                            </div>
                            <div>
                                <span className="text-blue-700">Adjustment:</span>
                                <span className="ml-2 font-medium">{data.adjustment_type === 'add' ? '+' : '-'}{Number(data.quantity || 0)}</span>
                            </div>
                            <div>
                                <span className="text-blue-700">Projected Stock:</span>
                                <span className={`ml-2 font-medium ${getProjectedStock() < 0 ? 'text-red-600' : ''}`}>{getProjectedStock()}</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="minimum_stock">Minimum Stock Level</Label>
                            <Input
                                id="minimum_stock"
                                type="number"
                                min="0"
                                value={data.minimum_stock}
                                onChange={(e) => setData("minimum_stock", e.target.value)}
                                placeholder="0"
                                className="mt-1"
                            />
                            {validationErrors.minimum_stock && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.minimum_stock}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="maximum_stock">Maximum Stock Level</Label>
                            <Input
                                id="maximum_stock"
                                type="number"
                                min="0"
                                value={data.maximum_stock}
                                onChange={(e) => setData("maximum_stock", e.target.value)}
                                placeholder="0"
                                className="mt-1"
                            />
                            {validationErrors.maximum_stock && (
                                <p className="text-sm text-red-600 mt-1">{validationErrors.maximum_stock}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="reference_number">Reference No.</Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="reference_number"
                                    value={data.reference_number}
                                    onChange={(e) => setData("reference_number", e.target.value)}
                                    placeholder="e.g., DR-001122"
                                    className="mt-1 pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="supplier">Supplier</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="supplier"
                                    value={data.supplier}
                                    onChange={(e) => setData("supplier", e.target.value)}
                                    placeholder="Supplier name"
                                    className="mt-1 pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="batch_number">Batch/Lot Number</Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                <Select value={data.batch_number} onValueChange={(value) => setData("batch_number", value)}>
                                    <SelectTrigger className="mt-1 pl-10">
                                        <SelectValue placeholder={loadingBatches ? "Loading batches..." : "Select a batch number"} />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="expiry_date">Expiry Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData("expiry_date", e.target.value)}
                                    className="mt-1 pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            placeholder="Any additional details..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} style={{ backgroundColor: '#2C3E50' }}>
                            {processing ? (data.adjustment_type === 'add' ? 'Adding...' : 'Reducing...') : (data.adjustment_type === 'add' ? 'Add Stock' : 'Reduce Stock')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateStocksModal;


