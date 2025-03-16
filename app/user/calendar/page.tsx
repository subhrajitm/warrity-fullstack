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
import { ArrowLeft, Calendar as CalendarIcon, Shield, Wrench, AlertTriangle, Info, Plus, Trash2 } from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"
import { useAuth } from "@/lib/auth-context"

// Define the event type
interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  productId: number;
  productName: string;
  description?: string;
  time?: string;
  reminder?: boolean;
}

// Mock products for the dropdown
const mockProducts = [
  { id: 1, name: "Samsung 55\" QLED TV" },
  { id: 2, name: "Bosch Dishwasher" },
  { id: 3, name: "MacBook Pro 16\"" },
  { id: 4, name: "Dyson V11 Vacuum" },
  { id: 5, name: "Sony WH-1000XM4 Headphones" },
  { id: 6, name: "iPhone 13 Pro" },
  { id: 7, name: "LG Refrigerator" },
];

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Samsung TV Warranty Expiration",
    date: "2025-05-15",
    type: "warranty",
    productId: 1,
    productName: "Samsung 55\" QLED TV",
    description: "Extended warranty expires on this date. Consider renewal options.",
    time: "09:00"
  },
  {
    id: 2,
    title: "Bosch Dishwasher Warranty Expiration",
    date: "2024-11-03",
    type: "warranty",
    productId: 2,
    productName: "Bosch Dishwasher",
    description: "Standard manufacturer warranty expires.",
    time: "00:00"
  },
  {
    id: 3,
    title: "MacBook Pro Warranty Expiration",
    date: "2025-01-20",
    type: "warranty",
    productId: 3,
    productName: "MacBook Pro 16\"",
    description: "AppleCare+ coverage ends. Consider extending protection.",
    time: "00:00"
  },
  {
    id: 4,
    title: "Dyson V11 Filter Cleaning",
    date: "2023-12-15",
    type: "maintenance",
    productId: 4,
    productName: "Dyson V11 Vacuum",
    description: "Regular maintenance: Clean the filter for optimal performance.",
    time: "10:00"
  },
  {
    id: 5,
    title: "Sony Headphones Warranty Expiration",
    date: "2024-03-05",
    type: "warranty",
    productId: 5,
    productName: "Sony WH-1000XM4 Headphones",
    description: "Manufacturer warranty expires.",
    time: "00:00"
  },
  {
    id: 6,
    title: "MacBook Pro Software Update",
    date: "2023-12-10",
    type: "maintenance",
    productId: 3,
    productName: "MacBook Pro 16\"",
    description: "Scheduled software update and system cleanup.",
    time: "14:00"
  }
];

export default function CalendarPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: "",
    date: new Date().toISOString().split('T')[0],
    type: "warranty",
    productId: 0,
    productName: "",
    description: "",
    time: "09:00",
    reminder: true
  })
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  
  // Check if user is logged in and fetch events
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user && user.role !== 'user') {
        router.replace(user.role === 'admin' ? '/admin' : '/login')
      } else {
        // In a real app, you would fetch the events from your backend
        setEvents(mockEvents)
      }
      setIsLoading(false)
    }
  }, [router, authLoading, isAuthenticated, user])
  
  // Filter events based on selected date and filter type
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    const isSameDay = 
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    
    return isSameDay && (filterType === "all" || event.type === filterType)
  })
  
  // Get dates with events for highlighting in calendar
  const getDatesWithEvents = () => {
    return events.map(event => new Date(event.date))
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
  
  // Handle product selection
  const handleProductSelect = (productId: number) => {
    const product = mockProducts.find(p => p.id === productId)
    if (product) {
      setNewEvent(prev => ({
        ...prev,
        productId,
        productName: product.name
      }))
    }
  }
  
  // Handle event creation
  const handleCreateEvent = () => {
    // Validate form
    if (!newEvent.title || !newEvent.date || !newEvent.productId) {
      alert("Please fill in all required fields")
      return
    }
    
    // Create new event
    const newEventWithId: CalendarEvent = {
      ...newEvent,
      id: events.length + 1
    }
    
    // Add to events list
    setEvents(prev => [...prev, newEventWithId])
    
    // Reset form and close dialog
    setNewEvent({
      title: "",
      date: new Date().toISOString().split('T')[0],
      type: "warranty",
      productId: 0,
      productName: "",
      description: "",
      time: "09:00",
      reminder: true
    })
    setIsDialogOpen(false)
    
    // Select the date of the new event
    setSelectedDate(new Date(newEvent.date))
  }
  
  // Handle event deletion
  const handleDeleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(event => event.id !== id))
      setIsViewDialogOpen(false)
    }
  }
  
  // View event details
  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsViewDialogOpen(true)
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
                </SelectContent>
              </Select>
              
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
                        <Label htmlFor="date" className="text-amber-900">Date</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={newEvent.date} 
                          onChange={(e) => handleNewEventChange('date', e.target.value)}
                          className="border-2 border-amber-800 bg-amber-50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-amber-900">Time (optional)</Label>
                        <Input 
                          id="time" 
                          type="time" 
                          value={newEvent.time} 
                          onChange={(e) => handleNewEventChange('time', e.target.value)}
                          className="border-2 border-amber-800 bg-amber-50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-amber-900">Event Type</Label>
                      <Select 
                        value={newEvent.type} 
                        onValueChange={(value) => handleNewEventChange('type', value)}
                      >
                        <SelectTrigger id="type" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warranty">Warranty</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-amber-900">Related Product</Label>
                      <Select 
                        value={newEvent.productId.toString()} 
                        onValueChange={(value) => handleProductSelect(parseInt(value))}
                      >
                        <SelectTrigger id="product" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map(product => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
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
                          key={event.id} 
                          className="p-4 border-2 border-amber-300 rounded-md bg-amber-50 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewEvent(event)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-amber-900">{event.title}</h3>
                              <p className="text-amber-700 text-sm mt-1">
                                {event.productName}
                                {event.time && event.time !== "00:00" && ` • ${event.time}`}
                              </p>
                            </div>
                            {getEventTypeBadge(event.type)}
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
                  {getEventTypeBadge(selectedEvent.type)}
                </div>
                <DialogDescription className="text-amber-700">
                  {formatDate(selectedEvent.date)}
                  {selectedEvent.time && selectedEvent.time !== "00:00" && ` at ${selectedEvent.time}`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-semibold text-amber-900">Product</h4>
                  <p className="text-amber-700">{selectedEvent.productName}</p>
                </div>
                
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
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
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