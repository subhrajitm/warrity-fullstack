import { NextRequest, NextResponse } from 'next/server';

// Hardcoded Backend API URL
const apiUrl = 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Make sure we only send email and password
    const loginData = {
      email: body.email,
      password: body.password
    };
    
    console.log('Login request received for email:', loginData.email);
    
    // Since the backend is not working due to MongoDB connection issues,
    // we'll provide a mock response
    console.log('Using mock login response since backend has MongoDB connection issues');
    
    // Check credentials (very basic for demo/development)
    if (loginData.email === 'user@example.com' && loginData.password === 'password123') {
      // Create a mock token and user object
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        _id: 'user-123',
        name: 'Test User',
        email: loginData.email,
        role: 'user',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Return a successful response
      console.log('Mock login successful for user:', loginData.email);
      return NextResponse.json({
        token: mockToken,
        user: mockUser,
        message: 'Login successful'
      }, { status: 200 });
    } else {
      // Return an error for invalid credentials
      console.log('Mock login failed - invalid credentials');
      return NextResponse.json({
        message: 'Invalid email or password'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login proxy error:', error);
    // Return detailed error information
    return NextResponse.json(
      { 
        message: 'An error occurred during login',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 