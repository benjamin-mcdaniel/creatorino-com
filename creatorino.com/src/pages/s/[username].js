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
        console.log('Fetching data for username:', username);
        console.log('[UserLinksPage] Fetching data for username:', username);
        // First get the profile by nickname
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')leData, error: profileError } = await supabase
          .select('*')les')
          .eq('nickname', username)
          .single();ame', username)
          .single();
        if (profileError) {
          logSupabaseError('Fetching profile', profileError, { username });
          if (profileError.code === 'PGRST116') {error:', profileError.code, profileError.message, profileError);
            // No results found === 'PGRST116') {
            setNotFound(true);d
          } else {Found(true);
            setError(`Failed to fetch profile: ${profileError.message}`);
          } setError(`Failed to fetch profile: ${profileError.message}`);
          setLoading(false);
          return;ing(false);
        } return;
        }
        if (!profileData) {
          console.log('No profile found for username:', username);
          setNotFound(true);ofile found for username:', username);
          setLoading(false);
          return;ing(false);
        } return;
        }
        setProfile(profileData);
        console.log('Found profile for:', username);
        console.log('Found profile for:', username);
        // Get settings for this user
        const { data: settingsData, error: settingsError } = await supabase
          .from('social_links_settings')r: settingsError } = await supabase
          .select('*')l_links_settings')
          .eq('user_id', profileData.id)
          .single();id', profileData.id)
          .single();
        if (settingsError) {
          console.error('Error finding settings:', settingsError);
          if (settingsError.code === 'PGRST116') { settingsError);
            setNotFound(true);de === 'PGRST116') {
          } else {Found(true);
            setError(`Failed to fetch settings: ${settingsError.message}`);
          } setError(`Failed to fetch settings: ${settingsError.message}`);
          setLoading(false);
          return;ing(false);
        } return;
        }
        if (!settingsData) {
          console.log('No settings found for user ID:', profileData.id);
          setNotFound(true);ttings found for user ID:', profileData.id);
          setLoading(false);
          return;ing(false);
        } return;
        }
        setSettings(settingsData);
        setSettings(settingsData);
        // Finally, get links for this username
        const { data: linksData, error: linksError } = await supabase
          .from('social_links'), error: linksError } = await supabase
          .select('*')l_links')
          .eq('nickname', username)
          .order('sort_order');ame)
          .order('sort_order');
        if (linksError) {
          console.error('Error fetching links:', linksError);
          setError(`Failed to fetch links: ${linksError.message}`);
          setLoading(false);o fetch links: ${linksError.message}`);
          return;ing(false);
        } return;
        }
        setLinks(linksData || []);
        console.log(`Found ${linksData ? linksData.length : 0} links for user`);
        console.log(`Found ${linksData ? linksData.length : 0} links for user`);
      } catch (err) {
        console.error('Error in data fetching:', err);a fetches
        setError('An unexpected error occurred. Please try again later.');
      } finally {Found: !!profileData,
        setLoading(false);!settingsData,
      }   linksCount: linksData?.length || 0
    }   });
        
    if (username) { {
      fetchUserData();'[UserLinksPage] Unexpected error in data fetching:', err);
    }   setError('An unexpected error occurred. Please try again later.');
  }, [username]);
        setLoading(false);
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">Loading {username}'s links...</Typography>
      </Box>me]);
    );
  }/ Show loading state
  if (loading) {
  // Show error message
  if (error) {{{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
    return (cularProgress sx={{ mb: 2 }} />
      <Container maxWidth="sm">dy1">Loading {username}'s links...</Typography>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Button ssage
            variant="contained" 
            onClick={() => router.push('/')}
          >ainer maxWidth="sm">
            Go HometextAlign: 'center', py: 10 }}>
          </Button>verity="error" sx={{ mb: 4 }}>
        </Box>rror}
      </Container>
    );    <Button 
  }         variant="contained" 
            onClick={() => router.push('/')}
  // Show not found message
  if (notFound) {me
    return (Button>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h4" gutterBottom>Page not found</Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
            The page for @{username} doesn't exist or hasn't been set up yet.
          </Typography>sage
          <Button 
            variant="contained" 
            onClick={() => router.push('/')}
          >x sx={{ textAlign: 'center', py: 10 }}>
            Go Homehy variant="h4" gutterBottom>Page not found</Typography>
          </Button>hy variant="body1" sx={{ mt: 2, mb: 4 }}>
        </Box>e page for @{username} doesn't exist or hasn't been set up yet.
      </Container>aphy>
    );    <Button 
  }         variant="contained" 
            onClick={() => router.push('/')}
  // If no profile or settings, show not found
  if (!profile || !settings) {
    return (Button>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h4" gutterBottom>Profile not found</Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/')}nd
          >ile || !settings) {
            Go Home
          </Button>xWidth="sm">
        </Box>x={{ textAlign: 'center', py: 10 }}>
      </Container>phy variant="h4" gutterBottom>Profile not found</Typography>
    );    <Button 
  }         variant="contained" 
            onClick={() => router.push('/')}
  // Format settings to match component expectations
  const formattedProfile = {
    title: settings.title || 'Creator',
    bio: settings.bio || '',
    themeId: settings.theme_id || 'default',
    button_style: settings.button_style || 'rounded',
    font_family: settings.font_family || 'Inter',
    background_type: settings.background_type || 'color',
    background_value: settings.background_value || '#ffffff'
  };nst formattedProfile = {
    title: settings.title || 'Creator',
  // Get the selected theme,
  const theme = COLOR_THEMES.find(t => t.id === formattedProfile.themeId) || COLOR_THEMES[0];
    button_style: settings.button_style || 'rounded',
  // Helper function to get icon for a platform',
  const getIcon = (platformKey) => {ound_type || 'color',
    return platformIcons[platformKey] || platformIcons.default;
  };
  
  return (he selected theme
    <>t theme = COLOR_THEMES.find(t => t.id === formattedProfile.themeId) || COLOR_THEMES[0];
      <Head>
        <title>{formattedProfile.title} | Links</title>
        <meta name="description" content={formattedProfile.bio || `Check out ${formattedProfile.title}'s links`} />
        <meta property="og:title" content={`${formattedProfile.title} | Links`} />
        <meta property="og:description" content={formattedProfile.bio || `Check out ${formattedProfile.title}'s links`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://creatorino.com/s/${username}`} />
      </Head>
      <Head>
      <Box sx={{ ormattedProfile.title} | Links</title>
        bgcolor: theme.backgroundColor,t={formattedProfile.bio || `Check out ${formattedProfile.title}'s links`} />
        color: theme.textColor,e" content={`${formattedProfile.title} | Links`} />
        minHeight: '100vh',description" content={formattedProfile.bio || `Check out ${formattedProfile.title}'s links`} />
        display: 'flex',og:type" content="website" />
        flexDirection: 'column',content={`https://creatorino.com/s/${username}`} />
        alignItems: 'center',
        p: 3
      }}>x sx={{ 
        <Box sx={{ eme.backgroundColor,
          maxWidth: 500, Color,
          width: '100%',h',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4
        }}>
          {/* Profile Avatar */}
          <Avatar : 500, 
            sx={{ 100%',
              width: 100, 
              height: 100, olumn',
              mx: 'auto',nter',
              mb: 2,
              bgcolor: theme.buttonColor,
              color: theme.buttonTextColor
            }}tar 
          > sx={{ 
            {formattedProfile.title.charAt(0).toUpperCase()}
          </Avatar>t: 100, 
              mx: 'auto',
          {/* Title */}
          <Typography  theme.buttonColor,
            variant="h4" e.buttonTextColor
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.textColor }}
          >/Avatar>
            {formattedProfile.title}
          </Typography>
          <Typography 
          {/* Bio */}h4" 
          {formattedProfile.bio && (
            <Typography 
              variant="body1" 'bold', color: theme.textColor }}
              align="center" 
              sx={{ mb: 4, color: theme.textColor, maxWidth: '90%' }}
            >ypography>
              {formattedProfile.bio}
            </Typography>
          )}ormattedProfile.bio && (
            <Typography 
          {/* Links */}body1" 
          <Box sx={{ width: '100%', mt: 2 }}>
            {links.length > 0 ? ( theme.textColor, maxWidth: '90%' }}
              links.map(link => (
                <ButtondProfile.bio}
                  key={link.id}
                  component="a"
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"}>
                  fullWidth 0 ? (
                  variant="contained"
                  startIcon={getIcon(link.platform_key)}
                  onClick={(e) => {
                    // Ensure the link opens in a new tab even if href doesn't work
                    e.preventDefault();With('http') ? link.url : `https://${link.url}`}
                    const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}llWidth
                  sx={{nt="contained"
                    mb: 2,n={getIcon(link.platform_key)}
                    p: 1.5,(e) => {
                    borderRadius: formattedProfile.button_style === 'rounded' ? '8px' : 
                                formattedProfile.button_style === 'pill' ? '50px' : '0px',
                    backgroundColor: theme.buttonColor,tp') ? link.url : `https://${link.url}`;
                    color: theme.buttonTextColor,oopener,noreferrer');
                    justifyContent: 'flex-start',
                    pl: 3,
                    '&:hover': {
                      backgroundColor: theme.buttonColor,
                      opacity: 0.9,ormattedProfile.button_style === 'rounded' ? '8px' : 
                      transform: 'translateY(-2px)',ton_style === 'pill' ? '50px' : '0px',
                    },ckgroundColor: theme.buttonColor,
                    transition: 'transform 0.2s ease, opacity 0.2s ease'
                  }}justifyContent: 'flex-start',
                >   pl: 3,
                  {link.title} {
                </Button>kgroundColor: theme.buttonColor,
              ))      opacity: 0.9,
            ) : (     transform: 'translateY(-2px)',
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: theme.textColor, opacity: 0.7 }}>
                  No links have been added yet.
                </Typography>
              </Box>ink.title}
            )}  </Button>
          </Box>
            ) : (
          {/* Footer */} textAlign: 'center', py: 4 }}>
          <Typography raphy variant="body1" sx={{ color: theme.textColor, opacity: 0.7 }}>
            variant="body2" ave been added yet.
            align="center"hy>
            sx={{ x>
              mt: 'auto', 
              pt: 4,
              opacity: 0.7,
              color: theme.textColor
            }}ography 
          > variant="body2" 
            Created with Creatorino
          </Typography>
        </Box>mt: 'auto', 
      </Box>  pt: 4,
    </>       opacity: 0.7,
  );          color: theme.textColor
}           }}
          >
            Created with Creatorino
          </Typography>
        </Box>
      </Box>
    </>
  );
}