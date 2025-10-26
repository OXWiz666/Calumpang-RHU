import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { 
    Package, 
    Calendar, 
    Hash, 
    Building2, 
    MapPin, 
    AlertTriangle,
    Clock,
    Tag,
    XCircle,
    AlertCircle,
    FileText
} from "lucide-react";

const ViewItemModal = ({ open, onClose, item }) => {
    if (!item) return null;

    // Helper function to check if item is expired
    const isExpired = (expiryDate) => {
        if (!expiryDate || expiryDate === 'N/A') return false;
        try {
            const expiry = new Date(expiryDate);
            const today = new Date();
            return expiry < today;
        } catch (error) {
            return false;
        }
    };

    // Helper function to check if item is expiring soon (within 30 days)
    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate || expiryDate === 'N/A') return false;
        try {
            const expiry = new Date(expiryDate);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        } catch (error) {
            return false;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'in_stock':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'low_stock':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'out_of_stock':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'expiring_soon':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'in_stock':
                return 'In Stock';
            case 'low_stock':
                return 'Low Stock';
            case 'out_of_stock':
                return 'Out of Stock Items';
            case 'expiring_soon':
                return 'Expiring Soon Items';
            default:
                return 'Unknown';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Item Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Item Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {item.category?.name || 'Uncategorized'}
                                </p>
                            </div>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                        </Badge>
                    </div>

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-900">
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Hash className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Total Batches</p>
                                        <p className="font-medium text-gray-900">
                                            {item.batchCount || 0} batch{(item.batchCount || 0) !== 1 ? 'es' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Manufacturer</p>
                                        <p className="font-medium text-gray-900">
                                            {item.manufacturer || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Minimum Stock Level</p>
                                        <p className="font-medium text-gray-900">
                                            {item.minimum_stock !== null && item.minimum_stock !== undefined ? item.minimum_stock : 'Not Set'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Maximum Stock Level</p>
                                        <p className="font-medium text-gray-900">
                                            {item.maximum_stock !== null && item.maximum_stock !== undefined ? item.maximum_stock : 'Not Set'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Earliest Expiry</p>
                                        <p className="font-medium text-gray-900">
                                            {(() => {
                                                if (!item.batches || item.batches.length === 0) return 'N/A';
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
                                                
                                                if (!earliestBatch || earliestBatch.expiryDate === 'N/A') return 'N/A';
                                                try {
                                                    const date = new Date(earliestBatch.expiryDate);
                                                    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                                                } catch (error) {
                                                    return 'Invalid Date';
                                                }
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Description */}
                            {item.description && (
                                <div className="mt-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-500">Description</p>
                                    </div>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        {item.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>


                    {/* Batch Details */}
                    {item.batches && item.batches.length > 0 && (() => {
                        // Filter out expired batches
                        const activeBatches = item.batches.filter(batch => !isExpired(batch.expiryDate));
                        const expiredBatches = item.batches.filter(batch => isExpired(batch.expiryDate));
                        
                        return (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-medium text-gray-900">
                                            Batch Details
                                            {expiredBatches.length > 0 && (
                                                <span className="ml-2 text-sm text-red-600 font-normal">
                                                    ({expiredBatches.length} expired batch{expiredBatches.length !== 1 ? 'es' : ''} hidden)
                                                </span>
                                            )}
                                        </CardTitle>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total Quantity</p>
                                            <p className="text-lg font-semibold text-blue-600">
                                                {activeBatches.reduce((total, batch) => total + (batch.quantity || 0), 0)} {item.unit || 'units'}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {activeBatches.map((batch, index) => {
                                        const batchExpired = isExpired(batch.expiryDate);
                                        const batchExpiringSoon = isExpiringSoon(batch.expiryDate);
                                        
                                        return (
                                            <div 
                                                key={batch.id || index} 
                                                className={`border rounded-lg p-4 ${
                                                    batchExpired 
                                                        ? 'bg-red-50 border-red-200' 
                                                        : batchExpiringSoon 
                                                        ? 'bg-amber-50 border-amber-200' 
                                                        : 'bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-gray-900 font-mono">
                                                            {batch.batchNumber || 'N/A'}
                                                        </h4>
                                                        {batchExpired && (
                                                            <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                                                                <XCircle className="h-3 w-3" />
                                                                EXPIRED
                                                            </Badge>
                                                        )}
                                                        {batchExpiringSoon && !batchExpired && (
                                                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                EXPIRING SOON
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Expiry Date</p>
                                                        <p className={`font-medium ${
                                                            batchExpired 
                                                                ? 'text-red-600' 
                                                                : batchExpiringSoon 
                                                                ? 'text-amber-600' 
                                                                : 'text-gray-900'
                                                        }`}>
                                                            {(() => {
                                                                if (!batch.expiryDate || batch.expiryDate === 'N/A') return 'N/A';
                                                                try {
                                                                    const date = new Date(batch.expiryDate);
                                                                    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                                                                } catch (error) {
                                                                    return 'Invalid Date';
                                                                }
                                                            })()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Storage Location</p>
                                                        <p className="font-medium text-gray-900">
                                                            {batch.storageLocation || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Quantity</p>
                                                        <p className="font-medium text-gray-900">
                                                            {batch.quantity || 0} {item.unit || 'units'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Status</p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={getStatusColor(batch.status)}>
                                                                {getStatusText(batch.status)}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                        );
                    })()}

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewItemModal;
