// src/components/dashboard/SocialLinks/Analytics.js
import React, { useState } from 'react';
import { 
  Box, Paper, Typography, Grid, Card, CardContent, 
  Divider, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress
} from '@mui/material';

// Temporarily removed Chart.js imports until dependencies are installed

export default function Analytics({ links }) {
  const [timeframe, setTimeframe] = useState('7days');
  
  // Mock data for demonstration
  const mockAnalyticsData = {
    totalViews: 2547,
    totalClicks: 635,
    clickRate: 24.9,
    linkPerformance: links.map(link => ({
      id: link.id,
      title: link.title,
      clicks: Math.floor(Math.random() * 200) + 20,
      clickRate: Math.floor(Math.random() * 40) + 10
    }))
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Link Analytics</Typography>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            label="Timeframe"
            size="small"
          >
            <MenuItem value="7days">Last 7 days</MenuItem>
            <MenuItem value="30days">Last 30 days</MenuItem>
            <MenuItem value="90days">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Views</Typography>
              <Typography variant="h4">{mockAnalyticsData.totalViews.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Clicks</Typography>
              <Typography variant="h4">{mockAnalyticsData.totalClicks.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Click Rate</Typography>
              <Typography variant="h4">{mockAnalyticsData.clickRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts would go here */}
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography>Charts will be available after installing chart.js and react-chartjs-2</Typography>
      </Paper>
      
      {/* Table with data */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Top Performing Links</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Link</TableCell>
                <TableCell align="right">Clicks</TableCell>
                <TableCell align="right">Rate</TableCell>
                <TableCell align="right">Performance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAnalyticsData.linkPerformance
                .sort((a, b) => b.clicks - a.clicks)
                .slice(0, 5)
                .map((link) => (
                  <TableRow key={link.id}>
                    <TableCell component="th" scope="row">
                      {link.title}
                    </TableCell>
                    <TableCell align="right">{link.clicks}</TableCell>
                    <TableCell align="right">{link.clickRate}%</TableCell>
                    <TableCell align="right">
                      <LinearProgress 
                        variant="determinate" 
                        value={link.clickRate} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}