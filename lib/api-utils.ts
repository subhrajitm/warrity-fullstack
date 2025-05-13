// API Response Types
import { API_BASE_URL, DEBUG_API } from './api-config';

export interface ApiResponse<T> {
  data?: T;
  events?: T;
  products?: T;
  error?: string;
  message?: string;
}

// API Configuration
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  debug: DEBUG_API
};

// Error handling utility
export const handleApiError = async (response: Response): Promise<string> => {
  const clonedResponse = response.clone();
  try {
    const contentType = response.headers.get('content-type');
    const responseText = await clonedResponse.text();
    
    // Handle HTML responses which often indicate routing/server errors
    if (contentType && contentType.includes('text/html')) {
      if (responseText.includes('404')) {
        return 'API endpoint not found. Please check that the API server is running.';
      }
      return 'Received HTML response instead of JSON. API server may be misconfigured.';
    }
    
    if (responseText) {
      try {
        const errorData = JSON.parse(responseText);
        return errorData.message || errorData.error || 'Operation failed';
      } catch {
        // If we can't parse as JSON, return the text (truncated if too large)
        return responseText.length > 150 
          ? `${responseText.substring(0, 150)}...` 
          : responseText;
      }
    }
    return response.statusText || 'Operation failed';
  } catch {
    return response.statusText || 'Operation failed';
  }
};

// Fetch with retry logic
export const fetchWithRetry = async (
  url: string, 
  options: RequestInit, 
  retries = 3
): Promise<Response> => {
  if (apiConfig.debug) {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('Request body:', options.body);
    }
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (apiConfig.debug) {
        console.log(`API Response status: ${response.status} ${response.statusText}`);
      }
      
      if (response.ok) return response;
      
      // Handle 401 unauthorized
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      
      // For other errors, try to get error message
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    } catch (error) {
      if (apiConfig.debug) {
        console.error('API Request failed:', error);
      }
      
      if (i === retries - 1) throw error;
      // Exponential backoff
      const backoffTime = 1000 * Math.pow(2, i);
      if (apiConfig.debug) {
        console.log(`Retrying in ${backoffTime}ms... (Attempt ${i + 1}/${retries})`);
      }
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  throw new Error('Max retries reached');
};

// Fetch with cache
export class ApiCache {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async fetchWithCache<T>(
    url: string, 
    options: RequestInit
  ): Promise<T> {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const response = await fetchWithRetry(url, options);
    const data = await response.json();
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  static clearCache() {
    this.cache.clear();
  }

  static removeFromCache(url: string) {
    for (const [key] of this.cache) {
      if (key.startsWith(url)) {
        this.cache.delete(key);
      }
    }
  }
}

// API request builder
export const createApiRequest = (
  endpoint: string,
  method: string = 'GET',
  body?: any
): RequestInit => {
  const token = localStorage.getItem('authToken');
  
  return {
    method,
    headers: {
      ...apiConfig.headers,
      'Authorization': token ? `Bearer ${token}` : '',
    },
    ...(body && { body: JSON.stringify(body) }),
  };
};

// API endpoints
export const apiEndpoints = {
  events: {
    list: `${apiConfig.baseUrl}/events`,
    detail: (id: string) => `${apiConfig.baseUrl}/events/${id}`,
  },
  products: {
    list: `${apiConfig.baseUrl}/products`,
  },
}; 