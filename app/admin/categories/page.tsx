'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Category {
  _id: string;
  name: string;
  description: string;
  serviceInfo: {
    defaultWarrantyPeriod: number;
    serviceRequirements: string[];
    serviceNotes: string;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user && user.role !== 'admin') {
        router.replace('/user/products');
      } else {
        fetchCategories();
      }
    }
  }, [router, authLoading, isAuthenticated, user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = values._id ? `/api/categories/${values._id}` : '/api/categories';
      const method = values._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to save category');

      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-amber-50">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Category Management</h1>
            <p className="text-amber-700">Manage product categories and their warranty information</p>
          </div>
          <Button 
            className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
            onClick={() => router.push('/admin/categories/add')}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Category
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
            <Input
              placeholder="Search categories..."
              className="pl-10 border-2 border-amber-800 bg-amber-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(category => (
            <Card 
              key={category._id}
              className="border-2 border-amber-800 bg-amber-100 hover:shadow-[8px_8px_0px_0px_rgba(120,53,15,0.3)] transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-amber-900">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 mb-4">{category.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-amber-800">
                    <span>Warranty Period:</span>
                    <span>{category.serviceInfo.defaultWarrantyPeriod} months</span>
                  </div>
                  {category.serviceInfo.serviceNotes && (
                    <div className="text-sm text-amber-700">
                      <p className="font-medium">Service Notes:</p>
                      <p>{category.serviceInfo.serviceNotes}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    className="border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-amber-100"
                    onClick={() => router.push(`/admin/categories/${category._id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 