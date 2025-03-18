const express = require('express');
const router = express.Router();
const warrantyController = require('../controllers/warranty.controller');
const { auth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { handleUploadError } = require('../middleware/error.middleware');
// Fix: Import validation properly
const validation = require('../middleware/validation.middleware');

// Get all warranties
router.get('/', auth, warrantyController.getAllWarranties);

// Get expiring warranties - this is likely line 39 with the issue
// Make sure warrantyController.getExpiringWarranties is a function
router.get('/expiring', auth, function(req, res) {
  // If the controller function doesn't exist, create a temporary one
  if (typeof warrantyController.getExpiringWarranties === 'function') {
    return warrantyController.getExpiringWarranties(req, res);
  } else {
    // Temporary implementation until the controller is fixed
    res.status(200).json({ message: 'Expiring warranties endpoint - controller function needs to be implemented' });
  }
});

// Get warranty statistics
router.get('/stats/overview', auth, warrantyController.getWarrantyStats);

/**
 * @swagger
 * /api/warranties/expiring:
 *   get:
 *     summary: Get warranties expiring soon (within 30 days)
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of warranties expiring soon
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warranty'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// The issue is likely in this route at line 39
// router.get('/expiring', auth, warrantyController.getExpiringWarranties);

// Check if warrantyController.getExpiringWarranties is a function
// If it's not defined or is an object, we need to fix it
router.get('/expiring', auth, warrantyController.getExpiringWarranties);

/**
 * @swagger
 * /api/warranties/{id}:
 *   get:
 *     summary: Get warranty by ID
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warranty ID
 *     responses:
 *       200:
 *         description: Warranty details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warranty'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// Get warranty by ID - parameter route should come after specific routes
router.get('/:id', auth, warrantyController.getWarrantyById);

/**
 * @swagger
 * /api/warranties:
 *   post:
 *     summary: Create a new warranty
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - purchaseDate
 *               - expirationDate
 *               - warrantyProvider
 *               - warrantyNumber
 *               - coverageDetails
 *             properties:
 *               product:
 *                 type: string
 *                 description: The ID of the product
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 description: The date the product was purchased
 *               expirationDate:
 *                 type: string
 *                 format: date
 *                 description: The date the warranty expires
 *               warrantyProvider:
 *                 type: string
 *                 description: The company providing the warranty
 *               warrantyNumber:
 *                 type: string
 *                 description: The warranty identification number
 *               coverageDetails:
 *                 type: string
 *                 description: Details about what the warranty covers
 *               notes:
 *                 type: string
 *                 description: Additional notes about the warranty
 *     responses:
 *       201:
 *         description: Warranty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warranty'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// Fix: Use validation.warrantyValidationRules instead of warrantyValidationRules
router.post('/', auth, validation.warrantyValidationRules.create, validation.validate, warrantyController.createWarranty);

/**
 * @swagger
 * /api/warranties/{id}:
 *   put:
 *     summary: Update a warranty
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warranty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 description: The date the product was purchased
 *               expirationDate:
 *                 type: string
 *                 format: date
 *                 description: The date the warranty expires
 *               warrantyProvider:
 *                 type: string
 *                 description: The company providing the warranty
 *               warrantyNumber:
 *                 type: string
 *                 description: The warranty identification number
 *               coverageDetails:
 *                 type: string
 *                 description: Details about what the warranty covers
 *               notes:
 *                 type: string
 *                 description: Additional notes about the warranty
 *               status:
 *                 type: string
 *                 enum: [active, expiring, expired]
 *                 description: The current status of the warranty
 *     responses:
 *       200:
 *         description: Warranty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warranty'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// Update route
router.put('/:id', auth, validation.warrantyValidationRules.update, validation.validate, warrantyController.updateWarranty);

/**
 * @swagger
 * /api/warranties/{id}:
 *   delete:
 *     summary: Delete a warranty
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warranty ID
 *     responses:
 *       200:
 *         description: Warranty deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', auth, warrantyController.deleteWarranty);

/**
 * @swagger
 * /api/warranties/{id}/documents:
 *   post:
 *     summary: Upload a document for a warranty
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warranty ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: The document file to upload
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warranty'
 *       400:
 *         description: Invalid file format or size
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/:id/documents', auth, upload.single('document'), handleUploadError, warrantyController.uploadDocument);

/**
 * @swagger
 * /api/warranties/{id}/documents/{documentId}:
 *   delete:
 *     summary: Delete a document from a warranty
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warranty ID
 *       - in: path
 *         name: documentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id/documents/:documentId', auth, warrantyController.deleteDocument);

module.exports = router;