"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Home, User, Settings, LogOut, Filter, CheckCircle, Clock, AlertTriangle, Package, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function NotificationSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState("User")
  const { logout } = useAuth()
  
  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (email) {
      const name = email.split('@')[0]
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    }
  }, [])
  
  const handleLogout = async () => {
    await logout()
  }
  
  const isActive = (path: string): boolean => {
    return pathname === path || (pathname !== null && pathname.startsWith(`${path}/`))
  }
  
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-amber-800 text-amber-100 p-4 border-r-4 border-amber-900 shadow-lg">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="font-bold text-2xl font-mono mb-2">Warrity</h1>
          <div className="text-amber-200">Welcome, {userName}</div>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/user" 
                className={`flex items-center p-2 rounded-lg hover:bg-amber-700 transition-colors ${
                  isActive('/user') && !isActive('/user/products') && !isActive('/user/warranties') && !isActive('/user/notifications') && !isActive('/user/settings') 
                    ? 'bg-amber-700 text-amber-200 font-bold' 
                    : ''
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/user/products" 
                className={`flex items-center p-2 rounded-lg hover:bg-amber-700 transition-colors ${
                  isActive('/user/products') ? 'bg-amber-700 text-amber-200 font-bold' : ''
                }`}
              >
                <Package className="mr-3 h-5 w-5" />
                Products
              </Link>
            </li>
            <li>
              <Link 
                href="/user/warranties" 
                className={`flex items-center p-2 rounded-lg hover:bg-amber-700 transition-colors ${
                  isActive('/user/warranties') ? 'bg-amber-700 text-amber-200 font-bold' : ''
                }`}
              >
                <Shield className="mr-3 h-5 w-5" />
                Warranties
              </Link>
            </li>
            <li>
              <Link 
                href="/user/notifications" 
                className={`flex items-center p-2 rounded-lg hover:bg-amber-700 transition-colors ${
                  isActive('/user/notifications') ? 'bg-amber-700 text-amber-200 font-bold' : ''
                }`}
              >
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </Link>
            </li>
            <li>
              <Link 
                href="/user/settings" 
                className={`flex items-center p-2 rounded-lg hover:bg-amber-700 transition-colors ${
                  isActive('/user/settings') ? 'bg-amber-700 text-amber-200 font-bold' : ''
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-amber-700">
          <Button 
            variant="outline" 
            className="w-full border-amber-200 text-amber-100 hover:bg-amber-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}