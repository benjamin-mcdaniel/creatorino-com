// src/pages/signup.js
import dynamic from 'next/dynamic';
import React from 'react';

// Create a client-only version of the signup form
const ClientOnlySignupForm = dynamic(
  () => import('../components/SignupForm'),
  { ssr: false } // This disables server-side rendering
);

// This is the shell component that will be rendered during static generation
export default function SignupPage() {
  return (
    <div>
      <ClientOnlySignupForm />
    </div>
  );
}