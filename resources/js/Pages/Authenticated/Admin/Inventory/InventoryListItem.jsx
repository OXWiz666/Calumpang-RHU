import React, { useState } from "react";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Button } from "@/components/tempo/components/ui/button";
import { 
    Package, 
    AlertTriangle, 
    Clock, 
    Edit, 
    Trash2, 
    TrendingUp, 
    ChevronDown, 
    ChevronUp,
    MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import CustomModal from "@/components/CustomModal";
import { router, useForm } from "@inertiajs/react";
import InputLabel from "@/components/InputLabel";
import { Label } from "@/components/tempo/components/ui/label";
import { Input } from "@/components/tempo/components/ui/input";
import { DialogFooter } from "@/components/tempo/components/ui/dialog";

const InventoryListItem = ({ item, onUpdateClick }) => {
    const [expanded, setExpanded] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const isLowStock = item?.stock[0]?.stocks <= 5;
    const isExpiring = item?.stocks_movement?.[item?.stocks_movement?.length - 1]?.expiry_date &&
        new Date(item?.stocks_movement?.[item?.stocks_movement?.length - 1]?.expiry_date).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

    const getBadgeColor = (category) => {
        switch (category) {
            case "Medicine":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Vaccine":
                return "bg-green-100 text-green-800 border-green-200";
            case "Supply":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "Equipment":
                return "bg-orange-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const {
        data,
        setData,
        post,
        recentlySuccessful,
        processing,
        errors,
        put: updateItem,
        delete: destroyItem,
    } = useForm({
        itemname: item?.name,
        categoryid: item?.category_id,
    });

    const [cDeleting, setCDeleting] = useState(false);
    const [cUpdating, setCUpdating] = useState(false);

    const Edit_Item = (e) => {
        e.preventDefault();
        updateItem(
            route("admin.inventory.item.update", { inventory: item.id }),
            {
                onFinish: () => {
                    router.reload({
                        only: ["flash", "inventory"],
                    });
                },
                onSuccess: () => {
                    setCUpdating(false);
                },
            }
        );
    };

    const Delete_Item = (e) => {
        e.preventDefault();
        destroyItem(
            route("admin.inventory.item.delete", { inventory: item.id }),
            {
                onFinish: () => {
                    router.reload({
                        only: ["flash", "inventory"],
                    });
                },
                onSuccess: () => {
                    setCDeleting(false);
                },
            }
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        className="group transition-colors duration-200 hover:bg-gray-50"
        >
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Section - Item Info */}
                    <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-blue-50">
                            <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-lg font-semibold truncate text-gray-900">
                                    {item.name}
                                </h4>
                                <Badge className={`${getBadgeColor(item.category.name)} border`}>
                                    {item.category.name}
                                </Badge>
                            </div>
                            
                            {item?.stocks_movement?.[0]?.batch_number && (
                                <div className="mb-2">
                                    <span className="text-xs font-medium text-gray-500">Batch: </span>
                                    <span className="text-sm font-mono px-2 py-1 rounded bg-gray-100 text-gray-700">
                                        {item?.stocks_movement?.[0]?.batch_number}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Stock:</span>
                                    <span className={`font-semibold ${isLowStock ? "text-red-600" : "text-gray-900"}`}>
                                        {item.stock[0]?.stocks} {item.stock[0]?.stockname}
                                    </span>
                                </div>
                                
                                {item?.stocks_movement?.[0]?.expiry_date && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">Expires:</span>
                                        <span className={`font-medium ${isExpiring ? "text-amber-600" : "text-gray-700"}`}>
                                            {format(new Date(item?.stocks_movement?.[item?.stocks_movement?.length - 1]?.expiry_date), "MMM dd, yyyy")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Status & Actions */}
                    <div className="flex items-center gap-3">
                        {/* Status Badges */}
                        <div className="flex items-center gap-2">
                            {isLowStock && (
                                <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Low Stock
                                </Badge>
                            )}
                            {isExpiring && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Expiring Soon
                                </Badge>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                             <Button
                                 variant="outline"
                                 size="sm"
                                 className="h-8 px-3 text-white border-0"
                                 style={{ backgroundColor: '#2C3E50' }}
                                 onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                                 onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
                                 onClick={() => onUpdateClick(item)}
                             >
                                 <TrendingUp className="h-3 w-3 mr-1" />
                                 Update Stock
                             </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                                onClick={() => setCUpdating(true)}
                            >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                onClick={() => setCDeleting(true)}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 pt-4 border-t border-gray-100"
                        >
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm font-medium mb-1 text-gray-500">Last Updated</p>
                                    <p className="text-sm text-gray-900">
                                        {format(new Date(item.stocks_movement[0]?.updated_at), "MMM dd, yyyy")}
                                    </p>
                                </div>
                                
                                {item.isVaccine && (
                                    <>
                                        {item.lotNumber && (
                                            <div>
                                                <p className="text-sm font-medium mb-1 text-gray-500">Lot Number</p>
                                                <p className="text-sm text-gray-900">{item.lotNumber}</p>
                                            </div>
                                        )}
                                        {item.location && (
                                            <div>
                                                <p className="text-sm font-medium mb-1 text-gray-500">Storage Location</p>
                                                <p className="text-sm text-gray-900">{item.location}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <CustomModal
                isOpen={cUpdating}
                onClose={() => setCUpdating(false)}
                title="Update Item"
                description={`Update ${item?.name} item here.`}
                maxWidth="md"
            >
                <div>
                    <InputLabel value="Item Name*" />
                    <Input
                        value={data?.itemname}
                        onChange={(e) => setData("itemname", e.target.value)}
                    />
                </div>
                <DialogFooter className="pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCUpdating(false)}
                    >
                        Cancel
                    </Button>
                     <Button
                         className="text-white"
                         style={{ backgroundColor: '#2C3E50' }}
                         onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                         onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
                         disabled={processing}
                         onClick={Edit_Item}
                     >
                         Update Item
                     </Button>
                </DialogFooter>
            </CustomModal>

            <CustomModal
                isOpen={cDeleting}
                onClose={() => setCDeleting(false)}
                title="Delete Item"
                description={`Are you sure you want to delete this item ${item?.name}?`}
                maxWidth="md"
            >
                <DialogFooter className="pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCDeleting(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={processing}
                        onClick={Delete_Item}
                    >
                        Delete Item
                    </Button>
                </DialogFooter>
            </CustomModal>
        </motion.div>
    );
};

export default InventoryListItem;
