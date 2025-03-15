// src/components/dashboard/YouTube/index.js
import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function YouTubeTab() {
  // Simplified component with minimal functionality
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <YouTubeIcon sx={{ color: '#FF0000', mr: 1 }} />
              <Typography variant="h5">YouTube Analytics</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Connect your YouTube channel to see detailed analytics and insights.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#FF0000', 
                '&:hover': { bgcolor: '#CC0000' } 
              }}
            >
              Connect YouTube
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}