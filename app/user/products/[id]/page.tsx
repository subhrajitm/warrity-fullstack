"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, DollarSign, Clock, Tag, ShoppingBag, FileText, Edit, Trash } from "lucide-react"
// Fix the import path to point to the correct location
import ProductSidebar from "../components/sidebar"
import { useAuth } from "@/lib/auth-context"

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Samsung 55\" QLED TV",
    category: "Electronics",
    purchaseDate: "2023-05-15",
    price: 899.99,
    image: "/images/tv.jpg",
    warrantyExpiration: "2025-05-15",
    status: "Active",
    description: "4K Ultra HD Smart TV with Quantum HDR, built-in Alexa, and Object Tracking Sound.",
    serialNumber: "SN12345678",
    purchaseLocation: "Best Buy",
    receiptImage: "/images/receipt.jpg",
    warrantyDocuments: [
      { name: "Manufacturer Warranty", url: "/docs/warranty1.pdf" },
      { name: "Extended Protection Plan", url: "/docs/warranty2.pdf" }
    ],
    notes: "Registered product on Samsung website for extended warranty coverage."
  },
  // ... other products
];

interface WarrantyDocument {
  name: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  price: number;
  image: string;
  warrantyExpiration: string;
  status: string;
  description: string;
  serialNumber: string;
  purchaseLocation: string;
  receiptImage: string;
  warrantyDocuments: WarrantyDocument[];
  notes: string;
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.role !== 'user') {
        router.replace(user?.role === 'admin' ? '/admin' : '/login')
      } else {
        // Fetch product data
        const productId = params.id
        
        // In a real app, you would fetch from an API
        setTimeout(() => {
          const foundProduct = mockProducts.find(p => p.id === productId)
          
          if (foundProduct) {
            setProduct(foundProduct)
          } else {
            // Product not found, redirect to products page
            router.replace('/user/products')
          }
          
          setIsLoading(false)
        }, 500)
      }
    }
  }, [params.id, router, authLoading, isAuthenticated, user])
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'Active':
        return 'bg-green-500'
      case 'Expiring Soon':
        return 'bg-amber-500'
      case 'Expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  const getDaysRemaining = (expirationDate: string): number => {
    const expDate = new Date(expirationDate)
    const today = new Date()
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <ProductSidebar />
        
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading product details...</p>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <ProductSidebar />
        
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Product Not Found</h2>
            <p className="text-amber-700 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/user/products">
              <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
        
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image and Basic Info */}
            <div className="w-full md:w-1/3">
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 overflow-hidden">
                <div className="relative h-64 w-full bg-amber-200">
                  {product.image ? (
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="p-4"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBag className="h-24 w-24 text-amber-400" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-amber-900">{product.name}</h2>
                    <Badge className={`ml-2 ${getStatusColor(product.status)}`}>
                      {product.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-amber-800">
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="text-sm">{product.category}</span>
                    </div>
                    
                    <div className="flex items-center text-amber-800">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Purchased: {formatDate(product.purchaseDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-amber-800">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">Price: ${product.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center text-amber-800">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Warranty expires: {formatDate(product.warrantyExpiration)}
                        {product.status === 'Active' && (
                          <span className="ml-1 text-green-600">
                            ({getDaysRemaining(product.warrantyExpiration)} days left)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-amber-200 border-t-4 border-amber-800 p-4 flex justify-between">
                  <Button variant="outline" className="border-amber-800 text-amber-800">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="border-red-600 text-red-600">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Product Details */}
            <div className="w-full md:w-2/3">
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
                <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                  <CardTitle className="text-xl font-bold text-amber-900">Product Details</CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-amber-900 mb-2">Description</h3>
                      <p className="text-amber-700">{product.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <h3 className="text-lg font-medium text-amber-900 mb-2">Serial Number</h3>
                        <p className="text-amber-700">{product.serialNumber}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-amber-900 mb-2">Purchase Location</h3>
                        <p className="text-amber-700">{product.purchaseLocation}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-medium text-amber-900 mb-2">Notes</h3>
                      <p className="text-amber-700">{product.notes || "No notes added."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
                <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                  <CardTitle className="text-xl font-bold text-amber-900">Warranty Documents</CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-amber-900 mb-2">Receipt</h3>
                      {product.receiptImage ? (
                        <div className="relative h-40 w-full md:w-1/2 border-2 border-amber-300 rounded-md overflow-hidden">
                          <Image 
                            src={product.receiptImage} 
                            alt="Receipt"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100">
                              View Full Size
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-amber-700">No receipt image uploaded.</p>
                      )}
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-medium text-amber-900 mb-2">Warranty Documents</h3>
                      {product.warrantyDocuments && product.warrantyDocuments.length > 0 ? (
                        <div className="space-y-2">
                          {product.warrantyDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center p-3 border-2 border-amber-300 rounded-md bg-amber-50">
                              <FileText className="h-5 w-5 text-amber-800 mr-3" />
                              <span className="text-amber-900 flex-1">{doc.name}</span>
                              <Button variant="outline" className="border-amber-800 text-amber-800" asChild>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">View</a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-amber-700">No warranty documents uploaded.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}