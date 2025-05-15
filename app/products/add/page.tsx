'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, InputNumber, Select, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface Category {
  _id: string;
  name: string;
  description: string;
  serviceInfo: {
    defaultWarrantyPeriod: number;
  };
}

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      message.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Handle image uploads first
      const imageUrls = await Promise.all(
        values.images?.fileList?.map(async (file: UploadFile) => {
          const formData = new FormData();
          formData.append('file', file.originFileObj as File);
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) throw new Error('Failed to upload image');
          
          const { url } = await uploadResponse.json();
          return url;
        }) || []
      );

      // Create product with image URLs
      const productData = {
        ...values,
        images: imageUrls,
        purchaseDate: values.purchaseDate?.toISOString(),
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to create product');

      message.success('Product added successfully');
      router.push('/products');
    } catch (error) {
      message.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="Add New Product" className="max-w-2xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              {categories.map(category => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="model"
            label="Model"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="serialNumber"
            label="Serial Number"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="purchaseDate"
            label="Purchase Date"
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="images"
            label="Product Images"
          >
            <Upload
              listType="picture"
              multiple
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 