// pages/s/[username].js - 100% client-side solution for Cloudflare Pages
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Avatar, Typography, Button, CircularProgress, Container, Alert, Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PublicIcon from '@mui/icons-material/Public';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TiktokIcon from '@mui/icons-material/MusicVideo'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportIcon from '@mui/icons-material/Report';
import LinkIcon from '@mui/icons-material/Link';
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

// Add getInitialProps to make this page compatible with static exports
// By adding this, we ensure Next.js doesn't auto-export the page, 
// allowing us to handle everything client-side
UserLinksPage.getInitialProps = async () => {
  return {}; // Empty props, all data is fetched client-side
};

// Pure client-side approach for Cloudflare Pages compatibility
export default function UserLinksPage() {
  // State for client-side data
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [username, setUsername] = useState(null);
  const [session, setSession] = useState(null);
  const router = useRouter();

  // Simplified report functionality state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Extract username from URL path (this is key for Cloudflare Pages static hosting)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 2) {
        const pathUsername = pathParts[2].replace(/\/$/, ''); // Remove trailing slash if present
        if (pathUsername !== 'fallback') {
          setUsername(pathUsername);
        } else {
          // If we're on the actual fallback page URL (not redirected), show not found
          setNotFound(true);
          setLoading(false);
        }
      } else {
        setNotFound(true);
        setLoading(false);
      }
    }
  }, []);

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    fetchSession();
  }, []);

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

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleReportOpen = () => {
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleReportClose = () => {
    setReportDialogOpen(false);
  };

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    
    try {
      // Check if the user has already been reported
      const { data: existingReport } = await supabase
        .from('reported_users')
        .select('report_count')
        .eq('user_id', profile.id)
        .single();
      
      if (existingReport) {
        // If the user was already reported, increment the count
        const { error: updateError } = await supabase
          .from('reported_users')
          .update({
            report_count: existingReport.report_count + 1,
            last_reported: new Date().toISOString(),
            // Update status based on count
            status: existingReport.report_count + 1 >= 30 ? 'restricted' :
                   existingReport.report_count + 1 >= 20 ? 'warned' :
                   existingReport.report_count + 1 >= 10 ? 'flagged' : 'normal'
          })
          .eq('user_id', profile.id);
          
        if (updateError) throw updateError;
      } else {
        // First report for this user
        const { error: insertError } = await supabase
          .from('reported_users')
          .insert({
            user_id: profile.id,
            report_count: 1,
            status: 'normal'
          });
          
        if (insertError) throw insertError;
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Thank you for reporting this page.',
        severity: 'success'
      });
      
      // Close the dialog
      handleReportClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit report. Please try again later.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  const handleCopyLink = () => {
    const link = `https://creatorino.com/s/${username}`;
    navigator.clipboard.writeText(link).then(() => {
      setSnackbar({
        open: true,
        message: 'Link copied to clipboard',
        severity: 'success'
      });
    });
    handleMenuClose();
  };

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
            The page for @{username || 'this user'} doesn't exist or hasn't been set up yet.
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
          py: 4,
          position: 'relative'
        }}>
          {/* Menu Button - positioned at the top right */}
          <IconButton 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              right: 0,
              color: theme.textColor
            }}
            onClick={handleMenuOpen}
            aria-label="page options"
          >
            {/* Replace MoreVertIcon with "!" text */}
            <Typography 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '20px'
              }}
            >
              !
            </Typography>
          </IconButton>
          
          {/* Options Menu */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleCopyLink}>
              <ListItemIcon>
                <LinkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy Link</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleReportOpen}>
              <ListItemIcon>
                <ReportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Report Page</ListItemText>
            </MenuItem>
          </Menu>
          
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
        
        {/* Simplified Report Dialog */}
        <Dialog 
          open={reportDialogOpen} 
          onClose={handleReportClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Report this page</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to report this page for inappropriate content or behavior?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reports help us maintain a safe and welcoming community. Thank you for your feedback.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReportClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReport} 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Report Page'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Success/Error Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}