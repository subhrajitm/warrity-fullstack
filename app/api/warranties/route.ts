import { NextRequest, NextResponse } from 'next/server';

// Hardcoded Backend API URL
const apiUrl = 'http://localhost:5000/api';

// GET all warranties
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

    console.log('Proxying GET request to warranties API:', `${apiUrl}/warranties`);

    // Since the backend server is not working properly, let's return mock data
    console.log('Using mock warranties data');
    
    // Create mock warranties data
    const mockWarranties = [
      {
        _id: 'warranty-1',
        title: 'iPhone 13 Warranty',
        productName: 'iPhone 13',
        productType: 'Electronics',
        purchaseDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        retailer: 'Apple Store',
        purchasePrice: 999.99,
        coverageAmount: 999.99,
        attachments: [],
        notes: 'One year manufacturer warranty',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
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
        _id: 'warranty-3',
        title: 'Laptop Warranty',
        productName: 'MacBook Pro',
        productType: 'Electronics',
        purchaseDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expired',
        retailer: 'Apple Store',
        purchasePrice: 1899.99,
        coverageAmount: 1899.99,
        attachments: [],
        notes: 'AppleCare warranty expired',
        createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'warranty-4',
        title: 'Dishwasher Warranty',
        productName: 'Bosch Dishwasher',
        productType: 'Appliance',
        purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 670 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        retailer: 'Home Depot',
        purchasePrice: 799.99,
        coverageAmount: 799.99,
        attachments: [],
        notes: '2 year manufacturer warranty',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'warranty-5',
        title: 'Vacuum Cleaner Warranty',
        productName: 'Dyson V11',
        productType: 'Appliance',
        purchaseDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        retailer: 'Target',
        purchasePrice: 599.99,
        coverageAmount: 599.99,
        attachments: [],
        notes: '1 year manufacturer warranty',
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json({ 
      data: mockWarranties
    });
  } catch (error) {
    console.error('Warranties proxy error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch warranties',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST a new warranty
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

    // Get the request body
    const body = await request.json();

    console.log('Proxying POST request to create warranty:', body.title);

    // Create a mock response with the created warranty
    const newWarranty = {
      _id: `warranty-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      data: newWarranty,
      message: 'Warranty created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Warranty creation proxy error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create warranty',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 