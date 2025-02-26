// src/components/common/LoadingState.js
import React from 'react';
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

export function FullPageLoader() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '60vh' 
    }}>
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
}

export function CardSkeleton({ height = 200 }) {
  return (
    <Box sx={{ width: '100%', height: height, p: 2 }}>
      <Skeleton variant="rectangular" width="100%" height="30%" />
      <Skeleton variant="text" width="80%" sx={{ mt: 2 }} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="70%" />
    </Box>
  );
}

export function StatCardSkeleton() {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      <Skeleton variant="text" width="70%" height={40} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
    </Box>
  );
}

export default { FullPageLoader, CardSkeleton, StatCardSkeleton };