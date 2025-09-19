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
// import { DatePicker } from "@/components/tempo/components/ui/date-picker-with-range";
import DatePicker from "@/components/date-range-picker";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tempo/components/ui/tabs";

import { format } from "date-fns";
import { Download, FileText, BarChart3, Package, TrendingUp, TrendingDown, AlertTriangle, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

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
      "Report generated! In a real application, this would download a PDF or CSV file.",
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border-gray-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">Inventory Reports</div>
              <p className="text-sm text-gray-600 mt-1">Generate and view inventory reports</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  Category
                </label>
                <Select
                // value={filter.category}
                // onValueChange={(value) =>
                //     setFilter({ ...filter, category: value })
                // }
                >
                  <SelectTrigger className="h-11 border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                  Stock Status
                </label>
                <Select
                  value={filter.stockStatus}
                  onValueChange={(value) =>
                    setFilter({ ...filter, stockStatus: value })
                  }
                >
                  <SelectTrigger className="h-11 border-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Items</SelectItem>
                    <SelectItem value="Low">Low Stock</SelectItem>
                    <SelectItem value="Expiring">Expiring Soon</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Date Range
                </label>
                <DatePicker selected={dateRange} onSelect={setDateRange} />
              </div>
            </div>

            <Tabs defaultValue="inventory">
              <TabsList className="grid w-full md:grid-cols-2 grid-cols-1 bg-gray-100">
                <TabsTrigger value="inventory" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory Status
                </TabsTrigger>
                <TabsTrigger value="movements" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Stock Movements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="pt-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-900">Item Name</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Category</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Quantity</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Expiration</th>
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
                        const isLowStock = item.stock[0]?.stocks <= 5;

                        const isExpiring =
                          item.stocks_movement[0].expiry_date &&
                          new Date(
                            item.stocks_movement[0].expiry_date,
                          ).getTime() -
                            new Date().getTime() <
                            30 * 24 * 60 * 60 * 1000;

                        return (
                          <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                  <Package className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-900">
                                  {item.stocks_movement[0].inventory_name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {item.category.name}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-gray-900">
                                {item.stock[0].stocks ?? 0} {item?.stock[0]?.stockname}s
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {isLowStock && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Low Stock
                                  </span>
                                )}
                                {isExpiring && (
                                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Expiring Soon
                                  </span>
                                )}
                                {!isLowStock && !isExpiring && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Normal
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-gray-700">
                                {item.stocks_movement[0].expiry_date
                                  ? format(
                                      new Date(
                                        item?.stocks_movement?.[
                                          item?.stocks_movement?.length - 1
                                        ]?.expiry_date,
                                      ),
                                      "MMM dd, yyyy",
                                    )
                                  : "N/A"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Package className="h-12 w-12 text-gray-300" />
                            <div className="text-gray-500 font-medium">No items match the selected filters</div>
                            <div className="text-sm text-gray-400">Try adjusting your filter criteria</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="movements" className="pt-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Batch Number</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Item</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Quantity</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Reason</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Staff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.length > 0 ? (
                      movements.map((movement) => {
                        // const item = items.find(
                        //     (i) => i.id === item.itemId
                        // );
                        return (
                          <tr key={movement.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <span className="text-gray-700">
                                {format(
                                  new Date(movement.created_at),
                                  "MMM dd, yyyy",
                                )}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-mono">
                                {movement?.batch_number || "N/A"}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-900">
                                  {movement?.inventory_name || "Unknown Item"}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                                  movement.type === "Incoming"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {movement.type === "Incoming" ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {movement.type === "Incoming"
                                  ? "Incoming"
                                  : "Outgoing"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-gray-900">
                                {movement.quantity} {movement?.stocks?.stockname}
                              </span>
                            </td>
                            <td className="p-4">
                              {movement.reason ? (
                                <span className="text-gray-700">{movement.reason}</span>
                              ) : (
                                <span className="text-gray-400 italic">
                                  No reason provided
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-blue-50 rounded">
                                  <User className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="text-gray-700">
                                  {movement.staff.firstname} {movement.staff.lastname}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-8 text-center"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <TrendingUp className="h-12 w-12 text-gray-300" />
                            <div className="text-gray-500 font-medium">No movements match the selected filters</div>
                            <div className="text-sm text-gray-400">Try adjusting your filter criteria</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <Button variant="outline" className="flex items-center gap-2 h-11 border-gray-300 hover:bg-gray-50">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
            <Button
              onClick={generateReport}
              className="flex items-center gap-2 h-11 text-white"
              style={{ backgroundColor: '#2C3E50' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
            >
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default ReportsPanel;
