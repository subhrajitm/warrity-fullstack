"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  PieChart,
  BarChart,
  TrendingUp,
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  Download,
  Search,
  ShoppingCart,
  Star,
  DollarSign
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

// Mock data for product analytics
const mockProductAnalytics = {
  totalProducts: 245,
  activeProducts: 198,
  discontinuedProducts: 47,
  lowStockProducts: 18,
  topSellingProducts: [
    { name: "MacBook Pro 16\"", category: "Electronics", sales: 124, revenue: 309876 },
    { name: "Samsung 65\" QLED TV", category: "Electronics", sales: 98, revenue: 196000 },
    { name: "Leather Sofa", category: "Furniture", sales: 76, revenue: 98800 },
    { name: "LG Refrigerator", category: "Appliances", sales: 65, revenue: 84500 },
    { name: "Nike Air Max", category: "Clothing", sales: 58, revenue: 8700 }
  ],
  categorySales: [
    { name: "Electronics", count: 387, revenue: 774000, color: "bg-blue-500" },
    { name: "Appliances", count: 243, revenue: 364500, color: "bg-green-500" },
    { name: "Furniture", count: 156, revenue: 234000, color: "bg-purple-500" },
    { name: "Clothing", count: 132, revenue: 39600, color: "bg-pink-500" },
    { name: "Automotive", count: 78, revenue: 156000, color: "bg-yellow-500" },
    { name: "Other", count: 45, revenue: 22500, color: "bg-gray-500" }
  ],
  monthlySales: [
    { month: "Jan", count: 78, revenue: 117000 },
    { month: "Feb", count: 82, revenue: 123000 },
    { month: "Mar", count: 96, revenue: 144000 },
    { month: "Apr", count: 102, revenue: 153000 },
    { month: "May", count: 88, revenue: 132000 },
    { month: "Jun", count: 106, revenue: 159000 },
    { month: "Jul", count: 112, revenue: 168000 },
    { month: "Aug", count: 98, revenue: 147000 },
    { month: "Sep", count: 116, revenue: 174000 },
    { month: "Oct", count: 122, revenue: 183000 },
    { month: "Nov", count: 118, revenue: 177000 },
    { month: "Dec", count: 124, revenue: 186000 }
  ],
  warrantyRegistrations: [
    { product: "MacBook Pro 16\"", registrations: 112, percentage: 90 },
    { product: "Samsung 65\" QLED TV", registrations: 82, percentage: 84 },
    { product: "Leather Sofa", registrations: 58, percentage: 76 },
    { product: "LG Refrigerator", registrations: 48, percentage: 74 },
    { product: "Nike Air Max", registrations: 32, percentage: 55 }
  ],
  productRatings: [
    { rating: 5, count: 156 },
    { rating: 4, count: 243 },
    { rating: 3, count: 87 },
    { rating: 2, count: 34 },
    { rating: 1, count: 21 }
  ]
}

