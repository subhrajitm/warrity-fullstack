import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarClock, ChevronLeft, Edit, Phone, ShieldCheck, PenToolIcon as Tool } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceHistory } from "@/components/service-history"
import { ServiceInfoDisplay } from '@/components/service-info-display';
import { useEffect, useState } from 'react';
import { ServiceInfo } from '@/lib/api';

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null);
  const [isLoadingServiceInfo, setIsLoadingServiceInfo] = useState(true);

  useEffect(() => {
    const fetchServiceInfo = async () => {
      try {
        const response = await fetch(`/api/service-info/product/${params.id}`);
        const data = await response.json();
        if (data.serviceInfo) {
          setServiceInfo(data.serviceInfo);
        }
      } catch (error) {
        console.error('Failed to fetch service information:', error);
      } finally {
        setIsLoadingServiceInfo(false);
      }
    };

    fetchServiceInfo();
  }, [params.id]);

  // In a real app, this would fetch from the database
  const product = {
    id: params.id,
    name: "MacBook Pro",
    category: "Electronics",
    model: "MacBook Pro 14-inch (2021)",
    serialNumber: "C02G3KYVMD6M",
    purchaseDate: "2023-01-15",
    warrantyEnd: "2025-01-15",
    status: "active",
    retailer: "Apple Store",
    price: "$1,999.00",
    manufacturer: {
      name: "Apple Inc.",
      website: "https://www.apple.com",
      supportPhone: "1-800-275-2273",
      supportEmail: "support@apple.com",
    },
    documents: [
      { name: "Purchase Receipt", url: "#" },
      { name: "Warranty Card", url: "#" },
      { name: "User Manual", url: "#" },
    ],
    notes: "AppleCare+ extended warranty purchased with the device.",
  }

  if (!product) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "expiring":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Expiring Soon
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const daysRemaining = () => {
    const today = new Date()
    const end = new Date(product.warrantyEnd)
    const diffTime = Math.abs(end.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/products" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              {getStatusBadge(product.status)}
            </div>
          </div>
          <Link href={`/products/edit/${product.id}`} passHref>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Model</p>
                  <p>{product.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                  <p>{product.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                  <p>{new Date(product.purchaseDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Retailer</p>
                  <p>{product.retailer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p>{product.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Manufacturer</p>
                  <p>{product.manufacturer.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warranty Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-muted p-3">
                  <ShieldCheck
                    className={`h-6 w-6 ${product.status === "active" ? "text-green-500" : "text-red-500"}`}
                  />
                </div>
                <div>
                  <p className="font-medium">Warranty Status</p>
                  <p className="text-sm text-muted-foreground">
                    {product.status === "active"
                      ? `Valid until ${new Date(product.warrantyEnd).toLocaleDateString()} (${daysRemaining()} days remaining)`
                      : `Expired on ${new Date(product.warrantyEnd).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">{product.notes}</p>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Documents</p>
                <div className="space-y-2">
                  {product.documents.map((doc, index) => (
                    <Link key={index} href={doc.url} className="block text-sm text-blue-600 hover:underline">
                      {doc.name}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="service-history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service-history">Service History</TabsTrigger>
            <TabsTrigger value="support">Support Information</TabsTrigger>
          </TabsList>
          <TabsContent value="service-history">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>Record of all service and repair activities for this product.</CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceHistory productId={product.id} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Support Information</CardTitle>
                <CardDescription>Contact details for warranty claims and technical support.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Support Phone</p>
                    <p className="text-sm text-muted-foreground">{product.manufacturer.supportPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-2">
                    <Tool className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Support Email</p>
                    <p className="text-sm text-muted-foreground">{product.manufacturer.supportEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-2">
                    <CalendarClock className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Manufacturer Website</p>
                    <Link
                      href={product.manufacturer.website}
                      className="text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {product.manufacturer.website}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <ServiceInfoDisplay
            serviceInfo={serviceInfo}
            isLoading={isLoadingServiceInfo}
          />
        </div>
      </div>
    </div>
  )
}

