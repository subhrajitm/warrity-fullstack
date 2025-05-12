"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { ArrowLeft, Calendar as CalendarIcon, Shield, Wrench, AlertTriangle, Info, Plus, Trash2, Loader2 } from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"
import { CalendarFilter, FilterType } from "./components/calendar-filter"
import { EventForm } from "./components/event-form"
import { useCalendarEvents, CalendarEvent } from "@/lib/hooks/use-calendar-events"
import { toast } from "sonner"

export default function CalendarPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  
  // Use our custom hook for events
  const { 
    events, 
    isLoading, 
    error,
    isCreating,
    isDeleting,
    createEvent,
    deleteEvent,
    getEvent
  } = useCalendarEvents()
  
  // Check if user is logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [authLoading, isAuthenticated, router])
  
  // Filter events based on selected date and filter type
  const filteredEvents = events.filter(event => {
    // Convert dates to local timezone for comparison
    const eventDate = new Date(event.startDate)
    const selectedDateObj = new Date(selectedDate)
    
    // Format dates to YYYY-MM-DD for comparison
    const eventDateStr = eventDate.toISOString().split("T")[0]
    const selectedDateStr = selectedDateObj.toISOString().split("T")[0]
    
    // Filter by date and type
    const isSameDay = eventDateStr === selectedDateStr
    const matchesFilter = filterType === "all" || event.eventType === filterType
    
    return isSameDay && matchesFilter
  })
  
  // Get dates with events for highlighting in calendar
  const getDatesWithEvents = () => {
    return events.map(event => {
      const date = new Date(event.startDate)
      date.setHours(0, 0, 0, 0)
      return date
    })
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
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Handle event creation
  const handleCreateEvent = async (eventData: Omit<CalendarEvent, "_id">) => {
    const success = await createEvent(eventData)
    
    if (success) {
      setIsDialogOpen(false)
      
      // Select the date of the new event
      setSelectedDate(new Date(eventData.startDate))
    }
    
    return success
  }
  
  // Handle event deletion
  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const success = await deleteEvent(id)
      
      if (success && isViewDialogOpen) {
        setIsViewDialogOpen(false)
        setSelectedEvent(null)
      }
    }
  }
  
  // View event details
  const handleViewEvent = async (event: CalendarEvent) => {
    try {
      const eventDetails = await getEvent(event._id)
      
      if (eventDetails) {
        setSelectedEvent(eventDetails)
      } else {
        setSelectedEvent(event)
      }
      
      setIsViewDialogOpen(true)
    } catch (error) {
      console.error("Error viewing event:", error)
      setSelectedEvent(event)
      setIsViewDialogOpen(true)
    }
  }
  
  // Update the Calendar component to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }
  
  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-800" />
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">Warranty Calendar</h1>
              <p className="text-amber-700">Track your warranty expirations and maintenance schedules</p>
            </div>
            
            <div className="flex items-center space-x-2">
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
                <DialogContent className="bg-amber-50 border-4 border-amber-800 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-amber-900">Add New Calendar Event</DialogTitle>
                    <DialogDescription className="text-amber-700">
                      Create a new warranty or maintenance event for your products.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <EventForm
                    onSubmit={handleCreateEvent}
                    onCancel={() => setIsDialogOpen(false)}
                    isSubmitting={isCreating}
                    defaultValues={{
                      startDate: selectedDate.toISOString().split("T")[0]
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
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
                    onSelect={handleDateSelect}
                    className="border-2 border-amber-300 rounded-md p-3"
                    modifiers={{
                      hasEvent: getDatesWithEvents()
                    }}
                    modifiersStyles={{
                      hasEvent: {
                        fontWeight: "bold",
                        backgroundColor: "rgba(217, 119, 6, 0.2)",
                        borderRadius: "100%"
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
              
              <CalendarFilter
                value={filterType}
                onChange={setFilterType}
                className="hidden md:block"
              />
            </div>
            
            <div className="md:col-span-3">
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 h-full">
                <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                  <CardTitle className="text-xl font-bold text-amber-900">
                    Events for {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-amber-800" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-600">
                      <p>Error loading events. Please try again later.</p>
                      <Button 
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                      >
                        Refresh
                      </Button>
                    </div>
                  ) : filteredEvents.length > 0 ? (
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
                                {event.allDay ? "All day" : new Date(event.startDate).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}
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
                  {!selectedEvent.allDay && ` at ${new Date(selectedEvent.startDate).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}`}
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
                
                {selectedEvent.notifications?.enabled && (
                  <div>
                    <h4 className="font-semibold text-amber-900">Notifications</h4>
                    <p className="text-amber-700">
                      {selectedEvent.notifications.reminderTime} hours before event
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline"
                  disabled={isDeleting} 
                  onClick={() => handleDeleteEvent(selectedEvent._id)}
                  className="border-2 border-red-800 text-red-800 hover:bg-red-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
                <Button 
                  onClick={() => setIsViewDialogOpen(false)}
                  className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}