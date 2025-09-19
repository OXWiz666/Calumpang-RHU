import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/tempo/admin/include/Sidebar";
import {
    Search,
    Filter,
    PlusCircle,
    ChevronDown,
    ChevronUp,
    Download,
    AlertTriangle,
    RefreshCw,
    Package,
    TrendingUp,
    TrendingDown,
    Clock,
} from "lucide-react";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import ReorderModal from "@/components/Modal2";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/tempo/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

import AdminLayout from "@/Layouts/AdminLayout";
// Mock data for inventory items
const mockInventoryItems = [
    {
        id: "MED001",
        name: "Paracetamol 500mg",
        category: "Medication",
        quantity: 250,
        unit: "Tablets",
        expiryDate: "2024-12-31",
        status: "In Stock",
        supplier: "PharmaCare Inc.",
        reorderLevel: 50,
        avatar: "paracetamol",
    },
    {
        id: "MED002",
        name: "Amoxicillin 250mg",
        category: "Medication",
        quantity: 120,
        unit: "Capsules",
        expiryDate: "2024-10-15",
        status: "In Stock",
        supplier: "MediPharm Ltd.",
        reorderLevel: 30,
        avatar: "amoxicillin",
    },
    {
        id: "MED003",
        name: "Metformin 500mg",
        category: "Medication",
        quantity: 15,
        unit: "Tablets",
        expiryDate: "2024-08-20",
        status: "Low Stock",
        supplier: "PharmaCare Inc.",
        reorderLevel: 20,
        avatar: "metformin",
    },
    {
        id: "SUP001",
        name: "Disposable Syringes 5ml",
        category: "Supplies",
        quantity: 500,
        unit: "Pieces",
        expiryDate: "2025-06-30",
        status: "In Stock",
        supplier: "MedSupplies Co.",
        reorderLevel: 100,
        avatar: "syringe",
    },
    {
        id: "SUP002",
        name: "Surgical Masks",
        category: "Supplies",
        quantity: 5,
        unit: "Boxes",
        expiryDate: "2025-12-31",
        status: "Low Stock",
        supplier: "MedSupplies Co.",
        reorderLevel: 10,
        avatar: "mask",
    },
];

