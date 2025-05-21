
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/components/Dashboard";
import SearchBar from "@/components/SearchBar";

// Create a client
const queryClient = new QueryClient();

const Index = () => {
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
              <SearchBar />
            </div>
          </div>
        </header>
        
        <main className="container mx-auto py-6 px-4">
          <Dashboard />
        </main>
        
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
