"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, PlusCircle, Search, Shield, Calendar, Clock, AlertTriangle } from "lucide-react"
import ProductSidebar from "./components/sidebar"
import { useAuth } from "@/lib/auth-context"

// Define product interface
interface Product {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  price: number;
  image: string;
  warrantyExpiration: string;
  status: string;
}

// Add mock products data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Samsung 55\" QLED TV",
    category: "Electronics",
    purchaseDate: "2023-05-15",
    price: 899.99,
    image: "/images/tv.jpg",
    warrantyExpiration: "2025-05-15",
    status: "Active"
  },
  {
    id: 2,
    name: "Bosch Dishwasher",
    category: "Appliances",
    purchaseDate: "2022-11-03",
    price: 649.99,
    image: "/images/dishwasher.jpg",
    warrantyExpiration: "2024-11-03",
    status: "Active"
  },
  {
    id: 3,
    name: "MacBook Pro 16\"",
    category: "Electronics",
    purchaseDate: "2023-01-20",
    price: 2499.99,
    image: "/images/laptop.jpg",
    warrantyExpiration: "2025-01-20",
    status: "Active"
  },
  {
    id: 4,
    name: "Dyson V11 Vacuum",
    category: "Appliances",
    purchaseDate: "2022-08-12",
    price: 599.99,
    image: "/images/vacuum.jpg",
    warrantyExpiration: "2024-08-12",
    status: "Active"
  },
  {
    id: 5,
    name: "Sony WH-1000XM4 Headphones",
    category: "Electronics",
    purchaseDate: "2023-03-05",
    price: 349.99,
    image: "/images/headphones.jpg",
    warrantyExpiration: "2024-03-05",
    status: "Expiring Soon"
  }
];

export default function ProductsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  
  // Check if user is logged in and fetch products
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user && user.role !== 'user') {
        router.replace(user.role === 'admin' ? '/admin' : '/login')
      } else {
        // In a real app, you would fetch the products from your backend
        setProducts(mockProducts)
      }
    }
  }, [router, authLoading, isAuthenticated, user])
  
  // Filter products based on search term and active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || 
      (activeCategory === "with-warranty" && product.status === "Active") ||
      (activeCategory === "without-warranty" && product.status !== "Active") ||
      (activeCategory === "expiring-soon" && product.status === "Expiring Soon") ||
      (activeCategory === product.category.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });
  
  // Update the getWarrantyStatusBadge function to work with the mockProducts structure
  const getWarrantyStatusBadge = (product: Product) => {
    if (product.status === "Active") {
      const endDate = new Date(product.warrantyExpiration);
      const today = new Date();
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining <= 30) {
        return (
          <Badge className="bg-amber-500 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Expires in {daysRemaining} days
          </Badge>
        );
      }
      
      return <Badge className="bg-green-500 text-white">Warranty Active</Badge>;
    } else if (product.status === "Expiring Soon") {
      return (
        <Badge className="bg-amber-500 text-white">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Expiring Soon
        </Badge>
      );
    }
    
    return <Badge variant="outline" className="border-amber-500 text-amber-500">No Warranty</Badge>;
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "electronics":
        return "💻"
      case "appliances":
        return "🔌"
      case "furniture":
        return "🪑"
      case "clothing":
        return "👕"
      case "jewelry":
        return "💍"
      case "automotive":
        return "🚗"
      default:
        return "📦"
    }
  }
  
  const categories = [
    { id: "all", name: "All Products" },
    { id: "with-warranty", name: "With Warranty" },
    { id: "without-warranty", name: "Without Warranty" },
    { id: "expiring-soon", name: "Expiring Soon" },
    { id: "electronics", name: "Electronics" },
    { id: "appliances", name: "Appliances" },
    { id: "furniture", name: "Furniture" },
    { id: "clothing", name: "Clothing" },
    { id: "jewelry", name: "Jewelry" },
    { id: "automotive", name: "Automotive" },
    { id: "other", name: "Other" }
  ]
  
  return (
    <div className="flex min-h-screen bg-amber-50">
      <ProductSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">My Products</h1>
            <p className="text-amber-700">Manage your product inventory and warranties</p>
          </div>
          <Link href="/user/products/add">
            <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Product
            </Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
            <Input
              placeholder="Search products by name or manufacturer..."
              className="pl-10 border-2 border-amber-800 bg-amber-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory} value={activeCategory}>
          <TabsList className="bg-amber-200 border-2 border-amber-800 mb-6 flex flex-wrap h-auto p-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100 m-1"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-0">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Link key={product.id} href={`/user/products/${product.id}`}>
                    <Card className="border-2 border-amber-800 bg-amber-100 hover:shadow-[8px_8px_0px_0px_rgba(120,53,15,0.3)] transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl text-amber-900">
                              {product.name}
                            </CardTitle>
                            // Update the card description to work with the mockProducts structure
                            <CardDescription className="text-amber-700">
                              {getCategoryIcon(product.category.toLowerCase())} {product.category}
                            </CardDescription>
                          </div>
                          {getWarrantyStatusBadge(product)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-amber-800">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Purchased: {product.purchaseDate}</span>
                          </div>
                          <div>
                            <span>{product.price}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-amber-200 border-t border-amber-300 pt-3">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center text-amber-800 text-sm">
                            <Package className="h-4 w-4 mr-1" />
                            <span>View Details</span>
                          </div>
                          {product.status === "Active" || product.status === "Expiring Soon" ? (
                            <div className="flex items-center text-amber-800 text-sm">
                              <Shield className="h-4 w-4 mr-1" />
                              <span>Warranty Info</span>
                            </div>
                          ) : null}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-amber-800 rounded-lg bg-amber-100">
                <Package className="mx-auto h-12 w-12 text-amber-300 mb-4" />
                <h3 className="text-xl font-medium text-amber-900 mb-2">No Products Found</h3>
                <p className="text-amber-700 mb-6">
                  {searchTerm ? 
                    `No products match your search for "${searchTerm}"` : 
                    activeCategory !== "all" ? 
                      `No products in the "${categories.find(c => c.id === activeCategory)?.name}" category` : 
                      "You haven't added any products yet"}
                </p>
                <Link href="/user/products/add">
                  <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}