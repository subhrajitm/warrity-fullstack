import { Suspense } from "react"
import { use } from "react"
import AdminProductDetails from "./AdminProductDetails"

// Mock product data
const mockProduct = {
  id: 1,
  name: "Premium Leather Sofa",
  category: "Furniture",
  price: 1299.99,
  description: "A luxurious leather sofa with premium craftsmanship and comfort.",
  sku: "FURN-SOFA-001",
  stock: 15,
  status: "active",
  warrantyPeriod: "3 years",
  warrantyTerms: "Covers manufacturing defects and material issues. Does not cover normal wear and tear or damage from misuse.",
  createdAt: "2023-05-15T10:30:00Z",
  updatedAt: "2023-09-20T14:45:00Z",
  images: [
    "/images/products/sofa-1.jpg",
    "/images/products/sofa-2.jpg",
    "/images/products/sofa-3.jpg"
  ],
  specifications: [
    { name: "Dimensions", value: "90\" W x 40\" D x 35\" H" },
    { name: "Material", value: "Top-grain leather" },
    { name: "Frame", value: "Kiln-dried hardwood" },
    { name: "Color", value: "Cognac brown" },
    { name: "Weight", value: "180 lbs" },
    { name: "Assembly", value: "Minimal assembly required" }
  ]
}

interface PageParams {
  id: string;
}

interface Props {
  params: Promise<PageParams>;
}

export default function AdminProductPage({ params }: Props) {
  // Unwrap params using React.use()
  const { id: productId } = use(params)
  
  // In a real app, you would fetch the product data here
  console.log(`Fetching product with ID: ${productId}`)
  
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">
      <p className="text-amber-800 text-xl">Loading product details...</p>
    </div>}>
      <AdminProductDetails product={mockProduct} productId={productId} />
    </Suspense>
  )
}