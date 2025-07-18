import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('sign-in'); // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Email/Password Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            full_name: fullName,
            email: email
          } 
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert into profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              email: email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (profileError) throw profileError;

        setMessage('Account created successfully! Please check your email for confirmation.');
        setView('sign-in'); // Switch to sign-in view
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Update last_login in profiles table
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);

        if (updateError) throw updateError;

        console.log('Sign in successful:', authData);
        setMessage('Signed in successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>{view === 'sign-in' ? 'Sign In' : 'Sign Up'}</h2>
      {view === 'sign-in' && (
        <form onSubmit={handleSignIn}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p>Don't have an account? 
            <span 
              style={{color:'blue',cursor:'pointer'}} 
              onClick={() => setView('sign-up')}
            >
              Sign Up
            </span>
          </p>
        </form>
      )}
      {view === 'sign-up' && (
        <form onSubmit={handleSignUp}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          <p>Already have an account? 
            <span 
              style={{color:'blue',cursor:'pointer'}} 
              onClick={() => setView('sign-in')}
            >
              Sign In
            </span>
          </p>
        </form>
      )}
      {message && (
        <p className={message.includes('successfully') ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AuthPage; 