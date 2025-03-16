"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"

export default function AddProductPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyPeriod: "12",
    retailer: "",
    price: "",
    manufacturerName: "",
    manufacturerWebsite: "",
    supportPhone: "",
    supportEmail: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!isAuthenticated) {
        router.replace('/login?returnUrl=/products/add')
        return
      }
      // In a real app, this would call the server action
      // await addProduct(formData)
      console.log("Product added:", formData)
      router.push("/products")
    } catch (error) {
      console.error("Failed to add product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add authentication check
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login?returnUrl=/products/add')
      }
    }
  }, [router, authLoading, isAuthenticated])

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/products" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Enter the details of your product to register it in the Warrity system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., MacBook Pro"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="appliances">Appliances</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g., MacBook Pro 14-inch (2021)"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    placeholder="e.g., C02G3KYVMD6M"
                    value={formData.serialNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyPeriod">Warranty Period (months)</Label>
                  <Select
                    value={formData.warrantyPeriod}
                    onValueChange={(value) => handleSelectChange("warrantyPeriod", value)}
                    required
                  >
                    <SelectTrigger id="warrantyPeriod">
                      <SelectValue placeholder="Select warranty period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retailer">Retailer</Label>
                  <Input
                    id="retailer"
                    name="retailer"
                    placeholder="e.g., Amazon, Best Buy"
                    value={formData.retailer}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="e.g., $1,999.00"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Manufacturer Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="manufacturerName">Manufacturer Name</Label>
                  <Input
                    id="manufacturerName"
                    name="manufacturerName"
                    placeholder="e.g., Apple Inc."
                    value={formData.manufacturerName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturerWebsite">Manufacturer Website</Label>
                  <Input
                    id="manufacturerWebsite"
                    name="manufacturerWebsite"
                    placeholder="e.g., https://www.apple.com"
                    value={formData.manufacturerWebsite}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    name="supportPhone"
                    placeholder="e.g., 1-800-275-2273"
                    value={formData.supportPhone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    name="supportEmail"
                    placeholder="e.g., support@apple.com"
                    value={formData.supportEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional information about the product or warranty"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

