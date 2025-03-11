'use client';

import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  TextField,
  Paper,
  Tabs,
  Tab,
  Alert,
  Skeleton,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function ProfileContent() {
  const theme = useTheme();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    bio: '',
    email: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Get current session
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        // Populate profile with user data
        setProfile({
          username: 'creator123',
          fullName: 'Content Creator',
          bio: 'Professional content creator and streamer. I love sharing gaming content and connecting with my audience.',
          email: data.session.user.email
        });
      } else {
        // Redirect to login if not authenticated
        router.push('/login');
      }
      
      setLoading(false);
    };

    fetchSession();
  }, [router]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Discard changes if canceling edit mode
      setMessage({ type: '', text: '' });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // Here you would save to your database
    // For now, just show a success message
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setEditMode(false);
  };

  if (loading) {
    return (
      <Layout title="Profile">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 4 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                  <Skeleton variant="text" height={40} width="80%" sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" height={20} width="60%" sx={{ mx: 'auto', mb: 3 }} />
                  <Skeleton variant="rectangular" height={100} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} width="50%" sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={300} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
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
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              fontWeight="bold"
            >
              Your Profile
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Manage your personal information and account settings
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, mb: 8 }}>
        {message.text && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 4 }}
            onClose={() => setMessage({ type: '', text: '' })}
          >
            {message.text}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Profile Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              mb: 4, 
              borderRadius: 3,
              border: '1px solid #e0e0e0',
              bgcolor: '#f9f9f9',
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: theme.palette.primary.main
                  }}
                >
                  {profile.fullName.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {profile.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{profile.username}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" paragraph>
                  {profile.bio}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                  onClick={handleEditToggle}
                  sx={{ mt: 2 }}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ 
              borderRadius: 3,
              border: '1px solid #e0e0e0',
              bgcolor: '#f9f9f9',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ px: 2, pt: 1 }}>
                  Account Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ px: 2, pb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email Address
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {profile.email}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    Account Created
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    March 10, 2025
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    Subscription
                  </Typography>
                  <Typography variant="body1">
                    Free Plan
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: 3,
              border: '1px solid #e0e0e0',
              bgcolor: 'white',
            }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange} 
                  aria-label="profile tabs"
                  sx={{ px: 2 }}
                >
                  <Tab icon={<AccountCircleIcon />} label="Profile" />
                  <Tab icon={<SecurityIcon />} label="Security" />
                  <Tab icon={<NotificationsIcon />} label="Notifications" />
                </Tabs>
              </Box>

              <CardContent sx={{ p: 4 }}>
                {/* Profile Tab */}
                {currentTab === 0 && (
                  <Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Profile Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Update your personal information and public profile
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Full Name"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleProfileChange}
                          fullWidth
                          disabled={!editMode}
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Username"
                          name="username"
                          value={profile.username}
                          onChange={handleProfileChange}
                          fullWidth
                          disabled={!editMode}
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          fullWidth
                          disabled={!editMode}
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Bio"
                          name="bio"
                          value={profile.bio}
                          onChange={handleProfileChange}
                          fullWidth
                          multiline
                          rows={4}
                          disabled={!editMode}
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                    </Grid>

                    {editMode && (
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          onClick={handleSaveProfile}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Security Tab */}
                {currentTab === 1 && (
                  <Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Security Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Manage your password and account security
                    </Typography>
                    
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2, mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Change Password
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Update your password to keep your account secure
                      </Typography>
                      <Button variant="outlined" size="small">
                        Change Password
                      </Button>
                    </Paper>
                    
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2, mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Add an extra layer of security to your account
                      </Typography>
                      <Button variant="outlined" size="small">
                        Enable 2FA
                      </Button>
                    </Paper>
                    
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Connected Accounts
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Manage your connected social accounts
                      </Typography>
                      <Button variant="outlined" size="small">
                        Manage Connections
                      </Button>
                    </Paper>
                  </Box>
                )}

                {/* Notifications Tab */}
                {currentTab === 2 && (
                  <Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Notification Preferences
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Control when and how you receive notifications
                    </Typography>
                    
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2, mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium" paragraph>
                        Coming Soon
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Notification preferences will be available in a future update. Stay tuned!
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}