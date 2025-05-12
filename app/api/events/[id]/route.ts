import { NextRequest, NextResponse } from 'next/server';

// This file contains the route handlers for individual events
interface Event {
  _id: string;
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  allDay: boolean;
  color?: string;
  relatedWarranty?: string;
  notifications?: {
    enabled: boolean;
    reminderTime: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get('authorization');
    
    // Remove auth check for development
    
    // Access the parent route's mock events data
    // In a real implementation, this would be a database query
    const importedModule = await import('../route');
    const events = (importedModule as unknown as { events: Event[] }).events;
    
    // Find the event by ID
    const event = events.find(event => event._id === params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Return the data in the format expected by the client
    return NextResponse.json({ data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get('authorization');
    
    // Remove auth check for development
    
    // Access the parent route's mock events data
    const importedModule = await import('../route');
    const events = (importedModule as unknown as { events: Event[] }).events;
    
    // Find the event by ID
    const eventIndex = events.findIndex(event => event._id === params.id);
    
    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Get the update data from the request
    const updateData = await req.json();
    
    // Update the event
    events[eventIndex] = {
      ...events[eventIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({ data: events[eventIndex] });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get('authorization');
    
    // Remove auth check for development
    
    // Access the parent route's mock events data
    const importedModule = await import('../route');
    const events = (importedModule as unknown as { events: Event[] }).events;
    
    // Find the event by ID
    const eventIndex = events.findIndex(event => event._id === params.id);
    
    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Remove the event
    events.splice(eventIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 