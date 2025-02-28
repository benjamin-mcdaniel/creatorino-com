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
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

export default function PricingContent() {
  const [annual, setAnnual] = useState(true);
  const theme = useTheme();

  const handleBillingChange = () => {
    setAnnual(!annual);
  };

  const pricingPlans = [
    {
      title: 'Free',
      price: 0,
      description: 'Perfect for hobbyists and beginners',
      features: [
        'Up to 5 projects',
        'Basic analytics',
        'Community support',
        '1GB storage',
        'Single user'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined',
      highlighted: false
    },
    {
      title: 'Solo',
      price: annual ? 19 : 25,
      description: 'Great for professionals and small teams',
      features: [
        'Unlimited projects',
        'Advanced analytics',
        'Priority support',
        '10GB storage',
        'Up to 5 team members',
        'Custom domains',
        'No Creatorino branding'
      ],
      buttonText: 'Subscribe Now',
      buttonVariant: 'contained',
      highlighted: true
    },
    {
      title: 'Creator + Admins',
      price: annual ? 99 : 129,
      description: 'For businesses with advanced needs',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Dedicated account manager',
        '100GB storage',
        'Single sign-on (SSO)',
        'Custom integrations',
        'SLA guarantees',
        'Advanced security features'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outlined',
      highlighted: false
    }
  ];

  return (
    <Layout title="Pricing">
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          pt: 10,
          pb: 12,
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
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Simple Pricing
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 5, maxWidth: 700, mx: 'auto' }}>
              Choose the plan that's right for you. No hidden fees. Cancel anytime.
            </Typography>
            
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
                  Save 25%
                </Paper>
              </Box>
            </Box>

            <Grid container spacing={4} justifyContent="center">
              {pricingPlans.map((plan) => (
                <Grid item key={plan.title} xs={12} sm={6} md={4}>
                  <Card
                    elevation={plan.highlighted ? 4 : 1}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      position: 'relative',
                      border: plan.highlighted ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      bgcolor: plan.highlighted ? 'white' : '#f9f9f9',
                      '&:hover': {
                        transform: 'none',
                        boxShadow: 'none'
                      }
                    }}
                  >

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
                      }}>
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
                          {plan.price > 0 ? annual ? '/year' : '/month' : ''}
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
                        <Button
                          fullWidth
                          variant={plan.buttonVariant}
                          color="primary"
                          component={Link}
                          href={plan.title === 'Free' ? '/signup' : '/contact'}
                          sx={{ 
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'medium'
                          }}
                        >
                          {plan.buttonText}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* FAQ Section */}
          <Box mt={12} textAlign="center">
            <Typography variant="h4" gutterBottom fontWeight="bold" mb={1}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={6}>
              Still have questions? <Link href="/contact" passHref><Button color="primary">Contact us</Button></Link>
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box textAlign="left" mb={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Can I change plans later?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated amount for the remainder of your billing cycle. If you downgrade, you'll receive credit toward your next billing cycle.
                  </Typography>
                </Box>
                <Box textAlign="left" mb={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    What payment methods do you accept?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support payments via PayPal.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box textAlign="left" mb={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Is there a free trial?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Yes, you can try any paid plan free for 14 days. No credit card required. You can upgrade to a paid plan at any time during or after your trial.
                  </Typography>
                </Box>
                <Box textAlign="left" mb={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    What happens when I hit storage limits?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    You'll receive a notification when you reach 80% of your storage limit. If you exceed your limit, you'll need to upgrade to a higher plan or remove content to continue uploading new files.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}