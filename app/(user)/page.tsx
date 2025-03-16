"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { RecentActivity } from "@/components/recent-activity"
import { WarrantyStats } from "@/components/warranty-stats"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  
  // Check if user is logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not logged in
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="text-amber-800 text-xl flex items-center">
          <div className="animate-spin mr-3 h-5 w-5 border-2 border-amber-800 border-t-transparent rounded-full" />
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10 bg-amber-50">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl text-amber-900">Warrity</h1>
        <p className="text-lg text-amber-700">Track and manage warranties for all your products in one place.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <WarrantyStats />
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-amber-200 p-1 border-2 border-amber-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100 text-amber-900 font-medium">Overview</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100 text-amber-900 font-medium">My Products</TabsTrigger>
          <TabsTrigger value="expiring" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-100 text-amber-900 font-medium">Expiring Soon</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Enhanced Warranty List */}
          <Card className="border-2 border-amber-800 bg-amber-100">
            <CardHeader className="bg-amber-200 border-b-2 border-amber-800">
              <CardTitle className="text-amber-900">My Warranties</CardTitle>
              <CardDescription className="text-amber-700">All your active product warranties.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50">
                    <TableHead className="text-amber-900">Product</TableHead>
                    <TableHead className="text-amber-900">Purchase Date</TableHead>
                    <TableHead className="text-amber-900">Expiry Date</TableHead>
                    <TableHead className="text-amber-900">Status</TableHead>
                    <TableHead className="text-amber-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Sample data - would be dynamic in real app */}
                  <TableRow>
                    <TableCell className="font-medium">iPhone 13 Pro</TableCell>
                    <TableCell>Jan 15, 2022</TableCell>
                    <TableCell>Jan 15, 2023</TableCell>
                    <TableCell><Badge className="bg-red-500">Expired</Badge></TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 border-amber-800 text-amber-900">
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 border-amber-800 text-amber-900">
                          Renew
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Samsung TV</TableCell>
                    <TableCell>Mar 10, 2022</TableCell>
                    <TableCell>Mar 10, 2024</TableCell>
                    <TableCell><Badge className="bg-green-500">Active</Badge></TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 border-amber-800 text-amber-900">
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 border-amber-800 text-amber-900">
                          Extend
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MacBook Pro</TableCell>
                    <TableCell>May 20, 2022</TableCell>
                    <TableCell>Aug 25, 2023</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Expiring Soon</Badge></TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 border-amber-800 text-amber-900">
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 border-amber-800 text-amber-900">
                          Extend
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-amber-200 border-t-2 border-amber-800 flex justify-between">
              <Button variant="outline" className="border-2 border-amber-800 text-amber-900 hover:bg-amber-200">
                View All Warranties
              </Button>
              <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                Register New Warranty
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2 border-amber-800 bg-amber-100">
              <CardHeader className="bg-amber-200 border-b-2 border-amber-800">
                <CardTitle className="text-amber-900">Recent Activity</CardTitle>
                <CardDescription className="text-amber-700">Your recent warranty and service activities.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <RecentActivity />
              </CardContent>
            </Card>
            <Card className="border-2 border-amber-800 bg-amber-100">
              <CardHeader className="bg-amber-200 border-b-2 border-amber-800">
                <CardTitle className="text-amber-900">Quick Actions</CardTitle>
                <CardDescription className="text-amber-700">Common tasks and actions.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 pt-4">
                <Link href="/products/add" passHref>
                  <Button className="w-full bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">Add New Product</Button>
                </Link>
                <Link href="/products" passHref>
                  <Button variant="outline" className="w-full border-2 border-amber-800 text-amber-900 hover:bg-amber-200">
                    View All Products
                  </Button>
                </Link>
                <Link href="/warranties/expiring" passHref>
                  <Button variant="outline" className="w-full border-2 border-amber-800 text-amber-900 hover:bg-amber-200">
                    Check Expiring Warranties
                  </Button>
                </Link>
                <Link href="/support" passHref>
                  <Button variant="outline" className="w-full border-2 border-amber-800 text-amber-900 hover:bg-amber-200">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products">
          <Card className="border-2 border-amber-800 bg-amber-100">
            <CardHeader className="bg-amber-200 border-b-2 border-amber-800">
              <CardTitle className="text-amber-900">My Products</CardTitle>
              <CardDescription className="text-amber-700">All your registered products and their warranty status.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ProductList />
            </CardContent>
            <CardFooter className="bg-amber-200 border-t-2 border-amber-800 flex justify-between">
              <Button variant="outline" className="border-2 border-amber-800 text-amber-900 hover:bg-amber-200">
                Export Product List
              </Button>
              <Link href="/products/add" passHref>
                <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                  Add New Product
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="expiring">
          <Card className="border-2 border-amber-800 bg-amber-100">
            <CardHeader className="bg-amber-200 border-b-2 border-amber-800">
              <CardTitle className="text-amber-900">Warranties Expiring Soon</CardTitle>
              <CardDescription className="text-amber-700">Products with warranties that will expire in the next 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ProductList filter="expiring" />
            </CardContent>
            <CardFooter className="bg-amber-200 border-t-2 border-amber-800 flex justify-between">
              <Button variant="outline" className="border-2 border-amber-800 text-amber-900 hover:bg-amber-200">
                Set Reminder
              </Button>
              <Button className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900">
                Extend Selected Warranties
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

