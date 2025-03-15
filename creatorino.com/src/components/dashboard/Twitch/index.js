// src/components/dashboard/Twitch/index.js
import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export default function TwitchTab() {
  // Simplified component with minimal functionality
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SportsEsportsIcon sx={{ color: '#9146FF', mr: 1 }} />
              <Typography variant="h5">Twitch Analytics</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Connect your Twitch account to track streaming performance and audience engagement.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#9146FF', 
                '&:hover': { bgcolor: '#7B31E6' } 
              }}
            >
              Connect Twitch
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}