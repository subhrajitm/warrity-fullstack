import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { apiEndpoints, createApiRequest, ApiCache } from '@/lib/api-utils';
import { toast } from 'sonner';

// Define the event type
export interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  allDay: boolean;
  location?: string;
  color?: string;
  relatedWarranty?: string;
  notifications?: {
    enabled: boolean;
    reminderTime: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Define the API response type
export interface ApiResponse<T> {
  data?: T;
  events?: T;
  products?: T;
  error?: string;
  message?: string;
}

/**
 * Custom hook for managing calendar events
 */
export function useCalendarEvents() {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Use SWR for data fetching with automatic revalidation
  const { 
    data, 
    error, 
    isLoading, 
    isValidating, 
    mutate 
  } = useSWR<ApiResponse<CalendarEvent[]>>(
    apiEndpoints.events.list,
    async (url) => {
      const response = await fetch(url, createApiRequest(url));
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      return response.json();
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 seconds
      onError: (err) => {
        console.error('Error fetching events:', err);
      }
    }
  );

  // Process and normalize events
  const events = processEvents(data);

  // Create a new event
  const createEvent = useCallback(async (eventData: Omit<CalendarEvent, '_id'>) => {
    try {
      setIsCreating(true);
      
      // Create temporary ID for optimistic UI update
      const tempId = `temp-${Date.now()}`;
      
      // Optimistic update
      const optimisticEvent = {
        ...eventData,
        _id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Format event data for API - adapt to match the backend API format
      const formattedEvent = {
        title: eventData.title,
        description: eventData.description || '',
        date: new Date(eventData.startDate).toISOString(),
        type: eventData.eventType,
        warranty: eventData.relatedWarranty,
        allDay: eventData.allDay || false,
        color: eventData.color || '#3498db',
        notifications: eventData.notifications || {
          enabled: true,
          reminderTime: 24
        }
      };

      // Optimistically update the local data
      await mutate(
        prevData => {
          if (!prevData) return { events: [optimisticEvent] };
          
          // Add optimistic event to existing events
          const currentEvents = prevData.events || [];
          return {
            ...prevData,
            events: [...currentEvents, optimisticEvent]
          };
        },
        false // Don't revalidate yet
      );
      
      // Send API request
      const response = await fetch(
        apiEndpoints.events.list,
        createApiRequest(apiEndpoints.events.list, 'POST', formattedEvent)
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }
      
      const responseData = await response.json();
      
      // Update the cache with the real event from the server
      await mutate();
      
      // Clear API cache
      ApiCache.removeFromCache(apiEndpoints.events.list);
      
      toast.success('Event created successfully');
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
      
      // Revalidate to remove the optimistic update
      await mutate();
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [mutate]);

  // Delete an event
  const deleteEvent = useCallback(async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Optimistically update UI
      await mutate(
        prevData => {
          if (!prevData?.events) return prevData;
          
          return {
            ...prevData,
            events: prevData.events.filter(event => event._id !== id)
          };
        },
        false // Don't revalidate yet
      );
      
      // Send API request
      const response = await fetch(
        apiEndpoints.events.delete(id),
        createApiRequest(apiEndpoints.events.delete(id), 'DELETE')
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }
      
      // Clear API cache
      ApiCache.removeFromCache(apiEndpoints.events.list);
      
      toast.success('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete event');
      
      // Revalidate to restore the data
      await mutate();
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [mutate]);

  // Get a single event
  const getEvent = useCallback(async (id: string): Promise<CalendarEvent | null> => {
    try {
      const response = await fetch(
        apiEndpoints.events.detail(id),
        createApiRequest(apiEndpoints.events.detail(id))
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch event details');
      }
      
      const data = await response.json();
      
      // Backend returns { event: {...} } so we need to extract the event
      const eventData = data.event || data.data;
      
      if (!eventData) {
        return null;
      }
      
      // Format the event to match our frontend format
      return {
        _id: eventData._id,
        title: eventData.title,
        description: eventData.description || '',
        eventType: eventData.eventType === 'warranty' ? 'expiration' : eventData.eventType,
        startDate: new Date(eventData.startDate).toISOString(),
        allDay: eventData.allDay ?? true,
        color: eventData.color || '#3498db',
        relatedWarranty: eventData.relatedWarranty?._id || eventData.relatedWarranty,
        notifications: eventData.notifications || {
          enabled: true,
          reminderTime: 24
        },
        createdAt: eventData.createdAt,
        updatedAt: eventData.updatedAt
      };
    } catch (error) {
      console.error('Error fetching event details:', error);
      return null;
    }
  }, []);

  return {
    events,
    isLoading: isLoading || isValidating,
    error,
    isCreating,
    isDeleting,
    isUpdating,
    createEvent,
    deleteEvent,
    getEvent,
    refreshEvents: () => mutate()
  };
}

// Helper function to process and normalize events
function processEvents(data?: ApiResponse<CalendarEvent[]>): CalendarEvent[] {
  if (!data) return [];
  
  // Extract events from the API response format
  let eventsData: any[] = [];
  
  if (Array.isArray(data.events)) {
    // Backend API returns { events: [...] }
    eventsData = data.events;
  } else if (Array.isArray(data.data)) {
    // Some endpoints might return { data: [...] }
    eventsData = data.data;
  } else if (data.events && typeof data.events === 'object') {
    // Handle case where events might be an object with nested array
    const eventsObj = data.events as unknown as Record<string, any>;
    for (const key in eventsObj) {
      if (Array.isArray(eventsObj[key])) {
        eventsData = eventsObj[key];
        break;
      }
    }
  }
  
  // Ensure we have an array
  if (!Array.isArray(eventsData)) {
    return [];
  }
  
  // Process and normalize each event to match our frontend format
  return eventsData.map(event => {
    try {
      // Transform backend event format to frontend format
      // Handle field name differences between backend and frontend
      return {
        _id: event._id,
        title: event.title,
        description: event.description || '',
        // Map eventType from backend (warranty, maintenance, reminder, other) to frontend (expiration, maintenance, reminder)
        eventType: event.eventType === 'warranty' ? 'expiration' : event.eventType,
        // Use startDate from backend
        startDate: new Date(event.startDate).toISOString(),
        allDay: event.allDay ?? true,
        color: event.color || '#3498db',
        // Map relatedWarranty from backend
        relatedWarranty: event.relatedWarranty?._id || event.relatedWarranty,
        notifications: event.notifications || {
          enabled: true,
          reminderTime: 24
        },
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      };
    } catch (err) {
      console.error('Error processing event:', err, event);
      // Return a sanitized event with defaults if processing fails
      return {
        _id: event._id || `fallback-${Date.now()}`,
        title: event.title || 'Untitled Event',
        description: event.description || '',
        eventType: event.eventType || 'reminder',
        startDate: new Date().toISOString(),
        allDay: true,
        color: '#3498db'
      };
    }
  });
} 