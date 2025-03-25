// components/Layout.js
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Container, Toolbar, Typography, Button, Tooltip, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
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
            <Link href="/" passHref>
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
                  <Link key={link.name} href={link.href} passHref>
                    <Button
                      sx={{
                        color: 'text.primary',
                        mx: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        },
                        textTransform: 'none',
                        fontSize: '0.95rem'
                      }}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
                
                {/* Dashboard Button - now styled like the other menu items for consistency */}
                {session && (
                  <Link href="/dashboard" passHref>
                    <Button
                      color="primary"
                      sx={{
                        mx: 1,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 'medium'
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
                        {profile?.avatar_url ? (
                          <Avatar 
                            src={profile.avatar_url} 
                            alt={profile.first_name || session.user.email}
                            sx={{ 
                              width: 48, 
                              height: 48,
                              border: '2px solid',
                              borderColor: 'primary.light',
                            }}
                          />
                        ) : (
                          <Avatar 
                            sx={{ 
                              width: 48, 
                              height: 48, 
                              bgcolor: 'primary.main',
                              border: '2px solid',
                              borderColor: 'primary.light',
                              fontSize: '1.5rem'
                            }}
                          >
                            {(profile?.first_name?.charAt(0) || session?.user?.email?.charAt(0) || 'U').toUpperCase()}
                          </Avatar>
                        )}
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
                        <ListItemText>Settings</ListItemText>
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
                    <Link href="/login" passHref>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                          mr: 2,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 'normal'
                        }}
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" passHref>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 'normal'
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