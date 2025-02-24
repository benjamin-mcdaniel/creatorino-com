// src/pages/dashboard.js
import Layout from '../components/Layout';
import useAuth from '../lib/useAuth';
import { Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            You must be logged in to access this dashboard.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please log in or sign up to continue.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Link href="/login" passHref>
              <Button variant="outlined" color="secondary">
                Login
              </Button>
            </Link>
            <Link href="/signup" passHref>
              <Button variant="outlined" color="secondary">
                Sign Up
              </Button>
            </Link>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome, {user.email}. This is your default SaaS dashboard where you can manage your product features, view analytics, and access your account settings.
        </Typography>
        {/* Additional dashboard components can be added here */}
      </Box>
    </Layout>
  );
}
