import { NextRequest, NextResponse } from 'next/server';

// Hardcoded Backend API URL
const apiUrl = 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    // Extract the token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    console.log('Forwarding request to refresh token API:', `${apiUrl}/auth/refresh-token`);
    console.log('Auth header:', authHeader);

    // Forward the request to the backend API - Most backends use refresh-token not refresh
    const response = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    console.log('Backend response status:', response.status);

    // If the backend returns an error, relay it to the client
    if (!response.ok) {
      let errorData = {};
      try {
        const responseText = await response.text();
        console.log('Backend error response:', responseText);
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    // Get the response data
    const responseText = await response.text();
    console.log('Backend response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return NextResponse.json(
        { message: 'Invalid response from server' },
        { status: 500 }
      );
    }

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Token refresh proxy error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to refresh token',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 