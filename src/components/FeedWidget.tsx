
import React, { useEffect } from "react";
import { FeedWidgetProps, RssItem } from "@/types";
import { useFeed } from "@/services/rssService";
import { addToSearchIndex } from "@/services/searchService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonNews from "@/components/SkeletonNews";
import { ExternalLink, AlertCircle, Settings, Trash, Shield, GripVertical, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FeedConfigDialog from "@/components/FeedConfigDialog";
import { createSafeLink, sanitizeText } from "@/utils/security";

export const FeedWidget: React.FC<FeedWidgetProps> = ({
  feedUrl,
  title,
  description,
  limit = 10,
  onConfigChange,
  onDelete,
  onLoadingChange,
}) => {
  const feed = useFeed(feedUrl, title, description);
  
  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(feed.loading);
  }, [feed.loading, onLoadingChange]);
  
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
          <div className="flex-1 flex items-center">
            <div className="cursor-move mr-2 p-1 rounded hover:bg-gray-700 transition-colors" title="Drag to reorder">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            {title}
            {description && (
              <span className="text-xs text-gray-400 truncate ml-2 flex-1">
                {description}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-1 rounded-md hover:bg-gray-700 transition-colors" title="Configure feed">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </DialogTrigger>
              <FeedConfigDialog 
                feedUrl={feedUrl} 
                title={title} 
                description={description}
                onSave={onConfigChange}
              />
            </Dialog>
            
            {onDelete && (
              <button 
                onClick={onDelete}
                className="p-1 rounded-md hover:bg-gray-700 hover:text-red-400 transition-colors"
                title="Delete feed"
              >
                <Trash className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-1 px-3 py-2">
        {feed.loading ? (
          <SkeletonNews count={limit} />
        ) : feed.error ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Failed to load feed
            </div>
            <button
              onClick={() => feed.refetch?.()}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-accent/20 hover:bg-cyber-accent/30 text-cyber-highlight rounded-md transition-colors"
              title="Retry loading feed"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : feed.items.length === 0 ? (
          <div className="text-gray-500">No items available</div>
        ) : (
          <div className="space-y-3">
            {feed.items.slice(0, limit).map((item, idx) => {
              const safeLink = createSafeLink(item.link, item.title);
              const safeTitle = sanitizeText(item.title);
              const safeCreator = sanitizeText(item.creator || '');
              const safeContent = sanitizeText(item.contentSnippet || '');
              
              return (
                <div key={idx} className="pb-2 border-b border-gray-700 last:border-0">
                  {safeLink.isSafe ? (
                    <a
                      href={safeLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <h3 className="font-medium text-sm text-white group-hover:text-cyber-highlight">
                        {safeTitle}
                        <ExternalLink className="inline-block ml-1 w-3 h-3" />
                      </h3>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-gray-400">{formatDate(item.pubDate)}</span>
                        {safeCreator && (
                          <span className="text-gray-500 truncate ml-2">{safeCreator}</span>
                        )}
                      </div>
                      {safeContent && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {safeContent}
                        </p>
                      )}
                    </a>
                  ) : (
                    <div className="group block">
                      <h3 className="font-medium text-sm text-red-400 flex items-center">
                        <Shield className="inline-block mr-1 w-3 h-3" />
                        {safeTitle} (Unsafe Link Blocked)
                      </h3>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-gray-400">{formatDate(item.pubDate)}</span>
                        {safeCreator && (
                          <span className="text-gray-500 truncate ml-2">{safeCreator}</span>
                        )}
                      </div>
                      {safeContent && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {safeContent}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedWidget;
