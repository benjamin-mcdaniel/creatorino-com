// src/lib/authWrapper.js
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export function withAuth(WrappedComponent) {
  return function AuthWrapper(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Persistent session check
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
        setLoading(false);
      };

      checkSession();

      // Listen for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Cleanup subscription
      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);

    // If still loading, you can show a loading component
    if (loading) {
      return <div>Loading...</div>; // Or use a more sophisticated loading component
    }

    // Pass user as a prop to the wrapped component
    return <WrappedComponent {...props} user={user} />;
  };
}

// Alternative HOC for pages that require authentication
export function withAuthProtection(WrappedComponent, LoginComponent) {
  return function AuthProtectedWrapper(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
        setLoading(false);
      };

      checkSession();

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);

    // Loading state
    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }

    // No user, show login component
    if (!user) {
      return <LoginComponent />;
    }

    // User exists, render the wrapped component
    return <WrappedComponent {...props} user={user} />;
  };
}