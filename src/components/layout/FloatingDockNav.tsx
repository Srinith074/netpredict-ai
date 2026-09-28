import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Radar,
  ShieldAlert,
  BellRing,
  FileText,
  Command,
} from 'lucide-react';
import { NavItem, useApp } from '../../context/AppContext';

interface FloatingDockNavProps {
  onOpenCommandPalette: () => void;
}

export const FloatingDockNav: React.FC<FloatingDockNavProps> = ({ onOpenCommandPalette }) => {
  const { activeNav, setActiveNav, alerts, forecastData } = useApp();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const openAlertsCount = alerts.filter((a) => a.status === 'open').length;

  const navItems: {
    label: string;
    navTarget: NavItem;
    icon: React.ReactNode;
    badge?: string | number;
    isCritical?: boolean;
  }[] = [
    {
      label: 'Overview',
      navTarget: 'Dashboard',
      icon: <LayoutDashboard size={17} />,
    },
    {
      label: 'Live Traffic',
      navTarget: 'Live Traffic',
      icon: <Activity size={17} />,
    },
    {
      label: 'Forecast',
      navTarget: 'Attack Forecast',
      icon: <Radar size={17} />,
      badge: forecastData.attackProbability >= 75 ? `${forecastData.attackProbability}%` : undefined,
      isCritical: true,
    },
    {
      label: 'Threats',
      navTarget: 'Threat Detection',
      icon: <ShieldAlert size={17} />,
    },
    {
      label: 'Alerts',
      navTarget: 'Alerts',
      icon: <BellRing size={17} />,
      badge: openAlertsCount > 0 ? openAlertsCount : undefined,
      isCritical: openAlertsCount > 0,
    },
    {
      label: 'Reports',
      navTarget: 'Reports',
      icon: <FileText size={17} />,
    },
  ];

  return (
    <nav
      className="floating-dock-container"
      role="navigation"
      aria-label="Primary Navigation"
    >
      {navItems.map((item) => {
        const isActive =
          activeNav === item.navTarget ||
          (item.label === 'Overview' && activeNav === 'Dashboard') ||
          (item.label === 'Threats' && activeNav === 'Threat Detection') ||
          (item.label === 'Forecast' && activeNav === 'Attack Forecast');

        const isHovered = hoveredItem === item.label;

        return (
          <button
            key={item.label}
            onClick={() => setActiveNav(item.navTarget)}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`dock-item ${isActive ? 'active' : ''}`}
            style={{
              padding: isActive || isHovered ? '7px 14px' : '7px 11px',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
            }}
            title={item.label}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {item.icon}
            </span>

            {/* Label with smooth reveal transition */}
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '-0.01em',
                maxWidth: isActive || isHovered ? '120px' : '0px',
                opacity: isActive || isHovered ? 1 : 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'max-width 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease',
              }}
            >
              {item.label}
            </span>

            {/* Notification / Critical threat badge */}
            {item.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '4px',
                  minWidth: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: item.isCritical ? 'var(--status-critical-solid)' : 'var(--accent-primary)',
                  boxShadow: '0 0 0 2px #ffffff',
                }}
              />
            )}
          </button>
        );
      })}

      {/* Thin subtle dock separator */}
      <div
        style={{
          width: '1px',
          height: '18px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          margin: '0 4px',
        }}
      />

      {/* Command Search quick trigger */}
      <button
        onClick={onOpenCommandPalette}
        onMouseEnter={() => setHoveredItem('Search')}
        onMouseLeave={() => setHoveredItem(null)}
        className="dock-item"
        style={{
          padding: hoveredItem === 'Search' ? '7px 12px' : '7px 10px',
          color: 'var(--text-muted)',
        }}
        title="Command Palette (Cmd+K / Ctrl+K)"
      >
        <Command size={15} />
        <span
          style={{
            fontSize: '12px',
            maxWidth: hoveredItem === 'Search' ? '60px' : '0px',
            opacity: hoveredItem === 'Search' ? 1 : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'max-width 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ⌘K
        </span>
      </button>
    </nav>
  );
};
