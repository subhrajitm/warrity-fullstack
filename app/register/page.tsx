"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, User, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(user?.role === 'admin' ? '/admin' : '/user')
    }
  }, [router, isAuthenticated, user])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }
    
    // In a real app, you would send a registration request to your backend
    setTimeout(() => {
      // For demo purposes, just redirect to login
      setIsLoading(false)
      alert("Registration successful! Please login with your credentials.")
      router.push('/login')
    }, 1000)
  }
  
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-3xl font-bold text-amber-900 font-mono tracking-tight text-center">
            Warrity
          </CardTitle>
          <CardDescription className="text-amber-800 font-medium text-center">
            Create a new account
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
                <Label htmlFor="name" className="text-amber-900">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 border-2 border-amber-800 bg-amber-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-900">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 border-2 border-amber-800 bg-amber-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-amber-900">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                    Creating account...
                  </div>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="border-t-2 border-amber-300 p-6 flex justify-center">
          <div className="text-center text-sm text-amber-800">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-900 font-medium hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}