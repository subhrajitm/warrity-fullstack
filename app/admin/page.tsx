"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  // Check if admin is logged in
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user && user.role !== 'admin') {
        router.replace(user.role === 'user' ? '/user' : '/login')
      }
    }
  }, [isAuthenticated, isLoading, router, user])
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="text-amber-800 text-xl flex items-center">
          <div className="animate-spin mr-3 h-5 w-5 border-2 border-amber-800 border-t-transparent rounded-full" />
          Loading...
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-amber-800 text-sm font-medium">Total Products</p>
                <h3 className="text-3xl font-bold text-amber-900 mt-1">124</h3>
              </div>
              <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-amber-800 text-sm font-medium">Total Users</p>
                <h3 className="text-3xl font-bold text-amber-900 mt-1">1,254</h3>
              </div>
              <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-amber-800 text-sm font-medium">Total Warranties</p>
                <h3 className="text-3xl font-bold text-amber-900 mt-1">3,872</h3>
              </div>
              <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-amber-800 text-sm font-medium">Expired Warranties</p>
                <h3 className="text-3xl font-bold text-amber-900 mt-1">245</h3>
              </div>
              <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 lg:col-span-2">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              <BarChart3 className="inline-block mr-2 h-5 w-5" />
              Warranty Statistics
            </CardTitle>
            <CardDescription className="text-amber-800">
              Overview of warranty status across all users
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <p className="text-amber-800">Chart placeholder - Warranty statistics by status</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Warranty Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-amber-900">Active</span>
                </div>
                <span className="font-bold text-amber-900">2,458</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-amber-900">Expiring Soon</span>
                </div>
                <span className="font-bold text-amber-900">1,169</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-amber-900">Expired</span>
                </div>
                <span className="font-bold text-amber-900">245</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-4 border-amber-800 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-xl font-bold text-amber-900">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-amber-800">
            Latest actions across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start pb-4 border-b border-amber-200 last:border-0 last:pb-0">
                <div className="h-10 w-10 bg-amber-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="h-5 w-5 text-amber-800" />
                </div>
                <div>
                  <p className="text-amber-900 font-medium">New user registered</p>
                  <p className="text-amber-700 text-sm">John Doe created a new account</p>
                  <p className="text-amber-500 text-xs mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}