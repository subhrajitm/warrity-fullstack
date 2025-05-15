const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all categories (accessible by all authenticated users)
router.get('/', categoryController.getCategories);

// Get category by ID (accessible by all authenticated users)
router.get('/:id', categoryController.getCategoryById);

// Admin only routes
router.post('/', authorize(['admin']), categoryController.createCategory);
router.put('/:id', authorize(['admin']), categoryController.updateCategory);
router.delete('/:id', authorize(['admin']), categoryController.deleteCategory);

module.exports = router; 