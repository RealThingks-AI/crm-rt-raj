
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CRMLayout } from "@/components/CRMLayout";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Meetings from "./pages/Meetings";
import DealsPage from "./pages/DealsPage";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<CRMLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="leads" element={<Leads />} />
              <Route path="meetings" element={<Meetings />} />
              <Route path="deals" element={<DealsPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
