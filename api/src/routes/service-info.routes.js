const express = require('express');
const router = express.Router();
const serviceInfoController = require('../controllers/service-info.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const validation = require('../middleware/validation.middleware');

// Get all service information (admin only)
router.get('/', auth, isAdmin, serviceInfoController.getAllServiceInfo);

// Get service info by product ID
router.get('/product/:productId', auth, serviceInfoController.getServiceInfoByProduct);

// Get service info by company
router.get('/company/:company', auth, serviceInfoController.getServiceInfoByCompany);

// Get service info by ID
router.get('/:id', auth, serviceInfoController.getServiceInfoById);

// Create new service info (admin only)
router.post('/', 
  auth, 
  isAdmin, 
  validation.serviceInfoValidationRules.create, 
  validation.validate, 
  serviceInfoController.createServiceInfo
);

// Update service info (admin only)
router.put('/:id', 
  auth, 
  isAdmin, 
  validation.serviceInfoValidationRules.update, 
  validation.validate, 
  serviceInfoController.updateServiceInfo
);

// Delete service info (admin only)
router.delete('/:id', auth, isAdmin, serviceInfoController.deleteServiceInfo);

module.exports = router; 