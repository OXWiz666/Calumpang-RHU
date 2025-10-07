import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/tempo/components/ui/alert-dialog";
import { 
  Trash2,
  Archive,
  ArchiveRestore,
  UserMinus,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle2
} from "lucide-react";

// Confirmation dialog variants
const confirmationVariants = {
  delete: {
    icon: Trash2,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
    actionColor: "bg-red-600 hover:bg-red-700",
    actionText: "Delete"
  },
  archive: {
    icon: Archive,
    iconColor: "text-orange-600", 
    iconBg: "bg-orange-100",
    actionColor: "bg-orange-600 hover:bg-orange-700",
    actionText: "Archive"
  },
  unarchive: {
    icon: ArchiveRestore,
    iconColor: "text-green-600",
    iconBg: "bg-green-100", 
    actionColor: "bg-green-600 hover:bg-green-700",
    actionText: "Unarchive"
  },
  remove: {
    icon: UserMinus,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
    actionColor: "bg-red-600 hover:bg-red-700", 
    actionText: "Remove"
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-100",
    actionColor: "bg-yellow-600 hover:bg-yellow-700",
    actionText: "Continue"
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    actionColor: "bg-blue-600 hover:bg-blue-700",
    actionText: "Confirm"
  }
};

/**
 * Unified confirmation dialog hook
 * @returns {object} - Confirmation dialog state and methods
 */
export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    variant: 'info',
    onConfirm: null,
    onCancel: null,
    confirmText: null,
    cancelText: 'Cancel'
  });

  const showConfirmation = (confirmationConfig) => {
    setConfig({
      ...config,
      ...confirmationConfig
    });
    setIsOpen(true);
  };

  const hideConfirmation = () => {
    setIsOpen(false);
    if (config.onCancel) {
      config.onCancel();
    }
  };

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    setIsOpen(false);
  };

  const ConfirmationDialog = () => {
    const variant = confirmationVariants[config.variant] || confirmationVariants.info;
    const IconComponent = variant.icon;

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-[450px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${variant.iconBg}`}>
                <IconComponent className={`h-5 w-5 ${variant.iconColor}`} />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">
                {config.title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-600 mt-2">
              {config.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={hideConfirmation}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {config.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={`${variant.actionColor} text-white`}
            >
              {config.confirmText || variant.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationDialog
  };
};

// Convenience methods for common confirmation types
export const useDeleteConfirmation = () => {
  const { showConfirmation, hideConfirmation, ConfirmationDialog } = useConfirmation();

  const confirmDelete = (itemName, onConfirm, onCancel = null) => {
    showConfirmation({
      title: 'Delete Item',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      variant: 'delete',
      onConfirm,
      onCancel,
      confirmText: 'Delete'
    });
  };

  return { confirmDelete, hideConfirmation, ConfirmationDialog };
};

export const useArchiveConfirmation = () => {
  const { showConfirmation, hideConfirmation, ConfirmationDialog } = useConfirmation();

  const confirmArchive = (itemName, onConfirm, onCancel = null) => {
    showConfirmation({
      title: 'Archive Item',
      message: `Are you sure you want to archive "${itemName}"? This will remove it from the active list.`,
      variant: 'archive',
      onConfirm,
      onCancel,
      confirmText: 'Archive'
    });
  };

  const confirmUnarchive = (itemName, onConfirm, onCancel = null) => {
    showConfirmation({
      title: 'Unarchive Item',
      message: `Are you sure you want to unarchive "${itemName}"? This will restore it to the active list.`,
      variant: 'unarchive',
      onConfirm,
      onCancel,
      confirmText: 'Unarchive'
    });
  };

  return { confirmArchive, confirmUnarchive, hideConfirmation, ConfirmationDialog };
};

export const useRemoveConfirmation = () => {
  const { showConfirmation, hideConfirmation, ConfirmationDialog } = useConfirmation();

  const confirmRemove = (itemName, onConfirm, onCancel = null) => {
    showConfirmation({
      title: 'Remove Item',
      message: `Are you sure you want to remove "${itemName}"? This action cannot be undone.`,
      variant: 'remove',
      onConfirm,
      onCancel,
      confirmText: 'Remove'
    });
  };

  return { confirmRemove, hideConfirmation, ConfirmationDialog };
};
