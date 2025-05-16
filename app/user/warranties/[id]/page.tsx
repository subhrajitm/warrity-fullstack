"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Receipt,
  Store,
  FileText,
  Phone
} from "lucide-react"
import WarrantySidebar from "../components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { Warranty } from "@/types/warranty"
import { warrantyApi, adminApi } from "@/lib/api"
import { ServiceInfo } from "@/lib/api"
import { apiRequest } from "@/lib/api"

export default function WarrantyDetailPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [warranty, setWarranty] = useState<Warranty | null>(null)
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch warranty details from API
  const fetchWarrantyDetails = async (id: string) => {
    try {
      setIsLoading(true)
      
      // Use the warrantyApi utility which handles authentication automatically
      const response = await warrantyApi.getWarrantyById(id)
      
      if (response.error) {
        console.error('Error fetching warranty details:', response.error)
        setError(response.error)
        return null
      }
      
      // The response data is the warranty object directly
      if (!response.data) {
        throw new Error('Warranty not found')
      }

      // Fetch service info if product has serviceInfo
      if (response.data.product?.serviceInfo) {
        console.log('Product has serviceInfo:', response.data.product.serviceInfo);
        const serviceInfoResponse = await apiRequest(`/service-info/${response.data.product.serviceInfo}`);
        if (serviceInfoResponse.data?.serviceInfo) {
          console.log('Setting service info:', serviceInfoResponse.data.serviceInfo);
          setServiceInfo(serviceInfoResponse.data.serviceInfo)
        }
      } else {
        // Try to get company-level service info
        const serviceInfoResponse = await apiRequest(`/service-info/product/${response.data.product._id}`);
        if (serviceInfoResponse.data?.serviceInfo) {
          console.log('Setting company-level service info:', serviceInfoResponse.data.serviceInfo);
          setServiceInfo(serviceInfoResponse.data.serviceInfo)
        } else {
          console.log('No service info found for product or company');
        }
      }
      
      return response.data as Warranty
    } catch (err) {
      console.error('Error fetching warranty details:', err)
      setError('Failed to load warranty details. Please try again later.')
      return null
    } finally {
      setIsLoading(false)
    }
  }
  
  // Check if user is logged in and fetch data
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.role !== 'user') {
        router.replace(user?.role === 'admin' ? '/admin' : '/login')
      } else {
        // Fetch warranty details from API
        fetchWarrantyDetails(params.id).then(data => {
          setWarranty(data)
        })
      }
    }
  }, [router, params, authLoading, isAuthenticated, user])
  
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this warranty? This action cannot be undone.")) {
      try {
        setIsLoading(true)
        
        // Make sure we have a valid ID
        const warrantyId = warranty?._id || warranty?.id || params.id;
        if (!warrantyId) {
          setError("Invalid warranty ID");
          setIsLoading(false);
          return;
        }
        
        // Use the warrantyApi utility which handles authentication automatically
        const response = await warrantyApi.deleteWarranty(warrantyId)
        
        if (response.error) {
          console.error('Error deleting warranty:', response.error)
          setError(response.error)
          setIsLoading(false)
          return
        }
        
        // Redirect to warranties list
        router.push('/user/warranties')
      } catch (err) {
        console.error('Error deleting warranty:', err)
        setError('Failed to delete warranty. Please try again later.')
        setIsLoading(false)
      }
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        )
      case "expiring":
        return (
          <Badge className="bg-amber-500 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Expiring Soon
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-500 text-white">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-amber-800 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        <div className="flex-1 p-6 ml-64">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Error</h1>
            <p className="text-amber-800 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => fetchWarrantyDetails(params.id).then(data => {
                  setWarranty(data)
                  setError(null)
                })}
                className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
              >
                Try Again
              </Button>
              <Link href="/user/warranties">
                <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Warranties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!warranty) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <WarrantySidebar />
        <div className="flex-1 p-6 ml-64">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Warranty Not Found</h1>
            <p className="text-amber-800 mb-6">The warranty you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link href="/user/warranties">
              <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Warranties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-amber-900">{warranty.product?.name || "Unknown Product"}</h1>
            <div className="flex space-x-2">
              <Link href={`/user/warranties/${warranty._id || warranty.id}/edit`}>
                <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-2 border-red-800 text-red-800 hover:bg-red-100"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <CardTitle className="text-xl font-bold text-amber-900">
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Product:</span>
                  <span className="text-amber-900">{warranty.product?.name || "Unknown Product"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Category:</span>
                  <Badge className="bg-amber-800">{warranty.product?.manufacturer || "Unknown"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Status:</span>
                  {getStatusBadge(warranty.status)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <CardTitle className="text-xl font-bold text-amber-900">
                  Warranty Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Provider:</span>
                  <span className="text-amber-900">{warranty.warrantyProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Purchase Date:</span>
                  <div className="flex items-center text-amber-900">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(warranty.purchaseDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Expiry Date:</span>
                  <div className="flex items-center text-amber-900">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(warranty.expirationDate).toLocaleDateString()}
                  </div>
                </div>
                {warranty.warrantyNumber && (
                  <div className="flex justify-between">
                    <span className="text-amber-800 font-medium">Warranty Number:</span>
                    <span className="text-amber-900">{warranty.warrantyNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {warranty.documents && warranty.documents.length > 0 && (
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <CardTitle className="text-xl font-bold text-amber-900">
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {warranty.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-2 border-amber-800 rounded-lg bg-amber-50">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-amber-800 mr-3" />
                      <span className="text-amber-900">{doc.name}</span>
                    </div>
                    <a href={doc.path} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-amber-800 hover:bg-amber-900 text-amber-100">
                        View
                      </Button>
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {warranty.coverageDetails && (
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <CardTitle className="text-xl font-bold text-amber-900">
                  Coverage Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-amber-900 whitespace-pre-line">
                  {warranty.coverageDetails}
                </p>
              </CardContent>
            </Card>
          )}
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {serviceInfo ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-amber-800 font-medium">Service Type:</span>
                    <Badge className="bg-amber-800">{serviceInfo.serviceType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800 font-medium">Company:</span>
                    <span className="text-amber-900">{serviceInfo.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800 font-medium">Description:</span>
                    <span className="text-amber-900">{serviceInfo.description}</span>
                  </div>
                  {serviceInfo.contactInfo && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-amber-900 mb-2">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceInfo.contactInfo.email && (
                          <div className="flex items-center">
                            <span className="text-amber-800 font-medium mr-2">Email:</span>
                            <a href={`mailto:${serviceInfo.contactInfo.email}`} className="text-amber-900 hover:text-amber-700">
                              {serviceInfo.contactInfo.email}
                            </a>
                          </div>
                        )}
                        {serviceInfo.contactInfo.phone && (
                          <div className="flex items-center">
                            <span className="text-amber-800 font-medium mr-2">Phone:</span>
                            <a href={`tel:${serviceInfo.contactInfo.phone}`} className="text-amber-900 hover:text-amber-700">
                              {serviceInfo.contactInfo.phone}
                            </a>
                          </div>
                        )}
                        {serviceInfo.contactInfo.website && (
                          <div className="flex items-center">
                            <span className="text-amber-800 font-medium mr-2">Website:</span>
                            <a href={serviceInfo.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-amber-900 hover:text-amber-700">
                              {serviceInfo.contactInfo.website}
                            </a>
                          </div>
                        )}
                        {serviceInfo.contactInfo.address && (
                          <div className="flex items-center">
                            <span className="text-amber-800 font-medium mr-2">Address:</span>
                            <span className="text-amber-900">{serviceInfo.contactInfo.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {serviceInfo.warrantyInfo && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-amber-900 mb-2">Warranty Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceInfo.warrantyInfo.duration && (
                          <div className="flex items-center">
                            <span className="text-amber-800 font-medium mr-2">Duration:</span>
                            <span className="text-amber-900">{serviceInfo.warrantyInfo.duration}</span>
                          </div>
                        )}
                        {serviceInfo.warrantyInfo.coverage && (
                          <div className="flex items-center">
                            <span className="text-amber-800 font-medium mr-2">Coverage:</span>
                            <span className="text-amber-900">{serviceInfo.warrantyInfo.coverage}</span>
                          </div>
                        )}
                        {serviceInfo.warrantyInfo.exclusions && (
                          <div className="flex items-center">
                            <span className="text-amber-800 font-medium mr-2">Exclusions:</span>
                            <span className="text-amber-900">{serviceInfo.warrantyInfo.exclusions}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {serviceInfo.terms && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-amber-900 mb-2">Terms and Conditions</h4>
                      <p className="text-amber-900 whitespace-pre-line">{serviceInfo.terms}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-amber-800 text-lg font-medium mb-2">No Service Information Available</div>
                  <p className="text-amber-600">
                    Service information is not available for this product. Please contact the manufacturer for support.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {warranty.notes && (
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <CardTitle className="text-xl font-bold text-amber-900">
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-amber-900 whitespace-pre-line">
                  {warranty.notes || "No notes added."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}