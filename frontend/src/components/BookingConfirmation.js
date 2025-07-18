import React from 'react';
import { useBooking } from '../context/BookingContext';

const BookingConfirmation = () => {
  const { booking } = useBooking();

  if (!booking) {
    return null;
  }

  return (
    <div className="confirmation">
      <h2>Booking Confirmed!</h2>
      <p>Booking Reference: {booking.booking_reference}</p>
      <p>Passenger Name: {booking.passenger_name}</p>
      <p>Flight ID: {booking.flight_id}</p>
      <p>Total Price: ${booking.total_price}</p>
      <p>Status: {booking.status}</p>
      <p>Thank you for choosing our service!</p>
    </div>
  );
};

export default BookingConfirmation; 