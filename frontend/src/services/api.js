import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchFlights = async (params) => {
  try {
    console.log('Frontend API: Searching flights with params:', params);
    const response = await api.get('/flights', { params });
    console.log('Frontend API: Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Frontend API: Error searching flights:', error.response || error);
    throw error.response?.data || error;
  }
};

export const getFlightById = async (id) => {
  try {
    console.log('Getting flight by ID:', id);
    const response = await api.get(`/flights/${id}`);
    console.log('Flight details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting flight:', error.response || error);
    throw error.response?.data || error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    console.log('Frontend API: Creating booking with data:', bookingData);
    const response = await api.post('/bookings', bookingData);
    console.log('Frontend API: Booking creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Frontend API: Error creating booking:', error.response || error);
    throw error.response?.data || error;
  }
};

export const getBookingById = async (id) => {
  try {
    console.log('Getting booking by ID:', id);
    const response = await api.get(`/bookings/${id}`);
    console.log('Booking details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting booking:', error.response || error);
    throw error.response?.data || error;
  }
};

export const getBookingsByUserId = async (userId) => {
  try {
    console.log('Frontend API: Fetching bookings for user:', userId);
    // Make sure this matches the backend route: /bookings/user/:userId
    const response = await api.get(`/bookings/user/${userId}`);
    console.log('Frontend API: User bookings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Frontend API: Error fetching user bookings:', error.response || error);
    throw error.response?.data || error;
  }
};
