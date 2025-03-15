"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  PlusCircle, 
  Search, 
  Filter, 
  FileText, 
  Edit, 
  Trash2,
  SortAsc,
  SortDesc,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react"

// Define Warranty interface
interface Warranty {
  id: number;
  productName: string;
  manufacturer: string;
  startDate: string;
  endDate: string;
  status: "active" | "expiring" | "expired";
  user: string;
}

// Mock warranties for demonstration
const mockWarranties: Warranty[] = [
  {
    id: 1,
    productName: "Samsung 55\" QLED TV",
    manufacturer: "Samsung Electronics",
    startDate: "2023-01-15",
    endDate: "2025-01-15",
    status: "active",
    user: "John Doe"
  },
  {
    id: 2,
    productName: "Bosch Dishwasher",
    manufacturer: "Bosch",
    startDate: "2022-05-10",
    endDate: "2025-05-10",
    status: "active",
    user: "Jane Smith"
  },
  {
    id: 3,
    productName: "MacBook Pro 16\"",
    manufacturer: "Apple Inc.",
    startDate: "2023-03-22",
    endDate: "2024-03-22",
    status: "expiring",
    user: "Michael Johnson"
  },
  {
    id: 4,
    productName: "Dyson V11 Vacuum",
    manufacturer: "Dyson Inc.",
    startDate: "2022-08-05",
    endDate: "2023-08-05",
    status: "expired",
    user: "Sarah Williams"
  },
  {
    id: 5,
    productName: "IKEA Sofa",
    manufacturer: "IKEA",
    startDate: "2022-11-30",
    endDate: "2023-11-30",
    status: "expired",
    user: "David Brown"
  }
]

export default function AdminWarrantiesPage() {
  const router = useRouter()
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [filteredWarranties, setFilteredWarranties] = useState<Warranty[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Warranty>("endDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in and fetch warranties
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
    setFilteredWarranties(mockWarranties)
    setIsLoading(false)
  }, [router])
  
  // Filter and sort warranties
  useEffect(() => {
    let result = [...warranties]
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(warranty => warranty.status === statusFilter)
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(warranty => 
        warranty.productName.toLowerCase().includes(query) || 
        warranty.manufacturer.toLowerCase().includes(query) ||
        warranty.user.toLowerCase().includes(query)
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
  }, [warranties, searchQuery, sortField, sortDirection, statusFilter])
  
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
  
  const getSortIcon = (field: keyof Warranty) => {
    if (sortField !== field) return null
    
    return sortDirection === 'asc' 
      ? <SortAsc className="h-4 w-4 ml-1" />
      : <SortDesc className="h-4 w-4 ml-1" />
  }
  
  const handleDeleteWarranty = (id: number) => {
    if (confirm("Are you sure you want to delete this warranty?")) {
      // In a real app, you would send a delete request to your backend
      const updatedWarranties = warranties.filter(warranty => warranty.id !== id)
      setWarranties(updatedWarranties)
    }
  }
  
  const getStatusBadge = (status: Warranty["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "expiring":
        return (
          <Badge className="bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 border border-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        )
      default:
        return null
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-amber-800 text-xl">Loading warranties...</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Warranties</h1>
        <Link href="/admin/warranties/add">
          <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Warranty
          </Button>
        </Link>
      </div>
      
      <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
              <Input
                placeholder="Search warranties..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 border-2 border-amber-800 bg-amber-50"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-amber-800 whitespace-nowrap">Status:</span>
              <div className="flex space-x-2">
                <Button 
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter === "all" 
                    ? "bg-amber-800 text-amber-100" 
                    : "border-amber-800 text-amber-800"
                  }
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                  className={statusFilter === "active" 
                    ? "bg-green-700 text-green-100 border-green-800" 
                    : "border-green-700 text-green-700"
                  }
                >
                  Active
                </Button>
                <Button 
                  variant={statusFilter === "expiring" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("expiring")}
                  className={statusFilter === "expiring" 
                    ? "bg-amber-700 text-amber-100 border-amber-800" 
                    : "border-amber-700 text-amber-700"
                  }
                >
                  Expiring
                </Button>
                <Button 
                  variant={statusFilter === "expired" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("expired")}
                  className={statusFilter === "expired" 
                    ? "bg-red-700 text-red-100 border-red-800" 
                    : "border-red-700 text-red-700"
                  }
                >
                  Expired
                </Button>
              </div>
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
                onClick={() => handleSortChange('productName')}
              >
                Product {getSortIcon('productName')}
              </button>
              <span className="mx-2">|</span>
              <button 
                className="flex items-center font-medium hover:text-amber-600"
                onClick={() => handleSortChange('endDate')}
              >
                Expiry Date {getSortIcon('endDate')}
              </button>
              <span className="mx-2">|</span>
              <button 
                className="flex items-center font-medium hover:text-amber-600"
                onClick={() => handleSortChange('user')}
              >
                User {getSortIcon('user')}
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-200 border-b-2 border-amber-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Manufacturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-amber-50 divide-y divide-amber-200">
                {filteredWarranties.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-amber-800">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-amber-400" />
                      <p className="text-lg font-medium">No warranties found</p>
                      <p className="text-sm">Try adjusting your search or add a new warranty</p>
                    </td>
                  </tr>
                ) : (
                  filteredWarranties.map(warranty => (
                    <tr key={warranty.id} className="hover:bg-amber-100">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-amber-900">{warranty.productName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-amber-800">{warranty.manufacturer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-amber-800">{warranty.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-amber-800">{warranty.startDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-amber-800">{warranty.endDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(warranty.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/warranties/${warranty.id}/edit`}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-amber-800 text-amber-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-800 text-red-800"
                            onClick={() => handleDeleteWarranty(warranty.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}