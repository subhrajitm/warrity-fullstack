"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Search, 
  Edit, 
  Trash2,
  Package,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

// Mock data for demonstration
const mockWarranties = [
  {
    id: 1,
    product: "Samsung TV",
    category: "electronics",
    provider: "Samsung Electronics",
    user: "John Doe",
    userId: 1,
    endDate: "2024-05-15",
    status: "active"
  },
  {
    id: 2,
    product: "Dyson Vacuum",
    category: "appliances",
    provider: "Dyson Inc.",
    user: "Jane Smith",
    userId: 2,
    endDate: "2023-12-10",
    status: "expiring"
  },
  {
    id: 3,
    product: "MacBook Pro",
    category: "electronics",
    provider: "Apple Inc.",
    user: "John Doe",
    userId: 1,
    endDate: "2023-08-25",
    status: "expiring"
  },
  {
    id: 4,
    product: "IKEA Sofa",
    category: "furniture",
    provider: "IKEA",
    user: "Bob Johnson",
    userId: 4,
    endDate: "2023-01-30",
    status: "expired"
  },
  {
    id: 5,
    product: "Nike Shoes",
    category: "clothing",
    provider: "Nike",
    user: "Alice Williams",
    userId: 5,
    endDate: "2024-02-15",
    status: "active"
  }
]

export default function AdminWarrantiesPage() {
  const router = useRouter()
  const [warranties, setWarranties] = useState([])
  const [filteredWarranties, setFilteredWarranties] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState("endDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [statusFilter, setStatusFilter] = useState("")
  
  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the warranties from your backend
    setWarranties(mockWarranties)
  }, [router])
  
  // Filter and sort warranties
  useEffect(() => {
    let filtered = [...warranties]
    
    // Apply status filter if present
    if (statusFilter) {
      filtered = filtered.filter(warranty => warranty.status === statusFilter)
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(warranty => 
        warranty.product.toLowerCase().includes(query) ||
        warranty.provider.toLowerCase().includes(query) ||
        warranty.category.toLowerCase().includes(query) ||
        warranty.user.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      // Handle date fields
      if (sortField === 'endDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })
    
    setFilteredWarranties(filtered)
  }, [warranties, statusFilter, searchQuery, sortField, sortDirection])
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }
  
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this warranty?")) {
      // In a real app, you would send a delete request to your backend
      console.log(`Deleting warranty with ID: ${id}`)
      
      // Update local state
      setWarranties(warranties.filter(warranty => warranty.id !== id))
    }
  }
  
  const getSortIcon = (field) => {
    if (sortField !== field) return null
    
    return sortDirection === 'asc' 
      ? <SortAsc className="h-4 w-4 ml-1" /> 
      : <SortDesc className="h-4 w-4 ml-1" />
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
  
  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900">Manage Warranties</h1>
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
                  onClick={() => setStatusFilter("")}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'active' ? 'bg-green-200 border-green-900' : 'border-amber-800'} text-amber-800`}
                  onClick={() => setStatusFilter("active")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Active
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'expiring' ? 'bg-amber-200 border-amber-900' : 'border-amber-800'} text-amber-800`}
                  onClick={() => setStatusFilter("expiring")}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Expiring
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-2 ${statusFilter === 'expired' ? 'bg-red-200 border-red-900' : 'border-amber-800'} text-amber-800`}
                  onClick={() => setStatusFilter("expired")}
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
                Sort by:
                <button 
                  className="ml-2 flex items-center font-medium hover:text-amber-600"
                  onClick={() => handleSortChange('product')}
                >
                  Product {getSortIcon('product')}
                </button>
                <span className="mx-2">|</span>
                <button 
                  className="flex items-center font-medium hover:text-amber-600"
                  onClick={() => handleSortChange('user')}
                >
                  User {getSortIcon('user')}
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
                      ? `There are no ${statusFilter} warranties` 
                      : "No warranties have been added yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-amber-800">
                      <th className="text-left py-3 px-4 text-amber-900">Product</th>
                      <th className="text-left py-3 px-4 text-amber-900">Category</th>
                      <th className="text-left py-3 px-4 text-amber-900">Provider</th>
                      <th className="text-left py-3 px-4 text-amber-900">User</th>
                      <th className="text-left py-3 px-4 text-amber-900">Status</th>
                      <th className="text-left py-3 px-4 text-amber-900">Expiry Date</th>
                      <th className="text-right py-3 px-4 text-amber-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWarranties.map(warranty => (
                      <tr key={warranty.id} className="border-b border-amber-300 hover:bg-amber-50">
                        <td className="py-3 px-4 text-amber-900 font-medium">{warranty.product}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-amber-800">{warranty.category}</Badge>
                        </td>
                        <td className="py-3 px-4 text-amber-800">{warranty.provider}</td>
                        <td className="py-3 px-4">
                          <Link href={`/admin/users/${warranty.userId}`} className="flex items-center text-amber-800 hover:text-amber-600">
                            <User className="h-4 w-4 mr-2" />
                            {warranty.user}
                          </Link>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(warranty.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center text-amber-800">
                            <Calendar className="h-4 w-4 mr-2" />
                            {warranty.endDate}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/admin/warranties/${warranty.id}/edit`}>
                              <Button size="sm" variant="outline" className="border-2 border-amber-800 text-amber-800 h-8 px-2">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-2 border-red-800 text-red-800 h-8 px-2 hover:bg-red-100"
                              onClick={() => handleDelete(warranty.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}