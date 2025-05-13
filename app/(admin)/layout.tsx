import type React from "react"
import AdminNavbar from "@/components/admin-navbar"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminNavbar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