const Inventory = () => {
    const [inventoryItems, setInventoryItems] = useState(mockInventoryItems);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "ascending",
    });
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Filter inventory items based on search term, status, and category
    const filteredItems = inventoryItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || item.status === statusFilter;

        const matchesCategory =
            categoryFilter === "all" || item.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort inventory items
    const sortedItems = [...filteredItems].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    // Request sort
    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case "In Stock":
                return <Badge className="bg-green-500">In Stock</Badge>;
            case "Low Stock":
                return <Badge className=" bg-amber-500">Low Stock</Badge>;
            case "Out of Stock":
                return <Badge className="bg-red-500">Out of Stock</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    // Check if expiry date is approaching (within 3 months)
    const isExpiryApproaching = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(today.getMonth() + 3);

        return expiry <= threeMonthsFromNow && expiry >= today;
    };

    // Get unique suppliers for the dropdown
    const uniqueSuppliers = [
        ...new Set(inventoryItems.map((item) => item.supplier)),
    ];

    // Handle reorder button click
    const handleReorderClick = (item) => {
        setSelectedItem(item);
        setIsReorderModalOpen(true);
    };

    // Handle reorder submission
    const handleReorder = (itemId, quantity, supplier) => {
        // Update the inventory item with the new quantity
        const updatedItems = inventoryItems.map((item) => {
            if (item.id === itemId) {
                return {
                    ...item,
                    quantity: item.quantity + quantity,
                    status:
                        item.quantity + quantity <= item.reorderLevel
                            ? "Low Stock"
                            : "In Stock",
                    supplier: supplier,
                };
            }
            return item;
        });

        setInventoryItems(updatedItems);
        // In a real application, you would also make an API call to update the backend
    };

    // Calculate statistics
    const totalItems = inventoryItems.length;
    const inStockItems = inventoryItems.filter(item => item.status === "In Stock").length;
    const lowStockItems = inventoryItems.filter(item => item.status === "Low Stock").length;
    const expiringSoonItems = inventoryItems.filter(item => isExpiryApproaching(item.expiryDate)).length;

    return (
        <AdminLayout header="Inventory">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Items</p>
                                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Stock</p>
                                <p className="text-2xl font-bold text-green-600">{inStockItems}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                <p className="text-2xl font-bold text-amber-600">{lowStockItems}</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <TrendingDown className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                                <p className="text-2xl font-bold text-red-600">{expiringSoonItems}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <Clock className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
                                <p className="text-gray-600 mt-1">Manage your medical supplies and medications</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button 
                                    className="text-white"
                                    style={{ backgroundColor: '#2C3E50' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Item
                                </Button>
                                <Button variant="outline" className="border-gray-300">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search items, ID, or supplier..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Filter className="h-4 w-4" />
                                    <span className="font-medium">Filters:</span>
                                </div>

                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[160px] h-11 border-gray-300">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="In Stock">In Stock</SelectItem>
                                        <SelectItem value="Low Stock">Low Stock</SelectItem>
                                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={categoryFilter}
                                    onValueChange={setCategoryFilter}
                                >
                                    <SelectTrigger className="w-[160px] h-11 border-gray-300">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="Medication">Medication</SelectItem>
                                        <SelectItem value="Supplies">Supplies</SelectItem>
                                        <SelectItem value="Equipment">Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead
                                        className="cursor-pointer font-semibold text-gray-900 py-4"
                                        onClick={() => requestSort("name")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-gray-500" />
                                            Item
                                            {sortConfig.key === "name" && (
                                                <span className="ml-1">
                                                    {sortConfig.direction ===
                                                    "ascending" ? (
                                                        <ChevronUp className="h-4 w-4 text-blue-600" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-blue-600" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-900">Category</TableHead>
                                    <TableHead
                                        className="cursor-pointer font-semibold text-gray-900"
                                        onClick={() => requestSort("quantity")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-gray-500" />
                                            Quantity
                                            {sortConfig.key === "quantity" && (
                                                <span className="ml-1">
                                                    {sortConfig.direction ===
                                                    "ascending" ? (
                                                        <ChevronUp className="h-4 w-4 text-blue-600" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-blue-600" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer font-semibold text-gray-900"
                                        onClick={() =>
                                            requestSort("expiryDate")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            Expiry Date
                                            {sortConfig.key ===
                                                "expiryDate" && (
                                                <span className="ml-1">
                                                    {sortConfig.direction ===
                                                    "ascending" ? (
                                                        <ChevronUp className="h-4 w-4 text-blue-600" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-blue-600" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-900">Supplier</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedItems.length > 0 ? (
                                    sortedItems.map((item, index) => (
                                        <TableRow 
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
                                        >
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <Avatar className="h-12 w-12 border-2 border-gray-100">
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatar}`}
                                                                alt={item.name}
                                                            />
                                                            <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold">
                                                                {item.name
                                                                    .split(" ")
                                                                    .map(
                                                                        (n) => n[0]
                                                                    )
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {item.quantity <= item.reorderLevel && (
                                                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full flex items-center justify-center">
                                                                <AlertTriangle className="h-2.5 w-2.5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-base">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-mono">
                                                            ID: {item.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className="border-gray-300 text-gray-700">
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900">
                                                        {item.quantity} {item.unit}
                                                    </div>
                                                    {item.quantity <= item.reorderLevel && (
                                                        <div className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full w-fit">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            <span className="font-medium">Reorder needed</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <div className={`font-medium ${
                                                        isExpiryApproaching(item.expiryDate)
                                                            ? "text-amber-600"
                                                            : "text-gray-900"
                                                    }`}>
                                                        {new Date(item.expiryDate).toLocaleDateString()}
                                                    </div>
                                                    {isExpiryApproaching(item.expiryDate) && (
                                                        <div className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full w-fit">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="font-medium">Expiring soon</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="text-gray-700 font-medium">
                                                    {item.supplier}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {getStatusBadge(item.status)}
                                            </TableCell>
                                            <TableCell className="text-right py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                                                        onClick={() =>
                                                            handleReorderClick(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <RefreshCw className="h-3 w-3" />
                                                        Reorder
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-12"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <Package className="h-12 w-12 text-gray-300" />
                                                <div className="text-gray-500 font-medium">No inventory items found</div>
                                                <div className="text-sm text-gray-400">Try adjusting your search or filter criteria</div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </motion.div>

            {/* Reorder Modal */}
            <ReorderModal
                isOpen={isReorderModalOpen}
                onClose={() => setIsReorderModalOpen(false)}
                item={selectedItem}
                suppliers={uniqueSuppliers}
                onReorder={handleReorder}
            />
        </AdminLayout>
    );
};

export default Inventory;
