// src/components/dashboard/Overview/RecentContent.js
import React from 'react';
import { Grid, Typography, Box, Button, Paper, List, ListItem, ListItemAvatar, Avatar, Divider, IconButton } from '@mui/material';
import { CardSkeleton } from '../../common/LoadingState';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import useYouTube from '../../../hooks/useYouTube';
import useTwitch from '../../../hooks/useTwitch';
import { formatNumber } from '../../../utils/formatters';

export function RecentContent() {
  const { videos, loading: youtubeLoading } = useYouTube();
  const { streams, loading: twitchLoading } = useTwitch();
  
  const loading = youtubeLoading || twitchLoading;

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardSkeleton height={400} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="medium">
              Recent YouTube Videos
            </Typography>
            <Button color="primary" size="small">View All</Button>
          </Box>

          <List>
            {videos?.map((video, index) => (
              <Box key={video.id || index}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <YouTubeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  
                  <Box sx={{ flex: 1, ml: 2 }}>
                    <Typography variant="body1" component="div">
                      {video.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="body2" component="span" color="text.primary">
                        {formatNumber(video.views)} views
                      </Typography>
                      <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        — Published {video.published}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <IconButton edge="end">
                    <MoreVertIcon />
                  </IconButton>
                </ListItem>
                {index < videos.length - 1 && <Divider variant="inset" component="li" />}
              </Box>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="medium">
              Recent Twitch Streams
            </Typography>
            <Button color="primary" size="small">View All</Button>
          </Box>

          <List>
            {streams?.map((stream, index) => (
              <Box key={stream.id || index}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#9146FF' }}>
                      <SportsEsportsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  
                  <Box sx={{ flex: 1, ml: 2 }}>
                    <Typography variant="body1" component="div">
                      {stream.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="body2" component="span" color="text.primary">
                        {formatNumber(stream.viewers)} avg. viewers
                      </Typography>
                      <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        — Duration: {stream.duration}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <IconButton edge="end">
                    <MoreVertIcon />
                  </IconButton>
                </ListItem>
                {index < streams.length - 1 && <Divider variant="inset" component="li" />}
              </Box>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}