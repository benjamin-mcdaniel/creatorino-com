import React from 'react';
import { Typography } from '@mui/material';

export default function Logo(props) {
  return (
    <Typography
      variant="h6"
      component="span"
      sx={{
        fontWeight: 700,
        color: 'primary.main',
        fontSize: props.fontSize || 'inherit',
        letterSpacing: '-0.5px'
      }}
      {...props}
    >
      Creatorino
    </Typography>
  );
}
