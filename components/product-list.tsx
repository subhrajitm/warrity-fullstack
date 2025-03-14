"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProductListProps {
  filter?: "all" | "expiring" | "active" | "expired"
}

export function ProductList({ filter = "all" }: ProductListProps) {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "MacBook Pro",
      category: "Electronics",
      purchaseDate: "2023-01-15",
      warrantyEnd: "2025-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Samsung TV",
      category: "Electronics",
      purchaseDate: "2022-05-20",
      warrantyEnd: "2023-05-20",
      status: "expired",
    },
    {
      id: "3",
      name: "Dyson Vacuum",
      category: "Appliances",
      purchaseDate: "2023-03-10",
      warrantyEnd: "2024-03-10",
      status: "active",
    },
    {
      id: "4",
      name: "iPhone 13",
      category: "Electronics",
      purchaseDate: "2022-11-05",
      warrantyEnd: "2023-11-05",
      status: "expiring",
    },
  ])

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true
    return product.status === filter
  })

  const handleDelete = async (id: string) => {
    try {
      // In a real app, this would call the server action
      // await deleteProduct(id)
      setProducts(products.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Failed to delete product:", error)
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

