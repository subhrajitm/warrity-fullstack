"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Save, Shield, Mail, Globe, Phone, User, AlertCircle } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[\d\s-()]{8,}$/, "Invalid phone number format").optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  socialLinks: z.object({
    twitter: z.string().url("Invalid Twitter URL").optional(),
    linkedin: z.string().url("Invalid LinkedIn URL").optional(),
    github: z.string().url("Invalid GitHub URL").optional(),
    instagram: z.string().url("Invalid Instagram URL").optional(),
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
      user.socialLinks?.twitter,
      user.socialLinks?.linkedin,
      user.socialLinks?.github,
      user.socialLinks?.instagram,
    ]
    const completedFields = fields.filter(Boolean).length
    return Math.round((completedFields / fields.length) * 100)
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
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
      const success = await updateProfile({
        ...data,
        profilePicture: profilePicture,
      })
      if (success) {
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

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
                    <AvatarImage src={previewUrl || user?.profilePicture} />
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
                          className="border-2 border-amber-800 bg-amber-50"
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
                          className="border-2 border-amber-800 bg-amber-50"
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
                          className="border-2 border-amber-800 bg-amber-50"
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
                          className="border-2 border-amber-800 bg-amber-50"
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
                          className="border-2 border-amber-800 bg-amber-50"
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
                          className="border-2 border-amber-800 bg-amber-50"
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
                          className="border-2 border-amber-800 bg-amber-50"
                        />
                      </FormControl>
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
              className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
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
        </form>
      </Form>
    </div>
  )
} 