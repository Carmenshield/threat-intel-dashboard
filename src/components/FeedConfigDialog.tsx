
import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { validateFeedUrl, sanitizeText } from "@/utils/security";

interface FeedConfigProps {
  feedUrl: string;
  title: string;
  description?: string;
  onSave: (config: { feedUrl: string; title: string; description?: string }) => void;
}

const FeedConfigDialog: React.FC<FeedConfigProps> = ({
  feedUrl,
  title,
  description,
  onSave,
}) => {
  const [newFeedUrl, setNewFeedUrl] = useState(feedUrl);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description || "");
  
  const isNewFeed = feedUrl === "" && title === "";

  const handleSave = () => {
    const trimmedUrl = newFeedUrl.trim();
    const trimmedTitle = newTitle.trim();
    const trimmedDescription = newDescription.trim();
    
    if (!trimmedUrl || !trimmedTitle) {
      toast.error("Feed URL and title are required");
      return;
    }

    // Validate feed URL with security checks
    const urlValidation = validateFeedUrl(trimmedUrl);
    if (!urlValidation.isValid) {
      toast.error(urlValidation.error || "Invalid feed URL");
      return;
    }

    // Sanitize text inputs
    const safeTitle = sanitizeText(trimmedTitle);
    const safeDescription = sanitizeText(trimmedDescription);
    
    if (!safeTitle) {
      toast.error("Title contains invalid characters");
      return;
    }

    onSave({
      feedUrl: trimmedUrl,
      title: safeTitle,
      description: safeDescription || undefined,
    });

    toast.success(isNewFeed ? "New feed added" : "Feed configuration updated");
  };

  return (
    <DialogContent className="sm:max-w-md bg-cyber-card text-white border-cyber-accent/30">
      <DialogHeader>
        <DialogTitle className="text-cyber-highlight">
          {isNewFeed ? "Add New RSS Feed" : "Configure RSS Feed"}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="feed-title">Feed Title</Label>
          <Input
            id="feed-title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter feed title"
            className="bg-cyber-background border-cyber-accent/30 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="feed-url">Feed URL</Label>
          <Input
            id="feed-url"
            value={newFeedUrl}
            onChange={(e) => setNewFeedUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="bg-cyber-background border-cyber-accent/30 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="feed-description">Description (optional)</Label>
          <Input
            id="feed-description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Brief description of this feed"
            className="bg-cyber-background border-cyber-accent/30 text-white"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" onClick={handleSave} className="bg-cyber-highlight hover:bg-cyber-highlight/90">
          {isNewFeed ? "Add Feed" : "Save Changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default FeedConfigDialog;
