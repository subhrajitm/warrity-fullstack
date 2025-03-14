"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, CheckCircle, Clock, AlertTriangle, User } from "lucide-react"
import AdminSidebar from "../../components/sidebar"

// Mock product data
const mockProduct = {
  id: 3,
  name: "MacBook Pro 16\"",
  category: "Electronics",
  brand: "Apple",
  model: "MacBook Pro M1 Pro",
  serialNumber: "C2C3456789",
  purchaseDate: "2022-08-05",
  price: 2499.99,
  warrantyStatus: "expiring",
  warrantyEndDate: "2023-08-05",
  description: "16-inch MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD",
  notes: "Customer reported minor screen issue in June 2023, but did not file warranty claim.",
  userId: 2,
  userName: "Jane Smith",
  userEmail: "jane.smith@example.com"
}

export default function AdminProductDetailsPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in and fetch product data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the product data based on the ID
    console.log(`Fetching product with ID: ${id}`)
    
    // Set mock data
    setProduct(mockProduct)
    setIsLoading(false)
  }, [router, id])
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <Badge className="bg-green-500">Active</Badge>
          </div>
        )
      case "expiring":
        return (
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-amber-500" />
            <Badge className="bg-amber-500">Expiring Soon</Badge>
          </div>
        )
      case "expired":
        return (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <Badge className="bg-red-500">Expired</Badge>
          </div>
        )
      default:
        return (
          <div className="flex items-center">
            <Badge className="bg-gray-500">Unknown</Badge>
          </div>
        )
    }
  }
  
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      console.log(`Deleting product with ID: ${id}`)
      // In a real app, you would send a delete request to your backend
      
      // Redirect to products list
      router.push('/admin/products')
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <AdminSidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading product details...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="mb-6">
          <Link href="/admin/products" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-3xl font-bold text-amber-900">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-amber-800 font-medium">
                    {product.category} • {product.brand} • {product.model}
                  </CardDescription>
                </div>
                <div>
                  {getStatusBadge(product.warrantyStatus)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Product Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-amber-700">Serial Number:</span>
                        <span className="text-amber-900 font-medium">{product.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Purchase Date:</span>
                        <span className="text-amber-900 font-medium">{product.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Price:</span>
                        <span className="text-amber-900 font-medium">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Warranty End Date:</span>
                        <span className="text-amber-900 font-medium">{product.warrantyEndDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-amber-300" />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Description</h3>
                    <p className="text-amber-900">{product.description || "No description available."}</p>
                  </div>
                  
                  <Separator className="bg-amber-300" />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Notes</h3>
                    <p className="text-amber-900">{product.notes || "No notes available."}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Owner Information</h3>
                    <Card className="border-2 border-amber-300 bg-amber-50 p-4">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center mr-4">
                          <User className="h-6 w-6 text-amber-800" />
                        </div>
                        <div>
                          <h4 className="text-amber-900 font-medium">{product.userName}</h4>
                          <p className="text-amber-700 text-sm">{product.userEmail}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-amber-700">User ID:</span>
                          <span className="text-amber-900 font-medium">{product.userId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-700">Total Products:</span>
                          <span className="text-amber-900 font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-700">Account Status:</span>
                          <Badge className="bg-green-500">Active</Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href={`/admin/users/${product.userId}`}>
                          <Button variant="outline" className="w-full border-amber-800 text-amber-800">
                            View User Profile
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </div>
                  
                  <Separator className="bg-amber-300" />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Related Warranties</h3>
                    <div className="space-y-2">
                      <Card className="border-2 border-amber-300 bg-amber-50 p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-amber-900 font-medium">Standard Warranty</h4>
                            <p className="text-amber-700 text-sm">Expires: {product.warrantyEndDate}</p>
                          </div>
                          <Link href={`/admin/warranties/1`}>
                            <Button variant="outline" size="sm" className="border-amber-800 text-amber-800">
                              View
                            </Button>
                          </Link>
                        </div>
                      </Card>
                      <Card className="border-2 border-amber-300 bg-amber-50 p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-amber-900 font-medium">AppleCare+</h4>
                            <p className="text-amber-700 text-sm">Expires: 2024-08-05</p>
                          </div>
                          <Link href={`/admin/warranties/2`}>
                            <Button variant="outline" size="sm" className="border-amber-800 text-amber-800">
                              View
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-between">
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-800"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
              
              <Link href={`/admin/products/${id}/edit`}>
                <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}