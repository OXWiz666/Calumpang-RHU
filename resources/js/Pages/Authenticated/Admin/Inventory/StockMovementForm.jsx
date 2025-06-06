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
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/tempo/components/ui/radio-group";
import { Textarea } from "@/components/tempo/components/ui/textarea";

const StockMovementForm = ({ open, onClose, item, onSave }) => {
    const [movementType, setMovementType] = useState("incoming");
    const [quantity, setQuantity] = useState("1");
    const [batchNumber, setBatchNumber] = useState("");
    const [lotNumber, setLotNumber] = useState("");
    const [reason, setReason] = useState("");
    const [performedBy, setPerformedBy] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!item) return;

        const movement = {
            id: `mov-${Date.now()}`,
            itemId: item.id,
            type: movementType,
            quantity: parseInt(quantity),
            date: new Date(),
            performedBy,
        };

        if (item.isVaccine) {
            movement.batchNumber = batchNumber;
            movement.lotNumber = lotNumber;
        }

        if (reason) {
            movement.reason = reason;
        }

        onSave(movement);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setMovementType("incoming");
        setQuantity("1");
        setBatchNumber("");
        setLotNumber("");
        setReason("");
        setPerformedBy("");
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Record Stock Movement</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Item</Label>
                        <p className="font-medium">{item?.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Current stock: {item?.quantity} {item?.unit}s
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Movement Type</Label>
                        <RadioGroup
                            value={movementType}
                            onValueChange={(value) => setMovementType(value)}
                            className="flex space-x-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="incoming"
                                    id="incoming"
                                />
                                <Label htmlFor="incoming">Incoming</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="outgoing"
                                    id="outgoing"
                                />
                                <Label htmlFor="outgoing">Outgoing</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>

                    {item?.isVaccine && (
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
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            Reason {movementType === "outgoing" && "(Required)"}
                        </Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={
                                movementType === "incoming"
                                    ? "Optional"
                                    : "Why is this item being removed from inventory?"
                            }
                            required={movementType === "outgoing"}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="performedBy">Performed By</Label>
                        <Input
                            id="performedBy"
                            value={performedBy}
                            onChange={(e) => setPerformedBy(e.target.value)}
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
