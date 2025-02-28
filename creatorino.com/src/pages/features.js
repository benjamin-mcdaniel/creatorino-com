// src/pages/features.js
import dynamic from 'next/dynamic';
import React from 'react';

// Create a client-only version of the features content
const ClientOnlyFeaturesContent = dynamic(
  () => import('../components/FeaturesContent'),
  { ssr: false } // This disables server-side rendering
);

// This is the shell component that will be rendered during static generation
export default function FeaturesPage() {
  return (
    <div>
      <ClientOnlyFeaturesContent />
    </div>
  );
}