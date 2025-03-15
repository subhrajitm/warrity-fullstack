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

// Define Product interface
interface Product {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  warrantyPeriod: string;
  description?: string;
  price?: number;
  sku?: string;
}

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: "",
    category: "",
    manufacturer: "",
    warrantyPeriod: "12 months",
    description: "",
    price: undefined,
    sku: ""
  })
  const [productImage, setProductImage] = useState<File | null>(null)
  const [error, setError] = useState("")
  
  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    setIsLoading(false)
  }, [router])
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real app, you would send the data to your backend
    console.log("Submitting product:", formData)
    
    // Show success message and redirect
    alert("Product added successfully!")
    router.push("/admin/products")
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
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="appliances">Appliances</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                      <Label htmlFor="warrantyPeriod" className="text-amber-900 font-medium">
                        Warranty Period <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.warrantyPeriod}
                        onValueChange={(value) => handleSelectChange("warrantyPeriod", value)}
                        required
                      >
                        <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select warranty period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3 months">3 months</SelectItem>
                          <SelectItem value="6 months">6 months</SelectItem>
                          <SelectItem value="12 months">12 months</SelectItem>
                          <SelectItem value="24 months">24 months</SelectItem>
                          <SelectItem value="36 months">36 months</SelectItem>
                          <SelectItem value="5 years">5 years</SelectItem>
                          <SelectItem value="10 years">10 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="text-amber-900 font-medium">
                        SKU
                      </Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Enter product SKU"
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-amber-900 font-medium">
                        Price
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price || ""}
                        onChange={handleInputChange}
                        placeholder="Enter product price"
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-amber-900 font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        className="border-2 border-amber-800 bg-amber-50 min-h-[120px]"
                      />
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