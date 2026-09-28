import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Shield,
  Activity,
  Layers,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MinimalTopHeaderProps {
  onOpenNotifications: () => void;
  onOpenCommandPalette: () => void;
}

export const MinimalTopHeader: React.FC<MinimalTopHeaderProps> = ({
  onOpenNotifications,
  onOpenCommandPalette,
}) => {
  const {
    user,
    logout,
    networkStatus,
    unreadCount,
    isDemoMode,
    toggleDemoMode,
    setActiveNav,
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCritical = networkStatus === 'Under Attack';
  const isWarning = networkStatus === 'Elevated Warning';

  return (
    <header
      style={{
        height: '56px',
        backgroundColor: 'rgba(251, 251, 253, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Minimal Brand Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={() => setActiveNav('Dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              backgroundColor: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Shield size={14} />
          </div>

          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            NetPredict AI
          </span>
        </button>

        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontWeight: 500,
            padding: '2px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderRadius: 'var(--radius-full)',
          }}
        >
          SOC Platform
        </span>
      </div>

      {/* Center/Right: Network Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            backgroundColor: isCritical
              ? 'var(--status-critical-bg)'
              : isWarning
              ? 'var(--status-warning-bg)'
              : 'rgba(52, 199, 89, 0.12)',
            border: `1px solid ${
              isCritical
                ? 'var(--status-critical-border)'
                : isWarning
                ? 'var(--status-warning-border)'
                : 'rgba(52, 199, 89, 0.25)'
            }`,
            borderRadius: 'var(--radius-full)',
            fontSize: '11.5px',
            fontWeight: 600,
            color: isCritical
              ? 'var(--status-critical-text)'
              : isWarning
              ? 'var(--status-warning-text)'
              : 'var(--status-healthy-text)',
            transition: 'all 0.2s var(--ease-apple)',
          }}
        >
          <span
            className="pulse-live"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isCritical
                ? 'var(--status-critical-solid)'
                : isWarning
                ? 'var(--status-warning-solid)'
                : 'var(--status-healthy-solid)',
              display: 'inline-block',
            }}
          />
          <span>Network Status:</span>
          <span style={{ fontWeight: 700 }}>
            {isCritical ? 'Under Attack' : isWarning ? 'Threat Detected' : 'Protected'}
          </span>
        </div>
      </div>

      {/* Right Controls: Command Search, Demo Mode, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Command Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: '#ffffff',
            color: 'var(--text-muted)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
          }}
          title="Search or Jump to page (Cmd/Ctrl + K)"
        >
          <Search size={13} />
          <span>Search...</span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-subtle)',
              padding: '1px 5px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ⌘K
          </span>
        </button>

        {/* Demo Mode Toggle Button */}
        <button
          onClick={() => toggleDemoMode()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 11px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: isDemoMode ? 'var(--accent-primary)' : 'rgba(0, 0, 0, 0.08)',
            backgroundColor: isDemoMode ? 'var(--text-primary)' : '#ffffff',
            color: isDemoMode ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.18s var(--ease-apple)',
          }}
          title="Toggle Guided Demo Mode for Evaluation"
        >
          <Sparkles size={12} color={isDemoMode ? '#ffffff' : 'var(--accent-primary)'} />
          <span>{isDemoMode ? 'Demo Active' : 'Demo Mode'}</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="btn-icon"
          style={{
            position: 'relative',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
          }}
          title="View Notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-critical-solid)',
              }}
            />
          )}
        </button>

        {/* User Profile Avatar Dropdown */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 6px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#e5e5ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <ChevronDown size={11} color="var(--text-muted)" />
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
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {user?.role} • {user?.organization}
                </div>
              </div>

              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={() => {
                    setActiveNav('Settings');
                    setUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 10px',
                    fontSize: '12.5px',
                    color: 'var(--text-primary)',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Settings size={14} color="var(--text-muted)" />
                  <span>Preferences</span>
                </button>

                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 10px',
                    fontSize: '12.5px',
                    color: 'var(--status-critical-solid)',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--status-critical-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
