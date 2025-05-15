"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar as CalendarIcon, Shield, Wrench, AlertTriangle, Info, Plus, Trash2, Loader2, XCircle, Filter, List } from "lucide-react"
import { toast } from "sonner"
import WarrantySidebar from "../warranties/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { 
  ApiCache, 
  createApiRequest, 
  apiEndpoints,
  handleApiError 
} from "@/lib/api-utils"

// Types
type EventType = 'warranty' | 'maintenance' | 'reminder' | 'other'
type FilterType = 'all' | 'expiration' | 'maintenance' | 'reminder'

interface CalendarEvent {
  _id: string;
  title: string;
  description: string;
  eventType: EventType;
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

interface Product {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  manufacturer?: string;
  model?: string;
}

interface ApiResponse<T> {
  data?: T;
  events?: T;
  products?: T;
  error?: string;
  message?: string;
}

// Constants for event types
const EVENT_TYPES = {
  WARRANTY: 'warranty',
  MAINTENANCE: 'maintenance',
  REMINDER: 'reminder',
  OTHER: 'other'
} as const;

const EVENT_TYPE_MAP = {
  expiration: EVENT_TYPES.WARRANTY,
  maintenance: EVENT_TYPES.MAINTENANCE,
  reminder: EVENT_TYPES.REMINDER
} as const;

const REVERSE_EVENT_TYPE_MAP = Object.entries(EVENT_TYPE_MAP).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<EventType, string>);

// Helper functions for date handling
const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  return d1.getTime() === d2.getTime();
};

