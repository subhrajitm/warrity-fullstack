"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, UserPlus, User, Mail, Lock, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AdminAddUserPage() {
  const router = useRouter()
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    status: "active"
  })
  
  // Check if admin is logged in
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (authUser?.role !== 'admin') {
        router.replace(authUser?.role === 'user' ? '/user' : '/login')
      }
    }
  }, [router, authLoading, isAuthenticated, authUser])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    
    console.log("Creating new user:", formData)
    
    // In a real app, you would send the data to your backend
    
    // Redirect to users list
    router.push('/admin/users')
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/admin/users" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </div>
        
        <Card className="max-w-2xl mx-auto border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <div className="flex items-center">
              <UserPlus className="mr-3 h-6 w-6 text-amber-900" />
              <div>
                <CardTitle className="text-2xl font-bold text-amber-900">
                  Add New User
                </CardTitle>
                <CardDescription className="text-amber-800">
                  Create a new user account
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-amber-900">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-900">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-amber-900">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-amber-900">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-amber-900">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-amber-900">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-between">
            <Link href="/admin/users">
              <Button variant="outline" className="border-2 border-amber-800 text-amber-800">
                Cancel
              </Button>
            </Link>
            
            <Button 
              type="submit"
              onClick={handleSubmit}
              className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
            >
              <Save className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}