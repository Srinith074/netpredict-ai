import React, { useState, useMemo } from 'react';
import {
  BellRing,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCheck,
  ExternalLink,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SecurityAlert } from '../types';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, setActiveNav, setSelectedThreat, threats, addToast } = useApp();
  
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolve dialog modal state
  const [resolvingAlert, setResolvingAlert] = useState<SecurityAlert | null>(null);
  const [resolutionNote, setResolutionNote] = useState('Mitigated via perimeter firewall rule and monitored.');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity.toLowerCase()) return false;
      if (selectedStatus !== 'ALL' && a.status !== selectedStatus.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m1 = a.title.toLowerCase().includes(q);
        const m2 = a.source.toLowerCase().includes(q);
        const m3 = a.attackType.toLowerCase().includes(q);
        const m4 = a.id.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3 && !m4) return false;
      }
      return true;
    });
  }, [alerts, selectedSeverity, selectedStatus, searchQuery]);

  const counts = useMemo(() => {
    return {
      total: alerts.length,
      open: alerts.filter((a) => a.status === 'open').length,
      inProgress: alerts.filter((a) => a.status === 'in_progress').length,
      resolved: alerts.filter((a) => a.status === 'resolved').length,
      critical: alerts.filter((a) => a.severity === 'critical').length,
      high: alerts.filter((a) => a.severity === 'high').length,
      medium: alerts.filter((a) => a.severity === 'medium').length,
      low: alerts.filter((a) => a.severity === 'low').length,
    };
  }, [alerts]);

  const handleInvestigate = (alert: SecurityAlert) => {
    // Find matching threat if available
    const matchingThreat = threats.find((t) => t.category === alert.attackType || alert.source.includes(t.sourceIp));
    if (matchingThreat) {
      setSelectedThreat(matchingThreat);
    }
    setActiveNav('Threat Detection');
  };

  const handleBulkAcknowledge = () => {
    const openAlerts = alerts.filter((a) => a.status === 'open');
    openAlerts.forEach((a) => acknowledgeAlert(a.id));
    addToast('Bulk Update', `Acknowledged ${openAlerts.length} open alerts.`, 'info');
  };

  const submitResolve = () => {
    if (resolvingAlert) {
      resolveAlert(resolvingAlert.id, resolutionNote);
      setResolvingAlert(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Security Alert Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Prioritized queue of active and forecasted security incidents requiring operator action.
          </p>
        </div>

        <button onClick={handleBulkAcknowledge} className="btn btn-secondary btn-sm">
          <CheckCheck size={14} />
          <span>Acknowledge All Open Alerts</span>
        </button>
      </div>

      {/* Severity & Status Counts Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        <div className="soc-card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Critical Alerts</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-critical-solid)', marginTop: '2px' }} className="num-tabular">
            {counts.critical}
          </div>
        </div>

        <div className="soc-card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High Alerts</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#dc2626', marginTop: '2px' }} className="num-tabular">
            {counts.high}
          </div>
        </div>

        <div className="soc-card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Medium Alerts</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-warning-solid)', marginTop: '2px' }} className="num-tabular">
            {counts.medium}
          </div>
        </div>

        <div className="soc-card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Low Alerts</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }} className="num-tabular">
            {counts.low}
          </div>
        </div>

        <div className="soc-card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Open Queue</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="num-tabular">
            {counts.open}
          </div>
        </div>

        <div className="soc-card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Resolved</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-healthy-solid)', marginTop: '2px' }} className="num-tabular">
            {counts.resolved}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="soc-card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <span style={{ position: 'absolute', left: '10px', top: '8px', color: 'var(--text-muted)' }}>
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search alerts by title, source, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-text"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="select-input"
              style={{ width: '110px' }}
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select-input"
              style={{ width: '120px' }}
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {(selectedSeverity !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedSeverity('ALL');
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Alerts List Table */}
      <div className="soc-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="soc-table-container" style={{ border: 'none' }}>
          <table className="soc-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Timestamp</th>
                <th>Alert Title</th>
                <th>Threat Source</th>
                <th>Attack Type</th>
                <th>Confidence</th>
                <th>Severity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '40px 24px' }}>
                    <div className="soc-empty-state">
                      <div className="soc-empty-state-icon">
                        <CheckCircle2 size={28} color="var(--status-healthy-solid)" />
                      </div>
                      <div className="soc-empty-state-title">
                        No Active Alerts in Current Queue
                      </div>
                      <div className="soc-empty-state-desc">
                        All incidents matching Severity: {selectedSeverity} and Status: {selectedStatus} have been triaged or mitigated.
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSeverity('ALL');
                          setSelectedStatus('ALL');
                          setSearchQuery('');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '8px' }}
                      >
                        Reset Alert Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '12px' }}>
                      {alert.id}
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {alert.timestamp}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {alert.title}
                      </div>
                      {alert.assignee && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Assignee: {alert.assignee}
                        </div>
                      )}
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px' }}>
                      {alert.source}
                    </td>
                    <td>
                      <span className="badge badge-neutral">{alert.attackType}</span>
                    </td>
                    <td className="font-mono" style={{ fontWeight: 700 }}>
                      {alert.confidence}%
                    </td>
                    <td>
                      <StatusBadge value={alert.severity} />
                    </td>
                    <td>
                      <StatusBadge value={alert.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {alert.status === 'open' && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="btn btn-secondary btn-sm"
                            title="Acknowledge alert and mark In Progress"
                          >
                            <span>Acknowledge</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleInvestigate(alert)}
                          className="btn btn-secondary btn-sm"
                          title="Investigate in Threat Detection"
                        >
                          <ExternalLink size={12} />
                          <span>Investigate</span>
                        </button>
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => setResolvingAlert(alert)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--status-healthy-text)' }}
                            title="Resolve alert"
                          >
                            <CheckCircle2 size={12} />
                            <span>Resolve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolve Dialog Modal */}
      {resolvingAlert && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setResolvingAlert(null)}
        >
          <div
            style={{
              width: '460px',
              maxWidth: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '22px',
              border: '1px solid var(--border-subtle)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--status-healthy-solid)" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                  Resolve Alert {resolvingAlert.id}
                </h3>
              </div>
              <button onClick={() => setResolvingAlert(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {resolvingAlert.title}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Resolution Notes / Operator Action Taken
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="input-text"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setResolvingAlert(null)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button onClick={submitResolve} className="btn btn-primary btn-sm">
                Confirm & Resolve Alert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
