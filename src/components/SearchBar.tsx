
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchResult } from "@/types";
import { searchItems } from "@/services/searchService";
import { ExternalLink, Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className, searchQuery, onSearchQueryChange }) => {
  const [query, setQuery] = useState<string>(searchQuery || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Update local query when external searchQuery changes
  React.useEffect(() => {
    if (searchQuery !== undefined) {
      setQuery(searchQuery);
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      }
    }
  }, [searchQuery]);

  const handleSearch = (searchTerm?: string) => {
    const term = searchTerm || query;
    if (term.trim()) {
      const searchResults = searchItems(term);
      setResults(searchResults);
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search all news sources..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearchQueryChange?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            className="bg-cyber-card border-cyber-accent/30 pr-8"
          />
          {query && (
            <button
              onClick={resetSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button 
          onClick={() => handleSearch()} 
          className="bg-cyber-accent hover:bg-cyber-accent/80"
        >
          <Search className="mr-2" size={16} />
          Search
        </Button>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-30" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full mt-2 left-0 right-0 z-40 bg-cyber-card border-cyber-accent/30 max-h-[60vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-semibold">
                  {results.length} Results for "{query}"
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X size={16} />
                </Button>
              </div>
              {results.length === 0 ? (
                <p className="text-gray-400">No results found.</p>
              ) : (
                <div className="space-y-4">
                  {results.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-700 pb-3 last:border-0">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <h3 className="font-medium text-white group-hover:text-cyber-highlight">
                          {item.title}
                          <ExternalLink className="inline-block ml-1 w-3 h-3" />
                        </h3>
                        <div className="text-xs text-cyber-highlight mt-1">{item.source}</div>
                        {item.contentSnippet && (
                          <p className="text-sm text-gray-400 mt-1">
                            {item.contentSnippet.substring(0, 150).replace(/<[^>]*>?/gm, "")}
                            {item.contentSnippet.length > 150 ? "..." : ""}
                          </p>
                        )}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default SearchBar;
