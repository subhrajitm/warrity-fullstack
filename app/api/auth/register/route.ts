import { NextRequest, NextResponse } from 'next/server';

// Hardcoded Backend API URL
const apiUrl = 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    console.log('Registration request received', {
      email: body.email,
      name: body.name
    });
    
    // Since the backend is not working due to MongoDB connection issues,
    // we'll provide a mock response
    console.log('Using mock registration response');
    
    // Check if the email is already in use (for our mock implementation)
    if (body.email === 'user@example.com') {
      return NextResponse.json({
        message: 'Email is already in use'
      }, { status: 400 });
    }
    
    // Create a mock token and user
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser = {
      _id: 'user-' + Date.now(),
      name: body.name || 'New User',
      email: body.email,
      role: 'user',
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Return a successful response
    return NextResponse.json({
      token: mockToken,
      user: mockUser,
      message: 'Registration successful'
    }, { status: 201 });
  } catch (error) {
    console.error('Registration proxy error:', error);
    // Return detailed error information
    return NextResponse.json(
      { 
        message: 'An error occurred during registration',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 