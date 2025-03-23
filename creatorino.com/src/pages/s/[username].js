// pages/s/[username].js - 100% client-side solution for Cloudflare Pages
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
import { supabase, logSupabaseError } from '../../lib/supabaseClient';
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

// Instead of getStaticPaths and getStaticProps, we'll use a pure client-side approach
// for Cloudflare Pages compatibility

export default function UserLinksPage() {
  // Get the username from the URL
  const router = useRouter();
  const { username } = router.query;

  // State for client-side data
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch data on client side when username is available
  useEffect(() => {
    async function fetchUserData() {
      if (!username) return;
      
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        console.log('[UserLinksPage] Fetching data for username:', username);

        // First get the profile by nickname
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('nickname', username)
          .single();

        if (profileError) {
          console.error('[UserLinksPage] Profile error:', profileError.code, profileError.message, profileError);
          logSupabaseError('Fetching profile', profileError, { username });
          if (profileError.code === 'PGRST116') {
            // No results found
            setNotFound(true);
          } else {
            setError(`Failed to fetch profile: ${profileError.message}`);
          }
          setLoading(false);
          return;
        }

        if (!profileData) {
          console.log('No profile found for username:', username);
          setNotFound(true);
          setLoading(false);
          return;
        }

        setProfile(profileData);
        console.log('Found profile for:', username);

        // Get settings for this user
        const { data: settingsData, error: settingsError } = await supabase
          .from('social_links_settings')
          .select('*')
          .eq('user_id', profileData.id)
          .single();

        if (settingsError) {
          console.error('Error finding settings:', settingsError);
          if (settingsError.code === 'PGRST116') {
            setNotFound(true);
          } else {
            setError(`Failed to fetch settings: ${settingsError.message}`);
          }
          setLoading(false);
          return;
        }

        if (!settingsData) {
          console.log('No settings found for user ID:', profileData.id);
          setNotFound(true);
          setLoading(false);
          return;
        }

        setSettings(settingsData);

        // Finally, get links for this username
        const { data: linksData, error: linksError } = await supabase
          .from('social_links')
          .select('*')
          .eq('nickname', username)
          .order('sort_order');

        if (linksError) {
          console.error('Error fetching links:', linksError);
          setError(`Failed to fetch links: ${linksError.message}`);
          setLoading(false);
          return;
        }

        setLinks(linksData || []);
        console.log(`Found ${linksData ? linksData.length : 0} links for user`);
        
        // Add more verbose logging for successful data fetches
        console.log('[UserLinksPage] Data fetch complete:', { 
          profileFound: !!profileData,
          settingsFound: !!settingsData,
          linksCount: linksData?.length || 0
        });
        
      } catch (err) {
        console.error('[UserLinksPage] Unexpected error in data fetching:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchUserData();
    }
  }, [username]);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">Loading {username}'s links...</Typography>
      </Box>
    );
  }

  // Show error message
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

  // Show not found message
  if (notFound) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h4" gutterBottom>Page not found</Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
            The page for @{username} doesn't exist or hasn't been set up yet.
          </Typography>
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

  // If no profile or settings, show not found
  if (!profile || !settings) {
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
    title: settings.title || 'Creator',
    bio: settings.bio || '',
    themeId: settings.theme_id || 'default',
    button_style: settings.button_style || 'rounded',
    font_family: settings.font_family || 'Inter',
    background_type: settings.background_type || 'color',
    background_value: settings.background_value || '#ffffff'
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
        <meta property="og:url" content={`https://creatorino.com/s/${username}`} />
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
            {links.length > 0 ? (
              links.map(link => (
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