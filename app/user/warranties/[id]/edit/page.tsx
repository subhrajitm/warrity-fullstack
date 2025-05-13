"use client"

import { Suspense } from "react"
import { use } from "react"
import UserEditWarrantyForm from "./UserEditWarrantyForm"

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function UserEditWarrantyPage({ params }: Props) {
  const resolvedParams = use(params)
  
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">
      <p className="text-amber-800 text-xl">Loading warranty data...</p>
    </div>}>
      <UserEditWarrantyForm warrantyId={resolvedParams.id} />
    </Suspense>
  )
}