import React, { useState } from 'react';
import { Box, Container, Grid, Tabs, Tab, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DirectoryTab from './DirectoryTab';

// Import your other dashboard components as needed

export default function DashboardContent() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="dashboard navigation tabs"
          >
            <Tab icon={<HomeIcon />} label="Dashboard" iconPosition="start" />
            <Tab icon={<VideoLibraryIcon />} label="Videos" iconPosition="start" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" iconPosition="start" />
            <Tab icon={<SupervisedUserCircleIcon />} label="Directory" iconPosition="start" />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {currentTab === 0 && (
            <Box>
              {/* Dashboard Overview Content */}
              <h2>Dashboard Overview</h2>
              {/* Your dashboard widgets here */}
            </Box>
          )}
          
          {currentTab === 1 && (
            <Box>
              {/* Videos Content */}
              <h2>Videos</h2>
              {/* Your videos content here */}
            </Box>
          )}
          
          {currentTab === 2 && (
            <Box>
              {/* Analytics Content */}
              <h2>Analytics</h2>
              {/* Your analytics content here */}
            </Box>
          )}
          
          {currentTab === 3 && (
            <DirectoryTab />
          )}
        </Box>
      </Paper>
    </Container>
  );
}
