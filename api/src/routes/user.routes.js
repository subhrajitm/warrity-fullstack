const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');
const { validate, userValidationRules } = require('../middleware/validation.middleware');

// Get user profile
router.get('/profile', auth, userController.getUserProfile);

// Update user profile
router.put('/profile', auth, userValidationRules.updateProfile, validate, userController.updateProfile);

// Upload profile picture
router.post('/profile/picture', auth, upload.single('profilePicture'), handleUploadError, userController.uploadProfilePicture);

// Get user by ID (admin only)
router.get('/:id', auth, isAdmin, userController.getUserById);

module.exports = router; 