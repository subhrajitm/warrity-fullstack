'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
  description: string;
  serviceInfo: {
    defaultWarrantyPeriod: number;
    serviceRequirements: string[];
    serviceNotes: string;
  };
}

export default function AddCategoryPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, token } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Debug logging
    console.log('Auth state:', { 
      isAuthenticated, 
      userRole: user?.role,
      hasToken: !!token,
      tokenLength: token?.length 
    });

    if (!token) {
      toast.error('Authentication token is missing. Please log in again.');
      router.push('/login');
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      const categoryData: CategoryFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        serviceInfo: {
          defaultWarrantyPeriod: Number(formData.get('warrantyPeriod')),
          serviceRequirements: [],
          serviceNotes: formData.get('serviceNotes') as string,
        },
      };

      console.log('Sending request with token:', token.substring(0, 20) + '...');

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.message || 'Failed to create category');
      }

      toast.success('Category created successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Failed to create category:', error);
      if (error instanceof Error) {
        if (error.message.includes('token')) {
          toast.error('Authentication error. Please log in again.');
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;
  if (!isAuthenticated || user?.role !== 'admin') {
    router.replace('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-amber-50">
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-amber-800 hover:text-amber-900 hover:bg-amber-100"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>

          <Card className="border-2 border-amber-800 bg-amber-100">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-900">Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-amber-900">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="border-2 border-amber-800 bg-amber-50"
                    placeholder="Enter category name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-amber-900">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    className="border-2 border-amber-800 bg-amber-50"
                    placeholder="Enter category description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyPeriod" className="text-amber-900">Default Warranty Period (months)</Label>
                  <Input
                    id="warrantyPeriod"
                    name="warrantyPeriod"
                    type="number"
                    min="1"
                    required
                    className="border-2 border-amber-800 bg-amber-50"
                    placeholder="Enter warranty period in months"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceNotes" className="text-amber-900">Service Notes</Label>
                  <Textarea
                    id="serviceNotes"
                    name="serviceNotes"
                    className="border-2 border-amber-800 bg-amber-50"
                    placeholder="Enter any service-related notes"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-amber-100"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Category'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 