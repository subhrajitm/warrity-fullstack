// page.tsx (Server Component)
import { Suspense } from "react"
import AdminEditWarrantyForm from "./AdminEditWarrantyForm"

interface Props {
  params: {
    id: string
  }
}

export default function AdminEditWarrantyPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">
      <p className="text-amber-800 text-xl">Loading warranty data...</p>
    </div>}>
      <AdminEditWarrantyForm warrantyId={params.id} />
    </Suspense>
  )
}