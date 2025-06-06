import React, { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/tempo/components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Button } from "@/components/tempo/components/ui/button";
import {
    Package,
    AlertTriangle,
    Clock,
    Filter,
    Plus,
    Pill,
    Syringe,
    Stethoscope,
    Box,
} from "lucide-react";
import SearchBar from "./SearchBar";
import InventoryItemCard from "./InventoryItemCard";
import StockMovementForm from "./StockMovementForm";
import ReportsPanel from "./ReportsPanel";
import AddItemForm from "./AddItemForm";
import AdminLayout from "@/Layouts/AdminLayout";

import {
  mockInventoryItems,
  mockStockMovements,
} from "./mockitems/mockInventory";

const InventoryDashboard = () => {
    // const [items, setItems] = useState([]);
    // const [movements, setMovements] = useState([]);
    // const [filteredItems, setFilteredItems] = useState([]);

     const [items, setItems] = useState(mockInventoryItems);
  const [movements, setMovements] = useState(mockStockMovements);
  const [filteredItems, setFilteredItems] = useState(mockInventoryItems);

    const [selectedItem, setSelectedItem] = useState(null);
    const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
    const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [masterListTab, setMasterListTab] = useState("All");

    const categories = Array.from(new Set(items.map((item) => item.category)));

    const lowStockItems = items.filter(
        (item) => item.quantity <= item.reorderThreshold
    );
    const expiringItems = items.filter(
        (item) =>
            item.expirationDate &&
            new Date(item.expirationDate).getTime() - new Date().getTime() <
                30 * 24 * 60 * 60 * 1000
    );

    const handleSearch = (results) => {
        setFilteredItems(results);
        setActiveCategory(null);
        setActiveTab("all");
    };

    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
        setFilteredItems(items.filter((item) => item.category === category));
    };

    const handleTabChange = (value) => {
        setActiveTab(value);
        setActiveCategory(null);

        if (value === "all") {
            setFilteredItems(items);
        } else if (value === "low") {
            setFilteredItems(lowStockItems);
        } else if (value === "expiring") {
            setFilteredItems(expiringItems);
        } else if (value === "master") {
            setFilteredItems(items);
            setMasterListTab("All");
        }
    };

    const handleMasterListTabChange = (category) => {
        setMasterListTab(category);
        if (category === "All") {
            setFilteredItems(items);
        } else {
            setFilteredItems(
                items.filter((item) => item.category === category)
            );
        }
    };

    const handleUpdateClick = (item) => {
        setSelectedItem(item);
        setIsMovementFormOpen(true);
    };

    const handleSaveMovement = (movement) => {
        setMovements([...movements, movement]);

        const updatedItems = items.map((item) => {
            if (item.id === movement.itemId) {
                const newQuantity =
                    movement.type === "incoming"
                        ? item.quantity + movement.quantity
                        : item.quantity - movement.quantity;

                return {
                    ...item,
                    quantity: Math.max(0, newQuantity),
                    lastUpdated: new Date(),
                };
            }
            return item;
        });

        setItems(updatedItems);
        setFilteredItems((prevFiltered) => {
            if (activeTab === "all" && !activeCategory) {
                return updatedItems;
            } else if (activeTab === "low") {
                return updatedItems.filter(
                    (item) => item.quantity <= item.reorderThreshold
                );
            } else if (activeTab === "expiring") {
                return updatedItems.filter(
                    (item) =>
                        item.expirationDate &&
                        new Date(item.expirationDate).getTime() -
                            new Date().getTime() <
                            30 * 24 * 60 * 60 * 1000
                );
            } else if (activeTab === "master") {
                if (masterListTab === "All") {
                    return updatedItems;
                } else {
                    return updatedItems.filter(
                        (item) => item.category === masterListTab
                    );
                }
            } else if (activeCategory) {
                return updatedItems.filter(
                    (item) => item.category === activeCategory
                );
            }
            return prevFiltered.map((item) => {
                const updated = updatedItems.find((i) => i.id === item.id);
                return updated || item;
            });
        });
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Medicine":
                return <Pill className="h-5 w-5 text-blue-500 mr-2" />;
            case "Vaccine":
                return <Syringe className="h-5 w-5 text-green-500 mr-2" />;
            case "Equipment":
                return <Stethoscope className="h-5 w-5 text-orange-500 mr-2" />;
            case "Supply":
                return <Box className="h-5 w-5 text-purple-500 mr-2" />;
            default:
                return (
                    <Package className="h-5 w-5 text-muted-foreground mr-2" />
                );
        }
    };

    const getCategoryCount = (category) => {
        if (category === "All") return items.length;
        return items.filter((item) => item.category === category).length;
    };

    return (
        <AdminLayout header={"asd"}
        >
            {/* MAIN */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <Package className="h-5 w-5 text-muted-foreground mr-2" />
                            <div className="text-2xl font-bold">
                                {items.length}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="text-2xl font-bold">
                                {categories.length}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Low Stock Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            <div className="text-2xl font-bold">
                                {lowStockItems.length}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Expiring Soon
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 text-amber-500 mr-2" />
                            <div className="text-2xl font-bold">
                                {expiringItems.length}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <SearchBar items={items} onSearch={handleSearch} />

            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="mb-6"
            >
                <TabsList>
                    <TabsTrigger value="all">All Items</TabsTrigger>
                    <TabsTrigger value="master">Master List</TabsTrigger>
                    <TabsTrigger value="low">
                        Low Stock
                        {lowStockItems.length > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {lowStockItems.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="expiring">
                        Expiring Soon
                        {expiringItems.length > 0 && (
                            <Badge
                                variant="outline"
                                className="ml-2 bg-amber-100 text-amber-800"
                            >
                                {expiringItems.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="master" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Master List
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                value={masterListTab}
                                onValueChange={handleMasterListTabChange}
                                className="mb-6"
                            >
                                <TabsList className="grid grid-cols-5 w-full">
                                    <TabsTrigger
                                        value="All"
                                        className="flex items-center gap-2"
                                    >
                                        <Package className="h-4 w-4" />
                                        All
                                        <Badge
                                            variant="secondary"
                                            className="ml-1"
                                        >
                                            {getCategoryCount("All")}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Medicine"
                                        className="flex items-center gap-2"
                                    >
                                        <Pill className="h-4 w-4" />
                                        Medicines
                                        <Badge
                                            variant="secondary"
                                            className="ml-1"
                                        >
                                            {getCategoryCount("Medicine")}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Vaccine"
                                        className="flex items-center gap-2"
                                    >
                                        <Syringe className="h-4 w-4" />
                                        Vaccines
                                        <Badge
                                            variant="secondary"
                                            className="ml-1"
                                        >
                                            {getCategoryCount("Vaccine")}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Equipment"
                                        className="flex items-center gap-2"
                                    >
                                        <Stethoscope className="h-4 w-4" />
                                        Equipment
                                        <Badge
                                            variant="secondary"
                                            className="ml-1"
                                        >
                                            {getCategoryCount("Equipment")}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Supply"
                                        className="flex items-center gap-2"
                                    >
                                        <Box className="h-4 w-4" />
                                        Supplies
                                        <Badge
                                            variant="secondary"
                                            className="ml-1"
                                        >
                                            {getCategoryCount("Supply")}
                                        </Badge>
                                    </TabsTrigger>
                                </TabsList>

                                <div className="mt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredItems.map((item) => (
                                            <InventoryItemCard
                                                key={item.id}
                                                item={item}
                                                onUpdateClick={
                                                    handleUpdateClick
                                                }
                                            />
                                        ))}

                                        {filteredItems.length === 0 && (
                                            <div className="col-span-2 text-center py-12 border rounded-lg bg-muted/20">
                                                <p className="text-muted-foreground">
                                                    No items match your search
                                                    criteria
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button
                                    variant={
                                        activeCategory === null
                                            ? "default"
                                            : "outline"
                                    }
                                    className="w-full justify-start"
                                    onClick={() => {
                                        setActiveCategory(null);
                                        setFilteredItems(items);
                                    }}
                                >
                                    All Categories
                                </Button>

                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={
                                            activeCategory === category
                                                ? "default"
                                                : "outline"
                                        }
                                        className="w-full justify-start"
                                        onClick={() =>
                                            handleCategoryFilter(category)
                                        }
                                    >
                                        <div className="flex items-center">
                                            {getCategoryIcon(category)}
                                            {category}
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {movements
                                    .slice(0, 5)
                                    .map((movement, index) => {
                                        const item = items.find(
                                            (i) => i.id === movement.itemId
                                        );
                                        return (
                                            <div
                                                key={index}
                                                className="border-b pb-2 last:border-0 last:pb-0"
                                            >
                                                <p className="font-medium">
                                                    {movement.type ===
                                                    "incoming"
                                                        ? "Added"
                                                        : "Removed"}{" "}
                                                    {movement.quantity}{" "}
                                                    {item?.unit}s of{" "}
                                                    {item?.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    By {movement.performedBy} on{" "}
                                                    {new Date(
                                                        movement.date
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        );
                                    })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    {activeTab !== "master" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredItems.map((item) => (
                                <InventoryItemCard
                                    key={item.id}
                                    item={item}
                                    onUpdateClick={handleUpdateClick}
                                />
                            ))}

                            {filteredItems.length === 0 && (
                                <div className="col-span-2 text-center py-12 border rounded-lg bg-muted/20">
                                    <p className="text-muted-foreground">
                                        No items match your search criteria
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <ReportsPanel items={items} movements={movements} />
            </div>

            <StockMovementForm
                open={isMovementFormOpen}
                onClose={() => setIsMovementFormOpen(false)}
                item={selectedItem}
                onSave={handleSaveMovement}
            />

            <AddItemForm
                open={isAddItemFormOpen}
                onClose={() => setIsAddItemFormOpen(false)}
                onSave={(newItem) => {
                    setItems([...items, newItem]);
                    setFilteredItems([...items, newItem]);
                }}
            />
        </AdminLayout>
    );
};

export default InventoryDashboard;
