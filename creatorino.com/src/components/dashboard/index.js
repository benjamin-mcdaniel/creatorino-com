// src/components/dashboard/index.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LinkIcon from '@mui/icons-material/Link';
import { fetchUserProfile } from '../../lib/profileService';

import PageHeader from '../common/PageHeader';
import DashboardOverview from './DashboardOverview';
import YouTubeTab from './YouTube';
import TwitchTab from './Twitch';
import SocialLinksTab from './SocialLinks';

export default function DashboardContent({ user }) {
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's profile to get the nickname
    async function loadProfile() {
      if (user) {
        try {
          const { data, error } = await fetchUserProfile();
          if (data && !error) {
            setProfile(data);
          }
        } catch (err) {
          console.error('Error loading profile:', err);
        } finally {
          setLoading(false);
        }
      }
    }

    loadProfile();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Get the display name (nickname or fallback to email prefix)
  const getDisplayName = () => {
    if (profile?.nickname) {
      return profile.nickname;
    }
    
    // If we have a first name, use that
    if (profile?.first_name) {
      return profile.first_name;
    }
    
    // Fallback to email prefix if no profile or nickname found
    return user?.email?.split('@')[0] || 'Creator';
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 2, pb: 6 }}>
      <Container maxWidth="lg">
        <PageHeader 
          user={user} 
          title={`Welcome back, ${getDisplayName()}`}
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
        <Box sx={{ py: 2 }}>
          {activeTab === 0 && <DashboardOverview />}
          {activeTab === 1 && <YouTubeTab />}
          {activeTab === 2 && <TwitchTab />}
          {activeTab === 3 && <SocialLinksTab />}
        </Box>
      </Container>
    </Box>
  );
}