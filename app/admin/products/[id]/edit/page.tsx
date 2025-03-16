// page.tsx (Server Component)
import { Suspense } from "react"
import AdminEditProductForm from "./AdminEditProductForm"

interface Props {
  params: {
    id: string
  }
}

export default async function AdminEditProductPage({ params }: Props) {
  // Await the params to ensure they are ready
  const productId = await Promise.resolve(params.id)

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">
      <p className="text-amber-800 text-xl">Loading product data...</p>
    </div>}>
      <AdminEditProductForm productId={productId} />
    </Suspense>
  )
}