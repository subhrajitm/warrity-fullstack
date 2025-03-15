"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyPeriod: "",
    retailer: "",
    price: "",
    manufacturerName: "",
    manufacturerWebsite: "",
    supportPhone: "",
    supportEmail: "",
    notes: "",
  })

  useEffect(() => {
    // In a real app, this would fetch the product from the database
    // For now, we'll use mock data
    const mockProduct = {
      id: params.id,
      name: "MacBook Pro",
      category: "electronics",
      model: "MacBook Pro 14-inch (2021)",
      serialNumber: "C02G3KYVMD6M",
      purchaseDate: "2023-01-15",
      warrantyPeriod: "24",
      retailer: "Apple Store",
      price: "$1,999.00",
      manufacturerName: "Apple Inc.",
      manufacturerWebsite: "https://www.apple.com",
      supportPhone: "1-800-275-2273",
      supportEmail: "support@apple.com",
      notes: "AppleCare+ extended warranty purchased with the device.",
    }

    setFormData(mockProduct)
  }, [params.id])

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
      // In a real app, this would call the server action
      // await updateProduct(params.id, formData)
      console.log("Product updated:", formData)
      router.push(`/products/${params.id}`)
    } catch (error) {
      console.error("Failed to update product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href={`/products/${params.id}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Product
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update the details of your product in the Warrity system.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
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
                  <Input id="model" name="model" value={formData.model} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input id="serialNumber" name="serialNumber" value={formData.serialNumber} onChange={handleChange} />
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
                  <Input id="retailer" name="retailer" value={formData.retailer} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" value={formData.price} onChange={handleChange} />
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
                    value={formData.manufacturerName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturerWebsite">Manufacturer Website</Label>
                  <Input
                    id="manufacturerWebsite"
                    name="manufacturerWebsite"
                    value={formData.manufacturerWebsite}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input id="supportPhone" name="supportPhone" value={formData.supportPhone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" name="supportEmail" value={formData.supportEmail} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

