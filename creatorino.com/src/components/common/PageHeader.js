// src/components/common/PageHeader.js
import React from 'react';
import { Typography, Box, Grid } from '@mui/material';

export default function PageHeader({ 
  title, 
  subtitle, 
  action, 
  sx = {},
  ...props 
}) {
  return (
    <Grid 
      container 
      spacing={3} 
      alignItems="center" 
      sx={{ mb: 4, ...sx }}
      {...props}
    >
      <Grid item xs={12} md={action ? 8 : 12}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Grid>
      
      {action && (
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          {action}
        </Grid>
      )}
    </Grid>
  );
}