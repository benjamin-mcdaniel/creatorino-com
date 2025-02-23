// src/components/Navbar.js
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import useAuth from '../lib/useAuth';

export default function Navbar() {
  const { user } = useAuth();

  const handleEmailSignIn = async () => {
    // Simple prompt-based login
    const email = window.prompt('Enter your email:');
    const password = window.prompt('Enter your password:');
    if (!email || !password) return;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) console.error('Error signing in with email:', error.message);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Creatorino.com
        </Typography>
        <Link href="/" passHref>
          <Button color="inherit">Home</Button>
        </Link>
        <Link href="/dashboard" passHref>
          <Button color="inherit">Dashboard</Button>
        </Link>
        {user ? (
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        ) : (
          <Button color="inherit" onClick={handleEmailSignIn}>
            Sign in with Email
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
