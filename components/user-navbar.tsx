"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { Menu, X, Shield, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "Home", href: "/" },
  { name: "My Products", href: "/products" },
  { name: "Add Product", href: "/products/add" },
  { name: "Support", href: "/support" },
]

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              className="relative flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10 font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Warrity
              </div>
              <motion.div
                className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-500/20"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-gray-700 hover:text-purple-600 font-medium transition-colors ${
                  pathname === item.href ? "text-purple-600" : ""
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.span layoutId="underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-600" />
                )}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  <Link href="/admin/dashboard">Admin Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-white pt-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name} className="border-b border-gray-100 pb-4">
                  <Link
                    href={item.href}
                    className={`block py-2 text-gray-700 font-medium hover:text-purple-600 ${
                      pathname === item.href ? "text-purple-600" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              <div className="pt-4">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center py-2 text-gray-700 font-medium hover:text-purple-600"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Dashboard
                </Link>
                <button className="flex items-center py-2 text-gray-700 font-medium hover:text-purple-600 w-full">
                  <LogOut className="mr-2 h-5 w-5" />
                  Log out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

