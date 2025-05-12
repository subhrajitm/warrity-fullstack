"use client"

import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import EnhancedProfile from "./components/enhanced-profile"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Profile Settings</h1>
      <EnhancedProfile />
    </div>
  )
}