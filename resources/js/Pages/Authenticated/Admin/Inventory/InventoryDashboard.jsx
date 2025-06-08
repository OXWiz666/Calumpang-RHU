import React, { useEffect, useState } from "react";
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

import CustomModal from "@/components/CustomModal";
import Modal from "@/components/Modal";
import { Input } from "@/components/tempo/components/ui/input";
import InputLabel from "@/components/InputLabel";
import { router, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/components/PrimaryButton";
import PrintErrors from "@/components/PrintErrors";

const InventoryDashboard = ({ categories = [], inventory }) => {
    const [items, setItems] = useState([]);

    const [items_, setItems_] = useState(inventory);

    const [movements, setMovements] = useState([]);
    const [filteredItems, setFilteredItems] = useState(inventory);

    useEffect(() => {
        if (inventory) {
            console.log("inventory:", inventory);
        }
    }, [inventory]);

    const { flash } = usePage().props;
    useEffect(() => {
        router.reload({
            only: ["inventory"],
        });
    }, [flash]);

    // const [items, setItems] = useState(mockInventoryItems);
    // const [movements, setMovements] = useState(mockStockMovements);
    // const [filteredItems, setFilteredItems] = useState(mockInventoryItems);

    const [selectedItem, setSelectedItem] = useState(null);
    const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
    const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [masterListTab, setMasterListTab] = useState("All");

    //const categories = Array.from(new Set(items.map((item) => item.category)));

    const lowStockItems = items.filter((item) => item.stock.stocks <= 80);

    const expiringItems = items.filter(
        (item) =>
            item.stocks_movement.expiry_date &&
            new Date(item.stocks_movement.expiry_date).getTime() -
                new Date().getTime() <
                30 * 24 * 60 * 60 * 1000
    );

    const handleSearch = (results) => {
        setFilteredItems(results);
        setActiveCategory(null);
        setActiveTab("all");
    };

    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
        //console.log("active cat:", activeCategory);
        setFilteredItems(items_.filter((item) => item.category.id == category));
    };

    useEffect(() => {
        if (filteredItems) {
            console.log(filteredItems);
        }
    }, [filteredItems]);

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

        // const updatedItems = items.map((item) => {
        //     if (item.id === movement.itemId) {
        //         const newQuantity =
        //             movement.type === "incoming"
        //                 ? item.quantity + movement.quantity
        //                 : item.quantity - movement.quantity;

        //         return {
        //             ...item,
        //             quantity: Math.max(0, newQuantity),
        //             lastUpdated: new Date(),
        //         };
        //     }
        //     return item;
        // });

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
        return 0;
        //if (category === "All") return items.length;
        //return items.filter((item) => item.category === category).length;
    };

    const [isModifyingCategory, setIsModifyingCategory] = useState(false);

    const {
        data,
        setData,
        post,
        recentlySuccessful,
        processing,
        errors,
        clearErrors,
    } = useForm({
        categoryname: "",
    });

    useEffect(() => {
        clearErrors();
    }, [isModifyingCategory]);

    const categorysubmit = (e) => {
        e.preventDefault();
        post(route("admin.inventory.category"), {
            onSuccess: () => {
                setIsModifyingCategory(false);
            },
            onFinish: () => {
                router.reload({
                    only: ["flash", "categories"],
                });
            },
        });
    };
    return (
        <AdminLayout>
            {/* MAIN */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                {/* <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Inventory Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Rural Health Unit of Barangay Calumpang
                    </p>
                </div> */}

                <div className=" mb-5">
                    <h1 className="text-3xl font-bold mb-2">Inventory</h1>
                    {/* <p className="text-gray-600">
                            Book your visit to Barangay Calumpang Health Center.
                            Please fill out the form below with your information
                            and preferred appointment details.
                        </p> */}
                    <p className="text-muted-foreground"></p>
                </div>

                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Advanced Filters
                    </Button>
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => setIsAddItemFormOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add New Item
                    </Button>
                </div>
            </div>
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

            <SearchBar items={items_} onSearch={handleSearch} />

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
                                <TabsList className="grid md:grid-cols-2 lg:grid-cols-5 lg w-full">
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
                                <div className="flex justify-between space-x-2 mt-4 md:mt-0">
                                    <div>Categories</div>
                                    <Button
                                        className="flex items-center gap-2"
                                        onClick={() =>
                                            setIsModifyingCategory(true)
                                        }
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add
                                    </Button>
                                </div>

                                <CustomModal
                                    isOpen={isModifyingCategory}
                                    onClose={() => {
                                        setIsModifyingCategory(false);
                                    }}
                                    title="Add Category"
                                    description="Add Category for Inventory."
                                    maxWidth="sm"
                                >
                                    <form onSubmit={categorysubmit}>
                                        {/* <div className=" bg-red-100">s</div> */}
                                        <PrintErrors errors={errors} />
                                        <div className="flex flex-col items-start">
                                            <div className=" w-full">
                                                <InputLabel value="Category Name:" />
                                                <Input
                                                    value={data.categoryname}
                                                    onChange={(e) =>
                                                        setData(
                                                            "categoryname",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <PrimaryButton
                                                disabled={processing}
                                                className=" self-end mt-2"
                                                type="submit"
                                            >
                                                Save
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </CustomModal>
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
                                        setFilteredItems(items_);
                                    }}
                                >
                                    All Categories
                                </Button>

                                {categories.map((category, i) => (
                                    <Button
                                        key={i}
                                        variant={
                                            activeCategory === category.id
                                                ? "default"
                                                : "outline"
                                        }
                                        className="w-full justify-start"
                                        onClick={() =>
                                            handleCategoryFilter(category.id)
                                        }
                                    >
                                        <div className="flex items-center">
                                            {/* {getCategoryIcon(category)}
                                            {category} */}
                                            {category.name}
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
                                            (i) => i?.id === movement?.itemId
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
                <ReportsPanel items={items_} movements={movements} />
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
                categories_={categories}
            />
        </AdminLayout>
    );
};

export default InventoryDashboard;
