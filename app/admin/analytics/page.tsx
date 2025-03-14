"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  BarChart3, 
  PieChart,
  TrendingUp,
  Users,
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter
} from "lucide-react"

// Mock data for demonstration
const mockAnalyticsData = {
  totalUsers: 156,
  totalWarranties: 423,
  activeWarranties: 312,
  expiringWarranties: 48,
  expiredWarranties: 63,
  categoryCounts: [
    { name: "Electronics", count: 187, color: "bg-blue-500" },
    { name: "Appliances", count: 98, color: "bg-green-500" },
    { name: "Furniture", count: 56, color: "bg-purple-500" },
    { name: "Clothing", count: 42, color: "bg-pink-500" },
    { name: "Automotive", count: 28, color: "bg-yellow-500" },
    { name: "Other", count: 12, color: "bg-gray-500" }
  ],
  monthlyWarranties: [
    { month: "Jan", count: 28 },
    { month: "Feb", count: 32 },
    { month: "Mar", count: 36 },
    { month: "Apr", count: 42 },
    { month: "May", count: 38 },
    { month: "Jun", count: 46 },
    { month: "Jul", count: 52 },
    { month: "Aug", count: 48 },
    { month: "Sep", count: 56 },
    { month: "Oct", count: 62 },
    { month: "Nov", count: 58 },
    { month: "Dec", count: 64 }
  ],
  topProviders: [
    { name: "Samsung", count: 56 },
    { name: "Apple", count: 48 },
    { name: "LG", count: 36 },
    { name: "Sony", count: 32 },
    { name: "IKEA", count: 28 }
  ]
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the analytics data from your backend
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData)
      setIsLoading(false)
    }, 500)
  }, [router])
  
  // Calculate max value for the bar chart
  const maxMonthlyCount = analyticsData 
    ? Math.max(...analyticsData.monthlyWarranties.map(item => item.count)) 
    : 0
  
  // Calculate total for pie chart
  const totalCategories = analyticsData 
    ? analyticsData.categoryCounts.reduce((sum, item) => sum + item.count, 0)
    : 0
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 p-6 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-amber-800 border-t-transparent rounded-full"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900">Analytics Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="border-2 border-amber-800 text-amber-800"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter Data
            </Button>
            <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
              <BarChart3 className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-amber-800 font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold text-amber-900">{analyticsData.totalUsers}</p>
              </div>
              <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-800" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-amber-800 font-medium mb-1">Total Warranties</p>
                <p className="text-3xl font-bold text-amber-900">{analyticsData.totalWarranties}</p>
              </div>
              <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-800" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-amber-800 font-medium mb-1">Active Warranties</p>
                <p className="text-3xl font-bold text-green-600">{analyticsData.activeWarranties}</p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-amber-800 font-medium mb-1">Expiring Soon</p>
                <p className="text-3xl font-bold text-amber-600">{analyticsData.expiringWarranties}</p>
              </div>
              <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Warranties by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative h-48 w-48">
                  {/* Simple pie chart visualization */}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-amber-50">
                    <span className="text-amber-900 font-bold text-lg">{totalCategories}</span>
                  </div>
                  {analyticsData.categoryCounts.map((category, index) => {
                    const percentage = (category.count / totalCategories) * 100
                    const rotation = index === 0 ? 0 : analyticsData.categoryCounts
                      .slice(0, index)
                      .reduce((sum, cat) => sum + (cat.count / totalCategories) * 360, 0)
                    
                    return (
                      <div 
                        key={category.name}
                        className={`absolute inset-0 ${category.color}`}
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation + percentage * 1.8) * Math.PI / 180)}% ${50 - 50 * Math.sin((rotation + percentage * 1.8) * Math.PI / 180)}%, ${50 + 50 * Math.cos(rotation * Math.PI / 180)}% ${50 - 50 * Math.sin(rotation * Math.PI / 180)}%)`,
                          transform: 'rotate(0deg)'
                        }}
                      />
                    )
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {analyticsData.categoryCounts.map(category => (
                  <div key={category.name} className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${category.color} mr-2`} />
                    <span className="text-amber-900 text-sm">{category.name}</span>
                    <span className="ml-auto text-amber-800 font-medium">{category.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Monthly Warranty Registrations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 flex items-end space-x-2">
                {analyticsData.monthlyWarranties.map(item => {
                  const height = (item.count / maxMonthlyCount) * 100
                  
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-amber-800 rounded-t-sm" 
                        style={{ height: `${height}%` }}
                      />
                      <div className="mt-2 text-xs text-amber-800">{item.month}</div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center text-amber-800">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Yearly Total: {analyticsData.monthlyWarranties.reduce((sum, item) => sum + item.count, 0)}</span>
                </div>
                <div className="text-amber-800 text-sm">
                  Average: {Math.round(analyticsData.monthlyWarranties.reduce((sum, item) => sum + item.count, 0) / 12)} per month
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Top Warranty Providers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {analyticsData.topProviders.map((provider, index) => (
                  <div key={provider.name} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-amber-900">{provider.name}</p>
                      <p className="text-sm text-amber-700">{provider.count} warranties</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-800" 
                          style={{ width: `${(provider.count / analyticsData.topProviders[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Warranty Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                      <span className="text-amber-900">Active</span>
                    </div>
                    <span className="text-amber-800 font-medium">{analyticsData.activeWarranties}</span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${(analyticsData.activeWarranties / analyticsData.totalWarranties) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2" />
                      <span className="text-amber-900">Expiring Soon</span>
                    </div>
                    <span className="text-amber-800 font-medium">{analyticsData.expiringWarranties}</span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500" 
                      style={{ width: `${(analyticsData.expiringWarranties / analyticsData.totalWarranties) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                      <span className="text-amber-900">Expired</span>
                    </div>
                    <span className="text-amber-800 font-medium">{analyticsData.expiredWarranties}</span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${(analyticsData.expiredWarranties / analyticsData.totalWarranties) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-amber-300">
                <div className="flex justify-between items-center">
                  <span className="text-amber-800 font-medium">Total Warranties</span>
                  <span className="text-amber-900 font-bold">{analyticsData.totalWarranties}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}