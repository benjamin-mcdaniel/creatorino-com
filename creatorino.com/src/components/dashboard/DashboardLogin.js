// src/components/dashboard/DashboardLogin.js
import React from 'react';
import { Box, Typography, Button, Avatar, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

export default function DashboardLogin() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        p: 4,
        textAlign: 'center'
      }}
    >
      <Avatar sx={{ width: 80, height: 80, mb: 3, bgcolor: 'primary.main' }}>
        <PersonIcon fontSize="large" />
      </Avatar>
      <Typography variant="h4" gutterBottom>
        Access Required
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        You need to be logged in to view your dashboard. Please sign in or create an account to continue.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {/* Approach 1: Use the Link as a wrapper without passHref */}
        <Link href="/login">
          <Button variant="contained" color="primary" size="large">
            Log In
          </Button>
        </Link>
        {/* Approach 2: Use the Link as a wrapper without passHref */}
        <Link href="/signup">
          <Button variant="outlined" color="primary" size="large">
            Sign Up
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}