"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar as CalendarIcon, Shield, Wrench, AlertTriangle, Info, Plus, Trash2, Loader2 } from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { 
  ApiCache, 
  createApiRequest, 
  apiEndpoints,
  handleApiError 
} from "@/lib/api-utils"

// Define the event type
interface CalendarEvent {
  _id: string;
  title: string;
  description: string;
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

// Define the product type
interface Product {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  manufacturer?: string;
  model?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data?: T;
  events?: T;
  products?: T;
  error?: string;
  message?: string;
}

export default function CalendarPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, '_id'>>({
    title: "",
    description: "",
    eventType: "expiration",
    startDate: new Date().toISOString().split('T')[0],
    allDay: true,
    color: "#3498db",
    notifications: {
      enabled: true,
      reminderTime: 24
    }
  })
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  
  // Handle product selection
  const [products, setProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if user is logged in and fetch events
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else {
        fetchEvents()
      }
    }
  }, [authLoading, isAuthenticated, router])
  
  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching events from:', apiEndpoints.events.list);
      
      const data = await ApiCache.fetchWithCache<ApiResponse<CalendarEvent[]>>(
        apiEndpoints.events.list,
        createApiRequest(apiEndpoints.events.list)
      );
      
      console.log('Raw API response:', JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.error('Error in API response:', data.error);
        return;
      }

      // Handle different response formats
      let eventsData: CalendarEvent[] = [];
      
      if (Array.isArray(data.data)) {
        console.log('Found events in data.data:', data.data.length);
        eventsData = data.data;
      } else if (Array.isArray(data.events)) {
        console.log('Found events in data.events:', data.events.length);
        eventsData = data.events;
      } else {
        console.error('Unexpected data format:', data);
        console.error('data.data type:', typeof data.data);
        console.error('data.events type:', typeof data.events);
      }

      // Process and normalize event data
      const normalizedEvents = eventsData.map((event: CalendarEvent) => {
        console.log('Processing event:', event);
        return {
          ...event,
          startDate: new Date(event.startDate).toISOString(),
          color: event.color || '#3498db'
        };
      });
      
      console.log('Setting normalized events:', normalizedEvents.length);
      setEvents(normalizedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        });
        if (err.message === 'Unauthorized') {
          router.push('/login');
        } else {
          alert(`Failed to fetch events: ${err.message}`);
        }
      } else {
        alert('Failed to fetch events: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the useEffect that fetches products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        
        const data = await ApiCache.fetchWithCache<ApiResponse<Product[]>>(
          apiEndpoints.products.list,
          createApiRequest(apiEndpoints.products.list)
        );
        
        if (data.error) {
          console.error('Error fetching products:', data.error);
          return;
        }

        // Handle different response formats
        let productsData: Product[] = [];
        
        if (Array.isArray(data.data)) {
          productsData = data.data;
        } else if (Array.isArray(data.products)) {
          productsData = data.products;
        } else {
          console.error('Unexpected data format:', data);
        }

        // Process and normalize product data
        const normalizedProducts = productsData.map((product: Product) => ({
          ...product,
          name: product.name || 'Unnamed Product',
          description: product.description || '',
          category: product.category || 'Uncategorized'
        }));
        
        setProducts(normalizedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsProductsLoading(false);
      }
    };
  
    if (isAuthenticated && !authLoading) {
      fetchProducts();
    }
  }, [isAuthenticated, authLoading]);
  
  // Filter events based on selected date and filter type
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startDate)
    const isSameDay = 
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    
    const matchesFilter = filterType === "all" || event.eventType === filterType;
    
    console.log('Filtering event:', {
      eventTitle: event.title,
      eventDate: eventDate.toISOString(),
      selectedDate: selectedDate.toISOString(),
      eventType: event.eventType,
      filterType,
      isSameDay,
      matchesFilter,
      willShow: isSameDay && matchesFilter
    });
    
    return isSameDay && matchesFilter;
  })
  
  console.log('Filtered events for selected date:', filteredEvents);
  
  // Get dates with events for highlighting in calendar
  const getDatesWithEvents = () => {
    return events.map(event => new Date(event.startDate))
  }
  
  // Get event type badge
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "expiration":
        return (
          <Badge className="bg-amber-500 text-white">
            <Shield className="mr-1 h-3 w-3" />
            Warranty Expiration
          </Badge>
        )
      case "maintenance":
        return (
          <Badge className="bg-blue-500 text-white">
            <Wrench className="mr-1 h-3 w-3" />
            Maintenance
          </Badge>
        )
      case "reminder":
        return (
          <Badge className="bg-red-500 text-white">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Reminder
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-500 text-white">
            <Info className="mr-1 h-3 w-3" />
            Other
          </Badge>
        )
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Handle new event form changes
  const handleNewEventChange = (field: string, value: any) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Update the product selection handling
  const handleProductSelect = (productIdString: string) => {
    console.log('Selected product ID string:', productIdString);
    
    // Handle empty selection
    if (!productIdString) {
      setNewEvent(prev => ({
        ...prev,
        relatedProduct: undefined
      }));
      return;
    }
    
    setNewEvent(prev => ({
      ...prev,
      relatedProduct: productIdString
    }));
  };
  
  // Handle event creation
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.startDate) {
      alert("Please fill in all required fields");
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Create optimistic event
      const optimisticEvent: CalendarEvent = {
        ...newEvent,
        _id: 'temp-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add optimistic event to state
      setEvents(prev => [...prev, optimisticEvent]);
      
      // Format event data to match API requirements
      const formattedEvent = {
        title: newEvent.title,
        description: newEvent.description || '',
        date: new Date(newEvent.startDate).toISOString(), // Ensure proper ISO8601 format
        type: newEvent.eventType === 'warranty' ? 'expiration' : 
              newEvent.eventType === 'maintenance' ? 'maintenance' : 
              newEvent.eventType === 'reminder' ? 'reminder' : 'reminder', // Ensure valid type
        warranty: newEvent.relatedWarranty || undefined,
        allDay: newEvent.allDay || false,
        color: newEvent.color || '#3498db',
        notifications: newEvent.notifications || {
          enabled: true,
          reminderTime: 24
        }
      };
      
      console.log('Sending event data:', formattedEvent); // Debug log
      
      const response = await fetch(
        apiEndpoints.events.list,
        createApiRequest(apiEndpoints.events.list, 'POST', formattedEvent)
      );
      
      if (!response.ok) {
        // Remove optimistic event on failure
        setEvents(prev => prev.filter(e => e._id !== optimisticEvent._id));
        const errorMessage = await handleApiError(response);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Create event response:', data); // Debug log
      
      // Handle different response formats
      const createdEvent = data.event || data;
      
      if (createdEvent && createdEvent._id) {
        // Replace optimistic event with real event
        setEvents(prev => prev.map(e => 
          e._id === optimisticEvent._id ? createdEvent : e
        ));
        
        // Reset form and close dialog
        setNewEvent({
          title: "",
          description: "",
          eventType: "expiration",
          startDate: new Date().toISOString().split('T')[0],
          allDay: true,
          color: "#3498db",
          notifications: {
            enabled: true,
            reminderTime: 24
          }
        });
        setIsDialogOpen(false);
        
        // Select the date of the new event
        setSelectedDate(new Date(createdEvent.startDate));
        
        // Clear cache for events
        ApiCache.removeFromCache(apiEndpoints.events.list);
        
        alert('Event created successfully!');
      } else {
        throw new Error('Invalid event data returned');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  // Handle event deletion
  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        setIsDeleting(true);
        
        const response = await fetch(
          apiEndpoints.events.detail(id),
          createApiRequest(apiEndpoints.events.detail(id), 'DELETE')
        );
        
        if (!response.ok) {
          const errorMessage = await handleApiError(response);
          throw new Error(errorMessage);
        }
        
        // Remove the deleted event from state
        setEvents(prev => prev.filter(event => event._id !== id));
        
        // Close the view dialog if it's open
        if (isViewDialogOpen && selectedEvent && selectedEvent._id === id) {
          setIsViewDialogOpen(false);
          setSelectedEvent(null);
        }
        
        // Clear cache for events
        ApiCache.removeFromCache(apiEndpoints.events.list);
        
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // View event details
  const handleViewEvent = async (event: CalendarEvent) => {
    try {
      const data = await ApiCache.fetchWithCache<ApiResponse<CalendarEvent>>(
        apiEndpoints.events.detail(event._id),
        createApiRequest(apiEndpoints.events.detail(event._id))
      );
      
      // Handle different response formats
      const eventDetails = data.data || data;
      
      if (eventDetails && '_id' in eventDetails) {
        setSelectedEvent(eventDetails as CalendarEvent);
        setIsViewDialogOpen(true);
      } else {
        // Use the event from the list as a fallback
        setSelectedEvent(event);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      console.error('Error viewing event:', error);
      // Use the event from the list as a fallback
      setSelectedEvent(event);
      setIsViewDialogOpen(true);
    }
  };
  
  // Add logging to useEffect for events
  useEffect(() => {
    console.log('Events state updated:', events.length);
    console.log('Filtered events:', filteredEvents.length);
  }, [events, selectedDate, filterType]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading calendar...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <WarrantySidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="mb-6">
          <Link href="/user" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">Warranty Calendar</h1>
              <p className="text-amber-700">Track your warranty expirations and maintenance schedules</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px] border-2 border-amber-800 bg-amber-50">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="expiration">Warranty Expiration</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
              
              {isLoading && (
                <div className="flex items-center text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading events...</span>
                </div>
              )}
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-amber-50 border-4 border-amber-800">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-amber-900">Add New Calendar Event</DialogTitle>
                    <DialogDescription className="text-amber-700">
                      Create a new warranty or maintenance event for your products.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-amber-900">Event Title</Label>
                      <Input 
                        id="title" 
                        value={newEvent.title} 
                        onChange={(e) => handleNewEventChange('title', e.target.value)}
                        className="border-2 border-amber-800 bg-amber-50"
                        placeholder="e.g., TV Warranty Expiration"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-amber-900">Event Date</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={newEvent.startDate} 
                        onChange={(e) => handleNewEventChange('startDate', e.target.value)}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-amber-900">Event Type</Label>
                      <Select 
                        value={newEvent.eventType} 
                        onValueChange={(value) => handleNewEventChange('eventType', value)}
                      >
                        <SelectTrigger id="type" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expiration">Warranty Expiration</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="warranty" className="text-amber-900">Related Warranty (Optional)</Label>
                      <Select 
                        value={newEvent.relatedWarranty || "none"} 
                        onValueChange={(value) => handleNewEventChange('relatedWarranty', value === "none" ? undefined : value)}
                      >
                        <SelectTrigger id="warranty" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select a warranty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No warranty</SelectItem>
                          {/* We'll need to fetch warranties and populate this */}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-amber-900">Description (Optional)</Label>
                      <Textarea 
                        id="description" 
                        value={newEvent.description} 
                        onChange={(e) => handleNewEventChange('description', e.target.value)}
                        className="border-2 border-amber-800 bg-amber-50 min-h-[80px]"
                        placeholder="Add any additional details about this event..."
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allDay"
                        checked={newEvent.allDay}
                        onChange={(e) => handleNewEventChange('allDay', e.target.checked)}
                        className="h-4 w-4 rounded border-amber-800 text-amber-800 focus:ring-amber-800"
                      />
                      <Label htmlFor="allDay" className="text-amber-900">All-day event</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="border-2 border-amber-800 text-amber-800"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateEvent}
                      className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                    >
                      Create Event
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
                <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                  <CardTitle className="text-xl font-bold text-amber-900">
                    <CalendarIcon className="inline-block mr-2 h-5 w-5" />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="border-2 border-amber-300 rounded-md p-3"
                    modifiers={{
                      hasEvent: getDatesWithEvents()
                    }}
                    modifiersStyles={{
                      hasEvent: {
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(217, 119, 6, 0.2)',
                        borderRadius: '100%'
                      }
                    }}
                  />
                  
                  <div className="mt-4 text-center">
                    <p className="text-amber-800 font-medium">
                      {formatDate(selectedDate.toISOString())}
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      {filteredEvents.length} events on this day
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 h-full">
                <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                  <CardTitle className="text-xl font-bold text-amber-900">
                    Events for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEvents.map(event => (
                        <div 
                          key={event._id} 
                          className="p-4 border-2 border-amber-300 rounded-md bg-amber-50 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewEvent(event)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-amber-900">{event.title}</h3>
                              <p className="text-amber-700 text-sm mt-1">
                                {event.allDay ? 'All day' : new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                            {getEventTypeBadge(event.eventType)}
                          </div>
                          {event.description && (
                            <p className="text-amber-700 mt-2 text-sm line-clamp-2">{event.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-amber-700">No events scheduled for this day.</p>
                      <Button 
                        onClick={() => setIsDialogOpen(true)}
                        className="mt-4 bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-amber-50 border-4 border-amber-800">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl font-bold text-amber-900">{selectedEvent.title}</DialogTitle>
                  {getEventTypeBadge(selectedEvent.eventType)}
                </div>
                <DialogDescription className="text-amber-700">
                  {formatDate(selectedEvent.startDate)}
                  {!selectedEvent.allDay && ` at ${new Date(selectedEvent.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {selectedEvent.relatedWarranty && (
                  <div>
                    <h4 className="font-semibold text-amber-900">Related Warranty</h4>
                    <p className="text-amber-700">
                      {selectedEvent.relatedWarranty}
                    </p>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div>
                    <h4 className="font-semibold text-amber-900">Description</h4>
                    <p className="text-amber-700">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleDeleteEvent(selectedEvent._id)}
                  className="border-2 border-red-800 text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button 
                  onClick={() => setIsViewDialogOpen(false)}
                  className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}