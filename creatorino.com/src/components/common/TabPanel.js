// src/components/common/TabPanel.js
import React from 'react';
import { Box } from '@mui/material';

export default function TabPanel({ children, value, index, ...props }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}