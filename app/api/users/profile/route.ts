import { NextRequest, NextResponse } from 'next/server';

// Mock user state (this would normally be stored in a database)
let mockUser = {
  _id: 'user-123',
  name: 'Test User',
  email: 'user@example.com',
  role: 'user',
  isVerified: true,
  phone: null,
  bio: null,
  profilePicture: null,
  socialLinks: {
    twitter: null,
    linkedin: null,
    github: null,
    instagram: null
  },
  preferences: {
    emailNotifications: true,
    reminderDays: 7,
    theme: 'light',
    notifications: true,
    language: 'en'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export async function GET(request: NextRequest) {
  try {
    // Extract the token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    console.log('GET request to user profile API received');
    console.log('Using mock user profile response');
    
    // Check if the token is valid format
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Invalid authorization format' },
        { status: 401 }
      );
    }
    
    // Return the mock user
    return NextResponse.json({
      user: mockUser
    });
  } catch (error) {
    console.error('User profile proxy error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch user profile',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Extract the token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    // Check if the token is valid format
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Invalid authorization format' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    
    console.log('PUT request to update user profile received', body);
    console.log('Using mock profile update response');
    
    // Update the mock user with the new data
    mockUser = {
      ...mockUser,
      ...body,
      // Ensure nested objects are properly merged
      socialLinks: {
        ...mockUser.socialLinks,
        ...body.socialLinks
      },
      preferences: {
        ...mockUser.preferences,
        ...body.preferences
      },
      updatedAt: new Date().toISOString()
    };
    
    // Return the updated user
    return NextResponse.json({
      user: mockUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('User profile update proxy error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update user profile',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 