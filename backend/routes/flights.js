const express = require('express');
const router = express.Router();
const { searchFlights, getFlightById } = require('../controllers/flightsController');

// Search flights
router.get('/', searchFlights);

// Get flight by ID
router.get('/:id', getFlightById);

module.exports = router; 