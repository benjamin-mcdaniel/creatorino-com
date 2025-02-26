// src/components/dashboard/Twitch/index.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { FullPageLoader } from '../../common/LoadingState';

import useTwitch from '../../../hooks/useTwitch';

export default function TwitchTab() {
  const { connected, loading } = useTwitch();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!connected) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <SportsEsportsIcon sx={{ fontSize: 60, color: '#9146FF', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Connect to Twitch
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Connect your Twitch channel to see detailed streaming analytics and track your performance.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: '#9146FF', 
            '&:hover': { bgcolor: '#7B31E6' } 
          }} 
          startIcon={<SportsEsportsIcon />}
        >
          Connect Twitch
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Twitch Analytics
      </Typography>
      <Typography variant="body1" paragraph>
        You've connected your Twitch channel. Detailed analytics will appear here.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This tab will be expanded with more detailed Twitch analytics in the next phase.
      </Typography>
    </Box>
  );
}