// src/components/dashboard/SocialLinks/index.js
import React, { useState } from 'react';
import { Box, Tabs, Tab, Button, Typography, Paper, Grid, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
  IconButton, Divider, Card, CardContent, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';
import BarChartIcon from '@mui/icons-material/BarChart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PublicIcon from '@mui/icons-material/Public';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { FullPageLoader } from '../../common/LoadingState';

import { COLOR_THEMES, PLATFORM_OPTIONS, isValidUrl } from './utils';

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

export default function SocialLinksTab() {
  const [activeSection, setActiveSection] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // State for links and profile
  const [links, setLinks] = useState([]);
  const [profile, setProfile] = useState({
    title: 'Your Name',
    bio: 'Your bio goes here',
    themeId: 'default',
    button_style: 'rounded',
    font_family: 'Inter',
    background_type: 'color',
    background_value: '#ffffff'
  });
  
  // Link form dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    platform_key: '',
    description: ''
  });
  
  // Handle section changes
  const handleSectionChange = (event, newValue) => {
    setActiveSection(newValue);
  };

  // ===== LINK MANAGEMENT FUNCTIONS =====
  
  // Add a new link
  const addLink = (linkData) => {
    const newLink = {
      id: Date.now().toString(), // Temporary ID (Supabase will provide real IDs)
      ...linkData
    };
    setLinks([...links, newLink]);
    
    // In the future, this would save to Supabase
    console.log('Added link:', newLink);
  };
  
  // Update an existing link
  const updateLink = (id, linkData) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, ...linkData } : link
    ));
    
    // In the future, this would update in Supabase
    console.log('Updated link:', id, linkData);
  };
  
  // Delete a link
  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
    
    // In the future, this would delete from Supabase
    console.log('Deleted link:', id);
  };
  
  // Reorder links (not implemented yet)
  const reorderLinks = () => {
    console.log('reorderLinks called');
  };
  
  // Update profile settings
  const updateProfile = (newData) => {
    setProfile({...profile, ...newData});
    
    // In the future, this would update in Supabase
    console.log('Updated profile:', newData);
  };

  // ===== DIALOG HANDLERS =====
  
  // Open dialog to add new link
  const handleAddNew = () => {
    setCurrentLink(null);
    setFormData({ title: '', url: '', platform_key: '', description: '' });
    setDialogOpen(true);
  };

  // Open dialog to edit existing link
  const handleEdit = (link) => {
    setCurrentLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      platform_key: link.platform_key || '',
      description: link.description || ''
    });
    setDialogOpen(true);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-populate title based on platform selection
    if (name === 'platform_key' && value) {
      const platform = PLATFORM_OPTIONS.find(p => p.key === value);
      if (platform && !formData.title) {
        setFormData(prev => ({ ...prev, title: platform.name }));
      }
    }
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    updateProfile({ [name]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (currentLink) {
      updateLink(currentLink.id, formData);
    } else {
      addLink(formData);
    }
    setDialogOpen(false);
  };

  // Get icon for a specific platform
  const getIcon = (platformKey) => {
    return platformIcons[platformKey] || platformIcons.default;
  };
  
  // Get the selected theme
  const getSelectedTheme = () => {
    return COLOR_THEMES.find(theme => theme.id === profile.themeId) || COLOR_THEMES[0];
  };
  
  const theme = getSelectedTheme();

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
        <Grid container spacing={3}>
          {/* Left sidebar navigation */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ height: '100%' }}>
              <Tabs 
                value={activeSection} 
                onChange={handleSectionChange} 
                aria-label="social links sections"
                orientation="vertical"
                variant="fullWidth"
                sx={{ 
                  borderRight: 1, 
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 3,
                    px: 3,
                    minHeight: 'auto',
                  },
                  '& .MuiTab-iconWrapper': {
                    mr: 1,
                    mb: 0
                  }
                }}
              >
                <Tab icon={<AddIcon />} label="Manage Links" iconPosition="start" />
                <Tab icon={<PaletteIcon />} label="Customize" iconPosition="start" />
                <Tab icon={<BarChartIcon />} label="Analytics" iconPosition="start" />
                <Tab icon={<VisibilityIcon />} label="Preview" iconPosition="start" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Main content area */}
          <Grid item xs={12} md={9}>
            {/* Manage Links Section */}
            <Box sx={{ display: activeSection === 0 ? 'block' : 'none' }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Your Links</Typography>
                  <Button 
                    variant="contained" 
                    onClick={handleAddNew}
                    size="small"
                    startIcon={<AddIcon />}
                  >
                    Add New Link
                  </Button>
                </Box>
                
                <Paper sx={{ mb: 3 }}>
                  <List>
                    {links.map((link, index) => (
                      <React.Fragment key={link.id || index}>
                        <ListItem>
                          <ListItemIcon>
                            {getIcon(link.platform_key)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={link.title} 
                            secondary={link.url}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleEdit(link)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => deleteLink(link.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < links.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Box>
            </Box>
            
            {/* Customize Theme Section */}
            <Box sx={{ display: activeSection === 1 ? 'block' : 'none' }}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Customize Your Page</Typography>
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="title"
                  label="Your Name/Title"
                  value={profile.title}
                  onChange={handleProfileChange}
                  placeholder="Your Name or Brand"
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="bio"
                  label="Bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  multiline
                  rows={2}
                  placeholder="Tell visitors a bit about yourself..."
                />
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Choose a Theme</Typography>
                  <RadioGroup 
                    row
                    name="themeId" 
                    value={profile.themeId}
                    onChange={handleProfileChange}
                  >
                    <Grid container spacing={2}>
                      {COLOR_THEMES.map(theme => (
                        <Grid item xs={6} sm={4} key={theme.id}>
                          <Card 
                            sx={{ 
                              cursor: 'pointer', 
                              border: theme.id === profile.themeId ? '2px solid' : '1px solid',
                              borderColor: theme.id === profile.themeId ? 'primary.main' : 'divider',
                              height: '100%'
                            }}
                            onClick={() => updateProfile({ themeId: theme.id })}
                          >
                            <Box sx={{ 
                              height: 60, 
                              backgroundColor: theme.backgroundColor,
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center'
                            }}>
                              <Box 
                                sx={{ 
                                  width: 40, 
                                  height: 20, 
                                  backgroundColor: theme.buttonColor,
                                  borderRadius: '4px'
                                }} 
                              />
                            </Box>
                            <CardContent sx={{ p: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Radio 
                                  checked={theme.id === profile.themeId} 
                                  size="small"
                                />
                                <Typography variant="caption">{theme.name}</Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Button Style</Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Button Style</InputLabel>
                    <Select
                      name="button_style"
                      value={profile.button_style}
                      onChange={handleProfileChange}
                      label="Button Style"
                    >
                      <MenuItem value="rounded">Rounded</MenuItem>
                      <MenuItem value="pill">Pill</MenuItem>
                      <MenuItem value="square">Square</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </Box>
            
            {/* Analytics Section */}
            <Box sx={{ display: activeSection === 2 ? 'block' : 'none' }}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <BarChartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Analytics Coming Soon
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track clicks and engagement on your social links.
                </Typography>
              </Paper>
            </Box>
            
            {/* Preview Section */}
            <Box sx={{ display: activeSection === 3 ? 'block' : 'none' }}>
              <Paper sx={{ 
                overflow: 'hidden', 
                minHeight: 500,
                bgcolor: theme.backgroundColor,
                color: theme.textColor,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3
              }}>
                <Box
                  sx={{
                    maxWidth: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 3
                  }}
                >
                  {/* Profile Avatar */}
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mb: 2,
                      bgcolor: theme.buttonColor,
                      color: theme.buttonTextColor
                    }}
                  >
                    {profile.title.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  {/* Profile Title */}
                  <Typography 
                    variant="h5" 
                    align="center" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: theme.textColor
                    }}
                  >
                    {profile.title}
                  </Typography>
                  
                  {/* Bio */}
                  {profile.bio && (
                    <Typography 
                      variant="body1" 
                      align="center" 
                      sx={{ 
                        mb: 3,
                        color: theme.textColor,
                        maxWidth: '80%'
                      }}
                    >
                      {profile.bio}
                    </Typography>
                  )}
                  
                  {/* Links */}
                  <Box sx={{ width: '100%', mt: 2, maxWidth: 400, mx: 'auto' }}>
                    {links.map((link) => (
                      <Button
                        key={link.id}
                        fullWidth
                        variant="contained"
                        startIcon={getIcon(link.platform_key)}
                        sx={{
                          mb: 2,
                          p: 1.5,
                          borderRadius: profile.button_style === 'rounded' ? '8px' : 
                                       profile.button_style === 'pill' ? '50px' : '0px',
                          backgroundColor: theme.buttonColor,
                          color: theme.buttonTextColor,
                          justifyContent: 'flex-start',
                          pl: 3
                        }}
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
                      mt: 'auto', 
                      pt: 4,
                      opacity: 0.7,
                      color: theme.textColor
                    }}
                  >
                    Created with Social Links
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      )}
      
      {/* Add/Edit Link Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                name="platform_key"
                value={formData.platform_key}
                onChange={handleChange}
                label="Platform"
              >
                <MenuItem value="">Custom Link</MenuItem>
                {PLATFORM_OPTIONS.map(platform => (
                  <MenuItem key={platform.key} value={platform.key}>
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              margin="dense"
              name="title"
              label="Link Title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              margin="dense"
              name="url"
              label="URL"
              value={formData.url}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              placeholder="https://example.com"
              helperText={formData.url && !isValidUrl(formData.url) ? "Please enter a valid URL" : ""}
              error={formData.url && !isValidUrl(formData.url)}
            />
            
            <TextField
              fullWidth
              margin="dense"
              name="description"
              label="Description (Optional)"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.title || !formData.url || !isValidUrl(formData.url)}
          >
            {currentLink ? 'Save Changes' : 'Add Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}