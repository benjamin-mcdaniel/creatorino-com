// src/pages/profile.js
import dynamic from 'next/dynamic';
import React from 'react';

// Create a client-only version of the profile content
const ClientOnlyProfileContent = dynamic(
  () => import('../components/ProfileContent'),
  { ssr: false } // This disables server-side rendering
);

// This is the shell component that will be rendered during static generation
export default function ProfilePage() {
  return (
    <div>
      <ClientOnlyProfileContent />
    </div>
  );
}