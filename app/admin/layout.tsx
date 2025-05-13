"use client"

import React, { useState } from "react"
import AdminSidebar from "./components/sidebar"
import { Button } from "@/components/ui/button"
import { Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev)
  }

  return (
    <div className="min-h-screen bg-amber-50 flex relative admin-theme">
      {/* Sidebar with transition - now fixed on all screen sizes */}
      <div 
        className={`h-screen transition-all duration-300 ease-in-out fixed top-0 left-0 ${
          sidebarVisible ? 'w-64 opacity-100' : 'w-0 opacity-0'
        } overflow-hidden z-30`}
      >
        <AdminSidebar />
      </div>
      
      {/* Toggle button for small screens - fixed position */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-amber-800 text-amber-100 hover:bg-amber-900 transition-colors md:hidden"
      >
        {sidebarVisible ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarVisible ? 'md:ml-64' : ''}`}>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 