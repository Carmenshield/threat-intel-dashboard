
export interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  isoDate?: string;
  categories?: string[];
  guid?: string;
  source?: string;
  isLinkSafe?: boolean;
}

export interface RssFeed {
  items: RssItem[];
  feedUrl: string;
  title: string;
  description?: string;
  link?: string;
  loading: boolean;
  error: boolean;
  refetch?: () => void;
}

export interface FeedWidgetProps {
  feedUrl: string;
  title: string;
  description?: string;
  limit?: number;
  onConfigChange?: (config: { feedUrl: string; title: string; description?: string }) => void;
  onDelete?: () => void;
}

export interface SearchResult {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
  source: string;
}
