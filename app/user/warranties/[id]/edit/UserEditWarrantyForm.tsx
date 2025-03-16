"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"

// Dynamically import the sidebar to reduce initial bundle size
const WarrantySidebar = dynamic(() => import("../../components/sidebar"), {
  loading: () => <div className="w-64 bg-amber-100 border-r-4 border-amber-800" />
})

// Move mock data outside component to prevent re-creation
const mockWarranty = {
  id: 3,
  product: "MacBook Pro",
  category: "electronics",
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
  coverageDetails: "Covers manufacturing defects, battery service, and up to two incidents of accidental damage protection every 12 months."
}

interface Props {
  warrantyId: string;
}

export default function UserEditWarrantyForm({ warrantyId }: Props) {
  const router = useRouter()
  const [formData, setFormData] = useState(mockWarranty) // Initialize with mock data
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // In a real app, you would send the updated data to your backend
      console.log("Submitting updated warranty data:", formData)
      
      // Wait for console to flush and state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Navigate to the details page using replace to prevent back navigation to the form
      router.replace(`/user/warranties/${warrantyId}`)
    } catch (error) {
      console.error('Error updating warranty:', error)
      alert("Failed to update warranty. Please try again.")
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <WarrantySidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="mb-6">
          <Link href={`/user/warranties/${warrantyId}`} className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
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
              Update the details of your warranty
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
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-amber-900">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="appliances">Appliances</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                      disabled={isSubmitting}
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
                      placeholder="e.g. 1999"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-amber-900">Warranty Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="lifetime">Lifetime</SelectItem>
                        <SelectItem value="extended">Extended</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="extendable" className="text-amber-900">Extendable</Label>
                    <Select
                      value={formData.extendable}
                      onValueChange={(value) => handleSelectChange("extendable", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                        <SelectValue placeholder="Is this warranty extendable?" />
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="terms" className="text-amber-900">Warranty Terms</Label>
                    <Textarea
                      id="terms"
                      name="terms"
                      value={formData.terms}
                      onChange={handleInputChange}
                      className="border-2 border-amber-800 bg-amber-50 min-h-[80px]"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverageDetails" className="text-amber-900">Coverage Details</Label>
                    <Textarea
                      id="coverageDetails"
                      name="coverageDetails"
                      value={formData.coverageDetails}
                      onChange={handleInputChange}
                      className="border-2 border-amber-800 bg-amber-50 min-h-[80px]"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="claimProcess" className="text-amber-900">Claim Process</Label>
                    <Textarea
                      id="claimProcess"
                      name="claimProcess"
                      value={formData.claimProcess}
                      onChange={handleInputChange}
                      className="border-2 border-amber-800 bg-amber-50 min-h-[80px]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-amber-100 border-t-transparent rounded-full" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 