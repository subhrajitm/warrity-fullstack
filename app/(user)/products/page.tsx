import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductList } from "@/components/product-list"

export default function ProductsPage() {
  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link href="/products/add" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <ProductList />
    </div>
  )
}

