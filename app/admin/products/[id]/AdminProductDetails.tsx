"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  sku: string;
  stock: number;
  status: string;
  warrantyPeriod: string;
  warrantyTerms: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  specifications: Array<{ name: string; value: string; }>;
}

interface Props {
  product: Product;
  productId: string;
}

export default function AdminProductDetails({ product, productId }: Props) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Active
          </Badge>
        )
      case 'inactive':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Inactive
          </Badge>
        )
      case 'low_stock':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Low Stock
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200">
            {status}
          </Badge>
        )
    }
  }
  
  const handleDelete = () => {
    console.log(`Deleting product with ID: ${productId}`)
    // In a real app, you would send a delete request to your backend
    
    // Redirect to products list
    router.push('/admin/products')
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">{product.name}</h1>
        
        <div className="flex space-x-3">
          <Link href={`/admin/products/${productId}/edit`}>
            <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
          
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-2 border-red-800 text-red-800 hover:bg-red-100">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-amber-900">Confirm Deletion</DialogTitle>
                <DialogDescription className="text-amber-800">
                  Are you sure you want to delete this product? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteDialogOpen(false)}
                  className="border-2 border-amber-800 text-amber-800"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDelete}
                  className="bg-red-800 hover:bg-red-900 text-white border-2 border-red-900"
                >
                  Delete Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-2xl font-bold text-amber-900">
                Product Information
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Category</h3>
                    <p className="text-amber-900 font-semibold">{product.category}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Price</h3>
                    <p className="text-amber-900 font-semibold">${product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">SKU</h3>
                    <p className="text-amber-900 font-semibold">{product.sku}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Stock</h3>
                    <p className="text-amber-900 font-semibold">{product.stock} units</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Status</h3>
                    <div className="mt-1">{getStatusBadge(product.status)}</div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Warranty Period</h3>
                    <p className="text-amber-900 font-semibold">{product.warrantyPeriod}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Created</h3>
                    <p className="text-amber-900 font-semibold">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Last Updated</h3>
                    <p className="text-amber-900 font-semibold">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <h3 className="text-sm font-medium text-amber-700">Description</h3>
                <p className="text-amber-900 mt-1">{product.description}</p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-amber-700">Warranty Terms</h3>
                <p className="text-amber-900 mt-1">{product.warrantyTerms}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-2xl font-bold text-amber-900">
                Specifications
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="border-2 border-amber-800 rounded-lg p-3 bg-amber-50">
                    <h4 className="text-sm font-medium text-amber-700">{spec.name}</h4>
                    <p className="text-amber-900 font-semibold mt-1">{spec.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-2xl font-bold text-amber-900">
                Product Images
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                {product.images.map((image, index) => (
                  <div key={index} className="border-2 border-amber-800 rounded-lg overflow-hidden">
                    <img src={image} alt={`${product.name} - Image ${index + 1}`} className="w-full h-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 