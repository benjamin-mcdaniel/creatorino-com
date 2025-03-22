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

export default function PublicLinkPage() {
  const router = useRouter();
  const { username } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      if (!username) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching data for username:', username);
        
        // Directly query the social_links_settings table using the nickname field
        const { data: settingsData, error: settingsError } = await supabase
          .from('social_links_settings')
          .select('*')
          .eq('nickname', username)
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
          console.log('No settings found for username:', username);
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        console.log('Found settings for:', username);
        
        // Format settings to match our component format
        const formattedProfile = {
          title: settingsData.title || 'Creator',
          bio: settingsData.bio || '',
          themeId: settingsData.theme_id || 'default',
          button_style: settingsData.button_style || 'rounded',
          font_family: settingsData.font_family || 'Inter',
          background_type: settingsData.background_type || 'color',
          background_value: settingsData.background_value || '#ffffff'
        };
        
        setProfile(formattedProfile);
        
        // Query links directly by nickname (more efficient)
        const { data: linksData, error: linksError } = await supabase
          .from('social_links')
          .select('*')
          .eq('nickname', username)
          .order('sort_order');
          
        if (linksError) {
          console.error('Error fetching links:', linksError);
          setError(`Failed to fetch links: ${linksError.message}`);
        } else if (linksData && linksData.length > 0) {
          console.log(`Found ${linksData.length} links`);
          setLinks(linksData);
        } else {
          console.log('No links found');
          setLinks([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching public link page:', error);
        setError('An unexpected error occurred. Please try again later.');
        setNotFound(true);
        setLoading(false);
      }
    }
    
    if (username) {
      fetchData();
    }
  }, [username]);
  
  // Helper function to get icon
  const getIcon = (platformKey) => {
    return platformIcons[platformKey] || platformIcons.default;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">Loading {username}'s links...</Typography>
      </Box>
    );
  }
  
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
  
  // Get the selected theme
  const theme = COLOR_THEMES.find(t => t.id === profile.themeId) || COLOR_THEMES[0];
  
  return (
    <>
      <Head>
        <title>{profile.title} | Links</title>
        <meta name="description" content={profile.bio || `Check out ${profile.title}'s links`} />
        <meta property="og:title" content={`${profile.title} | Links`} />
        <meta property="og:description" content={profile.bio || `Check out ${profile.title}'s links`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://creatorino.com/s/${username}`} />
        {/* You could generate dynamic OG images for better sharing experience */}
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
          {/* Avatar */}
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
            {profile.title.charAt(0).toUpperCase()}
          </Avatar>
          
          {/* Title */}
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.textColor }}
          >
            {profile.title}
          </Typography>
          
          {/* Bio */}
          {profile.bio && (
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ mb: 4, color: theme.textColor, maxWidth: '90%' }}
            >
              {profile.bio}
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
                    borderRadius: profile.button_style === 'rounded' ? '8px' : 
                                profile.button_style === 'pill' ? '50px' : '0px',
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