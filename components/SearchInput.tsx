"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Sparkles } from "lucide-react";

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
    currentQuery?: string;
}

export function SearchInput({ onSearch, placeholder = "Search images...", className, currentQuery = "" }: SearchInputProps) {
    const [query, setQuery] = useState(currentQuery);

    useEffect(() => {
        setQuery(currentQuery);
    }, [currentQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query);
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className="relative w-full max-w-md">
            <form onSubmit={handleSubmit} className={`relative flex items-center w-full group ${className}`}>
                <Sparkles className="absolute left-4 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    maxLength={100}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-20 h-11 rounded-full bg-secondary/30 backdrop-blur-sm border-transparent ring-1 ring-transparent focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary/20 transition-all duration-300 shadow-sm hover:bg-secondary/50"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-20 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors z-20"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1.5 h-8 px-4 rounded-full text-xs font-medium bg-primary/90 hover:bg-primary shadow-sm transition-all duration-300"
                >
                    Search
                </Button>
            </form>
        </div>
    );
}
