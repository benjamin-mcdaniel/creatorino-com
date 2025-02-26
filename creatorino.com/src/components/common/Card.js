// src/components/common/Card.js
import React from 'react';
import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';

export default function Card({ 
  title, 
  children, 
  sx = {}, 
  elevation = 0, 
  headerAction,
  ...props 
}) {
  return (
    <MuiCard 
      elevation={elevation} 
      sx={{ 
        height: '100%',
        borderRadius: 3,
        overflow: 'visible',
        ...sx
      }} 
      {...props}
    >
      {title && (
        <Box 
          sx={{ 
            p: 3, 
            pb: 0, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" fontWeight="medium">
            {title}
          </Typography>
          {headerAction}
        </Box>
      )}
      <CardContent sx={{ p: 3 }}>
        {children}
      </CardContent>
    </MuiCard>
  );
}