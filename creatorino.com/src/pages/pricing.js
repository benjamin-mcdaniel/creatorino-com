// pages/pricing.js
import { useState } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';

// Create a client-only version of the pricing component
const ClientOnlyPricingContent = dynamic(
  () => import('../components/PricingContent'),
  { ssr: false } // This disables server-side rendering
);

// This is the shell component that will be rendered during static generation
export default function PricingPage() {
  return (
    <div>
      <ClientOnlyPricingContent />
    </div>
  );
}