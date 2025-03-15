// src/components/common/PageHeader.js
import React from 'react';
import { Box, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function PageHeader({ title, subtitle, user, actions }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', sm: 'center' },
      mb: 4,
      mt: 2
    }}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        mt: { xs: 2, sm: 0 },
        ml: { xs: 0, sm: 2 }
      }}>
        {actions && (
          <Box sx={{ mr: 2 }}>
            {actions}
          </Box>
        )}
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={user.avatar_url || user.user_metadata?.avatar_url || null}
              alt={user.email || 'User'}
              sx={{ width: 40, height: 40 }}
            >
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-label="user menu"
            >
              <MoreVertIcon />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => {
                handleMenuClose();
                router.push('/profile');
              }}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                router.push('/settings');
              }}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  );
}