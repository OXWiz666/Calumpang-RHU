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
import { motion } from "framer-motion";
import { Package, Plus, Calendar, Hash, Tag } from "lucide-react";

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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Plus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Add New Item</DialogTitle>
                            <p className="text-sm mt-1 text-gray-600">Add a new item to your inventory</p>
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
                    <div className="space-y-3">
                        <Label htmlFor="itemname" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                            <Package className="h-4 w-4 text-gray-500" />
                            Item Name
                        </Label>
                        <Input
                            id="itemname"
                            name="itemname"
                            value={data.itemname}
                            onChange={handleChange}
                            placeholder="Enter item name"
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="categoryid" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                            <Tag className="h-4 w-4 text-gray-500" />
                            Category
                        </Label>
                        <select
                            id="categoryid"
                            name="categoryid"
                            value={data.categoryid}
                            onChange={handleChange}
                            className="w-full h-11 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
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

                    <div className="space-y-3">
                        <Label htmlFor="unit_type" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                            <Package className="h-4 w-4 text-gray-500" />
                            Unit Type
                        </Label>
                        <select
                            id="unit_type"
                            name="unit_type"
                            value={data.unit_type}
                            onChange={handleChange}
                            className="w-full h-11 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            required
                        >
                            <option value="">Select Unit Type</option>
                            <option value="Pieces">Pieces</option>
                            <option value="Tablets">Tablets</option>
                            <option value="Capsules">Capsules</option>
                            <option value="Bottles">Bottles</option>
                            <option value="Vials">Vials</option>
                            <option value="Boxes">Boxes</option>
                            <option value="Packs">Packs</option>
                            <option value="Sachets">Sachets</option>
                            <option value="ml">ml</option>
                            <option value="mg">mg</option>
                            <option value="g">g</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label htmlFor="quantity" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                                <Hash className="h-4 w-4 text-gray-500" />
                                Initial Quantity
                            </Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                value={data.quantity}
                                onChange={handleChange}
                                placeholder="0"
                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="batchNumber" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                                <Hash className="h-4 w-4 text-gray-500" />
                                Batch Number
                            </Label>
                            <Input
                                id="batchNumber"
                                name="batchNumber"
                                value={data.batchNumber}
                                onChange={handleChange}
                                placeholder="Enter batch number"
                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="expirydate" className="text-sm font-medium flex items-center gap-2 text-gray-700">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            Expiry Date
                        </Label>
                        <Input
                            id="expirydate"
                            name="expirydate"
                            type="date"
                            value={data.expirydate}
                            onChange={handleChange}
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        <p className="text-xs p-2 rounded-md text-gray-500 bg-blue-50">
                            Enter a unique batch number for tracking this medicine batch
                        </p>
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
                                {processing ? "Adding..." : "Add Item"}
                            </Button>
                        </div>
                    </DialogFooter>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
};

export default AddItemForm;