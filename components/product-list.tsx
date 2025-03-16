"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, MoreHorizontal, Trash, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { productApi, warrantyApi } from "@/lib/api"
import { toast } from "sonner"

interface Product {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  warrantyEnd: string;
  status: string;
}

interface ProductListProps {
  filter?: "all" | "expiring" | "active" | "expired"
}

export function ProductList({ filter = "all" }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Depending on the filter, we might use different API endpoints
        let response;
        
        if (filter === "expiring") {
          response = await warrantyApi.getExpiringWarranties();
        } else {
          response = await warrantyApi.getAllWarranties();
        }
        
        if (response.error) {
          setError(response.error);
          return;
        }
        
        if (response.data?.warranties) {
          // Transform the data to match our component's expected format
          const formattedProducts = response.data.warranties.map(warranty => ({
            id: warranty.id,
            name: warranty.product?.name || "Unknown Product",
            category: warranty.product?.category || "Uncategorized",
            purchaseDate: warranty.purchaseDate,
            warrantyEnd: warranty.expirationDate,
            status: getWarrantyStatus(warranty.expirationDate),
          }));
          
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [filter]);

  // Determine warranty status based on expiration date
  const getWarrantyStatus = (expirationDate: string): string => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    
    // If expired
    if (expiry < now) {
      return "expired";
    }
    
    // If expiring within 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (expiry <= thirtyDaysFromNow) {
      return "expiring";
    }
    
    return "active";
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true
    return product.status === filter
  })

  const handleDelete = async (id: string) => {
    try {
      const response = await warrantyApi.deleteWarranty(id);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Warranty deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete warranty. Please try again.");
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "expiring":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Expiring Soon
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="flex items-center">
          <div className="animate-spin mr-2 h-5 w-5 border-2 border-amber-800 border-t-transparent rounded-full" />
          <span className="text-amber-800">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start text-red-800 mb-4">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading products</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <Link href="/products/add" passHref>
            <Button>Add Product</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">No products found</p>
          <Link href="/products/add" passHref>
            <Button className="mt-4">Add Product</Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Warranty Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <Link href={`/products/${product.id}`} className="hover:underline">
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{new Date(product.purchaseDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(product.warrantyEnd).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={`/products/${product.id}`} className="flex w-full items-center">
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/products/edit/${product.id}`} className="flex w-full items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

