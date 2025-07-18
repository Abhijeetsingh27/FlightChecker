import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  useEffect(() => {
    console.log('useAuth: Setting up auth listener...');
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log('useAuth: Initial user status:', user);
      setUser(user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('useAuth: Auth state changed. Event:', _event, 'Session:', session);
      setUser(session?.user ?? null);
    });
    return () => {
      console.log('useAuth: Cleaning up auth listener.');
      listener.subscription.unsubscribe();
    };
  }, []);

  console.log('useAuth: Current user state:', user);
  return user;
} 