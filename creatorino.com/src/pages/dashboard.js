// src/pages/dashboard.js
import Layout from '../components/Layout';
import useAuth from '../lib/useAuth';
import { Typography, Box } from '@mui/material';

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
        <Typography>
          You must be logged in to access this dashboard. Please sign in.
        </Typography>
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
