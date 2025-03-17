// Warranty types
export interface WarrantyDocument {
  name: string;
  path: string;
  uploadDate: string;
}

export interface Product {
  _id: string;
  name: string;
  manufacturer: string;
}

export interface Warranty {
  id: string;
  user: string;
  product: Product;
  purchaseDate: string;
  expirationDate: string;
  warrantyProvider: string;
  warrantyNumber: string;
  coverageDetails: string;
  documents: WarrantyDocument[];
  status: 'active' | 'expiring' | 'expired';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyInput {
  product: string; // Product ID
  purchaseDate: string;
  expirationDate: string;
  warrantyProvider: string;
  warrantyNumber: string;
  coverageDetails: string;
  notes?: string;
  status: 'active';
  documents: WarrantyDocument[];
}
