import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  RefreshCw,
  Play,
  Pause,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopNavProps {
  onOpenNotifications: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenNotifications }) => {
  const {
    activeNav,
    user,
    logout,
    lastUpdated,
    refreshNow,
    isStreaming,
    toggleStreaming,
    unreadCount,
    activeScenario,
    setScenario,
    isDemoMode,
    toggleDemoMode,
    networkStatus,
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const scenarioMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (scenarioMenuRef.current && !scenarioMenuRef.current.contains(e.target as Node)) {
        setScenarioMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scenarioLabels: Record<string, { label: string; badge: string; color: string }> = {
    normal: { label: 'Normal Baseline', badge: 'SAFE', color: 'var(--status-healthy-text)' },
    ddos: { label: 'Volumetric DDoS Attack', badge: 'CRITICAL', color: 'var(--status-critical-text)' },
    portscan: { label: 'Stealth Port Scan', badge: 'RECON', color: 'var(--status-warning-text)' },
    bruteforce: { label: 'SSH Brute Force', badge: 'AUTH SPRAY', color: 'var(--status-warning-text)' },
    botnet: { label: 'Botnet C2 Beaconing', badge: 'CRITICAL', color: 'var(--status-critical-text)' },
  };

  return (
    <header
      style={{
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Page Title & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
            {activeNav}
          </h1>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            NetPredict AI SOC &gt; {activeNav}
          </div>
        </div>

        {/* Network Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            backgroundColor:
              networkStatus === 'Under Attack'
                ? 'var(--status-critical-bg)'
                : networkStatus === 'Elevated Warning'
                ? 'var(--status-warning-bg)'
                : 'var(--status-healthy-bg)',
            border: `1px solid ${
              networkStatus === 'Under Attack'
                ? 'var(--status-critical-border)'
                : networkStatus === 'Elevated Warning'
                ? 'var(--status-warning-border)'
                : 'var(--status-healthy-border)'
            }`,
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 600,
            color:
              networkStatus === 'Under Attack'
                ? 'var(--status-critical-text)'
                : networkStatus === 'Elevated Warning'
                ? 'var(--status-warning-text)'
                : 'var(--status-healthy-text)',
          }}
        >
          <span
            className="pulse-live"
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor:
                networkStatus === 'Under Attack'
                  ? 'var(--status-critical-solid)'
                  : networkStatus === 'Elevated Warning'
                  ? 'var(--status-warning-solid)'
                  : 'var(--status-healthy-solid)',
              display: 'inline-block',
            }}
          />
          {networkStatus === 'Under Attack'
            ? 'Under Attack'
            : networkStatus === 'Elevated Warning'
            ? 'Threat Detected'
            : 'Protected'}
        </div>
      </div>

      {/* Right: Controls, Refresh, Scenario Selector, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Guided Demo Mode Control Button */}
        <button
          onClick={() => toggleDemoMode()}
          className={`btn ${isDemoMode ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            borderColor: isDemoMode ? 'var(--accent-primary)' : 'var(--accent-primary-border)',
            backgroundColor: isDemoMode ? 'var(--accent-primary)' : 'var(--accent-primary-subtle)',
            color: isDemoMode ? '#ffffff' : 'var(--accent-primary)',
          }}
          title="Toggle Guided Live Demonstration Mode"
        >
          <Sparkles size={13} />
          <span>{isDemoMode ? 'Demo Mode Active' : 'Demo Mode'}</span>
        </button>

        {/* Judge Demo Scenario Switcher */}
        <div style={{ position: 'relative' }} ref={scenarioMenuRef}>
          <button
            onClick={() => setScenarioMenuOpen(!scenarioMenuOpen)}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              borderColor: 'var(--border-subtle)',
              backgroundColor: '#ffffff',
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
            title="Demonstration Scenario for Hackathon Judges"
          >
            <span>Scenario: {scenarioLabels[activeScenario]?.badge || 'ACTIVE'}</span>
            <ChevronDown size={13} />
          </button>

          {scenarioMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '280px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                Forecasting Engine Test Scenarios
              </div>
              {Object.entries(scenarioLabels).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => {
                    setScenario(key as any);
                    setScenarioMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: activeScenario === key ? 'var(--bg-surface-subtle)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    if (activeScenario !== key) e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeScenario !== key) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ fontWeight: activeScenario === key ? 600 : 400 }}>{item.label}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: item.color }}>{item.badge}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stream Toggle & Last Updated */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <button
            onClick={toggleStreaming}
            className="btn btn-secondary btn-sm"
            title={isStreaming ? 'Pause Real-Time Telemetry Stream' : 'Resume Telemetry Stream'}
            style={{ padding: '4px 7px' }}
          >
            {isStreaming ? <Pause size={13} color="var(--text-secondary)" /> : <Play size={13} color="var(--accent-primary)" />}
          </button>

          <button
            onClick={refreshNow}
            className="btn btn-secondary btn-sm"
            title="Manual Telemetry Pull"
            style={{ padding: '4px 7px' }}
          >
            <RefreshCw size={13} color="var(--text-secondary)" />
          </button>

          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="font-mono">
            Updated: {lastUpdated}
          </span>
        </div>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="btn-icon"
          style={{ position: 'relative' }}
          title="Security Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-critical-solid)',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {user ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'VS'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user ? user.name : 'Analyst'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                SOC Tier 3
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '220px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--accent-primary)', marginTop: '2px', fontWeight: 500 }}>
                  {user?.organization}
                </div>
              </div>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  fontSize: '12px',
                  color: 'var(--status-critical-text)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--status-critical-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={14} />
                <span>Disconnect / Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
