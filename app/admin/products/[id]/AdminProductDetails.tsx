"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Product } from "@/types/product"
import { productApi, adminApi, ServiceInfo } from "@/lib/api"
import { toast } from "sonner"
import { ServiceInfoDisplay } from '../../../../components/service-info-display'

interface Props {
  product: Product;
}

export default function AdminProductDetails({ product }: Props) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch service information
  useEffect(() => {
    const fetchServiceInfo = async () => {
      try {
        setIsLoading(true)
        if (product.serviceInfo) {
          console.log('Fetching service info for ID:', product.serviceInfo)
          const response = await adminApi.getServiceInfoById(product.serviceInfo)
          console.log('Service info response:', response)
          
          if (response.error) {
            console.error('Error in response:', response.error)
            toast.error('Failed to load service information: ' + response.error)
            return
          }
          
          if (response.data?.serviceInfo) {
            setServiceInfo(response.data.serviceInfo)
          } else {
            console.log('No service info found in response:', response)
            toast.error('No service information found')
          }
        } else {
          console.log('No serviceInfo ID found in product:', product)
        }
      } catch (error) {
        console.error('Error fetching service info:', error)
        toast.error('Failed to load service information')
      } finally {
        setIsLoading(false)
      }
    }

    fetchServiceInfo()
  }, [product.serviceInfo])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await productApi.deleteProduct(product._id)
      if (response.error) {
        toast.error('Failed to delete product: ' + response.error)
        return
      }
      toast.success('Product deleted successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

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
          <Link href={`/admin/products/${product._id}/edit`}>
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
                    <h3 className="text-sm font-medium text-amber-700">Serial Number</h3>
                    <p className="text-amber-900 font-semibold">{product.serialNumber}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Manufacturer</h3>
                    <p className="text-amber-900 font-semibold">{product.manufacturer || '-'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Model</h3>
                    <p className="text-amber-900 font-semibold">{product.model || '-'}</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Purchase Date</h3>
                    <p className="text-amber-900 font-semibold">
                      {product.purchaseDate
                        ? new Date(product.purchaseDate).toLocaleDateString()
                        : '-'
                      }
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Price</h3>
                    <p className="text-amber-900 font-semibold">{product.price || '-'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Purchase Location</h3>
                    <p className="text-amber-900 font-semibold">{product.purchaseLocation || '-'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700">Receipt Number</h3>
                    <p className="text-amber-900 font-semibold">{product.receiptNumber || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-amber-700">Description</h3>
                  <p className="text-amber-900 mt-1 whitespace-pre-wrap">{product.description || '-'}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-amber-700">Notes</h3>
                  <p className="text-amber-900 mt-1 whitespace-pre-wrap">{product.notes || '-'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-amber-800">
                  <div>
                    <h3 className="text-sm font-medium text-amber-700">Created At</h3>
                    <p className="text-amber-900 font-semibold">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-amber-700">Last Updated</h3>
                    <p className="text-amber-900 font-semibold">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-2xl font-bold text-amber-900">
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ServiceInfoDisplay
                serviceInfo={serviceInfo}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 