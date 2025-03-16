"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Filter,
  Download,
  Search,
  MapPin,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

// Mock data for user analytics
const mockUserAnalytics = {
  totalUsers: 1256,
  activeUsers: 987,
  newUsersThisMonth: 124,
  inactiveUsers: 145,
  usersByRegion: [
    { region: "North America", count: 456, percentage: 36.3 },
    { region: "Europe", count: 324, percentage: 25.8 },
    { region: "Asia", count: 287, percentage: 22.8 },
    { region: "South America", count: 98, percentage: 7.8 },
    { region: "Africa", count: 56, percentage: 4.5 },
    { region: "Oceania", count: 35, percentage: 2.8 }
  ],
  usersByDevice: [
    { device: "Mobile", count: 678, percentage: 54 },
    { device: "Desktop", count: 432, percentage: 34.4 },
    { device: "Tablet", count: 146, percentage: 11.6 }
  ],
  usersByAge: [
    { range: "18-24", count: 187, percentage: 14.9 },
    { range: "25-34", count: 432, percentage: 34.4 },
    { range: "35-44", count: 324, percentage: 25.8 },
    { range: "45-54", count: 176, percentage: 14 },
    { range: "55-64", count: 98, percentage: 7.8 },
    { range: "65+", count: 39, percentage: 3.1 }
  ],
  userGrowth: [
    { month: "Jan", count: 956 },
    { month: "Feb", count: 978 },
    { month: "Mar", count: 1023 },
    { month: "Apr", count: 1045 },
    { month: "May", count: 1078 },
    { month: "Jun", count: 1102 },
    { month: "Jul", count: 1132 },
    { month: "Aug", count: 1156 },
    { month: "Sep", count: 1187 },
    { month: "Oct", count: 1212 },
    { month: "Nov", count: 1234 },
    { month: "Dec", count: 1256 }
  ],
  userActivity: [
    { type: "Daily Active", count: 456, percentage: 36.3 },
    { type: "Weekly Active", count: 678, percentage: 54 },
    { type: "Monthly Active", count: 842, percentage: 67 },
    { type: "Quarterly Active", count: 932, percentage: 74.2 }
  ],
  warrantyRegistrations: [
    { month: "Jan", count: 78 },
    { month: "Feb", count: 82 },
    { month: "Mar", count: 96 },
    { month: "Apr", count: 102 },
    { month: "May", count: 88 },
    { month: "Jun", count: 106 },
    { month: "Jul", count: 112 },
    { month: "Aug", count: 98 },
    { month: "Sep", count: 116 },
    { month: "Oct", count: 122 },
    { month: "Nov", count: 118 },
    { month: "Dec", count: 124 }
  ],
  topUsersByWarranties: [
    { name: "John Smith", email: "john.smith@example.com", warranties: 12 },
    { name: "Emma Johnson", email: "emma.j@example.com", warranties: 9 },
    { name: "Michael Brown", email: "m.brown@example.com", warranties: 8 },
    { name: "Sarah Davis", email: "sarah.d@example.com", warranties: 7 },
    { name: "Robert Wilson", email: "r.wilson@example.com", warranties: 6 }
  ]
}

