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
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react"
import AdminSidebar from "../components/sidebar"

// Define Product interface
interface Product {
  id: number
  name: string
  category: string
  manufacturer: string
  warrantyPeriod: string
}

// Mock products for demonstration
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Samsung 55\" QLED TV",
    category: "electronics",
    manufacturer: "Samsung Electronics",
    warrantyPeriod: "24 months"
  },
  {
    id: 2,
    name: "Bosch Dishwasher",
    category: "appliances",
    manufacturer: "Bosch",
    warrantyPeriod: "36 months"
  },
  {
    id: 3,
    name: "MacBook Pro 16\"",
    category: "electronics",
    manufacturer: "Apple Inc.",
    warrantyPeriod: "12 months"
  },
  {
    id: 4,
    name: "Dyson V11 Vacuum",
    category: "appliances",
    manufacturer: "Dyson Inc.",
    warrantyPeriod: "24 months"
  },
  {
    id: 5,
    name: "IKEA Sofa",
    category: "furniture",
    manufacturer: "IKEA",
    warrantyPeriod: "12 months"
  }
]

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Product>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if admin is logged in and fetch products
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (role !== 'admin') {
      router.replace(role === 'user' ? '/user' : '/login')
    }
    
    // In a real app, you would fetch the products from your backend
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
    setIsLoading(false)
  }, [router])
  
  // Filter and sort products
  useEffect(() => {
    let result = [...products]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.manufacturer.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
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
    
    setFilteredProducts(result)
  }, [products, searchQuery, sortField, sortDirection])
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  const handleSortChange = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const getSortIcon = (field: keyof Product) => {
    if (sortField !== field) return null
    
    return sortDirection === 'asc' 
      ? <SortAsc className="h-4 w-4 ml-1" />
      : <SortDesc className="h-4 w-4 ml-1" />
  }
  
  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // In a real app, you would send a delete request to your backend
      const updatedProducts = products.filter(product => product.id !== id)
      setProducts(updatedProducts)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-amber-800 text-xl">Loading products...</p>
      </div>
    )
  }
  
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
                    value={searchQuery}
                    onChange={handleSearchChange}
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
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-amber-900">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                </CardTitle>
                <div className="flex items-center text-sm text-amber-800">
                  <Filter className="h-4 w-4 mr-1" />
                  Sort by:
                  <button 
                    className="ml-2 flex items-center font-medium hover:text-amber-600"
                    onClick={() => handleSortChange('name')}
                  >
                    Name {getSortIcon('name')}
                  </button>
                  <span className="mx-2">|</span>
                  <button 
                    className="flex items-center font-medium hover:text-amber-600"
                    onClick={() => handleSortChange('manufacturer')}
                  >
                    Manufacturer {getSortIcon('manufacturer')}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredProducts.length === 0 ? (
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
                                onClick={() => handleDeleteProduct(product.id)}
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