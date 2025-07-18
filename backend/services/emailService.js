const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Function to send booking confirmation email
const sendBookingConfirmation = async (booking, flight) => {
  try {
    console.log('Booking email:', booking.email);
    console.log('Booking object:', booking);
    console.log('Flight object:', flight);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Flight Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a73e8;">Flight Booking Confirmation</h2>
          <p>Dear ${booking.passenger_name},</p>
          <p>Your flight booking has been confirmed. Here are your booking details:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a73e8; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking Reference:</strong> ${booking.booking_reference}</p>
            <p><strong>Flight Number:</strong> ${flight.flight_number}</p>
            <p><strong>Airline:</strong> ${flight.airline_name}</p>
            <p><strong>From:</strong> ${flight.origin}</p>
            <p><strong>To:</strong> ${flight.destination}</p>
            <p><strong>Departure:</strong> ${new Date(flight.departure_time).toLocaleString()}</p>
            <p><strong>Arrival:</strong> ${new Date(flight.arrival_time).toLocaleString()}</p>
            <p><strong>Total Price:</strong> $${booking.total_price}</p>
          </div>

          <p>Please keep this email for your records. You can use your booking reference (${booking.booking_reference}) for any future inquiries.</p>
          
          <p>Thank you for choosing our service!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation
}; 