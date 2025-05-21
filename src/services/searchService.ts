
import { RssItem, SearchResult } from "@/types";

// In-memory search index since we don't have a real Algolia account setup
let searchIndex: RssItem[] = [];

// Add items to the search index
export const addToSearchIndex = (items: RssItem[]) => {
  // Avoid duplicates by checking link
  const newItems = items.filter(item => 
    !searchIndex.some(existing => existing.link === item.link)
  );
  
  searchIndex = [...searchIndex, ...newItems];
};

// Simple search function to filter items
export const searchItems = (query: string): SearchResult[] => {
  if (!query?.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return searchIndex
    .filter(item => 
      item.title?.toLowerCase().includes(lowerQuery) || 
      item.contentSnippet?.toLowerCase().includes(lowerQuery)
    )
    .map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      source: item.source || 'Unknown'
    }));
};
