'use client';

import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { supabase } from '../lib/supabaseClient';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Alert,
  Paper,
  Divider,
  useTheme,
  CircularProgress
} from '@mui/material';
import Link from 'next/link';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import HelpIcon from '@mui/icons-material/Help';
import SupportIcon from '@mui/icons-material/Support';
import BusinessIcon from '@mui/icons-material/Business';

export default function ContactContent() {
  const theme = useTheme();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  useEffect(() => {
    // Get current session
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        // Pre-fill email if logged in
        setFormData({
          ...formData,
          email: data.session.user.email
        });
      }
      
      setLoading(false);
    };

    fetchSession();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!session) {
      // Prompt to login
      setMessage({ 
        type: 'warning', 
        text: 'Please login to submit your message. This helps us better assist you.' 
      });
      return;
    }
    
    setFormSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setMessage({ 
        type: 'success', 
        text: 'Your message has been sent successfully! We\'ll get back to you as soon as possible.' 
      });
      setFormSubmitting(false);
      
      // Reset form
      setFormData({
        name: '',
        email: session?.user?.email || '',
        subject: '',
        category: 'general',
        message: ''
      });
    }, 1500);
  };

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'partnership', label: 'Business Partnership' }
  ];

  const contactCards = [
    {
      title: 'Customer Support',
      description: 'Get help with your account, technical issues, or general questions',
      icon: <SupportIcon fontSize="large" />,
      color: theme.palette.primary.main
    },
    {
      title: 'Business Inquiries',
      description: 'For partnership opportunities, press, or business development',
      icon: <BusinessIcon fontSize="large" />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Feedback & Suggestions',
      description: 'Share your ideas on how we can improve our platform',
      icon: <HelpIcon fontSize="large" />,
      color: theme.palette.info.main
    }
  ];

  return (
    <Layout title="Contact Us">
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          pt: 8,
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
          <Box textAlign="center">
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              fontWeight="bold"
            >
              Contact Us
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              We're here to help with any questions you might have
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Contact Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {contactCards.map((card, index) => (
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
                      mb: 2,
                      color: card.color,
                      display: 'flex'
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {card.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Card 
              sx={{ 
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                bgcolor: 'white',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Send Us a Message
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Fill out the form below and we'll get back to you as soon as possible.
                </Typography>

                {message.text && (
                  <Alert 
                    severity={message.type} 
                    sx={{ mb: 4 }}
                    onClose={() => setMessage({ type: '', text: '' })}
                  >
                    {message.text}
                    {message.type === 'warning' && (
                      <Box sx={{ mt: 1 }}>
                        <Link href="/login" passHref>
                          <Button color="inherit" size="small" sx={{ textDecoration: 'underline' }}>
                            Login
                          </Button>
                        </Link>
                        {' or '}
                        <Link href="/signup" passHref>
                          <Button color="inherit" size="small" sx={{ textDecoration: 'underline' }}>
                            Sign Up
                          </Button>
                        </Link>
                      </Box>
                    )}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        disabled={session}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                      >
                        {categories.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        rows={6}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={formSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        disabled={formSubmitting}
                        sx={{ px: 4, py: 1.5 }}
                      >
                        {formSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Contact Info */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                bgcolor: '#f9f9f9',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Additional Ways to Connect
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
                  <EmailIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Email Us
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      support@creatorino.com
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      We typically respond within 24 hours
                    </Typography>
                  </Box>
                </Box>
                
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Community Support
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Join our community for faster answers and to connect with other creators.
                  </Typography>
                  <Button variant="outlined" size="small" fullWidth>
                    Join Discord Community
                  </Button>
                </Paper>
                
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Frequently Asked Questions
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Find quick answers to common questions in our FAQ section.
                  </Typography>
                  <Link href="/faq" passHref>
                    <Button variant="outlined" size="small" fullWidth>
                      View FAQ
                    </Button>
                  </Link>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}