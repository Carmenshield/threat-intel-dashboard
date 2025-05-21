
import React, { useEffect } from "react";
import { FeedWidgetProps, RssItem } from "@/types";
import { useFeed } from "@/services/rssService";
import { addToSearchIndex } from "@/services/searchService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonNews from "@/components/SkeletonNews";
import { ExternalLink, AlertCircle } from "lucide-react";

export const FeedWidget: React.FC<FeedWidgetProps> = ({
  feedUrl,
  title,
  description,
  limit = 10,
}) => {
  const feed = useFeed(feedUrl, title, description);
  
  // Add fetched items to search index
  useEffect(() => {
    if (feed.items && feed.items.length > 0) {
      addToSearchIndex(feed.items);
    }
  }, [feed.items]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col bg-cyber-card border-cyber-accent/30">
      <CardHeader className="pb-2 bg-cyber-card">
        <CardTitle className="text-lg text-cyber-highlight flex justify-between items-center">
          {title}
          {description && (
            <span className="text-xs text-gray-400 truncate ml-2 flex-1">
              {description}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-1 px-3 py-2">
        {feed.loading ? (
          <SkeletonNews count={limit} />
        ) : feed.error ? (
          <div className="text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Failed to load feed
          </div>
        ) : feed.items.length === 0 ? (
          <div className="text-gray-500">No items available</div>
        ) : (
          <div className="space-y-3">
            {feed.items.slice(0, limit).map((item, idx) => (
              <div key={idx} className="pb-2 border-b border-gray-700 last:border-0">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <h3 className="font-medium text-sm text-white group-hover:text-cyber-highlight">
                    {item.title}
                    <ExternalLink className="inline-block ml-1 w-3 h-3" />
                  </h3>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-gray-400">{formatDate(item.pubDate)}</span>
                    {item.creator && (
                      <span className="text-gray-500 truncate ml-2">{item.creator}</span>
                    )}
                  </div>
                  {item.contentSnippet && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {item.contentSnippet.replace(/<[^>]*>?/gm, "")}
                    </p>
                  )}
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedWidget;
