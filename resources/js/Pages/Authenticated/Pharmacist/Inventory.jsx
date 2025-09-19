import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import AddItemForm from "./AddItemForm";
import AddCategoryForm from "./AddCategoryForm";
import CategoryManagement from "./CategoryManagement";
import ViewItemModal from "./ViewItemModal";
import EditItemModal from "./EditItemModal";
import SuccessModal from "./SuccessModal";
import DispenseStockModal from "./DispenseStockModal";
import BatchDisposalModal from "./BatchDisposalModal";
import {
    Package,
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    AlertTriangle,
    Clock,
    TrendingUp,
    TrendingDown,
    Eye,
    Edit,
    Archive,
    ArchiveRestore,
    MoreVertical,
    Grid3X3,
    List,
    Pill,
    Syringe,
    FlaskConical,
    Stethoscope,
    Heart,
    Shield,
    Zap,
    Activity,
    Users,
    ShoppingCart,
    Trash2,
    Home,
    Star,
    SortAsc,
    SortDesc,
    Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/tempo/components/ui/dropdown-menu";

export default function PharmacistInventory({ categories = [], allCategories = [], inventoryItems = [] }) {
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [showCategoryManagement, setShowCategoryManagement] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showDispenseModal, setShowDispenseModal] = useState(false);
    const [showDisposalModal, setShowDisposalModal] = useState(false);

    // Helper function to determine item status
    const getItemStatus = (item) => {
        const quantity = item.stock?.stocks || 0;
        const minStock = item.minimum_stock || 10;
        
        if (quantity === 0) return 'out_of_stock';
        if (quantity <= minStock) return 'low_stock';
        return 'in_stock';
    };

    // Helper function to check if item is expired
    const isExpired = (expiryDate) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        return expiry < today;
    };

    // Helper function to check if item is expiring soon (within 30 days)
    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    // Helper function to get category icon from database or fallback
    const getCategoryIcon = (category) => {
        const iconName = category?.icon || 'Package';
        const iconColor = getIconColor(iconName);
        
        switch (iconName) {
            case 'Pill':
                return <Pill className={`h-5 w-5 ${iconColor}`} />;
            case 'Syringe':
                return <Syringe className={`h-5 w-5 ${iconColor}`} />;
            case 'Stethoscope':
                return <Stethoscope className={`h-5 w-5 ${iconColor}`} />;
            case 'FlaskConical':
                return <FlaskConical className={`h-5 w-5 ${iconColor}`} />;
            case 'Heart':
                return <Heart className={`h-5 w-5 ${iconColor}`} />;
            case 'Shield':
                return <Shield className={`h-5 w-5 ${iconColor}`} />;
            case 'Zap':
                return <Zap className={`h-5 w-5 ${iconColor}`} />;
            case 'Activity':
                return <Activity className={`h-5 w-5 ${iconColor}`} />;
            case 'Users':
                return <Users className={`h-5 w-5 ${iconColor}`} />;
            case 'Home':
                return <Home className={`h-5 w-5 ${iconColor}`} />;
            case 'Star':
                return <Star className={`h-5 w-5 ${iconColor}`} />;
            default:
                return <Package className={`h-5 w-5 ${iconColor}`} />;
        }
    };

    // Helper function to get icon color
    const getIconColor = (iconName) => {
        switch (iconName) {
            case 'Pill':
                return 'text-blue-600';
            case 'Syringe':
                return 'text-green-600';
            case 'Stethoscope':
                return 'text-purple-600';
            case 'FlaskConical':
                return 'text-orange-600';
            case 'Heart':
                return 'text-red-600';
            case 'Shield':
                return 'text-indigo-600';
            case 'Zap':
                return 'text-yellow-600';
            case 'Activity':
                return 'text-cyan-600';
            case 'Users':
                return 'text-pink-600';
            case 'Home':
                return 'text-emerald-600';
            case 'Star':
                return 'text-amber-600';
            default:
                return 'text-gray-600';
        }
    };

    // Handler functions for item actions
    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setShowEditModal(true);
    };

    const handleArchiveItem = (item) => {
        const successMessage = "Item archived successfully!";
        const errorMessage = "Failed to archive item!";

        router.put(route('pharmacist.inventory.item.archive', item.id), {}, {
            onSuccess: () => {
                setSuccessMessage(successMessage);
                setShowSuccessModal(true);
                // Refresh the page to update the data
                window.location.reload();
            },
            onError: () => {
                setSuccessMessage(errorMessage);
                setShowSuccessModal(true);
            }
        });
    };

    const handleUnarchiveItem = (item) => {
        const successMessage = "Item unarchived successfully!";
        const errorMessage = "Failed to unarchive item!";

        router.put(route('pharmacist.inventory.item.unarchive', item.id), {}, {
            onSuccess: () => {
                setSuccessMessage(successMessage);
                setShowSuccessModal(true);
                // Refresh the page to update the data
                window.location.reload();
            },
            onError: () => {
                setSuccessMessage(errorMessage);
                setShowSuccessModal(true);
            }
        });
    };

    const handleDispenseItem = (item) => {
        setSelectedItem(item);
        setShowDispenseModal(true);
    };

    const handleDisposeItem = (item) => {
        setSelectedItem(item);
        setShowDisposalModal(true);
    };


    // Use real inventory data from props, fallback to mock data if not available
    const inventoryData = inventoryItems && inventoryItems.length > 0 ? inventoryItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category?.name || 'Uncategorized',
        categoryIcon: getCategoryIcon(item.category),
        categoryId: item.category_id,
        batchNumber: item.batch_number || 'N/A',
        quantity: item.stock?.stocks || 0,
        unit: item.unit_type || 'pieces',
        expiryDate: item.expiry_date || 'N/A',
        manufacturer: item.manufacturer || 'N/A',
        description: item.description || '',
        minimumStock: item.minimum_stock || 10,
        maximumStock: item.maximum_stock || 100,
        storageLocation: item.storage_location || '',
        status: getItemStatus(item),
        isArchived: item.status === 0, // Check if item is archived
        lastUpdated: item.updated_at || 'N/A',
        supplier: item.manufacturer || 'N/A',
    })) : [
        {
            id: 1,
            name: "Paracetamol 500mg",
            category: "Pain Relief",
            categoryIcon: getCategoryIcon({ icon: "Pill" }),
            categoryId: 1,
            batchNumber: "PAR-2024-001",
            quantity: 150,
            unit: "tablets",
            expiryDate: "2025-06-15",
            manufacturer: "MedPharm Corp",
            description: "Pain relief medication",
            minimumStock: 10,
            maximumStock: 200,
            storageLocation: "A-1-01",
            status: "in_stock",
            lastUpdated: "2024-01-15",
            supplier: "MedPharm Corp",
        },
        {
            id: 2,
            name: "Amoxicillin 250mg",
            category: "Antibiotics",
            categoryIcon: getCategoryIcon({ icon: "Syringe" }),
            categoryId: 2,
            batchNumber: "AMX-2024-002",
            quantity: 5,
            unit: "capsules",
            expiryDate: "2024-12-20",
            manufacturer: "Antibio Ltd",
            description: "Antibiotic medication",
            minimumStock: 5,
            maximumStock: 100,
            storageLocation: "B-2-03",
            status: "low_stock",
            lastUpdated: "2024-01-14",
            supplier: "Antibio Ltd",
        },
        {
            id: 3,
            name: "Ibuprofen 400mg",
            category: "Pain Relief",
            categoryIcon: getCategoryIcon({ icon: "Pill" }),
            categoryId: 1,
            batchNumber: "IBU-2024-003",
            quantity: 0,
            unit: "tablets",
            expiryDate: "2025-03-10",
            manufacturer: "PainFree Inc",
            description: "Anti-inflammatory medication",
            minimumStock: 10,
            maximumStock: 150,
            storageLocation: "A-1-02",
            status: "out_of_stock",
            lastUpdated: "2024-01-13",
            supplier: "PainFree Inc",
        },
        {
            id: 4,
            name: "Vitamin C 1000mg",
            category: "Vitamins",
            categoryIcon: getCategoryIcon({ icon: "Heart" }),
            categoryId: 3,
            batchNumber: "VIT-2024-004",
            quantity: 200,
            unit: "tablets",
            expiryDate: "2024-08-30",
            manufacturer: "VitaCorp",
            description: "Vitamin supplement",
            minimumStock: 20,
            maximumStock: 300,
            storageLocation: "C-3-01",
            status: "expiring_soon",
            lastUpdated: "2024-01-12",
            supplier: "VitaCorp",
        },
        {
            id: 5,
            name: "Metformin 500mg",
            category: "Chronic Care",
            categoryId: 4,
            batchNumber: "MET-2024-005",
            quantity: 80,
            unit: "tablets",
            expiryDate: "2025-09-15",
            manufacturer: "DiabCare",
            description: "Diabetes medication",
            minimumStock: 15,
            maximumStock: 200,
            storageLocation: "D-4-02",
            status: "in_stock",
            lastUpdated: "2024-01-11",
            supplier: "DiabCare",
        },
    ];

    const [filteredItems, setFilteredItems] = useState(inventoryData);

    // Filter and sort items
    useEffect(() => {
        let filtered = inventoryData.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.category.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
            
            // Handle status filtering including archived items
            let matchesStatus = false;
            if (statusFilter === "all") {
                matchesStatus = true;
            } else if (statusFilter === "archived") {
                matchesStatus = item.isArchived;
            } else {
                matchesStatus = item.status === statusFilter && !item.isArchived;
            }
            
            return matchesSearch && matchesCategory && matchesStatus;
        });

        // Sort items
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            // Handle different data types
            if (sortBy === "name" || sortBy === "category") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            } else if (sortBy === "quantity") {
                aValue = parseInt(aValue) || 0;
                bValue = parseInt(bValue) || 0;
            } else if (sortBy === "expiryDate") {
                aValue = new Date(aValue === 'N/A' ? '2099-12-31' : aValue);
                bValue = new Date(bValue === 'N/A' ? '2099-12-31' : bValue);
            } else if (sortBy === "isArchived") {
                aValue = aValue ? 1 : 0;
                bValue = bValue ? 1 : 0;
            }
            
            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredItems(filtered);
    }, [searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

    const getStatusColor = (status, isArchived = false) => {
        if (isArchived) {
            return "bg-gray-100 text-gray-600 border-gray-300";
        }
        
        switch (status) {
            case "in_stock":
                return "bg-green-100 text-green-800 border-green-200";
            case "low_stock":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "out_of_stock":
                return "bg-red-100 text-red-800 border-red-200";
            case "expiring_soon":
                return "bg-orange-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status, isArchived = false) => {
        if (isArchived) {
            return "Archived";
        }
        
        switch (status) {
            case "in_stock":
                return "In Stock";
            case "low_stock":
                return "Low Stock";
            case "out_of_stock":
                return "Out of Stock";
            case "expiring_soon":
                return "Expiring Soon";
            default:
                return "Unknown";
        }
    };


    const stats = {
        total: inventoryData.filter(item => !item.isArchived).length,
        inStock: inventoryData.filter(item => item.status === "in_stock" && !item.isArchived).length,
        lowStock: inventoryData.filter(item => item.status === "low_stock" && !item.isArchived).length,
        outOfStock: inventoryData.filter(item => item.status === "out_of_stock" && !item.isArchived).length,
        expiringSoon: inventoryData.filter(item => item.status === "expiring_soon" && !item.isArchived).length,
    };

    return (
        <AdminLayout header="Inventory Management">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                        <p className="text-gray-600">Manage your pharmacy inventory efficiently</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Import
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => setShowAddCategoryForm(true)}
                        >
                            <Tag className="h-4 w-4" />
                            Add Category
                        </Button>
                        <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => setShowCategoryManagement(true)}
                        >
                            <Tag className="h-4 w-4" />
                            Manage Categories
                        </Button>
                        <Button 
                            className="flex items-center gap-2" 
                            style={{ backgroundColor: '#2C3E50' }}
                            onClick={() => setShowAddItemForm(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Items</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <Package className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">In Stock</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Low Stock</p>
                                    <p className="text-2xl font-bold text-amber-600">{stats.lowStock}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-amber-600" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Out of Stock</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                                </div>
                                <TrendingDown className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Expiring Soon</p>
                                    <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
                                </div>
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search items, batch numbers, or categories..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories && categories.map((category) => (
                                            <SelectItem key={category.id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="in_stock">In Stock</SelectItem>
                                        <SelectItem value="low_stock">Low Stock</SelectItem>
                                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                        <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                                    const [field, order] = value.split('-');
                                    setSortBy(field);
                                    setSortOrder(order);
                                }}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                        <SelectItem value="category-asc">Category (A-Z)</SelectItem>
                                        <SelectItem value="category-desc">Category (Z-A)</SelectItem>
                                        <SelectItem value="quantity-asc">Quantity (Low-High)</SelectItem>
                                        <SelectItem value="quantity-desc">Quantity (High-Low)</SelectItem>
                                        <SelectItem value="expiryDate-asc">Expiry (Soon-Later)</SelectItem>
                                        <SelectItem value="expiryDate-desc">Expiry (Later-Soon)</SelectItem>
                                        <SelectItem value="isArchived-asc">Status (Active-Archived)</SelectItem>
                                        <SelectItem value="isArchived-desc">Status (Archived-Active)</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <div className="flex items-center gap-1 border rounded-lg">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Inventory Items */}
                <AnimatePresence mode="wait">
                    {viewMode === "grid" ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card className="hover:shadow-lg transition-all duration-300 group">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                                                        onClick={() => handleViewDetails(item)}
                                                        title="View Details"
                                                    >
                                                        {item.categoryIcon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {item.name}
                                                        </CardTitle>
                                                        <p className="text-sm text-gray-500">{item.category}</p>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit Item
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDispenseItem(item)}>
                                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                                            Dispense Stock
                                                        </DropdownMenuItem>
                                                        {(isExpired(item.expiryDate) || isExpiringSoon(item.expiryDate)) && (
                                                            <DropdownMenuItem onClick={() => handleDisposeItem(item)}>
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Dispose Batch
                                                            </DropdownMenuItem>
                                                        )}
                                                        {item.isArchived ? (
                                                            <DropdownMenuItem 
                                                                className="text-green-600"
                                                                onClick={() => handleUnarchiveItem(item)}
                                                            >
                                                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                                                Unarchive
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem 
                                                                className="text-orange-600"
                                                                onClick={() => handleArchiveItem(item)}
                                                            >
                                                                <Archive className="h-4 w-4 mr-2" />
                                                                Archive
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Quantity</span>
                                                <span className="font-semibold text-gray-900">
                                                    {item.quantity} {item.unit}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Batch</span>
                                                <span className="font-mono text-sm text-gray-700">
                                                    {item.batchNumber}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Expiry</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm ${
                                                        isExpired(item.expiryDate) ? 'text-red-600 font-semibold' :
                                                        isExpiringSoon(item.expiryDate) ? 'text-amber-600 font-semibold' :
                                                        'text-gray-700'
                                                    }`}>
                                                        {new Date(item.expiryDate).toLocaleDateString()}
                                                    </span>
                                                    {isExpired(item.expiryDate) && (
                                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                            EXPIRED
                                                        </span>
                                                    )}
                                                    {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
                                                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                                            EXPIRING SOON
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Manufacturer</span>
                                                <span className="font-semibold text-gray-900">
                                                    {item.manufacturer}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getStatusColor(item.status, item.isArchived)}>
                                                        {getStatusText(item.status, item.isArchived)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Card>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                        Item Details
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                        Category
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                        Quantity
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                        Batch Number
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                        Expiry Date
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                        Status
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredItems.map((item, index) => (
                                                    <motion.tr
                                                        key={item.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        className="border-b hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div 
                                                                    className="text-xl cursor-pointer hover:scale-110 transition-transform"
                                                                    onClick={() => handleViewDetails(item)}
                                                                    title="View Details"
                                                                >
                                                                    {item.categoryIcon}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {item.manufacturer} • {item.unit}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-gray-600">
                                                            {item.category}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="font-medium text-gray-900">
                                                                {item.quantity}
                                                            </span>
                                                            <span className="text-sm text-gray-500 ml-1">
                                                                {item.unit}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="font-mono text-sm text-gray-700">
                                                                {item.batchNumber}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-sm ${
                                                                    isExpired(item.expiryDate) ? 'text-red-600 font-semibold' :
                                                                    isExpiringSoon(item.expiryDate) ? 'text-amber-600 font-semibold' :
                                                                    'text-gray-600'
                                                                }`}>
                                                                    {new Date(item.expiryDate).toLocaleDateString()}
                                                                </span>
                                                                {isExpired(item.expiryDate) && (
                                                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                                        EXPIRED
                                                                    </span>
                                                                )}
                                                                {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
                                                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                                                        EXPIRING SOON
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={getStatusColor(item.status, item.isArchived)}>
                                                                    {getStatusText(item.status, item.isArchived)}
                                                                </Badge>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(item)}
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditItem(item)}
                                                    title="Edit Item"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDispenseItem(item)}
                                                    title="Dispense Stock"
                                                    className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                </Button>
                                                {(isExpired(item.expiryDate) || isExpiringSoon(item.expiryDate)) && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDisposeItem(item)}
                                                        title="Dispose Batch"
                                                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit Item
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDispenseItem(item)}>
                                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                                            Dispense Stock
                                                        </DropdownMenuItem>
                                                        {(isExpired(item.expiryDate) || isExpiringSoon(item.expiryDate)) && (
                                                            <DropdownMenuItem onClick={() => handleDisposeItem(item)}>
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Dispose Batch
                                                            </DropdownMenuItem>
                                                        )}
                                                        {item.isArchived ? (
                                                            <DropdownMenuItem
                                                                className="text-green-600"
                                                                onClick={() => handleUnarchiveItem(item)}
                                                            >
                                                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                                                Unarchive
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                className="text-orange-600"
                                                                onClick={() => handleArchiveItem(item)}
                                                            >
                                                                <Archive className="h-4 w-4 mr-2" />
                                                                Archive
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No items found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Try adjusting your search or filter criteria
                        </p>
                        <Button onClick={() => {
                            setSearchTerm("");
                            setCategoryFilter("all");
                            setStatusFilter("all");
                        }}>
                            Clear Filters
                        </Button>
                    </motion.div>
                )}

                {/* Add Item Form */}
                <AddItemForm
                    open={showAddItemForm}
                    onClose={() => setShowAddItemForm(false)}
                    categories={categories || []}
                />

                {/* Add Category Form */}
                <AddCategoryForm
                    open={showAddCategoryForm}
                    onClose={() => setShowAddCategoryForm(false)}
                />

                {/* Category Management */}
                <CategoryManagement
                    open={showCategoryManagement}
                    onClose={() => setShowCategoryManagement(false)}
                    categories={allCategories}
                />

                {/* View Item Modal */}
                <ViewItemModal
                    open={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    item={selectedItem}
                />

                {/* Edit Item Modal */}
                <EditItemModal
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    item={selectedItem}
                    categories={categories || []}
                />

                {/* Success Modal */}
                <SuccessModal
                    open={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    message={successMessage}
                />


                <DispenseStockModal
                    open={showDispenseModal}
                    onClose={() => setShowDispenseModal(false)}
                    item={selectedItem}
                />

                <BatchDisposalModal
                    open={showDisposalModal}
                    onClose={() => setShowDisposalModal(false)}
                    item={selectedItem}
                />
            </motion.div>
        </AdminLayout>
    );
}
