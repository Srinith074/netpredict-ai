import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Radar,
  ShieldAlert,
  BarChart3,
  BellRing,
  History,
  Cpu,
  FileText,
  Settings,
  Shield,
  FlaskConical,
} from 'lucide-react';
import { NavItem, useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeNav, setActiveNav, alerts, forecastData } = useApp();

  const openAlertsCount = alerts.filter((a) => a.status === 'open').length;

  const navItems: { label: NavItem; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Live Traffic', icon: <Activity size={18} /> },
    {
      label: 'Attack Forecast',
      icon: <Radar size={18} />,
      badge: forecastData.attackProbability >= 75 ? `${forecastData.attackProbability}%` : undefined,
      badgeColor: 'badge-critical',
    },
    { label: 'Threat Detection', icon: <ShieldAlert size={18} /> },
    { label: 'Traffic Analysis', icon: <BarChart3 size={18} /> },
    {
      label: 'Alerts',
      icon: <BellRing size={18} />,
      badge: openAlertsCount > 0 ? openAlertsCount : undefined,
      badgeColor: 'badge-critical',
    },
    { label: 'Attack History', icon: <History size={18} /> },
    { label: 'AI Model', icon: <Cpu size={18} /> },
    { label: 'Reports', icon: <FileText size={18} /> },
    { label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '18px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary-subtle)',
            border: '1px solid var(--accent-primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
          }}
        >
          <Shield size={19} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            NetPredict AI
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Attack Forecasting SOC
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '6px 10px', letterSpacing: '0.04em' }}>
          Operations Center
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.label;

            return (
              <li key={item.label}>
                <button
                  onClick={() => setActiveNav(item.label)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--accent-primary-border)' : 'transparent',
                    backgroundColor: isActive ? 'var(--accent-primary-subtle)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`badge ${item.badgeColor || 'badge-neutral'}`}
                      style={{ fontSize: '10px', padding: '1px 5px' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* SIH 2026 Project Info & Environment indicator */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <FlaskConical size={13} color="var(--accent-primary)" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
            SIH 2026 PROTOTYPE
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Calibrated on CICIDS2017 & TON-IoT benchmarks.
        </div>
      </div>
    </aside>
  );
};
