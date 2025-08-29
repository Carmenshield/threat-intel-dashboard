import { RssItem } from "@/types";

// Get current watchlist from localStorage
export const getWatchlist = (): string[] => {
  try {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Check if an RSS item matches any watchlist keywords
export const isWatchlistMatch = (item: RssItem): boolean => {
  const watchlist = getWatchlist();
  if (watchlist.length === 0) return false;

  const searchText = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
  
  return watchlist.some(keyword => 
    searchText.includes(keyword.toLowerCase())
  );
};

// Get all RSS items that match a specific keyword
export const getWatchlistMatches = (keyword: string): RssItem[] => {
  // Get items from the search index
  const searchIndex = getSearchIndex();
  const lowerKeyword = keyword.toLowerCase();
  
  return searchIndex.filter(item => {
    const searchText = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
    return searchText.includes(lowerKeyword);
  });
};

// Get all RSS items that match any watchlist keyword
export const getAllWatchlistMatches = (): RssItem[] => {
  const watchlist = getWatchlist();
  if (watchlist.length === 0) return [];

  const searchIndex = getSearchIndex();
  const matches: RssItem[] = [];
  const seenLinks = new Set<string>();

  searchIndex.forEach(item => {
    if (seenLinks.has(item.link)) return;
    
    const searchText = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
    const hasMatch = watchlist.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      matches.push(item);
      seenLinks.add(item.link);
    }
  });

  return matches;
};

// Helper to access search index (we'll need to expose this from searchService)
let searchIndex: RssItem[] = [];

export const updateWatchlistSearchIndex = (items: RssItem[]) => {
  searchIndex = items;
};

const getSearchIndex = (): RssItem[] => {
  return searchIndex;
};