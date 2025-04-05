import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Link as MuiLink,
  Card,
  CardContent
} from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import TwitchIcon from '@mui/icons-material/Gamepad'; // Using Gamepad as Twitch icon

// Sample users data (would be replaced with actual API call)
const sampleUsers = [
  {
    id: 1,
    name: 'Jane Cooper',
    nickname: 'janecooper',
    type: 'creator',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    followers: 15400,
    platform: 'Youtube',
    bio: 'Digital creator and storyteller focused on travel and lifestyle content.',
    location: 'Los Angeles, CA',
    social: {
      youtube: 'janecooper',
      instagram: 'jane.cooper',
      twitter: 'janecooper',
      twitch: null
    },
    portfolio: [
      { title: 'Travel Vlog: Japan', views: '125K', link: '#' },
      { title: 'How I Edit My Videos', views: '87K', link: '#' },
      { title: 'My Camera Equipment', views: '212K', link: '#' }
    ]
  },
  {
    id: 2,
    name: 'Cody Fisher',
    nickname: 'codyfisher',
    type: 'editor',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    followers: null,
    platform: null,
    bio: 'Professional video editor with 5+ years experience in final cut pro and premiere.',
    location: 'New York, NY',
    social: {
      youtube: null,
      instagram: 'cody.edits',
      twitter: 'codyfisheredits',
      twitch: null
    },
    portfolio: [
      { title: 'Travel Channel Reel', views: null, link: '#' },
      { title: 'Music Video: The Weeknd', views: null, link: '#' },
      { title: 'Commercial: Nike Campaign', views: null, link: '#' }
    ]
  },
  // ...other users would be here
];

export default function ProfileDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch from your API or database
    // For this example, we'll use the sample data
    const fetchProfile = () => {
      if (!id) return;
      
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const user = sampleUsers.find(u => u.id === parseInt(id));
        if (user) {
          setProfile(user);
        } else {
          // Handle not found
          router.push('/404');
        }
        setLoading(false);
      }, 800);
    };
    
    fetchProfile();
  }, [id, router]);
  
  // Format follower count with K, M suffixes
  const formatFollowers = (count) => {
    if (!count) return 'N/A';
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  if (loading) {
    return (
      <Layout title="Profile">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (!profile) {
    return null; // Will redirect to 404 from the useEffect
  }
  
  return (
    <Layout title={`${profile.name} | Profile`}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Back button */}
        <Box mb={4}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.back()}
            sx={{ textTransform: 'none' }}
          >
            Back to Directory
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {/* Left Column - Profile Info */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 2, 
                border: '1px solid #e0e0e0',
                textAlign: 'center'
              }}
            >
              <Avatar 
                src={profile.avatar} 
                alt={profile.name}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  mx: 'auto'
                }}
              />
              
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {profile.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{profile.nickname}
              </Typography>
              
              <Chip 
                label={profile.type.charAt(0).toUpperCase() + profile.type.slice(1)} 
                color={
                  profile.type === 'creator' ? 'primary' :
                  profile.type === 'editor' ? 'secondary' :
                  profile.type === 'manager' ? 'success' : 'default'
                }
                variant="outlined"
                sx={{ mt: 1, mb: 3 }}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" paragraph align="left">
                {profile.bio}
              </Typography>
              
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body2">
                  {profile.location}
                </Typography>
              </Box>
              
              {profile.platform && (
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Primary Platform
                  </Typography>
                  <Typography variant="body2">
                    {profile.platform}
                  </Typography>
                </Box>
              )}
              
              {profile.followers && (
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Followers
                  </Typography>
                  <Typography variant="body2">
                    {formatFollowers(profile.followers)}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              {/* Social Links */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom align="left">
                  Social Media
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {profile.social.youtube && (
                    <MuiLink href={`https://youtube.com/${profile.social.youtube}`} target="_blank" underline="none">
                      <Button 
                        variant="outlined" 
                        startIcon={<YouTubeIcon />}
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        YouTube
                      </Button>
                    </MuiLink>
                  )}
                  
                  {profile.social.instagram && (
                    <MuiLink href={`https://instagram.com/${profile.social.instagram}`} target="_blank" underline="none">
                      <Button 
                        variant="outlined" 
                        startIcon={<InstagramIcon />}
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        Instagram
                      </Button>
                    </MuiLink>
                  )}
                  
                  {profile.social.twitter && (
                    <MuiLink href={`https://twitter.com/${profile.social.twitter}`} target="_blank" underline="none">
                      <Button 
                        variant="outlined" 
                        startIcon={<TwitterIcon />}
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        Twitter
                      </Button>
                    </MuiLink>
                  )}
                  
                  {profile.social.twitch && (
                    <MuiLink href={`https://twitch.tv/${profile.social.twitch}`} target="_blank" underline="none">
                      <Button 
                        variant="outlined" 
                        startIcon={<TwitchIcon />}
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        Twitch
                      </Button>
                    </MuiLink>
                  )}
                </Box>
              </Box>
              
              {/* Contact Buttons */}
              <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<EmailIcon />}
                  fullWidth
                  sx={{ textTransform: 'none' }}
                >
                  Send Message
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<PersonAddIcon />}
                  fullWidth
                  sx={{ textTransform: 'none' }}
                >
                  Connect
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Right Column - Portfolio/Work */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 2, 
                border: '1px solid #e0e0e0',
                height: '100%'
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {profile.type === 'creator' ? 'Featured Content' : 'Portfolio'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {profile.type === 'creator' 
                  ? 'Popular videos and content from this creator'
                  : 'Selected work and projects'}
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {profile.portfolio.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
                      <Box 
                        sx={{ 
                          height: 140, 
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          [Thumbnail]
                        </Typography>
                      </Box>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          {item.title}
                        </Typography>
                        
                        {item.views && (
                          <Typography variant="body2" color="text.secondary">
                            {item.views} views
                          </Typography>
                        )}
                        
                        <Button 
                          variant="text" 
                          href={item.link}
                          sx={{ 
                            textTransform: 'none',
                            mt: 1,
                            p: 0
                          }}
                        >
                          View {profile.type === 'creator' ? 'Video' : 'Project'} →
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
