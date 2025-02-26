// src/components/dashboard/SocialLinks/index.js
import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { FullPageLoader } from '../common/LoadingState';

import useSocialLinks from '../../hooks/useSocialLinks';

export default function SocialLinksTab() {
  const { links, loading } = useSocialLinks();

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <Box>
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Social Links
          </Typography>
          <Typography variant="body1">
            Manage your social media links and create a custom landing page for your audience.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<LinkIcon />}
          >
            Add Social Link
          </Button>
        </Grid>
      </Grid>

      {links.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No social links yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add your first social media link to create your custom landing page.
          </Typography>
          <Button variant="outlined" startIcon={<LinkIcon />}>
            Add Your First Link
          </Button>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          You have {links.length} social links. This tab will be expanded with more detailed social link management in the next phase.
        </Typography>
      )}
    </Box>
  );
}