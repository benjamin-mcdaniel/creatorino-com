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
  ListItemText
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShareIcon from '@mui/icons-material/Share';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DevicesIcon from '@mui/icons-material/Devices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import LanguageIcon from '@mui/icons-material/Language';
import CodeIcon from '@mui/icons-material/Code';
import LockIcon from '@mui/icons-material/Lock';

export default function FeaturesContent() {
  const theme = useTheme();

  const coreFeatures = [
    {
      title: "YouTube Analytics",
      description: "Get comprehensive insights into your YouTube performance with metrics on views, watch time, subscriber growth, and audience demographics.",
      icon: <YouTubeIcon fontSize="large" />,
      color: "#FF0000" // YouTube red
    },
    {
      title: "Twitch Integration",
      description: "Track stream metrics, viewer engagement, and subscription growth. Analyze your most successful streams and peak viewing times.",
      icon: <SportsEsportsIcon fontSize="large" />,
      color: "#9146FF" // Twitch purple
    },
    {
      title: "Creator Hub",
      description: "A single dashboard to manage all your content, track cross-platform metrics, and create a beautiful landing page with your social links.",
      icon: <ShareIcon fontSize="large" />,
      color: theme.palette.primary.main
    }
  ];

  const platformFeatures = [
    {
      title: "Real-time Analytics",
      description: "Track performance across platforms with up-to-date metrics and customizable dashboards.",
      icon: <BarChartIcon />
    },
    {
      title: "Performance Tracking",
      description: "Measure your growth and benchmark against similar creators in your niche.",
      icon: <SpeedIcon />
    },
    {
      title: "Audience Insights",
      description: "Understand who your viewers are and what content resonates with them the most.",
      icon: <PeopleIcon />
    },
    {
      title: "Custom Website",
      description: "Create a professional landing page that showcases your content and connects all your platforms.",
      icon: <LanguageIcon />
    },
    {
      title: "API Access",
      description: "Connect your own tools or extend functionality with our developer-friendly API.",
      icon: <CodeIcon />
    },
    {
      title: "Data Security",
      description: "Enterprise-grade security ensures your analytics and account information stays protected.",
      icon: <LockIcon />
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
              Platform Features
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 5, maxWidth: 700, mx: 'auto' }}>
              All the tools you need to know what is working and what isnt
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Container sx={{ py: 8 }}>
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
                  '&:hover': {
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
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

      {/* Platform Features Grid */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container>
          <Typography variant="h3" gutterBottom align="center" fontWeight="bold" sx={{ mb: 5 }}>
            Platform Capabilities
          </Typography>
          
          <Grid container spacing={4}>
            {platformFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'white',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Box>
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
      </Box>

      

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
                  How do I connect my YouTube channel?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  After signing up, you'll be guided through a simple authorization process to connect your YouTube account. This requires you to be signed in to YouTube and grant the necessary permissions.
                </Typography>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Can I analyze multiple channels at once?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes, Pro and Enterprise plans allow you to connect and analyze multiple channels across different platforms in a single dashboard.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Is my data secure?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absolutely. We use industry-standard encryption and never share your personal data with third parties without your explicit consent. Your analytics data is stored securely and can only be accessed by you.
                </Typography>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  How often is the data updated?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Free accounts receive data updates every 24 hours, while Pro and Enterprise accounts get more frequent updates every 6 hours, giving you near real-time insights on your performance.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}