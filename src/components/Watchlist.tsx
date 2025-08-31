import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, X, Minus, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { getWatchlistMatches } from "@/services/watchlistService";

interface WatchlistItem {
  keyword: string;
  count: number;
}

interface WatchlistProps {
  onKeywordClick?: (keyword: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ onKeywordClick }) => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [watchlistWithCounts, setWatchlistWithCounts] = useState<WatchlistItem[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWatchlist(parsed);
      } catch (error) {
        console.warn("Failed to parse watchlist from localStorage");
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Update counts whenever watchlist changes
  useEffect(() => {
    const updateCounts = () => {
      const withCounts = watchlist.map(keyword => ({
        keyword,
        count: getWatchlistMatches(keyword).length
      }));
      setWatchlistWithCounts(withCounts);
    };

    updateCounts();
    // Update counts every 30 seconds
    const interval = setInterval(updateCounts, 30000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const addKeyword = () => {
    const keyword = newKeyword.trim().toLowerCase();
    if (!keyword) return;
    
    if (watchlist.includes(keyword)) {
      toast.error("Keyword already in watchlist");
      return;
    }

    setWatchlist(prev => [...prev, keyword]);
    setNewKeyword("");
    setIsPopoverOpen(false);
    toast.success(`Added "${keyword}" to watchlist`);
  };

  const removeKeyword = (keyword: string) => {
    setWatchlist(prev => prev.filter(k => k !== keyword));
    toast.success(`Removed "${keyword}" from watchlist`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addKeyword();
    }
  };

  if (isMinimized) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-card border border-cyber-border rounded-lg hover:bg-cyber-card/80 transition-colors"
        >
          <Eye className="w-4 h-4 text-cyber-highlight" />
          <span className="text-cyber-highlight font-medium">Watchlist</span>
          <span className="text-lg">👀</span>
          {watchlistWithCounts.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {watchlistWithCounts.reduce((sum, item) => sum + item.count, 0)}
            </Badge>
          )}
        </button>
      </div>
    );
  }

  return (
    <Card className="bg-cyber-card border-cyber-border">
      <CardHeader>
        <CardTitle className="text-cyber-highlight flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Watchlist</span>
            <Badge variant="secondary" className="text-xs">
              {watchlistWithCounts.reduce((sum, item) => sum + item.count, 0)} matches
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="h-6 w-6 p-0 hover:bg-cyber-background"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Tracked Keywords:</span>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button size="sm" className="shrink-0">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-cyber-card border-cyber-border">
              <div className="space-y-3">
                <h4 className="font-medium text-white">Add Keyword to Watchlist</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter keyword to watch..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-cyber-background border-cyber-border text-white placeholder:text-gray-400"
                  />
                  <Button onClick={addKeyword} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {watchlistWithCounts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {watchlistWithCounts.map(({ keyword, count }) => (
              <div
                key={keyword}
                className="flex items-center gap-1 bg-cyber-background rounded-full px-3 py-1 border border-cyber-border"
              >
                <button
                  onClick={() => onKeywordClick?.(keyword)}
                  className="text-sm text-white hover:text-cyber-highlight transition-colors cursor-pointer"
                >
                  {keyword}
                </button>
                <Badge variant="outline" className="text-xs">
                  {count}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeKeyword(keyword)}
                  className="h-4 w-4 p-0 hover:bg-red-500/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Watchlist;