const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export default function CalendarPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  
  // State hooks
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [temporaryDateView, setTemporaryDateView] = useState<Date | null>(null)
  
  // UI state
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  
  // Form state
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, '_id'>>({
    title: "",
    description: "",
    eventType: "warranty",
    startDate: new Date().toISOString().split('T')[0],
    allDay: true,
    color: "#3498db",
    notifications: {
      enabled: true,
      reminderTime: 24
    }
  })

  // Data fetching with useCallback
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('API endpoint URL:', apiEndpoints.events.list)
      const data = await ApiCache.fetchWithCache<ApiResponse<CalendarEvent[]>>(
        apiEndpoints.events.list,
        createApiRequest(apiEndpoints.events.list)
      )
      
      if (data.error) {
        toast.error(data.error)
        return
      }

      // Handle API response data
      const eventsData = data.events || data.data || []
      
      // Normalize events
      const normalizedEvents = Array.isArray(eventsData) 
        ? eventsData.map((event: CalendarEvent) => ({
            ...event,
            startDate: new Date(event.startDate).toISOString(),
            color: event.color || '#3498db'
          }))
        : []
      
      setEvents(normalizedEvents)
      console.log(`Successfully loaded ${normalizedEvents.length} events`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error details:', error)
      console.error('API URL:', apiEndpoints.events.list)
      
      if (errorMessage === 'Unauthorized') {
        router.push('/login')
      } else {
        toast.error(`Failed to fetch events: ${errorMessage}`)
        
        // Show a more helpful message if it looks like the API is not running
        if (errorMessage.includes('API endpoint not found') || errorMessage.includes('Failed to fetch')) {
          toast.error('It appears the API server is not running. Please start it using "npm run dev" in the api directory.')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const fetchProducts = useCallback(async () => {
    try {
      setIsProductsLoading(true)
      
      const data = await ApiCache.fetchWithCache<ApiResponse<Product[]>>(
        apiEndpoints.products.list,
        createApiRequest(apiEndpoints.products.list)
      )
      
      const productsData = data.products || data.data || []
      const normalizedProducts = Array.isArray(productsData)
        ? productsData.map((product: Product) => ({
            ...product,
            name: product.name || 'Unnamed Product'
          }))
        : []
      
      setProducts(normalizedProducts)
    } catch (error) {
      toast.error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProductsLoading(false)
    }
  }, [])

  const initializeData = useCallback(async () => {
    try {
      await Promise.all([fetchEvents(), fetchProducts()])
      setSelectedDate(new Date())
    } catch (error) {
      toast.error(`Error initializing data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [fetchEvents, fetchProducts])

  // Effects
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else {
        initializeData()
      }
    }
  }, [authLoading, isAuthenticated, router, initializeData])

  // Event handlers
  const handleNewEventChange = useCallback((field: string, value: any) => {
    setNewEvent(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleProductSelect = useCallback((productIdString: string) => {
    const selectedProduct = products.find(p => p._id === productIdString)
    
    if (selectedProduct) {
      handleNewEventChange('title', `${selectedProduct.name} - Warranty Expiration`)
      handleNewEventChange('description', `Warranty expiration for ${selectedProduct.name}`)
    }
  }, [products, handleNewEventChange])

  // Memoized event filtering
  const getFilteredEvents = useMemo(() => {
    return events.filter((event: CalendarEvent) => {
      try {
        // If temporaryDateView is set, show events for that date
        const dateToUse = temporaryDateView || selectedDate;
        
        // Validate dates
        const eventDate = new Date(event.startDate);
        const selectedDateObj = new Date(dateToUse);
        
        if (!isValidDate(eventDate) || !isValidDate(selectedDateObj)) {
          console.error('Invalid date detected:', { eventDate, selectedDateObj });
          return false;
        }
        
        const isEventSameDay = isSameDay(eventDate, selectedDateObj);
        const matchesFilter = filterType === "all" || 
          (filterType === "expiration" && event.eventType === EVENT_TYPES.WARRANTY) ||
          (event.eventType === filterType);
        
        // If showAllEvents is true and no temporary date is selected, show all events
        if (showAllEvents && !temporaryDateView) {
          return matchesFilter;
        }
        
        return isEventSameDay && matchesFilter;
      } catch (error) {
        console.error('Error filtering event:', error);
        return false;
      }
    });
  }, [events, temporaryDateView, selectedDate, filterType, showAllEvents]);

  // Improved event creation validation
  const validateEvent = (event: Omit<CalendarEvent, '_id'>): string[] => {
    const errors: string[] = [];
    
    if (!event.title?.trim()) {
      errors.push('Title is required');
    }
    
    if (!event.startDate) {
      errors.push('Date is required');
    } else {
      const eventDate = new Date(event.startDate);
      if (!isValidDate(eventDate)) {
        errors.push('Invalid date format');
      } else if (event.eventType === EVENT_TYPES.WARRANTY && eventDate < new Date()) {
        errors.push('Warranty expiration date must be in the future');
      }
    }
    
    if (event.eventType === EVENT_TYPES.WARRANTY && !event.relatedWarranty) {
      errors.push('Related product is required for warranty events');
    }
    
    return errors;
  };

  // Improved event creation handler
  const handleCreateEvent = async () => {
    const validationErrors = validateEvent(newEvent);
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join('\n'));
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Check for duplicate events
      const isDuplicate = events.some(event => 
        event.title === newEvent.title && 
        isSameDay(new Date(event.startDate), new Date(newEvent.startDate))
      );
      
      if (isDuplicate) {
        toast.error('An event with the same title and date already exists');
        return;
      }
      
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
        date: new Date(newEvent.startDate).toISOString(),
        type: EVENT_TYPE_MAP[newEvent.eventType as keyof typeof EVENT_TYPE_MAP] || EVENT_TYPES.REMINDER,
        warranty: newEvent.relatedWarranty || undefined,
        allDay: newEvent.allDay || false,
        color: newEvent.color || '#3498db',
        notifications: newEvent.notifications || {
          enabled: true,
          reminderTime: 24
        }
      };
      
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
          eventType: EVENT_TYPES.WARRANTY,
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
        
        toast.success("Event created successfully");
      } else {
        throw new Error('Invalid event data returned');
      }
    } catch (error) {
      toast.error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteEvent = async (id: string) => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(
        apiEndpoints.events.detail(id),
        createApiRequest(apiEndpoints.events.detail(id), 'DELETE')
      )
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response)
        throw new Error(errorMessage)
      }
      
      // Remove the deleted event from state
      setEvents(prev => prev.filter(event => event._id !== id))
      
      // Close the view dialog if it's open
      if (isViewDialogOpen && selectedEvent && selectedEvent._id === id) {
        setIsViewDialogOpen(false)
        setSelectedEvent(null)
      }
      
      // Clear cache for events
      ApiCache.removeFromCache(apiEndpoints.events.list)
      
      toast.success("Event deleted successfully")
    } catch (error) {
      toast.error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
    }
  }
  
  const handleViewEvent = async (event: CalendarEvent) => {
    try {
      const data = await ApiCache.fetchWithCache<ApiResponse<CalendarEvent>>(
        apiEndpoints.events.detail(event._id),
        createApiRequest(apiEndpoints.events.detail(event._id))
      )
      
      const eventDetails = data.data || data
      
      if (eventDetails && '_id' in eventDetails) {
        setSelectedEvent(eventDetails as CalendarEvent)
      } else {
        setSelectedEvent(event)
      }
      
      setIsViewDialogOpen(true)
    } catch (error) {
      // Use the event from the list as a fallback
      setSelectedEvent(event)
      setIsViewDialogOpen(true)
    }
  }
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setTemporaryDateView(date)
      // Scroll to events section on mobile
      if (window.innerWidth < 768) {
        const eventsSection = document.getElementById('events-section')
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }
  
  const handleShowAllToggle = () => {
    setShowAllEvents(!showAllEvents)
    setTemporaryDateView(null) // Clear temporary date view when toggling show all
  }
  
  // Helper functions 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "warranty":
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
  
  // Get dates with events for highlighting in calendar
  const getDatesWithEvents = () => {
    const datesWithEvents = new Set<string>();
    
    events.forEach(event => {
      if (event && event.startDate) {
        const date = new Date(event.startDate);
        if (isValidDate(date)) {
          date.setHours(0, 0, 0, 0);
          datesWithEvents.add(date.toISOString());
        }
      }
    });
    
    return Array.from(datesWithEvents).map(dateStr => new Date(dateStr));
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-amber-800 animate-spin" />
            <p className="text-amber-800 text-xl">Loading calendar...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="flex h-screen">
        {/* Main Sidebar */}
        <WarrantySidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="text-amber-900 hover:bg-amber-100 rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold text-amber-900">Calendar</h1>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-800 hover:bg-amber-900 text-white border border-amber-900 shadow-md rounded-full px-4">
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-amber-50 border-2 border-amber-800">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-amber-900">Create New Event</DialogTitle>
                    <DialogDescription className="text-amber-700">
                      Add a new event to your calendar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-amber-900">Title</Label>
                      <Input
                        value={newEvent.title}
                        onChange={(e) => handleNewEventChange('title', e.target.value)}
                        className="border-2 border-amber-200 bg-white text-amber-900"
                        placeholder="Event title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-900">Description</Label>
                      <Textarea
                        value={newEvent.description}
                        onChange={(e) => handleNewEventChange('description', e.target.value)}
                        className="border-2 border-amber-200 bg-white text-amber-900"
                        placeholder="Event description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-900">Event Type</Label>
                      <Select
                        value={newEvent.eventType}
                        onValueChange={(value) => handleNewEventChange('eventType', value)}
                      >
                        <SelectTrigger className="border-2 border-amber-200 bg-white text-amber-900">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-amber-800 bg-white">
                          <SelectItem value="warranty" className="text-amber-900">Warranty Expiration</SelectItem>
                          <SelectItem value="maintenance" className="text-amber-900">Maintenance</SelectItem>
                          <SelectItem value="reminder" className="text-amber-900">Reminder</SelectItem>
                          <SelectItem value="other" className="text-amber-900">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-900">Date</Label>
                      <Input
                        type="date"
                        value={newEvent.startDate}
                        onChange={(e) => handleNewEventChange('startDate', e.target.value)}
                        className="border-2 border-amber-200 bg-white text-amber-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-900">Related Product</Label>
                      <Select
                        value={newEvent.relatedWarranty}
                        onValueChange={handleProductSelect}
                      >
                        <SelectTrigger className="border-2 border-amber-200 bg-white text-amber-900">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-amber-800 bg-white">
                          {products.map((product) => (
                            <SelectItem key={product._id} value={product._id} className="text-amber-900">
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-900 border-2 border-amber-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateEvent}
                      disabled={isCreating}
                      className="bg-amber-800 hover:bg-amber-900 text-white border-2 border-amber-900"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Event'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left Column - Calendar and Filters */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                {/* Calendar Card */}
                <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
                  <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                    <CardTitle className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-100">
                        <CalendarIcon className="h-5 w-5 text-amber-800" />
                      </div>
                      Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="w-full">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        modifiers={{ 
                          hasEvent: getDatesWithEvents(),
                          today: new Date()
                        }}
                        modifiersStyles={{
                          hasEvent: { 
                            backgroundColor: 'rgba(180, 83, 9, 0.2)',
                            borderRadius: '50%',
                            fontWeight: 'bold',
                            boxShadow: '0 0 0 2px rgba(120, 53, 15, 0.3)',
                            color: 'rgb(120, 53, 15)'
                          },
                          today: {
                            backgroundColor: 'rgb(234, 179, 8)',
                            borderRadius: '50%',
                            fontWeight: 'bold',
                            boxShadow: '0 0 0 3px rgba(120, 53, 15, 0.5)',
                            color: 'rgb(120, 53, 15)',
                            transform: 'scale(1.1)',
                            transition: 'all 0.2s ease-in-out'
                          }
                        }}
                        className="rounded-lg border-2 border-amber-800 bg-white"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-between items-center text-amber-900 font-bold text-lg mb-4 px-2",
                          caption_label: "text-amber-900 font-bold text-lg bg-amber-100 px-4 py-2 rounded-lg border-2 border-amber-800 shadow-[2px_2px_0px_0px_rgba(120,53,15,0.5)]",
                          nav: "space-x-3 flex items-center",
                          nav_button: "hover:bg-amber-50 focus:bg-amber-50 rounded-full h-8 w-8 border-2 border-amber-800 bg-amber-100 shadow-[2px_2px_0px_0px_rgba(120,53,15,0.5)] hover:shadow-[3px_3px_0px_0px_rgba(120,53,15,0.5)] transition-all duration-200",
                          nav_button_previous: "hover:bg-amber-50 focus:bg-amber-50 rounded-full h-8 w-8 border-2 border-amber-800 bg-amber-100 shadow-[2px_2px_0px_0px_rgba(120,53,15,0.5)] hover:shadow-[3px_3px_0px_0px_rgba(120,53,15,0.5)] transition-all duration-200",
                          nav_button_next: "hover:bg-amber-50 focus:bg-amber-50 rounded-full h-8 w-8 border-2 border-amber-800 bg-amber-100 shadow-[2px_2px_0px_0px_rgba(120,53,15,0.5)] hover:shadow-[3px_3px_0px_0px_rgba(120,53,15,0.5)] transition-all duration-200",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex justify-between",
                          head_cell: "text-amber-900 font-bold uppercase text-sm p-2",
                          row: "flex w-full mt-2 justify-between",
                          cell: "text-amber-800 p-0 text-center text-base relative hover:with-ring flex items-center justify-center",
                          day: "hover:bg-amber-50 focus:bg-amber-50 rounded-full transition-colors text-base font-medium text-amber-900 h-10 w-10 flex items-center justify-center",
                          day_selected: "bg-amber-800 text-white hover:bg-amber-900 hover:text-white focus:bg-amber-800 focus:text-white font-bold text-lg h-10 w-10 flex items-center justify-center",
                          day_today: "bg-amber-100 text-amber-900 font-bold text-lg h-10 w-10 flex items-center justify-center",
                          day_outside: "text-amber-400 opacity-50",
                          day_disabled: "text-amber-400 opacity-50",
                          day_range_middle: "aria-selected:bg-amber-100 aria-selected:text-amber-900",
                          day_hidden: "invisible",
                          dropdown: "bg-white border-2 border-amber-800 font-medium shadow-[2px_2px_0px_0px_rgba(120,53,15,0.5)]",
                          dropdown_year: "bg-white border-2 border-amber-800 font-medium shadow-[2px_2px_0px_0px_rgba(120,53,15,0.5)]",
                          dropdown_month: "bg-white border-2 border-amber-800 font-medium shadow-[2px_2px_0px_0px_rgba(120,53,15,0.5)]",
                          vhidden: "hidden"
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Filters Card */}
                <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
                  <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                    <CardTitle className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-100">
                        <Filter className="h-5 w-5 text-amber-800" />
                      </div>
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-amber-900 flex items-center gap-2">
                        <div className="p-1 rounded-md bg-amber-100/50">
                          <Info className="h-3.5 w-3.5 text-amber-800" />
                        </div>
                        Event Type
                      </Label>
                      <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                        <SelectTrigger className="border-2 border-amber-800 bg-amber-50 hover:border-amber-900 focus:border-amber-900 focus:ring-amber-900/20 transition-colors duration-200 text-amber-900">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-amber-800 bg-white shadow-lg">
                          <SelectItem value="all" className="focus:bg-amber-50 cursor-pointer text-amber-900 hover:text-amber-900 hover:bg-amber-100 data-[state=checked]:bg-amber-100 data-[state=checked]:text-amber-900">
                            <div className="flex items-center gap-2 py-1">
                              <div className="p-1 rounded-md bg-amber-100/50">
                                <Info className="h-4 w-4 text-amber-800" />
                              </div>
                              <span className="font-medium">All Events</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="expiration" className="focus:bg-amber-50 cursor-pointer text-amber-900 hover:text-amber-900 hover:bg-amber-100 data-[state=checked]:bg-amber-100 data-[state=checked]:text-amber-900">
                            <div className="flex items-center gap-2 py-1">
                              <div className="p-1 rounded-md bg-amber-100/50">
                                <Shield className="h-4 w-4 text-amber-800" />
                              </div>
                              <span className="font-medium">Warranty Expirations</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="maintenance" className="focus:bg-amber-50 cursor-pointer text-amber-900 hover:text-amber-900 hover:bg-amber-100 data-[state=checked]:bg-amber-100 data-[state=checked]:text-amber-900">
                            <div className="flex items-center gap-2 py-1">
                              <div className="p-1 rounded-md bg-amber-100/50">
                                <Wrench className="h-4 w-4 text-amber-800" />
                              </div>
                              <span className="font-medium">Maintenance</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="reminder" className="focus:bg-amber-50 cursor-pointer text-amber-900 hover:text-amber-900 hover:bg-amber-100 data-[state=checked]:bg-amber-100 data-[state=checked]:text-amber-900">
                            <div className="flex items-center gap-2 py-1">
                              <div className="p-1 rounded-md bg-amber-100/50">
                                <AlertTriangle className="h-4 w-4 text-amber-800" />
                              </div>
                              <span className="font-medium">Reminders</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Events */}
              <div className="col-span-12 lg:col-span-8" id="events-section">
                {/* Date Header */}
                <div className="mb-4 p-3 border-2 border-amber-800 rounded-lg bg-amber-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-amber-900">
                        {temporaryDateView 
                          ? temporaryDateView.toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric' 
                            })
                          : showAllEvents 
                            ? 'All Events' 
                            : selectedDate.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric' 
                              })
                        }
                      </h2>
                      <p className="text-sm text-amber-800 mt-1">
                        {getFilteredEvents.length} {getFilteredEvents.length === 1 ? 'event' : 'events'} 
                        {temporaryDateView 
                          ? 'on this day'
                          : showAllEvents 
                            ? 'total' 
                            : 'on this day'
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {temporaryDateView && (
                        <Button
                          onClick={() => setTemporaryDateView(null)}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-800"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Clear Date
                        </Button>
                      )}
                      <Button
                        onClick={handleShowAllToggle}
                        className={`${
                          showAllEvents 
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-800' 
                            : 'bg-amber-800 hover:bg-amber-900 text-white border-2 border-amber-900'
                        } transition-colors duration-200`}
                      >
                        {showAllEvents ? (
                          <>
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Show Daily
                          </>
                        ) : (
                          <>
                            <List className="h-4 w-4 mr-2" />
                            Show All
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center items-center p-6 border-2 border-amber-800 rounded-lg bg-amber-100">
                      <Loader2 className="h-6 w-6 animate-spin text-amber-800" />
                    </div>
                  ) : getFilteredEvents.length === 0 ? (
                    <div className="col-span-full text-center p-6 bg-amber-100 rounded-lg border-2 border-amber-800 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]">
                      <CalendarIcon className="h-10 w-10 mx-auto text-amber-800 mb-3" />
                      <h3 className="text-base font-semibold text-amber-900">No Events</h3>
                      <p className="text-sm text-amber-800">No events scheduled for this date</p>
                      <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="mt-4 bg-amber-800 hover:bg-amber-900 text-white border-2 border-amber-900"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  ) : (
                    getFilteredEvents.map((event) => (
                      <Card
                        key={event._id}
                        className="border-2 border-amber-800 hover:border-amber-900 transition-all duration-200 bg-amber-100 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(120,53,15,0.5)]"
                      >
                        <CardHeader className="border-b-2 border-amber-800 bg-amber-200 py-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-semibold text-amber-900">
                              {event.title}
                            </CardTitle>
                            {getEventTypeBadge(event.eventType)}
                          </div>
                          <p className="text-xs text-amber-800 mt-1">
                            {formatDate(event.startDate)}
                          </p>
                        </CardHeader>
                        <CardContent className="p-3">
                          <p className="text-sm text-amber-800 mb-3 line-clamp-2">{event.description}</p>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewEvent(event)}
                              className="text-amber-800 hover:text-amber-900 hover:bg-amber-200 h-8 px-2 border border-amber-800"
                            >
                              <Info className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEvent(event._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100 h-8 px-2 border border-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* View Event Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-2 border-amber-800 bg-amber-100 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)]">
          {selectedEvent && (
            <>
              <DialogHeader className="border-b-2 border-amber-800 pb-4">
                <DialogTitle className="text-lg font-semibold text-amber-900">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="text-sm text-amber-800">
                  {selectedEvent.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-3 py-3">
                <div className="flex items-center gap-2 p-2 border border-amber-800 rounded-lg bg-amber-50">
                  <CalendarIcon className="h-4 w-4 text-amber-800" />
                  <span className="text-sm text-amber-900">
                    {formatDate(selectedEvent.startDate)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 p-2 border border-amber-800 rounded-lg bg-amber-50">
                  {selectedEvent.eventType === 'warranty' ? (
                    <Shield className="h-4 w-4 text-amber-800" />
                  ) : selectedEvent.eventType === 'maintenance' ? (
                    <Wrench className="h-4 w-4 text-amber-800" />
                  ) : (
                    <Info className="h-4 w-4 text-amber-800" />
                  )}
                  <span className="text-sm text-amber-900">
                    {selectedEvent.eventType.charAt(0).toUpperCase() + selectedEvent.eventType.slice(1)}
                  </span>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEvent(selectedEvent._id)}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 h-9 border-2 border-red-800"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Event
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}