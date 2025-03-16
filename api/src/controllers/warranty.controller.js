const Warranty = require('../models/warranty.model');
const Product = require('../models/product.model');
const fs = require('fs');
const path = require('path');

// Get all warranties for current user
const getAllWarranties = async (req, res) => {
  try {
    const { status, sort } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    
    // Filter by status if provided
    if (status && ['active', 'expiring', 'expired'].includes(status)) {
      query.status = status;
    }
    
    // Build sort options
    let sortOptions = {};
    if (sort === 'expiringSoon') {
      sortOptions = { expirationDate: 1 }; // Ascending order (soonest first)
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 }; // Descending order (newest first)
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 }; // Ascending order (oldest first)
    } else {
      // Default sort by expiration date
      sortOptions = { expirationDate: 1 };
    }
    
    // Find warranties
    const warranties = await Warranty.find(query)
      .populate('product')
      .sort(sortOptions);
    
    res.status(200).json({ warranties });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get warranty by ID
const getWarrantyById = async (req, res) => {
  try {
    const warranty = await Warranty.findById(req.params.id)
      .populate('product');
    
    if (!warranty) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    
    // Check if warranty belongs to current user or user is admin
    if (warranty.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this warranty' });
    }
    
    res.status(200).json({ warranty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new warranty
const createWarranty = async (req, res) => {
  try {
    const {
      product,
      purchaseDate,
      expirationDate,
      warrantyProvider,
      warrantyNumber,
      coverageDetails,
      notes
    } = req.body;
    
    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create warranty
    const warranty = new Warranty({
      user: req.user._id,
      product,
      purchaseDate,
      expirationDate,
      warrantyProvider,
      warrantyNumber,
      coverageDetails,
      notes
    });
    
    await warranty.save();
    
    res.status(201).json({
      message: 'Warranty created successfully',
      warranty
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update warranty
const updateWarranty = async (req, res) => {
  try {
    const {
      purchaseDate,
      expirationDate,
      warrantyProvider,
      warrantyNumber,
      coverageDetails,
      notes
    } = req.body;
    
    // Find warranty
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    
    // Check if warranty belongs to current user or user is admin
    if (warranty.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this warranty' });
    }
    
    // Update fields
    if (purchaseDate) warranty.purchaseDate = purchaseDate;
    if (expirationDate) warranty.expirationDate = expirationDate;
    if (warrantyProvider) warranty.warrantyProvider = warrantyProvider;
    if (warrantyNumber) warranty.warrantyNumber = warrantyNumber;
    if (coverageDetails) warranty.coverageDetails = coverageDetails;
    if (notes !== undefined) warranty.notes = notes;
    
    await warranty.save();
    
    res.status(200).json({
      message: 'Warranty updated successfully',
      warranty
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete warranty
const deleteWarranty = async (req, res) => {
  try {
    // Find warranty
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    
    // Check if warranty belongs to current user or user is admin
    if (warranty.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this warranty' });
    }
    
    // Delete warranty documents if any
    if (warranty.documents && warranty.documents.length > 0) {
      warranty.documents.forEach(doc => {
        const docPath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(doc.path));
        if (fs.existsSync(docPath)) {
          fs.unlinkSync(docPath);
        }
      });
    }
    
    await Warranty.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Warranty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload warranty document
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Find warranty
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    
    // Check if warranty belongs to current user or user is admin
    if (warranty.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this warranty' });
    }
    
    // Add document to warranty
    warranty.documents.push({
      name: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      uploadDate: Date.now()
    });
    
    await warranty.save();
    
    res.status(200).json({
      message: 'Document uploaded successfully',
      document: warranty.documents[warranty.documents.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete warranty document
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    // Find warranty
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    
    // Check if warranty belongs to current user or user is admin
    if (warranty.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this warranty' });
    }
    
    // Find document
    const document = warranty.documents.id(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Delete file
    const docPath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(document.path));
    if (fs.existsSync(docPath)) {
      fs.unlinkSync(docPath);
    }
    
    // Remove document from warranty
    warranty.documents.pull(documentId);
    await warranty.save();
    
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get warranty statistics
const getWarrantyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total count
    const totalCount = await Warranty.countDocuments({ user: userId });
    
    // Get active count
    const activeCount = await Warranty.countDocuments({ 
      user: userId,
      status: 'active'
    });
    
    // Get expiring count
    const expiringCount = await Warranty.countDocuments({ 
      user: userId,
      status: 'expiring'
    });
    
    // Get expired count
    const expiredCount = await Warranty.countDocuments({ 
      user: userId,
      status: 'expired'
    });
    
    // Get warranties by category
    const warranties = await Warranty.find({ user: userId }).populate('product');
    
    const categoryCounts = {};
    warranties.forEach(warranty => {
      if (warranty.product && warranty.product.category) {
        const category = warranty.product.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
    
    res.status(200).json({
      totalCount,
      activeCount,
      expiringCount,
      expiredCount,
      categoryCounts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllWarranties,
  getWarrantyById,
  createWarranty,
  updateWarranty,
  deleteWarranty,
  uploadDocument,
  deleteDocument,
  getWarrantyStats
}; 