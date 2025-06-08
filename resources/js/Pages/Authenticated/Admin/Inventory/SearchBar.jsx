import React, { useState, useEffect } from "react";
import { Input } from "@/components/tempo/components/ui/input";
import { Button } from "@/components/tempo/components/ui/button";
import { Search } from "lucide-react";

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

            const matchedNames = itemNames.filter((name) =>
                name.toLowerCase().includes(query.toLowerCase())
            );

            const matchedCategories = categories.filter((category) =>
                category.toLowerCase().includes(query.toLowerCase())
            );

            setSuggestions([...matchedNames, ...matchedCategories]);
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
                item.category.name.toLowerCase().includes(query.toLowerCase())
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
                item.name === suggestion || item.category.name === suggestion
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
                              .includes(suggestion.toLowerCase())
                  )
        );
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto mb-6">
            <div className="flex">
                <Input
                    type="text"
                    placeholder="Search by medicine name or category..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow rounded-r-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Button onClick={handleSearch} className="rounded-l-none">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
