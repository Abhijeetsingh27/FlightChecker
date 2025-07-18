import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getBookingsByUserId } from '../services/api';
import './TripsAhead.css';

const TripsAhead = ({ onClose }) => {
  const user = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        setLoading(false);
        setError("User not logged in.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Fetch bookings for the logged-in user
        // Assuming getBookingsByUserId exists and takes user.id
        const data = await getBookingsByUserId(user.id);
        setBookings(data);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load your trips.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if the user is logged in and the component is visible
    if (user) {
      fetchTrips();
    }

  }, [user]); // Refetch if user changes

  if (!user) {
      // This case should ideally not be reached due to ProtectedRoute,
      // but handling it prevents errors if state is weird.
      return <div className="trips-ahead-container error">Please sign in to see your trips.</div>;
  }

  if (loading) {
    return <div className="trips-ahead-container">Loading trips...</div>;
  }

  if (error) {
    return <div className="trips-ahead-container error">Error: {error}</div>;
  }

  return (
    <div className="trips-ahead-container">
      <div className="trips-header">
        <h3>Your Upcoming Trips</h3>
        {/* Add a close button if needed */}
        {/* <button onClick={onClose}>Close</button> */}
      </div>
      {bookings.length === 0 ? (
        <p>No upcoming trips found.</p>
      ) : (
        <div className="trips-list">
          {bookings.map(booking => (
            <div key={booking.id} className="trip-item">
              <h4>Booking Reference: {booking.booking_reference}</h4>
              {/* Display flight details if they are included in the booking data fetched by the backend */}
              {/* You might need to adjust the backend endpoint to JOIN flights table */}
              {/* Check if flight data exists and is an array/object before accessing */}
              {booking.flights && (
                <>
                  <p>Flight: {booking.flights.flight_number || booking.flight_id}</p>
                  <p>From: {booking.flights.origin || 'N/A'} To: {booking.flights.destination || 'N/A'}</p>
                  <p>Departure: {booking.flights.departure_time ? new Date(booking.flights.departure_time).toLocaleString() : 'N/A'}</p>
                </>
              )}
              
              <p>Passenger: {booking.passenger_name}</p>
              <p>Price: ${booking.total_price}</p>
              {/* Add more booking details as needed */}
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose} className="close-trips-button">Close</button>
    </div>
  );
};

export default TripsAhead; 