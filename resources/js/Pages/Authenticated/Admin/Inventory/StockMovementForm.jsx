import React, { useEffect, useState } from "react";
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
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/tempo/components/ui/radio-group";
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { router, useForm, usePage } from "@inertiajs/react";
import PrintErrors from "@/components/PrintErrors";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Package, Calendar, Hash, FileText, User } from "lucide-react";

const StockMovementForm = ({ open, onClose, item, onSave }) => {
    // const [data.type, setMovementType] = useState("incoming");
    // const [quantity, setQuantity] = useState("1");
    // const [batchNumber, setBatchNumber] = useState("");
    // const [lotNumber, setLotNumber] = useState("");
    // const [reason, setReason] = useState("");
    // const [performedBy, setPerformedBy] = useState("");

    const { data, setData, post, processing, recentlySuccessful, errors, put } =
        useForm({
            type: "", //item?.stocks_movement[0]?.type,
            batchNumber: "",
            quantity: "",
            reason: "",
            expiry: "",
            
            //performedBy:
        });

    useEffect(() => {
        if (item) {
            setData({
                type: item?.stocks_movement[0]?.type,
                quantity: 0, //item?.stock[0]?.stocks,
                reason: item?.stocks_movement[0]?.reason,
                expiry: item?.stocks_movement?.[
                    item?.stocks_movement?.length - 1
                ]?.expiry_date,
                 batchNumber: item?.stocks_movement[0]?.batch_number || '',
            });
            console.log("item:", item, item?.stocks_movement[0]?.type);
        }
    }, [item]);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

            if (data.type === "Outgoing") {
        if (parseInt(data.quantity) > item?.stock[0]?.stocks) {
            alert("Cannot remove more items than current stock");
            return;
        }
    }
        put(
            route("admin.inventory.item.stockmovement.update", {
                movement: item?.stocks_movement[0]?.id,
            }),
            {
                onFinish: () => {
                    router.reload({
                        only: ["flash", "inventory", "movements_"],
                    });
                },
                onSuccess: () => {
                    onClose();
                },
            }
        );
        // if (!item) return;

        // const movement = {
        //     id: `mov-${Date.now()}`,
        //     itemId: item.id,
        //     type: data.type,
        //     quantity: parseInt(quantity),
        //     date: new Date(),
        //     performedBy,
        // };

        // if (item.isVaccine) {
        //     movement.batchNumber = batchNumber;
        //     movement.lotNumber = lotNumber;
        // }

        // if (reason) {
        //     movement.reason = reason;
        // }

        // onSave(movement);
        // resetForm();
        // onClose();
    };

    // const resetForm = () => {
    //     setMovementType("incoming");
    //     setQuantity("1");
    //     setBatchNumber("");
    //     setLotNumber("");
    //     setReason("");
    //     setPerformedBy("");
    // };

    const { user } = usePage().props.auth;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Record Stock Movement</DialogTitle>
                            <p className="text-sm mt-1 text-gray-600">Update inventory stock levels</p>
                        </div>
                    </div>
                </DialogHeader>
                <PrintErrors errors={errors} />
                <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6 pt-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                        <div className="rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="h-5 w-5 text-gray-600" />
                            <Label className="text-sm font-medium text-gray-700">Item Details</Label>
                        </div>
                        <p className="font-semibold text-gray-900">{item?.name}</p>
                        <p className="text-sm text-gray-600">
                            Current stock: <span className="font-medium text-gray-900">{item?.stock[0]?.stocks} {item?.stock[0]?.stockname}s</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                                    <TrendingUp className="h-4 w-4 text-gray-500" />
                                    Movement Type
                                </Label>
                                <RadioGroup
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData("type", value)
                                    }
                                    className="space-y-2"
                                >
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg transition-colors border-gray-200 hover:bg-green-50 hover:border-green-300">
                                        <RadioGroupItem
                                            value="Incoming"
                                            id="Incoming"
                                        />
                                        <Label htmlFor="Incoming" className="flex items-center gap-2 cursor-pointer">
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium text-gray-900">Incoming</span>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg transition-colors border-gray-200 hover:bg-red-50 hover:border-red-300">
                                        <RadioGroupItem
                                            value="Outgoing"
                                            id="Outgoing"
                                        />
                                        <Label htmlFor="Outgoing" className="flex items-center gap-2 cursor-pointer">
                                            <TrendingDown className="h-4 w-4 text-red-600" />
                                            <span className="text-sm font-medium text-gray-900">Outgoing</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    Expiry Date
                                </Label>
                                <Input
                                    id="expirationDate"
                                    type="date"
                                    name="expirydate"
                                    value={data.expiry}
                                    onChange={(e) =>
                                        setData("expiry", e.target.value)
                                    }
                                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-500" />
                            Quantity
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            max={data.type === "Outgoing" ? item?.stock[0]?.stocks : undefined}
                            name="quantity"
                            value={data.quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        {data.type === "Outgoing" && (
                            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                                Maximum quantity that can be removed: {item?.stock[0]?.stocks}
                            </p>
                        )}
                    </div>


                    {/* {item?.isVaccine && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="batchNumber">
                                    Batch Number
                                </Label>
                                <Input
                                    id="batchNumber"
                                    value={batchNumber}
                                    onChange={(e) =>
                                        setBatchNumber(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lotNumber">Lot Number</Label>
                                <Input
                                    id="lotNumber"
                                    value={lotNumber}
                                    onChange={(e) =>
                                        setLotNumber(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </>
                    )} */}

                    <div className="space-y-3">
                        <Label htmlFor="reason" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            Reason {data.type === "Outgoing" && "(Required)"}
                        </Label>
                        <Textarea
                            id="reason"
                            name="reason"
                            value={data.reason}
                            onChange={handleChange}
                            placeholder={
                                data.type === "Incoming"
                                    ? "Optional - Enter reason for adding stock"
                                    : "Why is this item being removed from inventory?"
                            }
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required={data.type === "Outgoing"}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="performedBy" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            Performed By
                        </Label>
                        <Input
                            id="performedBy"
                            value={`${user?.firstname} ${user?.lastname}`}
                            className="h-11 border-gray-300 bg-gray-50"
                            disabled
                        />
                    </div>

                    <DialogFooter className="pt-6 border-t border-gray-100">
                        <div className="flex gap-3 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-11 border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-11 text-white"
                                style={{ backgroundColor: '#2C3E50' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </DialogFooter>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
};

export default StockMovementForm;
