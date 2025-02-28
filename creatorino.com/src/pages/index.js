// src/pages/index.js
import dynamic from 'next/dynamic';
import React from 'react';

// Create a client-only version of the landing page content
const ClientOnlyLandingContent = dynamic(
  () => import('../components/LandingContent'),
  { ssr: false } // This disables server-side rendering
);

// This is the shell component that will be rendered during static generation
export default function LandingPage() {
  return (
    <div>
      <ClientOnlyLandingContent />
    </div>
  );
}