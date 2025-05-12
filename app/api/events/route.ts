import { NextRequest, NextResponse } from 'next/server';

// Mock events data since we don't have access to a database yet
export let events = [
  {
    _id: '1',
    title: 'Warranty Expiration - TV',
    description: 'Samsung TV warranty expires today',
    eventType: 'expiration',
    startDate: new Date().toISOString(),
    allDay: true,
    color: '#e74c3c',
    relatedWarranty: '123',
    notifications: {
      enabled: true,
      reminderTime: 24
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Maintenance - Laptop',
    description: 'Scheduled laptop cleaning',
    eventType: 'maintenance',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    allDay: false,
    color: '#3498db',
    relatedWarranty: '456',
    notifications: {
      enabled: true,
      reminderTime: 48
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(req: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get('authorization');
    
    // Remove auth check to make sure it works during development
    // In a real app, we would validate the token properly
    
    // Return the exact shape the client is expecting
    return NextResponse.json({ events: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get('authorization');
    
    // Remove auth check to make it work during development
    
    const data = await req.json();
    const { title, description, type, date, allDay, color, notifications, warranty } = data;
    
    // Create a new event
    const newEvent = {
      _id: `${events.length + 1}`,
      title,
      description,
      eventType: type || 'reminder',
      startDate: date,
      allDay: allDay || true,
      color: color || '#3498db',
      relatedWarranty: warranty,
      notifications: notifications || {
        enabled: true,
        reminderTime: 24
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the event to our mock database
    events.push(newEvent);
    
    return NextResponse.json({ event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // Find the event by ID
    const eventIndex = events.findIndex(event => event._id === id);
    
    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Remove the event from our mock database
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