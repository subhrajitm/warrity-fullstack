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
  PlusCircle, 
  Search, 
  Edit, 
  Trash2,
  Wrench,
  SortAsc,
  SortDesc,
  Filter,
  Package,
  Building
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { adminApi, ServiceInfo } from "@/lib/api"
import { toast } from "sonner"

export default function ServiceInfoPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof ServiceInfo>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user && user.role !== 'admin') {
        router.replace(user.role === 'user' ? '/user' : '/login')
      } else {
        fetchServiceInfo()
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  const fetchServiceInfo = async () => {
    try {
      console.log('Fetching service info...')
      const response = await adminApi.getAllServiceInfo()
      console.log('Service info response:', response)
      
      if (response.error) {
        console.error('Error in response:', response.error)
        toast.error('Failed to fetch service information')
        return
      }
      
      if (response.data) {
        console.log('Setting service info:', response.data.serviceInfo)
        setServiceInfo(response.data.serviceInfo || [])
      } else {
        console.log('No data in response')
        setServiceInfo([])
      }
    } catch (error) {
      console.error('Error fetching service information:', error)
      toast.error('An error occurred while fetching service information')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service information?')) {
      return
    }

    try {
      setLoading(true)
      const response = await adminApi.deleteServiceInfo(id)
      
      if (response.error) {
        toast.error('Failed to delete service information')
        return
      }
      
      // Update the state immediately by filtering out the deleted item
      setServiceInfo(prevServiceInfo => prevServiceInfo.filter(info => info._id !== id))
      toast.success('Service information deleted successfully')
    } catch (error) {
      console.error('Error deleting service information:', error)
      toast.error('An error occurred while deleting service information')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: keyof ServiceInfo) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: keyof ServiceInfo) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
  }

  const filteredServiceInfo = serviceInfo
    .filter(info => 
      info.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const modifier = sortDirection === "asc" ? 1 : -1
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier
      }
      return 0
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-800"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Service Information</h1>
        <Link href="/admin/service-info/add">
          <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service Info
          </Button>
        </Link>
      </div>
      
      <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-amber-900">
              {filteredServiceInfo.length} {filteredServiceInfo.length === 1 ? 'Service Info' : 'Service Information'}
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                <Input
                  placeholder="Search service info..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-amber-800 bg-amber-50 w-[300px]"
                />
              </div>
              <div className="flex items-center text-sm text-amber-800">
                <Filter className="h-4 w-4 mr-1" />
                Sort by:
                <button 
                  className="ml-2 flex items-center font-medium hover:text-amber-600"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </button>
                <span className="mx-2">|</span>
                <button 
                  className="flex items-center font-medium hover:text-amber-600"
                  onClick={() => handleSort('company')}
                >
                  Company {getSortIcon('company')}
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-amber-800">
                  <th className="text-left py-3 px-4 text-amber-900 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-amber-900 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-amber-900 font-semibold">Company</th>
                  <th className="text-left py-3 px-4 text-amber-900 font-semibold">Product</th>
                  <th className="text-left py-3 px-4 text-amber-900 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 text-amber-900 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceInfo.map((info) => (
                  <tr key={info._id} className="border-b border-amber-200 hover:bg-amber-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Wrench className="h-4 w-4 mr-2 text-amber-800" />
                        <span className="font-medium text-amber-900">{info.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-amber-800 text-amber-800">
                        {info.serviceType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-amber-800" />
                        <span>{info.company}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {info.product ? (
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-amber-800" />
                          <span>{info.product.name}</span>
                        </div>
                      ) : (
                        <span className="text-amber-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={info.isActive ? 
                          "border-green-600 text-green-600" : 
                          "border-red-600 text-red-600"
                        }
                      >
                        {info.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-800 hover:text-amber-600"
                          onClick={() => router.push(`/admin/service-info/${info._id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(info._id)}
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
        </CardContent>
      </Card>
    </div>
  )
} 