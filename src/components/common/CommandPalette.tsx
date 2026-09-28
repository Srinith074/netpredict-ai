import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
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
  X,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import { NavItem, useApp } from '../../context/AppContext';
import { DemoScenarioId } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Scenarios' | 'Threats';
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const {
    setActiveNav,
    threats,
    setSelectedThreat,
    startDemoScenario,
    toggleDemoMode,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown listener for Escape and Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Navigation Items
  const navCommands: CommandItem[] = useMemo(() => [
    {
      id: 'nav-dashboard',
      title: 'Dashboard Overview',
      category: 'Navigation',
      description: 'Network security overview, risk posture, and centerpiece forecast',
      icon: <LayoutDashboard size={16} />,
      action: () => {
        setActiveNav('Dashboard');
        onClose();
      },
    },
    {
      id: 'nav-traffic',
      title: 'Live Traffic',
      category: 'Navigation',
      description: 'Real-time packet capture stream and 24-feature telemetry',
      icon: <Activity size={16} />,
      action: () => {
        setActiveNav('Live Traffic');
        onClose();
      },
    },
    {
      id: 'nav-forecast',
      title: 'Attack Forecast',
      category: 'Navigation',
      description: 'Predictive threat trajectory (15m, 30m, 60m horizons)',
      icon: <Radar size={16} />,
      action: () => {
        setActiveNav('Attack Forecast');
        onClose();
      },
    },
    {
      id: 'nav-threats',
      title: 'Threat Detection',
      category: 'Navigation',
      description: 'Active flow anomalies and perimeter event logs',
      icon: <ShieldAlert size={16} />,
      action: () => {
        setActiveNav('Threat Detection');
        onClose();
      },
    },
    {
      id: 'nav-analysis',
      title: 'Traffic Analysis',
      category: 'Navigation',
      description: 'Deep feature correlation, top talkers, and anomaly timeline',
      icon: <BarChart3 size={16} />,
      action: () => {
        setActiveNav('Traffic Analysis');
        onClose();
      },
    },
    {
      id: 'nav-alerts',
      title: 'Security Alerts',
      category: 'Navigation',
      description: 'Prioritized incident triage and operator alert queue',
      icon: <BellRing size={16} />,
      action: () => {
        setActiveNav('Alerts');
        onClose();
      },
    },
    {
      id: 'nav-history',
      title: 'Attack History',
      category: 'Navigation',
      description: 'Post-incident forensic records and audit archives',
      icon: <History size={16} />,
      action: () => {
        setActiveNav('Attack History');
        onClose();
      },
    },
    {
      id: 'nav-model',
      title: 'AI Model Performance',
      category: 'Navigation',
      description: 'TFT + Bi-LSTM pipeline topology and SHAP feature importance',
      icon: <Cpu size={16} />,
      action: () => {
        setActiveNav('AI Model');
        onClose();
      },
    },
    {
      id: 'nav-reports',
      title: 'Executive Reports',
      category: 'Navigation',
      description: 'SOC audit assessments and compliance report generation',
      icon: <FileText size={16} />,
      action: () => {
        setActiveNav('Reports');
        onClose();
      },
    },
    {
      id: 'nav-settings',
      title: 'System Settings',
      category: 'Navigation',
      description: 'Python backend endpoints and sensor threshold configuration',
      icon: <Settings size={16} />,
      action: () => {
        setActiveNav('Settings');
        onClose();
      },
    },
  ], [setActiveNav, onClose]);

  // Demo Scenario Commands
  const scenarioCommands: CommandItem[] = useMemo(() => [
    {
      id: 'sc-normal',
      title: 'Run Scenario: Normal Network',
      category: 'Scenarios',
      description: 'Reset to clean diurnal traffic baseline',
      icon: <Sparkles size={16} color="var(--status-healthy-solid)" />,
      badge: 'STABLE',
      action: () => {
        toggleDemoMode(true);
        startDemoScenario('normal');
        onClose();
      },
    },
    {
      id: 'sc-portscan',
      title: 'Run Scenario: Port Scan Recon',
      category: 'Scenarios',
      description: 'Simulate horizontal probe across high port diversity',
      icon: <Sparkles size={16} color="var(--status-warning-solid)" />,
      badge: 'RECON',
      action: () => {
        toggleDemoMode(true);
        startDemoScenario('portscan');
        onClose();
      },
    },
    {
      id: 'sc-bruteforce',
      title: 'Run Scenario: SSH Brute Force',
      category: 'Scenarios',
      description: 'Simulate high authentication failure surge on Port 22',
      icon: <Sparkles size={16} color="var(--status-warning-solid)" />,
      badge: 'AUTH SPRAY',
      action: () => {
        toggleDemoMode(true);
        startDemoScenario('bruteforce');
        onClose();
      },
    },
    {
      id: 'sc-ddos',
      title: 'Run Scenario: Volumetric DDoS Attack',
      category: 'Scenarios',
      description: 'Surge packet rate and SYN flood with 82% forecast probability',
      icon: <Sparkles size={16} color="var(--status-critical-solid)" />,
      badge: 'CRITICAL',
      action: () => {
        toggleDemoMode(true);
        startDemoScenario('ddos');
        onClose();
      },
    },
  ], [toggleDemoMode, startDemoScenario, onClose]);

  // Live Threat Search Commands
  const threatCommands: CommandItem[] = useMemo(() => {
    return threats.slice(0, 5).map((t) => ({
      id: `threat-${t.id}`,
      title: `${t.threat} (${t.sourceIp})`,
      category: 'Threats' as const,
      description: `Target ${t.destinationIp}:${t.destinationPort} • Severity: ${t.severity}`,
      icon: <ShieldAlert size={16} color={t.severity === 'critical' ? 'var(--status-critical-solid)' : 'var(--status-warning-solid)'} />,
      badge: `${t.confidence}% CONF`,
      action: () => {
        setSelectedThreat(t);
        setActiveNav('Threat Detection');
        onClose();
      },
    }));
  }, [threats, setSelectedThreat, setActiveNav, onClose]);

  // All combined filtered items
  const filteredItems = useMemo(() => {
    const all = [...navCommands, ...scenarioCommands, ...threatCommands];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [navCommands, scenarioCommands, threatCommands, query]);

  // Key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.28)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '16px',
        paddingRight: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '600px',
          maxWidth: '100%',
          maxHeight: '75vh',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleUp 0.18s var(--ease-apple)',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, page, scenario, or IP address..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-primary)',
              backgroundColor: 'transparent',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 6px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No commands or assets matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.12s ease',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? '#ffffff' : 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      {item.description && (
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {item.badge && (
                      <span className="badge badge-neutral font-mono" style={{ fontSize: '10px' }}>
                        {item.badge}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft size={13} color="var(--accent-primary)" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', gap: '14px' }}>
            <span><strong style={{ color: 'var(--text-secondary)' }}>↑↓</strong> Navigate</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>↵</strong> Select</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>ESC</strong> Close</span>
          </div>

          <span className="font-mono" style={{ fontSize: '10.5px' }}>
            NetPredict Command Engine
          </span>
        </div>
      </div>
    </div>
  );
};
