// src/pages/features.js
import Layout from '../components/Layout';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

export default function FeaturesPage() {
  return (
    <Layout>
      {/* Hero Section for Features */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #121212, #1e1e1e)',
          color: '#ffffff',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Beta Features
        </Typography>
        <Typography variant="h6" gutterBottom>
          A preview of our tools for streamers and content creators.
        </Typography>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Available Tools
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          In this beta release, you can use these features. More improvements and new tools are coming soon.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h5" gutterBottom>
                YouTube Analytics
              </Typography>
              <Typography variant="body2">
                Monitor your channel's performance with real-time insights.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Twitch Tracking
              </Typography>
              <Typography variant="body2">
                Keep track of your stream metrics and viewer engagement.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Social Links
              </Typography>
              <Typography variant="body2">
                Manage all your social profiles in one place.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Future Enhancements Section */}
      <Box sx={{ backgroundColor: 'background.default', py: 6 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            What's Next
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            We're working on additional features and enhancements including advanced analytics and new integrations. Stay tuned for updates.
          </Typography>
        </Container>
      </Box>
    </Layout>
  );
}
