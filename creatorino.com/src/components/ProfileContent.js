// components/ProfileContent.js
'use client';

import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { supabase } from '../lib/supabaseClient';
// Import our new avatar service
import { uploadAndProcessAvatar } from '../lib/avatarService';
// Import the worker API client instead of directly using profileService
import { fetchProfileFromWorker, updateProfileWithWorker } from '../lib/workerApiClient';
// Keep the auth services for now as they're not yet moved to the worker
import { 
  sendPasswordResetEmail, 
  enrollMFA, 
  verifyMFA, 
  challengeMFA, 
  listMFAFactors, 
  unenrollMFA 
} from '../lib/authService';
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
  useTheme,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function ProfileContent() {
  const theme = useTheme();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false); // New state for avatar upload
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    bio: '',
    avatar_url: '',
    avatar_url_small: '' // Add small avatar URL
  });
  const [editMode, setEditMode] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // MFA related states
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [mfaEnrollment, setMFAEnrollment] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [mfaFactors, setMFAFactors] = useState([]);
  const [showMFADialog, setShowMFADialog] = useState(false);
  const [mfaLoading, setMFALoading] = useState(false);

  useEffect(() => {
    // Get current session
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        // Fetch profile data using our new Worker API
        try {
          console.log('Fetching profile data from worker API');
          const result = await fetchProfileFromWorker();
          
          if (result.error) {
            console.error('Error from worker API:', result.error);
            setMessage({ 
              type: 'error', 
              text: 'Error loading profile data: ' + (result.error.message || 'Unknown error') 
            });
          } else if (result.data) {
            console.log('Profile data received:', result.data);
            setProfile(result.data);
          } else {
            console.error('No profile data returned');
            setMessage({ 
              type: 'error', 
              text: 'No profile data received from server' 
            });
          }
        } catch (err) {
          console.error('Exception fetching profile:', err);
          setMessage({ 
            type: 'error', 
            text: 'Error loading profile data: ' + err.message 
          });
        }
      } else {
        // Redirect to login if not authenticated
        router.push('/login');
      }
      
      setLoading(false);
    };

    fetchSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (!session) {
          router.push('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Check if MFA is enabled
  useEffect(() => {
    const checkMFAStatus = async () => {
      if (session) {
        try {
          setMFALoading(true);
          const { success, factors, error } = await listMFAFactors();
          
          if (success && factors) {
            setMFAFactors(factors);
            // Check if there's a verified TOTP factor
            setIsMFAEnabled(factors.some(f => f.factor_type === 'totp' && f.status === 'verified'));
          } else if (error) {
            console.error('Error checking MFA status:', error);
          }
        } catch (err) {
          console.error('Error in MFA check:', err);
        } finally {
          setMFALoading(false);
        }
      }
    };
    
    if (session) {
      checkMFAStatus();
    }
  }, [session]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset form when canceling edit mode
      setAvatarPreview(null);
      setAvatarFile(null);
    }
    setEditMode(!editMode);
    setMessage({ type: '', text: '' });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      console.log('Saving profile...');
      
      // First, save profile details using Worker API
      const updatedProfile = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        nickname: profile.nickname,
        bio: profile.bio
      };
      
      const result = await updateProfileWithWorker(updatedProfile);
      
      if (result.error) {
        console.error('Error updating profile:', result.error);
        throw new Error(result.error.message || 'Failed to update profile');
      }
      
      // Process and upload avatar if provided
      if (avatarFile) {
        try {
          setUploadingAvatar(true);
          
          // Use our new avatar service to process and upload the image
          const avatarResult = await uploadAndProcessAvatar(avatarFile);
          
          if (avatarResult.success) {
            console.log('Avatar uploaded successfully:', avatarResult);
            
            // Update profile with new avatar URLs
            setProfile(prev => ({
              ...prev,
              avatar_url: avatarResult.avatar_url,
              avatar_url_small: avatarResult.avatar_url_small
            }));
            
            setMessage({ type: 'success', text: 'Profile and avatar updated successfully!' });
          } else {
            throw new Error('Avatar upload failed');
          }
        } catch (avatarError) {
          console.error('Error uploading avatar:', avatarError);
          // Still proceed with profile save, but show a warning
          setMessage({ 
            type: 'warning', 
            text: `Profile updated but avatar upload failed: ${avatarError.message}` 
          });
        } finally {
          setUploadingAvatar(false);
        }
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
      
      setEditMode(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      
      // Refresh profile data
      const refreshResult = await fetchProfileFromWorker();
      if (refreshResult.data) {
        setProfile(refreshResult.data);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  // Handle enabling MFA
  const handleEnableMFA = async () => {
    try {
      setMFALoading(true);
      const { success, qrCode, secret, factorId, error } = await enrollMFA();
      
      if (success) {
        setMFAEnrollment({ qrCode, secret, factorId });
        setShowMFADialog(true);
      } else {
        setMessage({ type: 'error', text: `Failed to setup MFA: ${error.message}` });
      }
    } catch (err) {
      console.error('Error enabling MFA:', err);
      setMessage({ type: 'error', text: 'An unexpected error occurred while setting up MFA.' });
    } finally {
      setMFALoading(false);
    }
  };

  // Handle verification of MFA code
  const handleVerifyMFA = async () => {
    if (!mfaEnrollment || !verificationCode) {
      setMessage({ type: 'error', text: 'Please enter a verification code.' });
      return;
    }
    
    try {
      setMFALoading(true);
      
      // Create a challenge
      const { success: challengeSuccess, challengeId, error: challengeError } = 
        await challengeMFA(mfaEnrollment.factorId);
      
      if (!challengeSuccess) {
        setMessage({ type: 'error', text: `Challenge failed: ${challengeError.message}` });
        return;
      }
      
      // Verify the challenge
      const { success, error } = await verifyMFA(
        mfaEnrollment.factorId, 
        challengeId, 
        verificationCode
      );
      
      if (success) {
        setShowMFADialog(false);
        setIsMFAEnabled(true);
        setMFAEnrollment(null);
        setVerificationCode('');
        setMessage({ type: 'success', text: 'Two-factor authentication has been successfully enabled!' });
        
        // Refresh MFA factors
        const { factors } = await listMFAFactors();
        setMFAFactors(factors);
      } else {
        setMessage({ type: 'error', text: `Verification failed: ${error.message}` });
      }
    } catch (err) {
      console.error('Error verifying MFA:', err);
      setMessage({ type: 'error', text: 'An unexpected error occurred during verification.' });
    } finally {
      setMFALoading(false);
    }
  };

  // Handle disabling MFA
  const handleDisableMFA = async () => {
    try {
      setMFALoading(true);
      
      // Find the TOTP factor
      const totpFactor = mfaFactors.find(f => f.factor_type === 'totp');
      
      if (!totpFactor) {
        setMessage({ type: 'error', text: 'No MFA factor found to disable.' });
        return;
      }
      
      const { success, error } = await unenrollMFA(totpFactor.id);
      
      if (success) {
        setIsMFAEnabled(false);
        setMessage({ type: 'success', text: 'Two-factor authentication has been disabled.' });
        
        // Refresh MFA factors
        const { factors } = await listMFAFactors();
        setMFAFactors(factors);
      } else {
        setMessage({ type: 'error', text: `Failed to disable MFA: ${error.message}` });
      }
    } catch (err) {
      console.error('Error disabling MFA:', err);
      setMessage({ type: 'error', text: 'An unexpected error occurred while disabling MFA.' });
    } finally {
      setMFALoading(false);
    }
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

  const displayName = profile.nickname || profile.first_name || session?.user?.email?.split('@')[0] || 'User';
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');

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
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              bgcolor: '#f9f9f9',
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mb: 2 }}>
                  <Avatar 
                    src={avatarPreview || profile.avatar_url}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      bgcolor: theme.palette.primary.main
                    }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  {editMode && (
                    <label htmlFor="avatar-upload">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                      />
                      <IconButton 
                        component="span"
                        sx={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          right: 0,
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        }}
                        disabled={uploadingAvatar}
                      >
                        {uploadingAvatar ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <PhotoCameraIcon />
                        )}
                      </IconButton>
                    </label>
                  )}
                </Box>
                
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {fullName || displayName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{profile.nickname || session?.user?.email?.split('@')[0]}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" paragraph>
                  {profile.bio || 'No bio provided yet.'}
                </Typography>
                
                <Link href="#" passHref>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                    onClick={handleEditToggle}
                    className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-4 py-2"
                    sx={{ 
                      mt: 2,
                      borderColor: 'primary.500',
                      '&:hover': {
                        borderColor: 'primary.600',
                      },
                      textTransform: 'none',
                      fontWeight: 'normal',
                      height: '32px', // Reduced height
                      py: 0.5, // Reduced vertical padding
                      lineHeight: 1
                    }}
                  >
                    <span className="truncate">{editMode ? 'Cancel' : 'Edit Profile'}</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card sx={{ 
              borderRadius: 2,
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
                    {session?.user?.email}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    Account Created
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {session?.user?.created_at ? new Date(session.user.created_at).toLocaleDateString() : 'N/A'}
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
              borderRadius: 2,
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
                          label="First Name"
                          name="first_name"
                          value={profile.first_name || ''}
                          onChange={handleProfileChange}
                          fullWidth
                          disabled={!editMode}
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          name="last_name"
                          value={profile.last_name || ''}
                          onChange={handleProfileChange}
                          fullWidth
                          disabled={!editMode}
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Nickname"
                          name="nickname"
                          value={profile.nickname || ''}
                          onChange={handleProfileChange}
                          fullWidth
                          disabled={!editMode}
                          sx={{ mb: 3 }}
                          helperText="This will be displayed publicly"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          value={session?.user?.email || ''}
                          fullWidth
                          disabled={true}
                          sx={{ mb: 3 }}
                          helperText="Email cannot be changed"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Bio"
                          name="bio"
                          value={profile.bio || ''}
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
                        <Link href="#" passHref>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={saving || uploadingAvatar ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSaveProfile}
                            disabled={saving || uploadingAvatar}
                            className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-4 py-2"
                            sx={{ 
                              borderColor: 'primary.500',
                              '&:hover': {
                                borderColor: 'primary.600',
                              },
                              textTransform: 'none',
                              fontWeight: 'normal',
                              height: '34px', // Reduced height
                              py: 0.5 // Reduced vertical padding
                            }}
                          >
                            <span className="truncate">
                              {saving || uploadingAvatar ? 'Saving...' : 'Save Changes'}
                            </span>
                          </Button>
                        </Link>
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
                        We'll send you an email with a link to reset your password.
                      </Typography>
                      <Link href="#" passHref>
                        <Button 
                          variant="outlined" 
                          size="small"
                          className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-3 py-1"
                          sx={{ 
                            borderColor: 'primary.500',
                            '&:hover': {
                              borderColor: 'primary.600',
                            },
                            textTransform: 'none',
                            fontWeight: 'normal',
                            height: '28px', // Reduced height
                            py: 0.25 // Reduced vertical padding
                          }}
                          onClick={async () => {
                            if (session?.user?.email) {
                              const { success, error } = await sendPasswordResetEmail(session.user.email);
                              setMessage({ 
                                type: success ? 'success' : 'error', 
                                text: success 
                                  ? 'Password reset email has been sent.' 
                                  : `Failed to send reset email: ${error.message}` 
                              });
                            }
                          }}
                        >
                          <span className="truncate">Reset Password</span>
                        </Button>
                      </Link>
                    </Paper>
                    
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2, mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Add an extra layer of security to your account with two-factor authentication.
                      </Typography>
                      
                      {isMFAEnabled ? (
                        <Button 
                          variant="outlined" 
                          color="error"
                          size="small"
                          className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-3 py-1"
                          sx={{ 
                            borderColor: 'error.main',
                            '&:hover': {
                              borderColor: 'error.dark',
                            },
                            textTransform: 'none',
                            fontWeight: 'normal',
                            height: '28px', // Reduced height
                            py: 0.25 // Reduced vertical padding
                          }}
                          onClick={handleDisableMFA}
                          disabled={mfaLoading}
                        >
                          <span className="truncate">
                            {mfaLoading ? 'Processing...' : 'Disable 2FA'}
                          </span>
                        </Button>
                      ) : (
                        <Button 
                          variant="outlined" 
                          color="primary"
                          size="small"
                          className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border hover:bg-opacity-80 focus-visible:outline-primary-600 text-sm px-3 py-1"
                          sx={{ 
                            borderColor: 'primary.500',
                            '&:hover': {
                              borderColor: 'primary.600',
                            },
                            textTransform: 'none',
                            fontWeight: 'normal',
                            height: '28px', // Reduced height
                            py: 0.25 // Reduced vertical padding
                          }}
                          onClick={handleEnableMFA}
                          disabled={mfaLoading}
                        >
                          <span className="truncate">
                            {mfaLoading ? 'Processing...' : 'Enable 2FA'}
                          </span>
                        </Button>
                      )}
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* MFA Setup Dialog */}
      <Dialog open={showMFADialog} onClose={() => setShowMFADialog(false)}>
        <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Scan this QR code with your authenticator app (like Google Authenticator or Authy),
            then enter the verification code below.
          </DialogContentText>
          
          {mfaEnrollment?.qrCode && (
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <div dangerouslySetInnerHTML={{ __html: mfaEnrollment.qrCode }} />
            </Box>
          )}
          
          {mfaEnrollment?.secret && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Manual entry code:</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                {mfaEnrollment.secret}
              </Typography>
            </Box>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Verification Code"
            fullWidth
            variant="outlined"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            helperText="Enter the 6-digit code from your authenticator app"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMFADialog(false)} 
            sx={{ 
              height: '32px', // Reduced height 
              py: 0.5 // Reduced vertical padding
            }}
          >Cancel</Button>
          <Button 
            onClick={handleVerifyMFA} 
            variant="contained" 
            color="primary"
            disabled={mfaLoading}
            sx={{ 
              height: '32px', // Reduced height
              py: 0.5 // Reduced vertical padding
            }}
          >
            {mfaLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}