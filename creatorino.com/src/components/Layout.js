// components/Layout.js
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Container, Toolbar, Typography, Button, Tooltip, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { getCachedAvatar, cacheAvatar, preloadAvatar, getAvatarUrl } from '../lib/avatarService';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Link from 'next/link';
import Logo from './Logo';

// Updated nav links - removed About, added Features and Pricing
const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

export default function Layout({ children, title = 'Creatorino' }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  
  // Avatar state - moved directly into component
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  const [userInitials, setUserInitials] = useState('U');

  // Fetch session and profile when component mounts
  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      // Get current session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // If logged in, fetch profile
      if (data.session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        setProfile(profileData);
      }
      
      setLoading(false);
    };
    
    fetchSessionAndProfile();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Avatar handling - moved from AvatarContext
  useEffect(() => {
    if (!session?.user) return;

    // Calculate user initials as fallback
    const initials = getUserInitials(session.user);
    setUserInitials(initials);

    // First, try to get profile data directly to get the latest avatar
    const fetchProfileAvatar = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url, avatar_url_small')
          .eq('id', session.user.id)
          .single();

        // Use small avatar if available, otherwise use the regular one
        const avatarToUse = getAvatarUrl(profileData, true);
        
        if (avatarToUse) {
          setAvatarUrl(avatarToUse);
          // Cache the avatar for future use
          cacheAvatar(session.user.id, avatarToUse, true);
          
          // Preload image to see if it loads successfully
          preloadAvatar(avatarToUse)
            .then(() => {
              setIsAvatarLoaded(true);
            })
            .catch(() => {
              console.log('Failed to load avatar, falling back to initials');
              setIsAvatarLoaded(false);
            });
        } else {
          // No avatar URL found
          setIsAvatarLoaded(false);
        }
      } catch (error) {
        console.error('Error fetching profile avatar:', error);
        setIsAvatarLoaded(false);
      }
    };

    // Try to get avatar from localStorage cache while fetching from database
    const cached = getCachedAvatar(session.user.id, true);
    if (cached) {
      setAvatarUrl(cached);
      // Still preload to verify the cached URL is valid
      preloadAvatar(cached)
        .then(() => setIsAvatarLoaded(true))
        .catch(() => setIsAvatarLoaded(false));
    }
    
    // Always fetch the latest from the database
    fetchProfileAvatar();
  }, [session]);

  // Helper function to get user initials - moved from AvatarContext
  const getUserInitials = (user) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleCloseUserMenu();
    router.push('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Head>
        <title>{title} | Creatorino</title>
        <meta name="description" content="Creatorino platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Header */}
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid #E0E0E0' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            
            {/* Logo */}
            <Link href="/" passHref legacyBehavior>
              <Typography
                variant="h4"
                component="a"
                sx={{
                  mr: 2,
                  fontWeight: 900,
                  color: 'primary.main',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Logo />
              </Typography>
            </Link>
            
            {/* Right side section with nav links and user menu */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Navigation Links - Now displayed on the right */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} passHref legacyBehavior>
                    <Button
                      component="a"
                      sx={{
                        color: 'text.primary',
                        mx: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        },
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        height: '32px', // Reduced height
                        py: 0.5 // Reduced vertical padding
                      }}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
                
                {/* Dashboard Button - change to blue variant */}
                {session && (
                  <Link href="/dashboard" passHref legacyBehavior>
                    <Button
                      component="a"
                      color="primary"
                      variant="contained" // Add this to make it blue
                      sx={{
                        mx: 1,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 'medium',
                        borderRadius: '6px', // Match other buttons' styling
                        height: '32px', // Reduced height
                        py: 0.5 // Reduced vertical padding
                      }}
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
              </Box>
              
              {/* User Menu */}
              <Box sx={{ flexGrow: 0 }}>
                {session ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Box sx={{ position: 'relative', width: 48, height: 48 }}>
                          <Avatar 
                            src={avatarUrl}
                            alt={userInitials}
                            sx={{ 
                              width: 48, 
                              height: 48,
                              bgcolor: 'primary.main',
                              border: '2px solid',
                              borderColor: 'primary.light',
                              fontSize: '1.5rem',
                            }}
                            imgProps={{
                              onError: () => setIsAvatarLoaded(false)
                            }}
                          >
                            {!isAvatarLoaded && userInitials}
                          </Avatar>
                        </Box>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                      PaperProps={{
                        sx: {
                          width: '220px', // Make dropdown wider
                          padding: '8px 0' // Add some padding
                        }
                      }}
                    >
                      <MenuItem 
                        onClick={() => {
                          router.push('/profile');
                          handleCloseUserMenu();
                        }}
                        sx={{ 
                          py: 1.5, // Taller menu items
                          fontSize: '1rem' // Larger text
                        }}
                      >
                        <ListItemIcon>
                          <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Profile Editor</ListItemText>
                      </MenuItem>
                      <MenuItem 
                        onClick={() => {
                          router.push('/support');
                          handleCloseUserMenu();
                        }}
                        sx={{ 
                          py: 1.5, // Taller menu items 
                          fontSize: '1rem' // Larger text
                        }}
                      >
                        <ListItemIcon>
                          <HelpOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Support</ListItemText>
                      </MenuItem>
                      <Divider />
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{ 
                          py: 1.5, // Taller menu items
                          fontSize: '1rem', // Larger text
                          color: 'error.main'
                        }}
                      >
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link href="/login" passHref legacyBehavior>
                      <Button
                        component="a"
                        variant="outlined"
                        color="primary"
                        sx={{
                          mr: 2,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 'normal',
                          height: '34px', // Reduced height
                          py: 0.5 // Reduced vertical padding
                        }}
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" passHref legacyBehavior>
                      <Button
                        component="a"
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 'normal',
                          height: '34px', // Reduced height
                          py: 0.5 // Reduced vertical padding
                        }}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </Box>
                )}
              </Box>
            </Box>
            
            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {navLinks.map((link) => (
                  <MenuItem key={link.name} onClick={() => {
                    router.push(link.href);
                    handleCloseNavMenu();
                  }}>
                    <Typography textAlign="center">{link.name}</Typography>
                  </MenuItem>
                ))}
                {session && (
                  <MenuItem onClick={() => {
                    router.push('/dashboard');
                    handleCloseNavMenu();
                  }}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Creatorino. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}