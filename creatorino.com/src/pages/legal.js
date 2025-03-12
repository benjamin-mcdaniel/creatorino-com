// src/pages/legal.js
import dynamic from 'next/dynamic';
import React from 'react';

// Create a client-only version of the legal content
const ClientOnlyLegalContent = dynamic(
  () => import('../components/LegalContent'),
  { ssr: false } // This disables server-side rendering
);

// This is the shell component that will be rendered during static generation
export default function LegalPage() {
  return (
    <div>
      <ClientOnlyLegalContent />
    </div>
  );
}