export default function UserAnalyticsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [userData, setUserData] = useState<typeof mockUserAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("year")
  const [regionFilter, setRegionFilter] = useState("all")
  
  // Check if admin is logged in
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.role !== 'admin') {
        router.replace(user?.role === 'user' ? '/user' : '/login')
      } else {
        // In a real app, you would fetch the user analytics data from your backend
        setTimeout(() => {
          setUserData(mockUserAnalytics)
          setIsLoading(false)
        }, 500)
      }
    }
  }, [router, authLoading, isAuthenticated, user])
  
  // Calculate max value for the bar chart
  const maxUserGrowth = userData 
    ? Math.max(...userData.userGrowth.map(item => item.count)) 
    : 0
  
  // Calculate total for pie chart
  const totalUsersByRegion = userData 
    ? userData.usersByRegion.reduce((sum, item) => sum + item.count, 0)
    : 0
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-amber-800 text-xl">Loading user analytics data...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/analytics" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Analytics Dashboard
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">User Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Select 
              value={timeRange} 
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[150px] border-2 border-amber-800 bg-amber-50">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={regionFilter} 
              onValueChange={setRegionFilter}
            >
              <SelectTrigger className="w-[150px] border-2 border-amber-800 bg-amber-50">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {userData.usersByRegion.map(region => (
                  <SelectItem key={region.region} value={region.region.toLowerCase()}>
                    {region.region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            className="border-2 border-amber-800 text-amber-800"
          >
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
          
          <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold text-amber-900">{userData.totalUsers}</p>
            </div>
            <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-800" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium mb-1">Active Users</p>
              <p className="text-3xl font-bold text-green-600">{userData.activeUsers}</p>
            </div>
            <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium mb-1">New This Month</p>
              <p className="text-3xl font-bold text-blue-600">{userData.newUsersThisMonth}</p>
            </div>
            <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium mb-1">Inactive Users</p>
              <p className="text-3xl font-bold text-red-600">{userData.inactiveUsers}</p>
            </div>
            <div className="h-12 w-12 bg-red-200 rounded-full flex items-center justify-center">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Growth & Users by Region */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-end space-x-2">
              {userData.userGrowth.map(item => {
                const height = (item.count / maxUserGrowth) * 100
                
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
                <span className="text-sm">Growth Rate: +{Math.round((userData.userGrowth[11].count - userData.userGrowth[0].count) / userData.userGrowth[0].count * 100)}%</span>
              </div>
              <div className="text-amber-800 text-sm">
                New Users: +{userData.userGrowth[11].count - userData.userGrowth[0].count}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Users by Region
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {userData.usersByRegion.map(region => (
                <div key={region.region} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-amber-800 mr-2" />
                      <span className="text-amber-900 font-medium">{region.region}</span>
                    </div>
                    <span className="text-amber-800">{region.count} ({region.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-800" 
                      style={{ width: `${region.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-amber-300">
              <div className="flex justify-between items-center">
                <span className="text-amber-800 font-medium">Total Users</span>
                <span className="text-amber-900 font-bold">{totalUsersByRegion}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Users by Age & Users by Device */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Users by Age Group
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex h-64 items-end space-x-8 justify-center">
              {userData.usersByAge.map(ageGroup => (
                <div key={ageGroup.range} className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-amber-800 rounded-t-sm" 
                    style={{ height: `${ageGroup.percentage * 2}%` }}
                  />
                  <div className="mt-2 text-xs text-amber-800">{ageGroup.range}</div>
                  <div className="text-xs text-amber-700">{ageGroup.count}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-amber-300">
              <div className="flex justify-between items-center">
                <span className="text-amber-800 font-medium">Largest Age Group</span>
                <span className="text-amber-900 font-bold">
                  {userData.usersByAge.reduce((prev, current) => 
                    (prev.count > current.count) ? prev : current
                  ).range} ({userData.usersByAge.reduce((prev, current) => 
                    (prev.count > current.count) ? prev : current
                  ).percentage}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Users by Device
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <div className="relative h-48 w-48">
                {/* Simple pie chart visualization */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-amber-50">
                  <span className="text-amber-900 font-bold text-lg">{userData.totalUsers}</span>
                </div>
                {userData.usersByDevice.map((device, index) => {
                  const percentage = device.percentage
                  const rotation = index === 0 ? 0 : userData.usersByDevice
                    .slice(0, index)
                    .reduce((sum, dev) => sum + dev.percentage, 0) * 3.6
                  
                  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"]
                  
                  return (
                    <div 
                      key={device.device}
                      className={`absolute inset-0 ${colors[index]}`}
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation + percentage * 3.6) * Math.PI / 180)}% ${50 - 50 * Math.sin((rotation + percentage * 3.6) * Math.PI / 180)}%, ${50 + 50 * Math.cos(rotation * Math.PI / 180)}% ${50 - 50 * Math.sin(rotation * Math.PI / 180)}%)`,
                        transform: 'rotate(0deg)'
                      }}
                    />
                  )
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {userData.usersByDevice.map((device, index) => {
                const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"]
                
                return (
                  <div key={device.device} className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${colors[index]} mb-1`} />
                    <span className="text-amber-900 text-sm font-medium">{device.device}</span>
                    <span className="text-amber-800 text-xs">{device.count} ({device.percentage}%)</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Activity & Top Users by Warranties */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {userData.userActivity.map(activity => (
                <div key={activity.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-amber-800 mr-2" />
                      <span className="text-amber-900 font-medium">{activity.type}</span>
                    </div>
                    <span className="text-amber-800">{activity.count} ({activity.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-800" 
                      style={{ width: `${activity.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-amber-300">
              <div className="flex justify-between items-center">
                <span className="text-amber-800 font-medium">Engagement Rate</span>
                <span className="text-amber-900 font-bold">
                  {Math.round(userData.userActivity[0].count / userData.totalUsers * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Top Users by Warranty Registrations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {userData.topUsersByWarranties.map((user, index) => (
                <div key={user.email} className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-amber-900">{user.name}</p>
                    <p className="text-sm text-amber-700">{user.email}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-amber-800 hover:bg-amber-900">
                      {user.warranties} warranties
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-amber-300">
              <Button 
                variant="outline" 
                className="w-full border-2 border-amber-800 text-amber-800"
              >
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Warranty Registrations by Month */}
      <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-xl font-bold text-amber-900">
            Warranty Registrations by Month
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 flex items-end space-x-2">
            {userData.warrantyRegistrations.map(item => {
              const maxCount = Math.max(...userData.warrantyRegistrations.map(i => i.count))
              const height = (item.count / maxCount) * 100
              
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
              <BarChart3 className="h-4 w-4 mr-1" />
              <span className="text-sm">Total Registrations: {userData.warrantyRegistrations.reduce((sum, item) => sum + item.count, 0)}</span>
            </div>
            <div className="text-amber-800 text-sm">
              Average: {Math.round(userData.warrantyRegistrations.reduce((sum, item) => sum + item.count, 0) / userData.warrantyRegistrations.length)} per month
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 