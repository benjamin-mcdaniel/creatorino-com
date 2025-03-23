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

// This enables static generation for the paths we know about at build time
export async function getStaticPaths() {
  // Get all nicknames from profiles table to pre-generate pages
  const { data, error } = await supabase
    .from('profiles')
    .select('nickname')
    .not('nickname', 'is', null);
    
  if (error || !data) {
    console.error('Error fetching profiles for static paths:', error);
    return {
      paths: [],
      fallback: 'blocking' // Use blocking to ensure page loads even for new users
    };
  }
  
  // Create paths for each nickname
  const paths = data
    .filter(profile => profile.nickname) // Only include profiles with nicknames
    .map(profile => ({
      params: { username: profile.nickname }
    }));
    
  return {
    paths,
    fallback: 'blocking' // This ensures new users still work after build time
  };
}

// This provides the data for each path - both at build time and on-demand
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
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else if (profileData) {
      profile = profileData;
      
      // Find settings for this user
      const { data: settingsData, error: settingsError } = await supabase
        .from('social_links_settings')
        .select('*')
        .eq('user_id', profile.id)
        .single();
        
      if (!settingsError && settingsData) {
        settings = settingsData;
      }
      
      // Get links by nickname
      const { data: linksData, error: linksError } = await supabase
        .from('social_links')
        .select('*')
        .eq('nickname', username)
        .order('sort_order');
        
      if (!linksError && linksData) {
        links = linksData;
      }
    }
    
    // Return 404 if no profile or settings found
    if (!profile || !settings) {
      return {
        notFound: true
      };
    }
    
    return {
      props: {
        profile,
        settings,
        links,
        username
      },
      // Revalidate every hour to pick up new changes
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true
    };
  }
}

// Your component using the props
function UserLinksPage({ profile, settings, links, username }) {
  const router = useRouter();
  
  // If the page is still generating, show a loading state
  if (router.isFallback) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">Loading {username}'s links...</Typography>
      </Box>
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

export default UserLinksPage;