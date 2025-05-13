"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, LayoutDashboard, Package, Tags, Users, Settings, BarChart, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: <Tags className="h-5 w-5" />,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    name: "Help",
    href: "/admin/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn("h-screen border-r bg-white transition-all duration-300", collapsed ? "w-[70px]" : "w-[250px]")}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link
            href="/admin/dashboard"
            className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          >
            Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("rounded-full", collapsed && "mx-auto")}
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-gray-700 transition-colors relative",
                  isActive ? "text-purple-600 bg-purple-50" : "hover:bg-gray-100",
                  collapsed && "justify-center px-2",
                )}
              >
                <div className={cn("flex items-center", collapsed && "justify-center")}>
                  {item.icon}
                  {!collapsed && <span className="ml-3 font-medium">{item.name}</span>}
                </div>
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r-full"
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

