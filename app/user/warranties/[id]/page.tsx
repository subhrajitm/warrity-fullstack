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

// Mock data for demonstration
const mockWarranty = {
  id: 1,
  product: "Samsung TV",
  category: "electronics",
  provider: "Samsung Electronics",
  providerContact: "+1 (800) 726-7864",
  purchaseDate: "2023-01-15",
  endDate: "2024-05-15",
  status: "active",
  purchasePrice: "$1,299.99",
  receiptImage: "/receipt.jpg",
  warrantyDocument: "/warranty.pdf",
  notes: "Extended warranty purchased for an additional year. Includes coverage for screen damage and hardware failures.",
  claimProcess: "Contact Samsung customer service at the provided number. Have your serial number and proof of purchase ready. For in-store service, visit any authorized Samsung service center."
}

export default function WarrantyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [warranty, setWarranty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if user is logged in and fetch data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'user') {
      router.replace(role === 'admin' ? '/admin' : '/login')
    }
    
    // In a real app, you would fetch the warranty details from your backend
    setTimeout(() => {
      setWarranty(mockWarranty)
      setIsLoading(false)
    }, 500)
  }, [router, params])
  
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this warranty? This action cannot be undone.")) {
      // In a real app, you would send a delete request to your backend
      console.log(`Deleting warranty with ID: ${params.id}`)
      
      // Redirect back to warranties list
      router.push('/user/warranties')
    }
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case 'expiring':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        )
      case 'expired':
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
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
            <h1 className="text-3xl font-bold text-amber-900">{warranty.product}</h1>
            <div className="flex space-x-2">
              <Link href={`/user/warranties/${warranty.id}/edit`}>
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
                  <span className="text-amber-900">{warranty.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Category:</span>
                  <Badge className="bg-amber-800">{warranty.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Status:</span>
                  {getStatusBadge(warranty.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Purchase Price:</span>
                  <span className="text-amber-900">{warranty.purchasePrice}</span>
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
                  <span className="text-amber-900">{warranty.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Purchase Date:</span>
                  <div className="flex items-center text-amber-900">
                    <Calendar className="h-4 w-4 mr-1" />
                    {warranty.purchaseDate}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Expiry Date:</span>
                  <div className="flex items-center text-amber-900">
                    <Calendar className="h-4 w-4 mr-1" />
                    {warranty.endDate}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800 font-medium">Contact:</span>
                  <div className="flex items-center text-amber-900">
                    <Phone className="h-4 w-4 mr-1" />
                    {warranty.providerContact}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <CardTitle className="text-xl font-bold text-amber-900">
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 border-2 border-amber-800 rounded-lg bg-amber-50">
                  <div className="flex items-center">
                    <Receipt className="h-6 w-6 text-amber-800 mr-3" />
                    <span className="text-amber-900">Purchase Receipt</span>
                  </div>
                  <Button size="sm" className="bg-amber-800 hover:bg-amber-900 text-amber-100">
                    View
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border-2 border-amber-800 rounded-lg bg-amber-50">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-amber-800 mr-3" />
                    <span className="text-amber-900">Warranty Document</span>
                  </div>
                  <Button size="sm" className="bg-amber-800 hover:bg-amber-900 text-amber-100">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
              <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
                <CardTitle className="text-xl font-bold text-amber-900">
                  Claim Process
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-amber-900 whitespace-pre-line">
                  {warranty.claimProcess}
                </p>
              </CardContent>
            </Card>
          </div>
          
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
        </div>
      </div>
    </div>
  )
}