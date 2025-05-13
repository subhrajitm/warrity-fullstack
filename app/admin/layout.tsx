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
    <div className="min-h-screen bg-amber-50 flex relative">
      {/* Sidebar with transition - now fixed on all screen sizes */}
      <div 
        className={`h-screen transition-all duration-300 ease-in-out fixed top-0 left-0 ${
          sidebarVisible ? 'w-64 opacity-100' : 'w-0 opacity-0'
        } overflow-hidden z-30`}
      >
        <AdminSidebar />
      </div>
      
      {/* Toggle button for small screens - fixed position */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleSidebar} 
        className={`fixed top-4 ${sidebarVisible ? 'left-64' : 'left-4'} z-40 border-2 border-amber-800 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all duration-300 md:hidden shadow-md`}
      >
        {sidebarVisible ? <X size={18} /> : <Menu size={18} />}
      </Button>
      
      {/* Main content - adjusted margin to account for fixed sidebar */}
      <div className={`flex-1 p-6 ${sidebarVisible ? 'md:ml-64' : 'ml-0'} transition-all duration-300 w-full`}>
        {/* Toggle button for larger screens - inline */}
        <div className="mb-6 hidden md:block">
          <Button 
            variant="outline" 
            onClick={toggleSidebar} 
            className="border-2 border-amber-800 text-amber-800 hover:bg-amber-100 flex items-center gap-2"
          >
            {sidebarVisible ? (
              <>
                <PanelLeftClose size={18} />
                <span>Hide Sidebar</span>
              </>
            ) : (
              <>
                <PanelLeftOpen size={18} />
                <span>Show Sidebar</span>
              </>
            )}
          </Button>
        </div>
        
        {children}
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
} 