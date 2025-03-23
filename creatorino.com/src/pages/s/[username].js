// pages/s/[username].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Avatar, Typography, Button, CircularProgress, Container, Alert } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PublicIcon from '@mui/icons-material/Public';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TiktokIcon from '@mui/icons-material/MusicVideo'; // Using MusicVideo as a stand-in for TikTok
import { supabase } from '../../lib/supabaseClient';
import { COLOR_THEMES } from '../../components/dashboard/SocialLinks/utils';

// Platform icons mapping
const platformIcons = {
  twitter: <TwitterIcon />,
  youtube: <YouTubeIcon />,
  instagram: <InstagramIcon />,
  facebook: <FacebookIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  tiktok: <TiktokIcon />,
  default: <PublicIcon />
};

// Switched to getStaticPaths with fallback: true for better Cloudflare Pages compatibility
export async function getStaticPaths() {
  // Only pre-render the most popular profiles at build time to keep build times reasonable
  const { data, error } = await supabase
    .from('profiles')
    .select('nickname')
    .not('nickname', 'is', null)
    .limit(50); // Limit to 50 most recently updated profiles for build time
    
  if (error || !data) {
    return {
      paths: [],
      fallback: true // Changed to true instead of 'blocking'
    };
  }
  
  const paths = data
    .filter(profile => profile.nickname)
    .map(profile => ({
      params: { username: profile.nickname }
    }));
    
  return {
    paths,
    fallback: true // Client-side rendering for paths not generated at build time
  };
}

