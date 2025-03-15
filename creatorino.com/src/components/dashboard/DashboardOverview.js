// src/components/dashboard/DashboardOverview.js
import React from 'react';
import { Grid, Box } from '@mui/material';
import { StatCards } from './StatCards';
import { RecentContent } from './RecentContent';
import { QuickActions } from './QuickActions';
// Only include components you have already created
// This is a simplified version that should work with your existing files

export default function DashboardOverview() {
  return (
    <>
      <StatCards />
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <RecentContent />
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Add a Box to provide spacing between components */}
          <Box sx={{ mb: 3 }}>
            {/* Placeholder for SocialLinksCard - will add this once it's fully implemented */}
            {/* <SocialLinksCard /> */}
          </Box>
          <QuickActions />
        </Grid>
      </Grid>
    </>
  );
}