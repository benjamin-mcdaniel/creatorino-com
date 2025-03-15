// src/components/dashboard/SocialLinks/index.js
import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

export default function SocialLinksTab() {
  // Simplified component with minimal functionality
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LinkIcon sx={{ mr: 1 }} />
              <Typography variant="h5">Social Links</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Create and manage your social media links. Add links to your profiles on Twitter, Instagram, TikTok and more.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<LinkIcon />}
            >
              Add New Link
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}