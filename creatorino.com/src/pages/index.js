// src/pages/index.js
import Layout from '../components/Layout';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 10,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #121212, #1e1e1e)',
          color: '#ffffff',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to Creatorino Beta
        </Typography>
        <Typography variant="h6" gutterBottom>
          A simple tool to manage your social links and track your growth on YouTube and Twitch.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Link href="/signup" passHref>
            <Button variant="contained" size="large" color="secondary">
              Get Started
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          What We Offer
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          In this beta, you can easily manage your social links and see basic analytics from YouTube and Twitch.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                textAlign: 'center',
                height: '100%',
              }}
              elevation={3}
            >
              <Typography variant="h6" gutterBottom>
                Social Links
              </Typography>
              <Typography variant="body2">
                Connect all your social media in one place.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                textAlign: 'center',
                height: '100%',
              }}
              elevation={3}
            >
              <Typography variant="h6" gutterBottom>
                YouTube Tracking
              </Typography>
              <Typography variant="body2">
                Monitor your channel growth and performance.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                textAlign: 'center',
                height: '100%',
              }}
              elevation={3}
            >
              <Typography variant="h6" gutterBottom>
                Twitch Analytics
              </Typography>
              <Typography variant="body2">
                See how your streams are doing and track engagement.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Release Schedule Section */}
      <Box sx={{ backgroundColor: 'background.default', py: 6 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Upcoming Releases
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            We're continuously working on new features. Look forward to improved analytics, more integrations, and a better overall experience in the coming months.
          </Typography>
        </Container>
      </Box>

      {/* Call-to-Action Section */}
      <Box sx={{ backgroundColor: 'background.paper', py: 6, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Join Our Beta
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your feedback helps us improve. Sign up now and be part of our beta program.
          </Typography>
          <Link href="/signup" passHref>
            <Button variant="contained" size="large" color="secondary">
              Sign Up for Beta
            </Button>
          </Link>
        </Container>
      </Box>
    </Layout>
  );
}