export default function ProductAnalyticsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [productData, setProductData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("year")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Check if admin is logged in
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.role !== 'admin') {
        router.replace(user?.role === 'user' ? '/user' : '/login')
      } else {
        // In a real app, you would fetch the product analytics data from your backend
        setTimeout(() => {
          setProductData(mockProductAnalytics)
          setIsLoading(false)
        }, 500)
      }
    }
  }, [router, authLoading, isAuthenticated, user])
  
  // Calculate max value for the bar chart
  const maxMonthlySales = productData 
    ? Math.max(...productData.monthlySales.map(item => item.count)) 
    : 0
  
  // Calculate total for pie chart
  const totalCategorySales = productData 
    ? productData.categorySales.reduce((sum, item) => sum + item.count, 0)
    : 0
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-amber-800 text-xl">Loading product analytics data...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/analytics" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Analytics Dashboard
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Product Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Select 
              value={timeRange} 
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[150px] border-2 border-amber-800 bg-amber-50">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-[150px] border-2 border-amber-800 bg-amber-50">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {productData.categorySales.map(category => (
                  <SelectItem key={category.name} value={category.name.toLowerCase()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            className="border-2 border-amber-800 text-amber-800"
          >
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
          
          <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium mb-1">Total Products</p>
              <p className="text-3xl font-bold text-amber-900">{productData.totalProducts}</p>
            </div>
            <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-amber-800" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium mb-1">Active Products</p>
              <p className="text-3xl font-bold text-green-600">{productData.activeProducts}</p>
            </div>
            <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium mb-1">Discontinued</p>
              <p className="text-3xl font-bold text-red-600">{productData.discontinuedProducts}</p>
            </div>
            <div className="h-12 w-12 bg-red-200 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-amber-600">{productData.lowStockProducts}</p>
            </div>
            <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales by Category & Monthly Sales */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative h-48 w-48">
                {/* Simple pie chart visualization */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-amber-50">
                  <span className="text-amber-900 font-bold text-lg">{totalCategorySales}</span>
                </div>
                {productData.categorySales.map((category, index) => {
                  const percentage = (category.count / totalCategorySales) * 100
                  const rotation = index === 0 ? 0 : productData.categorySales
                    .slice(0, index)
                    .reduce((sum, cat) => sum + (cat.count / totalCategorySales) * 360, 0)
                  
                  return (
                    <div 
                      key={category.name}
                      className={`absolute inset-0 ${category.color}`}
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation + percentage * 1.8) * Math.PI / 180)}% ${50 - 50 * Math.sin((rotation + percentage * 1.8) * Math.PI / 180)}%, ${50 + 50 * Math.cos(rotation * Math.PI / 180)}% ${50 - 50 * Math.sin(rotation * Math.PI / 180)}%)`,
                        transform: 'rotate(0deg)'
                      }}
                    />
                  )
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {productData.categorySales.map(category => (
                <div key={category.name} className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${category.color} mr-2`} />
                  <span className="text-amber-900 text-sm">{category.name}</span>
                  <span className="ml-auto text-amber-800 font-medium">{category.count}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-amber-300">
              <div className="flex justify-between items-center text-amber-900 font-medium">
                <span>Total Revenue:</span>
                <span>{formatCurrency(productData.categorySales.reduce((sum, item) => sum + item.revenue, 0))}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Monthly Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-end space-x-2">
              {productData.monthlySales.map(item => {
                const height = (item.count / maxMonthlySales) * 100
                
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-amber-800 rounded-t-sm" 
                      style={{ height: `${height}%` }}
                    />
                    <div className="mt-2 text-xs text-amber-800">{item.month}</div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-amber-800">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Yearly Total: {productData.monthlySales.reduce((sum, item) => sum + item.count, 0)}</span>
              </div>
              <div className="text-amber-800 text-sm">
                Revenue: {formatCurrency(productData.monthlySales.reduce((sum, item) => sum + item.revenue, 0))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Selling Products & Warranty Registrations */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {productData.topSellingProducts.map((product, index) => (
                <div key={product.name} className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-amber-900">{product.name}</p>
                    <p className="text-sm text-amber-700">{product.category}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-medium text-amber-900">{product.sales} units</p>
                    <p className="text-sm text-amber-700">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-amber-300">
              <Button 
                variant="outline" 
                className="w-full border-2 border-amber-800 text-amber-800"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                View All Products
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
          <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
            <CardTitle className="text-xl font-bold text-amber-900">
              Warranty Registration Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {productData.warrantyRegistrations.map(item => (
                <div key={item.product} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-900 font-medium">{item.product}</span>
                    <span className="text-amber-800">{item.registrations} registrations ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-800" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-amber-300">
              <div className="flex justify-between items-center">
                <span className="text-amber-800 font-medium">Average Registration Rate</span>
                <span className="text-amber-900 font-bold">
                  {Math.round(
                    productData.warrantyRegistrations.reduce((sum, item) => sum + item.percentage, 0) / 
                    productData.warrantyRegistrations.length
                  )}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Product Ratings */}
      <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100 mb-6">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <CardTitle className="text-xl font-bold text-amber-900">
            Product Ratings Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = productData.productRatings.find(r => r.rating === rating)?.count || 0
              const total = productData.productRatings.reduce((sum, r) => sum + r.count, 0)
              const percentage = Math.round((count / total) * 100)
              
              return (
                <div key={rating} className="flex-1">
                  <div className="flex items-center justify-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <span className="ml-1 text-amber-900 font-medium">{rating}</span>
                    </div>
                  </div>
                  <div className="h-40 bg-amber-200 rounded-md relative">
                    <div 
                      className="absolute bottom-0 w-full bg-amber-500 rounded-b-md"
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-amber-900 font-medium">{percentage}%</p>
                    <p className="text-xs text-amber-700">{count} ratings</p>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-amber-300 flex justify-between items-center">
            <div className="text-amber-800">
              <span className="font-medium">Average Rating:</span> 
              <span className="ml-2">
                {(productData.productRatings.reduce((sum, r) => sum + (r.rating * r.count), 0) / 
                 productData.productRatings.reduce((sum, r) => sum + r.count, 0)).toFixed(1)}
              </span>
            </div>
            <div className="text-amber-800">
              <span className="font-medium">Total Ratings:</span>
              <span className="ml-2">{productData.productRatings.reduce((sum, r) => sum + r.count, 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 