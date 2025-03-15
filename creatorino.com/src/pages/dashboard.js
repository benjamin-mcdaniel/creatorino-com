// src/pages/dashboard.js
import dynamic from 'next/dynamic';
import React from 'react';

// Create a completely client-side dashboard component
const ClientDashboard = dynamic(
  () => import('../components/dashboard/ClientDashboard'),
  { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

export default function DashboardPage() {
  return <ClientDashboard />;
}