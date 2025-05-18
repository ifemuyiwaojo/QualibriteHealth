/**
 * CSRF protection utilities for the Qualibrite Health client
 * 
 * This module provides functions to retrieve and include CSRF tokens
 * with API requests to protect against Cross-Site Request Forgery attacks.
 */

/**
 * Get the current CSRF token from the response headers
 * 
 * @returns The CSRF token if available
 */
export function getCsrfToken(): string | null {
  // The token is exposed in a header by the server
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return csrfToken || null;
}

/**
 * Get headers object with CSRF token included
 * 
 * @param additionalHeaders Any additional headers to include
 * @returns Headers object with CSRF token
 */
export function getHeadersWithCsrf(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const csrfToken = getCsrfToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
  
  if (csrfToken) {
    headers['X-CSRF-TOKEN'] = csrfToken;
  }
  
  return headers;
}

/**
 * Update the stored CSRF token from API response headers
 * 
 * @param response The fetch API response object
 */
export function updateCsrfTokenFromResponse(response: Response): void {
  const newToken = response.headers.get('X-CSRF-TOKEN');
  if (newToken) {
    // Update the meta tag with the new token
    let metaTag = document.querySelector('meta[name="csrf-token"]');
    
    if (!metaTag) {
      // Create the meta tag if it doesn't exist
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'csrf-token');
      document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute('content', newToken);
  }
}