const { supabase } = require('../config/supabase');
const { sendBookingConfirmation } = require('../services/emailService');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const {
      flight_id,
      passenger_name,
      email,
      phone,
      total_price,
      booking_reference
    } = req.body;

    // First, get the flight details
    const { data: flight, error: flightError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flight_id)
      .single();

    if (flightError) {
      console.error('Error fetching flight:', flightError);
      return res.status(500).json({ error: 'Failed to fetch flight details' });
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          flight_id,
          passenger_name,
          email,
          phone,
          total_price,
          booking_reference,
          status: 'confirmed'
        }
      ])
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return res.status(500).json({ error: 'Failed to create booking' });
    }

    // Debug log before sending email
    console.log('Calling sendBookingConfirmation with:', booking, flight);

    // Send confirmation email
    try {
      await sendBookingConfirmation(booking, flight);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't return error to user if email fails, just log it
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// ... existing code ... 