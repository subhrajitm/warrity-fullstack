"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertCircle, UserCog, Save } from "lucide-react"
import AdminSidebar from "../../../components/sidebar"

// Mock user data for demonstration
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "user",
  status: "active",
  createdAt: "2023-01-15"
}

export default function AdminEditUserPage({ params }) {
  // Fix: Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const userId = unwrappedParams.id;
  
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the user data from your backend
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      status: mockUser.status
    })
  }, [router, userId]) // Use unwrapped userId instead of params.id
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    // Validate form
    if (!formData.name || !formData.email || !formData.role || !formData.status) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }
    
    // In a real app, you would send the form data to your backend
    console.log(`Updating user with ID: ${userId}`, formData) // Use unwrapped userId
    
    setTimeout(() => {
      setIsLoading(false)
      alert("User updated successfully!")
      router.push(`/admin/users/${userId}`) // Use unwrapped userId
    }, 1000)
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="mb-6">
          <Link href={`/admin/users/${userId}`} className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Details
          </Link>
        </div>
        
        <Card className="max-w-2xl mx-auto border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <div className="flex items-center">
              <UserCog className="mr-3 h-6 w-6 text-amber-900" />
              <div>
                <CardTitle className="text-2xl font-bold text-amber-900">
                  Edit User
                </CardTitle>
                <CardDescription className="text-amber-800">
                  Update user information for ID: {params.id}
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
            <Link href={`/admin/users/${params.id}`}>
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
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}