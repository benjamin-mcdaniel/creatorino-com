import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';

// Sample user data for demonstration
const sampleUsers = [
  {
    id: 1,
    name: 'Jane Cooper',
    nickname: 'janecooper',
    type: 'creator',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    followers: 15400,
    platform: 'Youtube',
    bio: 'Digital creator and storyteller focused on travel and lifestyle content.'
  },
  {
    id: 2,
    name: 'Cody Fisher',
    nickname: 'codyfisher',
    type: 'editor',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    followers: null,
    platform: null,
    bio: 'Professional video editor with 5+ years experience in final cut pro and premiere.'
  },
  {
    id: 3,
    name: 'Esther Howard',
    nickname: 'estherhoward',
    type: 'creator',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    followers: 45200,
    platform: 'Twitch',
    bio: 'Gaming streamer and content creator specializing in strategy games.'
  },
  {
    id: 4,
    name: 'Cameron Wilson',
    nickname: 'cameronw',
    type: 'manager',
    avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
    followers: null,
    platform: null,
    bio: 'Talent manager with experience growing creator brands and managing partnerships.'
  },
  {
    id: 5,
    name: 'Leslie Alexander',
    nickname: 'lesliea',
    type: 'advertiser',
    avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
    followers: null,
    platform: null,
    bio: 'Marketing specialist with focus on influencer collaborations and social media campaigns.'
  },
  {
    id: 6,
    name: 'Jenny Wilson',
    nickname: 'jennyw',
    type: 'creator',
    avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
    followers: 27800,
    platform: 'Instagram',
    bio: 'Fashion and beauty content creator with focus on sustainable products.'
  },
  {
    id: 7,
    name: 'Robert Fox',
    nickname: 'robfox',
    type: 'editor',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    followers: null,
    platform: null,
    bio: 'Animation specialist and video editor with a background in motion graphics.'
  },
  {
    id: 8,
    name: 'Jacob Jones',
    nickname: 'jacobjones',
    type: 'creator',
    avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
    followers: 132000,
    platform: 'Youtube',
    bio: 'Outdoor adventure and extreme sports content creator.'
  }
];

export default function DirectoryTab() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [userType, setUserType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(sampleUsers);
  
  // This would be replaced with an actual API call in production
  const searchUsers = (type, query) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredUsers = sampleUsers;
      
      // Filter by type if not "all"
      if (type !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.type === type);
      }
      
      // Filter by search query
      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(lowerQuery) ||
          user.nickname.toLowerCase().includes(lowerQuery) ||
          user.bio.toLowerCase().includes(lowerQuery)
        );
      }
      
      setUsers(filteredUsers);
      setLoading(false);
    }, 500);
  };
  
  // Handle type change
  const handleTypeChange = (event, newType) => {
    // Prevent deselecting all buttons
    if (newType !== null) {
      setUserType(newType);
      searchUsers(newType, searchText);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    searchUsers(userType, event.target.value);
  };
  
  // Format follower count with K, M suffixes
  const formatFollowers = (count) => {
    if (!count) return 'N/A';
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  // View profile handler
  const handleViewProfile = (userId) => {
    router.push(`/profile/${userId}`);
  };
  
  return (
    <Box sx={{ width: '100%', py: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Find People
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Discover creators, editors, managers, and advertisers in the community
      </Typography>
      
      {/* Search and Filter Controls */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' } }}>
        <TextField
          placeholder="Search by name, username, or bio"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <ToggleButtonGroup
          value={userType}
          exclusive
          onChange={handleTypeChange}
          aria-label="user type filter"
          sx={{ 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            '.MuiToggleButton-root': {
              textTransform: 'none',
              px: 2,
              py: 1
            }
          }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="creator">Creators</ToggleButton>
          <ToggleButton value="editor">Editors</ToggleButton>
          <ToggleButton value="manager">Managers</ToggleButton>
          <ToggleButton value="advertiser">Advertisers</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Results Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>Followers</TableCell>
              <TableCell>Bio</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No users found matching your search criteria
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={user.avatar} 
                        alt={user.name}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{user.nickname}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.type.charAt(0).toUpperCase() + user.type.slice(1)} 
                      size="small"
                      color={
                        user.type === 'creator' ? 'primary' :
                        user.type === 'editor' ? 'secondary' :
                        user.type === 'manager' ? 'success' : 'default'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{user.platform || '—'}</TableCell>
                  <TableCell>{formatFollowers(user.followers)}</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {user.bio}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewProfile(user.id)}
                      sx={{ 
                        textTransform: 'none',
                        height: '28px'
                      }}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
