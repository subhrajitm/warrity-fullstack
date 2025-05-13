"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Package } from "lucide-react"
import ProductSidebar from "../components/sidebar"
import { useAuth } from "@/lib/auth-context"

interface FormData {
  name: string;
  category: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  purchaseDate: string;
  price: string;
  purchaseLocation: string;
  receiptNumber: string;
  description: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function AddProductPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    model: "",
    manufacturer: "",
    serialNumber: "",
    purchaseDate: "",
    price: "",
    purchaseLocation: "",
    receiptNumber: "",
    description: "",
    notes: ""
  })
  
  // Check if user is logged in
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login?returnUrl=/user/products/add')
      } else if (user?.role !== 'user') {
        router.replace(user?.role === 'admin' ? '/admin' : '/login')
      }
    }
  }, [router, authLoading, isAuthenticated, user])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number is required";
    }
    
    // Price validation
    if (formData.price && !/^\$?\d+(\.\d{2})?$/.test(formData.price.replace(/,/g, ''))) {
      newErrors.price = "Invalid price format. Example: $1,999.99";
    }
    
    // Purchase date validation
    if (formData.purchaseDate) {
      const purchaseDate = new Date(formData.purchaseDate);
      const today = new Date();
      if (purchaseDate > today) {
        newErrors.purchaseDate = "Purchase date cannot be in the future";
      }
    }
    
    // Serial number format validation
    if (formData.serialNumber && !/^[A-Za-z0-9-]+$/.test(formData.serialNumber)) {
      newErrors.serialNumber = "Serial number can only contain letters, numbers, and hyphens";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Validate form
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }
      
      // Sanitize and format data
      const sanitizedData = {
        ...formData,
        name: formData.name.trim(),
        serialNumber: formData.serialNumber.trim().toUpperCase(),
        price: formData.price ? formData.price.replace(/[^0-9.]/g, '') : '',
        description: formData.description.trim(),
        notes: formData.notes.trim()
      };
      
      // In a real app, you would send the form data to your backend
      console.log("Form submitted:", sanitizedData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/user/products')
    } catch (error) {
      console.error("Failed to add product:", error)
      setErrors({
        submit: "Failed to add product. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <ProductSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="mb-6">
          <Link href="/user/products" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-amber-800 mr-2" />
                <div>
                  <CardTitle className="text-2xl font-bold text-amber-900">Add New Product</CardTitle>
                  <CardDescription className="text-amber-700">
                    Enter the details of your product to add it to your inventory
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {errors.submit && (
                <div className="mb-6 p-3 bg-red-100 border-2 border-red-400 rounded-md">
                  <p className="text-red-800">{errors.submit}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-amber-900">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. MacBook Pro"
                        value={formData.name}
                        onChange={handleChange}
                        className={`border-2 ${errors.name ? 'border-red-400' : 'border-amber-800'} bg-amber-50`}
                        required
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-amber-900">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="appliances">Appliances</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="jewelry">Jewelry</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-amber-900">Model</Label>
                      <Input
                        id="model"
                        name="model"
                        placeholder="e.g. MacBook Pro 14-inch (2021)"
                        value={formData.model}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manufacturer" className="text-amber-900">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        name="manufacturer"
                        placeholder="e.g. Apple Inc."
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber" className="text-amber-900">
                        Serial Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="serialNumber"
                        name="serialNumber"
                        placeholder="e.g. APPL87654321"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50 font-mono"
                        required
                      />
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
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-amber-900">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        placeholder="e.g. $1,999"
                        value={formData.price}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="purchaseLocation" className="text-amber-900">Purchase Location</Label>
                      <Input
                        id="purchaseLocation"
                        name="purchaseLocation"
                        placeholder="e.g. Apple Store"
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
                        placeholder="e.g. AP-2022-05-20-7654"
                        value={formData.receiptNumber}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-amber-900">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter a description of your product"
                      value={formData.description}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-amber-900">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any additional notes about your product"
                      value={formData.notes}
                      onChange={handleChange}
                      className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-between">
              <Button 
                type="button"
                variant="outline" 
                className="border-amber-800 text-amber-800 hover:bg-amber-200"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-amber-700">
            <p>
              After adding your product, you can add warranty information from the product details page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}