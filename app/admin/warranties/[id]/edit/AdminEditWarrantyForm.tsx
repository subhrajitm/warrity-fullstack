"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data for demonstration
const mockWarranty = {
  id: 3,
  product: "MacBook Pro",
  category: "Electronics",
  purchaseDate: "2022-05-20",
  startDate: "2022-05-20",
  endDate: "2023-08-25",
  price: "1999",
  status: "expiring",
  provider: "Apple Inc.",
  type: "limited",
  terms: "1 year limited warranty with option to extend",
  extendable: "yes",
  claimProcess: "Contact Apple Support or visit an Apple Store with proof of purchase.",
  coverageDetails: "Covers manufacturing defects, battery service, and up to two incidents of accidental damage protection every 12 months.",
  userId: 5
}

// Mock users for dropdown
const mockUsers = [
  { id: "1", name: "John Smith", email: "john@example.com" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com" },
  { id: "3", name: "Michael Brown", email: "michael@example.com" },
  { id: "4", name: "Robert Davis", email: "robert@example.com" },
  { id: "5", name: "Emily Johnson", email: "emily@example.com" }
]

interface FormData {
  product: string;
  category: string;
  purchaseDate: string;
  startDate: string;
  endDate: string;
  price: string;
  status: string;
  provider: string;
  type: string;
  terms: string;
  extendable: string;
  claimProcess: string;
  coverageDetails: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  warrantyId: string;
}

export default function AdminEditWarrantyForm({ warrantyId }: Props) {
  const router = useRouter()
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    product: "",
    category: "",
    purchaseDate: "",
    startDate: "",
    endDate: "",
    price: "",
    status: "",
    provider: "",
    type: "",
    terms: "",
    extendable: "",
    claimProcess: "",
    coverageDetails: "",
    userId: ""
  })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in and fetch warranty data
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
        return
      }

      // In a real app, you would fetch the warranty data based on the ID
      console.log(`Fetching warranty with ID: ${warrantyId} for editing`)
      
      // Set mock data
      // Convert userId to string to match our FormData type
      const formattedWarranty = {
        ...mockWarranty,
        userId: mockWarranty.userId.toString()
      }
      setFormData(formattedWarranty as FormData)
      setUsers(mockUsers)
      setIsLoading(false)
    }
  }, [router, warrantyId, authLoading, isAuthenticated])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      // In a real app, you would send the updated data to your backend
      console.log("Submitting updated warranty data:", formData)
      
      // Redirect back to warranty details page
      router.push(`/warranties/${warrantyId}`)
    } catch (error) {
      console.error('Error updating warranty:', error)
      // Handle error (show toast notification, etc.)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-amber-800 text-xl">Loading warranty data...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link href={`/admin/warranties/${warrantyId}`} className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Warranty Details
        </Link>
      </div>
      
      <Card className="max-w-4xl mx-auto border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-2xl font-bold text-amber-900">
            Edit Warranty
          </CardTitle>
          <CardDescription className="text-amber-800">
            Update the warranty information for {formData.product}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product" className="text-amber-900">Product Name</Label>
                  <Input
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-amber-900">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Appliances">Appliances</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="provider" className="text-amber-900">Provider/Manufacturer</Label>
                  <Input
                    id="provider"
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-amber-900">Product Price</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    placeholder="Enter price without currency symbol"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-amber-900">Warranty Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select warranty type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                      <SelectItem value="extended">Extended</SelectItem>
                      <SelectItem value="manufacturer">Manufacturer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="extendable" className="text-amber-900">Extendable</Label>
                  <Select 
                    value={formData.extendable} 
                    onValueChange={(value) => handleSelectChange("extendable", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select if warranty is extendable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate" className="text-amber-900">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-amber-900">Warranty Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-amber-900">Warranty End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="border-2 border-amber-800 bg-amber-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-amber-900">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select warranty status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expiring">Expiring Soon</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="claimed">Claimed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-amber-900">Assigned User</Label>
                  <Select 
                    value={formData.userId} 
                    onValueChange={(value) => handleSelectChange("userId", value)}
                  >
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms" className="text-amber-900">Warranty Terms</Label>
                <Textarea
                  id="terms"
                  name="terms"
                  value={formData.terms}
                  onChange={handleInputChange}
                  className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                  placeholder="Enter the warranty terms and conditions"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="claimProcess" className="text-amber-900">Claim Process</Label>
                <Textarea
                  id="claimProcess"
                  name="claimProcess"
                  value={formData.claimProcess}
                  onChange={handleInputChange}
                  className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                  placeholder="Describe the process for making a warranty claim"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverageDetails" className="text-amber-900">Coverage Details</Label>
                <Textarea
                  id="coverageDetails"
                  name="coverageDetails"
                  value={formData.coverageDetails}
                  onChange={handleInputChange}
                  className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                  placeholder="Specify what is covered under this warranty"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 