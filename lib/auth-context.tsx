"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiEndpoints } from './api-utils';

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
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get the token name from the environment
const TOKEN_NAME = process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || 'authToken';

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
      if (url && !urlRegex.test(url)) {
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_NAME);
        if (!token) {
          setLoading(false);
          setIsAuthenticated(false);
          return;
        }

        // Fetch the current user directly
        await fetchCurrentUser();
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, shouldRedirect = false) => {
    setLoading(true);
    try {
      console.log('Attempting login with email:', email);
      
      // Make API request to login using our Next.js API proxy
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      
      // Get the response text first
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        toast.error('Server returned an invalid response');
        return false;
      }
      
      if (!response.ok) {
        toast.error(data.message || 'Login failed');
        return false;
      }
      
      // Save token to localStorage
      if (data.token) {
        localStorage.setItem(TOKEN_NAME, data.token);
        console.log('Token saved to localStorage');
        
        // Fetch user profile using the token
        await fetchCurrentUser();
        
        if (shouldRedirect) {
          router.push('/user');
        }
        
        return true;
      } else {
        console.error('No token received in login response');
        toast.error('Authentication failed: No token received');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem(TOKEN_NAME);
      
      // Clear user state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed');
        return false;
      }
      
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem(TOKEN_NAME, data.token);
        await fetchCurrentUser();
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
      const token = localStorage.getItem(TOKEN_NAME);
      if (!token) return false;
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
        return false;
      }
      
      // Refresh user data after successful update
      await fetchCurrentUser();
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    await fetchCurrentUser();
  };

  const getToken = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(TOKEN_NAME);
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem(TOKEN_NAME);
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      console.log('Fetching user profile with token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch user profile, status:', response.status);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      const data = await response.json();
      console.log('User profile data:', data);
      
      // Backend API returns different formats for user data
      // It could be in data.user, data itself, or data.data
      const userData = data.user || data.data || data;
      
      if (userData && userData._id) {
        // Format the user data to match our frontend model
        const formattedUser = {
          id: userData._id,
          email: userData.email,
          name: userData.name || 'User',
          role: userData.role || 'user',
          isVerified: userData.isVerified || false,
          phone: userData.phone,
          bio: userData.bio,
          profilePicture: userData.profilePicture,
          socialLinks: userData.socialLinks,
          preferences: userData.preferences || {
            emailNotifications: true,
            reminderDays: 7
          }
        };
        
        setUser(formattedUser);
        setIsAuthenticated(true);
        console.log('User authenticated:', formattedUser.name);
      } else {
        console.error('Invalid user data format received');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('User fetch failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: loading,
        isAuthenticated,
        login,
        logout,
        register,
        updateProfile,
        refreshUser,
        getToken,
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