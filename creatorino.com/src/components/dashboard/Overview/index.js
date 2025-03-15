// src/components/dashboard/Overview/index.js
import React from 'react';
import { Grid, Box } from '@mui/material';
import { StatCards } from './StatCards';
import { RecentContent } from './RecentContent';
import { QuickActions } from './QuickActions';

export default function Overview() {
  return (
    <>
      <StatCards />
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <RecentContent />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <QuickActions />
        </Grid>
      </Grid>
    </>
  );
}