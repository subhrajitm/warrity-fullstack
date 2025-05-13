import { Suspense } from "react"
import AdminEditUserForm from "./AdminEditUserForm"

interface Props {
  params: {
    id: string
  }
}

export default function AdminEditUserPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">
      <p className="text-amber-800 text-xl">Loading user data...</p>
    </div>}>
      <AdminEditUserForm userId={params.id} />
    </Suspense>
  )
}