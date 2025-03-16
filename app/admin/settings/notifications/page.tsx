"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bell, Cog, Save, Shield, Mail, AlertTriangle, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data for demonstration
const mockNotificationSettings = {
  enableEmailNotifications: true,
  sendExpiryReminders: true,
  reminderDays: 30,
  sendWelcomeEmail: true,
  adminNotifyNewUser: true
}

export default function NotificationSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [settings, setSettings] = useState(mockNotificationSettings)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in and fetch settings
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.role !== 'admin') {
        router.replace(user?.role === 'user' ? '/user' : '/login')
      } else {
        // In a real app, you would fetch the settings from your backend
        setIsLoading(false)
      }
    }
  }, [router, authLoading, isAuthenticated, user])
  
  const handleInputChange = (field: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSaveSettings = () => {
    console.log("Saving notification settings:", settings)
    // In a real app, you would send the updated settings to your backend
    alert("Settings saved successfully!")
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-amber-800 text-xl">Loading settings...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900">Settings</h1>
          
          <div className="flex space-x-4">
            <Link href="/admin/settings">
              <Button 
                variant="outline" 
                className="border-2 border-amber-800 text-amber-800 hover:bg-amber-100"
              >
                <Cog className="mr-2 h-4 w-4" />
                General
              </Button>
            </Link>
            
            <Link href="/admin/settings/notifications">
              <Button 
                variant="outline" 
                className="border-2 border-amber-800 bg-amber-800 text-amber-100"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </Link>
            
            <Link href="/admin/settings/security">
              <Button 
                variant="outline" 
                className="border-2 border-amber-800 text-amber-800 hover:bg-amber-100"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
            </Link>
          </div>
        </div>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-2xl font-bold text-amber-900">
              Notification Settings
            </CardTitle>
            <CardDescription className="text-amber-800">
              Configure how and when notifications are sent to users
            </CardDescription>
          </CardHeader>
          
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
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => handleInputChange("enableEmailNotifications", checked)}
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
                  checked={settings.sendExpiryReminders}
                  onCheckedChange={(checked) => handleInputChange("sendExpiryReminders", checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminderDays" className="text-amber-900">Reminder Days Before Expiry</Label>
                <Select 
                  value={settings.reminderDays.toString()} 
                  onValueChange={(value) => handleInputChange("reminderDays", parseInt(value))}
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
                  checked={settings.sendWelcomeEmail}
                  onCheckedChange={(checked) => handleInputChange("sendWelcomeEmail", checked)}
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
                  checked={settings.adminNotifyNewUser}
                  onCheckedChange={(checked) => handleInputChange("adminNotifyNewUser", checked)}
                />
              </div>
            </div>
          </CardContent>
          
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
      </div>
    </div>
  )
} 