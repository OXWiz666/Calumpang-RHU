import React from "react";
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
import { useForm } from "@inertiajs/react";
import PrintErrors from "@/components/PrintErrors";

const AddItemForm = ({ open, onClose, categories }) => {
    const availableCategories = categories;
    const { data, setData, post, processing, errors } = useForm({
        itemname: "",
        categoryid: "",
        unit_type: "",
        quantity: 0,
        expirydate: new Date(),
        batchNumber: "", // Added batch number field
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.inventory.item.add"), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <PrintErrors errors={errors} />
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="itemname">Item Name</Label>
                        <Input
                            id="itemname"
                            name="itemname"
                            value={data.itemname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                        <div className="space-y-2">
                        <Label htmlFor="categoryid">Category</Label>
                        <select
                            id="categoryid"
                            name="categoryid"
                            value={data.categoryid}
                            onChange={handleChange}
                            className="w-full rounded-md border p-2" // Added padding
                            required
                        >
                            <option value="">Select Category</option>
                            {availableCategories && availableCategories.length > 0 ? (
                                availableCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No categories available</option>
                            )}
                        </select>
                        </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit_type">Unit Type</Label>
                        <Input
                            id="unit_type"
                            name="unit_type"
                            value={data.unit_type}
                            onChange={handleChange}
                            placeholder="e.g., Pieces, Tablets, Bottles"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Initial Quantity</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            value={data.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="batchNumber">Batch Number</Label>
                        <Input
                            id="batchNumber"
                            name="batchNumber"
                            value={data.batchNumber}
                            onChange={handleChange}
                            placeholder="Enter batch number"
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            Enter a unique batch number for tracking this medicine batch
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expirydate">Expiry Date</Label>
                        <Input
                            id="expirydate"
                            name="expirydate"
                            type="date"
                            value={data.expirydate}
                            onChange={handleChange}
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
                            Add Item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddItemForm;