// components/CookieConsent.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Link, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Cookie consent preference key
const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
    
    // If not, show the banner
    if (!hasConsent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    // Store consent in localStorage
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setOpen(false);
  };

  const handleDecline = () => {
    // For decline, we still need to remember the choice
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false');
    setOpen(false);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        maxWidth: '100%',
        width: '100%',
        bottom: { xs: 0, sm: 24 },
        '& .MuiPaper-root': {
          maxWidth: 900,
          mx: 'auto',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          gap: 2,
          width: '100%',
        }}
      >
        <Box sx={{ flex: 1, pr: { sm: 2 } }}>
          <Typography variant="body1" component="div" gutterBottom>
            We use cookies to enhance your experience on our website. By continuing to use this site, you consent to our use of cookies.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Learn more in our{' '}
            <Link href="/legal" color="primary" underline="hover">
              Privacy Policy
            </Link>
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 1,
          mt: { xs: 1, sm: 0 },
          alignItems: 'center'
        }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleDecline}
            size="small"
          >
            Decline
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAccept}
            size="small"
          >
            Accept All
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            sx={{ ml: { xs: 0, sm: 1 } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Snackbar>
  );
}