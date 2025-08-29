// Security utilities for validating and sanitizing user inputs

/**
 * Validates if a URL is safe to use (no javascript:, data:, or other dangerous protocols)
 */
export const isUrlSafe = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const normalizedUrl = url.trim().toLowerCase();
    
    // Block dangerous protocols
    const dangerousProtocols = [
      'javascript:',
      'data:',
      'vbscript:',
      'file:',
      'about:',
      'chrome:',
      'chrome-extension:',
      'moz-extension:'
    ];
    
    for (const protocol of dangerousProtocols) {
      if (normalizedUrl.startsWith(protocol)) {
        return false;
      }
    }
    
    // Only allow http and https protocols
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates if a feed URL is properly formatted and safe
 */
export const validateFeedUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }
  
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return { isValid: false, error: 'URL cannot be empty' };
  }
  
  // Check for safe URL
  if (!isUrlSafe(trimmedUrl)) {
    return { isValid: false, error: 'URL contains unsafe protocol or format' };
  }
  
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Additional validation for feed URLs
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return { isValid: false, error: 'Invalid hostname in URL' };
    }
    
    // Prevent localhost and private IP ranges in production
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')) {
      return { isValid: false, error: 'Private/local URLs are not allowed' };
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Sanitizes text content by removing HTML tags and dangerous characters
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Creates a safe link with proper security attributes
 */
export const createSafeLink = (url: string, text: string): { href: string; text: string; isSafe: boolean } => {
  const safeText = sanitizeText(text);
  
  if (!isUrlSafe(url)) {
    return {
      href: '#',
      text: safeText,
      isSafe: false
    };
  }
  
  return {
    href: url,
    text: safeText,
    isSafe: true
  };
};