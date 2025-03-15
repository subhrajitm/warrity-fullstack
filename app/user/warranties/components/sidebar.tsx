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
  LogOut
} from "lucide-react"

export default function WarrantySidebar() {
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState("")
  
  useEffect(() => {
    setActiveLink(pathname)
  }, [pathname])
  
  const isActive = (path) => {
    if (path === '/user' && pathname === '/user') {
      return true
    }
    if (path === '/user/warranties' && pathname === '/user/warranties') {
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
  
  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn')
    localStorage.removeItem('userRole')
    window.location.href = '/login'
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