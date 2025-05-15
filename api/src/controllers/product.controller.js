const Product = require('../models/product.model');
const fs = require('fs');
const path = require('path');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { category, sort } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Build sort options
    let sortOptions = {};
    if (sort === 'nameAsc') {
      sortOptions = { name: 1 }; // Ascending order by name
    } else if (sort === 'nameDesc') {
      sortOptions = { name: -1 }; // Descending order by name
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 }; // Descending order (newest first)
    } else {
      // Default sort by name
      sortOptions = { name: 1 };
    }
    
    // Find products and populate category
    const products = await Product.find(query)
      .populate('category', 'name description serviceInfo')
      .sort(sortOptions);
    
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description serviceInfo');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      manufacturer,
      model,
      serialNumber,
      purchaseDate,
      price,
      images,
      specifications
    } = req.body;
    
    // Create product
    const product = new Product({
      name,
      description,
      category,
      manufacturer,
      model,
      serialNumber,
      purchaseDate,
      price,
      images: images || [],
      specifications: specifications || {}
    });
    
    await product.save();
    
    // Populate category before sending response
    await product.populate('category', 'name description serviceInfo');
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      manufacturer,
      model,
      serialNumber,
      purchaseDate,
      price,
      images,
      specifications,
      isActive
    } = req.body;
    
    // Find product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (manufacturer !== undefined) product.manufacturer = manufacturer;
    if (model !== undefined) product.model = model;
    if (serialNumber !== undefined) product.serialNumber = serialNumber;
    if (purchaseDate !== undefined) product.purchaseDate = purchaseDate;
    if (price !== undefined) product.price = price;
    if (images !== undefined) product.images = images;
    if (specifications !== undefined) product.specifications = specifications;
    if (isActive !== undefined) product.isActive = isActive;
    
    await product.save();
    
    // Populate category before sending response
    await product.populate('category', 'name description serviceInfo');
    
    res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    // Find product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload product image (admin only)
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Find product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete old image if exists
    if (product.image) {
      const oldImagePath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(product.image));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Update product image
    product.image = `/uploads/${req.file.filename}`;
    await product.save();
    
    res.status(200).json({
      message: 'Product image updated successfully',
      image: product.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product categories
const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getProductCategories
}; 