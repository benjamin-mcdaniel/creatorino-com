// src/pages/login.js
import dynamic from 'next/dynamic';
import React from 'react';

// Create a client-only version of the login form
const ClientOnlyLoginForm = dynamic(
  () => import('../components/LoginForm'),
  { ssr: false } // This disables server-side rendering
);

// This is the shell component that will be rendered during static generation
export default function LoginPage() {
  return (
    <div>
      <ClientOnlyLoginForm />
    </div>
  );
}