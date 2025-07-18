const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../db/supabaseClient');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { flight_id, passenger_name, email, phone, total_price } = req.body;
    console.log('Received booking request:', req.body);

    // Validate required fields
    if (!flight_id || !passenger_name || !email || !phone || !total_price) {
      console.log('Missing required fields:', { flight_id, passenger_name, email, phone, total_price });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'All fields are required: flight_id, passenger_name, email, phone, total_price'
      });
    }

    // Validate flight exists
    const { data: flight, error: flightError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flight_id)
      .single();

    if (flightError) {
      console.error('Error checking flight:', flightError);
      return res.status(400).json({ 
        error: 'Invalid flight',
        details: 'Could not verify flight exists'
      });
    }

    if (!flight) {
      console.log('Flight not found:', flight_id);
      return res.status(404).json({ 
        error: 'Flight not found',
        details: `No flight found with ID: ${flight_id}`
      });
    }

    // Create booking
    const bookingData = {
      booking_reference: uuidv4(),
      flight_id,
      passenger_name,
      email,
      phone,
      total_price,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    console.log('Creating booking with data:', bookingData);

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ 
        error: 'Failed to create booking',
        details: error.message
      });
    }

    console.log('Booking created successfully:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Unexpected error creating booking:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      details: error.message
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting booking by ID:', id);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting booking:', error);
      return res.status(500).json({ 
        error: 'Failed to get booking',
        details: error.message
      });
    }

    if (!data) {
      console.log('Booking not found:', id);
      return res.status(404).json({ 
        error: 'Booking not found',
        details: `No booking found with ID: ${id}`
      });
    }

    console.log('Booking found:', data);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error getting booking:', error);
    res.status(500).json({ 
      error: 'Failed to get booking details',
      details: error.message
    });
  }
};

// Get all bookings for a user
const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Getting bookings for user:', userId);

    // Note: You might need to adjust the select query
    // to include flight details if they are not stored directly in bookings
    const { data, error } = await supabase
      .from('bookings')
      .select('*, flights(*)') // Example: select booking fields and join flight details
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ 
        error: 'Failed to get user bookings',
        details: error.message
      });
    }

    console.log(`Found ${data.length} bookings for user ${userId}`);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error getting user bookings:', error);
    res.status(500).json({ 
      error: 'Failed to get user bookings',
      details: error.message
    });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingsByUserId
}; 