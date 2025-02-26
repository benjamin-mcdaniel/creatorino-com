// src/components/dashboard/index.js
import React, { useState } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LinkIcon from '@mui/icons-material/Link';

import PageHeader from '../common/PageHeader';


export default function DashboardContent({ user }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 2, pb: 6 }}>
      <Container maxWidth="lg">
        <PageHeader 
          user={user} 
          title={`Welcome back, ${user.email?.split('@')[0]}`}
          subtitle="Here's an overview of your platforms and recent performance."
        />

        {/* Platform selection tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="platform tabs">
            <Tab icon={<EqualizerIcon />} label="Overview" />
            <Tab icon={<YouTubeIcon />} label="YouTube" />
            <Tab icon={<SportsEsportsIcon />} label="Twitch" />
            <Tab icon={<LinkIcon />} label="Social Links" />
          </Tabs>
        </Box>

        {/* Tab content */}


      </Container>
    </Box>
  );
}