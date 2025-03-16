"use client"

/** @jsxRuntime automatic */
/** @jsxImportSource react */
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Bell, 
  Lock, 
  Save, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  AlertTriangle
} from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"
import { useAuth } from "@/lib/auth-context"

// Mock user data for demonstration
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "555-123-4567",
  notifications: {
    email: true,
    push: true,
    expiringWarranties: true,
    expiredWarranties: true,
    reminderDays: 30
  }
}

export default function UserSettingsPage() {
  const router = useRouter()
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const [user, setUser] = useState<typeof mockUser | null>(null)
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [notificationSettings, setNotificationSettings] = useState({
    email: false,
    push: false,
    expiringWarranties: false,
    expiredWarranties: false,
    reminderDays: 30
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  
  // Check if user is logged in and fetch user data
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (authUser && authUser.role !== 'user') {
        router.replace(authUser.role === 'admin' ? '/admin' : '/login')
      } else {
        // In a real app, you would fetch the user data from your backend
        setUser(mockUser)
        setProfileForm({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone
        })
        setNotificationSettings(mockUser.notifications)
      }
    }
  }, [router, authLoading, isAuthenticated, authUser])
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleNotificationToggle = (name: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }
  
  const handleReminderDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setNotificationSettings(prev => ({
      ...prev,
      reminderDays: value
    }))
  }
  
  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // In a real app, you would send the updated profile data to your backend
    console.log("Updating profile:", profileForm)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Profile updated successfully!")
    }, 1000)
  }
  
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!")
      setIsLoading(false)
      return
    }
    
    // In a real app, you would send the updated password to your backend
    console.log("Updating password")
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Password updated successfully!")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    }, 1000)
  }
  
  const handleNotificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // In a real app, you would send the updated notification settings to your backend
    console.log("Updating notification settings:", notificationSettings)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Notification settings updated successfully!")
    }, 1000)
  }
  
  if (!user) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading user settings...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <WarrantySidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Account Settings</h1>
          
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-amber-200 border-2 border-amber-800">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="password" 
                className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100"
              >
                <Lock className="mr-2 h-4 w-4" />
                Password
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
                <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                  <CardTitle className="text-2xl font-bold text-amber-900">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-amber-800">
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <form onSubmit={handleProfileSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-amber-900">Full Name</Label>
                        <div className="flex">
                          <User className="h-5 w-5 text-amber-800 mr-3 mt-2" />
                          <Input
                            id="name"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            className="border-2 border-amber-800 bg-amber-50"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-amber-900">Email Address</Label>
                        <div className="flex">
                          <Mail className="h-5 w-5 text-amber-800 mr-3 mt-2" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            className="border-2 border-amber-800 bg-amber-50"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-amber-900">Phone Number</Label>
                        <div className="flex">
                          <Phone className="h-5 w-5 text-amber-800 mr-3 mt-2" />
                          <Input
                            id="phone"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            className="border-2 border-amber-800 bg-amber-50"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
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
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
                <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                  <CardTitle className="text-2xl font-bold text-amber-900">
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-amber-800">
                    Update your password
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-amber-900">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="border-2 border-amber-800 bg-amber-50"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-amber-900">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="border-2 border-amber-800 bg-amber-50"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-amber-900">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="border-2 border-amber-800 bg-amber-50"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
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
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
                <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                  <CardTitle className="text-2xl font-bold text-amber-900">
                    Notification Settings
                  </CardTitle>
                  <CardDescription className="text-amber-800">
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <form onSubmit={handleNotificationSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-amber-900">Notification Channels</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5 text-amber-800" />
                            <Label htmlFor="emailNotifications" className="text-amber-900">Email Notifications</Label>
                          </div>
                          <Switch
                            id="emailNotifications"
                            checked={notificationSettings.email}
                            onCheckedChange={() => handleNotificationToggle('email')}
                            className="data-[state=checked]:bg-amber-800"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-5 w-5 text-amber-800" />
                            <Label htmlFor="pushNotifications" className="text-amber-900">Push Notifications</Label>
                          </div>
                          <Switch
                            id="pushNotifications"
                            checked={notificationSettings.push}
                            onCheckedChange={() => handleNotificationToggle('push')}
                            className="data-[state=checked]:bg-amber-800"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-amber-800" />
                            <Label htmlFor="expiringWarranties" className="text-amber-900">Expiring Warranties</Label>
                          </div>
                          <Switch
                            id="expiringWarranties"
                            checked={notificationSettings.expiringWarranties}
                            onCheckedChange={() => handleNotificationToggle('expiringWarranties')}
                            className="data-[state=checked]:bg-amber-800"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-amber-800" />
                            <Label htmlFor="expiredWarranties" className="text-amber-900">Expired Warranties</Label>
                          </div>
                          <Switch
                            id="expiredWarranties"
                            checked={notificationSettings.expiredWarranties}
                            onCheckedChange={() => handleNotificationToggle('expiredWarranties')}
                            className="data-[state=checked]:bg-amber-800"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="reminderDays" className="text-amber-900">
                            Remind me before warranty expires (days)
                          </Label>
                          <div className="flex">
                            <Calendar className="h-5 w-5 text-amber-800 mr-3 mt-2" />
                            <Input
                              id="reminderDays"
                              type="number"
                              min="1"
                              max="365"
                              value={notificationSettings.reminderDays}
                              onChange={handleReminderDaysChange}
                              className="border-2 border-amber-800 bg-amber-50"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
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
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}