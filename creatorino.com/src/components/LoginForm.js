// src/components/LoginForm.js
'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { listMFAFactors, challengeMFA, verifyMFA } from '../lib/authService';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  // MFA related states
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMFACode] = useState('');
  const [factorId, setFactorId] = useState(null);
  const [challengeId, setChallengeId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // First, attempt regular sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Handle authentication error gracefully instead of throwing
      if (error) {
        console.log("Authentication error:", error.message);
        setError(error.message);
        setLoading(false);
        return; // Exit early
      }
      
      // Get the available MFA factors for this user
      const { success, totp, error: factorError } = await listMFAFactors();
      
      if (factorError) {
        console.error("Error checking MFA factors:", factorError);
        // If there's an error checking MFA, just proceed with normal login
        router.push('/dashboard');
        return;
      }
      
      if (success && totp && totp.length > 0) {
        // User has TOTP factors enrolled - proceed to MFA step
        const factor = totp[0];
        setFactorId(factor.id);
        
        // Create a challenge for this factor
        const { success: challengeSuccess, challengeId: newChallengeId, error: challengeError } = 
          await challengeMFA(factor.id);
          
        if (challengeError) {
          setError(challengeError.message);
          setLoading(false);
          return;
        }
        
        if (challengeSuccess) {
          setChallengeId(newChallengeId);
          setShowMFA(true);
        } else {
          setError("Failed to create MFA challenge");
        }
      } else {
        // User doesn't have MFA set up - proceed with normal login
        console.log("No MFA factors found, proceeding with normal login");
        router.push('/dashboard');
      }
    } catch (error) {
      // This catch block will only handle unexpected errors, not auth errors
      console.error("Unexpected login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMFASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Verify the MFA code
      const { success, error: verifyError } = await verifyMFA(
        factorId,
        challengeId,
        mfaCode
      );
      
      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }
      
      if (success) {
        // After successful MFA verification, check if we have a session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          // Successfully authenticated with MFA
          router.push('/dashboard');
        } else {
          setError("MFA verification succeeded but no session was created");
        }
      } else {
        setError("MFA verification failed");
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      setError("An unexpected error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError("An unexpected error occurred with social login. Please try again.");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {showMFA ? 'Two-Factor Authentication' : 'Welcome Back'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {showMFA ? 'Enter the verification code from your authenticator app' : 'Sign in to your Creatorino account'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!showMFA ? (
            // Regular login form
            <>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                  disabled={loading}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Link href="/forgot-password" passHref>
                    <MuiLink variant="body2" color="primary" underline="hover">
                      Forgot password?
                    </MuiLink>
                  </Link>
                </Box>

                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={loading}
                  fullWidth
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <Box sx={{ mt: 3, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  OR
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialLogin('google')}
                  sx={{ py: 1.5 }}
                  disabled={loading}
                >
                  Continue with Google
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GitHubIcon />}
                  onClick={() => handleSocialLogin('github')}
                  sx={{ py: 1.5 }}
                  disabled={loading}
                >
                  Continue with GitHub
                </Button>
              </Box>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link href="/signup" passHref>
                    <MuiLink color="primary" underline="hover">
                      Sign Up
                    </MuiLink>
                  </Link>
                </Typography>
              </Box>
            </>
          ) : (
            // MFA verification form
            <form onSubmit={handleMFASubmit}>
              <TextField
                label="Verification Code"
                type="text"
                fullWidth
                margin="normal"
                value={mfaCode}
                onChange={(e) => setMFACode(e.target.value)}
                required
                variant="outlined"
                placeholder="6-digit code"
                inputProps={{ 
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                disabled={loading}
                sx={{ mb: 3 }}
                autoFocus
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={loading || mfaCode.length !== 6}
                fullWidth
                size="large"
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Sign In'
                )}
              </Button>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="text"
                  onClick={() => {
                    setShowMFA(false);
                    setMFACode('');
                  }}
                  disabled={loading}
                >
                  Back to login
                </Button>
              </Box>
            </form>
          )}
        </Paper>
      </Container>
    </Layout>
  );
}