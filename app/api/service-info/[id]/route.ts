import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ServiceInfo } from '@/models/service-info.model';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const serviceInfo = await ServiceInfo.findById(params.id);

    if (!serviceInfo) {
      return NextResponse.json(
        { error: 'Service information not found' },
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