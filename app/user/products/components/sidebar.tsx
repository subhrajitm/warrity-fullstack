"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Package, PlusCircle, Home, Bell, Shield, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function ProductSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  
  const isActive = (path: string): boolean => {
    return pathname === path || (pathname !== null && pathname.startsWith(`${path}/`))
  }
  
  const handleLogout = async () => {
    await logout()
  }
  
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-amber-800 text-amber-100 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-amber-100">Warrity</h1>
        <p className="text-amber-300 text-sm">Product Management</p>
      </div>
      
      <div className="space-y-1 mb-6">
        <Link href="/user">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user') ? 'bg-amber-700 text-amber-100' : 'text-amber-100 hover:bg-amber-700 hover:text-amber-100'}`}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        
        <Link href="/user/products">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/products') ? 'bg-amber-700 text-amber-100' : 'text-amber-100 hover:bg-amber-700 hover:text-amber-100'}`}
          >
            <Package className="mr-2 h-5 w-5" />
            Products
          </Button>
        </Link>
        
        <Link href="/user/warranties">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/warranties') ? 'bg-amber-700 text-amber-100' : 'text-amber-100 hover:bg-amber-700 hover:text-amber-100'}`}
          >
            <Shield className="mr-2 h-5 w-5" />
            Warranties
          </Button>
        </Link>
        
        <Link href="/user/notifications">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/notifications') ? 'bg-amber-700 text-amber-100' : 'text-amber-100 hover:bg-amber-700 hover:text-amber-100'}`}
          >
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </Button>
        </Link>
      </div>
      
      <div className="mt-2 mb-6">
        <Link href="/user/products/add">
          <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white border-2 border-amber-700">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Button>
        </Link>
      </div>
      
      <div className="mt-auto space-y-1">
        <Link href="/user/profile">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive('/user/profile') ? 'bg-amber-700 text-amber-100' : 'text-amber-100 hover:bg-amber-700 hover:text-amber-100'}`}
          >
            <User className="mr-2 h-5 w-5" />
            Profile
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-amber-100 hover:bg-amber-700 hover:text-amber-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}