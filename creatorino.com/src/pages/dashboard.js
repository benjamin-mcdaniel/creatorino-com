// src/pages/dashboard.js
import React from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/dashboard';
import DashboardLogin from '../components/dashboard/DashboardLogin';
import { Box, CircularProgress } from '@mui/material';
import useAuth from '../lib/useAuth';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <DashboardLogin />
      </Layout>
    );
  }

  return (
    <Layout>
      <Dashboard user={user} />
    </Layout>
  );
}