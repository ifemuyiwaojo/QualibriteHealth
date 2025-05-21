import { ApiService, ApiProviderType } from './ApiService';

/**
 * Initialize the API service with the specified provider
 * 
 * This function is used to initialize the API service based on environment variables
 * or provided configuration.
 */
export async function initializeApi(
  preferredProvider?: ApiProviderType,
  apiKey?: string,
  baseUrl?: string
): Promise<ApiService> {
  const apiService = ApiService.getInstance();
  
  // If already initialized, just return the instance
  if (apiService.isInitialized()) {
    return apiService;
  }
  
  // Determine provider to use - from parameter, environment, or default to mock
  const provider = preferredProvider || 
    (import.meta.env.VITE_API_PROVIDER as ApiProviderType) || 
    'mock';
  
  // Get API key from parameter or environment
  const apiKeyToUse = apiKey || 
    import.meta.env.VITE_API_KEY || 
    '';
  
  // Get base URL from parameter or environment
  const baseUrlToUse = baseUrl || 
    (provider === 'therapynotes' ? import.meta.env.VITE_THERAPYNOTES_API_URL : '') ||
    '';
  
  try {
    await apiService.initialize({
      provider,
      apiKey: apiKeyToUse,
      baseUrl: baseUrlToUse
    });
    
    console.log(`API initialized with ${provider} provider`);
    return apiService;
  } catch (error) {
    console.error(`Failed to initialize ${provider} API:`, error);
    
    // If preferred provider fails, fall back to mock
    if (provider !== 'mock') {
      console.log('Falling back to mock API');
      return initializeApi('mock');
    }
    
    throw error;
  }
}