const ServiceInfo = require('../models/service-info.model');
const Product = require('../models/product.model');
const AuditLog = require('../models/audit-log.model');

// Get all service information (admin only)
const getAllServiceInfo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const serviceInfo = await ServiceInfo.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('product', 'name model');

    const total = await ServiceInfo.countDocuments();

    res.status(200).json({
      serviceInfo,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get service info by ID
const getServiceInfoById = async (req, res) => {
  try {
    const serviceInfo = await ServiceInfo.findById(req.params.id)
      .populate('product', 'name model');

    if (!serviceInfo) {
      return res.status(404).json({ message: 'Service information not found' });
    }

    res.status(200).json({ serviceInfo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get service info by product ID
const getServiceInfoByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // First check if the product has a serviceInfo field
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let serviceInfo = null;

    // If product has serviceInfo field, use that
    if (product.serviceInfo) {
      serviceInfo = await ServiceInfo.findById(product.serviceInfo);
    }

    // If no serviceInfo found or product doesn't have serviceInfo field,
    // try to find company-level info
    if (!serviceInfo) {
      serviceInfo = await ServiceInfo.findOne({ 
        company: product.manufacturer, 
        product: null,
        isActive: true 
      });
    }

    if (!serviceInfo) {
      return res.status(404).json({ message: 'Service information not found' });
    }

    res.status(200).json({ serviceInfo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get service info by company
const getServiceInfoByCompany = async (req, res) => {
  try {
    const company = req.params.company;
    
    const serviceInfo = await ServiceInfo.find({ 
      company,
      product: null,
      isActive: true 
    });

    if (!serviceInfo || serviceInfo.length === 0) {
      return res.status(404).json({ message: 'Service information not found' });
    }

    res.status(200).json({ serviceInfo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new service info (admin only)
const createServiceInfo = async (req, res) => {
  try {
    const {
      name,
      description,
      serviceType,
      terms,
      contactInfo,
      warrantyInfo,
      product,
      company
    } = req.body;

    // If product is specified, verify it exists
    if (product) {
      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const serviceInfo = new ServiceInfo({
      name,
      description,
      serviceType,
      terms,
      contactInfo,
      warrantyInfo,
      product,
      company
    });

    await serviceInfo.save();

    // Log the action
    await AuditLog.create({
      adminId: req.user._id,
      action: 'create',
      resourceType: 'service_info',
      resourceId: serviceInfo._id,
      details: { name, serviceType, company },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      message: 'Service information created successfully',
      serviceInfo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update service info (admin only)
const updateServiceInfo = async (req, res) => {
  try {
    const serviceInfo = await ServiceInfo.findById(req.params.id);
    if (!serviceInfo) {
      return res.status(404).json({ message: 'Service information not found' });
    }

    const {
      name,
      description,
      serviceType,
      terms,
      contactInfo,
      warrantyInfo,
      product,
      company,
      isActive
    } = req.body;

    // If product is specified, verify it exists
    if (product) {
      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    // Update fields
    if (name) serviceInfo.name = name;
    if (description) serviceInfo.description = description;
    if (serviceType) serviceInfo.serviceType = serviceType;
    if (terms) serviceInfo.terms = terms;
    if (contactInfo) serviceInfo.contactInfo = contactInfo;
    if (warrantyInfo) serviceInfo.warrantyInfo = warrantyInfo;
    if (product !== undefined) serviceInfo.product = product;
    if (company) serviceInfo.company = company;
    if (isActive !== undefined) serviceInfo.isActive = isActive;

    await serviceInfo.save();

    // Log the action
    await AuditLog.create({
      adminId: req.user._id,
      action: 'update',
      resourceType: 'service_info',
      resourceId: serviceInfo._id,
      details: { name, serviceType, company },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({
      message: 'Service information updated successfully',
      serviceInfo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete service info (admin only)
const deleteServiceInfo = async (req, res) => {
  try {
    const serviceInfo = await ServiceInfo.findById(req.params.id);
    if (!serviceInfo) {
      return res.status(404).json({ message: 'Service information not found' });
    }

    await ServiceInfo.findByIdAndDelete(req.params.id);

    // Log the action
    await AuditLog.create({
      adminId: req.user._id,
      action: 'delete',
      resourceType: 'service_info',
      resourceId: serviceInfo._id,
      details: { name: serviceInfo.name, company: serviceInfo.company },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({ message: 'Service information deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllServiceInfo,
  getServiceInfoById,
  getServiceInfoByProduct,
  getServiceInfoByCompany,
  createServiceInfo,
  updateServiceInfo,
  deleteServiceInfo
}; 