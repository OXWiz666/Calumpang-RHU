import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { AlertTriangle, CheckCircle, Archive, ArchiveRestore } from "lucide-react";

const ConfirmationModal = ({ 
    open, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    type = "warning" // warning, success, archive, unarchive
}) => {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-6 w-6 text-green-600" />;
            case "archive":
                return <Archive className="h-6 w-6 text-orange-600" />;
            case "unarchive":
                return <ArchiveRestore className="h-6 w-6 text-green-600" />;
            default:
                return <AlertTriangle className="h-6 w-6 text-orange-600" />;
        }
    };

    const getConfirmButtonStyle = () => {
        switch (type) {
            case "success":
                return "bg-green-600 hover:bg-green-700";
            case "archive":
                return "bg-orange-600 hover:bg-orange-700";
            case "unarchive":
                return "bg-green-600 hover:bg-green-700";
            default:
                return "bg-blue-600 hover:bg-blue-700";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-lg font-semibold">
                        {getIcon()}
                        {title}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    <p className="text-gray-600">{message}</p>
                </div>

                <DialogFooter className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        className={`flex-1 text-white ${getConfirmButtonStyle()}`}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;
