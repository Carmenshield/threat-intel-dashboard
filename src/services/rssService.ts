import { useQuery } from "@tanstack/react-query";
import { RssFeed, RssItem } from "@/types";
import { toast } from "@/components/ui/sonner";
import { validateFeedUrl, sanitizeText, isUrlSafe } from "@/utils/security";

// A proxy API service to avoid CORS issues with RSS feeds
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

// Fetch and parse RSS feed
export const fetchRssFeed = async (feedUrl: string): Promise<RssItem[]> => {
  try {
    console.log(`Fetching RSS feed: ${feedUrl}`);
    const encodedUrl = encodeURIComponent(feedUrl);
    const response = await fetch(`${CORS_PROXY}${encodedUrl}`, {
      headers: {
        'Accept': '*/*',
      },
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    
    if (xmlDoc.querySelector("parsererror")) {
      throw new Error("Failed to parse XML content");
    }
    
    // Parse the XML content
    const items = Array.from(xmlDoc.querySelectorAll("item")).map(item => {
      const rawTitle = item.querySelector("title")?.textContent || "";
      const rawLink = item.querySelector("link")?.textContent || "";
      const rawPubDate = item.querySelector("pubDate")?.textContent || "";
      const rawCreator = item.querySelector("dc\\:creator")?.textContent || 
                        item.querySelector("creator")?.textContent || "";
      const rawContentSnippet = item.querySelector("description")?.textContent || "";
      
      // Sanitize all content
      const title = sanitizeText(rawTitle);
      const link = rawLink.trim();
      const pubDate = rawPubDate.trim();
      const creator = sanitizeText(rawCreator);
      const contentSnippet = sanitizeText(rawContentSnippet);
      
      // Validate link safety - keep unsafe links but mark them
      const isLinkSafe = isUrlSafe(link);
      
      return {
        title,
        link: isLinkSafe ? link : "#", // Replace unsafe links with #
        pubDate,
        creator,
        contentSnippet,
        source: new URL(feedUrl).hostname,
        isLinkSafe // Add flag for UI to handle
      };
    });
    
    return items;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    throw error;
  }
};

// React Query hook to fetch RSS feeds
export const useFeed = (feedUrl: string, title: string, description?: string): RssFeed => {
  // Validate feed URL before making request
  const urlValidation = validateFeedUrl(feedUrl);
  if (!urlValidation.isValid) {
    console.warn(`Invalid feed URL: ${feedUrl}`, urlValidation.error);
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rssFeed", feedUrl],
    queryFn: () => fetchRssFeed(feedUrl),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
    meta: {
      onError: () => {
        toast.error(`Failed to load ${title} feed`, {
          description: "Please try again later",
        });
      }
    },
  });

  return {
    items: data || [],
    feedUrl,
    title,
    description,
    loading: isLoading,
    error: isError,
  };
};

export const defaultFeeds = [
  {
    title: "Bleeping Computer",
    url: "https://feeds.feedburner.com/bleepingcomputer/dokidoneebm",
    description: "Latest cybersecurity news and articles"
  },
  {
    title: "Krebs on Security",
    url: "https://feeds.feedburner.com/krebsonsecurity/2p0rdzgpxcm",
    description: "In-depth security news and investigation"
  },
  {
    title: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    description: "Cybersecurity news and analysis"
  },
  {
    title: "CISA Advisories",
    url: "https://www.cisa.gov/uscert/ncas/current-activity.xml",
    description: "Current activity from US-CERT/CISA"
  },
  {
    title: "Dark Reading",
    url: "https://www.darkreading.com/rss.xml",
    description: "Connecting the cybersecurity community"
  },
  {
    title: "Qualys Threat Protection",
    url: "https://threatprotect.qualys.com/feed/",
    description: "Threat intelligence from Qualys"
  }
];
