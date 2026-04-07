import { useQuery } from "@tanstack/react-query";
import { RssFeed, RssItem } from "@/types";
import { toast } from "@/components/ui/sonner";
import { validateFeedUrl, sanitizeText, isUrlSafe } from "@/utils/security";
import { supabase } from "@/integrations/supabase/client";

// Fetch and parse RSS feed via server-side edge function
export const fetchRssFeed = async (feedUrl: string): Promise<RssItem[]> => {
  console.log(`Fetching RSS feed via edge function: ${feedUrl}`);
  
  const { data, error } = await supabase.functions.invoke('fetch-rss', {
    body: { url: feedUrl },
  });

  if (error) {
    throw new Error(`Edge function error: ${error.message}`);
  }

  if (data.error) {
    throw new Error(data.error);
  }

  const xmlContent = data.content;
  if (!xmlContent) {
    throw new Error("Empty response from edge function");
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  if (xmlDoc.querySelector("parsererror")) {
    throw new Error("Failed to parse XML content");
  }

  const items = Array.from(xmlDoc.querySelectorAll("item")).map(item => {
    const rawTitle = item.querySelector("title")?.textContent || "";
    const rawLink = item.querySelector("link")?.textContent || "";
    const rawPubDate = item.querySelector("pubDate")?.textContent || "";
    const rawCreator = item.querySelector("dc\\:creator")?.textContent || 
                      item.querySelector("creator")?.textContent || "";
    const rawContentSnippet = item.querySelector("description")?.textContent || "";
    
    const title = sanitizeText(rawTitle);
    const link = rawLink.trim();
    const pubDate = rawPubDate.trim();
    const creator = sanitizeText(rawCreator);
    const contentSnippet = sanitizeText(rawContentSnippet);
    
    const isLinkSafe = isUrlSafe(link);
    
    return {
      title,
      link: isLinkSafe ? link : "#",
      pubDate,
      creator,
      contentSnippet,
      source: new URL(feedUrl).hostname,
      isLinkSafe
    };
  });
  
  console.log(`Successfully fetched ${items.length} items from ${feedUrl}`);
  return items;
};

// React Query hook to fetch RSS feeds
export const useFeed = (feedUrl: string, title: string, description?: string): RssFeed => {
  const urlValidation = validateFeedUrl(feedUrl);
  if (!urlValidation.isValid) {
    console.warn(`Invalid feed URL: ${feedUrl}`, urlValidation.error);
  }
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["rssFeed", feedUrl],
    queryFn: () => fetchRssFeed(feedUrl),
    staleTime: 5 * 60 * 1000,
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
    refetch: () => {
      refetch();
    }
  };
};

export const defaultFeeds = [
  {
    title: "Bleeping Computer",
    url: "https://www.bleepingcomputer.com/feed/",
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
