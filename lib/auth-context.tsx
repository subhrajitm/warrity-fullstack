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
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await authApi.getCurrentUser();
        if (response.error) {
          // Token might be expired, try to refresh
          const refreshResponse = await authApi.refreshToken();
          if (refreshResponse.error) {
            // Refresh failed, clear token and redirect to login
            localStorage.removeItem('authToken');
            setUser(null);
            setLoading(false);
            router.push('/login');
            return;
          }
          
          // Save new token and try again
          if (refreshResponse.data?.token) {
            localStorage.setItem('authToken', refreshResponse.data.token);
            const retryResponse = await authApi.getCurrentUser();
            if (retryResponse.error) {
              localStorage.removeItem('authToken');
              setUser(null);
              setLoading(false);
              router.push('/login');
            } else if (retryResponse.data?.user) {
              setUser(retryResponse.data.user);
              setLoading(false);
            }
          }
        } else if (response.data?.user) {
          setUser(response.data.user);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        setUser(null);
        setLoading(false);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string, shouldRedirect: boolean = true): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Attempting login with:', { email });
      
      // Validate input
      if (!email || !password) {
        toast.error('Email and password are required');
        return false;
      }

      // Make API request
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
      
      // Set user data
      setUser(userData);
      toast.success('Login successful');
      
      // Only redirect if shouldRedirect is true
      if (shouldRedirect) {
        const redirectPath = userData.role === 'admin' ? '/admin' : '/user';
        router.push(redirectPath);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Detailed error:', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      toast.error(`Login failed: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
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
      // Validate the data
      const validation = validateProfileData(data);
      if (!validation.isValid) {
        toast.error(validation.error);
        return false;
      }

      const success = await userApi.updateProfile(data);
      if (success) {
        // Update the user state directly with the new data
        setUser(prevUser => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            ...data,
            // Convert File to string URL if needed
            profilePicture: typeof data.profilePicture === 'string' ? data.profilePicture : prevUser.profilePicture,
            // Ensure we don't overwrite the entire socialLinks object
            socialLinks: {
              ...prevUser.socialLinks,
              ...data.socialLinks,
            },
            // Ensure we don't overwrite the entire preferences object and maintain required fields
            preferences: {
              emailNotifications: data.preferences?.emailNotifications ?? prevUser.preferences?.emailNotifications ?? true,
              reminderDays: data.preferences?.reminderDays ?? prevUser.preferences?.reminderDays ?? 7,
              notifications: data.preferences?.notifications ?? prevUser.preferences?.notifications ?? true,
              theme: data.preferences?.theme ?? prevUser.preferences?.theme ?? 'light',
              language: data.preferences?.language ?? prevUser.preferences?.language ?? 'en',
            },
          };
        });
        toast.success('Profile updated successfully');
        return true;
      }
      toast.error('Failed to update profile');
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
      return false;
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