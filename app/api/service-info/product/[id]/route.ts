import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ServiceInfo } from '@/models/service-info.model';
import { Product } from '@/models/product.model';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // First try to find service info specific to this product
    let serviceInfo = await ServiceInfo.findOne({ product: params.id, isActive: true });

    // If no product-specific service info is found, try to find company-level service info
    if (!serviceInfo) {
      const product = await Product.findById(params.id);
      if (product) {
        serviceInfo = await ServiceInfo.findOne({
          company: product.manufacturer,
          isActive: true,
          product: { $exists: false } // Only get company-level service info
        });
      }
    }

    if (!serviceInfo) {
      return NextResponse.json(
        { error: 'No service information found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ serviceInfo });
  } catch (error) {
    console.error('Error fetching service information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service information' },
      { status: 500 }
    );
  }
} 