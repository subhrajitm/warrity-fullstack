"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Home,
  LogOut,
  FileText
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState("")
  
  useEffect(() => {
    setActiveLink(pathname)
  }, [pathname])
  
  const isActive = (path) => {
    if (path === '/admin' && pathname === '/admin') {
      return true
    }
    if (path === '/admin/products' && pathname.startsWith('/admin/products')) {
      return true
    }
    if (path === '/admin/warranties' && pathname.startsWith('/admin/warranties')) {
      return true
    }
    if (path === '/admin/users' && pathname.startsWith('/admin/users')) {
      return true
    }
    if (path === '/admin/analytics' && pathname.startsWith('/admin/analytics')) {
      return true
    }
    if (path === '/admin/settings' && pathname.startsWith('/admin/settings')) {
      return true
    }
    return false
  }
  
  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn')
    localStorage.removeItem('userRole')
    window.location.href = '/login'
  }
  
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-amber-800 text-amber-100 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono tracking-tight">Warranty Manager</h1>
        <p className="text-amber-200 text-sm mt-1">Admin Panel</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link href="/admin">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/admin') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        
        <Link href="/admin/products">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/admin/products') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <Package className="mr-2 h-5 w-5" />
            Products
          </Button>
        </Link>
        
        <Link href="/admin/warranties">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/admin/warranties') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <FileText className="mr-2 h-5 w-5" />
            Warranties
          </Button>
        </Link>
        
        <Link href="/admin/users">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/admin/users') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <Users className="mr-2 h-5 w-5" />
            Users
          </Button>
        </Link>
        
        <Link href="/admin/analytics">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/admin/analytics') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Analytics
          </Button>
        </Link>
        
        <Link href="/admin/settings">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/admin/settings') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </Link>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-amber-700">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-amber-100 hover:bg-amber-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}