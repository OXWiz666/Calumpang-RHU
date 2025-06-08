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
import { Textarea } from "@/components/tempo/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import { Switch } from "@/components/tempo/components/ui/switch";
import { router, useForm } from "@inertiajs/react";
import PrintErrors from "@/components/PrintErrors";

const AddItemForm = ({ open, onClose, onSave, categories_ }) => {
    // const [name, setName] = useState("");
    // const [category, setCategory] = useState("1");
    // const [quantity, setQuantity] = useState("0");
    // const [unit, setUnit] = useState("unit");
    // const [reorderThreshold, setReorderThreshold] = useState("5");

    const [isVaccine, setIsVaccine] = useState(false);
    const [batchNumber, setBatchNumber] = useState("");
    const [lotNumber, setLotNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");

    // const resetForm = () => {
    //     setName("");
    //     setCategory("1");
    //     setQuantity("0");
    //     setUnit("unit");
    //     setReorderThreshold("5");
    //     setIsVaccine(false);
    //     setBatchNumber("");
    //     setLotNumber("");
    //     setExpirationDate("");
    //     setLocation("");
    //     setNotes("");
    // };

    const { data, setData, post, recentlySuccessful, processing, errors } =
        useForm({
            itemname: "",
            categoryid: "",
            unit_type: "",
            quantity: 0,
            expirydate: new Date(),
        });

    const textChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.inventory.item.add"), {
            onSuccess: () => {
                onClose();
            },
            onFinish: () => {},
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Add New Inventory Item
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <PrintErrors errors={errors} />
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium">
                            Item Name *
                        </Label>
                        <Input
                            name="itemname"
                            value={data.itemname}
                            onChange={textChange}
                            placeholder="Enter item name"
                            className="focus-visible:ring-primary"
                            // required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="font-medium">Category *</Label>
                            <Select
                                value={String(data.categoryid)} // Ensure string type
                                onValueChange={(value) =>
                                    setData("categoryid", value)
                                }
                            >
                                <SelectTrigger className="focus-visible:ring-primary">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories_.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)} // Convert to string
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit" className="font-medium">
                                Unit Type *
                            </Label>
                            <Input
                                name="unit_type"
                                value={data.unit_type}
                                onChange={textChange}
                                placeholder="e.g., box, vial, piece"
                                className="focus-visible:ring-primary"
                                // required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity" className="font-medium">
                                Initial Quantity *
                            </Label>
                            <Input
                                name="quantity"
                                type="number"
                                min="0"
                                value={data.quantity}
                                onChange={textChange}
                                className="focus-visible:ring-primary"
                                // required
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label className="font-medium">
                                Reorder Threshold *
                            </Label>
                            <Input
                                id="reorderThreshold"
                                type="number"
                                min="0"
                                disabled
                                // value={reorderThreshold}
                                // onChange={(e) =>
                                //     setReorderThreshold(e.target.value)
                                // }
                                className="focus-visible:ring-primary"
                                required
                            />
                        </div> */}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expirationDate" className="font-medium">
                            Expiration Date
                        </Label>
                        <Input
                            id="expirationDate"
                            type="date"
                            name="expirydate"
                            value={data.expirydate}
                            onChange={textChange}
                            className="focus-visible:ring-primary"
                        />
                    </div>
                    {/* <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isVaccine"
              checked={isVaccine}
              onCheckedChange={setIsVaccine}
            />
            <Label htmlFor="isVaccine" className="font-medium cursor-pointer">
              This is a vaccine or requires lot tracking
            </Label>
          </div>

          {isVaccine && (
            <div className="space-y-4 pt-2 border-t border-gray-200 mt-4">
              <div className="pt-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Vaccine/Lot Tracking Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchNumber" className="font-medium">
                    Batch Number
                  </Label>
                  <Input
                    id="batchNumber"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="focus-visible:ring-primary"
                    required={isVaccine}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lotNumber" className="font-medium">
                    Lot Number
                  </Label>
                  <Input
                    id="lotNumber"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="focus-visible:ring-primary"
                    required={isVaccine}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="font-medium">
                  Storage Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Refrigerator 2, Shelf B"
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>
          )} */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="notes" className="font-medium">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional information about this item"
                            className="focus-visible:ring-primary"
                        />
                    </div> */}
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
