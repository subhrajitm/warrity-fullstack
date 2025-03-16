import { toast } from "sonner";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const status = response.status;
  
  if (status >= 200 && status < 300) {
    const data = await response.json();
    return { data, status };
  } else {
    let error = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      error = errorData.message || error;
    } catch (e) {
      // If the response is not JSON, use the status text
      error = response.statusText || error;
    }
    return { error, status };
  }
}

// Function to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  customHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: 'include',
      mode: 'cors',
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// File upload function
async function uploadFile<T>(
  endpoint: string,
  file: File,
  fieldName: string = 'file',
  additionalData?: Record<string, string>
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

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error('File upload failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// Auth API
export const authApi = {
  register: (userData: any) => apiRequest<{ user: any; token: string }>('/auth/register', 'POST', userData),
  login: (credentials: { email: string; password: string }) => 
    apiRequest<{ user: any; token: string }>('/auth/login', 'POST', credentials),
  logout: () => apiRequest('/auth/logout', 'POST'),
  getCurrentUser: () => apiRequest<{ user: any }>('/auth/me', 'GET'),
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => 
    apiRequest('/auth/change-password', 'POST', passwordData),
  refreshToken: () => apiRequest<{ token: string }>('/auth/refresh', 'POST'),
};

// User API
export const userApi = {
  getProfile: () => apiRequest<{ user: any }>('/users/profile', 'GET'),
  updateProfile: (profileData: any) => apiRequest<{ user: any }>('/users/profile', 'PUT', profileData),
  uploadProfilePicture: (file: File) => 
    uploadFile<{ url: string }>('/users/profile/picture', file, 'profilePicture'),
  getAllUsers: () => apiRequest<{ users: any[] }>('/users', 'GET'),
  getUserById: (id: string) => apiRequest<{ user: any }>(`/users/${id}`, 'GET'),
  updateUser: (id: string, userData: any) => apiRequest<{ user: any }>(`/users/${id}`, 'PUT', userData),
  deleteUser: (id: string) => apiRequest(`/users/${id}`, 'DELETE'),
};

// Warranty API
export const warrantyApi = {
  getAllWarranties: () => apiRequest<{ warranties: any[] }>('/warranties', 'GET'),
  getWarrantyById: (id: string) => apiRequest<{ warranty: any }>(`/warranties/${id}`, 'GET'),
  createWarranty: (warrantyData: any) => apiRequest<{ warranty: any }>('/warranties', 'POST', warrantyData),
  updateWarranty: (id: string, warrantyData: any) => 
    apiRequest<{ warranty: any }>(`/warranties/${id}`, 'PUT', warrantyData),
  deleteWarranty: (id: string) => apiRequest(`/warranties/${id}`, 'DELETE'),
  getExpiringWarranties: () => apiRequest<{ warranties: any[] }>('/warranties/expiring', 'GET'),
  uploadWarrantyDocument: (warrantyId: string, file: File) => 
    uploadFile<{ url: string }>(`/warranties/${warrantyId}/documents`, file, 'document'),
  deleteWarrantyDocument: (warrantyId: string, documentId: string) => 
    apiRequest(`/warranties/${warrantyId}/documents/${documentId}`, 'DELETE'),
  getWarrantyStats: () => apiRequest<{ stats: any }>('/warranties/stats/overview', 'GET'),
};

// Product API
export const productApi = {
  getAllProducts: () => apiRequest<{ products: any[] }>('/products', 'GET'),
  getProductById: (id: string) => apiRequest<{ product: any }>(`/products/${id}`, 'GET'),
  createProduct: (productData: any) => apiRequest<{ product: any }>('/products', 'POST', productData),
  updateProduct: (id: string, productData: any) => 
    apiRequest<{ product: any }>(`/products/${id}`, 'PUT', productData),
  deleteProduct: (id: string) => apiRequest(`/products/${id}`, 'DELETE'),
  getProductCategories: () => apiRequest<{ categories: string[] }>('/products/categories', 'GET'),
  uploadProductImage: (productId: string, file: File) => 
    uploadFile<{ url: string }>(`/products/${productId}/image`, file, 'image'),
};

// Calendar Events API
export const eventApi = {
  getAllEvents: () => apiRequest<{ events: any[] }>('/events', 'GET'),
  getEventById: (id: string) => apiRequest<{ event: any }>(`/events/${id}`, 'GET'),
  createEvent: (eventData: any) => apiRequest<{ event: any }>('/events', 'POST', eventData),
  updateEvent: (id: string, eventData: any) => 
    apiRequest<{ event: any }>(`/events/${id}`, 'PUT', eventData),
  deleteEvent: (id: string) => apiRequest(`/events/${id}`, 'DELETE'),
  getEventsByMonth: (year: number, month: number) => 
    apiRequest<{ events: any[] }>(`/events/month/${year}/${month}`, 'GET'),
  getEventsByDate: (date: string) => 
    apiRequest<{ events: any[] }>(`/events/date/${date}`, 'GET'),
};

// Admin API
export const adminApi = {
  getDashboardStats: () => apiRequest<{ stats: any }>('/admin/dashboard/stats', 'GET'),
  getAllUsers: () => apiRequest<{ users: any[] }>('/admin/users', 'GET'),
  updateUserRole: (id: string, role: string) => 
    apiRequest<{ user: any }>(`/admin/users/${id}/role`, 'PUT', { role }),
  deleteUser: (id: string) => apiRequest(`/admin/users/${id}`, 'DELETE'),
  getAllWarranties: () => apiRequest<{ warranties: any[] }>('/admin/warranties', 'GET'),
  getUserActivity: () => apiRequest<{ activities: any[] }>('/admin/activity', 'GET'),
  getStats: () => apiRequest<{ stats: any }>('/admin/stats', 'GET'),
  getAllProducts: () => apiRequest<{ products: any[] }>('/admin/products', 'GET'),
  getAllEvents: () => apiRequest<{ events: any[] }>('/admin/events', 'GET'),
};

// Health API
export const healthApi = {
  getHealthStatus: () => apiRequest<{ status: string; uptime: number }>('/health', 'GET'),
  getDeepHealthStatus: () => apiRequest<{ status: string; services: any }>('/health/deep', 'GET'),
};

// Error handler with toast notifications
export const handleApiError = (error: string) => {
  toast.error(error || 'An unexpected error occurred');
  return error;
};

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