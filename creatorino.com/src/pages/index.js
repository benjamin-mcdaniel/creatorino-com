// src/pages/index.js
import Layout from '../components/Layout';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
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
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Creatorino
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your all-in-one platform for building and scaling your SaaS product.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Link href="/signup" passHref>
            <Button variant="contained" size="large">
              Get Started
            </Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="outlined" size="large" sx={{ ml: 2 }}>
              Log In
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Feature One
              </Typography>
              <Typography>
                Detailed explanation of feature one that highlights benefits.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Feature Two
              </Typography>
              <Typography>
                Detailed explanation of feature two and how it improves your workflow.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Feature Three
              </Typography>
              <Typography>
                Detailed explanation of feature three and why it’s indispensable.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
