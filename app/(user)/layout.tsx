import type React from "react"
import UserNavbar from "@/components/user-navbar"
import Footer from "@/components/footer"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <UserNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

