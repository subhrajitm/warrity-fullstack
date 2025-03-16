const { validationResult, body } = require('express-validator');

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User validation rules
const userValidationRules = {
  register: [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  login: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  updateProfile: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional(),
    body('socialLinks.twitter').optional().isURL().withMessage('Twitter must be a valid URL'),
    body('socialLinks.linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
    body('socialLinks.github').optional().isURL().withMessage('GitHub must be a valid URL'),
    body('socialLinks.instagram').optional().isURL().withMessage('Instagram must be a valid URL')
  ]
};

// Warranty validation rules
const warrantyValidationRules = {
  create: [
    body('product').notEmpty().withMessage('Product is required'),
    body('purchaseDate').isISO8601().withMessage('Valid purchase date is required'),
    body('expirationDate').isISO8601().withMessage('Valid expiration date is required'),
    body('warrantyProvider').notEmpty().withMessage('Warranty provider is required'),
    body('warrantyNumber').notEmpty().withMessage('Warranty number is required'),
    body('coverageDetails').notEmpty().withMessage('Coverage details are required')
  ],
  update: [
    body('purchaseDate').optional().isISO8601().withMessage('Valid purchase date is required'),
    body('expirationDate').optional().isISO8601().withMessage('Valid expiration date is required'),
    body('warrantyProvider').optional().notEmpty().withMessage('Warranty provider cannot be empty'),
    body('warrantyNumber').optional().notEmpty().withMessage('Warranty number cannot be empty'),
    body('coverageDetails').optional().notEmpty().withMessage('Coverage details cannot be empty'),
    body('notes').optional()
  ]
};

// Product validation rules
const productValidationRules = {
  create: [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required')
      .isIn(['Electronics', 'Appliances', 'Furniture', 'Automotive', 'Clothing', 'Other'])
      .withMessage('Invalid category'),
    body('manufacturer').notEmpty().withMessage('Manufacturer is required')
  ],
  update: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional()
      .isIn(['Electronics', 'Appliances', 'Furniture', 'Automotive', 'Clothing', 'Other'])
      .withMessage('Invalid category'),
    body('manufacturer').optional().notEmpty().withMessage('Manufacturer cannot be empty')
  ]
};

// Event validation rules
const eventValidationRules = {
  create: [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('eventType').isIn(['warranty', 'maintenance', 'reminder', 'other']).withMessage('Invalid event type'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('allDay').isBoolean().withMessage('All day must be a boolean')
  ],
  update: [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('eventType').optional().isIn(['warranty', 'maintenance', 'reminder', 'other']).withMessage('Invalid event type'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
    body('allDay').optional().isBoolean().withMessage('All day must be a boolean')
  ]
};

module.exports = {
  validate,
  userValidationRules,
  warrantyValidationRules,
  productValidationRules,
  eventValidationRules
}; 