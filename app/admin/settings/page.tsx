"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bell, Cog, Save, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data for demonstration
const mockGeneralSettings = {
  siteName: "Warrity",
  supportEmail: "support@warrity.com",
  defaultCurrency: "USD",
  dateFormat: "MM/DD/YYYY"
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [settings, setSettings] = useState(mockGeneralSettings)
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
  
  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSaveSettings = () => {
    console.log("Saving general settings:", settings)
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
                className="border-2 border-amber-800 bg-amber-800 text-amber-100"
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
              General Settings
            </CardTitle>
            <CardDescription className="text-amber-800">
              Configure basic system settings for the Warrity platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-amber-900">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  className="border-2 border-amber-800 bg-amber-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportEmail" className="text-amber-900">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                  className="border-2 border-amber-800 bg-amber-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency" className="text-amber-900">Default Currency</Label>
                <Select 
                  value={settings.defaultCurrency} 
                  onValueChange={(value) => handleInputChange("defaultCurrency", value)}
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
                  value={settings.dateFormat} 
                  onValueChange={(value) => handleInputChange("dateFormat", value)}
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