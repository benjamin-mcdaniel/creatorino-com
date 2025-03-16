// src/components/dashboard/SocialLinks/LinkManager.js
import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, IconButton, List, 
  ListItem, ListItemText, ListItemSecondaryAction, Divider, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// Removed the import for react-beautiful-dnd
import { PLATFORM_OPTIONS } from '../utils';

export default function LinkManager({ links, addLink, updateLink, deleteLink, reorderLinks }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    platform_key: '',
    description: ''
  });

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
    if (name === 'platform_key') {
      const platform = PLATFORM_OPTIONS.find(p => p.key === value);
      if (platform && !formData.title) {
        setFormData(prev => ({ ...prev, title: platform.name }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (currentLink) {
      // Update existing link
      updateLink(currentLink.id, formData);
    } else {
      // Add new link
      addLink(formData);
    }
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Your Links</Typography>
        <Button 
          variant="contained" 
          onClick={handleAddNew}
          size="small"
        >
          Add New Link
        </Button>
      </Box>
      
      {links.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            You don't have any links yet. Create your first link to get started.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleAddNew}
          >
            Create First Link
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ mb: 3 }}>
          <List>
            {links.map((link, index) => (
              <React.Fragment key={link.id || index}>
                <ListItem>
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
            disabled={!formData.title || !formData.url}
          >
            {currentLink ? 'Save Changes' : 'Add Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}