import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  Alert,
  FormControlLabel,
  CircularProgress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Skeleton,
  Collapse,
  IconButton
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import LoopIcon from '@mui/icons-material/Loop';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function SupportContent() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Support request form state
  const [supportType, setSupportType] = useState('help');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [sendUpdates, setSendUpdates] = useState(true);

  // State for service requests
  const [supportRequests, setSupportRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    // Check if user is authenticated
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (!data.session) {
        // Redirect to login if not authenticated
        router.push('/login');
      }
      
      setLoading(false);
    };

    checkSession();
  }, [router]);

  // Load existing support requests from the user
  useEffect(() => {
    const fetchSupportRequests = async () => {
      if (session) {
        try {
          setRequestsLoading(true);
          const { data, error } = await supabase
            .from('support_requests')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching support requests:', error);
          } else {
            setSupportRequests(data || []);
          }
        } catch (err) {
          console.error('Failed to fetch support requests:', err);
        } finally {
          setRequestsLoading(false);
        }
      }
    };
    
    if (session) {
      fetchSupportRequests();
    }
  }, [session, successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim()) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    setErrorMessage('');
    
    try {
      // Get user details
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Create support request in Supabase
      const { data, error } = await supabase
        .from('support_requests')
        .insert([
          {
            user_id: userData.user.id,
            email: userData.user.email,
            request_type: supportType,
            subject,
            description,
            send_updates: sendUpdates,
            status: 'open',
            created_at: new Date().toISOString()
          }
        ]);
        
      if (error) throw error;
      
      // Reset form and show success message
      setSubject('');
      setDescription('');
      setSupportType('help');
      setSendUpdates(true);
      
      setSuccessMessage('Your support request has been submitted successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting support request:', error);
      setErrorMessage(error.message || 'Failed to submit support request');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug':
        return <BugReportIcon />;
      case 'feature':
        return <LightbulbIcon />;
      case 'help':
      default:
        return <HelpOutlineIcon />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'bug':
        return 'Bug Report';
      case 'feature':
        return 'Feature Request';
      case 'help':
      default:
        return 'Help Request';
    }
  };

  // Get status chip color based on status
  const getStatusChip = (status) => {
    let color = 'primary';
    let icon = <AccessTimeIcon fontSize="small" />;
    
    switch (status) {
      case 'open':
        color = 'primary';
        icon = <AccessTimeIcon fontSize="small" />;
        break;
      case 'in_progress':
        color = 'warning';
        icon = <LoopIcon fontSize="small" />;
        break;
      case 'closed':
        color = 'success';
        icon = <DoneIcon fontSize="small" />;
        break;
      default:
        color = 'default';
    }
    
    return (
      <Chip 
        size="small" 
        icon={icon} 
        label={status.replace('_', ' ')} 
        color={color} 
        sx={{ textTransform: 'capitalize' }}
      />
    );
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get request type icon
  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'bug':
        return <BugReportIcon fontSize="small" color="error" />;
      case 'feature':
        return <LightbulbIcon fontSize="small" color="success" />;
      case 'help':
      default:
        return <HelpOutlineIcon fontSize="small" color="primary" />;
    }
  };

  // Truncate text for table display
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Handle row expansion
  const toggleRowExpansion = (requestId) => {
    setExpandedRows(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            opacity: 0.1,
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Support Center
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Get help, report bugs, or suggest new features. We're here to help!
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6, mb: 8 }}>
        <Grid container spacing={4}>
          {/* Support Options */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 2, 
              height: '100%',
              border: '1px solid #e0e0e0',
              bgcolor: '#f9f9f9'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                  Support Options
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose the type of support you need:
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      cursor: 'pointer', 
                      bgcolor: supportType === 'help' ? 'primary.50' : 'white',
                      borderLeft: supportType === 'help' ? '4px solid' : '4px solid transparent',
                      borderColor: supportType === 'help' ? 'primary.main' : 'transparent',
                      boxShadow: supportType === 'help' ? '0px 3px 6px rgba(0, 0, 0, 0.08)' : 'none',
                      height: '80px', // Fixed height for all options
                      display: 'flex',
                      alignItems: 'center'
                    }} 
                    elevation={supportType === 'help' ? 1 : 0}
                    onClick={() => setSupportType('help')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        p: 1, 
                        borderRadius: '50%',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40
                      }}>
                        <HelpOutlineIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: supportType === 'help' ? 'bold' : 'medium' }}>
                          Help Request
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Get assistance with using our platform
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  <Paper 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      cursor: 'pointer', 
                      bgcolor: supportType === 'bug' ? 'error.50' : 'white',
                      borderLeft: supportType === 'bug' ? '4px solid' : '4px solid transparent',
                      borderColor: supportType === 'bug' ? 'error.main' : 'transparent',
                      boxShadow: supportType === 'bug' ? '0px 3px 6px rgba(0, 0, 0, 0.08)' : 'none',
                      height: '80px', // Fixed height for all options
                      display: 'flex',
                      alignItems: 'center'
                    }} 
                    elevation={supportType === 'bug' ? 1 : 0}
                    onClick={() => setSupportType('bug')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ 
                        bgcolor: 'error.main', 
                        color: 'white', 
                        p: 1, 
                        borderRadius: '50%',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40
                      }}>
                        <BugReportIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: supportType === 'bug' ? 'bold' : 'medium' }}>
                          Bug Report
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Report an issue or problem
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  <Paper 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer', 
                      bgcolor: supportType === 'feature' ? 'success.50' : 'white',
                      borderLeft: supportType === 'feature' ? '4px solid' : '4px solid transparent',
                      borderColor: supportType === 'feature' ? 'success.main' : 'transparent',
                      boxShadow: supportType === 'feature' ? '0px 3px 6px rgba(0, 0, 0, 0.08)' : 'none',
                      height: '80px', // Fixed height for all options
                      display: 'flex',
                      alignItems: 'center'
                    }} 
                    elevation={supportType === 'feature' ? 1 : 0}
                    onClick={() => setSupportType('feature')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ 
                        bgcolor: 'success.main', 
                        color: 'white', 
                        p: 1, 
                        borderRadius: '50%',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40
                      }}>
                        <LightbulbIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: supportType === 'feature' ? 'bold' : 'medium' }}>
                          Feature Request
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Suggest a new feature or improvement
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Support Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              bgcolor: 'white'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ 
                    bgcolor: supportType === 'bug' ? 'error.main' : 
                            supportType === 'feature' ? 'success.main' : 'primary.main', 
                    color: 'white', 
                    p: 1, 
                    borderRadius: '50%',
                    mr: 2,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getTypeIcon(supportType)}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    fontWeight="bold"
                    sx={{ 
                      color: supportType === 'bug' ? 'error.main' : 
                             supportType === 'feature' ? 'success.main' : 'primary.main'
                    }}
                  >
                    {getTypeLabel(supportType)}
                  </Typography>
                </Box>

                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
                    {errorMessage}
                  </Alert>
                )}

                {successMessage && (
                  <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
                    {successMessage}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Subject *"
                    fullWidth
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    margin="normal"
                    required
                    placeholder={`Summarize your ${
                      supportType === 'bug' ? 'bug report' : 
                      supportType === 'feature' ? 'feature request' : 'question'
                    }`}
                  />

                  <TextField
                    label={`Description *`}
                    multiline
                    rows={6}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    required
                    placeholder={
                      supportType === 'bug' ? 
                        "Please provide details: what happened, what you expected to happen, steps to reproduce..." :
                      supportType === 'feature' ? 
                        "Please describe your feature idea, how it would work, and why it would be valuable..." :
                        "Please provide details about your question or issue..."
                    }
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sendUpdates}
                          onChange={(e) => setSendUpdates(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Send me email updates about this request"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color={
                        supportType === 'bug' ? 'error' :
                        supportType === 'feature' ? 'success' : 'primary'
                      }
                      size="large"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} /> : null}
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Support Requests Table */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Your Support Requests
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Track the status of your previous support tickets
          </Typography>

          {requestsLoading ? (
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={50} />
            </Box>
          ) : supportRequests.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">
                You haven't submitted any support requests yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Use the form above to create your first request
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.05)' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell width="5%"></TableCell>
                    <TableCell width="15%">Date</TableCell>
                    <TableCell width="15%">Type</TableCell>
                    <TableCell width="30%">Subject</TableCell>
                    <TableCell width="20%">Description</TableCell>
                    <TableCell width="15%">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supportRequests.map((request) => (
                    <React.Fragment key={request.id}>
                      <TableRow 
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                          '& > *': { borderBottom: 'unset' },
                          bgcolor: expandedRows[request.id] ? 'rgba(0, 0, 0, 0.02)' : 'inherit'
                        }}
                        hover
                        onClick={() => toggleRowExpansion(request.id)}
                      >
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpansion(request.id);
                            }}
                          >
                            {expandedRows[request.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{formatDate(request.created_at)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getRequestTypeIcon(request.request_type)}
                            <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                              {request.request_type}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {truncateText(request.subject, 40)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {truncateText(request.description, 40)}
                          </Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(request.status)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={expandedRows[request.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2, py: 2 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Typography variant="h6" gutterBottom component="div" fontWeight="medium">
                                    {request.subject}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Request Type:
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {getRequestTypeIcon(request.request_type)}
                                    <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                                      {request.request_type}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Status:
                                  </Typography>
                                  {getStatusChip(request.status)}
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Description:
                                  </Typography>
                                  <Paper sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                      {request.description}
                                    </Typography>
                                  </Paper>
                                </Grid>
                                {request.admin_notes && (
                                  <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                      Admin Notes:
                                    </Typography>
                                    <Paper sx={{ p: 2, bgcolor: '#fcf8e6', borderRadius: 1 }}>
                                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {request.admin_notes}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    </>
  );
}
