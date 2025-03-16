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
  AlertTriangle,
  AlertCircle
} from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { authApi } from "@/lib/auth-api"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock user data type
interface MockUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferences?: {
    emailNotifications: boolean;
    reminderDays: number;
  };
}

// Mock user data for demonstration
const mockUser: MockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  preferences: {
    emailNotifications: true,
    reminderDays: 30
  }
}

// Form validation schemas
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional()
})

const passwordFormSchema = z.object({
  currentPassword: z.string()
    .min(8, "Current password must be at least 8 characters"),
  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
    .min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  reminderDays: z.number()
    .min(1, "Reminder days must be at least 1")
    .max(365, "Reminder days must not exceed 365")
    .default(30),
})

// Add password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  const strength = getStrength(password);
  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
      case 3:
        return "bg-yellow-500";
      case 4:
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 h-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-full w-full rounded-full ${i < strength ? getColor() : "bg-gray-200"}`}
          />
        ))}
      </div>
      <p className="text-sm text-amber-700">
        {strength === 0 && "Very weak"}
        {strength === 1 && "Weak"}
        {strength === 2 && "Fair"}
        {strength === 3 && "Good"}
        {strength === 4 && "Strong"}
        {strength === 5 && "Very strong"}
      </p>
    </div>
  );
};

export default function UserSettingsPage() {
  const router = useRouter()
  const { user: authUser, isAuthenticated, isLoading: authLoading, updateProfile } = useAuth()
  const [user, setUser] = useState<MockUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)
  const [isPreferencesSaving, setIsPreferencesSaving] = useState(false)
  const [isProfileSaving, setIsProfileSaving] = useState(false)

  // Initialize forms
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      reminderDays: 30
    }
  })

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    }
  })

  // Update form values when user data is loaded
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (authUser && authUser.role !== 'user') {
        router.replace(authUser.role === 'admin' ? '/admin' : '/login')
      } else {
        setUser(mockUser)
        profileForm.reset({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone
        })
        notificationsForm.reset({
          emailNotifications: mockUser.preferences?.emailNotifications || true,
          reminderDays: mockUser.preferences?.reminderDays || 30
        })
      }
    }
  }, [router, authLoading, isAuthenticated, authUser, notificationsForm, profileForm])

  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    setIsProfileSaving(true)
    setError(null)

    try {
      const success = await updateProfile({
        name: data.name,
        phone: data.phone
      })

      if (success) {
        toast.success("Profile updated successfully!")
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } catch (err) {
      console.error("Profile update error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsProfileSaving(false)
    }
  }

  // Form submission handlers
  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    setIsPasswordSaving(true)
    setError(null)

    try {
      const response = await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })

      if (response.error) {
        setError(response.error)
        return
      }

      passwordForm.reset()
      toast.success("Password updated successfully!")
    } catch (err) {
      console.error("Password update error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsPasswordSaving(false)
    }
  }

  const onNotificationsSubmit = async (data: z.infer<typeof notificationsFormSchema>) => {
    setIsPreferencesSaving(true)
    setError(null)

    try {
      const success = await updateProfile({
        preferences: {
          emailNotifications: data.emailNotifications,
          reminderDays: data.reminderDays
        }
      })

      if (success) {
        toast.success("Notification preferences updated successfully!")
      } else {
        setError("Failed to update notification preferences. Please try again.")
      }
    } catch (err) {
      console.error("Notification preferences update error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsPreferencesSaving(false)
    }
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
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-md flex items-center text-red-800">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="profile" className="w-full">
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
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-amber-900">Full Name</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <User className="h-5 w-5 text-amber-800 mr-3 mt-2" />
                                <Input
                                  {...field}
                                  className="border-2 border-amber-800 bg-amber-50"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-amber-900">Email Address</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <Mail className="h-5 w-5 text-amber-800 mr-3 mt-2" />
                                <Input
                                  {...field}
                                  type="email"
                                  disabled
                                  className="border-2 border-amber-800 bg-amber-50 opacity-70"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-amber-900">Phone Number</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <Phone className="h-5 w-5 text-amber-800 mr-3 mt-2" />
                                <Input
                                  {...field}
                                  className="border-2 border-amber-800 bg-amber-50"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit"
                        className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                        disabled={isProfileSaving}
                      >
                        {isProfileSaving ? (
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
                    </form>
                  </Form>
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
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-amber-900">Change Password</h3>
                        
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-amber-900">Current Password</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  className="border-2 border-amber-800 bg-amber-50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-amber-900">New Password</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  className="border-2 border-amber-800 bg-amber-50"
                                />
                              </FormControl>
                              <PasswordStrengthIndicator password={field.value} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-amber-900">Confirm New Password</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  className="border-2 border-amber-800 bg-amber-50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                        disabled={isPasswordSaving}
                      >
                        {isPasswordSaving ? (
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
                    </form>
                  </Form>
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
                  <Form {...notificationsForm}>
                    <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div>
                              <FormLabel className="text-lg font-semibold text-amber-900">Email Notifications</FormLabel>
                              <p className="text-sm text-amber-700">Receive email notifications for warranty expirations and updates</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-amber-800"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="reminderDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-amber-900">Reminder Days Before Expiration</FormLabel>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value: string) => field.onChange(parseInt(value))}
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit"
                        className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                        disabled={isPreferencesSaving}
                      >
                        {isPreferencesSaving ? (
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
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}