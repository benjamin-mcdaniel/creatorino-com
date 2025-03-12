'use client';

import React from 'react';
import Layout from './Layout';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  useTheme, 
  Divider, 
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import Link from 'next/link';

export default function FeaturesContent() {
  const theme = useTheme();

  const coreFeatures = [
    {
      title: "Social Link Hub",
      description: "Create a customized page with all your social links in one place, similar to Linktree but integrated with your analytics.",
      icon: <ShareIcon fontSize="large" />,
      color: theme.palette.primary.main,
      badge: "Beta Available"
    },
    {
      title: "YouTube & Twitch Analytics",
      description: "Track your growth trends, view counts, and engagement metrics across your content creation platforms.",
      icon: <YouTubeIcon fontSize="large" />,
      color: "#FF0000", // YouTube red
      badge: "Beta Available"
    },
    {
      title: "Click Analytics",
      description: "See which links your audience clicks most and understand how they navigate to your content.",
      icon: <TouchAppIcon fontSize="large" />,
      color: theme.palette.secondary.main,
      badge: "Beta Available"
    }
  ];

  const tierFeatures = [
    {
      title: "Free Tier",
      features: [
        "Social links management",
        "Basic click analytics",
        "YouTube & Twitch growth overview",
        "Basic trend lines and view counts",
        "7-day data history"
      ],
      isPro: false
    },
    {
      title: "Pro Tier (Coming Soon)",
      features: [
        "Unlimited data history",
        "Advertiser-friendly analytics dashboard",
        "Growth notifications",
        "Marketer contact button",
        "In-depth platform analytics",
        "Priority support"
      ],
      isPro: true
    }
  ];

  const advancedFeatures = [
    {
      title: "Advertiser Dashboard",
      description: "Share customized analytics with potential sponsors to showcase your audience and growth.",
      icon: <BusinessIcon />,
      isPro: true
    },
    {
      title: "Growth Trends",
      description: "View detailed trends of your YouTube and Twitch channels to understand what's working.",
      icon: <TrendingUpIcon />,
      isPro: false
    },
    {
      title: "Data History",
      description: "Free: 7-day history / Pro: Unlimited historical data to track long-term growth.",
      icon: <AccessTimeIcon />,
      isPro: true
    },
    {
      title: "Growth Notifications",
      description: "Get notified when your channels hit milestones or experience unusual growth spikes.",
      icon: <NotificationsIcon />,
      isPro: true
    },
    {
      title: "Platform Analytics",
      description: "Track performance metrics that matter most for content creators.",
      icon: <AssessmentIcon />,
      isPro: false
    },
    {
      title: "Click-through Rates",
      description: "Understand which links drive the most traffic to your content.",
      icon: <BarChartIcon />,
      isPro: false
    }
  ];

  return (
    <Layout title="Features">
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          pt: 10,
          pb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            opacity: 0.1,
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'secondary.light',
            opacity: 0.1,
            zIndex: 0
          }} 
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Creator Analytics Tools
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 5, maxWidth: 700, mx: 'auto' }}>
              Track what's working, grow your audience, and showcase your value to sponsors
            </Typography>
            <Link href="/signup" passHref>
              <Button 
                variant="contained" 
                color="primary" 
                className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-4 py-2 h-[38px]"
                sx={{ 
                  borderColor: 'primary.500',
                  '&:hover': {
                    borderColor: 'primary.600',
                  },
                  textTransform: 'none',
                  fontWeight: 'normal'
                }}
              >
                <span className="truncate">Get Started Free</span>
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" fontWeight="bold" gutterBottom sx={{ mb: 5 }}>
          Core Features
        </Typography>
        
        <Grid container spacing={5}>
          {coreFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={1}
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                  bgcolor: '#f9f9f9',
                  position: 'relative',
                  '&:hover': {
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                  }}
                >
                  <Chip 
                    label={feature.badge} 
                    color="success" 
                    size="small" 
                    variant="filled"
                  />
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      mb: 3,
                      color: feature.color,
                      display: 'flex'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
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

      {/* Feature Comparison Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container>
          <Typography variant="h3" gutterBottom align="center" fontWeight="bold" sx={{ mb: 5 }}>
            Features By Tier
          </Typography>
          
          <Grid container spacing={4}>
            {tierFeatures.map((tier, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  elevation={tier.isPro ? 4 : 1}
                  sx={{ 
                    height: '100%', 
                    borderRadius: 3,
                    border: tier.isPro ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                    bgcolor: tier.isPro ? 'white' : '#f9f9f9'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                      {tier.title}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <List>
                      {tier.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ py: 1, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon 
                              color={tier.isPro ? "primary" : "success"} 
                              fontSize="small" 
                            />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Link href={tier.isPro ? "/signup?waitlist=pro" : "/signup"} passHref>
                        <Button
                          variant={tier.isPro ? "outlined" : "contained"}
                          color="primary"
                          className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-4 py-2 h-[38px]"
                          sx={{ 
                            borderColor: 'primary.500',
                            '&:hover': {
                              borderColor: 'primary.600',
                            },
                            textTransform: 'none',
                            fontWeight: 'normal'
                          }}
                        >
                          <span className="truncate">{tier.isPro ? "Join Waitlist" : "Get Started Free"}</span>
                        </Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Detailed Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom align="center" fontWeight="bold" sx={{ mb: 5 }}>
          Details At A Glance
        </Typography>
        
        <Grid container spacing={4}>
          {advancedFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 2,
                height: '100%',
                position: 'relative',
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: feature.isPro ? 'rgba(25, 118, 210, 0.04)' : 'transparent'
              }}>
                {feature.isPro && (
                  <Chip 
                    label="Pro Feature" 
                    color="primary" 
                    size="small" 
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  />
                )}
                <Avatar
                  sx={{
                    bgcolor: feature.isPro ? 'primary.main' : 'success.main',
                    color: 'white',
                    width: 40,
                    height: 40,
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Box sx={{ pt: feature.isPro ? 1 : 0 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container>
          <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold" sx={{ mb: 5 }}>
            Frequently Asked Questions
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  When will the Pro tier be available?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We're currently in beta with all features freely available. The Pro tier will be launching soon. Join our waitlist to get early access and special pricing.
                </Typography>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  How do I connect my YouTube and Twitch accounts?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  After signing up, you'll be guided through a simple authorization process for each platform. This requires you to be signed in to your accounts and grant the necessary permissions.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Will I lose features when the Free/Pro tiers launch?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No, we won't take away features you're already using. Beta users will continue to have access to core functionality. Some advanced features and data beyond 7 days will move to the Pro tier, but you'll have plenty of notice.
                </Typography>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  How often is the data updated?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  During beta, all accounts receive data updates every 24 hours. When we launch the Pro tier, those accounts will get more frequent updates to provide near real-time insights on your performance.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Link href="/signup" passHref>
              <Button 
                variant="contained" 
                color="primary" 
                className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-4 py-2 h-[38px]"
                sx={{ 
                  borderColor: 'primary.500',
                  '&:hover': {
                    borderColor: 'primary.600',
                  },
                  textTransform: 'none',
                  fontWeight: 'normal'
                }}
              >
                <span className="truncate">Get Started Free</span>
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}