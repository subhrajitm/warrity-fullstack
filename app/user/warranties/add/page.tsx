"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Upload, AlertCircle } from "lucide-react"
import WarrantySidebar from "../components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { WarrantyInput, WarrantyDocument } from "@/types/warranty"
import { warrantyApi } from "@/lib/api"

// Mock categories for demonstration
const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "appliances", label: "Appliances" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "automotive", label: "Automotive" },
  { value: "other", label: "Other" }
]

interface FormData {
  product: string;
  manufacturer: string;
  purchaseDate: string;
  warrantyPeriod: string;
  warrantyProvider: string;
  warrantyNumber: string;
  coverageDetails: string;
  notes?: string;
}

export default function AddWarrantyPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    product: "",
    manufacturer: "",
    purchaseDate: "",
    warrantyPeriod: "",
    warrantyProvider: "",
    warrantyNumber: "",
    coverageDetails: "",
    notes: ""
  })
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [warrantyFile, setWarrantyFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if user is logged in
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.role !== 'user') {
        router.replace(user?.role === 'admin' ? '/admin' : '/login')
      }
    }
  }, [router, authLoading, isAuthenticated, user])
  
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'receipt' | 'warranty') => {
    const file = e.target.files?.[0] || null
    if (type === 'receipt') {
      setReceiptFile(file)
    } else {
      setWarrantyFile(file)
    }
  }
  
  const uploadFile = async (file: File): Promise<WarrantyDocument | null> => {
    if (!file) return null;
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Use the warrantyApi utility to upload the file
      // Note: We're using a direct fetch here since the warrantyApi might not have a specific method for this
      // In a production app, you would add a proper method to the warrantyApi utility
      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      const data = await response.json();
      return {
        name: file.name,
        path: data.filePath,
        uploadDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    
    // Validate form
    if (!formData.product || !formData.manufacturer || !formData.purchaseDate || !formData.warrantyPeriod) {
      setError("Please fill in all required fields")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Calculate expiration date based on purchase date and warranty period
      const purchaseDate = new Date(formData.purchaseDate);
      const expirationDate = new Date(purchaseDate);
      expirationDate.setMonth(expirationDate.getMonth() + parseInt(formData.warrantyPeriod));
      
      // Upload files if provided
      const documents: WarrantyDocument[] = [];
      
      if (receiptFile) {
        const receiptDoc = await uploadFile(receiptFile);
        if (receiptDoc) documents.push(receiptDoc);
      }
      
      if (warrantyFile) {
        const warrantyDoc = await uploadFile(warrantyFile);
        if (warrantyDoc) documents.push(warrantyDoc);
      }
      
      // Prepare warranty data
      const warrantyData: WarrantyInput = {
        product: formData.product,
        purchaseDate: formData.purchaseDate,
        expirationDate: expirationDate.toISOString(),
        warrantyProvider: formData.warrantyProvider,
        warrantyNumber: formData.warrantyNumber,
        coverageDetails: formData.coverageDetails,
        notes: formData.notes,
        status: 'active',
        documents
      };
      
      // Use the warrantyApi utility to create the warranty
      const response = await warrantyApi.createWarranty(warrantyData);
      
      if (response.error) {
        console.error('Error creating warranty:', response.error);
        setError(response.error);
        setIsLoading(false);
        return;
      }
      
      // Navigate to warranties list
      router.push('/user/warranties');
    } catch (error) {
      console.error('Error adding warranty:', error);
      setError("Failed to add warranty. Please try again.");
      setIsLoading(false);
    }
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <WarrantySidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/user/warranties" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Warranties
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-amber-900 mb-6">
            Add New Warranty
          </h1>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Warranty Information
              </CardTitle>
              <CardDescription className="text-amber-800">
                Fill in the details of your warranty
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
                    <Label htmlFor="product" className="text-amber-900">
                      Product Name *
                    </Label>
                    <Input
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      placeholder="e.g. Samsung TV"
                      className="border-2 border-amber-800 bg-amber-50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer" className="text-amber-900">
                      Manufacturer/Category *
                    </Label>
                    <Select 
                      value={formData.manufacturer} 
                      onValueChange={(value) => handleSelectChange("manufacturer", value)}
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
                    <Label htmlFor="warrantyProvider" className="text-amber-900">
                      Provider/Manufacturer *
                    </Label>
                    <Input
                      id="warrantyProvider"
                      name="warrantyProvider"
                      value={formData.warrantyProvider}
                      onChange={handleChange}
                      placeholder="e.g. Samsung Electronics"
                      className="border-2 border-amber-800 bg-amber-50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="warrantyNumber" className="text-amber-900">
                      Warranty Number
                    </Label>
                    <Input
                      id="warrantyNumber"
                      name="warrantyNumber"
                      value={formData.warrantyNumber}
                      onChange={handleChange}
                      placeholder="e.g. WR12345678"
                      className="border-2 border-amber-800 bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate" className="text-amber-900">
                      Purchase Date *
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
                      <Input
                        id="purchaseDate"
                        name="purchaseDate"
                        type="date"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        className="pl-10 border-2 border-amber-800 bg-amber-50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod" className="text-amber-900">
                      Warranty Period (months) *
                    </Label>
                    <Input
                      id="warrantyPeriod"
                      name="warrantyPeriod"
                      type="number"
                      min="1"
                      value={formData.warrantyPeriod}
                      onChange={handleChange}
                      placeholder="e.g. 12"
                      className="border-2 border-amber-800 bg-amber-50"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-amber-900">
                    Receipt Image
                  </Label>
                  <div className="border-2 border-dashed border-amber-800 rounded-lg p-6 bg-amber-50 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-amber-800 mb-2" />
                      <p className="text-amber-800 mb-2">
                        {receiptFile ? receiptFile.name : "Drag and drop or click to upload"}
                      </p>
                      <input
                        type="file"
                        id="receiptFile"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'receipt')}
                      />
                      <label htmlFor="receiptFile">
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
                  <Label className="text-amber-900">
                    Warranty Document
                  </Label>
                  <div className="border-2 border-dashed border-amber-800 rounded-lg p-6 bg-amber-50 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-amber-800 mb-2" />
                      <p className="text-amber-800 mb-2">
                        {warrantyFile ? warrantyFile.name : "Drag and drop or click to upload"}
                      </p>
                      <input
                        type="file"
                        id="warrantyFile"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'warranty')}
                      />
                      <label htmlFor="warrantyFile">
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
                  <Label htmlFor="coverageDetails" className="text-amber-900">
                    Coverage Details
                  </Label>
                  <Textarea
                    id="coverageDetails"
                    name="coverageDetails"
                    value={formData.coverageDetails}
                    onChange={handleChange}
                    placeholder="Describe what is covered by this warranty..."
                    className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-amber-900">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional information about this warranty..."
                    className="border-2 border-amber-800 bg-amber-50 min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Link href="/user/warranties">
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
                    ) : "Save Warranty"}
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