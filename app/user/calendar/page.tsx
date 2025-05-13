"use client"

import { useState, useEffect, useCallback } from "react"
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
import { ArrowLeft, Calendar as CalendarIcon, Shield, Wrench, AlertTriangle, Info, Plus, Trash2, Loader2, XCircle } from "lucide-react"
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

// Map frontend event types to backend
const eventTypeMap = {
  expiration: 'warranty' as EventType,
  maintenance: 'maintenance' as EventType,
  reminder: 'reminder' as EventType
}

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

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.startDate) {
      toast.error("Please fill in all required fields")
      return
    }
    
    try {
      setIsCreating(true)
      
      // Create optimistic event
      const optimisticEvent: CalendarEvent = {
        ...newEvent,
        _id: 'temp-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Add optimistic event to state
      setEvents(prev => [...prev, optimisticEvent])
      
      // Format event data to match API requirements
      const formattedEvent = {
        title: newEvent.title,
        description: newEvent.description || '',
        date: new Date(newEvent.startDate).toISOString(),
        type: eventTypeMap[newEvent.eventType as keyof typeof eventTypeMap] || 'reminder',
        warranty: newEvent.relatedWarranty || undefined,
        allDay: newEvent.allDay || false,
        color: newEvent.color || '#3498db',
        notifications: newEvent.notifications || {
          enabled: true,
          reminderTime: 24
        }
      }
      
      const response = await fetch(
        apiEndpoints.events.list,
        createApiRequest(apiEndpoints.events.list, 'POST', formattedEvent)
      )
      
      if (!response.ok) {
        // Remove optimistic event on failure
        setEvents(prev => prev.filter(e => e._id !== optimisticEvent._id))
        const errorMessage = await handleApiError(response)
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      const createdEvent = data.event || data
      
      if (createdEvent && createdEvent._id) {
        // Replace optimistic event with real event
        setEvents(prev => prev.map(e => 
          e._id === optimisticEvent._id ? createdEvent : e
        ))
        
        // Reset form and close dialog
        setNewEvent({
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
        setIsDialogOpen(false)
        
        // Select the date of the new event
        setSelectedDate(new Date(createdEvent.startDate))
        
        // Clear cache for events
        ApiCache.removeFromCache(apiEndpoints.events.list)
        
        toast.success("Event created successfully")
      } else {
        throw new Error('Invalid event data returned')
      }
    } catch (error) {
      toast.error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCreating(false)
    }
  }
  
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
    }
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
    return events.map(event => {
      const date = new Date(event.startDate)
      date.setHours(0, 0, 0, 0)
      return date
    })
  }
  
  // Filter events based on selected date and type
  const filteredEvents = events.filter(event => {
    // Convert dates to local timezone for comparison
    const eventDate = new Date(event.startDate)
    const selectedDateObj = new Date(selectedDate)
    
    // Format dates to YYYY-MM-DD for comparison
    const eventDateStr = eventDate.toISOString().split('T')[0]
    const selectedDateStr = selectedDateObj.toISOString().split('T')[0]
    
    const isSameDay = eventDateStr === selectedDateStr
    const matchesFilter = filterType === "all" || 
      (filterType === "expiration" && event.eventType === "warranty") ||
      (event.eventType === filterType)
    
    return isSameDay && matchesFilter
  })
  
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
    <div className="min-h-screen bg-amber-50">
      <div className="flex h-screen">
        <WarrantySidebar />
        
        <main className="flex-1 p-6 ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="text-amber-900 hover:bg-amber-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-amber-900">Calendar</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <Select
                  value={filterType}
                  onValueChange={(value) => setFilterType(value as FilterType)}
                >
                  <SelectTrigger className="w-[180px] border-2 border-amber-800 bg-amber-50 text-amber-900">
                    <SelectValue placeholder="Filter events" />
                  </SelectTrigger>
                  <SelectContent className="bg-amber-50 text-amber-900">
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="expiration">Warranty Expirations</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="reminder">Reminders</SelectItem>
                  </SelectContent>
                </Select>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-800 hover:bg-amber-900 text-amber-50">
                      <Plus className="h-4 w-4 mr-2" />
                      New Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] border-2 border-amber-800 bg-amber-50">
                    <DialogHeader>
                      <DialogTitle className="text-amber-900">Create New Event</DialogTitle>
                      <DialogDescription className="text-amber-800">
                        Add a new event to your calendar
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title" className="text-amber-900">Title</Label>
                        <Input
                          id="title"
                          value={newEvent.title}
                          onChange={(e) => handleNewEventChange('title', e.target.value)}
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="description" className="text-amber-900">Description</Label>
                        <Textarea
                          id="description"
                          value={newEvent.description}
                          onChange={(e) => handleNewEventChange('description', e.target.value)}
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="eventType" className="text-amber-900">Event Type</Label>
                        <Select
                          value={newEvent.eventType}
                          onValueChange={(value) => handleNewEventChange('eventType', value)}
                        >
                          <SelectTrigger className="border-2 border-amber-800 bg-amber-50 text-amber-900">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent className="bg-amber-50 text-amber-900">
                            <SelectItem value="warranty">Warranty Expiration</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="reminder">Reminder</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="date" className="text-amber-900">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newEvent.startDate}
                          onChange={(e) => handleNewEventChange('startDate', e.target.value)}
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleCreateEvent}
                        disabled={isCreating}
                        className="bg-amber-800 hover:bg-amber-900 text-amber-50"
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
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2 border-amber-800 bg-amber-50">
                <CardHeader className="border-b-2 border-amber-300 bg-amber-100">
                  <CardTitle className="text-amber-900">Calendar</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="[&_.rdp]:text-amber-900 [&_.rdp-button]:text-amber-900 [&_.rdp-nav_button]:text-amber-900 [&_.rdp-head_cell]:text-amber-900 [&_.rdp-day]:text-amber-900 [&_.rdp-day_selected]:bg-amber-800 [&_.rdp-day_selected]:text-white [&_.rdp-day_today]:bg-amber-100 [&_.rdp-day_today]:text-amber-900">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      modifiers={{ hasEvent: getDatesWithEvents() }}
                      modifiersStyles={{
                        hasEvent: {
                          backgroundColor: 'rgb(146, 64, 14)',
                          color: 'white',
                          borderRadius: '50%'
                        }
                      }}
                      className="rounded-lg border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-amber-800 bg-amber-50">
                <CardHeader className="border-b-2 border-amber-300 bg-amber-100">
                  <CardTitle className="text-amber-900">Events for {formatDate(selectedDate.toISOString())}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-800" />
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center text-amber-800 py-8">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No events for this date</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events
                        .filter(event => {
                          const eventDate = new Date(event.startDate).toDateString()
                          const selectedDateStr = selectedDate.toDateString()
                          return eventDate === selectedDateStr
                        })
                        .map(event => (
                          <div
                            key={event._id}
                            className="p-4 rounded-lg border-2 border-amber-300 bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
                            onClick={() => handleViewEvent(event)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-amber-900">{event.title}</h3>
                                <p className="text-sm text-amber-800 mt-1">{event.description}</p>
                              </div>
                              {getEventTypeBadge(event.eventType)}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      {/* View Event Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-2 border-amber-800 bg-amber-50">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-amber-900">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="text-amber-800">
                  {selectedEvent.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-amber-800" />
                  <span className="text-amber-900">
                    {formatDate(selectedEvent.startDate)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedEvent.eventType === 'warranty' ? (
                    <Shield className="h-4 w-4 text-amber-800" />
                  ) : selectedEvent.eventType === 'maintenance' ? (
                    <Wrench className="h-4 w-4 text-amber-800" />
                  ) : (
                    <Info className="h-4 w-4 text-amber-800" />
                  )}
                  <span className="text-amber-900">
                    {selectedEvent.eventType.charAt(0).toUpperCase() + selectedEvent.eventType.slice(1)}
                  </span>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEvent(selectedEvent._id)}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
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