"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, User, Lock, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (isLoggedIn) {
      router.replace(role === 'admin' ? '/admin' : '/user')
    }
  }, [router])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    // Validate form
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }
    
    // In a real app, you would send a login request to your backend
    // For demo purposes, we'll use mock credentials
    setTimeout(() => {
      if (email === "admin@example.com" && password === "admin123") {
        // Admin login
        localStorage.setItem('userLoggedIn', 'true')
        localStorage.setItem('userRole', 'admin')
        router.push('/admin')
      } else if (email === "user@example.com" && password === "user123") {
        // User login
        localStorage.setItem('userLoggedIn', 'true')
        localStorage.setItem('userRole', 'user')
        router.push('/user')
      } else {
        setError("Invalid email or password")
      }
      setIsLoading(false)
    }, 1000)
  }
  
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-3xl font-bold text-amber-900 font-mono tracking-tight text-center">
            Warranty Manager
          </CardTitle>
          <CardDescription className="text-amber-800 font-medium text-center">
            Login to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-md flex items-center text-red-800">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-900">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-2 border-amber-800 bg-amber-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-900">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-2 border-amber-800 bg-amber-50"
                  />
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-amber-100 border-t-transparent rounded-full" />
                    Logging in...
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="border-t-2 border-amber-300 p-6 flex flex-col space-y-4">
          <div className="text-center text-amber-800">
            <p className="text-sm">
              Demo Credentials:
            </p>
            <p className="text-xs mt-1">
              Admin: admin@example.com / admin123
            </p>
            <p className="text-xs">
              User: user@example.com / user123
            </p>
          </div>
          
          <div className="text-center text-sm text-amber-800">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-amber-900 font-medium hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

