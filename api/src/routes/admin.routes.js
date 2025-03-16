const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

// Get all users (admin only)
router.get('/users', auth, isAdmin, adminController.getAllUsers);

// Update user role (admin only)
router.put('/users/:id/role', auth, isAdmin, adminController.updateUserRole);

// Delete user (admin only)
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);

// Get dashboard statistics (admin only)
router.get('/dashboard/stats', auth, isAdmin, adminController.getDashboardStats);

// Get all warranties (admin only)
router.get('/warranties', auth, isAdmin, adminController.getAllWarranties);

// Get user activity (admin only)
router.get('/activity', auth, isAdmin, adminController.getUserActivity);

module.exports = router; 