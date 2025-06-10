import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { Button } from "@/components/tempo/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";
import { DatePicker } from "@/components/tempo/components/ui/date-picker-with-range";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/tempo/components/ui/tabs";

import { format } from "date-fns";
import { Download, FileText, BarChart3 } from "lucide-react";

const ReportsPanel = ({ items, movements }) => {
    useEffect(() => {
        if (movements) {
            console.log("movements: ", movements);
        }
    }, [movements]);

    const [filter, setFilter] = useState({
        category: "All",
        stockStatus: "All",
    });

    const [dateRange, setDateRange] = useState();

    const categories = [
        "All",
        ...Array.from(new Set(items.map((item) => item.category.name))),
    ];

    const filteredItems = items.filter((item) => {
        // Filter by category
        if (
            filter.category &&
            filter.category !== "All" &&
            item.category.id !== filter.category
        ) {
            return false;
        }

        // Filter by stock status
        if (filter.stockStatus) {
            const isLowStock = item.stock[0]?.stocks <= 5;

            const isExpiring =
                item.stocks_movement[0].expiry_date &&
                new Date(item.stocks_movement[0].expiry_date).getTime() -
                    new Date().getTime() <
                    30 * 24 * 60 * 60 * 1000;

            if (filter.stockStatus === "Low" && !isLowStock) {
                return false;
            }

            if (filter.stockStatus === "Expiring" && !isExpiring) {
                return false;
            }

            if (filter.stockStatus === "Normal" && (isLowStock || isExpiring)) {
                return false;
            }
        }

        return true;
    });

    // const filteredMovements = movements.filter((movement) => {
    //     // Filter by date range
    //     if (dateRange) {
    //         const movementDate = new Date(movement.date);
    //         if (movementDate < dateRange.from || movementDate > dateRange.to) {
    //             return false;
    //         }
    //     }

    //     // Filter by item category
    //     if (filter.category && filter.category !== "All") {
    //         const item = items.find((i) => i.id === movement.itemId);
    //         if (item && item.category !== filter.category) {
    //             return false;
    //         }
    //     }

    //     return true;
    // });

    const generateReport = () => {
        // In a real app, this would generate a PDF or CSV
        console.log("Generating report with filters:", filter, dateRange);
        alert(
            "Report generated! In a real application, this would download a PDF or CSV file."
        );
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Inventory Reports
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Category
                            </label>
                            <Select
                            // value={filter.category}
                            // onValueChange={(value) =>
                            //     setFilter({ ...filter, category: value })
                            // }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Stock Status
                            </label>
                            <Select
                                value={filter.stockStatus}
                                onValueChange={(value) =>
                                    setFilter({ ...filter, stockStatus: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">
                                        All Items
                                    </SelectItem>
                                    <SelectItem value="Low">
                                        Low Stock
                                    </SelectItem>
                                    <SelectItem value="Expiring">
                                        Expiring Soon
                                    </SelectItem>
                                    <SelectItem value="Normal">
                                        Normal
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Date Range
                            </label>
                            <DatePicker
                                selected={dateRange}
                                onSelect={setDateRange}
                            />
                        </div>
                    </div>

                    <Tabs defaultValue="inventory">
                        <TabsList className="grid w-full md:grid-cols-2 grid-cols-1">
                            <TabsTrigger value="inventory">
                                Inventory Status
                            </TabsTrigger>
                            <TabsTrigger value="movements">
                                Stock Movements
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="inventory" className="pt-4">
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="text-left p-2">
                                                Item Name
                                            </th>
                                            <th className="text-left p-2">
                                                Category
                                            </th>
                                            <th className="text-left p-2">
                                                Quantity
                                            </th>
                                            <th className="text-left p-2">
                                                Status
                                            </th>
                                            <th className="text-left p-2">
                                                Expiration
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <tr>
                                            <td
                                                colSpan={5}
                                                className="p-4 text-center text-muted-foreground"
                                            >
                                                No items match the selected
                                                filters
                                            </td>
                                        </tr> */}

                                        {filteredItems.length > 0 ? (
                                            filteredItems.map((item) => {
                                                const isLowStock =
                                                    item.stock[0]?.stocks <= 5;

                                                const isExpiring =
                                                    item.stocks_movement[0]
                                                        .expiry_date &&
                                                    new Date(
                                                        item.stocks_movement[0].expiry_date
                                                    ).getTime() -
                                                        new Date().getTime() <
                                                        30 *
                                                            24 *
                                                            60 *
                                                            60 *
                                                            1000;

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="border-t"
                                                    >
                                                        <td className="p-2">
                                                            {
                                                                item
                                                                    .stocks_movement[0]
                                                                    .inventory_name
                                                            }
                                                        </td>
                                                        <td className="p-2">
                                                            {item.category.name}
                                                        </td>
                                                        <td className="p-2">
                                                            {item.stock[0]
                                                                .stocks ??
                                                                0}{" "}
                                                            {
                                                                item?.stock[0]
                                                                    ?.stockname
                                                            }
                                                            s
                                                        </td>
                                                        <td className="p-2">
                                                            {isLowStock && (
                                                                <span className="text-red-600 font-medium">
                                                                    Low Stock
                                                                </span>
                                                            )}
                                                            {isExpiring && (
                                                                <span className="text-amber-600 font-medium">
                                                                    {isLowStock
                                                                        ? ", "
                                                                        : ""}
                                                                    Expiring
                                                                    Soon
                                                                </span>
                                                            )}
                                                            {!isLowStock &&
                                                                !isExpiring && (
                                                                    <span className="text-green-600 font-medium">
                                                                        Normal
                                                                    </span>
                                                                )}
                                                        </td>
                                                        <td className="p-2">
                                                            {item
                                                                .stocks_movement[0]
                                                                .expiry_date
                                                                ? format(
                                                                      new Date(
                                                                          item.stocks_movement[0].expiry_date
                                                                      ),
                                                                      "MMM dd, yyyy"
                                                                  )
                                                                : "N/A"}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="p-4 text-center text-muted-foreground"
                                                >
                                                    No items match the selected
                                                    filters
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>

                        <TabsContent value="movements" className="pt-4">
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="text-left p-2">
                                                Date
                                            </th>
                                            <th className="text-left p-2">
                                                Item
                                            </th>
                                            <th className="text-left p-2">
                                                Type
                                            </th>
                                            <th className="text-left p-2">
                                                Quantity
                                            </th>
                                            <th className="text-left p-2">
                                                Staff
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movements.length > 0 ? (
                                            movements.map((movement) => {
                                                // const item = items.find(
                                                //     (i) => i.id === item.itemId
                                                // );
                                                return (
                                                    <tr
                                                        key={movement.id}
                                                        className="border-t"
                                                    >
                                                        <td className="p-2">
                                                            {format(
                                                                new Date(
                                                                    movement.created_at
                                                                ),
                                                                "MMM dd, yyyy"
                                                            )}
                                                        </td>
                                                        <td className="p-2">
                                                            {movement?.inventory_name ||
                                                                "Unknown Item"}
                                                        </td>
                                                        <td className="p-2">
                                                            <span
                                                                className={`font-medium ${
                                                                    movement.type ===
                                                                    "Incoming"
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {movement.type ===
                                                                "Incoming"
                                                                    ? "Incoming"
                                                                    : "Outgoing"}
                                                            </span>
                                                        </td>
                                                        <td className="p-2">
                                                            {movement.quantity}{" "}
                                                            {
                                                                movement?.stocks
                                                                    ?.stockname
                                                            }
                                                        </td>
                                                        <td className="p-2">
                                                            {
                                                                movement.staff
                                                                    .firstname
                                                            }{" "}
                                                            {
                                                                movement.staff
                                                                    .lastname
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="p-4 text-center text-muted-foreground"
                                                >
                                                    No movements match the
                                                    selected filters
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <BarChart3 className="h-4 w-4" />
                            View Analytics
                        </Button>
                        <Button
                            onClick={generateReport}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Generate Report
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReportsPanel;
