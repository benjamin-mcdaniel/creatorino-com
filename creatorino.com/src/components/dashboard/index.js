// src/components/dashboard/index.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LinkIcon from '@mui/icons-material/Link';
import { fetchUserProfile } from '../../lib/profileService';
import { useRouter } from 'next/router';

import PageHeader from '../common/PageHeader';
import DashboardOverview from './DashboardOverview';
import YouTubeTab from './YouTube';
import TwitchTab from './Twitch';
import SocialLinksTab from './SocialLinks';

export default function DashboardContent({ user }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the tab index from URL query parameter or localStorage
  useEffect(() => {
    // First check URL query parameter
    if (router.query.tab) {
      const tabIndex = parseInt(router.query.tab, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 3) {
        setActiveTab(tabIndex);
      }
    } 
    // If no query param, check localStorage
    else if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('dashboardActiveTab');
      if (savedTab !== null) {
        setActiveTab(parseInt(savedTab, 10));
      }
    }
  }, [router.query]);

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
    
    // Update the URL with the new tab value
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: newValue },
    }, undefined, { shallow: true });
    
    // Also store in localStorage as backup
    localStorage.setItem('dashboardActiveTab', newValue.toString());
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