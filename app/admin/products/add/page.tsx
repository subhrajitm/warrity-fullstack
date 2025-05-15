"use client"

/** @jsxRuntime automatic */
/** @jsxImportSource react */
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

import { productApi, adminApi, ProductData, ServiceInfo } from "@/lib/api"
import { toast } from "sonner"

// Define Product interface to match API
interface ProductFormData {
  name: string;
  category: string;
  manufacturer: string;
  description: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  price: string;
  purchaseLocation: string;
  receiptNumber: string;
  notes: string;
  serviceInfo?: string;
}

export default function AddProductPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [serviceInfos, setServiceInfos] = useState<ServiceInfo[]>([])
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    manufacturer: "",
    description: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    price: "",
    purchaseLocation: "",
    receiptNumber: "",
    notes: "",
    serviceInfo: ""
  })
  const [productImage, setProductImage] = useState<File | null>(null)
  const [error, setError] = useState("")
  
  // Check if admin is logged in
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login?returnUrl=/admin/products/add')
      } else if (user?.role !== 'admin') {
        router.replace(user?.role === 'user' ? '/user' : '/login')
      } else {
        fetchServiceInfos()
      }
      setIsLoading(false)
    }
  }, [router, authLoading, isAuthenticated, user])
  
  const fetchServiceInfos = async () => {
    try {
      const response = await adminApi.getAllServiceInfo()
      if (response.error) {
        toast.error('Failed to fetch service information')
        return
      }
      if (response.data) {
        // Handle both possible response shapes
        if (Array.isArray(response.data)) {
          setServiceInfos(response.data as ServiceInfo[])
        } else if ('serviceInfo' in response.data && Array.isArray((response.data as any).serviceInfo)) {
          setServiceInfos((response.data as any).serviceInfo)
        }
      }
    } catch (error) {
      console.error('Error fetching service information:', error)
      toast.error('An error occurred while fetching service information')
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProductImage(file)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      const productData: ProductData = {
        ...formData,
        id: "", // This will be set by the backend
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const response = await productApi.createProduct(productData)
      if (response.error) {
        setError(response.error)
        toast.error('Failed to create product: ' + response.error)
        return
      }
      
      toast.success('Product created successfully!')
      
      // Force a complete page reload to ensure fresh data
      window.location.href = '/admin/products'
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('An error occurred while creating the product')
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-amber-800 text-xl">Loading...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link href="/admin/products">
                <Button variant="ghost" className="mr-2 text-amber-800">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Products
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-amber-900">Add New Product</h1>
            </div>
          </div>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Product Information
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-100 border-2 border-red-400 rounded-md flex items-center text-red-800">
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-amber-900 font-medium">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        className="border-2 border-amber-800 bg-amber-50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-amber-900 font-medium">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                        required
                      >
                        <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Appliances">Appliances</SelectItem>
                          <SelectItem value="Furniture">Furniture</SelectItem>
                          <SelectItem value="Automotive">Automotive</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manufacturer" className="text-amber-900 font-medium">
                        Manufacturer <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="manufacturer"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleInputChange}
                        placeholder="Enter manufacturer name"
                        className="border-2 border-amber-800 bg-amber-50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-amber-900 font-medium">
                        Model
                      </Label>
                      <Input
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="Enter model number"
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serialNumber" className="text-amber-900 font-medium">
                        Serial Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="serialNumber"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleInputChange}
                        placeholder="Enter serial number"
                        className="border-2 border-amber-800 bg-amber-50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-amber-900 font-medium">
                        Price
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter product price"
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-amber-900 font-medium">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        className="border-2 border-amber-800 bg-amber-50 min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-amber-900 font-medium">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Enter any additional notes"
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceInfo" className="text-amber-900 font-medium">
                        Service Information
                      </Label>
                      <Select
                        value={formData.serviceInfo}
                        onValueChange={(value) => handleSelectChange("serviceInfo", value)}
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
                
                <div className="flex justify-end space-x-3 mt-8">
                  <Link href="/admin/products">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-2 border-amber-800 text-amber-800"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Product
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}