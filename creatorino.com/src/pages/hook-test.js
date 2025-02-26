// src/pages/hook-test.js
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { Box, Typography, Container, Paper } from '@mui/material';
import useYouTube from '../hooks/useYouTube';
import useTwitch from '../hooks/useTwitch';
import useSocialLinks from '../hooks/useSocialLinks';

export default function HookTest() {
  const youtube = useYouTube();
  const twitch = useTwitch();
  const socialLinks = useSocialLinks();

  useEffect(() => {
    console.log('YouTube data:', youtube);
    console.log('Twitch data:', twitch);
    console.log('Social Links data:', socialLinks);
  }, [youtube, twitch, socialLinks]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hook Test Page
        </Typography>
        <Typography variant="body1" paragraph>
          This page tests the data hooks. Check the browser console to see the data being loaded.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            YouTube Status
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Typography>
              Loading: {youtube.loading ? 'Yes' : 'No'} | 
              Connected: {youtube.connected ? 'Yes' : 'No'} | 
              Error: {youtube.error || 'None'}
            </Typography>
            {youtube.stats && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Subscribers: {youtube.stats.subscribers.toLocaleString()}
              </Typography>
            )}
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Twitch Status
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Typography>
              Loading: {twitch.loading ? 'Yes' : 'No'} | 
              Connected: {twitch.connected ? 'Yes' : 'No'} | 
              Error: {twitch.error || 'None'}
            </Typography>
            {twitch.stats && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Followers: {twitch.stats.followers.toLocaleString()}
              </Typography>
            )}
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Social Links Status
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Typography>
              Loading: {socialLinks.loading ? 'Yes' : 'No'} | 
              Error: {socialLinks.error || 'None'} | 
              Links: {socialLinks.links.length}
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
}