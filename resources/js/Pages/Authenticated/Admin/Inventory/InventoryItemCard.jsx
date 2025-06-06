import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Button } from "@/components/tempo/components/ui/button";
import { ChevronDown, ChevronUp, AlertTriangle, Clock } from "lucide-react";

import { format } from "date-fns";

const InventoryItemCard = ({ item, onUpdateClick }) => {
    const [expanded, setExpanded] = useState(false);

    const isLowStock = item.quantity <= item.reorderThreshold;

    const isExpiring =
        item.expirationDate &&
        new Date(item.expirationDate).getTime() - new Date().getTime() <
            30 * 24 * 60 * 60 * 1000; // 30 days

    const getBadgeColor = (category) => {
        switch (category) {
            case "Medicine":
                return "bg-blue-100 text-blue-800";
            case "Vaccine":
                return "bg-green-100 text-green-800";
            case "Supply":
                return "bg-purple-100 text-purple-800";
            case "Equipment":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Card
            className={`mb-4 ${
                isLowStock
                    ? "border-red-300"
                    : isExpiring
                    ? "border-amber-300"
                    : "border-gray-200"
            }`}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-medium">
                            {item.name}
                        </CardTitle>
                        <div className="flex gap-2 mt-1">
                            <Badge className={getBadgeColor(item.category)}>
                                {item.category}
                            </Badge>
                            {isLowStock && (
                                <Badge
                                    variant="destructive"
                                    className="flex items-center gap-1"
                                >
                                    <AlertTriangle className="h-3 w-3" />
                                    Low Stock
                                </Badge>
                            )}
                            {isExpiring && item.expirationDate && (
                                <Badge
                                    variant="outline"
                                    className="bg-amber-100 text-amber-800 flex items-center gap-1"
                                >
                                    <Clock className="h-3 w-3" />
                                    Expiring Soon
                                </Badge>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                        className="h-8 w-8 p-0"
                    >
                        {expanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Quantity
                        </p>
                        <p
                            className={`font-medium ${
                                isLowStock ? "text-red-600" : ""
                            }`}
                        >
                            {item.quantity} {item.unit}s
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Reorder At
                        </p>
                        <p className="font-medium">
                            {item.reorderThreshold} {item.unit}s
                        </p>
                    </div>
                </div>

                {expanded && (
                    <div className="mt-4 border-t pt-3">
                        <div className="grid grid-cols-2 gap-3">
                            {item.expirationDate && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Expiration Date
                                    </p>
                                    <p
                                        className={`font-medium ${
                                            isExpiring ? "text-amber-600" : ""
                                        }`}
                                    >
                                        {format(
                                            new Date(item.expirationDate),
                                            "MMM dd, yyyy"
                                        )}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Last Updated
                                </p>
                                <p className="font-medium">
                                    {format(
                                        new Date(item.lastUpdated),
                                        "MMM dd, yyyy"
                                    )}
                                </p>
                            </div>
                            {item.isVaccine && (
                                <>
                                    {item.batchNumber && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Batch Number
                                            </p>
                                            <p className="font-medium">
                                                {item.batchNumber}
                                            </p>
                                        </div>
                                    )}
                                    {item.lotNumber && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Lot Number
                                            </p>
                                            <p className="font-medium">
                                                {item.lotNumber}
                                            </p>
                                        </div>
                                    )}
                                    {item.location && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Storage Location
                                            </p>
                                            <p className="font-medium">
                                                {item.location}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>

            {expanded && (
                <CardFooter className="pt-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-secondary/80 transition-colors font-medium"
                        onClick={() => onUpdateClick(item)}
                    >
                        Update Stock
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

export default InventoryItemCard;
