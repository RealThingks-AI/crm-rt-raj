

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Contacts from "@/pages/Contacts";
import Leads from "@/pages/Leads";
import Meetings from "@/pages/Meetings";
import DealsPage from "@/pages/DealsPage";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/NotFound";
import { CRMLayout } from "@/components/CRMLayout";
import SecurityEnhancedApp from "@/components/SecurityEnhancedApp";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <SecurityEnhancedApp>
            <AppContent />
          </SecurityEnhancedApp>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
        <Route path="/" element={user ? <CRMLayout><Dashboard /></CRMLayout> : <Navigate to="/auth" replace />} />
        <Route path="/contacts" element={user ? <CRMLayout><Contacts /></CRMLayout> : <Navigate to="/auth" replace />} />
        <Route path="/leads" element={user ? <CRMLayout><Leads /></CRMLayout> : <Navigate to="/auth" replace />} />
        <Route path="/meetings" element={user ? <CRMLayout><Meetings /></CRMLayout> : <Navigate to="/auth" replace />} />
        <Route path="/deals" element={user ? <CRMLayout><DealsPage /></CRMLayout> : <Navigate to="/auth" replace />} />
        <Route path="/settings" element={user ? <CRMLayout><Settings /></CRMLayout> : <Navigate to="/auth" replace />} />
        <Route path="/notifications" element={user ? <CRMLayout><Notifications /></CRMLayout> : <Navigate to="/auth" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
