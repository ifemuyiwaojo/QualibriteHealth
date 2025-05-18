/**
 * Sanitization utilities to prevent XSS attacks
 * 
 * This module provides functions to safely sanitize strings
 * that might contain malicious content before rendering them.
 */

/**
 * HTML entity mapping for escaping unsafe characters
 */
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

/**
 * Sanitize a string by escaping special HTML characters
 * 
 * @param str String to sanitize
 * @returns Sanitized string safe for rendering
 */
export function sanitizeString(str: string): string {
  if (!str) return '';
  
  return String(str).replace(/[&<>"'`=\/]/g, (s) => htmlEntities[s]);
}

/**
 * Create a safe URL by enforcing allowed protocols
 * 
 * @param url Input URL to sanitize
 * @param defaultProtocol Default protocol to use if none specified
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string, defaultProtocol = 'https'): string {
  if (!url) return '';
  
  // Strip any embedded script content
  const sanitized = sanitizeString(url);
  
  // Allow only specific protocols
  const allowedProtocols = ['https:', 'http:', 'mailto:', 'tel:'];
  
  try {
    // Check if URL has a protocol
    if (!/^([a-z]+:)/i.test(sanitized)) {
      // If no protocol, add the default
      return `${defaultProtocol}://${sanitized}`;
    }
    
    // Parse the URL to check its protocol
    const urlObj = new URL(sanitized);
    
    // Only allow whitelisted protocols
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return '';
    }
    
    return sanitized;
  } catch (e) {
    // If URL parsing fails, return empty string
    return '';
  }
}

/**
 * Sanitize an object by recursively sanitizing all string values
 * 
 * @param obj Object to sanitize
 * @returns New object with sanitized string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj } as Record<string, any>;
  
  // Recursively sanitize all values
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
    } else if (value && typeof value === 'object') {
      result[key] = sanitizeObject(value);
    }
  });
  
  return result as T;
}

/**
 * Create a React-safe inline style object by sanitizing CSS properties
 * 
 * @param styles A style object with CSS properties
 * @returns Sanitized style object
 */
export function sanitizeStyles(styles: Record<string, string>): Record<string, string> {
  if (!styles || typeof styles !== 'object') return {};
  
  const result: Record<string, string> = {};
  const allowedProperties = [
    'color', 'backgroundColor', 'margin', 'padding', 'fontSize',
    'fontWeight', 'textAlign', 'display', 'flexDirection', 'justifyContent',
    'alignItems', 'borderRadius', 'border', 'width', 'height', 'position',
    'top', 'left', 'right', 'bottom', 'overflow', 'textDecoration'
  ];
  
  // Only keep allowed CSS properties
  Object.keys(styles).forEach(key => {
    if (allowedProperties.includes(key)) {
      const value = styles[key];
      
      // Only allow certain CSS values (prevent url(), expression(), etc.)
      if (value && typeof value === 'string' && 
          !/(url|expression|eval|javascript|import|charset)/i.test(value)) {
        result[key] = value;
      }
    }
  });
  
  return result;
}