import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MinimalTopHeader } from './components/layout/MinimalTopHeader';
import { FloatingDockNav } from './components/layout/FloatingDockNav';
import { CommandPalette } from './components/common/CommandPalette';
import { FloatingDemoControl } from './components/demo/FloatingDemoControl';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { ThreatDetailDrawer } from './components/threats/ThreatDetailDrawer';
import { ToastContainer } from './components/common/Toast';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AttackForecastPage } from './pages/AttackForecastPage';
import { ThreatDetectionPage } from './pages/ThreatDetectionPage';
import { LiveTrafficPage } from './pages/LiveTrafficPage';
import { TrafficAnalysisPage } from './pages/TrafficAnalysisPage';
import { AttackHistoryPage } from './pages/AttackHistoryPage';
import { AIModelPage } from './pages/AIModelPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeNav, selectedThreat, setSelectedThreat, isDemoMode } = useApp();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If not logged in, show minimal login page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  // Render current active page
  const renderPage = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Live Traffic':
        return <LiveTrafficPage />;
      case 'Attack Forecast':
        return <AttackForecastPage />;
      case 'Threat Detection':
        return <ThreatDetectionPage />;
      case 'Traffic Analysis':
        return <TrafficAnalysisPage />;
      case 'Alerts':
        return <AlertsPage />;
      case 'Attack History':
        return <AttackHistoryPage />;
      case 'AI Model':
        return <AIModelPage />;
      case 'Reports':
        return <ReportsPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        position: 'relative',
      }}
    >
      {/* 1. Minimal Top Header */}
      <MinimalTopHeader
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* 2. Main Content Canvas */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '36px 32px 120px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Floating Demo Mode bar when demo mode is active */}
        {isDemoMode && <FloatingDemoControl />}

        {/* Dynamic Active Page */}
        {renderPage()}
      </main>

      {/* 3. Floating Bottom Navigation Dock */}
      <FloatingDockNav onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* 4. Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* 5. Global Drawers & Modals */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <ThreatDetailDrawer
        threat={selectedThreat}
        onClose={() => setSelectedThreat(null)}
      />

      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
