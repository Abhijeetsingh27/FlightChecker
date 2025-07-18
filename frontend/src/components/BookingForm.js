import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';

const BookingForm = () => {
  const { selectedFlight, setBookingData } = useBooking();
  const user = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    passenger_name: '',
    email: '',
    phone: '',
    seat_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFlight) {
      setError('Please select a flight first');
      return;
    }

    setLoading(true);
    setError(null);
    setShowThankYou(false);

    try {
      // 1. Create booking record
      const { data: bookingRecord, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            flight_number: selectedFlight.flight_number,
            airline_name: selectedFlight.airline_name,
            origin: selectedFlight.origin,
            destination: selectedFlight.destination,
            departure_time: selectedFlight.departure_time,
            arrival_time: selectedFlight.arrival_time,
            price: selectedFlight.price,
            seat_number: formData.seat_number,
            passenger_name: formData.passenger_name,
            passenger_email: formData.email,
            passenger_phone: formData.phone,
            booking_date: new Date().toISOString(),
            status: 'confirmed',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      setBookingData(bookingRecord);
      setShowThankYou(true);

      // Update user's profile with booking count
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          total_bookings: supabase.rpc('increment', { x: 1 }),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) console.error('Error updating profile:', profileError);

      setTimeout(() => {
        setShowThankYou(false);
        setBookingData(null);
        setFormData({
          passenger_name: '',
          email: '',
          phone: '',
          seat_number: ''
        });
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedFlight) {
    return null;
  }

  if (showThankYou) {
    return (
      <div className="thank-you-message">
        <h2>Thanks for booking with us!</h2>
        <p>Redirecting you to the home page...</p>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h2>Book Flight</h2>
      <div className="flight-details">
        <p>Flight: {selectedFlight.flight_number}</p>
        <p>Airline: {selectedFlight.airline_name}</p>
        <p>From: {selectedFlight.origin} to {selectedFlight.destination}</p>
        <p>Price: ${selectedFlight.price}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Seat Number"
            value={formData.seat_number}
            onChange={(e) => setFormData({ ...formData, seat_number: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Passenger Name"
            value={formData.passenger_name}
            onChange={(e) => setFormData({ ...formData, passenger_name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default BookingForm; 