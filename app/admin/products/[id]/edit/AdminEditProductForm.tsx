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

// Import API and types
import { productApi, adminApi, ServiceInfo } from '@/lib/api'

interface Product {
  id: string
  name: string
  category: string
  manufacturer?: string
  model?: string
  serialNumber: string
  purchaseDate?: string
  price?: string
  purchaseLocation?: string
  receiptNumber?: string
  description?: string
  notes?: string
  serviceInfo?: string
  createdAt: string
  updatedAt: string
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
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  price: string;
  purchaseLocation: string;
  receiptNumber: string;
  description: string;
  notes: string;
  serviceInfo?: string;
}

interface Props {
  productId: string;
}

export default function AdminEditProductForm({ productId }: Props) {
  const router = useRouter()
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [serviceInfos, setServiceInfos] = useState<ServiceInfo[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    price: "",
    purchaseLocation: "",
    receiptNumber: "",
    description: "",
    notes: "",
    serviceInfo: ""
  })

  // Combined effect for validation and data fetching
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      // Validate product ID
      if (!productId) {
        toast.error('Invalid product ID')
        router.replace('/admin/products')
        return
      }

      // Wait for auth to be ready
      if (authLoading) return;
      
      // Check authentication
      if (!isAuthenticated || authUser?.role !== 'admin') {
        router.replace('/login')
        return
      }

      try {
        // Fetch product and service info concurrently
        const [productResponse, serviceInfoResponse] = await Promise.all([
          productApi.getProduct(productId), // Use getProduct instead of getProductWithCache
          adminApi.getAllServiceInfo()
        ])

        if (!isMounted) return;

        if (productResponse.error) {
          toast.error('Failed to fetch product: ' + productResponse.error)
          router.replace('/admin/products')
          return
        }

        if (serviceInfoResponse.error) {
          toast.error('Failed to fetch service information: ' + serviceInfoResponse.error)
          return
        }

        if (productResponse.data) {
          const product = productResponse.data as Product
          setProduct(product)
          setFormData({
            name: product.name,
            category: product.category,
            manufacturer: product.manufacturer || "",
            model: product.model || "",
            serialNumber: product.serialNumber,
            purchaseDate: product.purchaseDate || "",
            price: product.price || "",
            purchaseLocation: product.purchaseLocation || "",
            receiptNumber: product.receiptNumber || "",
            description: product.description || "",
            notes: product.notes || "",
            serviceInfo: product.serviceInfo || ""
          })
        } else {
          toast.error('Product not found')
          router.replace('/admin/products')
          return
        }

        if (serviceInfoResponse.data?.serviceInfo) {
          setServiceInfos(serviceInfoResponse.data.serviceInfo)
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch data')
        router.replace('/admin/products')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    }
  }, [productId, authLoading, isAuthenticated, authUser?.role]) // Add back authLoading to dependencies
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  // Handle service info selection
  const handleServiceInfoChange = (value: string) => {
    setFormData(prev => ({ ...prev, serviceInfo: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSaving) return // Prevent double submission
    
    setIsSaving(true)
    
    try {
      const response = await productApi.updateProduct(productId, formData)
      if (response.error) {
        throw new Error(response.error)
      }
      
      toast.success("Product updated successfully!")
      
      // Navigate back to the products list
      router.replace('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error("Failed to update product. Please try again.")
    } finally {
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
                    <Label htmlFor="manufacturer" className="text-amber-900">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
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
                    <Label htmlFor="purchaseLocation" className="text-amber-900">Purchase Location</Label>
                    <Input
                      id="purchaseLocation"
                      name="purchaseLocation"
                      value={formData.purchaseLocation}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber" className="text-amber-900">Receipt Number</Label>
                    <Input
                      id="receiptNumber"
                      name="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceInfo" className="text-amber-900">Service Information</Label>
                    <Select
                      value={formData.serviceInfo}
                      onValueChange={handleServiceInfoChange}
                    >
                      <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                        <SelectValue placeholder="Select service information" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceInfos.map((serviceInfo) => (
                          <SelectItem key={serviceInfo._id} value={serviceInfo._id}>
                            {serviceInfo.name} ({serviceInfo.serviceType}) - {serviceInfo.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-between">
              <Button 
                type="button"
                variant="outline" 
                className="border-2 border-amber-800 text-amber-800"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              
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