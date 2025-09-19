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
    Tag
} from "lucide-react";

const ViewItemModal = ({ open, onClose, item }) => {
    if (!item) return null;

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
                return 'Out of Stock';
            case 'expiring_soon':
                return 'Expiring Soon';
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
                                    {item.category}
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
                                        <p className="text-sm text-gray-500">Batch Number</p>
                                        <p className="font-medium text-gray-900">
                                            {item.batchNumber || 'N/A'}
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
                                    <Package className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Quantity</p>
                                        <p className="font-medium text-gray-900">
                                            {item.quantity} {item.unit}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Expiry Date</p>
                                        <p className="font-medium text-gray-900">
                                            {item.expiryDate !== 'N/A' && item.expiryDate !== 'Invalid Date' 
                                                ? new Date(item.expiryDate).toLocaleDateString() 
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-900">
                                Stock Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Current Stock</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {item.quantity}
                                    </p>
                                    <p className="text-xs text-gray-400">{item.unit}</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Minimum Level</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {item.minimumStock || 10}
                                    </p>
                                    <p className="text-xs text-gray-400">{item.unit}</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Maximum Level</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {item.maximumStock || 100}
                                    </p>
                                    <p className="text-xs text-gray-400">{item.unit}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-900">
                                Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Storage Location</p>
                                        <p className="font-medium text-gray-900">
                                            {item.storageLocation || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-medium text-gray-900">
                                            {item.category}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {item.description && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Description</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        {item.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewItemModal;
