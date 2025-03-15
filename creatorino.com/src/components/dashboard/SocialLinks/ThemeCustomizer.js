// components/dashboard/SocialLinks/ThemeCustomizer.js
import React, { useState } from 'react';
import { 
  Box, Paper, Typography, Grid, Card, CardContent, CardMedia, 
  Radio, RadioGroup, FormControlLabel, TextField, Button,
  Tabs, Tab, Divider, InputLabel, MenuItem, FormControl, Select
} from '@mui/material';
import { THEME_OPTIONS, FONT_OPTIONS, BUTTON_STYLES } from './utils';
import LinkPreview from './LinkPreview';

export default function ThemeCustomizer({ profile, updateProfile }) {
  const [customization, setCustomization] = useState({
    theme_id: profile.theme_id || THEME_OPTIONS[0].id,
    title: profile.title || '',
    bio: profile.bio || '',
    button_style: profile.button_style || 'rounded',
    font_family: profile.font_family || 'Inter',
    background_type: profile.background_type || 'color',
    background_value: profile.background_value || '#ffffff'
  });
  
  const [activeTab, setActiveTab] = useState(0);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomization(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleSave = () => {
    updateProfile(customization);
  };
  
  // Create a merged profile for the preview
  const previewProfile = {
    ...profile,
    ...customization
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Box>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Themes" />
              <Tab label="Appearance" />
              <Tab label="Text" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {/* Theme Selection */}
              {activeTab === 0 && (
                <RadioGroup 
                  name="theme_id" 
                  value={customization.theme_id}
                  onChange={handleChange}
                >
                  <Grid container spacing={2}>
                    {THEME_OPTIONS.map(theme => (
                      <Grid item xs={6} sm={4} key={theme.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer', 
                            border: theme.id === customization.theme_id ? '2px solid' : '1px solid',
                            borderColor: theme.id === customization.theme_id ? 'primary.main' : 'divider',
                            height: '100%'
                          }}
                          onClick={() => setCustomization(prev => ({ ...prev, theme_id: theme.id }))}
                        >
                          <CardMedia
                            component="img"
                            height="120"
                            image={theme.thumbnail_url || '/images/theme-placeholder.jpg'}
                            alt={theme.name}
                          />
                          <CardContent sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Radio 
                                checked={theme.id === customization.theme_id} 
                                size="small"
                              />
                              <Typography variant="body2">{theme.name}</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              )}
              
              {/* Appearance Settings */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Button Style</Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Button Style</InputLabel>
                    <Select
                      name="button_style"
                      value={customization.button_style}
                      onChange={handleChange}
                      label="Button Style"
                    >
                      {BUTTON_STYLES.map(style => (
                        <MenuItem key={style.value} value={style.value}>
                          {style.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>Font</Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Font Family</InputLabel>
                    <Select
                      name="font_family"
                      value={customization.font_family}
                      onChange={handleChange}
                      label="Font Family"
                    >
                      {FONT_OPTIONS.map(font => (
                        <MenuItem key={font.value} value={font.value}>
                          {font.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>Background</Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Background Type</InputLabel>
                    <Select
                      name="background_type"
                      value={customization.background_type}
                      onChange={handleChange}
                      label="Background Type"
                    >
                      <MenuItem value="color">Solid Color</MenuItem>
                      <MenuItem value="gradient">Gradient</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {customization.background_type === 'color' && (
                    <TextField
                      fullWidth
                      margin="normal"
                      name="background_value"
                      label="Background Color"
                      value={customization.background_value}
                      onChange={handleChange}
                      type="color"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                  
                  {customization.background_type === 'gradient' && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Start Color"
                          type="color"
                          value={customization.background_value.split(',')[0] || '#ffffff'}
                          onChange={(e) => {
                            const endColor = customization.background_value.split(',')[1] || '#f0f0f0';
                            setCustomization(prev => ({ 
                              ...prev, 
                              background_value: `${e.target.value},${endColor}` 
                            }));
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="End Color"
                          type="color"
                          value={customization.background_value.split(',')[1] || '#f0f0f0'}
                          onChange={(e) => {
                            const startColor = customization.background_value.split(',')[0] || '#ffffff';
                            setCustomization(prev => ({ 
                              ...prev, 
                              background_value: `${startColor},${e.target.value}` 
                            }));
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}
              
              {/* Text Content */}
              {activeTab === 2 && (
                <Box>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="title"
                    label="Profile Title"
                    value={customization.title}
                    onChange={handleChange}
                    placeholder="Your Name or Brand"
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    name="bio"
                    label="Bio"
                    value={customization.bio}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="Tell visitors a bit about yourself..."
                  />
                </Box>
              )}
            </Box>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Grid>
      
      {/* Live Preview */}
      <Grid item xs={12} md={5}>
        <Box sx={{ position: 'sticky', top: '1rem' }}>
          <Typography variant="subtitle1" gutterBottom>Live Preview</Typography>
          <Paper sx={{ 
            overflow: 'hidden', 
            height: 500, 
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ 
              flex: 1, 
              overflow: 'auto',
              p: 2
            }}>
              <LinkPreview 
                profile={previewProfile} 
                // Use demo links if none exist yet
                links={profile.links || [
                  { id: 'preview-1', title: 'YouTube', url: '#', platform_key: 'youtube' },
                  { id: 'preview-2', title: 'Twitter', url: '#', platform_key: 'twitter' },
                  { id: 'preview-3', title: 'My Website', url: '#' }
                ]}
                isPreview={true}
              />
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}