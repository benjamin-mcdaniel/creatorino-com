// src/components/dashboard/index.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab, styled } from '@mui/material'; // Add styled import
import EqualizerIcon from '@mui/icons-material/Equalizer';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LinkIcon from '@mui/icons-material/Link';
import { fetchUserProfile } from '../../lib/profileService';
import { useRouter } from 'next/router';

import PageHeader from '../common/PageHeader';
import Overview from './Overview';
import YouTube from './YouTube';
import Twitch from './Twitch';
import SocialLinks from './SocialLinks';

// Create a custom styled Tab component
const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  minWidth: 120, // Make it wider
  padding: '6px 16px',
  // Position icon to the left of text
  flexDirection: 'row',
  '& .MuiTab-iconWrapper': {
    marginBottom: 0,
    marginRight: theme.spacing(1)
  }
}));

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
        {/* Platform selection tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="platform tabs"
            variant="fullWidth" // Makes tabs take up full width
            sx={{ minHeight: 48 }} // Reduce overall tab height
          >
            <StyledTab icon={<EqualizerIcon />} label="Overview" />
            <StyledTab icon={<YouTubeIcon />} label="YouTube" />
            <StyledTab icon={<SportsEsportsIcon />} label="Twitch" />
            <StyledTab icon={<LinkIcon />} label="Social Links" />
          </Tabs>
        </Box>

        {/* Tab content */}
        <Box sx={{ py: 2 }}>
          {activeTab === 0 && <Overview />}
          {activeTab === 1 && <YouTube />}
          {activeTab === 2 && <Twitch />}
          {activeTab === 3 && <SocialLinks />}
        </Box>
      </Container>
    </Box>
  );
}