"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi, userApi, handleApiError } from './api';

interface UserPreferences {
  emailNotifications: boolean;
  reminderDays: number;
  theme?: string;
  notifications?: boolean;
  language?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  phone?: string;
  bio?: string;
  profilePicture?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  preferences?: UserPreferences;
}

interface ProfileUpdateData {
  name?: string;
  phone?: string;
  bio?: string;
  profilePicture?: File | string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    reminderDays?: number;
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, shouldRedirect: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
  updateProfile: (profileData: ProfileUpdateData) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Validation utilities
function validateProfileData(data: ProfileUpdateData): { isValid: boolean; error?: string } {
  // Validate name
  if (data.name && (data.name.length < 2 || data.name.length > 50)) {
    return {
      isValid: false,
      error: 'Name must be between 2 and 50 characters'
    };
  }

  // Validate phone
  if (data.phone) {
    const phoneRegex = /^\+?[\d\s-()]{8,}$/;
    if (!phoneRegex.test(data.phone)) {
      return {
        isValid: false,
        error: 'Invalid phone number format'
      };
    }
  }

  // Validate bio
  if (data.bio && data.bio.length > 500) {
    return {
      isValid: false,
      error: 'Bio must not exceed 500 characters'
    };
  }

  // Validate social links
  if (data.socialLinks) {
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    for (const [platform, url] of Object.entries(data.socialLinks)) {
      if (url && url.trim() !== '' && !urlRegex.test(url)) {
        return {
          isValid: false,
          error: `Invalid ${platform} URL. Please enter a valid URL starting with http:// or https://`
        };
      }
    }
  }

  // Validate preferences
  if (data.preferences) {
    if (typeof data.preferences.emailNotifications !== 'undefined' && 
        typeof data.preferences.emailNotifications !== 'boolean') {
      return {
        isValid: false,
        error: 'Email notifications must be a boolean value'
      };
    }

    if (typeof data.preferences.reminderDays !== 'undefined') {
      const days = Number(data.preferences.reminderDays);
      if (isNaN(days) || days < 1 || days > 365) {
        return {
          isValid: false,
          error: 'Reminder days must be between 1 and 365'
        };
      }
    }
  }

  return { isValid: true };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          if (isMounted) {
            setLoading(false);
            setUser(null);
          }
          return;
        }

        const response = await authApi.getCurrentUser();
        if (response.error) {
          // Token might be expired, try to refresh
          const refreshResponse = await authApi.refreshToken();
          if (refreshResponse.error) {
            // Refresh failed, clear token
            localStorage.removeItem('authToken');
            if (isMounted) {
              setUser(null);
              setLoading(false);
            }
            return;
          }
          
          // Save new token and try again
          if (refreshResponse.data?.token) {
            localStorage.setItem('authToken', refreshResponse.data.token);
            const retryResponse = await authApi.getCurrentUser();
            if (retryResponse.error) {
              localStorage.removeItem('authToken');
              if (isMounted) {
                setUser(null);
                setLoading(false);
              }
            } else if (retryResponse.data?.user && isMounted) {
              setUser(retryResponse.data.user);
              setLoading(false);
            }
          }
        } else if (response.data?.user && isMounted) {
          setUser(response.data.user);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          setLoading(false);
          setUser(null);
        }
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string, shouldRedirect: boolean = true): Promise<boolean> => {
    // Prevent multiple login attempts
    if (loading) {
      console.log('Login already in progress');
      return false;
    }

    setLoading(true);
    let loginAttempted = false;

    try {
      console.log('Attempting login with:', { email });
      
      // Validate input
      if (!email || !password) {
        toast.error('Email and password are required');
        return false;
      }

      // Make API request
      loginAttempted = true;
      const response = await authApi.login({ email, password });
      
      console.log('Login response:', response);
      
      if (response.error) {
        console.error('Login error:', response.error);
        // Don't show error toast for rate limit errors
        if (!response.error.includes('Too Many Requests')) {
          toast.error(response.error);
        }
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
      
      // Set user data
      setUser(userData);
      toast.success('Login successful');
      
      // Only redirect if shouldRedirect is true
      if (shouldRedirect) {
        const redirectPath = userData.role === 'admin' ? '/admin' : '/user';
        router.replace(redirectPath);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Don't show error toast for rate limit errors
      if (!errorMessage.includes('Too Many Requests')) {
        toast.error(`Login failed: ${errorMessage}`);
      }
      
      return false;
    } finally {
      // Only reset loading if we actually attempted login
      if (loginAttempted) {
        setLoading(false);
      }
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Clear local state
      localStorage.removeItem('authToken');
      setUser(null);
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    try {
      // Validate the data before sending
      const validation = validateProfileData(data);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const success = await userApi.updateProfile(data);
      if (success) {
        // Only update the user state if the update was successful
        const response = await userApi.getProfile();
        if (response.data) {
          // Update only the changed fields to prevent unnecessary re-renders
          setUser(prevUser => {
            if (!prevUser) return response.data as User;
            const updatedUser = {
              ...prevUser,
              ...response.data,
              preferences: {
                ...prevUser.preferences,
                ...(response.data as User).preferences
              },
              socialLinks: {
                ...prevUser.socialLinks,
                ...(response.data as User).socialLinks
              }
            } as User;
            return updatedUser;
          });
        }
      }
      return success;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
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
        isLoading: loading,
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