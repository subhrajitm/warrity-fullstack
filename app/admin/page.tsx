"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { 
  Package, 
  Users, 
  LogOut, 
  BarChart3, 
  Clock, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react"

// Mock data for demonstration
const mockStats = {
  totalUsers: 128,
  totalWarranties: 342,
  activeWarranties: 256,
  expiringWarranties: 45,
  expiredWarranties: 41
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  
  // Check if user is logged in as admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the dashboard data from your backend
    setStats(mockStats)
  }, [router])
  
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      // Clear user data from localStorage
      localStorage.removeItem('userLoggedIn')
      localStorage.removeItem('userRole')
      
      // Redirect to login page
      router.push('/login')
    }
  }
  
  if (!stats) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-amber-800 text-xl">Loading dashboard data...</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <Card className="max-w-6xl mx-auto border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-3xl font-bold text-[rgb(146,64,14)] font-mono tracking-tight">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-amber-800 font-medium">
            Manage warranties, products, and users
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-amber-800 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-amber-900">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-amber-800 mr-3" />
                  <span className="text-3xl font-bold text-amber-900">{stats.totalUsers}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-amber-800 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-amber-900">Total Warranties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-amber-800 mr-3" />
                  <span className="text-3xl font-bold text-amber-900">{stats.totalWarranties}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-amber-800 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-amber-900">Warranty Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-amber-900">Active</span>
                    </div>
                    <span className="font-semibold text-amber-900">{stats.activeWarranties}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="text-amber-900">Expiring Soon</span>
                    </div>
                    <span className="font-semibold text-amber-900">{stats.expiringWarranties}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-amber-900">Expired</span>
                    </div>
                    <span className="font-semibold text-amber-900">{stats.expiredWarranties}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/admin/products">
              <Button className="w-full h-24 bg-amber-800 hover:bg-amber-900 text-amber-100 font-medium border-2 border-amber-900 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]">
                <Package className="h-6 w-6 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/warranties">
              <Button className="w-full h-24 bg-amber-800 hover:bg-amber-900 text-amber-100 font-medium border-2 border-amber-900 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]">
                <BarChart3 className="h-6 w-6 mr-2" />
                Manage Warranties
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button className="w-full h-24 bg-amber-800 hover:bg-amber-900 text-amber-100 font-medium border-2 border-amber-900 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]">
                <Users className="h-6 w-6 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Button 
              className="w-full h-24 bg-amber-800 hover:bg-amber-900 text-amber-100 font-medium border-2 border-amber-900 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]"
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6 mr-2" />
              Logout
            </Button>
          </div>
          
          <div className="mt-8">
            <Card className="border-2 border-amber-800 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-amber-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <div>
                      <p className="font-medium text-amber-900">New user registered</p>
                      <p className="text-sm text-amber-700">john.doe@example.com</p>
                    </div>
                    <p className="text-sm text-amber-700">2 hours ago</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <div>
                      <p className="font-medium text-amber-900">Warranty added</p>
                      <p className="text-sm text-amber-700">Samsung TV - Electronics</p>
                    </div>
                    <p className="text-sm text-amber-700">5 hours ago</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <div>
                      <p className="font-medium text-amber-900">Warranty updated</p>
                      <p className="text-sm text-amber-700">MacBook Pro - Apple Inc.</p>
                    </div>
                    <p className="text-sm text-amber-700">Yesterday</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-amber-900">Warranty expired</p>
                      <p className="text-sm text-amber-700">IKEA Sofa - Furniture</p>
                    </div>
                    <p className="text-sm text-amber-700">2 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}