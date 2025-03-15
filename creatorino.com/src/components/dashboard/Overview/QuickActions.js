// src/components/dashboard/Overview/QuickActions.js
import React from 'react';
import { Typography, Stack, Button, Paper } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';

export function QuickActions() {
  const router = useRouter();
  
  const navigateToTab = (tabIndex) => {
    router.push({
      pathname: router.pathname,
      query: { tab: tabIndex },
    }, undefined, { shallow: true });
    
    // Also store in localStorage as backup
    localStorage.setItem('dashboardActiveTab', tabIndex.toString());
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="medium" gutterBottom>
        Quick Actions
      </Typography>
      <Stack spacing={2}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          startIcon={<LinkIcon />}
          onClick={() => navigateToTab(3)} // Navigate to Social Links tab
        >
          Manage Social Links
        </Button>
        <Button 
          variant="outlined" 
          fullWidth
          startIcon={<BarChartIcon />}
          onClick={() => router.push('/analytics')}
        >
          View Analytics Report
        </Button>
        <Button 
          variant="outlined" 
          fullWidth
          startIcon={<AccountCircleIcon />}
          onClick={() => router.push('/profile')}
        >
          Update Profile
        </Button>
      </Stack>
    </Paper>
  );
}