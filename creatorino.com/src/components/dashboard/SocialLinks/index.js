// src/components/dashboard/SocialLinks/index.js
import React, { useState } from 'react';
import { Box, Tabs, Tab, Button, Typography, Paper, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';
import BarChartIcon from '@mui/icons-material/BarChart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import { FullPageLoader } from '../../common/LoadingState';

import useSocialLinks from '../../../hooks/useSocialLinks';
import LinkManager from './LinkManager';
import ThemeCustomizer from './ThemeCustomizer';
import Analytics from './Analytics';
import LinkPreview from './LinkPreview';
import { THEME_OPTIONS } from './utils';

export default function SocialLinksTab() {
  const [activeSection, setActiveSection] = useState(0);
  const { links, loading } = useSocialLinks();
  
  // Default profile object to prevent undefined errors
  const defaultProfile = {
    theme_id: THEME_OPTIONS[0].id,
    title: '',
    bio: '',
    button_style: 'rounded',
    font_family: 'Inter',
    background_type: 'color',
    background_value: '#ffffff'
  };
  
  // Mock functions for now - would be implemented in useSocialLinks hook
  const updateProfile = () => console.log('updateProfile called');
  const addLink = () => console.log('addLink called');
  const updateLink = () => console.log('updateLink called');
  const deleteLink = () => console.log('deleteLink called');
  const reorderLinks = () => console.log('reorderLinks called');
  
  const handleSectionChange = (event, newValue) => {
    setActiveSection(newValue);
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <Box>
      {/* Header section */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Social Links
          </Typography>
          <Typography variant="body1">
            Manage your social media links and create a custom landing page for your audience.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<LinkIcon />}
            onClick={() => setActiveSection(0)}
          >
            Add Social Link
          </Button>
        </Grid>
      </Grid>

      {/* Only show "No links" message if there are no links and we're in the first tab */}
      {links.length === 0 && activeSection === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            No social links yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add your first social media link to create your custom landing page.
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<LinkIcon />}
            onClick={() => {
              // Logic to add first link would go here
              addLink({
                title: 'My Website',
                url: 'https://example.com',
                platform_key: '',
                description: 'My personal website'
              });
            }}
          >
            Add Your First Link
          </Button>
        </Paper>
      ) : (
        <>
          {/* Navigation tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeSection} onChange={handleSectionChange} aria-label="social links sections">
              <Tab icon={<AddIcon />} label="Manage Links" />
              <Tab icon={<PaletteIcon />} label="Customize" />
              <Tab icon={<BarChartIcon />} label="Analytics" />
              <Tab icon={<VisibilityIcon />} label="Preview" />
            </Tabs>
          </Paper>

          {/* Content sections */}
          <Box sx={{ display: activeSection === 0 ? 'block' : 'none' }}>
            <LinkManager 
              links={links} 
              addLink={addLink}
              updateLink={updateLink}
              deleteLink={deleteLink}
              reorderLinks={reorderLinks}
            />
          </Box>
          
          <Box sx={{ display: activeSection === 1 ? 'block' : 'none' }}>
            <ThemeCustomizer 
              profile={defaultProfile}
              updateProfile={updateProfile}
            />
          </Box>
          
          <Box sx={{ display: activeSection === 2 ? 'block' : 'none' }}>
            <Analytics links={links} />
          </Box>
          
          <Box sx={{ display: activeSection === 3 ? 'block' : 'none' }}>
            <LinkPreview 
              profile={defaultProfile}
              links={links} 
            />
          </Box>
        </>
      )}
    </Box>
  );
}