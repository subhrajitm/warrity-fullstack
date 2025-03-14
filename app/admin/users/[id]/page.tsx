"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, Edit, Eye, Mail, Trash2, User, UserCog } from "lucide-react"
import AdminSidebar from "../../components/sidebar"

// Mock data for demonstration
const mockUser = {
  id: 5,
  name: "Emily Johnson",
  email: "emily.johnson@example.com",
  role: "user",
  createdAt: "2022-05-12",
  lastLogin: "2023-08-15",
  status: "active",
  warranties: [
    {
      id: 3,
      product: "MacBook Pro",
      category: "Electronics",
      endDate: "2023-08-25",
      status: "expiring"
    },
    {
      id: 7,
      product: "Samsung TV",
      category: "Electronics",
      endDate: "2024-03-10",
      status: "active"
    },
    {
      id: 12,
      product: "Dyson Vacuum",
      category: "Appliances",
      endDate: "2024-01-15",
      status: "active"
    },
    {
      id: 18,
      product: "iPhone 13",
      category: "Electronics",
      endDate: "2023-11-20",
      status: "active"
    },
    {
      id: 22,
      product: "Kitchen Aid Mixer",
      category: "Appliances",
      endDate: "2023-07-05",
      status: "expired"
    }
  ]
}

export default function AdminUserDetailPage({ params }) {
  // Fix: Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const userId = unwrappedParams.id;
  
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // Set mock data
    setUser(mockUser)
    setIsLoading(false)
  }, [router, userId]) // Use unwrapped userId instead of params.id
  
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this user? This will also delete all their warranties.")) {
      console.log(`Deleting user with ID: ${userId}`) // Use unwrapped userId instead of params.id
      // In a real app, you would send a delete request to your backend
      
      // Redirect to users list
      router.push('/admin/users')
    }
  }
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "expiring":
        return <Badge className="bg-amber-500">Expiring Soon</Badge>
      case "expired":
        return <Badge className="bg-red-500">Expired</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }
  
  if (!user) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <AdminSidebar />
        <div className="flex-1 p-6 ml-64 flex items-center justify-center">
          <p className="text-amber-800 text-xl">Loading user details...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="mb-6">
          <Link href="/admin/users" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-3xl font-bold text-[rgb(146,64,14)] font-mono tracking-tight">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="text-amber-800 font-medium flex items-center mt-1">
                    <Mail className="mr-2 h-4 w-4" />
                    {user.email}
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  <Badge className={`${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'} mr-2`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  {getStatusBadge(user.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      User Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-amber-700">User ID:</span>
                        <span className="text-amber-900 font-medium">{user.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Role:</span>
                        <span className="text-amber-900 font-medium capitalize">{user.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Status:</span>
                        <span className="text-amber-900 font-medium capitalize">{user.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Dates
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-amber-700">Created:</span>
                        <span className="text-amber-900 font-medium">{user.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Last Login:</span>
                        <span className="text-amber-900 font-medium">{user.lastLogin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Warranties:</span>
                        <span className="text-amber-900 font-medium">{user.warranties.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-amber-200 border-t-4 border-amber-800 px-6 py-4 flex justify-between">
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-800"
                onClick={handleDelete}
                disabled={user.role === "admin"} // Prevent deleting admin users
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </Button>
              
              <Link href={`/admin/users/${userId}/edit`}> {/* Use unwrapped userId instead of params.id */}
                <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                User Warranties
              </CardTitle>
              <CardDescription className="text-amber-800">
                All warranties registered to this user
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              {user.warranties.length === 0 ? (
                <div className="p-6 text-center text-amber-800">
                  <p>This user has no registered warranties.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-amber-200">
                    <TableRow className="hover:bg-amber-100 border-b-2 border-amber-300">
                      <TableHead className="text-amber-900 font-bold">ID</TableHead>
                      <TableHead className="text-amber-900 font-bold">Product</TableHead>
                      <TableHead className="text-amber-900 font-bold">Category</TableHead>
                      <TableHead className="text-amber-900 font-bold">End Date</TableHead>
                      <TableHead className="text-amber-900 font-bold">Status</TableHead>
                      <TableHead className="text-amber-900 font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.warranties.map((warranty) => (
                      <TableRow key={warranty.id} className="hover:bg-amber-50 border-b border-amber-200">
                        <TableCell className="font-medium text-amber-900">{warranty.id}</TableCell>
                        <TableCell className="text-amber-900">{warranty.product}</TableCell>
                        <TableCell className="text-amber-900">{warranty.category}</TableCell>
                        <TableCell className="text-amber-900">{warranty.endDate}</TableCell>
                        <TableCell>{getStatusBadge(warranty.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/warranties/${warranty.id}`}>
                              <Button variant="outline" size="sm" className="h-8 border-amber-800 text-amber-800">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/warranties/${warranty.id}/edit`}>
                              <Button variant="outline" size="sm" className="h-8 border-amber-800 text-amber-800">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}