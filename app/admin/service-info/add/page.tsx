"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Wrench } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api"
import { toast } from "sonner"

interface Product {
  _id: string;
  name: string;
  model: string;
}

export default function AddServiceInfoPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    serviceType: "",
    terms: "",
    contactInfo: {
      email: "",
      phone: "",
      website: "",
      address: ""
    },
    warrantyInfo: {
      duration: "",
      coverage: "",
      exclusions: ""
    },
    product: "",
    company: "",
    isActive: true
  })

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user && user.role !== 'admin') {
        router.replace(user.role === 'user' ? '/user' : '/login')
      } else {
        fetchProducts()
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  const fetchProducts = async () => {
    try {
      const response = await adminApi.getProducts()
      if (response.error) {
        toast.error('Failed to fetch products')
        return
      }
      if (response.data) {
        setProducts((response.data.products || []).filter((p) => typeof p._id === 'string') as Product[])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('An error occurred while fetching products')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await adminApi.createServiceInfo(formData)
      if (response.error) {
        toast.error('Failed to create service information')
        return
      }
      toast.success('Service information created successfully')
      router.push('/admin/service-info')
    } catch (error) {
      console.error('Error creating service information:', error)
      toast.error('An error occurred while creating service information')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/service-info" className="flex items-center text-amber-800 hover:text-amber-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Service Information
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Add Service Information</h1>
      </div>

      <Card className="border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <div className="flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-amber-800" />
            <CardTitle className="text-xl font-bold text-amber-900">Service Information Form</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-amber-900">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2 border-amber-800 bg-amber-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-amber-900">Service Type</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                >
                  <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warranty">Warranty</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-amber-900">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-2 border-amber-800 bg-amber-50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms" className="text-amber-900">Terms</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="border-2 border-amber-800 bg-amber-50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-amber-900">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="border-2 border-amber-800 bg-amber-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product" className="text-amber-900">Product (Optional)</Label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => setFormData({ ...formData, product: value })}
                >
                  <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                    <SelectValue placeholder="None (Company-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name} ({product.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-amber-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-900">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, email: e.target.value }
                    })}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-amber-900">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value }
                    })}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-amber-900">Website</Label>
                  <Input
                    id="website"
                    value={formData.contactInfo.website}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, website: e.target.value }
                    })}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-amber-900">Address</Label>
                  <Input
                    id="address"
                    value={formData.contactInfo.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, address: e.target.value }
                    })}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-amber-900">Warranty Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-amber-900">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.warrantyInfo.duration}
                    onChange={(e) => setFormData({
                      ...formData,
                      warrantyInfo: { ...formData.warrantyInfo, duration: e.target.value }
                    })}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverage" className="text-amber-900">Coverage</Label>
                  <Input
                    id="coverage"
                    value={formData.warrantyInfo.coverage}
                    onChange={(e) => setFormData({
                      ...formData,
                      warrantyInfo: { ...formData.warrantyInfo, coverage: e.target.value }
                    })}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exclusions" className="text-amber-900">Exclusions</Label>
                <Textarea
                  id="exclusions"
                  value={formData.warrantyInfo.exclusions}
                  onChange={(e) => setFormData({
                    ...formData,
                    warrantyInfo: { ...formData.warrantyInfo, exclusions: e.target.value }
                  })}
                  className="border-2 border-amber-800 bg-amber-50"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/service-info')}
                className="border-2 border-amber-800 text-amber-800 hover:bg-amber-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-amber-100"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Service Info'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 