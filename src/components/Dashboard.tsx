
import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import FeedWidget from "@/components/FeedWidget";
import { defaultFeeds } from "@/services/rssService";
import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  className?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  // Define the initial layout for different screen sizes
  const [layouts] = useState({
    lg: [
      { i: "feed-0", x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 1 },
      { i: "feed-1", x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 1 },
      { i: "feed-2", x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 1 },
      { i: "feed-3", x: 0, y: 2, w: 6, h: 2, minW: 2, minH: 1 },
      { i: "feed-4", x: 6, y: 2, w: 6, h: 2, minW: 2, minH: 1 },
    ],
    md: [
      { i: "feed-0", x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
      { i: "feed-1", x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
      { i: "feed-2", x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
      { i: "feed-3", x: 0, y: 2, w: 6, h: 2, minW: 2, minH: 1 },
      { i: "feed-4", x: 6, y: 2, w: 3, h: 2, minW: 2, minH: 1 },
    ],
    sm: [
      { i: "feed-0", x: 0, y: 0, w: 6, h: 2, minW: 3, minH: 1 },
      { i: "feed-1", x: 6, y: 0, w: 6, h: 2, minW: 3, minH: 1 },
      { i: "feed-2", x: 0, y: 2, w: 12, h: 2, minW: 3, minH: 1 },
      { i: "feed-3", x: 0, y: 4, w: 12, h: 2, minW: 3, minH: 1 },
      { i: "feed-4", x: 0, y: 6, w: 12, h: 2, minW: 3, minH: 1 },
    ],
  });

  return (
    <div className={className}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 9, sm: 12, xs: 6, xxs: 3 }}
        rowHeight={250}
        isDraggable
        isResizable
        margin={[16, 16]}
        containerPadding={[0, 0]}
      >
        {defaultFeeds.map((feed, index) => (
          <div key={`feed-${index}`} className="grid-item">
            <FeedWidget 
              feedUrl={feed.url} 
              title={feed.title} 
              description={feed.description} 
              limit={10} 
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
