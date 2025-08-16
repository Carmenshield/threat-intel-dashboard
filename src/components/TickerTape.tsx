import React from "react";
import { useFeed, defaultFeeds } from "@/services/rssService";
import { isAfter, subHours, parseISO } from "date-fns";

const TickerTape = () => {
  // Fetch data from all feeds
  const feedData = defaultFeeds.map(feed => 
    useFeed(feed.url, feed.title, feed.description)
  );

  // Get all stories from the last 24 hours
  const twentyFourHoursAgo = subHours(new Date(), 24);
  
  const tickerItems = feedData.flatMap(feed => 
    feed.items.filter(item => {
      if (!item.pubDate) return false;
      try {
        // Parse the RSS date (could be various formats)
        const itemDate = new Date(item.pubDate);
        return isAfter(itemDate, twentyFourHoursAgo);
      } catch (error) {
        console.warn("Could not parse date:", item.pubDate);
        return false;
      }
    }).map(item => ({
      title: item.title,
      source: feed.title,
      link: item.link,
      pubDate: item.pubDate
    }))
  );

  if (tickerItems.length === 0) return null;

  return (
    <div className="bg-yellow-400 border-y-2 border-black overflow-hidden relative">
      <div className="flex animate-[scroll_15s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
        {/* Duplicate content for seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="inline-flex items-center px-8 py-2">
            <span className="text-black font-medium text-sm">
              <span className="font-bold text-xs uppercase tracking-wide">
                {item.source}:
              </span>
              {" "}
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {item.title}
              </a>
            </span>
            <span className="mx-4 text-black">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerTape;