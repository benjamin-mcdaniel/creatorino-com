// src/pages/features.js
import Layout from '../components/Layout';
import { Container, Typography, Box, Grid, Card, CardContent, Stack, useTheme, Divider, Avatar } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShareIcon from '@mui/icons-material/Share';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DevicesIcon from '@mui/icons-material/Devices';

export default function FeaturesPage() {
  const theme = useTheme();

  const coreFeatures = [
    {
      title: "YouTube Analytics",
      description: "Monitor your channel's performance with real-time insights on views, watch time, and subscriber growth.",
      icon: <YouTubeIcon />,
      color: "#FF0000" // YouTube red
    },
    {
      title: "Twitch Tracking",
      description: "Keep track of your stream metrics, viewer engagement, and subscription growth over time.",
      icon: <SportsEsportsIcon />,
      color: "#9146FF" // Twitch purple
    },
    {
      title: "Social Links",
      description: "Create a beautiful landing page with all your social profiles in one place for your audience.",
      icon: <ShareIcon />,
      color: theme.palette.primary.main
    }
  ];

  const upcomingFeatures = [
    {
      title: "Content Performance",
      description: "Compare performance metrics across different types of content to identify what resonates with your audience.",
      icon: <InsightsIcon />,
    },
    {
      title: "Growth Insights",
      description: "Get personalized recommendations to grow your audience and increase engagement.",
      icon: <TrendingUpIcon />,
    },
    {
      title: "Multi-platform Dashboard",
      description: "Manage all your content platforms from a single, unified dashboard with cross-platform insights.",
      icon: <DevicesIcon />,
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Abstract shapes for visual interest */}
        <Box sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '30%',
          height: '50%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }} />
        <Box sx={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          width: '20%',
          height: '30%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Beta Features
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
              Tools designed specifically for streamers and content creators to grow their audience
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Current Features Section */}
      <Container sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" gutterBottom>
            Available Tools
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            In this beta release, you can use these features. We're constantly adding improvements based on your feedback.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {coreFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar 
                    sx={{ 
                      mb: 2, 
                      bgcolor: 'transparent',
                      color: feature.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
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

      {/* How It Works Section */}
      <Box sx={{ bgcolor: theme.palette.background.default, py: 10 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" gutterBottom>
              How It Works
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Getting started with Creatorino is simple and takes just a few minutes
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  1
                </Box>
                <Typography variant="h5" gutterBottom>
                  Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                // src/pages/features.js (continued)
                  Sign up for a free Creatorino account and complete your profile with basic information.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  2
                </Box>
                <Typography variant="h5" gutterBottom>
                  Connect Platforms
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Link your YouTube and Twitch accounts to start tracking performance metrics.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  3
                </Box>
                <Typography variant="h5" gutterBottom>
                  Access Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your dashboard with real-time analytics and start growing your audience.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Future Features Section */}
      <Container sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" gutterBottom>
            What's Next
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            We're working on these exciting features for future releases
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {upcomingFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box 
                    sx={{ 
                      mb: 2,
                      color: theme.palette.text.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'background.default',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="medium">
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

      {/* Testimonials/Feedback Section */}
      <Box sx={{ bgcolor: theme.palette.background.default, py: 10 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" gutterBottom>
              Creator Feedback
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              What our beta testers are saying
            </Typography>
          </Box>

          <Card sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80,
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                TC
              </Avatar>
              <Box>
                <Typography variant="h5" gutterBottom>
                  "Creatorino has helped me understand my audience better"
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  The analytics tools have been invaluable for planning my content strategy. I can now see which videos perform best and why, allowing me to focus my efforts more effectively.
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  Taylor Chen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tech Reviewer, 250K subscribers
                </Typography>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
          Have questions? We've got answers.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                Is Creatorino free to use?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Yes, during the beta phase all features are completely free. We'll introduce premium plans later but will always maintain a generous free tier.
              </Typography>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                How do I connect my YouTube channel?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                After signing up, you'll be guided through a simple authorization process to connect your YouTube account. This requires you to be signed in to YouTube.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                Is my data secure?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Absolutely. We use industry-standard encryption and never share your personal data with third parties without your explicit consent.
              </Typography>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                How often is the data updated?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Analytics data is refreshed every 24 hours, giving you a daily overview of your performance metrics across platforms.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}