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

// interface ReorderModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   item: {
//     id: string;
//     name: string;
//     supplier: string;
//     quantity: number;
//     unit: string;
//   } | null;
//   suppliers: string[];
//   onReorder: (itemId: string, quantity: number, supplier: string) => void;
// }

const CustomModal = ({
    isOpen, // determine if modal is open or not
    onClose = () => {}, //close function
    title = "", // Title of card
    description = "",
    savetext = "Save",
    hasCancel = true,
    canceltext = "Cancel",
    className = "",
    children,
    maxWidth = "2xl",
    //   item,
    //   suppliers = [],
    //   onReorder,
}) => {
    //   const [quantity, setQuantity] = useState(0);
    //   const [supplier, setSupplier] = useState("");

    //   React.useEffect(() => {
    //     if (item) {
    //       setQuantity(item.quantity > 0 ? item.quantity : 50);
    //       setSupplier(item.supplier);
    //     }
    //   }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // if (item && quantity > 0) {
        //   onReorder(item.id, quantity, supplier);
        //   onClose();
        // }
    };

    //   if (!item) return null;
    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
        "3xl": "sm:max-w-3xl",
        "4xl": "sm:max-w-4xl",
        "5xl": "sm:max-w-5xl",
        "6xl": "sm:max-w-6xl",
        "7xl": "sm:max-w-7xl",
    }[maxWidth];
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* "sm:max-w-[425px]" +  */}
            <DialogContent className={className + ` ${maxWidthClass}`}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;
