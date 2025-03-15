// src/components/common/LoadingState.js
import React from 'react';
import { Box, Skeleton, CircularProgress } from '@mui/material';

/**
 * Full page loading spinner for tab content
 */
export function FullPageLoader() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '40vh' 
      }}
    >
      <CircularProgress />
    </Box>
  );
}

/**
 * Skeleton for stat cards
 */
export function StatCardSkeleton() {
  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Skeleton variant="text" width={150} />
      </Box>
      <Skeleton variant="text" width="70%" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" />
    </Box>
  );
}

/**
 * Skeleton for cards with flexible height
 */
export function CardSkeleton({ height = 200 }) {
  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, height }}>
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={height - 100} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="40%" />
    </Box>
  );
}

/**
 * Skeleton for list items
 */
export function ListItemSkeleton({ count = 3 }) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ width: '100%' }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
      ))}
    </>
  );
}

/**
 * Skeleton for profile components
 */
export function ProfileSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
      <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
      <Skeleton variant="text" width={120} sx={{ mb: 1 }} />
      <Skeleton variant="text" width={180} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={120} />
    </Box>
  );
}