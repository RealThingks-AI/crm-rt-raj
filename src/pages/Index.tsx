
import React, { useState } from 'react';
import CRMLayout from '@/components/CRMLayout';
import Dashboard from '@/components/Dashboard';
import Contacts from '@/components/Contacts';
import Companies from '@/components/Companies';
import Activities from '@/components/Activities';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'contacts':
        return <Contacts />;
      case 'companies':
        return <Companies />;
      case 'activities':
        return <Activities />;
      case 'settings':
        return (
          <div className="crm-card p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <CRMLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </CRMLayout>
  );
};

export default Index;
