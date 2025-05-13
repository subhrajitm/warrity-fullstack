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
import { ArrowLeft, Bell, Cog, Save, Shield, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data for demonstration
const mockSecuritySettings = {
  passwordMinLength: 8,
  requireSpecialChars: true,
  requireNumbers: true,
  sessionTimeout: 60,
  maxLoginAttempts: 5
}

export default function SecuritySettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [settings, setSettings] = useState(mockSecuritySettings)
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
  
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSaveSettings = () => {
    console.log("Saving security settings:", settings)
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
                className="border-2 border-amber-800 text-amber-800 hover:bg-amber-100"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </Link>
            
            <Link href="/admin/settings/security">
              <Button 
                variant="outline" 
                className="border-2 border-amber-800 bg-amber-800 text-amber-100"
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
              Security Settings
            </CardTitle>
            <CardDescription className="text-amber-800">
              Configure security and authentication settings for the platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength" className="text-amber-900">Minimum Password Length</Label>
                <Select 
                  value={settings.passwordMinLength.toString()} 
                  onValueChange={(value) => handleInputChange("passwordMinLength", parseInt(value))}
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
                  checked={settings.requireSpecialChars}
                  onCheckedChange={(checked) => handleInputChange("requireSpecialChars", checked)}
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
                  checked={settings.requireNumbers}
                  onCheckedChange={(checked) => handleInputChange("requireNumbers", checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-amber-900">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value))}
                  className="border-2 border-amber-800 bg-amber-50"
                  min="5"
                  max="240"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts" className="text-amber-900">Max Login Attempts</Label>
                <Select 
                  value={settings.maxLoginAttempts.toString()} 
                  onValueChange={(value) => handleInputChange("maxLoginAttempts", parseInt(value))}
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