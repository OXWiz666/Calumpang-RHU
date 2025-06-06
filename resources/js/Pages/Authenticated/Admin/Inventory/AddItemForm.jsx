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

const AddItemForm = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Supply");
  const [quantity, setQuantity] = useState("0");
  const [unit, setUnit] = useState("unit");
  const [reorderThreshold, setReorderThreshold] = useState("5");
  const [isVaccine, setIsVaccine] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: `item-${Date.now()}`,
      name,
      category,
      quantity: parseInt(quantity),
      unit,
      reorderThreshold: parseInt(reorderThreshold),
      isVaccine,
      lastUpdated: new Date(),
    };

    if (isVaccine) {
      newItem.batchNumber = batchNumber;
      newItem.lotNumber = lotNumber;
      newItem.location = location;
    }

    if (expirationDate) {
      newItem.expirationDate = new Date(expirationDate);
    }

    if (notes) {
      newItem.notes = notes;
    }

    onSave(newItem);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setCategory("Supply");
    setQuantity("0");
    setUnit("unit");
    setReorderThreshold("5");
    setIsVaccine(false);
    setBatchNumber("");
    setLotNumber("");
    setExpirationDate("");
    setLocation("");
    setNotes("");
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
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">
              Item Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              className="focus-visible:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="font-medium">
                Category *
              </Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger className="focus-visible:ring-primary">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medicine">Medicine</SelectItem>
                  <SelectItem value="Vaccine">Vaccine</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Supply">Supply</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="font-medium">
                Unit Type *
              </Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., box, vial, piece"
                className="focus-visible:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="font-medium">
                Initial Quantity *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorderThreshold" className="font-medium">
                Reorder Threshold *
              </Label>
              <Input
                id="reorderThreshold"
                type="number"
                min="0"
                value={reorderThreshold}
                onChange={(e) => setReorderThreshold(e.target.value)}
                className="focus-visible:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationDate" className="font-medium">
              Expiration Date
            </Label>
            <Input
              id="expirationDate"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
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
          )}

          <div className="space-y-2">
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
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemForm;
