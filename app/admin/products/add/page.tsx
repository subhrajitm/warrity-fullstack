"use client"

/** @jsxRuntime automatic */
/** @jsxImportSource react */
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertCircle, Upload } from "lucide-react"
import AdminSidebar from "../../components/sidebar"

// Mock categories for demonstration
const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "appliances", label: "Appliances" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "automotive", label: "Automotive" },
  { value: "other", label: "Other" }
]

export default function AddProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    manufacturer: "",
    warrantyPeriod: "",
    description: ""
  })
  const [productImage, setProductImage] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
  }, [router])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProductImage(file)
    }
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    // Validate form
    if (!formData.name || !formData.category || !formData.manufacturer || !formData.warrantyPeriod) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }
    
    // In a real app, you would send the form data to your backend
    setTimeout(() => {
      console.log("Form submitted:", formData)
      console.log("Product image:", productImage)
      
      setIsLoading(false)
      alert("Product added successfully!")
      router.push('/admin/products')
    }, 1000)
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/products" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-amber-900 mb-6">
            Add New Product
          </h1>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Product Information
              </CardTitle>
              <CardDescription className="text-amber-800">
                Fill in the details of the product
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-100 border-2 border-red-400 rounded-md flex items-center text-red-800">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-amber-900">
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Samsung 55&quot; QLED TV"
                      className="border-2 border-amber-800 bg-amber-50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-amber-900">
                      Category *
                    </Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer" className="text-amber-900">
                      Manufacturer *
                    </Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      placeholder="e.g. Samsung Electronics"
                      className="border-2 border-amber-800 bg-amber-50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod" className="text-amber-900">
                      Standard Warranty Period *
                    </Label>
                    <Input
                      id="warrantyPeriod"
                      name="warrantyPeriod"
                      value={formData.warrantyPeriod}
                      onChange={handleChange}
                      placeholder="e.g. 24 months"
                      className="border-2 border-amber-800 bg-amber-50"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-amber-900">
                    Product Image
                  </Label>
                  <div className="border-2 border-dashed border-amber-800 rounded-lg p-6 bg-amber-50 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-amber-800 mb-2" />
                      <p className="text-amber-800 mb-2">
                        {productImage ? productImage.name : "Drag and drop or click to upload"}
                      </p>
                      <input
                        type="file"
                        id="productImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="productImage">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="border-2 border-amber-800 text-amber-800"
                        >
                          Browse Files
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-amber-900">
                    Product Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the product..."
                    className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Link href="/admin/products">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-2 border-amber-800 text-amber-800"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit"
                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-amber-100 border-t-transparent rounded-full" />
                        Saving...
                      </div>
                    ) : "Save Product"}
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