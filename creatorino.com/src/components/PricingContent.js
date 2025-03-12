'use client';

import React, { useState } from 'react';
import Layout from './Layout';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Paper,
  Chip,
  Alert,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LanguageIcon from '@mui/icons-material/Language';
import Link from 'next/link';

export default function PricingContent() {
  const [annual, setAnnual] = useState(true);
  const theme = useTheme();

  const handleBillingChange = () => {
    setAnnual(!annual);
  };

  const paidPrice = annual ? 9 : 15;

  const pricingPlans = [
    {
      title: 'Free',
      price: 0,
      description: 'All features currently available in Beta',
      badge: 'Current Beta',
      features: [
        'Social links hub (like Linktree)',
        'Basic click analytics on links',
        'YouTube & Twitch growth overview',
        'Basic trend lines and view counts',
        '7-day data history',
        'Beta access to all upcoming features'
      ],
      buttonText: 'Sign Up Free',
      buttonVariant: 'outlined',
      highlighted: false
    },
    {
      title: 'Creator Pro',
      price: paidPrice,
      description: 'Enhanced features coming soon',
      badge: 'Coming Soon',
      features: [
        'Everything in Free tier',
        'Unlimited data history',
        'Advertiser-friendly analytics dashboard',
        'Growth notifications',
        'Marketer contact button',
        'In-depth platform analytics',
        'Priority support'
      ],
      buttonText: 'Join Waitlist',
      buttonVariant: 'contained',
      highlighted: true
    }
  ];

  const roadmapItems = [
    {
      phase: 'Current Beta',
      date: 'Now',
      features: [
        'Social links management',
        'Basic click analytics',
        'Platform stats overview',
        '7-day data history'
      ],
      active: true
    },
    {
      phase: 'Phase 1',
      date: 'Coming Soon',
      features: [
        'Creator Pro tier launch',
        'Unlimited data history',
        'Advertiser analytics dashboard',
        'Growth notifications'
      ],
      active: false
    },
    {
      phase: 'Phase 2',
      date: 'Future Release',
      features: [
        'Custom domains',
        'API access',
        'Content performance predictions',
        'Integration with more platforms'
      ],
      active: false
    },
    {
      phase: 'Phase 3',
      date: 'Future Release',
      features: [
        'Enterprise tier launch',
        'Team collaboration features',
        'White-label options',
        'Custom analytics dashboards'
      ],
      active: false
    }
  ];

  return (
    <Layout title="Pricing">
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          pt: 10,
          pb: 8,
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
          <Box textAlign="center" mb={5}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Simple Pricing
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
              All features are currently free during our beta. Paid plans will be available soon.
            </Typography>
            
            <Alert severity="info" sx={{ maxWidth: 800, mx: 'auto', mb: 5 }}>
              We're currently in beta! Everything is free while we develop and refine our platform. Join now to get early access to all features!
            </Alert>
            
            <Box display="flex" justifyContent="center" alignItems="center" mb={6}>
              <Typography variant="body1" mr={1}>Monthly</Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={annual} 
                    onChange={handleBillingChange} 
                    color="primary"
                  />
                }
                label=""
              />
              <Box display="flex" alignItems="center">
                <Typography variant="body1" mr={1}>Annual</Typography>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: 'success.light', 
                    color: 'success.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'medium'
                  }}
                >
                  Save 40%
                </Paper>
              </Box>
            </Box>

            <Grid container spacing={4} justifyContent="center">
              {pricingPlans.map((plan) => (
                <Grid item key={plan.title} xs={12} md={6}>
                  <Card
                    elevation={plan.highlighted ? 4 : 1}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 1,
                      position: 'relative',
                      border: plan.highlighted ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      bgcolor: plan.highlighted ? 'white' : '#f9f9f9',
                      '&:hover': {
                        transform: 'none',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 20, 
                        right: 20 
                      }}
                    >
                      <Chip 
                        label={plan.badge} 
                        color={plan.title === 'Free' ? "success" : "primary"} 
                        size="small" 
                      />
                    </Box>

                    <CardHeader
                      title={plan.title}
                      titleTypographyProps={{ align: 'center', variant: 'h4', fontWeight: 'bold' }}
                      sx={{ pb: 0 }}
                    />
                    <CardContent sx={{ 
                        flexGrow: 1, 
                        pt: 0, 
                        display: 'flex', 
                        flexDirection: 'column',
                        height: '100%'
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'baseline',
                          mb: 1
                        }}
                      >
                        <Typography component="h2" variant="h3" color="text.primary">
                          ${plan.price}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                          {plan.price > 0 ? annual ? '/mo billed annually' : '/month' : ''}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="subtitle1" 
                        align="center" 
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        {plan.description}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        Included Features:
                      </Typography>
                      <List sx={{ mb: 'auto' }}>
                        {plan.features.map((feature) => (
                          <ListItem key={feature} sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Box sx={{ mt: 'auto', pt: 3 }}>
                        <Link href={plan.title === 'Free' ? '/signup' : '/signup?waitlist=pro'} passHref>
                          <Button
                            fullWidth
                            variant={plan.buttonVariant}
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
                            <span className="truncate">{plan.buttonText}</span>
                          </Button>
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      
      {/* Feature Comparison Section */}
      <Box sx={{ bgcolor: theme.palette.grey[50], py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
            Feature Comparison
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            Compare our current free tier with upcoming premium features
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2 }}>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 800, p: 2 }}>
                    <Grid container sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 2 }}>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1" fontWeight="bold">Feature</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">Free Tier</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">Creator Pro</Typography>
                      </Grid>
                    </Grid>
                    
                    <FeatureRow 
                      icon={<LinkIcon />}
                      feature="Social Links Hub" 
                      free="Basic customization" 
                      pro="Advanced customization" 
                    />
                    
                    <FeatureRow 
                      icon={<BarChartIcon />}
                      feature="Link Click Analytics" 
                      free="Basic metrics" 
                      pro="Detailed metrics + Audience insights" 
                    />
                    
                    <FeatureRow 
                      icon={<ShowChartIcon />}
                      feature="YouTube & Twitch Stats" 
                      free="Overview dashboard" 
                      pro="Comprehensive analytics" 
                    />
                    
                    <FeatureRow 
                      icon={<BarChartIcon />}
                      feature="Data History" 
                      free="7 days" 
                      pro="Unlimited" 
                    />
                    
                    <FeatureRow 
                      icon={<GroupIcon />}
                      feature="Advertiser Dashboard" 
                      free="Not available" 
                      pro="Included" 
                      proHighlighted
                    />
                    
                    <FeatureRow 
                      icon={<NotificationsIcon />}
                      feature="Growth Notifications" 
                      free="Not available" 
                      pro="Included" 
                      proHighlighted
                    />
                    
                    <FeatureRow 
                      icon={<LanguageIcon />}
                      feature="Custom Domain" 
                      free="Coming in future update" 
                      pro="Coming in future update" 
                      comingSoon
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Roadmap Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
          Feature Release Schedule
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Our development roadmap and timeline for upcoming features
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Alert severity="info" sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
            Enterprise features including team access, custom domains, and API access are planned for future releases.
          </Alert>
        </Box>
        
        <Grid container spacing={4} justifyContent="center">
          {roadmapItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  border: item.active ? `2px solid ${theme.palette.success.main}` : '1px solid #e0e0e0',
                  bgcolor: item.active ? 'white' : '#f9f9f9'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2 
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {item.phase}
                    </Typography>
                    {item.active && (
                      <Chip 
                        label="Active" 
                        color="success" 
                        size="small" 
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.date}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List sx={{ py: 0 }}>
                    {item.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon 
                            fontSize="small" 
                            color={item.active ? "success" : "action"} 
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            color: item.active ? 'text.primary' : 'text.secondary' 
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* FAQ Section */}
      <Box sx={{ bgcolor: theme.palette.grey[50], py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom fontWeight="bold" align="center" sx={{ mb: 1 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6 }}>
            Still have questions? 
            <Link href="/contact" passHref style={{ marginLeft: '8px' }}>
              <Button 
                color="primary"
                className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-3 py-1 h-[32px]"
                sx={{ 
                  borderColor: 'primary.500',
                  '&:hover': {
                    borderColor: 'primary.600',
                  },
                  textTransform: 'none',
                  fontWeight: 'normal'
                }}
              >
                <span className="truncate">Contact us</span>
              </Button>
            </Link>
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  When will the paid tier be available?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We're currently in beta, and all features are available for free. We plan to launch our paid Creator Pro tier in Q2 2025. Everyone who signs up during the beta will receive special early adopter benefits.
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Will I lose features when the paid tier launches?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No, we won't take away features you're already using. Beta users will keep access to core functionality. Some advanced features and extended data history will move to the paid tier, but we'll provide plenty of notice before any changes.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  What payment methods will you accept?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  When our paid tier launches, we'll accept all major credit cards including Visa, Mastercard, American Express, and Discover. We'll also support payments via PayPal.
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Will there be any discounts for creators?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Yes! We'll offer special discounts for early beta users, students, and small creators just starting out. Join our waitlist to be notified about these opportunities.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}

// Helper component for feature comparison rows
function FeatureRow({ icon, feature, free, pro, proHighlighted = false, comingSoon = false }) {
  const theme = useTheme();
  
  return (
    <Grid container sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}` }} alignItems="center">
      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ color: theme.palette.primary.main, mr: 1 }}>
          {icon}
        </Box>
        <Typography variant="body1">
          {feature}
          {comingSoon && (
            <Chip 
              label="Coming Soon" 
              size="small" 
              variant="outlined"
              sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
            />
          )}
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {free}
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          color={proHighlighted ? "primary.main" : "text.secondary"}
          fontWeight={proHighlighted ? "medium" : "normal"}
        >
          {pro}
        </Typography>
      </Grid>
    </Grid>
  );
}