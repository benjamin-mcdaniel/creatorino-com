// components/Navbar.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [userInitial, setUserInitial] = useState('');

  useEffect(() => {
    // Get current session
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        const email = data.session.user.email;
        if (email) {
          setUserInitial(email.charAt(0).toUpperCase());
        }
      }
      
      setLoading(false);
    };

    fetchSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          const email = session.user.email;
          if (email) {
            setUserInitial(email.charAt(0).toUpperCase());
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleProfileMenuClose();
    router.push('/');
  };

  const navigationItems = [
    { title: 'Features', href: '/features' },
    { title: 'Pricing', href: '/pricing' },
  ];

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ py: 1 }}>
        {/* Logo on the left */}
        <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 2 }}>
            Creatorino
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop navigation */}
        {!isMobile && (
          <>
            {/* Light navigation links */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.title}
                  color="inherit"
                  component={Link}
                  href={item.href}
                  sx={{ 
                    mx: 1, 
                    fontWeight: 'normal',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>

            {/* Dashboard button with accent color */}
            {session ? (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/dashboard"
                sx={{ mr: 2, borderRadius: 2 }}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                href="/login"
                sx={{ mr: 2, borderRadius: 2 }}
              >
                Sign In
              </Button>
            )}

            {/* Profile avatar button */}
            {session && (
              <>
                <IconButton 
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ 
                    border: '2px solid', 
                    borderColor: 'primary.light',
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                    {userInitial}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem component={Link} href="/profile" onClick={handleProfileMenuClose}>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </>
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <>
            <IconButton 
              edge="end" 
              color="inherit" 
              aria-label="menu"
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={handleMobileMenuToggle}
              sx={{ '& .MuiDrawer-paper': { width: '70%', maxWidth: 300 } }}
            >
              <Box p={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Creatorino
                </Typography>
              </Box>
              <Divider />
              <List>
                {navigationItems.map((item) => (
                  <ListItem 
                    button 
                    key={item.title} 
                    component={Link} 
                    href={item.href}
                    onClick={handleMobileMenuToggle}
                  >
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))}
                <ListItem 
                  button 
                  component={Link} 
                  href="/dashboard"
                  onClick={handleMobileMenuToggle}
                  sx={{ color: 'primary.main', fontWeight: 'medium' }}
                >
                  <ListItemText primary="Dashboard" />
                </ListItem>
                {session && (
                  <>
                    <Divider />
                    <ListItem 
                      button 
                      component={Link} 
                      href="/profile"
                      onClick={handleMobileMenuToggle}
                    >
                      <ListItemText primary="My Profile" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </>
                )}
                {!session && (
                  <ListItem 
                    button 
                    component={Link} 
                    href="/login"
                    onClick={handleMobileMenuToggle}
                  >
                    <ListItemText primary="Sign In" />
                  </ListItem>
                )}
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}