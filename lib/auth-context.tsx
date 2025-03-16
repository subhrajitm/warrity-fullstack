"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi, userApi, handleApiError } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, shouldRedirect: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
  updateProfile: (profileData: any) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await authApi.getCurrentUser();
        if (response.error) {
          // Token might be expired, try to refresh
          const refreshResponse = await authApi.refreshToken();
          if (refreshResponse.error) {
            // Refresh failed, clear token
            localStorage.removeItem('authToken');
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          // Save new token and try again
          if (refreshResponse.data?.token) {
            localStorage.setItem('authToken', refreshResponse.data.token);
            const retryResponse = await authApi.getCurrentUser();
            if (retryResponse.error) {
              localStorage.removeItem('authToken');
              setUser(null);
            } else if (retryResponse.data?.user) {
              setUser(retryResponse.data.user);
            }
          }
        } else if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, shouldRedirect: boolean = true): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email });
      const response = await authApi.login({ email, password });
      
      console.log('Login response:', response);
      
      if (response.error) {
        console.error('Login error:', response.error);
        toast.error(response.error);
        return false;
      }
      
      if (!response.data) {
        console.error('No data in login response');
        toast.error('Invalid login response');
        return false;
      }
      
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        console.error('Missing token or user data in response');
        toast.error('Invalid login response');
        return false;
      }
      
      // Save token
      localStorage.setItem('authToken', token);
      
      // Transform and save user data
      const user: User = {
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        ...userData
      };
      
      setUser(user);
      toast.success('Login successful');
      
      // Only redirect if shouldRedirect is true
      if (shouldRedirect) {
        const redirectPath = user.role === 'admin' ? '/admin' : '/user';
        router.push(redirectPath);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // First clear local state
      localStorage.removeItem('authToken');
      setUser(null);
      
      // Then show success message
      toast.success('Logged out successfully');
      
      // Then redirect
      router.push('/login');
      
      // Finally call the API (non-blocking)
      authApi.logout().catch(error => {
        console.error('Logout API call failed:', error);
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      
      if (response.error) {
        handleApiError(response.error);
        return false;
      }
      
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        toast.success('Registration successful');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await userApi.updateProfile(profileData);
      
      if (response.error) {
        handleApiError(response.error);
        return false;
      }
      
      if (response.data?.user) {
        setUser(response.data.user);
        toast.success('Profile updated successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Profile update failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('User refresh failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 