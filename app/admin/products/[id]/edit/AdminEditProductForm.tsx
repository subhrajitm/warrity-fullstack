"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

// Mock product data
const mockProduct = {
  id: 3,
  name: "MacBook Pro 16\"",
  category: "Electronics",
  brand: "Apple",
  model: "MacBook Pro M1 Pro",
  serialNumber: "C2C3456789",
  purchaseDate: "2022-08-05",
  price: 2499.99,
  warrantyStatus: "expiring",
  warrantyEndDate: "2023-08-05",
  description: "16-inch MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD",
  notes: "Customer reported minor screen issue in June 2023, but did not file warranty claim.",
  userId: 2,
  userName: "Jane Smith",
  userEmail: "jane.smith@example.com"
}

// Product categories
const categories = [
  "Electronics",
  "Appliances",
  "Furniture",
  "Automotive",
  "Tools",
  "Clothing",
  "Sports & Outdoors",
  "Toys & Games",
  "Health & Beauty",
  "Other"
];

interface FormData {
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  price: string;
  description: string;
  notes: string;
  userId: string;
  userName: string;
}

interface Props {
  productId: string;
}

export default function AdminEditProductForm({ productId }: Props) {
  const router = useRouter()
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    price: "",
    description: "",
    notes: "",
    userId: "",
    userName: ""
  })
  
  // Check if admin is logged in and fetch product data
  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated || authUser?.role !== 'admin') {
      router.replace('/login')
      return
    }

    // In a real app, you would fetch the product data based on the ID
    console.log(`Fetching product with ID: ${productId} for editing`)
    
    // Set mock data
    setFormData({
      name: mockProduct.name,
      category: mockProduct.category,
      brand: mockProduct.brand,
      model: mockProduct.model,
      serialNumber: mockProduct.serialNumber,
      purchaseDate: mockProduct.purchaseDate,
      price: mockProduct.price.toString(),
      description: mockProduct.description || "",
      notes: mockProduct.notes || "",
      userId: mockProduct.userId.toString(),
      userName: mockProduct.userName
    })
    setIsLoading(false)
  }, [router, productId, authLoading, isAuthenticated, authUser])
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // In a real app, you would send the updated data to your backend
      console.log("Submitting updated product data:", formData)
      
      // Wait for console to flush and state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      toast.success("Product updated successfully!")
      
      // Navigate to details page
      router.push(`/admin/products/${productId}`)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error("Failed to update product. Please try again.")
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-amber-800 text-xl">Loading product data...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link href={`/admin/products/${productId}`} className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Product Details
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-2xl font-bold text-amber-900">Edit Product</CardTitle>
            <CardDescription className="text-amber-700">
              Update the product information
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-amber-900">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-amber-900">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      name="category" 
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                      required
                    >
                      <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-amber-900">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-amber-900">Model</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber" className="text-amber-900">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate" className="text-amber-900">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-amber-900">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-amber-900">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="min-h-[100px] border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-amber-900">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="min-h-[100px] border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-amber-900">
                      User ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userId"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-amber-900">User Name</Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-between">
              <Link href={`/admin/products/${productId}`}>
                <Button variant="outline" className="border-2 border-amber-800 text-amber-800">
                  Cancel
                </Button>
              </Link>
              
              <Button 
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-amber-100"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 