import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TurfBot } from "@/components/TurfBot";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Marketing from "./pages/Marketing";
import Operations from "./pages/Operations";
import Staff from "./pages/Staff";
import PricingSettings from "./pages/PricingSettings";
import TurfsPage from "./pages/Turfs";
import ApiKeysPage from "./pages/ApiKeys";
import IntegrationLogsPage from "./pages/IntegrationLogs";
import UsersPage from "./pages/Users";
import Tournaments from "./pages/Tournaments";
import Campaigns from './pages/Campaigns';
import Inventory from './pages/Inventory';
import Coaching from './pages/Coaching';
import SettingsPage from "./pages/Settings";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Layout component with sidebar
import { useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`flex-1 p-4 lg:p-8 pt-16 lg:pt-8 transition-[margin] duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
      >
        {children}
      </main>
      <TurfBot />
    </div>
  );
};

// Protected dashboard layout
const ProtectedDashboard = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

import PublicTournament from "./pages/PublicTournament";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/p/tournament/:id" element={<PublicTournament />} />

    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <ProtectedDashboard>
          <Dashboard />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/calendar"
      element={
        <ProtectedDashboard>
          <CalendarPage />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/analytics"
      element={
        <ProtectedDashboard>
          <Analytics />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/marketing"
      element={
        <ProtectedDashboard>
          <Campaigns />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/inventory"
      element={
        <ProtectedDashboard>
          <Inventory />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/operations"
      element={
        <ProtectedDashboard>
          <Operations />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/staff"
      element={
        <ProtectedDashboard>
          <Staff />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/pricing"
      element={
        <ProtectedDashboard>
          <PricingSettings />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/turfs"
      element={
        <ProtectedDashboard>
          <TurfsPage />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/api-keys"
      element={
        <ProtectedDashboard>
          <ApiKeysPage />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/logs"
      element={
        <ProtectedDashboard>
          <IntegrationLogsPage />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/users"
      element={
        <ProtectedDashboard>
          <UsersPage />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedDashboard>
          <SettingsPage />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/tournaments"
      element={
        <ProtectedDashboard>
          <Tournaments />
        </ProtectedDashboard>
      }
    />
    <Route
      path="/coaching"
      element={
        <ProtectedDashboard>
          <Coaching />
        </ProtectedDashboard>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
