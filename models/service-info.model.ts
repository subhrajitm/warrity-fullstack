import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceInfo extends Document {
  name: string;
  description: string;
  serviceType: 'Warranty' | 'Maintenance' | 'Repair' | 'Support' | 'Other';
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
  product?: mongoose.Types.ObjectId;
  company: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceInfoSchema = new Schema<IServiceInfo>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: ['Warranty', 'Maintenance', 'Repair', 'Support', 'Other'],
    },
    terms: {
      type: String,
      required: [true, 'Terms and conditions are required'],
      trim: true,
    },
    contactInfo: {
      email: String,
      phone: String,
      website: String,
      address: String,
    },
    warrantyInfo: {
      duration: String,
      coverage: String,
      exclusions: String,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
serviceInfoSchema.index({ product: 1 });
serviceInfoSchema.index({ company: 1 });
serviceInfoSchema.index({ isActive: 1 });

export const ServiceInfo = mongoose.models.ServiceInfo || mongoose.model<IServiceInfo>('ServiceInfo', serviceInfoSchema); 