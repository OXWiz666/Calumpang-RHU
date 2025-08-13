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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Record Stock Movement</DialogTitle>
                </DialogHeader>
                <PrintErrors errors={errors} />
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Item</Label>
                        <p className="font-medium">{item?.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Current stock: {item?.stock[0]?.stocks}{" "}
                            {item?.stock[0]?.stockname}s
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label>Movement Type</Label>
                                <RadioGroup
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData("type", value)
                                    }
                                    className="flex items-center space-x-2"
                                >
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem
                                            value="Incoming"
                                            id="Incoming"
                                        />
                                        <Label htmlFor="Incoming">
                                            Incoming
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem
                                            value="Outgoing"
                                            id="Outgoing"
                                        />
                                        <Label htmlFor="outgoing">
                                            Outgoing
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div>
                                <Label>Expiry Date</Label>
                                <Input
                                    id="expirationDate"
                                    type="date"
                                    name="expirydate"
                                    value={data.expiry}
                                    onChange={(e) =>
                                        setData("expiry", e.target.value)
                                    }
                                    // className="focus-visible:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

<div className="space-y-2">
    <Label htmlFor="quantity">Quantity</Label>
    <Input
        id="quantity"
        type="number"
        min="1"
        max={data.type === "Outgoing" ? item?.stock[0]?.stocks : undefined}
        name="quantity"
        value={data.quantity}
        onChange={handleChange}
        required
    />
    {data.type === "Outgoing" && (
        <p className="text-sm text-muted-foreground">
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

                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            Reason {data.type === "Outgoing" && "(Required)"}
                        </Label>
                        <Textarea
                            id="reason"
                            name="reason"
                            value={data.reason}
                            onChange={handleChange}
                            placeholder={
                                data.type === "Incoming"
                                    ? "Optional"
                                    : "Why is this item being removed from inventory?"
                            }
                            required={data.type === "Outgoing"}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="performedBy">Performed By</Label>
                        <Input
                            id="performedBy"
                            value={`${user?.firstname} ${user?.lastname}`}
                            //onChange={(e) => setPerformedBy(e.target.value)}
                            placeholder="Name of staff member"
                            required
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                            disabled={processing}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default StockMovementForm;
