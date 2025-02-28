'use client';

import React from 'react';
import Layout from '../components/Layout';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Stack, useTheme, Divider, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShareIcon from '@mui/icons-material/Share';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function LandingContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Image URLs with Picsum IDs
  const imageUrls = {
    heroImage: "https://picsum.photos/id/96/600/400", // Main hero image
    statsImage: "https://picsum.photos/id/42/600/300", // Stats section image
    dashboardImage: "https://picsum.photos/id/63/600/400", // Dashboard preview image
    communityImage: "https://picsum.photos/id/87/600/300", // Community section image
  };
  
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
                  <Link href="/features" passHref>
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
                  </Link>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Streamer setup image */}
                <img 
                  src={imageUrls.heroImage}
                  alt="Streamer Setup"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 3,
                  }}
                >
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    Track Your Growth
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Powerful analytics for content creators
                  </Typography>
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
                elevation={1}
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                  bgcolor: '#f9f9f9',
                  '&:hover': {
                    transform: 'none',
                    boxShadow: 'none'
                  }
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

      {/* Stats Section with Stream Graphics */}
      <Box sx={{ bgcolor: 'background.default', py: 10, position: 'relative' }}>
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[3],
                  height: 300,
                  position: 'relative',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <img 
                  src={imageUrls.statsImage}
                  alt="Stream Overlay Stats"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Backed by Data
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Our platform is used by streamers and content creators who trust us with their analytics.
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                      10K+
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Content Creators
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                      5M+
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Data Points Analyzed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                      99%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Satisfaction Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Release Schedule Section with Stream Dashboard */}
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
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: 400,
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: theme.shadows[3],
                position: 'relative',
              }}
            >
              {/* Dashboard/streaming setup image */}
              <img 
                src={imageUrls.dashboardImage}
                alt="Streaming Dashboard"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  p: 3,
                }}
              >
                <Typography variant="h4" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
                  Preview Coming Soon
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
                  Our new dashboard is in development and will be available in the next update.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Call-to-Action Section with Streamer Community */}
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: 300,
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <img 
                  src={imageUrls.communityImage}
                  alt="Streamer Community"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
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
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}