// src/pages/index.js
import Layout from '../components/Layout';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Stack, useTheme, Divider } from '@mui/material';
import Link from 'next/link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShareIcon from '@mui/icons-material/Share';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function LandingPage() {
  const theme = useTheme();
  
  const features = [
    {
      title: "YouTube Analytics",
      description: "Track your channel growth, video performance, and audience engagement all in one place.",
      icon: <YouTubeIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
    },
    {
      title: "Twitch Tracking",
      description: "Monitor your stream metrics, viewer retention, and follower growth with real-time insights.",
      icon: <SportsEsportsIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
    },
    {
      title: "Social Links",
      description: "Create a customized landing page with all your social profiles to share with your audience.",
      icon: <ShareIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 10, md: 16 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: '#ffffff',
        }}
      >
        {/* Abstract shape decoration */}
        <Box sx={{
          position: 'absolute',
          top: '-5%',
          right: '-5%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0,
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 0,
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
                  Grow Your Content Creator Career
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}>
                  A simple tool to manage your social links and track your growth on YouTube and Twitch.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Link href="/signup" passHref>
                    <Button 
                      variant="contained" 
                      size="large" 
                      color="secondary"
                      endIcon={<ChevronRightIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    sx={{
                      px: 4,
                      py: 1.5,
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  p: 2,
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                }}
              >
                {/* This would be replaced with an actual image or dashboard preview */}
                <Box sx={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}>
                  Dashboard Preview
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" gutterBottom>
            What We Offer
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            In this beta, you can easily manage your social links and see detailed analytics from YouTube and Twitch.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.default', py: 10 }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                  10K+
                </Typography>
                <Typography variant="h6">
                  Content Creators
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                  5M+
                </Typography>
                <Typography variant="h6">
                  Data Points Analyzed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                  99%
                </Typography>
                <Typography variant="h6">
                  Satisfaction Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Release Schedule Section */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Upcoming Releases
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              We're continuously working on new features to help you grow your online presence.
            </Typography>
            
            <Stack spacing={3} sx={{ mt: 4 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Advanced Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Deeper insights into your audience demographics and engagement patterns.
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Cross-Platform Integrations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect with Instagram, TikTok, and other platforms to get a complete view.
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Monetization Tools
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New ways to track and optimize your revenue streams across platforms.
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 500,
                height: 350,
                bgcolor: theme.palette.background.paper,
                borderRadius: 4,
                p: 0,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* This would be replaced with an actual product roadmap image */}
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: theme.palette.text.secondary,
              }}>
                Product Roadmap Preview
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Call-to-Action Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.secondary.main, 
          py: 10, 
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Abstract shape decoration */}
        <Box sx={{
          position: 'absolute',
          top: '20%',
          right: '-5%',
          width: '20%',
          height: '40%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0,
        }} />
        
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Join Our Beta
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 400 }}>
              Your feedback helps us improve. Sign up now and be part of our growing community of content creators.
            </Typography>
            <Link href="/signup" passHref>
              <Button 
                variant="contained" 
                size="large" 
                sx={{
                  px: 6,
                  py: 1.5,
                  bgcolor: 'white',
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                Sign Up for Beta
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}