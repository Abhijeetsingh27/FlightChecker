const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const flightsRoutes = require('./routes/flights');
const bookingsRoutes = require('./routes/bookings');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/flights', flightsRoutes);
app.use('/bookings', bookingsRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Flight Booking API is running' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 