// Content Security Policy utilities and recommendations

/**
 * Recommended Content Security Policy for the application
 * This should be implemented on the server side
 */
export const recommendedCSP = {
  "default-src": "'self'",
  "script-src": "'self' 'unsafe-inline' https://cdn.gpteng.co", // Allow the required script
  "style-src": "'self' 'unsafe-inline'", // Needed for Tailwind
  "img-src": "'self' data: https:",
  "connect-src": "'self' https://whateverorigin.org", // For RSS proxy
  "frame-src": "'none'",
  "object-src": "'none'",
  "base-uri": "'self'",
  "form-action": "'self'",
  "upgrade-insecure-requests": "",
};

/**
 * Convert CSP object to header string
 */
export const cspToString = (csp: Record<string, string>): string => {
  return Object.entries(csp)
    .map(([directive, value]) => `${directive} ${value}`)
    .join('; ');
};

/**
 * Security headers that should be set on the server
 */
export const securityHeaders = {
  'Content-Security-Policy': cspToString(recommendedCSP),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

console.log('Recommended Security Headers:', securityHeaders);