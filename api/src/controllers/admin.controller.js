const User = require('../models/user.model');
const Warranty = require('../models/warranty.model');
const Product = require('../models/product.model');
const Event = require('../models/event.model');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics (admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Get user stats
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = totalUsers - adminUsers;
    
    // Get warranty stats
    const totalWarranties = await Warranty.countDocuments();
    const activeWarranties = await Warranty.countDocuments({ status: 'active' });
    const expiringWarranties = await Warranty.countDocuments({ status: 'expiring' });
    const expiredWarranties = await Warranty.countDocuments({ status: 'expired' });
    
    // Get product stats
    const totalProducts = await Product.countDocuments();
    
    // Get product categories with counts
    const products = await Product.find();
    const categoryData = {};
    
    products.forEach(product => {
      const category = product.category;
      categoryData[category] = (categoryData[category] || 0) + 1;
    });
    
    // Format category data for charts
    const categoryStats = Object.keys(categoryData).map(category => ({
      name: category,
      count: categoryData[category]
    }));
    
    // Get monthly warranty data (for the current year)
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59, 999);
      
      const count = await Warranty.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      
      monthlyData.push({
        month: new Date(currentYear, month, 1).toLocaleString('default', { month: 'long' }),
        count
      });
    }
    
    res.status(200).json({
      userStats: {
        total: totalUsers,
        admin: adminUsers,
        regular: regularUsers
      },
      warrantyStats: {
        total: totalWarranties,
        active: activeWarranties,
        expiring: expiringWarranties,
        expired: expiredWarranties
      },
      productStats: {
        total: totalProducts,
        categories: categoryStats
      },
      monthlyData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all warranties (admin only)
const getAllWarranties = async (req, res) => {
  try {
    const warranties = await Warranty.find()
      .populate('user', 'name email')
      .populate('product');
    
    res.status(200).json({ warranties });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user activity (admin only)
const getUserActivity = async (req, res) => {
  try {
    // Get recent warranties
    const recentWarranties = await Warranty.find()
      .populate('user', 'name email')
      .populate('product')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get recent events
    const recentEvents = await Event.find()
      .populate('user', 'name email')
      .populate('relatedProduct')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      recentWarranties,
      recentEvents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getAllWarranties,
  getUserActivity
}; 