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

    return (
        <AdminLayout header="Inventory">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-primary">
                            All Inventory Items
                        </h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Filter by:
                                </span>
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="In Stock">
                                        In Stock
                                    </SelectItem>
                                    <SelectItem value="Low Stock">
                                        Low Stock
                                    </SelectItem>
                                    <SelectItem value="Out of Stock">
                                        Out of Stock
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    <SelectItem value="Medication">
                                        Medication
                                    </SelectItem>
                                    <SelectItem value="Supplies">
                                        Supplies
                                    </SelectItem>
                                    <SelectItem value="Equipment">
                                        Equipment
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => requestSort("name")}
                                    >
                                        <div className="flex items-center">
                                            Item
                                            {sortConfig.key === "name" && (
                                                <span className="ml-1">
                                                    {sortConfig.direction ===
                                                    "ascending" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => requestSort("quantity")}
                                    >
                                        <div className="flex items-center">
                                            Quantity
                                            {sortConfig.key === "quantity" && (
                                                <span className="ml-1">
                                                    {sortConfig.direction ===
                                                    "ascending" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() =>
                                            requestSort("expiryDate")
                                        }
                                    >
                                        <div className="flex items-center">
                                            Expiry Date
                                            {sortConfig.key ===
                                                "expiryDate" && (
                                                <span className="ml-1">
                                                    {sortConfig.direction ===
                                                    "ascending" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedItems.length > 0 ? (
                                    sortedItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatar}`}
                                                            alt={item.name}
                                                        />
                                                        <AvatarFallback>
                                                            {item.name
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {item.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item.category}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {item.quantity} {item.unit}
                                                </div>
                                                {item.quantity <=
                                                    item.reorderLevel && (
                                                    <div className="text-sm text-amber-600 flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        <span>
                                                            Reorder needed
                                                        </span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    className={
                                                        isExpiryApproaching(
                                                            item.expiryDate
                                                        )
                                                            ? "text-amber-600"
                                                            : ""
                                                    }
                                                >
                                                    {new Date(
                                                        item.expiryDate
                                                    ).toLocaleDateString()}
                                                    {isExpiryApproaching(
                                                        item.expiryDate
                                                    ) && (
                                                        <div className="text-sm flex items-center gap-1">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            <span>
                                                                Expiring soon
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item.supplier}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(item.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1"
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
                                            className="text-center h-24 text-muted-foreground"
                                        >
                                            No inventory items found
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
