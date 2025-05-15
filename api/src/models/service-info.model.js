const mongoose = require('mongoose');

const serviceInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Warranty', 'Maintenance', 'Repair', 'Support', 'Other']
  },
  terms: {
    type: String,
    required: true
  },
  contactInfo: {
    email: String,
    phone: String,
    website: String,
    address: String
  },
  warrantyInfo: {
    duration: String,
    coverage: String,
    exclusions: String
  },
  // Link to either product or company (or both)
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceInfoSchema.index({ product: 1, company: 1 });
serviceInfoSchema.index({ company: 1 });
serviceInfoSchema.index({ isActive: 1 });

const ServiceInfo = mongoose.model('ServiceInfo', serviceInfoSchema);

module.exports = ServiceInfo; 