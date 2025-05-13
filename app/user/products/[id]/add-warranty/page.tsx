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
import { ArrowLeft, Save, Shield } from "lucide-react"
import ProductSidebar from "../../components/sidebar"
import { useAuth } from "@/lib/auth-context"

// Mock data for demonstration
const mockProduct = {
  id: 3,
  name: "MacBook Pro",
  category: "electronics",
  purchaseDate: "2022-05-20",
  manufacturer: "Apple Inc.",
  serialNumber: "APPL87654321"
}

interface Product {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  manufacturer: string;
  serialNumber: string;
}

interface FormData {
  provider: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  coverageDetails: string;
  claimProcess: string;
  contactInfo: string;
  documents: string[];
}

interface Params {
  id: string;
}

export default function AddWarrantyPage({ params }: { params: Params }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<FormData>({
    provider: "",
    type: "",
    startDate: "",
    endDate: "",
    duration: "",
    coverageDetails: "",
    claimProcess: "",
    contactInfo: "",
    documents: []
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
          setProduct(mockProduct)
          
          // Pre-fill the start date with the purchase date if available
          if (mockProduct.purchaseDate) {
            setFormData(prev => ({
              ...prev,
              startDate: mockProduct.purchaseDate,
              provider: mockProduct.manufacturer // Pre-fill provider with manufacturer
            }))
          }
          
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
  
  const calculateEndDate = () => {
    if (!formData.startDate || !formData.duration) return
    
    const startDate = new Date(formData.startDate)
    const durationParts = formData.duration.split(' ')
    const durationValue = parseInt(durationParts[0])
    const durationType = durationParts[1].toLowerCase()
    
    let endDate = new Date(startDate)
    
    if (durationType.includes('year')) {
      endDate.setFullYear(endDate.getFullYear() + durationValue)
    } else if (durationType.includes('month')) {
      endDate.setMonth(endDate.getMonth() + durationValue)
    } else if (durationType.includes('day')) {
      endDate.setDate(endDate.getDate() + durationValue)
    }
    
    const formattedEndDate = endDate.toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, endDate: formattedEndDate }))
  }
  
  // Effect to calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.startDate && formData.duration) {
      calculateEndDate()
    }
  }, [formData.startDate, formData.duration])
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate form
    if (!formData.provider || !formData.type || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }
    
    // In a real app, you would send the warranty data to your backend
    console.log("Submitting warranty data:", {
      productId: params.id,
      ...formData
    })
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Warranty added successfully!")
      router.push(`/user/products/${params.id}`)
    }, 1000)
  }
  
  // For the button click handler
  const handleButtonSubmit = () => {
    setIsSubmitting(true)
    
    // In a real app, you would send the warranty data to your backend
    console.log("Submitting warranty data:", {
      productId: params.id,
      ...formData
    })
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/user/products/${params.id}`)
    }, 1000)
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
            Back to {product && product.name ? product.name : 'Product'}
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-amber-800 mr-2" />
                <div>
                  <CardTitle className="text-2xl font-bold text-amber-900">Add Warranty</CardTitle>
                  <CardDescription className="text-amber-700">
                    Add warranty information for {product.name}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider" className="text-amber-900">
                        Warranty Provider <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="provider"
                        name="provider"
                        placeholder="e.g. Apple Inc."
                        value={formData.provider}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-amber-900">
                        Warranty Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleSelectChange("type", value)}
                      >
                        <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select warranty type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Manufacturer Warranty</SelectItem>
                          <SelectItem value="extended">Extended Warranty</SelectItem>
                          <SelectItem value="limited">Limited Warranty</SelectItem>
                          <SelectItem value="lifetime">Lifetime Warranty</SelectItem>
                          <SelectItem value="accidental">Accidental Damage Protection</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-amber-900">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-amber-900">
                        Duration
                      </Label>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) => handleSelectChange("duration", value)}
                      >
                        <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                          <SelectValue placeholder="Select warranty duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="90 days">90 Days</SelectItem>
                          <SelectItem value="6 months">6 Months</SelectItem>
                          <SelectItem value="1 year">1 Year</SelectItem>
                          <SelectItem value="2 years">2 Years</SelectItem>
                          <SelectItem value="3 years">3 Years</SelectItem>
                          <SelectItem value="5 years">5 Years</SelectItem>
                          <SelectItem value="10 years">10 Years</SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-amber-700 mt-1">
                        Selecting a duration will automatically calculate the end date
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-amber-900">
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactInfo" className="text-amber-900">
                        Contact Information
                      </Label>
                      <Input
                        id="contactInfo"
                        name="contactInfo"
                        placeholder="e.g. 1-800-275-2273 or support.apple.com"
                        value={formData.contactInfo}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="claimProcess" className="text-amber-900">
                        Claim Process
                      </Label>
                      <Textarea
                        id="claimProcess"
                        name="claimProcess"
                        placeholder="e.g. Contact Apple Support or visit an Apple Store"
                        value={formData.claimProcess}
                        onChange={handleChange}
                        className="border-2 border-amber-800 bg-amber-50 min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverageDetails" className="text-amber-900">
                      Coverage Details
                    </Label>
                    <Textarea
                      id="coverageDetails"
                      name="coverageDetails"
                      placeholder="Enter details about what is covered by this warranty"
                      value={formData.coverageDetails}
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
                onClick={handleButtonSubmit}
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Warranty"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-amber-700">
            <p>
              Adding warranty information helps you keep track of when your coverage expires and how to make claims.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}