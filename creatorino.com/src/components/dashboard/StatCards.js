// src/components/dashboard/StatCards.js
import React from 'react';
import { Grid } from '@mui/material';
import StatCard from '../common/StatCard';
import { StatCardSkeleton } from '../common/LoadingState';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';

import useYouTube from '../../hooks/useYouTube';
import useTwitch from '../../hooks/useTwitch';
import { formatNumber } from '../../utils/formatters';

export function StatCards() {
  const { stats: youtubeStats, loading: youtubeLoading } = useYouTube();
  const { stats: twitchStats, loading: twitchLoading } = useTwitch();
  
  const loading = youtubeLoading || twitchLoading;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        {loading ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            title="YouTube Subscribers"
            value={formatNumber(youtubeStats?.subscribers)}
            icon={<PersonIcon fontSize="small" />}
            trend="up"
            trendValue="+4.2% this week"
            avatarColor="primary.light"
          />
        )}
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        {loading ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            title="Video Views"
            value={formatNumber(youtubeStats?.views)}
            icon={<VisibilityIcon fontSize="small" />}
            trend="up"
            trendValue="+7.8% this week"
            avatarColor="secondary.light"
          />
        )}
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        {loading ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            title="Twitch Followers"
            value={formatNumber(twitchStats?.followers)}
            icon={<PeopleIcon fontSize="small" />}
            trend="up"
            trendValue="+3.5% this week"
            avatarColor="#9146FF"
          />
        )}
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        {loading ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            title="Watch Time (hrs)"
            value={formatNumber(youtubeStats?.watchTimeHours)}
            icon={<AccessTimeIcon fontSize="small" />}
            trend="up"
            trendValue="+6.1% this week"
            avatarColor="#FF0000"
          />
        )}
      </Grid>
    </Grid>
  );
}