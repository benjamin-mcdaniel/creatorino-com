// src/components/common/StatCard.js
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import Card from './Card';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  avatarColor = 'primary.main',
  ...props
}) {
  const isTrendPositive = trend === 'up';
  
  return (
    <Card {...props}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Avatar sx={{ bgcolor: avatarColor, width: 40, height: 40 }}>
          {icon}
        </Avatar>
      </Box>
      <Typography variant="h4" fontWeight="bold">
        {value}
      </Typography>
      {trendValue && (
        <Typography 
          variant="body2" 
          color={isTrendPositive ? 'success.main' : 'error.main'} 
          sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
        >
          {isTrendPositive ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />}
          {trendValue}
        </Typography>
      )}
    </Card>
  );
}