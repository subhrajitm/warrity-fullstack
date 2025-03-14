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
  Edit, 
  Trash2,
  Package,
  Filter
} from "lucide-react"
import AdminSidebar from "../components/sidebar"

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    name: "Samsung 55\" QLED TV",
    category: "electronics",
    manufacturer: "Samsung Electronics",
    warrantyPeriod: "24 months",
    createdAt: "2023-05-15"
  },
  {
    id: 2,
    name: "Dyson V11 Vacuum",
    category: "appliances",
    manufacturer: "Dyson Inc.",
    warrantyPeriod: "24 months",
    createdAt: "2023-04-10"
  },
  {
    id: 3,
    name: "MacBook Pro 16\"",
    category: "electronics",
    manufacturer: "Apple Inc.",
    warrantyPeriod: "12 months",
    createdAt: "2023-03-22"
  },
  {
    id: 4,
    name: "IKEA MALM Bed Frame",
    category: "furniture",
    manufacturer: "IKEA",
    warrantyPeriod: "10 years",
    createdAt: "2023-02-18"
  },
  {
    id: 5,
    name: "Nike Air Max",
    category: "clothing",
    manufacturer: "Nike Inc.",
    warrantyPeriod: "6 months",
    createdAt: "2023-01-05"
  }
]

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the products from your backend
    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 500)
  }, [router])
  
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      // In a real app, you would send a delete request to your backend
      setProducts(products.filter(product => product.id !== id))
    }
  }
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-amber-900">Products</h1>
            <Link href="/admin/products/add">
              <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-8">
            <CardContent className="p-6">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-amber-800" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-amber-800 bg-amber-50"
                  />
                </div>
                <Button variant="outline" className="border-2 border-amber-800 text-amber-800">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
            <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
              <CardTitle className="text-xl font-bold text-amber-900">
                Product List
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-amber-800 border-t-transparent rounded-full"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-amber-800 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-amber-900 mb-2">No products found</h3>
                  <p className="text-amber-800 mb-4">Try adjusting your search or add a new product.</p>
                  <Link href="/admin/products/add">
                    <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-amber-800">
                        <th className="text-left py-3 px-4 text-amber-900 font-bold">Product Name</th>
                        <th className="text-left py-3 px-4 text-amber-900 font-bold">Category</th>
                        <th className="text-left py-3 px-4 text-amber-900 font-bold">Manufacturer</th>
                        <th className="text-left py-3 px-4 text-amber-900 font-bold">Warranty Period</th>
                        <th className="text-left py-3 px-4 text-amber-900 font-bold">Created</th>
                        <th className="text-right py-3 px-4 text-amber-900 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id} className="border-b border-amber-300 hover:bg-amber-50">
                          <td className="py-3 px-4 text-amber-900">
                            <Link href={`/admin/products/${product.id}`} className="hover:underline">
                              {product.name}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-amber-800">{product.category}</Badge>
                          </td>
                          <td className="py-3 px-4 text-amber-900">{product.manufacturer}</td>
                          <td className="py-3 px-4 text-amber-900">{product.warrantyPeriod}</td>
                          <td className="py-3 px-4 text-amber-900">{product.createdAt}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Button size="sm" variant="outline" className="border-2 border-amber-800 text-amber-800">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-2 border-red-800 text-red-800 hover:bg-red-100"
                                onClick={() => handleDelete(product.id)}
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
    </div>
  )
}