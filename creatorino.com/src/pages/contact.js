// src/pages/contact.js
import dynamic from 'next/dynamic';
import React from 'react';

// Create a client-only version of the contact form
const ClientOnlyContactContent = dynamic(
  () => import('../components/ContactContent'),
  { ssr: false } // This disables server-side rendering
);

// This is the shell component that will be rendered during static generation
export default function ContactPage() {
  return (
    <div>
      <ClientOnlyContactContent />
    </div>
  );
}