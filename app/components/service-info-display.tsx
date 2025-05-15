import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ServiceInfo {
  _id: string;
  name: string;
  description: string;
  serviceType: string;
  terms: string;
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  warrantyInfo: {
    duration?: string;
    coverage?: string;
    exclusions?: string;
  };
  product?: {
    _id: string;
    name: string;
    model: string;
  };
  company: string;
  isActive: boolean;
}

interface ServiceInfoDisplayProps {
  serviceInfo: ServiceInfo | null;
  isLoading?: boolean;
}

export function ServiceInfoDisplay({ serviceInfo, isLoading = false }: ServiceInfoDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!serviceInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No service information available for this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{serviceInfo.name}</CardTitle>
          <Badge variant={serviceInfo.isActive ? "default" : "secondary"}>
            {serviceInfo.serviceType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{serviceInfo.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Terms & Conditions</h3>
          <p className="text-sm text-muted-foreground">{serviceInfo.terms}</p>
        </div>

        {serviceInfo.warrantyInfo && (
          <div>
            <h3 className="text-sm font-medium mb-2">Warranty Information</h3>
            <div className="space-y-2">
              {serviceInfo.warrantyInfo.duration && (
                <p className="text-sm">
                  <span className="font-medium">Duration:</span> {serviceInfo.warrantyInfo.duration}
                </p>
              )}
              {serviceInfo.warrantyInfo.coverage && (
                <p className="text-sm">
                  <span className="font-medium">Coverage:</span> {serviceInfo.warrantyInfo.coverage}
                </p>
              )}
              {serviceInfo.warrantyInfo.exclusions && (
                <p className="text-sm">
                  <span className="font-medium">Exclusions:</span> {serviceInfo.warrantyInfo.exclusions}
                </p>
              )}
            </div>
          </div>
        )}

        {serviceInfo.contactInfo && (
          <div>
            <h3 className="text-sm font-medium mb-2">Contact Information</h3>
            <div className="space-y-2">
              {serviceInfo.contactInfo.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {serviceInfo.contactInfo.email}
                </p>
              )}
              {serviceInfo.contactInfo.phone && (
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {serviceInfo.contactInfo.phone}
                </p>
              )}
              {serviceInfo.contactInfo.website && (
                <p className="text-sm">
                  <span className="font-medium">Website:</span>{' '}
                  <a
                    href={serviceInfo.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {serviceInfo.contactInfo.website}
                  </a>
                </p>
              )}
              {serviceInfo.contactInfo.address && (
                <p className="text-sm">
                  <span className="font-medium">Address:</span> {serviceInfo.contactInfo.address}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 