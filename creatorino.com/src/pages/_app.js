// pages/_app.js
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import theme from '../utils/theme';
import CookieConsent from '../components/CookieConsent';
import '../styles/globals.css'; // For Tailwind CSS

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    // Configure persistent session
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Optional: Handle global auth state changes if needed
      console.log('Auth state changed:', event);
    });

    // Remove server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    
    // Add Inter font from Google Fonts
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(linkEl);

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Log page views for monitoring
    const logPageView = () => {
      const path = window.location.pathname;
      console.log(`Page viewed: ${path}`);
      
      // If this is a username page, add extra logging
      if (path.startsWith('/s/')) {
        const username = path.split('/')[2];
        console.log(`Social links page for user: ${username}`);
        
        // You could also send this data to an analytics endpoint
        // or add custom logging to Supabase if needed
      }
    };
    
    // Log on initial load
    logPageView();
    
    // Set up router change logging for SPA navigation
    router.events.on('routeChangeComplete', logPageView);
    return () => {
      router.events.off('routeChangeComplete', logPageView);
    };
  }, [router]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
        <CookieConsent />
      </ThemeProvider>
    </>
  );
}

export default MyApp;