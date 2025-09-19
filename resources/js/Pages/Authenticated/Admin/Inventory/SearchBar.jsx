import React, { useState, useEffect } from "react";
import { Input } from "@/components/tempo/components/ui/input";
import { Button } from "@/components/tempo/components/ui/button";
import { Search, Package, Tag, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ items, onSearch }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (query.length > 1) {
            const itemNames = items.map((item) => item.name);
            const categories = [
                ...new Set(items.map((item) => item.category.name)),
            ];
            const batchNumbers= items
            .map((item) => item.stocks_movement?.[0]?.batch_number)
            .filter(Boolean); // Filter out null/undefined values
            const matchedNames = itemNames.filter((name) =>

                name.toLowerCase().includes(query.toLowerCase())
            );

            const matchedCategories = categories.filter((category) =>
                category.toLowerCase().includes(query.toLowerCase())
            );

             const matchedBatchNumbers = batchNumbers.filter((batch) =>
            batch.toLowerCase().includes(query.toLowerCase())
            );

            setSuggestions([...matchedNames, ...matchedCategories, ...matchedBatchNumbers]);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [query, items]);

    const handleSearch = () => {
        const results = items.filter(
            (item) =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.category.name.toLowerCase().includes(query.toLowerCase()) ||
                item.stocks_movement?.[0]?.batch_number?.toLowerCase().includes(query.toLowerCase())
        );
        onSearch(results);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);

        const results = items.filter(
            (item) =>
                item.name === suggestion ||
                item.category.name === suggestion ||
                item.stocks_movement?.[0]?.batch_number === suggestion
        );
        onSearch(
            results.length > 0
                ? results
                : items.filter(
                      (item) =>
                          item.name
                              .toLowerCase()
                              .includes(suggestion.toLowerCase()) ||
                          item.category.name
                              .toLowerCase()
                              .includes(suggestion.toLowerCase()) ||
                          item.stocks_movement?.[0]?.batch_number
                              .toLowerCase()
                              .includes(suggestion.toLowerCase())
                  )
        );
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto mb-8">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                    type="text"
                    placeholder="Search by medicine name, batch number or category..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-4 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button 
                    onClick={handleSearch} 
                    className="absolute right-1 top-1 h-10 text-white"
                    style={{ backgroundColor: '#2C3E50' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#34495E'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
                >
                    Search
                </Button>
            </div>

            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full rounded-lg shadow-xl mt-2 max-h-60 overflow-y-auto bg-white border-gray-200"
                    >
                        {suggestions.map((suggestion, index) => {
                            const isBatchNumber = items.some(item => item.stocks_movement?.[0]?.batch_number === suggestion);
                            const isCategory = items.some(item => item.category.name === suggestion);
                            
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors hover:bg-blue-50 border-gray-100"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 rounded bg-gray-100">
                                            {isBatchNumber ? (
                                                <Hash className="h-4 w-4 text-gray-600" />
                                            ) : isCategory ? (
                                                <Tag className="h-4 w-4 text-gray-600" />
                                            ) : (
                                                <Package className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">{suggestion}</span>
                                            <div className="text-xs text-gray-500">
                                                {isBatchNumber ? "Batch Number" : isCategory ? "Category" : "Item Name"}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
