// components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer'; // Add this import
import { Box } from '@mui/material';
import Head from 'next/head';

export default function Layout({ children, title = 'Creatorino' }) {
  return (
    <>
      <Head>
        <title>{`${title} | Creatorino`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer /> {/* Add the Footer component here */}
      </Box>
    </>
  );
}