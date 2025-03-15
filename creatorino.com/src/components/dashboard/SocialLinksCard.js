// src/components/dashboard/SocialLinksCard.js
import React from 'react';
import { Typography, Paper, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Button, Skeleton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkIcon from '@mui/icons-material/Link';

import useSocialLinks from '../../hooks/useSocialLinks';

export default function SocialLinksCard() {
  const { links, loading } = useSocialLinks();

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="medium">
          Social Links
        </Typography>
        <Button color="primary" size="small">Manage</Button>
      </Box>

      {loading ? (
        // Loading state
        <>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ display: 'inline-block', mr: 2, verticalAlign: 'middle' }} />
              <Skeleton variant="text" width={150} sx={{ display: 'inline-block', verticalAlign: 'middle' }} />
            </Box>
          ))}
        </>
      ) : links && links.length > 0 ? (
        // Links found
        <List disablePadding>
          {links.map((link, index) => (
            <React.Fragment key={link.id || index}>
              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {getIconForPlatform(link.platform)}
                </ListItemIcon>
                <ListItemText 
                  primary={link.platform} 
                  secondary={
                    // The issue is here - using MUI's Link inside ListItemText creates nested <a> tags
                    // Replace with a simple Box with styling instead
                    <Box 
                      component="a"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {formatLinkUrl(link.url)}
                    </Box>
                  }
                />
              </ListItem>
              {index < links.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        // No links yet
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            No social links added yet
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<LinkIcon />}
            sx={{ mt: 1 }}
          >
            Add First Link
          </Button>
        </Box>
      )}
    </Paper>
  );
}

// Helper functions
function getIconForPlatform(platform) {
  const lowercase = platform.toLowerCase();
  
  if (lowercase.includes('twitter') || lowercase.includes('x.com')) {
    return <TwitterIcon fontSize="small" />;
  } else if (lowercase.includes('instagram')) {
    return <InstagramIcon fontSize="small" />;
  } else if (lowercase.includes('facebook')) {
    return <FacebookIcon fontSize="small" />;
  } else {
    return <LinkIcon fontSize="small" />;
  }
}

function formatLinkUrl(url) {
  try {
    // Remove protocol and trailing slash
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  } catch (e) {
    return url;
  }
}