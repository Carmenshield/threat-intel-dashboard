import React from "react";
import { useFeed, defaultFeeds } from "@/services/rssService";
import { isAfter, subHours } from "date-fns";
import { createSafeLink, sanitizeText } from "@/utils/security";
import { getAllWatchlistMatches } from "@/services/watchlistService";

const TickerTape = () => {
  // Fetch data from all feeds
  const feedData = defaultFeeds.map(feed => 
    useFeed(feed.url, feed.title, feed.description)
  );

  // Check if any feeds are still loading
  const isAnyFeedLoading = feedData.some(feed => feed.loading);
  
  // Don't render until all feeds have finished loading
  if (isAnyFeedLoading) return null;

  // Get all stories from all feeds published in the last 24 hours
  const twentyFourHoursAgo = subHours(new Date(), 24);
  
  const recentFeedItems = feedData
    .filter(feed => !feed.error && feed.items.length > 0)
    .flatMap(feed => 
      feed.items
        .filter(item => {
          if (!item.pubDate) return false;
          try {
            const itemDate = new Date(item.pubDate);
            return isAfter(itemDate, twentyFourHoursAgo);
          } catch (error) {
            console.warn("Could not parse date:", item.pubDate);
            return false;
          }
        })
        .map(item => ({
          title: item.title,
          source: feed.title,
          link: item.link,
          pubDate: item.pubDate
        }))
    );

  // Get watchlist matches (all time, not just last 24 hours)
  const watchlistMatches = getAllWatchlistMatches().map(item => ({
    title: item.title,
    source: `${item.source} (Watchlist)`,
    link: item.link,
    pubDate: item.pubDate
  }));

  // Combine recent feed items with watchlist matches, removing duplicates
  const allItems = [...recentFeedItems, ...watchlistMatches];
  const uniqueItems = allItems.filter((item, index, arr) => 
    arr.findIndex(other => other.link === item.link) === index
  );

  const tickerItems = uniqueItems;

  if (tickerItems.length === 0) return null;

  return (
    <div className="bg-yellow-400 border-y-2 border-black overflow-hidden relative">
      <div className="flex animate-[scroll_60s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
        {/* Duplicate content for seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, index) => {
          const safeLink = createSafeLink(item.link, item.title);
          const safeTitle = sanitizeText(item.title);
          const safeSource = sanitizeText(item.source);
          
          return (
            <div key={index} className="inline-flex items-center px-8 py-2">
              <span className="text-black font-medium text-sm">
                <span className="font-bold text-xs uppercase tracking-wide">
                  {safeSource}:
                </span>
                {" "}
                {safeLink.isSafe ? (
                  <a 
                    href={safeLink.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {safeTitle}
                  </a>
                ) : (
                  <span className="text-red-600">
                    {safeTitle} (Link Blocked)
                  </span>
                )}
              </span>
              <span className="mx-4 text-black">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TickerTape;