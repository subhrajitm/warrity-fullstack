"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, Edit, Trash2, AlertTriangle, CheckCircle, ArrowLeft, User } from "lucide-react"

// Mock data for demonstration
const mockWarranty = {
  id: 3,
  product: "MacBook Pro",
  category: "Electronics",
  purchaseDate: "2022-05-20",
  startDate: "2022-05-20",
  endDate: "2023-08-25",
  price: "$1,999",
  status: "expiring",
  provider: "Apple Inc.",
  type: "limited",
  terms: "1 year limited warranty with option to extend",
  extendable: "yes",
  claimProcess: "Contact Apple Support or visit an Apple Store with proof of purchase.",
  coverageDetails: "Covers manufacturing defects, battery service, and up to two incidents of accidental damage protection every 12 months.",
  user: {
    id: 5,
    name: "Emily Johnson",
    email: "emily.johnson@example.com"
  }
}

export default function AdminWarrantyDetailsPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const warrantyId = unwrappedParams.id;
  
  const router = useRouter()
  const [warranty, setWarranty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in and fetch warranty data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the warranty data based on the ID
    console.log(`Fetching warranty with ID: ${warrantyId}`)
    
    // Set mock data
    setWarranty(mockWarranty)
    setIsLoading(false)
  }, [router, warrantyId])
  
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
    if (confirm("Are you sure you want to delete this warranty?")) {
      console.log(`Deleting warranty with ID: ${warrantyId}`)
      // In a real app, you would send a delete request to your backend
      
      // Redirect to warranties list
      router.push('/admin/warranties')
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-amber-800 text-xl">Loading warranty details...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/warranties" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Warranties
        </Link>
      </div>
      
      <Card className="max-w-4xl mx-auto border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold text-[rgb(146,64,14)] font-mono tracking-tight">
                {warranty.product}
              </CardTitle>
              <CardDescription className="text-amber-800 font-medium">
                {warranty.category.charAt(0).toUpperCase() + warranty.category.slice(1)} • {warranty.provider}
              </CardDescription>
            </div>
            <div>
              {getStatusBadge(warranty.status)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-4 p-3 bg-amber-200 border-2 border-amber-300 rounded-md">
            <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center">
              <User className="mr-2 h-5 w-5" />
              User Information
            </h3>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div>
                <span className="text-amber-700">Name:</span>{" "}
                <Link href={`/admin/users/${warranty.user.id}`} className="text-amber-900 font-medium hover:underline">
                  {warranty.user.name}
                </Link>
              </div>
              <div>
                <span className="text-amber-700">Email:</span>{" "}
                <span className="text-amber-900 font-medium">{warranty.user.email}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Warranty Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Type:</span>
                    <span className="text-amber-900 font-medium">{warranty.type.charAt(0).toUpperCase() + warranty.type.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Start Date:</span>
                    <span className="text-amber-900 font-medium">{warranty.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">End Date:</span>
                    <span className="text-amber-900 font-medium">{warranty.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Extendable:</span>
                    <span className="text-amber-900 font-medium">{warranty.extendable === 'yes' ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Product Price:</span>
                    <span className="text-amber-900 font-medium">{warranty.price}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-amber-300" />
              
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Terms</h3>
                <p className="text-amber-900">{warranty.terms}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Coverage Details</h3>
                <p className="text-amber-900">{warranty.coverageDetails}</p>
              </div>
              
              <Separator className="bg-amber-300" />
              
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Claim Process</h3>
                <p className="text-amber-900">{warranty.claimProcess}</p>
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
            Delete Warranty
          </Button>
          
          <Link href={`/admin/warranties/${warrantyId}/edit`}>
            <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
              <Edit className="mr-2 h-4 w-4" />
              Edit Warranty
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}