"use client"

import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import EnhancedProfile from "./components/enhanced-profile"
import WarrantySidebar from "../warranties/components/sidebar"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen bg-amber-50">
      <WarrantySidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-8">Profile Settings</h1>
          <EnhancedProfile />
        </div>
      </div>
    </div>
  )
}