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
    RefreshCcw,
    TrendingUp,
    TrendingDown,
    Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import InventoryItemCard from "./InventoryItemCard";
import InventoryListItem from "./InventoryListItem";
import StockMovementForm from "./StockMovementForm";
import ReportsPanel from "./ReportsPanel";
import AddItemForm from "./AddItemForm";
import AdminLayout from "@/Layouts/AdminLayout";

import {
    mockInventoryItems,
    mockStockMovements,
} from "./mockitems/mockInventory.ts";

import CustomModal from "@/components/CustomModal";
import Modal from "@/components/Modal";
import { Input } from "@/components/tempo/components/ui/input";
import InputLabel from "@/components/InputLabel";
import { router, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/components/PrimaryButton";
import PrintErrors from "@/components/PrintErrors";
import { Trash2 } from "lucide-react";

import { DialogFooter } from "@/components/tempo/components/ui/dialog";
import { Edit2 } from "lucide-react";
const InventoryDashboard = ({ categories = [], inventory, movements_ }) => {
    const [items, setItems] = useState([]);
    const [items_, setItems_] = useState(inventory);
    const [movements, setMovements] = useState([]);
    const [filteredItems, setFilteredItems] = useState(inventory);

    useEffect(() => {
        if (inventory) {
            // alert("asd");
            setItems_(inventory);
            setFilteredItems(inventory);

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

    const lowStockItems = inventory.filter((item) => item.stock[0].stocks <= 5);

    const expiringItems = items_.filter(
        (item) =>
            item?.stocks_movement?.[item?.stocks_movement?.length - 1]
                ?.expiry_date &&
            new Date(
                item?.stocks_movement?.[
                    item?.stocks_movement?.length - 1
                ]?.expiry_date
            ).getTime() -
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
            setFilteredItems(items_);
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

        put: updateCategory,
        delete: destroyCategory,
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

    const [cDeleting, setCDeleting] = useState(false);
    const [cUpdating, setCUpdating] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (selectedCategory) {
            setData("categoryname", selectedCategory.name);
        }
    }, [selectedCategory]);

    const deleteCategory = (e) => {
        e.preventDefault();
        destroyCategory(
            route("admin.inventory.category.delete", {
                category: selectedCategory?.id,
            }),
            {
                onFinish: () => {
                    router.reload({
                        only: ["categories"],
                    });
                },
                onSuccess: () => {
                    setCDeleting(false);
                    setSelectedCategory(null);
                },
            }
        );
    };

    const updateCategory_ = (e) => {
        e.preventDefault();

        updateCategory(
            route("admin.inventory.category.update", {
                category: selectedCategory?.id,
            }),
            {
                onFinish: () => {
                    router.reload({
                        only: ["flash", "categories"],
                    });
                },
                onSuccess: () => {
                    setCUpdating(false);
                    //setSelectedCategory
                },
            }
        );
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
                        className="flex items-center gap-2 text-white"
                        style={{ backgroundColor: '#2C3E50' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
                        onClick={() => setIsAddItemFormOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add New Item
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                <Card className="hover:shadow-md transition-all duration-300 border-gray-100 hover:shadow-gray-200/50">
                        <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                                <Package className="h-4 w-4" />
                                Total Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                                    {inventory.length}
                                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="hover:shadow-md transition-shadow duration-200 border-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-gray-900">
                                    {categories.length}
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <Activity className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                <Card className="hover:shadow-md transition-all duration-300 border-gray-100 hover:shadow-gray-200/50">
                        <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                                <AlertTriangle className="h-4 w-4" />
                                Low Stock Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-amber-600">
                                    {lowStockItems.length}
                                </div>
                                <div className="p-3 rounded-lg bg-amber-50">
                                    <TrendingDown className="h-6 w-6 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                <Card className="hover:shadow-md transition-all duration-300 border-gray-100 hover:shadow-gray-200/50">
                        <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4" />
                                Expiring Soon
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-red-600">
                                    {expiringItems.length}
                                </div>
                                <div className="p-3 rounded-lg bg-red-50">
                                    <Clock className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <SearchBar items={items_} onSearch={handleSearch} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="mb-6"
                >
                    <TabsList className="bg-white border-gray-200">
                        <TabsTrigger value="all">Master List</TabsTrigger>
                        {/* <TabsTrigger value="master">Master List</TabsTrigger> */}
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
                                                        No items match your
                                                        search criteria
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
                <PrimaryButton
                    className="flex items-center gap-2"
                    onClick={() => {
                        router.reload({
                            only: ["inventory"],
                        });
                    }}
                >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                </PrimaryButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                <div className="flex justify-between space-x-2 mt-4 md:mt-0">
                                    <div>Categories</div>
                                    <Button
                                        className="flex items-center gap-2 text-white"
                                        style={{ backgroundColor: '#2C3E50' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
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
                                                className="self-end mt-2 text-white"
                                                style={{ backgroundColor: '#2C3E50' }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
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
                                        <div className="flex items-center justify-between w-full">
                                            <span className="flex-1 truncate text-left">
                                                {category.name}
                                            </span>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedCategory(
                                                            category
                                                        );

                                                        // setData(
                                                        //     "categoryname",
                                                        //     selectedCategory.name
                                                        // );
                                                        setCUpdating(true);
                                                        // Add your edit handler here
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedCategory(
                                                            category
                                                        );
                                                        setCDeleting(true);
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                                <CustomModal
                                    isOpen={cDeleting}
                                    onClose={(e) => {
                                        setCDeleting(false);
                                    }}
                                    title={`Deleting category ${selectedCategory?.name}`}
                                    description={`Are you sure you want to delete ${selectedCategory?.name} Category?`}
                                    maxWidth="md"
                                >
                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={(e) => {
                                                setCDeleting(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                            disabled={processing}
                                            onClick={deleteCategory}
                                        >
                                            Delete Category
                                        </Button>
                                    </DialogFooter>
                                </CustomModal>

                                <CustomModal
                                    isOpen={cUpdating}
                                    onClose={(e) => {
                                        setCUpdating(false);
                                    }}
                                    title={`Updating category ${selectedCategory?.name}`}
                                    description={`Update ${selectedCategory?.name} Category here.`}
                                    maxWidth="md"
                                >
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
                                    <DialogFooter className="pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={(e) => {
                                                setCUpdating(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="text-white"
                                            style={{ backgroundColor: '#2C3E50' }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
                                            disabled={processing}
                                            onClick={updateCategory_}
                                        >
                                            Update Category
                                        </Button>
                                    </DialogFooter>
                                </CustomModal>
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* List Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Package className="h-4 w-4" />
                                        <span>{filteredItems.length} items</span>
                                    </div>
                                </div>
                            </div>

                            {/* List Content */}
                            <div className="divide-y divide-gray-100">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <InventoryListItem
                                            key={item.id}
                                            item={item}
                                            onUpdateClick={handleUpdateClick}
                                        />
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Package className="h-12 w-12 text-gray-300" />
                                            <div className="font-medium text-gray-500">
                                                No items found
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                Try adjusting your search or filter criteria
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <ReportsPanel items={items_} movements={movements_} />
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
                categories={categories}
            />
        </AdminLayout>
    );
};

export default InventoryDashboard;
