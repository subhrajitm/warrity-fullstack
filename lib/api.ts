import { toast } from "sonner";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5001/uploads';

// Add request timeout and retry configuration
const DEFAULT_TIMEOUT = 8000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Types
interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
}

interface ProductData {
  id?: string; // Optional for creation, required when returned from API
  name: string;
  category: string;
  model?: string;
  manufacturer?: string;
  serialNumber: string;
  purchaseDate?: string;
  price?: string;
  purchaseLocation?: string;
  receiptNumber?: string;
  description?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  bio?: string;
  profilePicture?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    reminderDays: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Import shared types
import type { Warranty, WarrantyInput } from '@/types/warranty';



interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'warranty_expiry' | 'maintenance' | 'reminder';
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalProducts: number;
  activeWarranties: number;
  expiringWarranties: number;
  expiredWarranties: number;
  upcomingEvents: number;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

// Cache configuration
interface CacheConfig {
  ttl: number;  // Time to live in milliseconds
  maxSize: number;  // Maximum number of items in cache
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class RequestCache {
  public cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
    this.startCleanupInterval();
  }

  private startCleanupInterval() {
    setInterval(() => {
      this.cleanup();
    }, this.config.ttl);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  set<T>(key: string, data: T) {
    // Remove oldest item if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const iterator = this.cache.keys();
      const firstKey = iterator.next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if item is expired
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

// Create cache instance
const requestCache = new RequestCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100
});

// Add request timeout utility
async function fetchWithTimeout(
  resource: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const status = response.status;
  
  if (status >= 200 && status < 300) {
    const data = await response.json();
    return { data, error: null };
  } else {
    let error = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      error = errorData.message || error;
      
      // Show error toast for non-successful responses
      toast.error(error);
      
      // Handle specific status codes
      if (status === 401) {
        // Clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
      }
    } catch (e) {
      // If the response is not JSON, use the status text
      error = response.statusText || error;
      toast.error(error);
    }
    return { data: null, error };
  }
}

// Function to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

// Add request retry utility
async function fetchWithRetry(
  url: string,
  options: RequestInit & { timeout?: number } = {},
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetchWithTimeout(url, options);
    if (!response.ok && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError' && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Request cancellation and queue management
const pendingRequests = new Map<string, AbortController>();

function createRequestKey(endpoint: string, method: string): string {
  return `${method}:${endpoint}`;
}

function cancelPendingRequest(endpoint: string, method: string): void {
  const key = createRequestKey(endpoint, method);
  const controller = pendingRequests.get(key);
  if (controller) {
    controller.abort();
    pendingRequests.delete(key);
  }
}

// Update API request function with cancellation and caching support
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  customHeaders?: Record<string, string>,
  options: {
    cancelPrevious?: boolean;
    timeout?: number;
    retries?: number;
    cache?: boolean;
    forceFresh?: boolean;
  } = {}
): Promise<ApiResponse<T>> {
  const { 
    cancelPrevious = true, 
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    cache = method === 'GET',  // Only cache GET requests by default
    forceFresh = false
  } = options;

  // Generate cache key
  const cacheKey = `${method}:${endpoint}:${JSON.stringify(data || '')}`;

  // Check cache if enabled and not forcing fresh data
  if (cache && !forceFresh) {
    const cachedData = requestCache.get<ApiResponse<T>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    // Cancel previous request if needed
    if (cancelPrevious) {
      cancelPendingRequest(endpoint, method);
    }

    const controller = new AbortController();
    const key = createRequestKey(endpoint, method);
    pendingRequests.set(key, controller);

    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit & { timeout?: number } = {
      method,
      headers,
      credentials: 'include',
      mode: 'cors',
      signal: controller.signal,
      timeout
    };

    if (data && method !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, fetchOptions, retries);
    pendingRequests.delete(key);
    const result = await handleResponse<T>(response);

    // Cache successful responses if caching is enabled
    if (cache && result.data && !result.error) {
      requestCache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    const key = createRequestKey(endpoint, method);
    pendingRequests.delete(key);
    console.error('API request failed:', error);
    return handleApiError(error);
  }
}

// Add request queue utility
const requestQueue = new Map<string, Promise<any>>();

async function queuedRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  customHeaders?: Record<string, string>,
  options: {
    timeout?: number;
    retries?: number;
  } = {}
): Promise<ApiResponse<T>> {
  const key = createRequestKey(endpoint, method);
  
  // If there's already a request in progress, wait for it
  if (requestQueue.has(key)) {
    return requestQueue.get(key) as Promise<ApiResponse<T>>;
  }

  // Create new request and add to queue
  const request = apiRequest<T>(endpoint, method, data, customHeaders, {
    cancelPrevious: false,
    ...options
  });
  requestQueue.set(key, request);

  try {
    const response = await request;
    requestQueue.delete(key);
    return response;
  } catch (error) {
    requestQueue.delete(key);
    throw error;
  }
}

// Add request debounce utility
function debounce<T>(
  fn: (...args: any[]) => Promise<T>,
  wait: number
): (...args: any[]) => Promise<T> {
  let timeout: NodeJS.Timeout;
  let pendingPromise: Promise<T> | null = null;

  return (...args: any[]): Promise<T> => {
    if (pendingPromise) {
      return pendingPromise;
    }

    pendingPromise = new Promise((resolve, reject) => {
      const later = () => {
        timeout = undefined!;
        pendingPromise = null;
        fn(...args)
          .then(resolve)
          .catch(reject);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    });

    return pendingPromise;
  };
}

// Auth API
export const authApi = {
  register: (userData: { email: string; password: string; name: string }) => 
    apiRequest<{ user: User; token: string }>('/auth/register', 'POST', userData),
  login: (credentials: { email: string; password: string }) => 
    apiRequest<{ user: User; token: string }>('/auth/login', 'POST', credentials),
  logout: () => apiRequest('/auth/logout', 'POST'),
  getCurrentUser: () => apiRequest<{ user: User }>('/auth/me', 'GET'),
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => 
    apiRequest('/auth/change-password', 'POST', passwordData),
  refreshToken: () => apiRequest<{ token: string }>('/auth/refresh', 'POST'),
};

// User API
export const userApi = {
  getProfile: () => apiRequest<{ user: User }>('/users/profile', 'GET'),
  updateProfile: (profileData: Partial<User>) => 
    apiRequest<{ user: User; message: string }>('/users/profile', 'PUT', profileData),
  uploadProfilePicture: (file: File) => 
    uploadFile<{ url: string; message: string }>('/users/profile/picture', file, 'profilePicture'),
  getAllUsers: () => apiRequest<{ users: User[] }>('/users', 'GET'),
  getUserById: (id: string) => apiRequest<{ user: User }>(`/users/${id}`, 'GET'),
  updateUser: (id: string, userData: Partial<User>) => 
    apiRequest<{ user: User; message: string }>(`/users/${id}`, 'PUT', userData),
  deleteUser: (id: string) => apiRequest(`/users/${id}`, 'DELETE'),
  updatePreferences: (preferences: User['preferences']) =>
    apiRequest<{ user: User; message: string }>('/users/preferences', 'PUT', { preferences }),
  updateSocialLinks: (socialLinks: User['socialLinks']) =>
    apiRequest<{ user: User; message: string }>('/users/social-links', 'PUT', { socialLinks }),
};

// Warranty API
export const warrantyApi = {
  getAllWarranties: () => apiRequest<{ warranties: Warranty[] }>('/warranties', 'GET'),
  getWarrantyById: (id: string) => apiRequest<{ warranty: Warranty }>(`/warranties/${id}`, 'GET'),
  createWarranty: (warrantyData: WarrantyInput) => 
    apiRequest<{ warranty: Warranty }>('/warranties', 'POST', warrantyData),
  updateWarranty: (id: string, warrantyData: Partial<Warranty>) => 
    apiRequest<{ warranty: Warranty }>(`/warranties/${id}`, 'PUT', warrantyData),
  deleteWarranty: (id: string) => apiRequest(`/warranties/${id}`, 'DELETE'),
  getExpiringWarranties: () => apiRequest<{ warranties: Warranty[] }>('/warranties/expiring', 'GET'),
  uploadWarrantyDocument: (warrantyId: string, file: File) => 
    uploadFile<{ url: string }>(`/warranties/${warrantyId}/documents`, file, 'document'),
  deleteWarrantyDocument: (warrantyId: string, documentId: string) => 
    apiRequest(`/warranties/${warrantyId}/documents/${documentId}`, 'DELETE'),
  getWarrantyStats: () => apiRequest<{ stats: DashboardStats }>('/warranties/stats/overview', 'GET'),
};

// Product API
export const productApi = {
  getAllProducts: () => apiRequest<{ products: any[] }>('/products', 'GET'),
  getProductById: (id: string) => apiRequest<{ product: any }>(`/products/${id}`, 'GET'),
  createProduct: (productData: ProductData) => apiRequest<{ product: any }>('/products', 'POST', productData),
  updateProduct: (id: string, productData: Partial<ProductData>) => 
    apiRequest<{ product: any }>(`/products/${id}`, 'PUT', productData),
  deleteProduct: (id: string) => apiRequest(`/products/${id}`, 'DELETE'),
  getProductCategories: () => apiRequest<{ categories: string[] }>('/products/categories', 'GET'),
  uploadProductImage: (productId: string, file: File) => 
    uploadFile<{ url: string }>(`/products/${productId}/image`, file, 'image'),
  getProducts: (filters?: Record<string, string>) => {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiRequest<ProductData[]>(`/products${queryString}`, 'GET');
  },
  getProduct: (productId: string) => apiRequest<ProductData>(`/products/${productId}`, 'GET'),
  searchProducts: debounce(async (query: string) => {
    return apiRequest<ProductData[]>(`/products/search?q=${encodeURIComponent(query)}`, 'GET');
  }, 300),
  generateProductReport: (productId: string) => 
    queuedRequest<{ reportUrl: string }>(
      `/products/${productId}/report`,
      'POST',
      undefined,
      undefined,
      { timeout: 30000 } // Longer timeout for report generation
    ),
  getProductWithCache: (productId: string, forceFresh = false) => 
    apiRequest<ProductData>(
      `/products/${productId}`,
      'GET',
      undefined,
      undefined,
      { cache: true, forceFresh }
    ),
  getCategoriesWithCache: (forceFresh = false) => 
    apiRequest<{ categories: string[] }>(
      '/products/categories',
      'GET',
      undefined,
      undefined,
      { cache: true, forceFresh }
    ),
  clearProductCache: () => {
    const productCachePattern = /^GET:\/products/;
    for (const [key] of requestCache.cache.entries()) {
      if (productCachePattern.test(key)) {
        requestCache.delete(key);
      }
    }
  }
};

// Calendar Events API
export const eventApi = {
  getAllEvents: () => apiRequest<{ events: Event[] }>('/events', 'GET'),
  getEventById: (id: string) => apiRequest<{ event: Event }>(`/events/${id}`, 'GET'),
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiRequest<{ event: Event }>('/events', 'POST', eventData),
  updateEvent: (id: string, eventData: Partial<Event>) => 
    apiRequest<{ event: Event }>(`/events/${id}`, 'PUT', eventData),
  deleteEvent: (id: string) => apiRequest(`/events/${id}`, 'DELETE'),
  getEventsByMonth: (year: number, month: number) => 
    apiRequest<{ events: Event[] }>(`/events/month/${year}/${month}`, 'GET'),
  getEventsByDate: (date: string) => 
    apiRequest<{ events: Event[] }>(`/events/date/${date}`, 'GET'),
};

// Admin API
export const adminApi = {
  getDashboardStats: () => apiRequest<{ stats: DashboardStats }>('/admin/dashboard/stats', 'GET'),
  getAllUsers: () => apiRequest<{ users: User[] }>('/admin/users', 'GET'),
  updateUserRole: (id: string, role: User['role']) => 
    apiRequest<{ user: User }>(`/admin/users/${id}/role`, 'PUT', { role }),
  deleteUser: (id: string) => apiRequest(`/admin/users/${id}`, 'DELETE'),
  getAllWarranties: () => apiRequest<{ warranties: Warranty[] }>('/admin/warranties', 'GET'),
  getUserActivity: () => apiRequest<{ activities: UserActivity[] }>('/admin/activity', 'GET'),
  getStats: () => apiRequest<{ stats: DashboardStats }>('/admin/stats', 'GET'),
  getAllProducts: () => apiRequest<{ products: ProductData[] }>('/admin/products', 'GET'),
  getAllEvents: () => apiRequest<{ events: Event[] }>('/admin/events', 'GET'),
};

// Health API
export const healthApi = {
  getHealthStatus: () => apiRequest<{ status: string; uptime: number }>('/health', 'GET'),
  getDeepHealthStatus: () => apiRequest<{ status: string; services: any }>('/health/deep', 'GET'),
};

// Error handling utility
export function handleApiError(error: unknown): ApiResponse {
  console.error('API Error:', error);
  
  let errorMessage: string;
  
  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    errorMessage = 'Network error. Please check your connection.';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
  
  // Handle timeout errors
  if (error instanceof Error && error.name === 'AbortError') {
    errorMessage = 'Request timed out. Please try again.';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
  
  // Handle authentication errors
  if (error instanceof Error && 'status' in error && (error as any).status === 401) {
    errorMessage = 'Your session has expired. Please log in again.';
    toast.error(errorMessage);
    // Clear token and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return { data: null, error: errorMessage };
  }

  // Handle forbidden errors
  if (error instanceof Error && 'status' in error && (error as any).status === 403) {
    errorMessage = 'You do not have permission to perform this action.';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
  
  // Handle other errors
  errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  toast.error(errorMessage);
  return { data: null, error: errorMessage };
}

// Update file upload function with cancellation support
async function uploadFile<T>(
  endpoint: string,
  file: File,
  fieldName: string = 'file',
  additionalData?: Record<string, string>,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const xhr = new XMLHttpRequest();
    
    // Handle upload progress
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };
    }

    // Handle cancellation
    if (signal) {
      signal.addEventListener('abort', () => xhr.abort());
    }

    return new Promise((resolve, reject) => {
      xhr.open('POST', `${UPLOAD_BASE_URL}${endpoint}`);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.response);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ data: response, error: null });
          } else {
            const errorMessage = response.message || response.error || xhr.statusText || 'Upload failed';
            toast.error(errorMessage);
            resolve({ data: null, error: errorMessage });
          }
        } catch (parseError) {
          // Handle non-JSON responses
          const errorMessage = xhr.status === 404 
            ? `Upload endpoint not found: ${endpoint}`
            : `Upload failed: ${xhr.statusText || 'Unknown error'}`;
          toast.error(errorMessage);
          resolve({ data: null, error: errorMessage });
        }
      };

      xhr.onerror = () => {
        const errorMessage = 'Network error during upload';
        toast.error(errorMessage);
        resolve({ data: null, error: errorMessage });
      };

      xhr.ontimeout = () => {
        const errorMessage = 'Upload request timed out';
        toast.error(errorMessage);
        resolve({ data: null, error: errorMessage });
      };

      xhr.onabort = () => {
        const errorMessage = 'Upload was cancelled';
        toast.error(errorMessage);
        resolve({ data: null, error: errorMessage });
      };

      xhr.send(formData);
    });
  } catch (error) {
    console.error('File upload failed:', error);
    return handleApiError(error);
  }
}

export default {
  auth: authApi,
  user: userApi,
  warranty: warrantyApi,
  product: productApi,
  event: eventApi,
  admin: adminApi,
  health: healthApi,
  handleApiError,
}; 