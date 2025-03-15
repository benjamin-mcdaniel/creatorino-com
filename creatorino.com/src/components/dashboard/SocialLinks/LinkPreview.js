// components/dashboard/SocialLinks/LinkPreview.js
import React from 'react';
import { Box, Typography, Button, Avatar, Link } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PublicIcon from '@mui/icons-material/Public';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { THEME_OPTIONS } from './utils';

// Map platform keys to icons
const platformIcons = {
  twitter: <TwitterIcon />,
  youtube: <YouTubeIcon />,
  instagram: <InstagramIcon />,
  facebook: <FacebookIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  default: <PublicIcon />
};

export default function LinkPreview({ profile, links, isPreview = false }) {
  // Find the selected theme
  const theme = THEME_OPTIONS.find(t => t.id === profile.theme_id) || THEME_OPTIONS[0];
  
  // Generate background style based on profile settings
  const getBackgroundStyle = () => {
    if (profile.background_type === 'gradient' && profile.background_value) {
      const [startColor, endColor] = profile.background_value.split(',');
      return {
        background: `linear-gradient(to bottom, ${startColor || '#ffffff'}, ${endColor || '#f0f0f0'})`
      };
    }
    
    return {
      backgroundColor: profile.background_value || theme.background_color || '#ffffff'
    };
  };
  
  // Generate button style based on profile settings
  const getButtonStyle = (link) => {
    const baseStyle = {
      width: '100%',
      mb: 2,
      p: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: link.custom_color || theme.button_color || '#333333',
      color: theme.button_text_color || '#ffffff',
      fontFamily: profile.font_family || 'Inter, sans-serif',
      transition: 'transform 0.2s, opacity 0.2s',
      '&:hover': {
        opacity: 0.9,
        transform: 'translateY(-2px)'
      }
    };
    
    // Apply button shape based on profile settings
    switch (profile.button_style) {
      case 'rounded':
        return { ...baseStyle, borderRadius: '8px' };
      case 'pill':
        return { ...baseStyle, borderRadius: '50px' };
      case 'square':
        return { ...baseStyle, borderRadius: '0px' };
      default:
        return { ...baseStyle, borderRadius: '8px' };
    }
  };
  
  // Get icon for a specific platform
  const getIcon = (platformKey) => {
    return platformIcons[platformKey] || platformIcons.default;
  };
  
  return (
    <Box 
      sx={{ 
        ...getBackgroundStyle(),
        minHeight: isPreview ? 'auto' : '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        fontFamily: profile.font_family || 'Inter, sans-serif'
      }}
    >
      <Box
        sx={{
          maxWidth: '500px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4
        }}
      >
        {/* Profile Avatar */}
        <Avatar 
          src={profile.avatar_url} 
          alt={profile.title || "Profile"}
          sx={{ 
            width: 100, 
            height: 100, 
            mb: 2,
            border: `3px solid ${theme.primary_color || '#000000'}`
          }}
        >
          {(profile.title || "P").charAt(0).toUpperCase()}
        </Avatar>
        
        {/* Profile Title */}
        <Typography 
          variant="h5" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: theme.text_color || '#000000',
            fontFamily: 'inherit'
          }}
        >
          {profile.title || "Your Name"}
        </Typography>
        
        {/* Bio */}
        {profile.bio && (
          <Typography 
            variant="body1" 
            align="center" 
            paragraph
            sx={{ 
              mb: 3,
              color: theme.text_color || '#000000',
              fontFamily: 'inherit',
              maxWidth: '80%'
            }}
          >
            {profile.bio}
          </Typography>
        )}
        
        {/* Links */}
        <Box sx={{ width: '100%', mt: 2 }}>
          {links.map((link) => (
            <Button
              key={link.id}
              component={isPreview ? 'button' : 'a'}
              href={isPreview ? undefined : link.url}
              target={isPreview ? undefined : "_blank"}
              rel={isPreview ? undefined : "noopener noreferrer"}
              variant="contained"
              startIcon={getIcon(link.platform_key)}
              disableElevation
              sx={getButtonStyle(link)}
            >
              {link.title}
            </Button>
          ))}
        </Box>
        
        {/* Footer */}
        <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            mt: 4, 
            opacity: 0.7,
            color: theme.text_color || '#000000',
            fontFamily: 'inherit'
          }}
        >
          Created with Creatorino
          {isPreview && (
            <Typography component="span" sx={{ ml: 1 }}>
              (Preview Mode)
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>
  );
}