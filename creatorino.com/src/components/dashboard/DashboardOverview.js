// src/components/dashboard/DashboardOverview.js
import React from 'react';
import { Grid } from '@mui/material';
import StatCards from './StatCards';
import RecentContent from './RecentContent';
import SocialLinks from './SocialLinks';
import QuickActions from './QuickActions';
import useYouTube from '../../hooks/useYouTube';
import useTwitch from '../../hooks/useTwitch';
import useSocialLinks from '../../hooks/useSocialLinks';

export default function DashboardOverview() {
  const { data: youtubeData, loading: youtubeLoading } = useYouTube();
  const { data: twitchData, loading: twitchLoading } = useTwitch();
  const { data: socialData, loading: socialLoading } = useSocialLinks();

  return (
    <>
      <StatCards 
        youtubeStats={youtubeData} 
        twitchStats={twitchData} 
        loading={youtubeLoading || twitchLoading}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <RecentContent 
            youtubeVideos={youtubeData?.recentVideos} 
            twitchStreams={twitchData?.recentStreams}
            loading={youtubeLoading || twitchLoading}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <SocialLinks 
            links={socialData}
            loading={socialLoading}
          />
          <QuickActions />
        </Grid>
      </Grid>
    </>
  );
}