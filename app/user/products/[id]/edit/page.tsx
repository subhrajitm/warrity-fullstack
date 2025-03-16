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
import ProductSidebar from "../../components/sidebar"
import { useAuth } from "@/lib/auth-context"

// Mock data for demonstration
const mockProduct = {
  id: 3,
  name: "MacBook Pro",
  category: "electronics",
  purchaseDate: "2022-05-20",
  price: "$1,999",
  serialNumber: "APPL87654321",
  model: "MacBook Pro 14-inch (2021)",
  manufacturer: "Apple Inc.",
  description: "14-inch MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD",
  purchaseLocation: "Apple Store",
  receiptNumber: "AP-2022-05-20-7654",
  notes: "Space Gray color. Includes AppleCare+ warranty."
}

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

interface Params {
  id: string;
}

export default function EditProductPage({ params }: { params: Params }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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
  
  // Check if user is logged in and fetch product data
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.role !== 'user') {
        router.replace(user?.role === 'admin' ? '/admin' : '/login')
      } else {
        // In a real app, you would fetch the product data based on the ID
        console.log(`Fetching product with ID: ${params.id}`)
        
        // Simulate API call to get product data
        setTimeout(() => {
          // Format the price to remove the $ sign for the input field
          const formattedProduct = {
            ...mockProduct,
            price: mockProduct.price.replace('$', ''),
            // Format the date to YYYY-MM-DD for the date input
            purchaseDate: mockProduct.purchaseDate
          }
          
          setFormData(formattedProduct as FormData)
          setIsLoading(false)
        }, 500)
      }
    }
  }, [router, params.id, authLoading, isAuthenticated, user])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitForm()
  }
  
  const submitForm = async () => {
    setIsSubmitting(true)
    
    // Validate form
    if (!formData.name || !formData.category || !formData.serialNumber) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }
    
    try {
      // In a real app, you would send the updated data to your backend
      console.log("Submitting updated product data:", formData)
      
      // Wait for console to flush and state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Navigate to product details
      router.push(`/user/products/${params.id}`)
    } catch (error) {
      console.error('Error updating product:', error)
      alert("Failed to update product. Please try again.")
      setIsSubmitting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <ProductSidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading product data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <ProductSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="mb-6">
          <Link href={`/user/products/${params.id}`} className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product Details
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-amber-800 mr-2" />
                <div>
                  <CardTitle className="text-2xl font-bold text-amber-900">Edit Product</CardTitle>
                  <CardDescription className="text-amber-700">
                    Update the details of your {formData.name}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
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
                        className="border-2 border-amber-800 bg-amber-50"
                        required
                      />
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
                        placeholder="e.g. 1999"
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
                variant="outline" 
                className="border-amber-800 text-amber-800 hover:bg-amber-100"
                onClick={() => router.push(`/user/products/${params.id}`)}
              >
                Cancel
              </Button>
              
              <Button 
                className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                type="submit"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}