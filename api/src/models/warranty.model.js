const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  warrantyProvider: {
    type: String,
    required: true
  },
  warrantyNumber: {
    type: String,
    required: true
  },
  coverageDetails: {
    type: String,
    required: true
  },
  documents: [{
    name: String,
    path: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'expiring', 'expired'],
    default: 'active'
  },
  notes: {
    type: String
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

// Method to check if warranty is expiring (within 30 days)
warrantySchema.methods.isExpiring = function() {
  const today = new Date();
  const expirationDate = new Date(this.expirationDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  return expirationDate <= thirtyDaysFromNow && expirationDate > today;
};

// Method to check if warranty is expired
warrantySchema.methods.isExpired = function() {
  const today = new Date();
  const expirationDate = new Date(this.expirationDate);
  
  return expirationDate < today;
};

// Pre-save hook to update status based on expiration date
warrantySchema.pre('save', function(next) {
  if (this.isExpired()) {
    this.status = 'expired';
  } else if (this.isExpiring()) {
    this.status = 'expiring';
  } else {
    this.status = 'active';
  }
  next();
});

const Warranty = mongoose.model('Warranty', warrantySchema);

module.exports = Warranty; 