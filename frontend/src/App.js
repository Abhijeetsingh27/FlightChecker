import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import FlightSearch from './components/FlightSearch';
import { BookingProvider } from './context/BookingContext';
// Removed unused imports: BookingForm, BookingConfirmation
// import BookingForm from './components/BookingForm';
// import BookingConfirmation from './components/BookingConfirmation';
import './styles/main.css';

// This component decides whether to show children or redirect to login
const AuthWrapper = ({ children }) => {
  const user = useAuth();

  // Still loading auth status
  if (user === undefined) {
    return <div>Loading...</div>; // Or a spinner
  }

  // User is logged in, show the children (HomePage)
  if (user) {
    return <>{children}</>;
  }

  // User is not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BookingProvider> {/* Keep BookingContext around the main app */}
      <BrowserRouter>
        <Routes>
          {/* Route for the authentication page */}
          <Route path="/login" element={<AuthPage />} />

          {/* Protected route for the home page and other authenticated content */}
          {/* All routes defined inside AuthWrapper will require login */}
          <Route path="/" element={<AuthWrapper><HomePage /></AuthWrapper>} />

          <Route path="/flights" element={<AuthWrapper><FlightSearch /></AuthWrapper>} />

          {/* Optional: Redirect any unknown routes to login if not authenticated */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </BookingProvider>
  );
}

export default App; 