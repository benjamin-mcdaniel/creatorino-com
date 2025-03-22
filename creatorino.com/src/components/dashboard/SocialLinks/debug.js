// src/components/dashboard/SocialLinks/debug.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Grid, Divider } from '@mui/material';
import { FullPageLoader } from '../../common/LoadingState';
import { supabase } from '../../../lib/supabaseClient';

export default function DebugPanel({ 
  user,
  loading, 
  authLoading, 
  links, 
  profile, 
  dialogOpen,
  refreshData,
  setOverrideLoading
}) {
  const [debugInfo, setDebugInfo] = useState({
    logs: [],
    userInfo: null,
    authStatus: 'checking',
    dataStatus: 'waiting',
    hookState: {},
    responses: []
  });
  
  // Add debugging info effect
  useEffect(() => {
    // Log user authentication status
    if (authLoading) {
      addDebugLog('Auth is loading...');
      setDebugInfo(prev => ({ ...prev, authStatus: 'loading' }));
    } else if (user) {
      addDebugLog(`User authenticated: ${user.id} (${user.email})`);
      setDebugInfo(prev => ({ 
        ...prev, 
        authStatus: 'authenticated',
        userInfo: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        }
      }));
    } else {
      addDebugLog('No user authenticated');
      setDebugInfo(prev => ({ ...prev, authStatus: 'not authenticated' }));
    }
  }, [user, authLoading]);
  
  // Add data loading debug info
  useEffect(() => {
    if (loading) {
      addDebugLog('Data is loading...');
      setDebugInfo(prev => ({ ...prev, dataStatus: 'loading' }));
    } else {
      if (links) {
        addDebugLog(`Loaded ${links.length} links`);
      }
      if (profile) {
        addDebugLog(`Loaded profile: ${profile.title}`);
      }
      setDebugInfo(prev => ({ ...prev, dataStatus: 'loaded' }));
    }

    // Keep track of hook state for debugging
    setDebugInfo(prev => ({
      ...prev,
      hookState: {
        loading,
        linksCount: links ? links.length : 0,
        profileTitle: profile ? profile.title : null,
        dialogOpen
      }
    }));
  }, [loading, links, profile, dialogOpen]);

  // Add a timeout to prevent infinite loading state
  useEffect(() => {
    let timeoutId;
    
    if (loading || authLoading) {
      timeoutId = setTimeout(() => {
        addDebugLog('Loading timeout reached, forcing override');
        setOverrideLoading(true);
      }, 10000); // 10 seconds timeout
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, authLoading, setOverrideLoading]);

  // Direct database check for debugging
  useEffect(() => {
    async function checkDatabase() {
      if (!user) return;

      addDebugLog('Directly checking database tables...');
      
      try {
        // Check nickname field in profile first
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          addDebugLog(`Error checking profile: ${profileError.message}`);
        } else {
          const nickname = profileData?.nickname || '';
          addDebugLog(`Found profile with nickname: ${nickname || 'empty'}`);
          setDebugInfo(prev => ({
            ...prev,
            responses: [...prev.responses, {
              type: 'profile',
              time: new Date().toISOString(),
              data: profileData
            }]
          }));
          
          // Check social_links_settings table
          const { data: settingsData, error: settingsError } = await supabase
            .from('social_links_settings')
            .select('*')
            .eq('user_id', user.id);
            
          if (settingsError) {
            addDebugLog(`Error checking settings table: ${settingsError.message}`);
          } else {
            addDebugLog(`Found ${settingsData.length} settings records in database`);
            setDebugInfo(prev => ({
              ...prev,
              responses: [...prev.responses, {
                type: 'settings',
                time: new Date().toISOString(),
                data: settingsData
              }]
            }));
          }
          
          // Check social_links table by nickname to match public page behavior
          if (nickname) {
            const { data: linksData, error: linksError } = await supabase
              .from('social_links')
              .select('*')
              .eq('nickname', nickname)
              .order('sort_order');
              
            if (linksError) {
              addDebugLog(`Error checking links table by nickname: ${linksError.message}`);
              
              // Fallback to user_id if nickname query fails
              const { data: fallbackData, error: fallbackError } = await supabase
                .from('social_links')
                .select('*')
                .eq('user_id', user.id)
                .order('sort_order');
                
              if (fallbackError) {
                addDebugLog(`Error in fallback query: ${fallbackError.message}`);
              } else {
                addDebugLog(`Found ${fallbackData.length} links records by user_id fallback`);
                setDebugInfo(prev => ({
                  ...prev,
                  responses: [...prev.responses, {
                    type: 'links (fallback)',
                    time: new Date().toISOString(),
                    data: fallbackData
                  }]
                }));
              }
            } else {
              addDebugLog(`Found ${linksData.length} links records by nickname`);
              setDebugInfo(prev => ({
                ...prev,
                responses: [...prev.responses, {
                  type: 'links',
                  time: new Date().toISOString(),
                  data: linksData
                }]
              }));
            }
          } else {
            // If no nickname, fall back to user_id query
            const { data: linksData, error: linksError } = await supabase
              .from('social_links')
              .select('*')
              .eq('user_id', user.id)
              .order('sort_order');
              
            if (linksError) {
              addDebugLog(`Error checking links table: ${linksError.message}`);
            } else {
              addDebugLog(`Found ${linksData.length} links records in database`);
              setDebugInfo(prev => ({
                ...prev,
                responses: [...prev.responses, {
                  type: 'links',
                  time: new Date().toISOString(),
                  data: linksData
                }]
              }));
            }
          }
        }
      } catch (err) {
        addDebugLog(`Error in direct database check: ${err.message}`);
      }
    }
    
    checkDatabase();
  }, [user]);
  
  // Helper function to add debug logs
  const addDebugLog = (message) => {
    console.log(message); // Also log to console
    setDebugInfo(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toISOString().substr(11, 8)} - ${message}`].slice(-20) // Keep last 20 logs
    }));
  };

  // Force reload button
  const forceReload = () => {
    window.location.reload();
  };
  
  // Force override loading state
  const forceLoadingOverride = () => {
    setOverrideLoading(true);
    addDebugLog('Forcing loading state override');
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    addDebugLog('Manually refreshing data...');
    try {
      await refreshData();
      addDebugLog('Manual refresh completed');
    } catch (err) {
      addDebugLog(`Error in manual refresh: ${err.message}`);
    }
  };

  return (
    <Box>
      <FullPageLoader />
      <Paper sx={{ position: 'fixed', bottom: 20, right: 20, p: 2, maxWidth: 600, zIndex: 9999, opacity: 0.9 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>Debug Loading Info</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={forceLoadingOverride}
          >
            Override Loading
          </Button>
        </Box>
        <Typography variant="body2">Auth Status: {debugInfo.authStatus}</Typography>
        <Typography variant="body2">Data Status: {debugInfo.dataStatus}</Typography>
        <Typography variant="body2" gutterBottom>
          User: {debugInfo.userInfo ? `${debugInfo.userInfo.email} (${debugInfo.userInfo.id})` : 'No user'}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="body2" gutterBottom>
          Hook State: loading={String(debugInfo.hookState.loading)}, 
          links={debugInfo.hookState.linksCount}, 
          profile={debugInfo.hookState.profileTitle ? 'loaded' : 'not loaded'}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button 
              fullWidth
              variant="outlined" 
              size="small"
              onClick={handleRefresh}
            >
              Force Refresh
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              fullWidth
              variant="outlined" 
              color="secondary"
              size="small"
              onClick={forceReload}
            >
              Reload Page
            </Button>
          </Grid>
        </Grid>
        
        <Typography variant="caption" component="div" sx={{ mt: 1, mb: 1 }}>
          Recent Logs:
        </Typography>
        <Box sx={{ maxHeight: 200, overflow: 'auto', p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          {debugInfo.logs.map((log, i) => (
            <Typography key={i} variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
              {log}
            </Typography>
          ))}
        </Box>
        
        {debugInfo.responses.length > 0 && (
          <>
            <Typography variant="caption" component="div" sx={{ mt: 1, mb: 1 }}>
              Database Records:
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto', p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              {debugInfo.responses.map((response, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
                    {response.type} ({Array.isArray(response.data) ? response.data.length : '1'} records)
                  </Typography>
                  <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}