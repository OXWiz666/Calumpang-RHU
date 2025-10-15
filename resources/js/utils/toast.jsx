import { toast } from "@/components/tempo/components/ui/use-toast";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info,
  Trash2,
  Archive,
  ArchiveRestore,
  UserPlus,
  UserMinus,
  Download,
  Upload,
  Edit,
  Save,
  RefreshCw
} from "lucide-react";

// Toast variants with consistent styling
const toastVariants = {
  success: {
    className: "bg-green-50 border-green-200 text-green-800",
    icon: CheckCircle2,
    iconColor: "text-green-600"
  },
  error: {
    className: "bg-red-50 border-red-200 text-red-800", 
    icon: XCircle,
    iconColor: "text-red-600"
  },
  warning: {
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: AlertTriangle,
    iconColor: "text-yellow-600"
  },
  info: {
    className: "bg-blue-50 border-blue-200 text-blue-800",
    icon: Info,
    iconColor: "text-blue-600"
  }
};

// Action-specific icons
const actionIcons = {
  archive: Archive,
  unarchive: ArchiveRestore,
  delete: Trash2,
  create: UserPlus,
  remove: UserMinus,
  export: Download,
  import: Upload,
  edit: Edit,
  save: Save,
  update: RefreshCw
};

/**
 * Unified toast notification system
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {string} action - Optional action type for specific icons
 * @param {object} options - Additional toast options
 */
export const showToast = (title, message, type = 'info', action = null, options = {}) => {
  const variant = toastVariants[type] || toastVariants.info;
  const IconComponent = action ? actionIcons[action] : variant.icon;
  
  const defaultOptions = {
    duration: type === 'error' ? 6000 : 4000,
    ...options
  };

  toast({
    title: (
      <div className="flex items-center gap-2">
        <IconComponent className={`h-4 w-4 ${variant.iconColor}`} />
        <span className="font-semibold">{title}</span>
      </div>
    ),
    description: message,
    className: variant.className,
    ...defaultOptions
  });
};

// Convenience methods for common toast types
export const toastSuccess = (title, message, action = null) => 
  showToast(title, message, 'success', action);

export const toastError = (title, message, action = null) => 
  showToast(title, message, 'error', action);

export const toastWarning = (title, message, action = null) => 
  showToast(title, message, 'warning', action);

export const toastInfo = (title, message, action = null) => 
  showToast(title, message, 'info', action);

// Action-specific convenience methods
export const toastArchive = (title, message, isSuccess = true) => 
  showToast(title, message, isSuccess ? 'success' : 'error', 'archive');

export const toastUnarchive = (title, message, isSuccess = true) => 
  showToast(title, message, isSuccess ? 'success' : 'error', 'unarchive');

export const toastDelete = (title, message, isSuccess = true) => 
  showToast(title, message, isSuccess ? 'success' : 'error', 'delete');

export const toastCreate = (title, message, isSuccess = true) => 
  showToast(title, message, isSuccess ? 'success' : 'error', 'create');

export const toastExport = (title, message, isSuccess = true) => 
  showToast(title, message, isSuccess ? 'success' : 'error', 'export');

export const toastUpdate = (title, message, isSuccess = true) => 
  showToast(title, message, isSuccess ? 'success' : 'error', 'update');

// Legacy compatibility - will be removed after migration
export const alert_toast = (title, message, type) => {
  const typeMap = {
    'success': 'success',
    'error': 'error', 
    'warning': 'warning',
    'info': 'info'
  };
  showToast(title, message, typeMap[type] || 'info');
};

export const enhanced_toast = (title, message, type) => {
  alert_toast(title, message, type);
};
