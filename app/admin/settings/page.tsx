"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, Save, Shield, UserCog } from "lucide-react"
import AdminSidebar from "../components/sidebar"

// Mock data for demonstration
const mockSettings = {
  general: {
    siteName: "Warranty Manager",
    supportEmail: "support@warrantymanager.com",
    defaultCurrency: "USD",
    dateFormat: "MM/DD/YYYY"
  },
  notifications: {
    enableEmailNotifications: true,
    sendExpiryReminders: true,
    reminderDays: 30,
    sendWelcomeEmail: true,
    adminNotifyNewUser: true
  },
  security: {
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5
  }
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState(mockSettings)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in and fetch settings
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the settings from your backend
    setIsLoading(false)
  }, [router])
  
  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }
  
  const handleSaveSettings = () => {
    console.log("Saving settings:", settings)
    // In a real app, you would send the updated settings to your backend
    alert("Settings saved successfully!")
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <AdminSidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading settings...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Admin Settings</h1>
          
          <Tabs defaultValue="general" className="w-full">
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-amber-900">
                    System Configuration
                  </CardTitle>
                  <TabsList className="bg-amber-300">
                    <TabsTrigger value="general" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100">
                      Security
                    </TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription className="text-amber-800">
                  Configure system-wide settings for the warranty management platform
                </CardDescription>
              </CardHeader>
              
              <TabsContent value="general" className="mt-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName" className="text-amber-900">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e) => handleInputChange("general", "siteName", e.target.value)}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail" className="text-amber-900">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.general.supportEmail}
                        onChange={(e) => handleInputChange("general", "supportEmail", e.target.value)}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency" className="text-amber-900">Default Currency</Label>
                      <Select 
                        value={settings.general.defaultCurrency} 
                        onValueChange={(value) => handleInputChange("general", "defaultCurrency", value)}
                      >
                        <SelectTrigger id="defaultCurrency" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat" className="text-amber-900">Date Format</Label>
                      <Select 
                        value={settings.general.dateFormat} 
                        onValueChange={(value) => handleInputChange("general", "dateFormat", value)}
                      >
                        <SelectTrigger id="dateFormat" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableEmailNotifications" className="text-amber-900">
                          Enable Email Notifications
                        </Label>
                        <p className="text-sm text-amber-700">
                          Send email notifications to users for important events
                        </p>
                      </div>
                      <Switch
                        id="enableEmailNotifications"
                        checked={settings.notifications.enableEmailNotifications}
                        onCheckedChange={(checked) => handleInputChange("notifications", "enableEmailNotifications", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sendExpiryReminders" className="text-amber-900">
                          Send Warranty Expiry Reminders
                        </Label>
                        <p className="text-sm text-amber-700">
                          Notify users when their warranties are about to expire
                        </p>
                      </div>
                      <Switch
                        id="sendExpiryReminders"
                        checked={settings.notifications.sendExpiryReminders}
                        onCheckedChange={(checked) => handleInputChange("notifications", "sendExpiryReminders", checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderDays" className="text-amber-900">Reminder Days Before Expiry</Label>
                      <Select 
                        value={settings.notifications.reminderDays.toString()} 
                        onValueChange={(value) => handleInputChange("notifications", "reminderDays", parseInt(value))}
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
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sendWelcomeEmail" className="text-amber-900">
                          Send Welcome Email
                        </Label>
                        <p className="text-sm text-amber-700">
                          Send a welcome email when a new user registers
                        </p>
                      </div>
                      <Switch
                        id="sendWelcomeEmail"
                        checked={settings.notifications.sendWelcomeEmail}
                        onCheckedChange={(checked) => handleInputChange("notifications", "sendWelcomeEmail", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="adminNotifyNewUser" className="text-amber-900">
                          Notify Admin of New Users
                        </Label>
                        <p className="text-sm text-amber-700">
                          Send notification to admin when a new user registers
                        </p>
                      </div>
                      <Switch
                        id="adminNotifyNewUser"
                        checked={settings.notifications.adminNotifyNewUser}
                        onCheckedChange={(checked) => handleInputChange("notifications", "adminNotifyNewUser", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength" className="text-amber-900">Minimum Password Length</Label>
                      <Select 
                        value={settings.security.passwordMinLength.toString()} 
                        onValueChange={(value) => handleInputChange("security", "passwordMinLength", parseInt(value))}
                      >
                        <SelectTrigger id="passwordMinLength" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 characters</SelectItem>
                          <SelectItem value="8">8 characters</SelectItem>
                          <SelectItem value="10">10 characters</SelectItem>
                          <SelectItem value="12">12 characters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireSpecialChars" className="text-amber-900">
                          Require Special Characters
                        </Label>
                        <p className="text-sm text-amber-700">
                          Passwords must contain at least one special character
                        </p>
                      </div>
                      <Switch
                        id="requireSpecialChars"
                        checked={settings.security.requireSpecialChars}
                        onCheckedChange={(checked) => handleInputChange("security", "requireSpecialChars", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireNumbers" className="text-amber-900">
                          Require Numbers
                        </Label>
                        <p className="text-sm text-amber-700">
                          Passwords must contain at least one number
                        </p>
                      </div>
                      <Switch
                        id="requireNumbers"
                        checked={settings.security.requireNumbers}
                        onCheckedChange={(checked) => handleInputChange("security", "requireNumbers", checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout" className="text-amber-900">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleInputChange("security", "sessionTimeout", parseInt(e.target.value))}
                        className="border-2 border-amber-800 bg-amber-50"
                        min="5"
                        max="240"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts" className="text-amber-900">Max Login Attempts</Label>
                      <Select 
                        value={settings.security.maxLoginAttempts.toString()} 
                        onValueChange={(value) => handleInputChange("security", "maxLoginAttempts", parseInt(value))}
                      >
                        <SelectTrigger id="maxLoginAttempts" className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select attempts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  )
}