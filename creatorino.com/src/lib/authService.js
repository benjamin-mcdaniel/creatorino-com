// lib/authService.js

import { supabase } from './supabaseClient';

/**
 * Send a password reset email to the user
 */
export async function sendPasswordResetEmail(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
    });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    return { success: false, error };
  }
}

/**
 * Reset the user's password (after clicking the reset link in email)
 */
export async function resetPassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error resetting password:', error.message);
    return { success: false, error };
  }
}

/**
 * Enroll a new MFA factor (TOTP)
 */
export async function enrollMFA() {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        // Add a friendly name with a timestamp to make it unique
        friendlyName: `Authenticator-${Date.now()}`
      });
      
      if (error) throw error;
      
      return {
        success: true,
        error: null,
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      };
    } catch (error) {
      console.error('Error enrolling MFA:', error.message);
      return { success: false, error };
    }
  }
/**
 * Verify an MFA challenge
 */
export async function verifyMFA(factorId, challengeId, code) {
    try {
      // Changed from verifyChallenge to verify
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error verifying MFA:', error.message);
      return { success: false, error };
    }
  }

/**
 * Challenge an MFA factor
 */
export async function challengeMFA(factorId) {
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      error: null,
      challengeId: data.id 
    };
  } catch (error) {
    console.error('Error challenging MFA:', error.message);
    return { success: false, error };
  }
}

/**
 * List all enrolled MFA factors
 */
export async function listMFAFactors() {
  try {
    const { data, error } = await supabase.auth.mfa.listFactors();
    
    if (error) throw error;
    
    return { 
      success: true, 
      error: null,
      factors: data.all,
      totp: data.totp 
    };
  } catch (error) {
    console.error('Error listing MFA factors:', error.message);
    return { success: false, error };
  }
}

/**
 * Unenroll an MFA factor
 */
export async function unenrollMFA(factorId) {
  try {
    const { error } = await supabase.auth.mfa.unenroll({
      factorId
    });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error unenrolling MFA:', error.message);
    return { success: false, error };
  }
}