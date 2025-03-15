"use client"

import React from "react"
import AdminSidebar from "./components/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-amber-50">
      <AdminSidebar />
      <div className="ml-64 p-6">
        {children}
      </div>
    </div>
  )
} 