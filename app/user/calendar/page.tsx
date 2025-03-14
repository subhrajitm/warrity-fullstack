"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar as CalendarIcon, Shield, Tool, AlertTriangle, Info } from "lucide-react"
import ProductSidebar from "../products/components/sidebar"

// Mock calendar events
const mockEvents = [
  {
    id: 1,
    title: "Samsung TV Warranty Expiration",
    date: "2025-05-15",
    type: "warranty",
    productId: 1,
    productName: "Samsung 55\" QLED TV"
  },
  {
    id: 2,
    title: "Bosch Dishwasher Warranty Expiration",
    date: "2024-11-03",
    type: "warranty",
    productId: 2,
    productName: "Bosch Dishwasher"
  },
  {
    id: 3,
    title: "MacBook Pro Warranty Expiration",
    date: "2025-01-20",
    type: "warranty",
    productId: 3,
    productName: "MacBook Pro 16\""
  },
  {
    id: 4,
    title: "Dyson V11 Filter Cleaning",
    date: "2023-12-15",
    type: "maintenance",
    productId: 4,
    productName: "Dyson V11 Vacuum"
  },
  {
    id: 5,
    title: "Sony Headphones Warranty Expiration",
    date: "2024-03-05",
    type: "warranty",
    productId: 5,
    productName: "Sony WH-1000XM4 Headphones"
  },
  {
    id: 6,
    title: "MacBook Pro Software Update",
    date: "2023-12-10",
    type: "maintenance",
    productId: 3,
    productName: "MacBook Pro 16\""
  }
];

export default function CalendarPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if user is logged in and fetch events
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'user') {
      router.replace(role === 'admin' ? '/admin' : '/login')
    }
    
    // In a real app, you would fetch the events from your backend
    setEvents(mockEvents)
    setIsLoading(false)
  }, [router])
  
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
  const getEventTypeBadge = (type) => {
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
            <Tool className="mr-1 h-3 w-3" />
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
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <ProductSidebar />
        
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading calendar...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <ProductSidebar />
      
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
                          className="p-4 border-2 border-amber-300 rounded-md bg-amber-50 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-amber-900">{event.title}</h3>
                              <p className="text-sm text-amber-700 mt-1">
                                Product: {event.productName}
                              </p>
                            </div>
                            {getEventTypeBadge(event.type)}
                          </div>
                          
                          <div className="mt-3 flex justify-end">
                            <Link href={`/user/products/${event.productId}`}>
                              <Button variant="outline" className="border-amber-800 text-amber-800 text-sm">
                                View Product
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertTriangle className="mx-auto h-12 w-12 text-amber-300 mb-4" />
                      <h3 className="text-xl font-medium text-amber-900 mb-2">No Events Found</h3>
                      <p className="text-amber-700 mb-6">
                        {filterType !== "all" 
                          ? `No ${filterType} events on this date` 
                          : "There are no events scheduled for this date"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}