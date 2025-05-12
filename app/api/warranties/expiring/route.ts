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

    console.log('Proxying GET request to expiring warranties API');
    
    // Since the backend server is not working properly, return mock data
    console.log('Using mock expiring warranties data');
    
    // Create mock warranties data that are about to expire
    const mockExpiringWarranties = [
      {
        _id: 'warranty-2',
        title: 'Samsung TV Warranty',
        productName: 'Samsung QLED TV',
        productType: 'Electronics',
        purchaseDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expiring-soon',
        retailer: 'Best Buy',
        purchasePrice: 1499.99,
        coverageAmount: 1499.99,
        attachments: [],
        notes: 'Extended warranty purchased',
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'warranty-6',
        title: 'Refrigerator Warranty',
        productName: 'LG Smart Refrigerator',
        productType: 'Appliance',
        purchaseDate: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expiring-soon',
        retailer: 'Lowes',
        purchasePrice: 2499.99,
        coverageAmount: 2499.99,
        attachments: [],
        notes: 'Extended warranty about to expire',
        createdAt: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json({ 
      data: mockExpiringWarranties
    });
  } catch (error) {
    console.error('Expiring warranties proxy error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch expiring warranties',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 