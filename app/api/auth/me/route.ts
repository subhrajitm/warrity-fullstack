import { NextRequest, NextResponse } from 'next/server';

// Hardcoded Backend API URL
const apiUrl = 'http://localhost:5000/api';

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
    
    console.log('Auth header received:', authHeader);
    
    // Since the backend is not working due to MongoDB connection issues,
    // we'll provide a mock response
    console.log('Using mock user profile response');
    
    // Check if the token starts with "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Invalid authorization format' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.substring(7);
    
    // For this mock implementation, we'll consider any token valid if it's not empty
    // In a real implementation, you would validate the JWT token
    if (!token || token.trim() === '') {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Create a mock user object
    const mockUser = {
      _id: 'user-123',
      name: 'Test User',
      email: 'user@example.com',
      role: 'user',
      isVerified: true,
      preferences: {
        emailNotifications: true,
        reminderDays: 7,
        theme: 'light'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Return the mock user
    console.log('Returning mock user profile');
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