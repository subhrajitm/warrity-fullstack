"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Camera, Save, Shield, Mail, Globe, Phone, User, AlertCircle, Loader2 } from "lucide-react"
import { userApi } from "@/lib/api"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[\d\s-()]{8,}$/, "Invalid phone number format").optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  socialLinks: z.object({
    twitter: z.string().refine((val) => !val || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val), {
      message: "Invalid Twitter URL"
    }).optional(),
    linkedin: z.string().refine((val) => !val || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val), {
      message: "Invalid LinkedIn URL"
    }).optional(),
    github: z.string().refine((val) => !val || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val), {
      message: "Invalid GitHub URL"
    }).optional(),
    instagram: z.string().refine((val) => !val || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val), {
      message: "Invalid Instagram URL"
    }).optional(),
  }).optional(),
  preferences: z.object({
    emailNotifications: z.boolean().optional(),
    reminderDays: z.number().min(1).max(365).optional(),
    notifications: z.boolean().optional(),
    theme: z.string().optional(),
    language: z.string().optional(),
  }).optional(),
})

export default function EnhancedProfile() {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      socialLinks: user?.socialLinks || {
        twitter: "",
        linkedin: "",
        github: "",
        instagram: "",
      },
      preferences: user?.preferences || {
        emailNotifications: true,
        reminderDays: 7,
        notifications: true,
        theme: "light",
        language: "en",
      },
    },
  })

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0
    const fields = [
      user.name,
      user.phone,
      user.bio,
      user.profilePicture,
    ]
    const completedFields = fields.filter(Boolean).length
    return Math.round((completedFields / fields.length) * 100)
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Profile picture must be less than 5MB")
        return
      }
      setProfilePicture(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      let profilePictureUrl = user?.profilePicture;

      // Handle profile picture upload separately if changed
      if (profilePicture) {
        const uploadResponse = await userApi.uploadProfilePicture(profilePicture);
        if (uploadResponse.error) {
          throw new Error(uploadResponse.error);
        }
        if (uploadResponse.data?.url) {
          profilePictureUrl = uploadResponse.data.url;
        }
      }

      const success = await updateProfile({
        ...data,
        profilePicture: profilePictureUrl,
      });

      if (success) {
        toast.success("Profile updated successfully");
        // Clear the preview URL after successful update
        setPreviewUrl(null);
        setProfilePicture(null);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-2xl font-bold text-amber-900">Profile Completion</CardTitle>
          <CardDescription className="text-amber-800">
            Complete your profile to unlock all features
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-amber-900 font-medium">Profile Completion</span>
              <Badge variant="outline" className="border-2 border-amber-800 text-amber-800">
                {calculateProfileCompletion()}%
              </Badge>
            </div>
            <Progress value={calculateProfileCompletion()} className="h-2 bg-amber-200" />
            {calculateProfileCompletion() < 100 && (
              <p className="text-sm text-amber-700">
                Add more information to your profile to increase your completion percentage
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-2xl font-bold text-amber-900">Profile Information</CardTitle>
              <CardDescription className="text-amber-800">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 border-4 border-amber-800">
                    <AvatarImage 
                      src={previewUrl || (user?.profilePicture ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || ''}${user.profilePicture}` : undefined)} 
                      alt={user?.name || "Profile picture"}
                      crossOrigin="anonymous"
                    />
                    <AvatarFallback className="bg-amber-200 text-amber-800">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <label
                      htmlFor="profile-picture"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-amber-800 text-amber-100 rounded-md hover:bg-amber-900 transition-colors"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </label>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                    <p className="text-xs text-amber-700 mt-1">Max file size: 5MB</p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-2xl font-bold text-amber-900">Social Links</CardTitle>
              <CardDescription className="text-amber-800">
                Add your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="socialLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Twitter</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://twitter.com/username"
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialLinks.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://linkedin.com/in/username"
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialLinks.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">GitHub</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://github.com/username"
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialLinks.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Instagram</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://instagram.com/username"
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-2xl font-bold text-amber-900">Preferences</CardTitle>
              <CardDescription className="text-amber-800">
                Customize your notification and display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="preferences.emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-amber-900">Email Notifications</FormLabel>
                        <FormDescription className="text-amber-700">
                          Receive email notifications for important updates
                        </FormDescription>
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
                  control={form.control}
                  name="preferences.notifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-amber-900">Push Notifications</FormLabel>
                        <FormDescription className="text-amber-700">
                          Receive push notifications for reminders and updates
                        </FormDescription>
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
                  control={form.control}
                  name="preferences.reminderDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Reminder Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={365}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                        />
                      </FormControl>
                      <FormDescription className="text-amber-700">
                        Number of days before an event to send reminders (1-365)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-800 hover:bg-amber-900 text-white border-2 border-amber-900"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 