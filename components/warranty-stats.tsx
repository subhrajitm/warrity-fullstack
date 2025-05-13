"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle } from "lucide-react"

// Mock data for demonstration
const mockStats = {
  totalProducts: 12,
  activeWarranties: 8,
  expiringSoon: 3,
  expiredWarranties: 4
}

export function WarrantyStats() {
  const [stats, setStats] = useState(mockStats)

  // In a real app, you would fetch this data from your API
  useEffect(() => {
    // Simulating API call
    const fetchStats = async () => {
      // Replace with actual API call
      // const response = await fetch('/api/warranty-stats')
      // const data = await response.json()
      // setStats(data)
      
      // Using mock data for now
      setStats(mockStats)
    }

    fetchStats()
  }, [])

  return (
    <>
      <Card className="border-2 border-amber-800 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-amber-900">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-amber-800">{stats.totalProducts}</p>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-amber-800 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-amber-900">Active Warranties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{stats.activeWarranties}</p>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-amber-800 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-amber-900">Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-600">{stats.expiringSoon}</p>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-amber-800 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-amber-900">Expired Warranties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">{stats.expiredWarranties}</p>
        </CardContent>
      </Card>
    </>
  )
}

