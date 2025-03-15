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

// Define the warranty type
interface Warranty {
  id: number;
  product: string;
  category: string;
  provider: string;
  purchaseDate: string;
  endDate: string;
  status: string;
}

// Mock data for demonstration
const mockWarranties: Warranty[] = [
  {
    id: 1,
    product: "Samsung TV",
    category: "electronics",
    provider: "Samsung Electronics",
    purchaseDate: "2023-01-15",
    endDate: "2024-05-15",
    status: "active"
  },
  {
    id: 2,
    product: "Dyson Vacuum",
    category: "appliances",
    provider: "Dyson Inc.",
    purchaseDate: "2022-06-10",
    endDate: "2023-12-10",
    status: "expiring"
  },
  {
    id: 3,
    product: "MacBook Pro",
    category: "electronics",
    provider: "Apple Inc.",
    purchaseDate: "2022-05-20",
    endDate: "2023-08-25",
    status: "expiring"
  },
  {
    id: 4,
    product: "IKEA Sofa",
    category: "furniture",
    provider: "IKEA",
    purchaseDate: "2022-01-30",
    endDate: "2023-01-30",
    status: "expired"
  },
  {
    id: 5,
    product: "Nike Shoes",
    category: "clothing",
    provider: "Nike",
    purchaseDate: "2023-02-15",
    endDate: "2024-02-15",
    status: "active"
  },
  {
    id: 6,
    product: "Sony Headphones",
    category: "electronics",
    provider: "Sony",
    purchaseDate: "2022-11-05",
    endDate: "2023-11-05",
    status: "active"
  }
]

// Create a component that uses useSearchParams
function WarrantiesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [filteredWarranties, setFilteredWarranties] = useState<Warranty[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Warranty>("endDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  
  // Filter warranties by category
  const filterWarrantiesByCategory = (category: string) => {
    const filtered = warranties.filter(warranty => warranty.category === category)
    setFilteredWarranties(filtered)
  }
  
  // Check if user is logged in and fetch warranties
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'user') {
      router.replace(role === 'admin' ? '/admin' : '/login')
    }
    
    // In a real app, you would fetch the warranties from your backend
    setWarranties(mockWarranties)
    setFilteredWarranties(mockWarranties)
    setIsLoading(false)
    
    // Check if there's a category filter in the URL
    const category = searchParams?.get('category')
    if (category) {
      filterWarrantiesByCategory(category)
    }
    
    // Check if there's a status filter in the URL
    const status = searchParams?.get('status')
    if (status) {
      setStatusFilter(status)
      const filtered = mockWarranties.filter(warranty => warranty.status === status)
      setFilteredWarranties(filtered)
    }
  }, [router, searchParams])
  
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
        warranty.product.toLowerCase().includes(query) || 
        warranty.provider.toLowerCase().includes(query) ||
        warranty.category.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const valueA = a[sortField]
      const valueB = b[sortField]
      
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
                  className={`border-2 ${!statusFilter ? 'bg-amber-200 border-amber-900' : 'border-amber-800'} text-amber-800`}
                  onClick={() => router.push('/user/warranties')}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'active' ? 'bg-green-200 border-green-900' : 'border-amber-800'} text-amber-800`}
                  onClick={() => router.push('/user/warranties?status=active')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Active
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'expiring' ? 'bg-amber-200 border-amber-900' : 'border-amber-800'} text-amber-800`}
                  onClick={() => router.push('/user/warranties?status=expiring')}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Expiring
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'expired' ? 'bg-red-200 border-red-900' : 'border-amber-800'} text-amber-800`}
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
                  onClick={() => handleSortChange('endDate')}
                >
                  Expiry Date {getSortIcon('endDate')}
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
                {filteredWarranties.map(warranty => (
                  <Link key={warranty.id} href={`/user/warranties/${warranty.id}`}>
                    <div className="flex justify-between items-center p-4 border-2 border-amber-800 rounded-lg bg-amber-50 hover:bg-amber-200 transition-colors">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <Package className="h-10 w-10 text-amber-800" />
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-900">{warranty.product}</h3>
                          <p className="text-sm text-amber-700">{warranty.provider}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            {getStatusBadge(warranty.status)}
                            <Badge className="bg-amber-800">{warranty.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-amber-800">
                          <Calendar className="h-4 w-4 mr-1" />
                          Expires: {warranty.endDate}
                        </div>
                        <ChevronRight className="h-5 w-5 text-amber-800 mt-2 ml-auto" />
                      </div>
                    </div>
                  </Link>
                ))}
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