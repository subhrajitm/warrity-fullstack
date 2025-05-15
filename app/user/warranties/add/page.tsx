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
import { ArrowLeft, Calendar, Upload, AlertCircle, Loader2, Search, Info, Check } from "lucide-react"
import WarrantySidebar from "../components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { WarrantyInput, WarrantyDocument } from "@/types/warranty"
import { warrantyApi } from "@/lib/api"
import { productApi } from "@/lib/api"
import { format, addMonths, isValid, parseISO } from "date-fns"
import { toast } from "sonner"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Interface for product data
interface ProductOption {
  id: string;
  name: string;
  manufacturer: string;
}

interface FormData {
  productId: string;
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
    productId: "",
    purchaseDate: new Date().toISOString().split('T')[0], // Set default to today
    warrantyPeriod: "",
    warrantyProvider: "",
    warrantyNumber: "",
    coverageDetails: "",
    notes: ""
  })
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [warrantyFile, setWarrantyFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null)
  
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
  
  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      try {
        const response = await productApi.getAllProducts()
        if (response.error) {
          console.error('Error fetching products:', response.error)
          setError('Failed to load products. Please try again later.')
        } else {
          const productOptions = response.data?.map(product => ({
            id: product.id || product._id || '',  // Ensure id is always a string
            name: product.name,
            manufacturer: product.manufacturer || 'Unknown'
          })) || []
          setProducts(productOptions)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoadingProducts(false)
      }
    }
    
    if (isAuthenticated && !authLoading) {
      fetchProducts()
    }
  }, [isAuthenticated, authLoading])
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate expiration date preview
  const expirationDatePreview = formData.purchaseDate && formData.warrantyPeriod
    ? addMonths(parseISO(formData.purchaseDate), parseInt(formData.warrantyPeriod))
    : null

  // Validate form fields
  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {}
    
    switch (name) {
      case 'purchaseDate':
        const purchaseDate = new Date(value)
        if (!isValid(purchaseDate)) {
          errors[name] = 'Invalid date format'
        } else if (purchaseDate > new Date()) {
          errors[name] = 'Purchase date cannot be in the future'
        }
        break
      case 'warrantyPeriod':
        const months = parseInt(value)
        if (!value.trim()) {
          errors[name] = 'Warranty period is required'
        } else if (isNaN(months)) {
          errors[name] = 'Warranty period must be a number'
        } else if (months <= 0) {
          errors[name] = 'Warranty period must be greater than 0'
        } else if (months > 120) { // 10 years
          errors[name] = 'Warranty period seems unusually long'
        }
        break
      case 'warrantyProvider':
        if (!value.trim()) {
          errors[name] = 'Warranty provider is required'
        }
        break
      case 'warrantyNumber':
        if (!value.trim()) {
          errors[name] = 'Warranty number is required'
        }
        break
      case 'coverageDetails':
        if (!value.trim()) {
          errors[name] = 'Coverage details are required'
        }
        break
    }
    
    setValidationErrors(prev => ({ ...prev, ...errors }))
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Validate field on change
    validateField(name, value)
    
    // Special handling for date inputs
    if (name === 'purchaseDate') {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }))
      }
      return
    }
    
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
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'receipt' | 'warranty') => {
    const file = e.target.files?.[0] || null
    if (!file) return

    // Validate file type
    const allowedTypes = type === 'receipt' 
      ? ['image/jpeg', 'image/png', 'image/gif']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type. ${type === 'receipt' ? 'Please upload an image' : 'Please upload a PDF or Word document'}`)
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreviewUrls(prev => ({ ...prev, [type]: previewUrl }))

    if (type === 'receipt') {
      setReceiptFile(file)
    } else {
      setWarrantyFile(file)
    }
  }
  
  const uploadFile = async (file: File): Promise<WarrantyDocument | null> => {
    try {
      // Use the warrantyApi utility to upload the file
      return await warrantyApi.uploadDocument(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    
    // Validate form
    if (!formData.productId || !formData.purchaseDate || !formData.warrantyPeriod) {
      setError("Please fill in all required fields")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Calculate expiration date based on purchase date and warranty period
      const purchaseDate = new Date(formData.purchaseDate);
      
      // Ensure purchaseDate is valid
      if (isNaN(purchaseDate.getTime())) {
        setError("Invalid purchase date format");
        setIsLoading(false);
        return;
      }
      
      // Parse warranty period as integer (in months)
      const warrantyPeriodMonths = parseInt(formData.warrantyPeriod);
      
      // Validate warranty period
      if (isNaN(warrantyPeriodMonths) || warrantyPeriodMonths <= 0) {
        setError("Warranty period must be a positive number");
        setIsLoading(false);
        return;
      }
      
      // Calculate expiration date by adding months to purchase date
      const expirationDate = new Date(purchaseDate);
      expirationDate.setMonth(purchaseDate.getMonth() + warrantyPeriodMonths);
      
      // Ensure the expiration date is in the future
      const today = new Date();
      if (expirationDate <= today) {
        setError("Warranty expiration date must be in the future");
        setIsLoading(false);
        return;
      }
      
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
        product: formData.productId, // Use the product ID from the form
        purchaseDate: purchaseDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        expirationDate: expirationDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
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
        
        // Check if the response contains validation errors
        if (response.validationErrors && Array.isArray(response.validationErrors)) {
          // Format validation errors for display
          const errorMessages = response.validationErrors
            .map((err: { path: string; msg: string }) => `${err.path}: ${err.msg}`)
            .join(', ');
          setError(`Validation error: ${errorMessages}`);
        } else {
          setError(response.error);
        }
        
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
  
  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.showPicker();
  }

  const handleProductSelect = (product: ProductOption) => {
    setSelectedProduct(product)
    setFormData(prev => ({ ...prev, productId: product.id }))
    setOpen(false)
    setSearchQuery("")
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
                <Card className="border-2 border-amber-800 bg-amber-100">
                  <CardHeader className="border-b-2 border-amber-800 bg-amber-200 px-6 py-4">
                    <CardTitle className="text-xl font-bold text-amber-900">Product Information</CardTitle>
                    <CardDescription className="text-amber-800">Select the product for this warranty</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-amber-900">Product *</Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between border-2 border-amber-800 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-900"
                          >
                            {selectedProduct ? (
                              <div className="flex items-center">
                                <span>{selectedProduct.name}</span>
                                <span className="ml-2 text-amber-600">({selectedProduct.manufacturer})</span>
                              </div>
                            ) : (
                              "Search and select a product..."
                            )}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 border-2 border-amber-800 bg-amber-50" align="start">
                          <Command>
                            <CommandInput 
                              placeholder="Search products..." 
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                              className="border-amber-800 focus:ring-amber-800"
                            />
                            <CommandEmpty className="py-6 text-center text-sm text-amber-800">
                              {loadingProducts ? (
                                <div className="flex items-center justify-center">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading products...</span>
                                </div>
                              ) : (
                                "No products found."
                              )}
                            </CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-auto">
                              {filteredProducts.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={`${product.name} ${product.manufacturer}`}
                                  onSelect={() => handleProductSelect(product)}
                                  className="text-amber-900 hover:bg-amber-200 hover:text-amber-900 cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="text-sm text-amber-600">{product.manufacturer}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {validationErrors.productId && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.productId}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid gap-6 md:grid-cols-2">
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
                        onClick={handleDateClick}
                        className="pl-10 border-2 border-amber-800 bg-amber-50 text-amber-900 cursor-pointer"
                        required
                        max={new Date().toISOString().split('T')[0]}
                        min="2000-01-01"
                        onKeyDown={(e) => e.preventDefault()}
                      />
                    </div>
                    {validationErrors.purchaseDate && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.purchaseDate}</p>
                    )}
                    <p className="text-sm text-amber-700 mt-1">
                      Click to select a date between 2000 and today
                    </p>
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
                      className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                      required
                    />
                    {validationErrors.warrantyPeriod && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.warrantyPeriod}</p>
                    )}
                    {expirationDatePreview && (
                      <p className="text-sm text-amber-700 mt-1">
                        Warranty will expire on: {format(expirationDatePreview, 'MMMM d, yyyy')}
                      </p>
                    )}
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
                      className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                      required
                    />
                    {validationErrors.warrantyProvider && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.warrantyProvider}</p>
                    )}
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
                      className="border-2 border-amber-800 bg-amber-50 text-amber-900"
                    />
                    {validationErrors.warrantyNumber && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.warrantyNumber}</p>
                    )}
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
                      {previewUrls.receipt && (
                        <div className="mt-2">
                          <img 
                            src={previewUrls.receipt} 
                            alt="Receipt preview" 
                            className="max-h-32 rounded-md"
                          />
                        </div>
                      )}
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
                          className="border-2 border-amber-800 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
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
                          className="border-2 border-amber-800 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
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
                    className="border-2 border-amber-800 bg-amber-50 text-amber-900 min-h-[100px]"
                  />
                  {validationErrors.coverageDetails && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.coverageDetails}</p>
                  )}
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
                    className="border-2 border-amber-800 bg-amber-50 text-amber-900 min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Link href="/user/warranties">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-2 border-amber-800 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit"
                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                    disabled={isLoading || Object.keys(validationErrors).length > 0}
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