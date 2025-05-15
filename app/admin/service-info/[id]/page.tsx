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
import { adminApi, ServiceInfo } from "@/lib/api"
import { toast } from "sonner"

interface Product {
  _id: string;
  name: string;
  model: string;
}

interface PageParams {
  id: string;
}

export default function EditServiceInfoPage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [serviceId, setServiceId] = useState<string>("")
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
    company: "",
    isActive: true
  })

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    serviceType?: string;
    terms?: string;
    company?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
      website?: string;
    };
  }>({})

  useEffect(() => {
    const init = async () => {
      try {
        const resolvedParams = await params
        setServiceId(resolvedParams.id)
      } catch (error) {
        console.error('Error resolving params:', error)
        toast.error('Failed to load page parameters')
        router.push('/admin/service-info')
      }
    }
    init()
  }, [params, router])

  useEffect(() => {
    if (!isLoading && serviceId) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user && user.role !== 'admin') {
        router.replace(user.role === 'user' ? '/user' : '/login')
      } else {
        fetchServiceInfo()
      }
    }
  }, [isAuthenticated, isLoading, router, user, serviceId])

  const fetchServiceInfo = async () => {
    if (!serviceId) return

    try {
      const response = await adminApi.getServiceInfoById(serviceId)
      if (response.error) {
        toast.error('Failed to fetch service information')
        router.push('/admin/service-info')
        return
      }
      
      if (response.data?.serviceInfo) {
        const { serviceInfo } = response.data
        setFormData({
          name: serviceInfo.name,
          description: serviceInfo.description,
          serviceType: serviceInfo.serviceType,
          terms: serviceInfo.terms,
          contactInfo: {
            email: serviceInfo.contactInfo?.email || "",
            phone: serviceInfo.contactInfo?.phone || "",
            website: serviceInfo.contactInfo?.website || "",
            address: serviceInfo.contactInfo?.address || ""
          },
          warrantyInfo: {
            duration: serviceInfo.warrantyInfo?.duration || "",
            coverage: serviceInfo.warrantyInfo?.coverage || "",
            exclusions: serviceInfo.warrantyInfo?.exclusions || ""
          },
          company: serviceInfo.company,
          isActive: serviceInfo.isActive
        })
      }
    } catch (error) {
      console.error('Error fetching service information:', error)
      toast.error('An error occurred while fetching service information')
      router.push('/admin/service-info')
    }
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.serviceType) {
      newErrors.serviceType = 'Service type is required'
    }
    if (!formData.terms.trim()) {
      newErrors.terms = 'Terms are required'
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
    }

    // Contact info validation
    if (formData.contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors.contactInfo = {
        ...newErrors.contactInfo,
        email: 'Invalid email format'
      }
    }
    if (formData.contactInfo.phone && !/^\+?[\d\s-]{10,}$/.test(formData.contactInfo.phone)) {
      newErrors.contactInfo = {
        ...newErrors.contactInfo,
        phone: 'Invalid phone number format'
      }
    }
    if (formData.contactInfo.website && !/^https?:\/\/.+/.test(formData.contactInfo.website)) {
      newErrors.contactInfo = {
        ...newErrors.contactInfo,
        website: 'Invalid website URL format'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    setLoading(true)

    try {
      const response = await adminApi.updateServiceInfo(serviceId, formData)
      if (response.error) {
        toast.error(typeof response.error === 'string' ? response.error : 'Failed to update service information')
        return
      }
      toast.success('Service information updated successfully')
      router.push('/admin/service-info')
    } catch (error) {
      console.error('Error updating service information:', error)
      toast.error('An error occurred while updating service information')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }))
    // Clear error when user starts typing
    if (errors.contactInfo?.[field as keyof typeof errors.contactInfo]) {
      setErrors(prev => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [field]: undefined }
      }))
    }
  }

  const handleWarrantyInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      warrantyInfo: { ...prev.warrantyInfo, [field]: value }
    }))
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
        <h1 className="text-3xl font-bold text-amber-900">Edit Service Information</h1>
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
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`border-2 ${errors.name ? 'border-red-500' : 'border-amber-800'} bg-amber-50`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-amber-900">Service Type</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange('serviceType', value)}
                >
                  <SelectTrigger className={`border-2 ${errors.serviceType ? 'border-red-500' : 'border-amber-800'} bg-amber-50`}>
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
                {errors.serviceType && <p className="text-red-500 text-sm">{errors.serviceType}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-amber-900">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`border-2 ${errors.description ? 'border-red-500' : 'border-amber-800'} bg-amber-50`}
                required
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms" className="text-amber-900">Terms</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                className={`border-2 ${errors.terms ? 'border-red-500' : 'border-amber-800'} bg-amber-50`}
                required
              />
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-amber-900">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`border-2 ${errors.company ? 'border-red-500' : 'border-amber-800'} bg-amber-50`}
                  required
                />
                {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
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
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    className={`border-2 ${errors.contactInfo?.email ? 'border-red-500' : 'border-amber-800'} bg-amber-50`}
                  />
                  {errors.contactInfo?.email && <p className="text-red-500 text-sm">{errors.contactInfo.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-amber-900">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    className={`border-2 ${errors.contactInfo?.phone ? 'border-red-500' : 'border-amber-800'} bg-amber-50`}
                  />
                  {errors.contactInfo?.phone && <p className="text-red-500 text-sm">{errors.contactInfo.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-amber-900">Website</Label>
                  <Input
                    id="website"
                    value={formData.contactInfo.website}
                    onChange={(e) => handleContactInfoChange('website', e.target.value)}
                    className={`border-2 ${errors.contactInfo?.website ? 'border-red-500' : 'border-amber-800'} bg-amber-50`}
                  />
                  {errors.contactInfo?.website && <p className="text-red-500 text-sm">{errors.contactInfo.website}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-amber-900">Address</Label>
                  <Input
                    id="address"
                    value={formData.contactInfo.address}
                    onChange={(e) => handleContactInfoChange('address', e.target.value)}
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
                    onChange={(e) => handleWarrantyInfoChange('duration', e.target.value)}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverage" className="text-amber-900">Coverage</Label>
                  <Input
                    id="coverage"
                    value={formData.warrantyInfo.coverage}
                    onChange={(e) => handleWarrantyInfoChange('coverage', e.target.value)}
                    className="border-2 border-amber-800 bg-amber-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exclusions" className="text-amber-900">Exclusions</Label>
                <Textarea
                  id="exclusions"
                  value={formData.warrantyInfo.exclusions}
                  onChange={(e) => handleWarrantyInfoChange('exclusions', e.target.value)}
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
                {loading ? 'Updating...' : 'Update Service Info'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 