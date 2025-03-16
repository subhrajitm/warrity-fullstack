"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"

// Mock user data for demonstration
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "555-123-4567",
  address: "123 Main St, Anytown, USA",
  role: "user",
  status: "active"
}

// Mock auth data (remove this when real auth is implemented)
const mockAuth = {
  user: {
    role: 'admin'
  },
  isAuthenticated: true
}

interface Props {
  userId: string;
}

export default function AdminEditUserForm({ userId }: Props) {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    status: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch user data
  useEffect(() => {
    // In a real app, you would fetch the user data based on the ID
    console.log(`Fetching user with ID: ${userId} for editing`)
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      setUserData({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        address: mockUser.address,
        role: mockUser.role,
        status: mockUser.status
      })
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [userId])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setUserData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      console.log("Submitting updated user data:", userData)
      
      // Wait for console to flush and state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Navigate to user details
      router.push(`/admin/users/${userId}`)
    } catch (error) {
      console.error('Error updating user:', error)
      alert("Failed to update user. Please try again.")
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-amber-800 text-xl">Loading user data...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link href={`/admin/users/${userId}`} className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Details
        </Link>
      </div>
      
      <Card className="max-w-2xl mx-auto border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-2xl font-bold text-amber-900">
            Edit User
          </CardTitle>
          <CardDescription className="text-amber-800">
            Update the user information for {userData.name}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form id="editUserForm" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-amber-900">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-900">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-amber-900">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-amber-900">Role</Label>
                  <Select 
                    value={userData.role} 
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-amber-900">Status</Label>
                  <Select 
                    value={userData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-amber-900">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  className="border-2 border-amber-800 bg-amber-50"
                />
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-between">
          <Link href={`/admin/users/${userId}`}>
            <Button variant="outline" className="border-2 border-amber-800 text-amber-800">
              Cancel
            </Button>
          </Link>
          
          <Button 
            type="submit"
            form="editUserForm"
            className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 