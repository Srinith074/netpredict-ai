import React from 'react';
import { Severity, ThreatStatus, AlertStatus, SystemStatus } from '../../types';

interface StatusBadgeProps {
  type?: 'severity' | 'status' | 'alert' | 'system';
  value: Severity | ThreatStatus | AlertStatus | SystemStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ value, size = 'sm' }) => {
  const normalized = String(value).toLowerCase();

  let badgeClass = 'badge-neutral';
  let label = String(value);

  // Severity
  if (normalized === 'critical') {
    badgeClass = 'badge-critical';
    label = 'Critical';
  } else if (normalized === 'high') {
    badgeClass = 'badge-high';
    label = 'High';
  } else if (normalized === 'medium' || normalized === 'warning') {
    badgeClass = 'badge-medium';
    label = 'Medium';
  } else if (normalized === 'low') {
    badgeClass = 'badge-low';
    label = 'Low';
  } else if (normalized === 'safe' || normalized === 'healthy' || normalized === 'normal') {
    badgeClass = 'badge-safe';
    label = normalized === 'healthy' ? 'Healthy' : normalized === 'safe' ? 'Safe' : 'Normal';
  }
  // Threat Status
  else if (normalized === 'blocked') {
    badgeClass = 'badge-critical';
    label = 'Blocked';
  } else if (normalized === 'investigating') {
    badgeClass = 'badge-warning';
    label = 'Investigating';
  } else if (normalized === 'flagged') {
    badgeClass = 'badge-warning';
    label = 'Flagged';
  } else if (normalized === 'mitigated') {
    badgeClass = 'badge-safe';
    label = 'Mitigated';
  }
  // Alert Status
  else if (normalized === 'open') {
    badgeClass = 'badge-critical';
    label = 'Open';
  } else if (normalized === 'in_progress') {
    badgeClass = 'badge-warning';
    label = 'In Progress';
  } else if (normalized === 'resolved') {
    badgeClass = 'badge-safe';
    label = 'Resolved';
  } else if (normalized === 'degraded') {
    badgeClass = 'badge-critical';
    label = 'Degraded';
  }

  return (
    <span className={`badge ${badgeClass} ${size === 'md' ? 'badge-md' : ''}`} style={size === 'md' ? { padding: '4px 9px', fontSize: '12px' } : undefined}>
      <span className="badge-dot" />
      {label}
    </span>
  );
};
