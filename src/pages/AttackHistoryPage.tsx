import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Download,
  FileSpreadsheet,
  X,
  ShieldAlert,
  Calendar,
  Clock,
  Radio,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { HistoricalAttack } from '../types';

export const AttackHistoryPage: React.FC = () => {
  const { historicalAttacks, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [inspectedIncident, setInspectedIncident] = useState<HistoricalAttack | null>(null);

  const filteredHistory = useMemo(() => {
    return historicalAttacks.filter((item) => {
      if (selectedType !== 'ALL' && item.attackType !== selectedType) return false;
      if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m1 = item.attackType.toLowerCase().includes(q);
        const m2 = item.source.toLowerCase().includes(q);
        const m3 = item.targetAsset.toLowerCase().includes(q);
        const m4 = item.detectionMethod.toLowerCase().includes(q);
        const m5 = item.id.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3 && !m4 && !m5) return false;
      }
      return true;
    });
  }, [historicalAttacks, selectedType, selectedSeverity, searchQuery]);

  const handleExportCsv = () => {
    const headers = ['Incident ID', 'Date', 'Attack Type', 'Source', 'Target Asset', 'Duration', 'Severity', 'Confidence', 'Detection Method', 'Peak Volume', 'Status'];
    const rows = filteredHistory.map((h) => [
      h.id,
      `"${h.date}"`,
      h.attackType,
      `"${h.source}"`,
      `"${h.targetAsset}"`,
      h.duration,
      h.severity,
      `${h.confidence}%`,
      `"${h.detectionMethod}"`,
      `"${h.peakVolume}"`,
      h.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attack_history_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Historical Log Exported', `${filteredHistory.length} incident records exported to CSV.`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Attack History & Incident Archive
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Archived network attack incidents, post-incident forensic records, and model prediction verification logs.
          </p>
        </div>

        <button onClick={handleExportCsv} className="btn btn-secondary btn-sm">
          <Download size={13} />
          <span>Export Audit History (CSV)</span>
        </button>
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
              placeholder="Search historical incidents by ID, source, target, or method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-text"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Attack Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select-input"
              style={{ width: '130px' }}
            >
              <option value="ALL">All Types</option>
              <option value="DDoS">DDoS</option>
              <option value="Port Scan">Port Scan</option>
              <option value="Brute Force">Brute Force</option>
              <option value="Botnet">Botnet</option>
              <option value="Web Attack">Web Attack</option>
            </select>
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
            </select>
          </div>
        </div>

        {(selectedType !== 'ALL' || selectedSeverity !== 'ALL' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedType('ALL');
              setSelectedSeverity('ALL');
              setSearchQuery('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Historical Attacks Table */}
      <div className="soc-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="soc-table-container" style={{ border: 'none' }}>
          <table className="soc-table soc-table-clickable">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Incident ID</th>
                <th>Attack Type</th>
                <th>Threat Source</th>
                <th>Duration</th>
                <th>Severity</th>
                <th>Confidence</th>
                <th>Detection Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '40px 24px' }}>
                    <div className="soc-empty-state">
                      <div className="soc-empty-state-icon">
                        <History size={28} />
                      </div>
                      <div className="soc-empty-state-title">
                        No Incident Archive Records Found
                      </div>
                      <div className="soc-empty-state-desc">
                        No archived attack events match the current filter query ({selectedType}, {selectedSeverity}).
                      </div>
                      <button
                        onClick={() => {
                          setSelectedType('ALL');
                          setSelectedSeverity('ALL');
                          setSearchQuery('');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '8px' }}
                      >
                        Reset Archive Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setInspectedIncident(item)}
                    title="Click to view detailed incident post-mortem record"
                  >
                    <td className="font-mono" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {item.date}
                    </td>
                    <td className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '12px' }}>
                      {item.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {item.attackType}
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.source}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {item.targetAsset}</div>
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px' }}>
                      {item.duration}
                    </td>
                    <td>
                      <StatusBadge value={item.severity} />
                    </td>
                    <td className="font-mono" style={{ fontWeight: 700 }}>
                      {item.confidence}%
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {item.detectionMethod}
                    </td>
                    <td>
                      <span className="badge badge-safe">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Post-Mortem Audit Modal */}
      {inspectedIncident && (
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
          onClick={() => setInspectedIncident(null)}
        >
          <div
            style={{
              width: '560px',
              maxWidth: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    {inspectedIncident.id}
                  </span>
                  <StatusBadge value={inspectedIncident.severity} />
                  <span className="badge badge-safe">{inspectedIncident.status}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {inspectedIncident.attackType} Attack Archive
                </h3>
              </div>
              <button onClick={() => setInspectedIncident(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', backgroundColor: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Incident Date & Time</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">
                  {inspectedIncident.date}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Attack Duration</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">
                  {inspectedIncident.duration}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Threat Source</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {inspectedIncident.source}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Targeted Infrastructure</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {inspectedIncident.targetAsset}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Incident Forensic Summary
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, backgroundColor: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                {inspectedIncident.incidentSummary}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <span>Detection: <strong>{inspectedIncident.detectionMethod}</strong></span>
              <button onClick={() => setInspectedIncident(null)} className="btn btn-secondary btn-sm">
                Close Archive Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
