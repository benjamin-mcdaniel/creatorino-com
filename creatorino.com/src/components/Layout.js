// components/Layout.js
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  useMediaQuery,
  Divider,
  Avatar
} from '@mui/material';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeaturesIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import useAuth from '../lib/useAuth';

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, loading } = useAuth ? useAuth() : { user: null, loading: false };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, href: '/' },
    { text: 'Features', icon: <FeaturesIcon />, href: '/features' },
    { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ mr: 2 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography
                variant="h6"
                component={Link}
                href="/"
                sx={{
                  fontWeight: 700,
                  textDecoration: 'none',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Creatorino
              </Typography>
            </Box>

            {/* Desktop navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Link key={item.text} href={item.href} passHref>
                    <Button
                      startIcon={item.icon}
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {item.text}
                    </Button>
                  </Link>
                ))}
              </Box>
            )}

            {/* Auth buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!loading && !user ? (
                <>
                  <Link href="/login" passHref>
                    <Button variant="outlined" color="primary">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" passHref>
                    <Button variant="contained" color="primary">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                !loading && user && (
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    {user.email?.charAt(0).toUpperCase()}
                  </Avatar>
                )
              )}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 1, fontWeight: 700 }}>
              Creatorino
            </Typography>
            {!loading && user && (
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  {user.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" noWrap>
                  {user.email}
                </Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <Link key={item.text} href={item.href} passHref>
                <ListItem button onClick={toggleDrawer}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
            {!loading && !user && (
              <>
                <Divider sx={{ my: 1 }} />
                <Link href="/login" passHref>
                  <ListItem button onClick={toggleDrawer}>
                    <ListItemIcon><LoginIcon /></ListItemIcon>
                    <ListItemText primary="Login / Sign Up" />
                  </ListItem>
                </Link>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          mt: 'auto',
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Creatorino. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="/terms" passHref>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Terms
                </Typography>
              </Link>
              <Link href="/privacy" passHref>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Privacy
                </Typography>
              </Link>
              <Link href="/contact" passHref>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Contact
                </Typography>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}