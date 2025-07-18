const express = require('express');
const router = express.Router();
const { createBooking, getBookingById, getBookingsByUserId } = require('../controllers/bookingsController');

// Create a new booking
router.post('/', createBooking);

// Get booking by ID
router.get('/:id', getBookingById);

// Get all bookings for a user
router.get('/user/:userId', getBookingsByUserId);

module.exports = router; 