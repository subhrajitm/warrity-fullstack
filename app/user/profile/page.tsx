"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import EnhancedProfile from "./components/enhanced-profile"
import WarrantySidebar from "../warranties/components/sidebar"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login?returnUrl=/user/profile")
      } else if (user?.role !== 'user') {
        router.replace(user?.role === 'admin' ? '/admin' : '/login')
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-amber-800 text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== 'user') {
    return null
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