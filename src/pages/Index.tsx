
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/components/Dashboard";
import SearchBar from "@/components/SearchBar";
import TickerTape from "@/components/TickerTape";
import Watchlist from "@/components/Watchlist";

// Create a client
const queryClient = new QueryClient();

const Index = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const handleWatchlistKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
  };
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-cyber-background text-white">
        <header className="py-4 px-6 border-b border-gray-800 bg-cyber-card">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-cyber-highlight">
                  Cyber Threat Intelligence Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  Latest news and updates from cybersecurity sources
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
              />
            </div>
          </div>
        </header>
        
        <TickerTape />
        
        <main className="container mx-auto py-6 px-4">
          <Dashboard />
        </main>
        
        <div className="container mx-auto px-4 pb-6">
          <Watchlist onKeywordClick={handleWatchlistKeywordClick} />
        </div>
        
        <footer className="py-4 px-6 border-t border-gray-800 bg-cyber-card">
          <div className="container mx-auto text-center text-sm text-gray-500">
            <p>
              Cyber Threat Intelligence Dashboard © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
