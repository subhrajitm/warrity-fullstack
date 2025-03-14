"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, User, Lock, Bell } from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"

// Mock data for demonstration
const mockUserData = {
  id: 1,
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "555-123-4567",
  joinDate: "2023-01-15",
  preferences: {
    emailNotifications: true,
    reminderDays: 30
  }
}

export default function UserProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    reminderDays: 30
  })
  
  // Check if user is logged in and fetch user data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'user') {
      router.replace(role === 'admin' ? '/admin' : '/login')
    }
    
    // In a real app, you would fetch the user data from your backend
    setUserData(mockUserData)
    
    // Initialize form data with user data
    setFormData({
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      emailNotifications: mockUserData.preferences.emailNotifications,
      reminderDays: mockUserData.preferences.reminderDays
    })
  }, [router])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }))
  }
  
  const handleProfileUpdate = () => {
    console.log("Updating profile:", formData)
    // In a real app, you would send the updated profile to your backend
    alert("Profile updated successfully!")
  }
  
  const handlePasswordUpdate = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    
    console.log("Updating password")
    // In a real app, you would send the password update to your backend
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }))
    
    alert("Password updated successfully!")
  }
  
  const handlePreferencesUpdate = () => {
    console.log("Updating preferences:", {
      emailNotifications: formData.emailNotifications,
      reminderDays: formData.reminderDays
    })
    // In a real app, you would send the updated preferences to your backend
    alert("Preferences updated successfully!")
  }
  
  if (!userData) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading profile data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <WarrantySidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">My Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-amber-900">
                    Account Settings
                  </CardTitle>
                  <TabsList className="bg-amber-300">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="password" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      Password
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      Preferences
                    </TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription className="text-amber-800">
                  Member since {userData.joinDate}
                </CardDescription>
              </CardHeader>
              
              <TabsContent value="profile" className="mt-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-amber-900">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
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
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-amber-900">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-end">
                  <Button 
                    onClick={handleProfileUpdate}
                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="password" className="mt-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-amber-900">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-amber-900">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-amber-900">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-end">
                  <Button 
                    onClick={handlePasswordUpdate}
                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications" className="text-amber-900">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-amber-700">
                          Receive email notifications about your warranties
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => handleCheckboxChange("emailNotifications", checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderDays" className="text-amber-900">Warranty Expiry Reminder</Label>
                      <p className="text-sm text-amber-700 mb-2">
                        Get notified before your warranties expire
                      </p>
                      <Select 
                        value={formData.reminderDays.toString()} 
                        onValueChange={(value) => handleSelectChange("reminderDays", value)}
                      >
                        <SelectTrigger id="reminderDays" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days before</SelectItem>
                          <SelectItem value="14">14 days before</SelectItem>
                          <SelectItem value="30">30 days before</SelectItem>
                          <SelectItem value="60">60 days before</SelectItem>
                          <SelectItem value="90">90 days before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-end">
                  <Button 
                    onClick={handlePreferencesUpdate}
                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Update Preferences
                  </Button>
                </CardFooter>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  )
}