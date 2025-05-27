import React, { useState } from "react";
import { Button } from "@/components/tempo/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/tempo/components/ui/dialog";
import { Input } from "@/components/tempo/components/ui/input";
import { Label } from "@/components/tempo/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

const ReorderModal = ({ isOpen, onClose, item, suppliers = [], onReorder }) => {
    const [quantity, setQuantity] = useState(0);
    const [supplier, setSupplier] = useState("");

    React.useEffect(() => {
        if (item) {
            setQuantity(item.quantity > 0 ? item.quantity : 50);
            setSupplier(item.supplier);
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item && quantity > 0) {
            onReorder(item.id, quantity, supplier);
            onClose();
        }
    };

    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reorder Inventory Item</DialogTitle>
                    <DialogDescription>
                        Specify the quantity and supplier for reordering{" "}
                        {item.name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="item-name" className="text-right">
                                Item
                            </Label>
                            <Input
                                id="item-name"
                                value={item.name}
                                className="col-span-3"
                                disabled
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                                Quantity
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                }
                                min={1}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="supplier" className="text-right">
                                Supplier
                            </Label>
                            <Select
                                value={supplier}
                                onValueChange={setSupplier}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.length > 0 ? (
                                        suppliers.map((sup) => (
                                            <SelectItem key={sup} value={sup}>
                                                {sup}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value={item.supplier}>
                                            {item.supplier}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Reorder</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReorderModal;
