"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/lib/auth-context"
import { authApi } from "@/lib/auth-api"
import { userApi } from "@/lib/api"
import { useLocalStorage } from "@/lib/use-local-storage"
import { toast } from "sonner"
import { Camera } from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaskedInput } from "@/components/ui/masked-input"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Save, User, Lock, Bell, Upload, Github, Linkedin, Twitter, Instagram, AlertCircle } from "lucide-react"
import WarrantySidebar from "../warranties/components/sidebar"

// Form validation schema
const profileFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  phone: z.string()
    .regex(/^\+?[\d\s-()]{8,}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  bio: z.string()
    .max(500, "Bio must not exceed 500 characters")
    .optional(),
  twitter: z.string()
    .regex(/^[a-zA-Z0-9_-]{0,50}$/, "Invalid Twitter username")
    .optional(),
  linkedin: z.string()
    .regex(/^[a-zA-Z0-9_-]{0,50}$/, "Invalid LinkedIn username")
    .optional(),
  github: z.string()
    .regex(/^[a-zA-Z0-9_-]{0,50}$/, "Invalid GitHub username")
    .optional(),
  instagram: z.string()
    .regex(/^[a-zA-Z0-9_-]{0,50}$/, "Invalid Instagram username")
    .optional(),
})

export default function UserProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, updateProfile, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState("/placeholder-avatar.jpg")
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  
  // Add form persistence
  const [savedFormState, setSavedFormState] = useLocalStorage<Partial<z.infer<typeof profileFormSchema>>>(
    "profile-form-state",
    {}
  )

  // Initialize form with persisted data
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: savedFormState.name || "",
      phone: savedFormState.phone || "",
      bio: savedFormState.bio || "",
      twitter: savedFormState.twitter || "",
      linkedin: savedFormState.linkedin || "",
      github: savedFormState.github || "",
      instagram: savedFormState.instagram || ""
    }
  })

  // Save form state on change
  useEffect(() => {
    const subscription = profileForm.watch((value) => {
      setSavedFormState(value)
    })
    return () => subscription.unsubscribe()
  }, [profileForm, setSavedFormState])

  // Update form values when user data is loaded
  useEffect(() => {
    if (user && isAuthenticated) {
      profileForm.reset({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        twitter: user.socialLinks?.twitter || "",
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
        instagram: user.socialLinks?.instagram || ""
      })
      
      if (user.profilePicture) {
        setProfileImage(user.profilePicture)
      }
    }
  }, [user, isAuthenticated, profileForm])

  // Add unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (profileForm.formState.isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [profileForm.formState.isDirty])

  // Form submission handlers
  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    setIsProfileSaving(true)
    setError(null)

    try {
      const success = await updateProfile({
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        socialLinks: {
          twitter: data.twitter,
          linkedin: data.linkedin,
          github: data.github,
          instagram: data.instagram
        }
      })

      if (success) {
        toast.success("Profile updated successfully!")
        setSavedFormState(data)
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
  
  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    // Create local preview
    const reader = new FileReader()
    reader.onload = () => {
      setProfileImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsProfileSaving(true)
    setError(null)

    try {
      const response = await userApi.uploadProfilePicture(file)

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data?.url) {
        setProfileImage(response.data.url)
        toast.success("Profile picture updated successfully!")
        refreshUser()
      }
    } catch (err) {
      console.error("Profile picture upload error:", err)
      setError("Failed to upload profile picture. Please try again.")
      // Revert to previous image
      if (user?.profilePicture) {
        setProfileImage(user.profilePicture)
      }
    } finally {
      setIsProfileSaving(false)
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
                  {profileForm.watch("twitter") && (
                    <a href={`https://twitter.com/${profileForm.watch("twitter")}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Twitter size={20} />
                    </a>
                  )}
                  {profileForm.watch("linkedin") && (
                    <a href={`https://linkedin.com/in/${profileForm.watch("linkedin")}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {profileForm.watch("github") && (
                    <a href={`https://github.com/${profileForm.watch("github")}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Github size={20} />
                    </a>
                  )}
                  {profileForm.watch("instagram") && (
                    <a href={`https://instagram.com/${profileForm.watch("instagram")}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-600">
                      <Instagram size={20} />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-2xl font-bold text-amber-900">
                Profile Information
              </CardTitle>
              <CardDescription className="text-amber-800">
                Update your personal information and social media links
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-900">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-2 border-amber-800 bg-amber-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-amber-900">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="border-2 border-amber-800 bg-amber-50 opacity-70"
                      />
                    </div>
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-900">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+1234567890"
                              className="border-2 border-amber-800 bg-amber-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px] border-2 border-amber-800 bg-amber-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-900">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-amber-900 flex items-center">
                              <Twitter className="h-4 w-4 mr-2" />
                              Twitter Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-2 border-amber-800 bg-amber-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-amber-900 flex items-center">
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-2 border-amber-800 bg-amber-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-amber-900 flex items-center">
                              <Github className="h-4 w-4 mr-2" />
                              GitHub Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-2 border-amber-800 bg-amber-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-amber-900 flex items-center">
                              <Instagram className="h-4 w-4 mr-2" />
                              Instagram Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-2 border-amber-800 bg-amber-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
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
                        Save Profile
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}