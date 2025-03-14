"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clock, AlertTriangle, Calendar, Package, Shield } from "lucide-react"
import NotificationSidebar from "./components/sidebar"
import ProductSidebar from "../products/components/sidebar"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  
  // Check if user is logged in and fetch notifications
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'user') {
      router.replace(role === 'admin' ? '/admin' : '/login')
    }
    
    // In a real app, you would fetch the notifications from your backend
    setNotifications(mockNotifications)
  }, [router])
  
  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true
    if (activeFilter === "unread") return !notification.read
    if (activeFilter === "warranty") return notification.type.includes("warranty")
    if (activeFilter === "maintenance") return notification.type.includes("maintenance")
    return true
  })
  
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }
  
  const getNotificationIcon = (type) => {
    switch(type) {
      case "warranty-expiring":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "warranty-expired":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "maintenance-reminder":
        return <Calendar className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-amber-500" />
    }
  }
  
  const getNotificationBadge = (notification) => {
    if (!notification.read) {
      return <Badge className="bg-amber-500 text-white">New</Badge>
    }
    return null
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <ProductSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Notifications</h1>
            <p className="text-amber-700">Stay updated on your product warranties and maintenance</p>
          </div>
          
          {notifications.some(n => !n.read) && (
            <Button 
              variant="outline" 
              className="border-amber-800 text-amber-800 hover:bg-amber-100"
              onClick={markAllAsRead}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>
        
        <div className="mb-6 flex space-x-2">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"}
            className={activeFilter === "all" ? "bg-amber-800 text-amber-100" : "border-amber-800 text-amber-800"}
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "unread" ? "default" : "outline"}
            className={activeFilter === "unread" ? "bg-amber-800 text-amber-100" : "border-amber-800 text-amber-800"}
            onClick={() => setActiveFilter("unread")}
          >
            Unread
          </Button>
          <Button 
            variant={activeFilter === "warranty" ? "default" : "outline"}
            className={activeFilter === "warranty" ? "bg-amber-800 text-amber-100" : "border-amber-800 text-amber-800"}
            onClick={() => setActiveFilter("warranty")}
          >
            Warranty
          </Button>
          <Button 
            variant={activeFilter === "maintenance" ? "default" : "outline"}
            className={activeFilter === "maintenance" ? "bg-amber-800 text-amber-100" : "border-amber-800 text-amber-800"}
            onClick={() => setActiveFilter("maintenance")}
          >
            Maintenance
          </Button>
        </div>
        
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <Card 
                key={notification.id} 
                className={`border-2 ${notification.read ? 'border-amber-300 bg-amber-50' : 'border-amber-800 bg-amber-100'} hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => {
                  markAsRead(notification.id)
                  // In a real app, you would navigate to the product page
                  router.push(`/user/products/${notification.product.id}`)
                }}
              >
                <CardContent className="p-4 flex items-start">
                  <div className="mr-4 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${notification.read ? 'text-amber-800' : 'text-amber-900'}`}>
                        {notification.title}
                      </h3>
                      {getNotificationBadge(notification)}
                    </div>
                    
                    <p className={`text-sm ${notification.read ? 'text-amber-600' : 'text-amber-700'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-xs text-amber-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {notification.date}
                      </div>
                      
                      <div className="flex items-center">
                        {notification.type.includes('warranty') ? (
                          <div className="flex items-center text-xs text-amber-500">
                            <Shield className="h-3 w-3 mr-1" />
                            Warranty
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-amber-500">
                            <Package className="h-3 w-3 mr-1" />
                            Maintenance
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-amber-800 rounded-lg bg-amber-100">
            <Bell className="mx-auto h-12 w-12 text-amber-300 mb-4" />
            <h3 className="text-xl font-medium text-amber-900 mb-2">No Notifications</h3>
            <p className="text-amber-700">
              {activeFilter !== "all" ? 
                `You don't have any ${activeFilter} notifications at the moment.` : 
                "You're all caught up! No new notifications."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}