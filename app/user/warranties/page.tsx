"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  PlusCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Package,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react"
import WarrantySidebar from "./components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { Warranty } from "@/types/warranty"
import { warrantyApi } from "@/lib/api"
import { toast } from "react-hot-toast"

// Create a component that uses useSearchParams
function WarrantiesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [filteredWarranties, setFilteredWarranties] = useState<Warranty[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Warranty>("expirationDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch warranties from API
  const fetchWarranties = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching warranties from API...')
      
      const response = await warrantyApi.getAllWarranties()
      
      if (response.error) {
        console.error('Error fetching warranties:', response.error)
        setError(response.error)
        return []
      }
      
      console.log('Warranties data received:', response.data)
      
      if (!response.data) {
        return []
      }
      
      const warrantyList = Array.isArray(response.data) 
        ? response.data 
        : (response.data as { warranties: Warranty[] }).warranties || []
      
      setWarranties(warrantyList)
      
      // Apply filters after fetching
      const status = searchParams?.get('status')
      if (status) {
        setStatusFilter(status)
        const filtered = warrantyList.filter(w => w.status === status)
        setFilteredWarranties(filtered)
      } else {
        setStatusFilter(null)
        setFilteredWarranties(warrantyList)
      }
      
      return warrantyList
    } catch (err) {
      console.error('Error fetching warranties:', err)
      setError(err instanceof Error ? err.message : 'Failed to load warranties. Please try again later.')
      return []
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle warranty deletion
  const handleDeleteWarranty = async (id: string) => {
    if (confirm("Are you sure you want to delete this warranty?")) {
      try {
        const response = await warrantyApi.deleteWarranty(id)
        if (response.error) {
          toast.error('Failed to delete warranty: ' + response.error)
          return
        }
        toast.success('Warranty deleted successfully')
        
        // Update local state immediately
        setWarranties(prevWarranties => prevWarranties.filter(w => w._id !== id && w.id !== id))
        setFilteredWarranties(prevFiltered => prevFiltered.filter(w => w._id !== id && w.id !== id))
        
        // Then fetch fresh data from the server
        await fetchWarranties()
      } catch (error) {
        toast.error('An error occurred while deleting the warranty')
        console.error('Error deleting warranty:', error)
      }
    }
  }
  
  // Check if user is logged in and fetch warranties
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user && user.role !== 'user') {
        router.replace(user.role === 'admin' ? '/admin' : '/login')
      } else {
        fetchWarranties()
      }
    }
  }, [router, searchParams, authLoading, isAuthenticated, user])
  
  // Add effect to refresh data when the page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchWarranties()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
  
  // Update filtered warranties when status filter changes
  useEffect(() => {
    const status = searchParams?.get('status')
    if (status) {
      setStatusFilter(status)
      const filtered = warranties.filter(w => w.status === status)
      setFilteredWarranties(filtered)
    } else {
      setStatusFilter(null)
      setFilteredWarranties(warranties)
    }
  }, [searchParams, warranties])
  
  // Filter and sort warranties
  useEffect(() => {
    let result = [...warranties]
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(warranty => warranty.status === statusFilter)
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(warranty => 
        (warranty.product && warranty.product.name.toLowerCase().includes(query)) || 
        (warranty.warrantyProvider && warranty.warrantyProvider.toLowerCase().includes(query)) ||
        (warranty.product && warranty.product.manufacturer.toLowerCase().includes(query))
      )
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      // Handle nested properties
      if (sortField === 'product') {
        valueA = a.product?.name || '';
        valueB = b.product?.name || '';
      } else {
        valueA = a[sortField as keyof Warranty] || '';
        valueB = b[sortField as keyof Warranty] || '';
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
    
    setFilteredWarranties(result)
  }, [warranties, statusFilter, searchQuery, sortField, sortDirection])
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  const handleSortChange = (field: keyof Warranty) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const getStatusBadge = (status: string) => {
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
  
  const getSortIcon = (field: keyof Warranty) => {
    if (sortField !== field) return null
    
    return sortDirection === 'asc' 
      ? <SortAsc className="h-4 w-4 ml-1" />
      : <SortDesc className="h-4 w-4 ml-1" />
  }
  
  // Return the component JSX
  if (isLoading) {
    return (
      <div className="flex-1 p-6 ml-64 flex items-center justify-center">
        <p className="text-amber-800 text-xl">Loading warranties...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-4 rounded mb-6">
            <p>{error}</p>
            <Button 
              onClick={() => fetchWarranties().then(data => {
                setWarranties(data)
                setFilteredWarranties(data)
                setError(null)
              })}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex-1 p-6 ml-64">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900">
            {statusFilter 
              ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Warranties` 
              : "My Warranties"}
          </h1>
          <Link href="/user/warranties/add">
            <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Warranty
            </Button>
          </Link>
        </div>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
                <Input
                  placeholder="Search warranties..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 border-2 border-amber-800 bg-amber-50"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className={`border-2 ${!statusFilter 
                    ? 'bg-amber-200 border-amber-900 text-amber-900 hover:bg-amber-300 hover:text-amber-900' 
                    : 'bg-amber-50 border-amber-800 text-amber-800 hover:bg-amber-100 hover:text-amber-900'}`}
                  onClick={() => router.push('/user/warranties')}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'active' 
                    ? 'bg-green-200 border-green-900 text-green-900 hover:bg-green-300 hover:text-green-900' 
                    : 'bg-amber-50 border-amber-800 text-amber-800 hover:bg-amber-100 hover:text-amber-900'}`}
                  onClick={() => router.push('/user/warranties?status=active')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Active
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'expiring' 
                    ? 'bg-amber-200 border-amber-900 text-amber-900 hover:bg-amber-300 hover:text-amber-900' 
                    : 'bg-amber-50 border-amber-800 text-amber-800 hover:bg-amber-100 hover:text-amber-900'}`}
                  onClick={() => router.push('/user/warranties?status=expiring')}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Expiring
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'expired' 
                    ? 'bg-red-200 border-red-900 text-red-900 hover:bg-red-300 hover:text-red-900' 
                    : 'bg-amber-50 border-amber-800 text-amber-800 hover:bg-amber-100 hover:text-amber-900'}`}
                  onClick={() => router.push('/user/warranties?status=expired')}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Expired
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-amber-900">
                {filteredWarranties.length} {filteredWarranties.length === 1 ? 'Warranty' : 'Warranties'}
              </CardTitle>
              <div className="flex items-center text-sm text-amber-800">
                <Filter className="h-4 w-4 mr-1" />
                Sort by:
                <button 
                  className="ml-2 flex items-center font-medium hover:text-amber-600"
                  onClick={() => handleSortChange('product')}
                >
                  Name {getSortIcon('product')}
                </button>
                <span className="mx-2">|</span>
                <button 
                  className="flex items-center font-medium hover:text-amber-600"
                  onClick={() => handleSortChange('expirationDate')}
                >
                  Expiry Date {getSortIcon('expirationDate')}
                </button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {filteredWarranties.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-amber-800 mx-auto mb-4 opacity-50" />
                <p className="text-amber-800 text-lg mb-2">No warranties found</p>
                <p className="text-amber-700 mb-6">
                  {searchQuery 
                    ? "Try adjusting your search or filters" 
                    : statusFilter 
                      ? `You don't have any ${statusFilter} warranties` 
                      : "Add your first warranty to get started"}
                </p>
                
                <Link href="/user/warranties/add">
                  <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Warranty
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWarranties.map(warranty => {
                  // Debug log to see the warranty object structure
                  console.log('Warranty object:', warranty);
                  
                  // Use _id if available, fall back to id
                  const warrantyId = warranty._id || warranty.id;
                  
                  return (
                  <Link key={warrantyId} href={`/user/warranties/${warrantyId}`}>
                    <div className="flex justify-between items-center p-4 border-2 border-amber-800 rounded-lg bg-amber-50 hover:bg-amber-200 transition-colors">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <Package className="h-10 w-10 text-amber-800" />
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-900">{warranty.product?.name || 'Unknown Product'}</h3>
                          <p className="text-sm text-amber-700">{warranty.warrantyProvider}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            {getStatusBadge(warranty.status)}
                            <Badge className="bg-amber-800">{warranty.product?.manufacturer || 'Unknown'}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-amber-800">
                          <Calendar className="h-4 w-4 mr-1" />
                          Expires: {new Date(warranty.expirationDate).toLocaleDateString()}
                        </div>
                        <ChevronRight className="h-5 w-5 text-amber-800 mt-2 ml-auto" />
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main component that wraps the content in a Suspense boundary
export default function WarrantiesPage() {
  return (
    <div className="flex min-h-screen bg-amber-50">
      <WarrantySidebar />
      <Suspense fallback={
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading warranties...</p>
        </div>
      }>
        <WarrantiesContent />
      </Suspense>
    </div>
  )
}