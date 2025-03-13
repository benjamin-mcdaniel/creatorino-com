// pages/reset-password.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { resetPassword } from '../lib/authService';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent
} from '@mui/material';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Check if we're in a password reset flow
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      // If not in a password reset flow, redirect
      if (!data.session?.user?.email) {
        router.push('/login');
      }
    };
    
    checkSession();
  }, [router]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      setLoading(false);
      return;
    }
    
    const { success, error } = await resetPassword(password);
    
    if (success) {
      setMessage({ type: 'success', text: 'Password has been reset successfully. You can now log in with your new password.' });
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      setMessage({ type: 'error', text: `Failed to reset password: ${error.message}` });
    }
    
    setLoading(false);
  };
  
  return (
    <Layout title="Reset Password">
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Reset Your Password
            </Typography>
            
            {message.text && (
              <Alert 
                severity={message.type} 
                sx={{ mb: 4 }}
                onClose={() => setMessage({ type: '', text: '' })}
              >
                {message.text}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                sx={{ mb: 3 }}
              />
              
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}