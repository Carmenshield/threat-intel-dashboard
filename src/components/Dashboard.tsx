
import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import FeedWidget from "@/components/FeedWidget";
import { defaultFeeds } from "@/services/rssService";
import "react-grid-layout/css/styles.css";
import { toast } from "@/components/ui/sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FeedConfigDialog from "@/components/FeedConfigDialog";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  className?: string;
}

interface FeedConfig {
  title: string;
  url: string;
  description?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  // Initialize feeds with the default feeds
  const [feeds, setFeeds] = useState<FeedConfig[]>(defaultFeeds);
  
  // Define the initial layout for different screen sizes
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "feed-0", x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 1 },
      { i: "feed-1", x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 1 },
      { i: "feed-2", x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 1 },
      { i: "feed-3", x: 0, y: 2, w: 4, h: 2, minW: 2, minH: 1 },
      { i: "feed-4", x: 4, y: 2, w: 4, h: 2, minW: 2, minH: 1 },
      { i: "feed-5", x: 8, y: 2, w: 4, h: 2, minW: 2, minH: 1 },
    ],
    md: [
      { i: "feed-0", x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
      { i: "feed-1", x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
      { i: "feed-2", x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
      { i: "feed-3", x: 0, y: 2, w: 3, h: 2, minW: 2, minH: 1 },
      { i: "feed-4", x: 3, y: 2, w: 3, h: 2, minW: 2, minH: 1 },
      { i: "feed-5", x: 6, y: 2, w: 3, h: 2, minW: 2, minH: 1 },
    ],
    sm: [
      { i: "feed-0", x: 0, y: 0, w: 6, h: 2, minW: 3, minH: 1 },
      { i: "feed-1", x: 6, y: 0, w: 6, h: 2, minW: 3, minH: 1 },
      { i: "feed-2", x: 0, y: 2, w: 6, h: 2, minW: 3, minH: 1 },
      { i: "feed-3", x: 6, y: 2, w: 6, h: 2, minW: 3, minH: 1 },
      { i: "feed-4", x: 0, y: 4, w: 6, h: 2, minW: 3, minH: 1 },
      { i: "feed-5", x: 6, y: 4, w: 6, h: 2, minW: 3, minH: 1 },
    ],
  });

  // Handle feed configuration changes
  const handleFeedConfigChange = (index: number, config: { feedUrl: string; title: string; description?: string }) => {
    const updatedFeeds = [...feeds];
    updatedFeeds[index] = {
      title: config.title,
      url: config.feedUrl,
      description: config.description,
    };
    setFeeds(updatedFeeds);
    toast.success(`Updated ${config.title} feed configuration`);
  };

  // Handle feed deletion
  const handleDeleteFeed = (index: number) => {
    // Create new arrays without the deleted feed
    const updatedFeeds = [...feeds];
    updatedFeeds.splice(index, 1);
    setFeeds(updatedFeeds);

    // Update layouts by removing the corresponding layout items
    const newLayouts = { ...layouts };
    Object.keys(newLayouts).forEach(breakpoint => {
      newLayouts[breakpoint as keyof typeof layouts] = newLayouts[breakpoint as keyof typeof layouts]
        .filter(item => item.i !== `feed-${index}`)
        .map(item => {
          // Renumber the remaining feeds
          const itemIndex = parseInt(item.i.split('-')[1]);
          if (itemIndex > index) {
            return { ...item, i: `feed-${itemIndex - 1}` };
          }
          return item;
        });
    });
    
    setLayouts(newLayouts);
    toast.success("Feed removed");
  };

  // Handle adding a new feed
  const handleAddFeed = (config: { feedUrl: string; title: string; description?: string }) => {
    const newFeedIndex = feeds.length;
    
    // Add the new feed to the feeds array
    setFeeds([...feeds, {
      title: config.title,
      url: config.feedUrl,
      description: config.description
    }]);
    
    // Add layout items for the new feed
    const updatedLayouts = { ...layouts };
    
    // Default positions for new widgets
    const newLayoutItem = {
      i: `feed-${newFeedIndex}`,
      w: 4,
      h: 2,
      minW: 2,
      minH: 1
    };
    
    // Add the new item to each breakpoint layout with different positions
    updatedLayouts.lg = [...updatedLayouts.lg, { ...newLayoutItem, x: 0, y: Infinity }];
    updatedLayouts.md = [...updatedLayouts.md, { ...newLayoutItem, x: 0, y: Infinity, w: 3 }];
    updatedLayouts.sm = [...updatedLayouts.sm, { ...newLayoutItem, x: 0, y: Infinity, w: 6 }];
    
    setLayouts(updatedLayouts);
    toast.success(`Added new feed: ${config.title}`);
  };

  return (
    <div className={className}>
      <div className="mb-4 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-cyber-highlight hover:bg-cyber-highlight/90">
              <Plus className="mr-1" /> Add New Feed
            </Button>
          </DialogTrigger>
          <FeedConfigDialog 
            feedUrl=""
            title=""
            description=""
            onSave={handleAddFeed}
          />
        </Dialog>
      </div>
      
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 9, sm: 12, xs: 6, xxs: 3 }}
        rowHeight={250}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        draggableHandle=".cursor-move"
      >
        {feeds.map((feed, index) => (
          <div key={`feed-${index}`} className="grid-item">
            <FeedWidget 
              feedUrl={feed.url} 
              title={feed.title} 
              description={feed.description} 
              limit={10}
              onConfigChange={(config) => handleFeedConfigChange(index, config)}
              onDelete={() => handleDeleteFeed(index)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
