// src/components/dashboard/QuickActions.js
import React from 'react';
import { Typography, Stack, Button, Paper } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function QuickActions() {
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
        >
          Connect New Platform
        </Button>
        <Button 
          variant="outlined" 
          fullWidth
          startIcon={<BarChartIcon />}
        >
          View Analytics Report
        </Button>
        <Button 
          variant="outlined" 
          fullWidth
          startIcon={<AccountCircleIcon />}
        >
          Update Profile
        </Button>
      </Stack>
    </Paper>
  );
}