const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');
const { validate, productValidationRules } = require('../middleware/validation.middleware');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Get product categories
router.get('/categories/list', productController.getProductCategories);

// Create new product (admin only)
router.post('/', auth, isAdmin, productValidationRules.create, validate, productController.createProduct);

// Update product (admin only)
router.put('/:id', auth, isAdmin, productValidationRules.update, validate, productController.updateProduct);

// Delete product (admin only)
router.delete('/:id', auth, isAdmin, productController.deleteProduct);

// Upload product image (admin only)
router.post('/:id/image', auth, isAdmin, upload.single('image'), handleUploadError, productController.uploadProductImage);

module.exports = router; 