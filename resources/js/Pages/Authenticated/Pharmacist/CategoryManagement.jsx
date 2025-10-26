import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/tempo/components/ui/dialog";
import { Button } from "@/components/tempo/components/ui/button";
import { Badge } from "@/components/tempo/components/ui/badge";
import { useForm, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
    Tag, 
    Archive, 
    ArchiveRestore, 
    Edit, 
    MoreVertical,
    Package,
    Pill,
    Syringe,
    Stethoscope,
    FlaskConical,
    Heart,
    Shield,
    Zap,
    Activity,
    Users,
    Home,
    Star,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/tempo/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";

const CategoryManagement = ({ open, onClose, categories = [] }) => {
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState("");
    const [editIcon, setEditIcon] = useState("Package");
    const [editDescription, setEditDescription] = useState("");

    const { put: updateCategory, processing, setData } = useForm({
        name: '',
        icon: 'Package'
    });


    // Predefined icons for selection
    const predefinedIcons = [
        { name: "Package", component: Package, color: "text-gray-600" },
        { name: "Pill", component: Pill, color: "text-blue-600" },
        { name: "Syringe", component: Syringe, color: "text-green-600" },
        { name: "Stethoscope", component: Stethoscope, color: "text-purple-600" },
        { name: "FlaskConical", component: FlaskConical, color: "text-orange-600" },
        { name: "Heart", component: Heart, color: "text-red-600" },
        { name: "Shield", component: Shield, color: "text-indigo-600" },
        { name: "Zap", component: Zap, color: "text-yellow-600" },
        { name: "Activity", component: Activity, color: "text-cyan-600" },
        { name: "Users", component: Users, color: "text-pink-600" },
        { name: "Home", component: Home, color: "text-emerald-600" },
        { name: "Star", component: Star, color: "text-amber-600" },
    ];

    const handleArchive = (categoryId) => {
        updateCategory(route('pharmacist.inventory.category.archive', categoryId), {
            onSuccess: () => {
                onClose();
                // Auto-refresh the page data - use visit to refresh the current page
                router.visit(window.location.pathname, { method: 'get' });
            }
        });
    };

    const handleUnarchive = (categoryId) => {
        updateCategory(route('pharmacist.inventory.category.unarchive', categoryId), {
            onSuccess: () => {
                onClose();
                // Auto-refresh the page data - use visit to refresh the current page
                router.visit(window.location.pathname, { method: 'get' });
            }
        });
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setEditName(category.name);
        setEditIcon(category.icon || "Package");
        setEditDescription(category.description || "");
        
        // Set form data
        setData({
            name: category.name,
            icon: category.icon || "Package"
        });
    };

    const handleUpdate = () => {
        const trimmedName = editName.trim();
        
        // Check if name is different from original
        if (trimmedName === editingCategory.name && editIcon === (editingCategory.icon || "Package")) {
            return;
        }

        // Update form data
        setData({
            name: trimmedName,
            icon: editIcon
        });

        updateCategory(route('pharmacist.inventory.category.update', editingCategory.id), {
            onSuccess: () => {
                // Reset form
                setEditingCategory(null);
                setEditName("");
                // Auto-refresh the page data - use visit to refresh the current page
                router.visit(window.location.pathname, { method: 'get' });
                setEditIcon("Package");
                setEditDescription("");
                
                // Close modal
                onClose();
            },
            onError: (errors) => {
                console.error('Update error:', errors);
            }
        });
    };

    // Helper function to get category icon
    const getCategoryIcon = (category) => {
        const iconName = category?.icon || 'Package';
        const iconData = predefinedIcons.find(icon => icon.name === iconName) || predefinedIcons[0];
        const IconComponent = iconData.component;
        return <IconComponent className={`h-4 w-4 ${iconData.color}`} />;
    };

    const activeCategories = categories.filter(cat => cat.status === 1);
    const archivedCategories = categories.filter(cat => cat.status === 0);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Tag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Category Management</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your inventory categories. Archive categories to hide them from new items, or permanently delete them.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Active Categories */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            Active Categories ({activeCategories.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeCategories.map((category) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="hover:shadow-md transition-all duration-300">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-blue-100">
                                                        {getCategoryIcon(category)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                                                        <Badge className="bg-green-100 text-green-800 text-xs">
                                                            Active
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleArchive(category.id)}
                                                            className="text-amber-600"
                                                        >
                                                            <Archive className="h-4 w-4 mr-2" />
                                                            Archive
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Archived Categories */}
                    {archivedCategories.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                Archived Categories ({archivedCategories.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {archivedCategories.map((category) => (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="hover:shadow-md transition-all duration-300 opacity-75">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-gray-100">
                                                            {getCategoryIcon(category)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-600">{category.name}</h4>
                                                            <Badge className="bg-gray-100 text-gray-600 text-xs">
                                                                Archived
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => handleUnarchive(category.id)}
                                                                className="text-green-600"
                                                            >
                                                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                                                Unarchive
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Edit Category Modal */}
                    {editingCategory && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-4 w-[400px] max-h-[80vh] overflow-y-auto">
                                <h3 className="text-lg font-semibold mb-3">Edit Category</h3>
                                
                                {/* Category Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => {
                                            setEditName(e.target.value);
                                            setData('name', e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleUpdate();
                                            }
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                        placeholder="Category name"
                                        autoFocus
                                    />
                                </div>

                                {/* Icon Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Icon
                                    </label>
                                    
                                    {/* Current Selection Preview */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 bg-gray-50">
                                            {(() => {
                                                const selectedIcon = predefinedIcons.find(icon => icon.name === editIcon);
                                                const IconComponent = selectedIcon?.component || Package;
                                                return <IconComponent className={`h-4 w-4 ${selectedIcon?.color || 'text-gray-600'}`} />;
                                            })()}
                                        </div>
                                        <span className="text-xs text-gray-600">
                                            {editIcon}
                                        </span>
                                    </div>

                                    {/* Icon Grid */}
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-600">Choose an icon:</p>
                                        <div className="grid grid-cols-6 gap-1">
                                            {predefinedIcons.map((icon) => {
                                                const IconComponent = icon.component;
                                                return (
                                                    <button
                                                        key={icon.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setEditIcon(icon.name);
                                                            setData('icon', icon.name);
                                                        }}
                                                        className={`flex items-center justify-center w-8 h-8 rounded border-2 transition-all hover:scale-105 ${
                                                            editIcon === icon.name
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                        title={icon.name}
                                                    >
                                                        <IconComponent className={`h-4 w-4 ${icon.color}`} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleUpdate}
                                        disabled={processing}
                                        className="flex-1 text-sm py-2"
                                        style={{ backgroundColor: '#2C3E50' }}
                                    >
                                        {processing ? "Updating..." : "Update Category"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setEditingCategory(null);
                                            setEditName("");
                                            setEditIcon("Package");
                                            setEditDescription("");
                                        }}
                                        disabled={processing}
                                        className="flex-1 text-sm py-2"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryManagement;
