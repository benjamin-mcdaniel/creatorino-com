import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Button, Typography, Paper, Grid, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Radio, RadioGroup, FormControlLabel, 
  Snackbar, Alert, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';
import BarChartIcon from '@mui/icons-material/BarChart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';
import SaveIcon from '@mui/icons-material/Save';
import { FullPageLoader } from '../../common/LoadingState';
import useAuth from '../../../lib/useAuth';
import { COLOR_THEMES, PLATFORM_OPTIONS, getIcon, isValidUrl, ensureUrlProtocol } from './utils';
import DebugPanel from './debug';
import { useSocialLinksManager } from './hooks';

export default function SocialLinksTab() {
  const { user, loading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState(0);
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Use the custom hook to manage social links functionality
  const { 
    loading,
    links, 
    profile, 
    setProfile, // Add this line to get setProfile from the hook
    notification,
    dialogOpen,
    currentLink,
    formData,
    refreshData,
    addLink,
    updateLink,
    deleteLink,
    updateProfile,
    showNotification,
    closeNotification,
    handleAddNew,
    handleEdit,
    handleChange,
    handleProfileChange,
    handleSubmit,
    setDialogOpen,
    getPublicLinkUrl
  } = useSocialLinksManager(user);
  
  // Handle section changes
  const handleSectionChange = (event, newValue) => {
    setActiveSection(newValue);
  };
  
  // Get the selected theme
  const getSelectedTheme = () => {
    return COLOR_THEMES.find(theme => theme.id === profile.themeId) || COLOR_THEMES[0];
  };
  
  const theme = getSelectedTheme();

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Handle manual refresh - This is the reliable method that also creates default data if none exists
  const handleRefresh = async () => {
    console.log('Manual refresh requested - will initialize if needed');
    await refreshData(); // This runs the full initialization + data loading
    console.log('Manual refresh completed, links:', links.length);
  };
  
  // Save profile settings
  const handleSaveSettings = async () => {
    console.log('Saving profile settings...');
    await updateProfile(profile);
    setUnsavedChanges(false);
  };

  // Modified profile change handler to track unsaved changes instead of auto-saving
  const handleProfileChangeWithoutSave = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({...prev, [name]: value}));
    setUnsavedChanges(true);
  };

  // Handle theme selection without auto-saving
  const handleThemeSelection = (themeId) => {
    setProfile(prev => ({...prev, themeId}));
    setUnsavedChanges(true);
  };

  // Component first load - if no links found, trigger full refresh
  useEffect(() => {
    if (links.length === 0 && !loading && !authLoading) {
      console.log('No links found on load, triggering full refresh with initialization');
      handleRefresh();
    }
  }, [links.length, loading, authLoading]);

  // Toggle debug panel
  const toggleDebugPanel = () => {
    setShowDebugPanel(prev => !prev);
  };

  // Completely separate loading debug panel from popup debug panel
  // Make sure it's invisible until fully loaded
  if ((loading || authLoading) && !overrideLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <FullPageLoader />
        <Box sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          zIndex: 9999,
          visibility: 'hidden',  // Start with hidden visibility
          opacity: 0,  // Start with zero opacity
          pointerEvents: 'none'  // Prevent any interaction before visible
        }}>
          <DebugPanel 
            user={user}
            loading={loading}
            authLoading={authLoading}
            links={links}
            profile={profile}
            dialogOpen={dialogOpen}
            refreshData={refreshData}
            setOverrideLoading={setOverrideLoading}
            showFullPageLoader={false}  // Don't show another loader
            isDebugPopup={false}  // Not a popup but a fixed panel
          />
        </Box>
      </Box>
    );
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
            Manage your social media links and create a custom landing page.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {unsavedChanges && (
            <Button 
              variant="contained" 
              onClick={handleSaveSettings}
              startIcon={<SaveIcon />}
              color="primary"
              sx={{ mr: 1 }}
            >
              Save
            </Button>
          )}
          
          {/* Preview button - show in all environments */}
          <Button 
            variant="outlined" 
            component="a"
            href={getPublicLinkUrl()}
            target="_blank"
            startIcon={<VisibilityIcon />}
            sx={{ mr: 1 }}
          >
            Preview
          </Button>
          
          {/* Development-only buttons */}
          {isDevelopment && (
            <>
              <Button 
                variant="outlined" 
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
                color="secondary"
                size="small"
                sx={{ mr: 1 }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                onClick={toggleDebugPanel}
                startIcon={<BugReportIcon />}
                color="info"
                size="small"
              >
                Debug
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      {/* Main content section */}
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
              
              {/* Links table or empty state */}
              {Array.isArray(links) && links.length > 0 ? (
                <Paper sx={{ mb: 3, overflow: 'auto' }}>
                  <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <Box component="thead" sx={{ bgcolor: 'background.default' }}>
                      <Box component="tr">
                        <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Platform</Box>
                        <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Title</Box>
                        <Box component="th" sx={{ p: 2, textAlign: 'left' }}>URL</Box>
                        <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Nickname</Box>
                        <Box component="th" sx={{ p: 2, textAlign: 'right' }}>Actions</Box>
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {console.log('Rendering links in table:', links ? links.length : 0)}
                      {links.map((link, index) => (
                        <Box 
                          component="tr" 
                          key={link.id || index}
                          sx={{ 
                            '&:nth-of-type(odd)': { 
                              bgcolor: 'action.hover' 
                            },
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box component="td" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getIcon(link.platform_key)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {link.platform_key || 'Custom'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box component="td" sx={{ p: 2 }}>
                            <Typography variant="body2">{link.title}</Typography>
                          </Box>
                          <Box component="td" sx={{ p: 2 }}>
                            <Typography 
                              variant="body2" 
                              component="a" 
                              href={ensureUrlProtocol(link.url)} 
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              {link.url}
                            </Typography>
                          </Box>
                          <Box component="td" sx={{ p: 2 }}>
                            <Typography variant="body2">{link.nickname || '-'}</Typography>
                          </Box>
                          <Box component="td" sx={{ p: 2, textAlign: 'right' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEdit(link)} 
                              sx={{ ml: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => deleteLink(link.id)} 
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              ) : (
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
                    onClick={handleAddNew}
                  >
                    Add Your First Link
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleRefresh} // This will initialize settings and create default links if needed
                    startIcon={<RefreshIcon />}
                    sx={{ mt: 2, display: 'block', mx: 'auto' }}
                  >
                    Refresh Links
                  </Button>
                </Paper>
              )}
            </Box>
          </Box>
          
          {/* Customize Theme Section */}
          <Box sx={{ display: activeSection === 1 ? 'block' : 'none' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>Customize Your Page</Typography>
                <Button 
                  variant="contained" 
                  onClick={handleSaveSettings}
                  disabled={!unsavedChanges}
                  size="small"
                >
                  Save Changes
                </Button>
              </Box>
              
              <TextField
                fullWidth
                margin="normal"
                name="title"
                label="Your Name/Title"
                value={profile.title || ''}
                onChange={handleProfileChangeWithoutSave}
                placeholder="Your Name or Brand"
              />
              
              <TextField
                fullWidth
                margin="normal"
                name="bio"
                label="Bio"
                value={profile.bio || ''}
                onChange={handleProfileChangeWithoutSave}
                multiline
                rows={2}
                placeholder="Tell visitors a bit about yourself..."
              />
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Choose a Theme</Typography>
                <RadioGroup 
                  row
                  name="themeId" 
                  value={profile.themeId || 'default'}
                  onChange={handleProfileChangeWithoutSave}
                >
                  <Grid container spacing={2}>
                    {COLOR_THEMES.map(theme => (
                      <Grid item xs={6} sm={4} key={theme.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer', 
                            border: theme.id === (profile.themeId || 'default') ? '2px solid' : '1px solid',
                            borderColor: theme.id === (profile.themeId || 'default') ? 'primary.main' : 'divider',
                            height: '100%'
                          }}
                          onClick={() => handleThemeSelection(theme.id)}
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
                                checked={theme.id === (profile.themeId || 'default')} 
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
                    value={profile.button_style || 'rounded'}
                    onChange={handleProfileChangeWithoutSave}
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
                  {(profile.title || '?').charAt(0).toUpperCase()}
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
                  {profile.title || 'Your Name'}
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
                  {Array.isArray(links) && links.length > 0 ? (
                    links.map((link) => (
                      <Button
                        key={link.id}
                        fullWidth
                        variant="contained"
                        component="a"
                        href={ensureUrlProtocol(link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
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
                    ))
                  ) : (
                    <Typography 
                      variant="body1" 
                      align="center" 
                      sx={{ 
                        color: theme.textColor,
                        opacity: 0.7,
                        my: 4
                      }}
                    >
                      No links added yet. Add links in the "Manage Links" tab.
                    </Typography>
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
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Add/Edit Link Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                name="platform_key"
                value={formData.platform_key || ''}
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
              value={formData.title || ''}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              margin="dense"
              name="url"
              label="URL"
              value={formData.url || ''}
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
              value={formData.description || ''}
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
      
      {/* Debug Panel (as popup from bottom right) - ONLY shown when explicitly toggled */}
      {isDevelopment && showDebugPanel && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          zIndex: 9999,
          width: 600, 
          maxWidth: '90vw',
          maxHeight: '80vh',
          boxShadow: 5,
          opacity: 1,
          visibility: 'visible',
          // Prevent any transition on initial render to avoid flash
          transition: showDebugPanel ? 'all 0.3s ease-in-out' : 'none',
          animation: showDebugPanel ? 'slideIn 0.3s ease-out' : 'none',
          '@keyframes slideIn': {
            '0%': {
              transform: 'translateY(100%)',
              opacity: 0
            },
            '100%': {
              transform: 'translateY(0)',
              opacity: 1
            }
          }
        }}>
          <DebugPanel 
            user={user}
            loading={loading}
            authLoading={authLoading}
            links={links}
            profile={profile}
            dialogOpen={dialogOpen}
            refreshData={refreshData}
            setOverrideLoading={setOverrideLoading}
            showFullPageLoader={false}
            isDebugPopup={true}
            onClose={toggleDebugPanel}
          />
        </Box>
      )}
      
      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}