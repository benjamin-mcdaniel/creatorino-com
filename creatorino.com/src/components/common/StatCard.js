// src/components/common/StatCard.js
import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend = 'neutral', // 'up', 'down', or 'neutral'
  trendValue = '', 
  avatarColor = 'primary.main' 
}) {
  // Default value if nothing provided
  const displayValue = value || '0';
  
  // Icon and color for trend
  const trendIcon = trend === 'up' ? (
    <ArrowUpwardIcon fontSize="small" sx={{ color: 'success.main' }} />
  ) : trend === 'down' ? (
    <ArrowDownwardIcon fontSize="small" sx={{ color: 'error.main' }} />
  ) : null;
  
  const trendColor = trend === 'up' 
    ? 'success.main' 
    : trend === 'down' 
      ? 'error.main' 
      : 'text.secondary';

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Avatar
            sx={{
              bgcolor: avatarColor,
              width: 40,
              height: 40,
              mr: 2
            }}
          >
            {icon}
          </Avatar>
        )}
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </Box>

      <Typography variant="h4" component="div" fontWeight="medium" sx={{ mb: 1 }}>
        {displayValue}
      </Typography>

      {trendValue && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {trendIcon}
          <Typography
            variant="body2"
            component="span"
            sx={{ color: trendColor, ml: 0.5 }}
          >
            {trendValue}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}