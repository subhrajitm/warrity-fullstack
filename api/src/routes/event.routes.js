const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { auth } = require('../middleware/auth.middleware');
const { validate, eventValidationRules } = require('../middleware/validation.middleware');

// Get all events for current user
router.get('/', auth, eventController.getAllEvents);

// Get event by ID
router.get('/:id', auth, eventController.getEventById);

// Create new event
router.post('/', auth, eventValidationRules.create, validate, eventController.createEvent);

// Update event
router.put('/:id', auth, eventValidationRules.update, validate, eventController.updateEvent);

// Delete event
router.delete('/:id', auth, eventController.deleteEvent);

// Get events by month
router.get('/month/:year/:month', auth, eventController.getEventsByMonth);

module.exports = router; 