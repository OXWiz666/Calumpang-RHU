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
import { Textarea } from "@/components/tempo/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
    Tag, 
    Plus, 
    Pill,
    Syringe,
    FlaskConical,
    Stethoscope,
    Heart,
    Shield,
    Zap,
    Package,
    Activity,
    Users,
    Home,
    Star
} from "lucide-react";

const AddCategoryForm = ({ open, onClose }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        icon: "Package", // Default icon
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pharmacist.inventory.category.add"), {
            onSuccess: () => {
                onClose();
            },
        });
    };

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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <Plus className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Add New Category</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Create a new category to organize your inventory items.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Category Name *
                            </Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Antibiotics, Pain Relief, Vitamins"
                                    className="w-full pl-10"
                                    required
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                placeholder="Enter a description for this category (optional)"
                                className="w-full min-h-[80px] resize-none"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Category Icon
                            </Label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-12 h-10 rounded border border-gray-300 bg-gray-50">
                                        {(() => {
                                            const selectedIcon = predefinedIcons.find(icon => icon.name === data.icon);
                                            const IconComponent = selectedIcon?.component || Package;
                                            return <IconComponent className={`h-6 w-6 ${selectedIcon?.color || 'text-gray-600'}`} />;
                                        })()}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {data.icon}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Choose from predefined icons:</p>
                                    <div className="grid grid-cols-6 gap-2">
                                        {predefinedIcons.map((icon) => {
                                            const IconComponent = icon.component;
                                            return (
                                                <button
                                                    key={icon.name}
                                                    type="button"
                                                    onClick={() => setData('icon', icon.name)}
                                                    className={`flex items-center justify-center w-10 h-10 rounded border-2 transition-all hover:scale-105 ${
                                                        data.icon === icon.name 
                                                            ? 'border-blue-500 bg-blue-50' 
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                    title={icon.name}
                                                >
                                                    <IconComponent className={`h-5 w-5 ${icon.color}`} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            {errors.icon && (
                                <p className="text-sm text-red-600">{errors.icon}</p>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Preview</Label>
                            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-2">
                                    {(() => {
                                        const selectedIcon = predefinedIcons.find(icon => icon.name === data.icon);
                                        const IconComponent = selectedIcon?.component || Package;
                                        return <IconComponent className={`h-4 w-4 ${selectedIcon?.color || 'text-gray-600'}`} />;
                                    })()}
                                    <span className="font-medium text-gray-900">
                                        {data.name || "Category Name"}
                                    </span>
                                </div>
                                {data.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {data.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex-1"
                            style={{ backgroundColor: '#2C3E50' }}
                        >
                            {processing ? "Adding..." : "Add Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryForm;
