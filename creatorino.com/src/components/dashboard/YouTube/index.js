// src/components/dashboard/YouTube/index.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { FullPageLoader } from '../../common/LoadingState';

import useYouTube from '../../../hooks/useYouTube';

export default function YouTubeTab() {
  const { connected, loading } = useYouTube();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!connected) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <YouTubeIcon sx={{ fontSize: 60, color: '#FF0000', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Connect to YouTube
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Connect your YouTube channel to see detailed analytics and track your performance.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: '#FF0000', 
            '&:hover': { bgcolor: '#CC0000' } 
          }} 
          startIcon={<YouTubeIcon />}
        >
          Connect YouTube
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        YouTube Analytics
      </Typography>
      <Typography variant="body1" paragraph>
        You've connected your YouTube channel. Detailed analytics will appear here.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This tab will be expanded with more detailed YouTube analytics in the next phase.
      </Typography>
    </Box>
  );
}