export async function getStaticProps({ params }) {
  const { username } = params;
  
  try {
    // First try to get user by nickname
    let settings = null;
    let links = [];
    let profile = null;
    
    // Get the profile by nickname
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('nickname', username)
      .single();
      
    if (profileError || !profileData) {
      // Return notFound for 404 handling
      return { notFound: true };
    }
    
    profile = profileData;
      
    // Find settings for this user
    const { data: settingsData, error: settingsError } = await supabase
      .from('social_links_settings')
      .select('*')
      .eq('user_id', profile.id)
      .single();
      
    if (!settingsError && settingsData) {
      settings = settingsData;
    } else {
      // No settings found - return 404
      return { notFound: true };
    }
    
    // Get links by nickname
    const { data: linksData } = await supabase
      .from('social_links')
      .select('*')
      .eq('nickname', username)
      .order('sort_order');
      
    if (linksData) {
      links = linksData;
    }
    
    return {
      props: {
        profile,
        settings,
        links,
        username
      },
      revalidate: 60 // Revalidate every minute for frequently updated content
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}

export default function UserLinksPage({ profile, settings, links, username }) {
  const router = useRouter();
  const [clientLinks, setClientLinks] = useState(links || []);
  const [clientSettings, setClientSettings] = useState(settings);
  const [clientProfile, setClientProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle fallback state for client-side rendering when the page isn't pre-generated
  useEffect(() => {
    // Skip if static props are already provided or router.isFallback is still true
    if ((profile && settings) || router.isFallback) {
      return;
    }

    // If we get here, it means we need to fetch data client-side
    async function fetchUserData() {
      if (!router.query.username) return;
      
      const username = router.query.username;
      setLoading(true);
      setError(null);
      
      try {
        // Get the profile by nickname
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('nickname', username)
          .single();
          
        if (profileError || !profileData) {
          router.push('/404');
          return;
        }
        
        setClientProfile(profileData);
        
        // Find settings for this user
        const { data: settingsData, error: settingsError } = await supabase
          .from('social_links_settings')
          .select('*')
          .eq('user_id', profileData.id)
          .single();
          
        if (settingsError || !settingsData) {
          router.push('/404');
          return;
        }
        
        setClientSettings(settingsData);
        
        // Get links by nickname
        const { data: linksData } = await supabase
          .from('social_links')
          .select('*')
          .eq('nickname', username)
          .order('sort_order');
          
        if (linksData) {
          setClientLinks(linksData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [router, profile, settings]);

  // If the page is in the fallback state, show a loading indicator
  if (router.isFallback || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">Loading profile...</Typography>
      </Box>
    );
  }

  // Show error if something went wrong during client-side data fetching
  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => router.push('/')}
          >
            Go Home
          </Button>
        </Box>
      </Container>
    );
  }

  // Use either the server-side or client-side data
  const actualProfile = clientProfile || profile;
  const actualSettings = clientSettings || settings;
  const actualLinks = clientLinks || links || [];
  
  if (!actualProfile || !actualSettings) {
    // This is a fallback in case something went wrong but didn't trigger an error
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h4" gutterBottom>Profile not found</Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/')}
          >
            Go Home
          </Button>
        </Box>
      </Container>
    );
  }

  // Format settings to match component expectations
  const formattedProfile = {
    title: actualSettings.title || 'Creator',
    bio: actualSettings.bio || '',
    themeId: actualSettings.theme_id || 'default',
    button_style: actualSettings.button_style || 'rounded',
    font_family: actualSettings.font_family || 'Inter',
    background_type: actualSettings.background_type || 'color',
    background_value: actualSettings.background_value || '#ffffff'
  };
  
  // Get the selected theme
  const theme = COLOR_THEMES.find(t => t.id === formattedProfile.themeId) || COLOR_THEMES[0];
  
  // Helper function to get icon for a platform
  const getIcon = (platformKey) => {
    return platformIcons[platformKey] || platformIcons.default;
  };
  
  return (
    <>
      <Head>
        <title>{formattedProfile.title} | Links</title>
        <meta name="description" content={formattedProfile.bio || `Check out ${formattedProfile.title}'s links`} />
        <meta property="og:title" content={`${formattedProfile.title} | Links`} />
        <meta property="og:description" content={formattedProfile.bio || `Check out ${formattedProfile.title}'s links`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://creatorino.com/s/${router.query.username}`} />
      </Head>

      <Box sx={{ 
        bgcolor: theme.backgroundColor,
        color: theme.textColor,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3
      }}>
        <Box sx={{ 
          maxWidth: 500, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4
        }}>
          {/* Profile Avatar */}
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              mx: 'auto',
              mb: 2,
              bgcolor: theme.buttonColor,
              color: theme.buttonTextColor
            }}
          >
            {formattedProfile.title.charAt(0).toUpperCase()}
          </Avatar>
          
          {/* Title */}
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.textColor }}
          >
            {formattedProfile.title}
          </Typography>
          
          {/* Bio */}
          {formattedProfile.bio && (
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ mb: 4, color: theme.textColor, maxWidth: '90%' }}
            >
              {formattedProfile.bio}
            </Typography>
          )}
          
          {/* Links */}
          <Box sx={{ width: '100%', mt: 2 }}>
            {actualLinks.length > 0 ? (
              actualLinks.map(link => (
                <Button
                  key={link.id}
                  component="a"
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  variant="contained"
                  startIcon={getIcon(link.platform_key)}
                  onClick={(e) => {
                    // Ensure the link opens in a new tab even if href doesn't work
                    e.preventDefault();
                    const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: formattedProfile.button_style === 'rounded' ? '8px' : 
                                formattedProfile.button_style === 'pill' ? '50px' : '0px',
                    backgroundColor: theme.buttonColor,
                    color: theme.buttonTextColor,
                    justifyContent: 'flex-start',
                    pl: 3,
                    '&:hover': {
                      backgroundColor: theme.buttonColor,
                      opacity: 0.9,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'transform 0.2s ease, opacity 0.2s ease'
                  }}
                >
                  {link.title}
                </Button>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: theme.textColor, opacity: 0.7 }}>
                  No links have been added yet.
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Footer */}
          <Typography 
            variant="body2" 
            align="center"
            sx={{ 
              mt: 'auto', 
              pt: 4,
              opacity: 0.7,
              color: theme.textColor
            }}
          >
            Created with Creatorino
          </Typography>
        </Box>
      </Box>
    </>
  );
}