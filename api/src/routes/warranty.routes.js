const express = require('express');
const router = express.Router();
const warrantyController = require('../controllers/warranty.controller');
const { auth } = require('../middleware/auth.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');
const { validate, warrantyValidationRules } = require('../middleware/validation.middleware');

// Get all warranties for current user
router.get('/', auth, warrantyController.getAllWarranties);

// Get warranty by ID
router.get('/:id', auth, warrantyController.getWarrantyById);

// Create new warranty
router.post('/', auth, warrantyValidationRules.create, validate, warrantyController.createWarranty);

// Update warranty
router.put('/:id', auth, warrantyValidationRules.update, validate, warrantyController.updateWarranty);

// Delete warranty
router.delete('/:id', auth, warrantyController.deleteWarranty);

// Upload warranty document
router.post('/:id/documents', auth, upload.single('document'), handleUploadError, warrantyController.uploadDocument);

// Delete warranty document
router.delete('/:id/documents/:documentId', auth, warrantyController.deleteDocument);

// Get warranty statistics
router.get('/stats/overview', auth, warrantyController.getWarrantyStats);

module.exports = router; 