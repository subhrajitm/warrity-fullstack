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
import { Save, User, Lock, Bell, Upload, Camera, Github, Linkedin, Twitter, Instagram, AlertCircle } from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { userApi, authApi } from "@/lib/api"
import { toast } from "sonner"

export default function UserProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, updateProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
    if (!isAuthenticated && !authLoading) {
      router.replace('/login')
      return
    }
    
    if (user && isAuthenticated) {
      // Initialize form data with user data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        twitter: user.socialLinks?.twitter || "",
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
        instagram: user.socialLinks?.instagram || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        emailNotifications: user.preferences?.emailNotifications || true,
        reminderDays: user.preferences?.reminderDays || 30
      })
      
      if (user.profilePicture) {
        setProfileImage(user.profilePicture)
      }
    }
  }, [user, isAuthenticated, authLoading, router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }))
  }
  
  const handleProfileUpdate = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Prepare profile data
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        socialLinks: {
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          github: formData.github,
          instagram: formData.instagram
        }
      }
      
      const success = await updateProfile(profileData)
      
      if (success) {
        toast.success("Profile updated successfully!")
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } catch (err) {
      console.error("Profile update error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handlePasswordUpdate = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match!")
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      
      if (response.error) {
        setError(response.error)
        return
      }
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))
      
      toast.success("Password updated successfully!")
    } catch (err) {
      console.error("Password update error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handlePreferencesUpdate = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const preferencesData = {
        preferences: {
          emailNotifications: formData.emailNotifications,
          reminderDays: formData.reminderDays
        }
      }
      
      const success = await updateProfile(preferencesData)
      
      if (success) {
        toast.success("Preferences updated successfully!")
      } else {
        setError("Failed to update preferences. Please try again.")
      }
    } catch (err) {
      console.error("Preferences update error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      setError(null)
      
      try {
        // Create a local preview
        const imageUrl = URL.createObjectURL(file)
        setProfileImage(imageUrl)
        
        // Upload the image to the server
        const response = await userApi.uploadProfilePicture(file)
        
        if (response.error) {
          setError(response.error)
          return
        }
        
        if (response.data?.url) {
          // Update the profile image with the server URL
          setProfileImage(response.data.url)
          toast.success("Profile picture updated successfully!")
        }
      } catch (err) {
        console.error("Profile picture upload error:", err)
        setError("Failed to upload profile picture. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <div className="flex items-center">
            <div className="animate-spin mr-3 h-5 w-5 border-2 border-amber-800 border-t-transparent rounded-full" />
            <p className="text-amber-800 text-xl">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Please log in to view your profile.</p>
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
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-md flex items-center text-red-800">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
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
                  disabled={isLoading}
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
                <h2 className="text-2xl font-bold text-amber-900">{user?.name}</h2>
                <p className="text-amber-700">{user?.email}</p>
                <p className="text-amber-600 text-sm mt-1">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  {formData.twitter && (
                    <a href={`https://twitter.com/${formData.twitter}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Twitter size={20} />
                    </a>
                  )}
                  {formData.linkedin && (
                    <a href={`https://linkedin.com/in/${formData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {formData.github && (
                    <a href={`https://github.com/${formData.github}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Github size={20} />
                    </a>
                  )}
                  {formData.instagram && (
                    <a href={`https://instagram.com/${formData.instagram}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
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
                  <TabsList className="bg-amber-300 border-2 border-amber-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      <Lock className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <TabsContent value="profile" className="mt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label htmlFor="email" className="text-amber-900">Email</Label>
                        <Input 
                          id="email" 
                          name="email"
                          value={formData.email} 
                          onChange={handleInputChange}
                          disabled
                          className="border-2 border-amber-800 bg-amber-50 opacity-70" 
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-amber-900">Bio</Label>
                      <Textarea 
                        id="bio" 
                        name="bio"
                        value={formData.bio} 
                        onChange={handleInputChange}
                        className="min-h-[100px] border-2 border-amber-800 bg-amber-50" 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-amber-900">Social Links</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="twitter" className="text-amber-900 flex items-center">
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter Username
                          </Label>
                          <Input 
                            id="twitter" 
                            name="twitter"
                            value={formData.twitter} 
                            onChange={handleInputChange}
                            className="border-2 border-amber-800 bg-amber-50" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="linkedin" className="text-amber-900 flex items-center">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn Username
                          </Label>
                          <Input 
                            id="linkedin" 
                            name="linkedin"
                            value={formData.linkedin} 
                            onChange={handleInputChange}
                            className="border-2 border-amber-800 bg-amber-50" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="github" className="text-amber-900 flex items-center">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub Username
                          </Label>
                          <Input 
                            id="github" 
                            name="github"
                            value={formData.github} 
                            onChange={handleInputChange}
                            className="border-2 border-amber-800 bg-amber-50" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="instagram" className="text-amber-900 flex items-center">
                            <Instagram className="h-4 w-4 mr-2" />
                            Instagram Username
                          </Label>
                          <Input 
                            id="instagram" 
                            name="instagram"
                            value={formData.instagram} 
                            onChange={handleInputChange}
                            className="border-2 border-amber-800 bg-amber-50" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleProfileUpdate} 
                      className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-amber-100 border-t-transparent rounded-full" />
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-900">Change Password</h3>
                    
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
                    
                    <Button 
                      onClick={handlePasswordUpdate} 
                      className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-amber-100 border-t-transparent rounded-full" />
                          Updating...
                        </div>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-amber-900">Email Notifications</h3>
                        <p className="text-sm text-amber-700">Receive email notifications for warranty expirations and updates</p>
                      </div>
                      <Switch 
                        checked={formData.emailNotifications} 
                        onCheckedChange={(checked) => handleCheckboxChange('emailNotifications', checked)}
                        className="data-[state=checked]:bg-amber-800"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderDays" className="text-amber-900">
                        Reminder Days Before Expiration
                      </Label>
                      <Select 
                        value={formData.reminderDays.toString()} 
                        onValueChange={(value) => handleSelectChange('reminderDays', value)}
                      >
                        <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
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
                    
                    <Button 
                      onClick={handlePreferencesUpdate} 
                      className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-amber-100 border-t-transparent rounded-full" />
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  )
}