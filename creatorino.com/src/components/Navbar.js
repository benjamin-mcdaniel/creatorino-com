// src/components/Navbar.js
import { AppBar, Toolbar, Typography, Button, Box, useTheme } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  const theme = useTheme();

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Left side: Site name */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: theme.palette.primary.contrastText,
                mr: 2,
              }}
            >
              Creatorino.com
            </Typography>
          </Box>

          {/* Right side: Features and Dashboard buttons with proper spacing */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/features" passHref>
              <Button
                variant="outlined"
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.secondary.main,
                  '&:hover': {
                    borderColor: theme.palette.secondary.dark,
                    color: theme.palette.secondary.dark,
                  },
                }}
              >
                Features
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button
                variant="outlined"
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.secondary.main,
                  '&:hover': {
                    borderColor: theme.palette.secondary.dark,
                    color: theme.palette.secondary.dark,
                  },
                }}
              >
                Dashboard
              </Button>
            </Link>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
