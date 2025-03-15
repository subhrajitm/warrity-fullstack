"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, User, Lock, Bell, Upload, Camera, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"

// Mock data for demonstration
const mockUserData = {
  id: 1,
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "555-123-4567",
  joinDate: "2023-01-15",
  bio: "Product enthusiast and tech lover. I enjoy tracking warranties for all my gadgets and appliances.",
  profilePicture: "/placeholder-avatar.jpg",
  socialLinks: {
    twitter: "johnsmith",
    linkedin: "john-smith-123",
    github: "johnsmith-dev",
    instagram: "johnsmith_official"
  },
  preferences: {
    emailNotifications: true,
    reminderDays: 30
  }
}

export default function UserProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [userData, setUserData] = useState(null)
  const [profileImage, setProfileImage] = useState("/placeholder-avatar.jpg")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    twitter: "",
    linkedin: "",
    github: "",
    instagram: "",
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
    setProfileImage(mockUserData.profilePicture)
    
    // Initialize form data with user data
    setFormData({
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      bio: mockUserData.bio || "",
      twitter: mockUserData.socialLinks?.twitter || "",
      linkedin: mockUserData.socialLinks?.linkedin || "",
      github: mockUserData.socialLinks?.github || "",
      instagram: mockUserData.socialLinks?.instagram || "",
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
  
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload this file to your backend
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
      
      // You would typically upload the image here
      console.log("File selected:", file)
    }
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
          
          {/* Profile Header with Avatar */}
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-800">
                  <Image 
                    src={profileImage} 
                    alt="Profile" 
                    width={128} 
                    height={128} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <button 
                  onClick={handleProfilePictureClick}
                  className="absolute bottom-0 right-0 bg-amber-800 text-amber-100 p-2 rounded-full hover:bg-amber-900 transition-colors"
                >
                  <Camera size={16} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-amber-900">{userData.name}</h2>
                <p className="text-amber-700">{userData.email}</p>
                <p className="text-amber-600 text-sm mt-1">Member since {userData.joinDate}</p>
                
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  {userData.socialLinks?.twitter && (
                    <a href={`https://twitter.com/${userData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Twitter size={20} />
                    </a>
                  )}
                  {userData.socialLinks?.linkedin && (
                    <a href={`https://linkedin.com/in/${userData.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {userData.socialLinks?.github && (
                    <a href={`https://github.com/${userData.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Github size={20} />
                    </a>
                  )}
                  {userData.socialLinks?.instagram && (
                    <a href={`https://instagram.com/${userData.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Instagram size={20} />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
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
                    <TabsTrigger value="social" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      Social
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
                  Update your personal information and account settings
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-amber-900">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                        placeholder="Tell us a bit about yourself..."
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
              
              <TabsContent value="social" className="mt-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-amber-900 flex items-center">
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter Username
                      </Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
                        placeholder="username (without @)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-amber-900 flex items-center">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn Username
                      </Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
                        placeholder="your-linkedin-id"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-amber-900 flex items-center">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub Username
                      </Label>
                      <Input
                        id="github"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
                        placeholder="username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-amber-900 flex items-center">
                        <Instagram className="mr-2 h-4 w-4" />
                        Instagram Username
                      </Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="border-2 border-amber-800 bg-amber-50"
                        placeholder="username (without @)"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-end">
                  <Button 
                    onClick={handleProfileUpdate}
                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Social Links
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
                      <div>
                        <Label htmlFor="emailNotifications" className="text-amber-900">Email Notifications</Label>
                        <p className="text-sm text-amber-700">Receive email notifications for warranty updates</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => handleCheckboxChange("emailNotifications", checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderDays" className="text-amber-900">Reminder Days Before Expiry</Label>
                      <Select 
                        value={formData.reminderDays.toString()} 
                        onValueChange={(value) => handleSelectChange("reminderDays", value)}
                      >
                        <SelectTrigger id="reminderDays" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
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