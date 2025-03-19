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

// Define the event type
interface CalendarEvent {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  color?: string;
  relatedProduct?: string;
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
    eventType: "warranty",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
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
      
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching events with token:', token.substring(0, 10) + '...');
      
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Fetch events response status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText
        });
        
        try {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          
          if (response.status === 401) {
            alert('Your session has expired. Please log in again.');
            // Redirect to login page
            router.push('/login');
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Fetched events:', data);
      
      // Handle different response formats
      let eventsData = [];
      
      if (Array.isArray(data)) {
        eventsData = data;
      } else if (data.events && Array.isArray(data.events)) {
        eventsData = data.events;
      } else {
        console.error('Unexpected data format:', data);
      }
      
      // Process and normalize event data
      const normalizedEvents = eventsData.map((event: any) => ({
        ...event,
        // Ensure dates are properly formatted
        startDate: new Date(event.startDate).toISOString(),
        endDate: new Date(event.endDate).toISOString(),
        // Ensure color has a default value
        color: event.color || '#3498db'
      }));
      
      console.log('Normalized events:', normalizedEvents);
      setEvents(normalizedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      alert(`Failed to fetch events: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the useEffect that fetches products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.error('No authentication token found');
          setIsProductsLoading(false);
          return;
        }
        
        console.log('Fetching products with token:', token.substring(0, 10) + '...');
        
        const response = await fetch('/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Fetch products response status:', response.status, response.statusText);
        
        if (!response.ok) {
          console.error('Error response:', {
            status: response.status,
            statusText: response.statusText
          });
          
          try {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          
          setIsProductsLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('Fetched products:', data);
        
        // Handle different response formats
        let productsData = [];
        
        if (Array.isArray(data)) {
          productsData = data;
        } else if (data.products && Array.isArray(data.products)) {
          productsData = data.products;
        } else {
          console.error('Unexpected data format:', data);
        }
        
        // Process and normalize product data
        const normalizedProducts = productsData.map((product: any) => ({
          ...product,
          // Ensure all required fields have values
          name: product.name || 'Unnamed Product',
          description: product.description || '',
          category: product.category || 'Uncategorized'
        }));
        
        console.log('Normalized products:', normalizedProducts);
        setProducts(normalizedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsProductsLoading(false);
      }
    };
  
    if (isAuthenticated && !authLoading) {
      fetchProducts()
    }
  }, [isAuthenticated, authLoading])
  
  // Filter events based on selected date and filter type
  const filteredEvents = events.filter(event => {
    const eventStartDate = new Date(event.startDate)
    const isSameDay = 
      eventStartDate.getDate() === selectedDate.getDate() &&
      eventStartDate.getMonth() === selectedDate.getMonth() &&
      eventStartDate.getFullYear() === selectedDate.getFullYear()
    
    return isSameDay && (filterType === "all" || event.eventType === filterType)
  })
  
  // Get dates with events for highlighting in calendar
  const getDatesWithEvents = () => {
    return events.map(event => new Date(event.startDate))
  }
  
  // Get event type badge
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "warranty":
        return (
          <Badge className="bg-amber-500 text-white">
            <Shield className="mr-1 h-3 w-3" />
            Warranty
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
    // Validate form
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      alert("Please fill in all required fields");
      return;
    }
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      // Log the event data we're sending
      console.log('Sending event data:', newEvent);
      
      // Format dates properly
      const formattedEvent = {
        ...newEvent,
        // Ensure dates are in ISO format
        startDate: new Date(newEvent.startDate).toISOString(),
        endDate: new Date(newEvent.endDate).toISOString(),
        // Only include relatedProduct if it's defined
        ...(newEvent.relatedProduct ? { relatedProduct: newEvent.relatedProduct } : {})
      };
      
      console.log('Formatted event data:', formattedEvent);
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedEvent)
      });
      
      console.log('Create event response status:', response.status, response.statusText);
      
      if (!response.ok) {
        // Log the full response for debugging
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()])
        });
        
        // Clone the response to read the body
        const clonedResponse = response.clone();
        
        try {
          // Try to get the response as text first
          const responseText = await clonedResponse.text();
          console.error('Response text:', responseText);
          
          // Try to parse as JSON if possible
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              console.error('Parsed error data:', errorData);
              
              // Show a more specific error message if available
              const errorMessage = errorData.message || errorData.error || 'Failed to create event';
              alert(`Error: ${errorMessage}`);
            } catch (parseError) {
              console.error('Error parsing response as JSON:', parseError);
              alert(`Error: ${responseText || 'Failed to create event'}`);
            }
          } else {
            alert(`Error: ${response.statusText || 'Failed to create event'}`);
          }
        } catch (textError) {
          console.error('Error reading response text:', textError);
          alert(`Error: ${response.statusText || 'Failed to create event'}`);
        }
        
        return;
      }
      
      try {
        const data = await response.json();
        console.log('Event created:', data);
        
        // Add the new event to the state with the correct structure
        const createdEvent = data.event || data;
        console.log('Created event object:', createdEvent);
        
        if (createdEvent && createdEvent._id) {
          setEvents(prev => [...prev, createdEvent]);
          
          // Reset form and close dialog
          setNewEvent({
            title: "",
            description: "",
            eventType: "warranty",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
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
          
          // Show success message
          alert('Event created successfully!');
        } else {
          console.error('Invalid event data returned:', data);
          alert('Event was created but the response format was unexpected.');
        }
      } catch (error) {
        console.error('Error creating event:', error);
        alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Handle event deletion
  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        // Get auth token from localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        
        console.log('Deleting event with ID:', id);
        
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Delete event response status:', response.status, response.statusText);
        
        if (!response.ok) {
          // Log the full response for debugging
          console.error('Error response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries([...response.headers.entries()])
          });
          
          // Clone the response to read the body
          const clonedResponse = response.clone();
          
          try {
            // Try to get the response as text first
            const responseText = await clonedResponse.text();
            console.error('Response text:', responseText);
            
            // Try to parse as JSON if possible
            if (responseText) {
              try {
                const errorData = JSON.parse(responseText);
                console.error('Parsed error data:', errorData);
                
                // Show a more specific error message if available
                const errorMessage = errorData.message || errorData.error || 'Failed to delete event';
                alert(`Error: ${errorMessage}`);
              } catch (parseError) {
                console.error('Error parsing response as JSON:', parseError);
                alert(`Error: ${responseText || 'Failed to delete event'}`);
              }
            } else {
              alert(`Error: ${response.statusText || 'Failed to delete event'}`);
            }
          } catch (textError) {
            console.error('Error reading response text:', textError);
            alert(`Error: ${response.statusText || 'Failed to delete event'}`);
          }
          
          return;
        }
        
        // Remove the deleted event from state
        setEvents(prev => prev.filter(event => event._id !== id));
        
        // Close the view dialog if it's open
        if (isViewDialogOpen && selectedEvent && selectedEvent._id === id) {
          setIsViewDialogOpen(false);
          setSelectedEvent(null);
        }
        
        // Show success message
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  // View event details
  const handleViewEvent = async (event: CalendarEvent) => {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      console.log('Viewing event with ID:', event._id);
      
      const response = await fetch(`/api/events/${event._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('View event response status:', response.status, response.statusText);
      
      if (!response.ok) {
        // Log the full response for debugging
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()])
        });
        
        // Clone the response to read the body
        const clonedResponse = response.clone();
        
        try {
          // Try to get the response as text first
          const responseText = await clonedResponse.text();
          console.error('Response text:', responseText);
          
          // Try to parse as JSON if possible
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              console.error('Parsed error data:', errorData);
              
              // Show a more specific error message if available
              const errorMessage = errorData.message || errorData.error || 'Failed to load event details';
              alert(`Error: ${errorMessage}`);
            } catch (parseError) {
              console.error('Error parsing response as JSON:', parseError);
              alert(`Error: ${responseText || 'Failed to load event details'}`);
            }
          } else {
            alert(`Error: ${response.statusText || 'Failed to load event details'}`);
          }
        } catch (textError) {
          console.error('Error reading response text:', textError);
          alert(`Error: ${response.statusText || 'Failed to load event details'}`);
        }
        
        // Use the event from the list as a fallback
        setSelectedEvent(event);
        setIsViewDialogOpen(true);
        return;
      }
      
      try {
        const data = await response.json();
        console.log('Event details:', data);
        
        // Handle different response formats
        const eventDetails = data.event || data;
        
        if (eventDetails && eventDetails._id) {
          setSelectedEvent(eventDetails);
          setIsViewDialogOpen(true);
        } else {
          console.error('Invalid event data returned:', data);
          // Use the event from the list as a fallback
          setSelectedEvent(event);
          setIsViewDialogOpen(true);
        }
      } catch (error) {
        console.error('Error parsing event details:', error);
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
  }
  
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
                  <SelectItem value="warranty">Warranty Events</SelectItem>
                  <SelectItem value="maintenance">Maintenance Events</SelectItem>
                  <SelectItem value="reminder">Reminder Events</SelectItem>
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-amber-900">Start Date</Label>
                        <Input 
                          id="startDate" 
                          type="date" 
                          value={newEvent.startDate} 
                          onChange={(e) => handleNewEventChange('startDate', e.target.value)}
                          className="border-2 border-amber-800 bg-amber-50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-amber-900">End Date</Label>
                        <Input 
                          id="endDate" 
                          type="date" 
                          value={newEvent.endDate} 
                          onChange={(e) => handleNewEventChange('endDate', e.target.value)}
                          className="border-2 border-amber-800 bg-amber-50"
                        />
                      </div>
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
                          <SelectItem value="warranty">Warranty</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-amber-900">Related Product</Label>
                      <Select 
                        value={newEvent.relatedProduct || ""} 
                        onValueChange={handleProductSelect}
                      >
                        <SelectTrigger id="product" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {isProductsLoading ? (
                            <SelectItem value="" disabled>Loading products...</SelectItem>
                          ) : products.length > 0 ? (
                            products.map(product => (
                              <SelectItem key={product._id} value={product._id}>
                                {product.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>No products found</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-amber-900">Description (optional)</Label>
                      <Textarea 
                        id="description" 
                        value={newEvent.description} 
                        onChange={(e) => handleNewEventChange('description', e.target.value)}
                        className="border-2 border-amber-800 bg-amber-50 min-h-[80px]"
                        placeholder="Add any additional details about this event..."
                      />
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
                {selectedEvent.relatedProduct && (
                  <div>
                    <h4 className="font-semibold text-amber-900">Related Product</h4>
                    <p className="text-amber-700">
                      {products.find(p => p._id === selectedEvent.relatedProduct)?.name || 'Unknown product'}
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