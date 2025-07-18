import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient'; // Import supabase for sign out
import FlightSearch from './FlightSearch'; // Assuming these exist
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import TripsAhead from './TripsAhead'; // Import the new component
import './HomePage.css'; // Import CSS

const HomePage = () => {
  const user = useAuth();
  const [showTrips, setShowTrips] = useState(false); // State to control TripsAhead visibility

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The useAuth hook will update, App.js will handle redirection
  };

  const toggleShowTrips = () => {
    setShowTrips(!showTrips);
  };

  // You might want to fetch profile data here if needed
  // const [profile, setProfile] = useState(null);
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (user) {
  //       const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
  //       setProfile(data);
  //     } else {
  //       setProfile(null);
  //     }
  //   };
  //   fetchProfile();
  // }, [user]);

  return (
    <div className="homepage-container">
      <header className="app-header">
        <div className="logo">Flight Booker</div>
        <nav className="main-nav">
          {/* Link to "Book a Flight" section or component */}
          <a href="#flight-search">Book a Flight</a>
          {/* Add the Trips Ahead button */}
          <button onClick={toggleShowTrips} className="trips-ahead-button">
            Trips Ahead
          </button>
          {/* Add more navigation links here if needed */}
        </nav>
        <div className="user-profile">
          {user ? (
            <>
              {/* Display user's name or email */}
              <span>Hello, {user.user_metadata?.full_name || user.email}</span>
              <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
              {/* You could add a profile icon/link here */}
            </>
          ) : (
            // This part should not be reached if protected routing works,
            // but good as a fallback
            <span>Not logged in</span>
          )}
        </div>
      </header>

      <main className="app-main-content">
        {/* Conditionally render TripsAhead */}
        {showTrips ? (
          <TripsAhead onClose={toggleShowTrips} />
        ) : (
          // Render standard home page content when showTrips is false
          <>
            <section id="flight-search" className="content-section">
              <h2>Find Your Flight</h2>
              <FlightSearch />
            </section>

            <section className="content-section">
              <h2>Booking Details</h2>
              <BookingForm />
            </section>

            <section className="content-section">
              <h2>Confirmation</h2>
              <BookingConfirmation />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2023 Flight Booker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage; 