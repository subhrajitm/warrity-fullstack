"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Home,
  LogOut,
  User,
  Settings,
  Calendar
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function WarrantySidebar() {
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState<string>("")
  const { logout } = useAuth()
  
  useEffect(() => {
    if (pathname) {
      setActiveLink(pathname)
    }
  }, [pathname])
  
  const isActive = (path: string): boolean => {
    if (!pathname) return false
    
    if (path === '/user' && pathname === '/user') {
      return true
    }
    if (path === '/user/profile' && pathname === '/user/profile') {
      return true
    }
    if (path === '/user/settings' && pathname === '/user/settings') {
      return true
    }
    if (path === '/user/calendar' && pathname === '/user/calendar') {
      return true
    }
    if (path.includes('active') && pathname.includes('active')) {
      return true
    }
    if (path.includes('expiring') && pathname.includes('expiring')) {
      return true
    }
    if (path.includes('expired') && pathname.includes('expired')) {
      return true
    }
    if (path.includes('add') && pathname.includes('add')) {
      return true
    }
    return false
  }
  
  const handleLogout = async () => {
    await logout()
  }
  
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-amber-800 text-amber-100 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono tracking-tight">Warrity</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link href="/user">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        
        <Link href="/user/calendar">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/calendar') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Calendar
          </Button>
        </Link>
        
        <Link href="/user/warranties">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/warranties') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <Package className="mr-2 h-5 w-5" />
            All Warranties
          </Button>
        </Link>
        
        <Link href="/user/warranties?status=active">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/warranties?status=active') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Active
          </Button>
        </Link>
        
        <Link href="/user/warranties?status=expiring">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/warranties?status=expiring') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <Clock className="mr-2 h-5 w-5" />
            Expiring Soon
          </Button>
        </Link>
        
        <Link href="/user/warranties?status=expired">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/warranties?status=expired') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Expired
          </Button>
        </Link>
        
        <Link href="/user/warranties/add">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/warranties/add') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Warranty
          </Button>
        </Link>

        <Link href="/user/profile">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/profile') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
          >
            <User className="mr-2 h-5 w-5" />
            My Profile
          </Button>
        </Link>
        
        <Link href="/user/settings">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/settings') ? 'bg-amber-900 text-amber-50' : 'text-amber-100 hover:bg-amber-700'}`}
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