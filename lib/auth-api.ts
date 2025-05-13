import { toast } from "sonner"

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  async changePassword(data: ChangePasswordData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to change password' };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to change password' 
      };
    }
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('Making login request to:', `${this.baseUrl}/auth/login`);
      console.log('Request body:', { email: credentials.email, password: '***' });
      
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', { ...data, token: data.token ? '***' : undefined });
      
      if (!response.ok) {
        console.error('Login failed:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        return {
          error: data.message || 'Login failed',
          data: null
        };
      }
      
      if (!data.token || !data.user) {
        console.error('Invalid response format:', data);
        return {
          error: 'Invalid response format',
          data: null
        };
      }
      
      return {
        data: {
          token: data.token,
          user: data.user
        },
        error: null
      };
    } catch (error) {
      console.error('Login request failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Detailed error:', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      return {
        error: `Login request failed: ${errorMessage}`,
        data: null
      };
    }
  }
}

export const authApi = new AuthApi(); 